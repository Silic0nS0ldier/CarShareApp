import DB from "../src/index";
import { existsSync, readFileSync } from "fs";
import { performance } from "perf_hooks";
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
        default:
            throw new Error("Environment variable SCENARIO must be set to production, staging or development.");
    }
})();

console.log("************************" + "\n" +
            "* CarShareApp Migrator *" + "\n" +
            "************************");

// Wrap everything in an async function to allow await to bring order to chaos
async function Main() {
    // Import Knex
    const { Knex } = DB(config);

    if (!await Knex.schema.hasTable("migrations")) {
        console.log("Table 'migrations' does not exist and will be created.");
        
        // Attempt to create table within transaction
        await Knex.transaction(async trx => {
            try {
                performance.mark("ims");
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
                performance.mark("ime");

                performance.measure("im", "ims", "ime");

                await trx("migrations").insert({
                    version: 0,
                    duration: performance.getEntriesByName("im")[0].duration,
                    comment: "Creation of this migrations table."
                });

                performance.clearMarks()
                performance.clearMeasures();

                console.log("Ready to migrate.");
            } catch (error) {
                console.log("Creation of 'migrations' table failed. Database is in an unknown state.");
                throw error;
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
                performance.mark("ms");
                let comment = await require(`./${version}.js`)(trx);

                // Prepare times
                performance.mark("me");
                performance.measure("m", "ms", "me");

                await trx("migrations").insert({
                    version: version,
                    duration: performance.getEntriesByName("m")[0].duration,
                    comment: comment
                });

                performance.clearMarks();
                performance.clearMeasures();

                console.log("Migration succeeded!");
            } catch (error) {
                console.log("Migration failed! Database is in an unknown state.");
                throw error;
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
}

try {
    Main().catch(err => {
        throw err;
    });
} catch (err) {
    throw err;
}
