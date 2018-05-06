const Knex = require("knex");
/**
 * @param {Knex.Transaction} trx 
 */
async function Run(trx) {
    // System logs table
    await trx.schema.createTable("logs", table => {
        table.comment("System logs.");
        table.string("category")
            .notNullable()
            .comment("Entry category.");
        table.integer("severity")
            .notNullable()
            .comment("Entry severity. 0 = Informational; 1 = Warning; 2 = Error;");
        table.string("message")
            .notNullable()
            .comment("Entry message.");
        table.timestamp("logged_at")
            .defaultTo(trx.fn.now())
            .comment("Entry timestamp.");
    });

    // Images table
    await trx.schema.createTable("images", table => {
        table.comment("Stores site images.");
        table.increments()
            .comment("Unique identifier for image, used for internal purposes.");
        table.integer("num")
            .unsigned()
            .comment("Used to uniquely identify images when the data_hash of 2 unique images collide.");
        table.string("extension")
            .notNullable()
            .comment("Image file extension.");
        table.integer("size_bytes")
            .notNullable();
        table.timestamp("first_uploaded_at")
            .defaultTo(trx.fn.now())
            .notNullable()
            .comment("When file was first uploaded to the database.");
        table.binary("data")
            .comment("File data as binary.");
        table.string("data_hash")
            .notNullable()
            .comment("Hash of file data, used to assist in duplicate detection.");
        table.primary(["id", "data_hash", "extension"]);
    });

    // Images dependency table
    // If we had more time, this would be a table used to track where an image is being used, thus enabling clean up operations later for images that are unused.
    // This would work in addition to the duplicate detection logic.

    return "'logs' and 'images' tables created."
}

module.exports = Run;