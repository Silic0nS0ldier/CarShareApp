console.log("************************" + "\n" +
            "* CarShareApp Migrator *" + "\n" +
            "************************");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Wrap everything in an async function to allow await to bring order to chaos
async function Main() {
    const DB = require("../src/index");
    const FS = require("fs");

    // Give MySQL a chance to sort out its problems.
    console.log("Waiting 6 seconds to ensure MySQL ready...");
    await sleep(6000);

    if (!await DB.Knex.schema.hasTable("migrations")) {
        console.log("Table 'migrations' does not exist and will be created.");
        
        // Attempt to create table within transaction
        let start = new Date().getMilliseconds();
        await DB.Knex.transaction(async trx => {
            await trx.schema.createTable("migrations", table => {
                table.comment("Logs migrations, by migrator.");
                table.integer("version")
                    .unsigned()
                    .notNullable()
                    .unique()
                    .comment("Migration version.");
                table.timestamp("completed_at")
                    .defaultTo(trx.fn.now())
                    .notNullable()
                    .unique()
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
                duration: new Date().getMilliseconds() - start,
                comment: "Creation of this migrations table."
            });
        });
    }

    // Determine what migrations, if any, need to be performed.

    console.log("Looking for updates...");

    // Get last migration version.
    let version = (await DB.Knex("migrations").orderBy("completed_at", "desc").first("*")).version;
    console.log("version: " + version);

    let migrations = 0;

    for (version++; FS.existsSync(`./migrations/${version}.js`); version++) {
        console.log(`Applying migration "./migrations/${version}.js"...`);
        await DB.Knex.transaction(async trx => {
            let start = new Date().getMilliseconds();
            let comment = await require(`./${version}.js`)(trx);

            // Prevent quirks.
            let dur = new Date().getMilliseconds() - start;
            if (dur < 0) dur = 0;

            await trx("migrations").insert({
                version: version,
                duration: dur,
                comment: comment
            });
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

Main();
