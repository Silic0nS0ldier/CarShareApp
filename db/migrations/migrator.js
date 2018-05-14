import DB from "../src/index";
import { existsSync, readFileSync } from "fs";
import objectMerge from "object-merge";

// Load configuration
const config = (() => {
    const rawConfig = JSON.parse(readFileSync("../config/config.json", "utf8"));
    switch (process.env.SCENARIO) {
        case "production":
            return rawConfig.production;
        case "staging":
            return objectMerge(rawConfig.production, rawConfig.staging);
        case "development":
            return objectMerge(rawConfig.production, rawConfig.staging, rawConfig.development);
        default: {
            if (process.env.DOCKER == true) throw new Error("Environment variable SCENARIO must be set to production, staging or development.");
            else {
                console.log("Assuming local non-docker development environment.");
                return objectMerge(rawConfig.production, rawConfig.staging, rawConfig.development);
            }
        }
    }
})();

console.log("************************" + "\n" +
    "* CarShareApp Migrator *" + "\n" +
    "************************");

// Wrap everything in an async function to allow await to bring order to chaos
async function Main() {
    // Import Knex
    const { Knex } = await DB(config);

    if (!await Knex.schema.hasTable("migrations")) {
        console.log("Table 'migrations' does not exist and will be created.");

        // Attempt to create table within transaction
        await Knex.transaction(async trx => {
            try {
                await trx.schema.createTable("migrations", table => {
                    table.comment("Logs migrations, by migrator.");
                    table.increments()
                        .unsigned()
                        .primary()
                        .comment("Used to get last migration.");
                    table.integer("version")
                        .unsigned()
                        .notNullable()
                        .unique()
                        .comment("Migration version.");
                    table.timestamp("completed_at")
                        .defaultTo(trx.fn.now())
                        .notNullable()
                        .comment("Time migration was completed.");
                    table.bigInteger("duration")
                        .unsigned()
                        .notNullable()
                        .comment("Time migration took to complete in milliseconds.");
                    table.string("comment")
                        .comment("Optional migration comment.");
                });

                await trx("migrations").insert({
                    version: 0,
                    duration: 0,
                    comment: "Creation of this migrations table."
                });

                console.log("Ready to migrate.");
            } catch (error) {
                console.log("Creation of 'migrations' table failed. Database is in an unknown state.");
                console.log(error);
                process.exit();
            }
        });
    }

    // Determine what migrations, if any, need to be performed.

    console.log("Looking for updates...");

    // Get last migration version.
    let version = (await Knex("migrations").orderBy("id", "desc").first("*")).version;
    console.log("version: " + version);

    let migrations = 0;

    for (version++; existsSync(`./migrations/${version}.js`); version++) {
        console.log(`Applying migration "./migrations/${version}.js"...`);
        await Knex.transaction(async trx => {
            try {
                let comment = await (await import(`./${version}.js`)).default(trx);

                await trx("migrations").insert({
                    version: version,
                    duration: 0,
                    comment: comment
                });

                console.log("Migration succeeded!");
            } catch (error) {
                console.log("Migration failed! Database is in an unknown state.");
                console.log(error);
                process.exit(1);
            }
        });
        migrations++;
    }

    if (migrations === 0) {
        console.log("Already up to date!");
    }
    else {
        console.log(`${migrations} migration(s) performed successfully!`);
    }
    Knex.destroy(() => {
        process.exit(0);
    });
}


Main();
