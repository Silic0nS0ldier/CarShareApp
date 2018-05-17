import Knex from "knex";
/**
 * @param {Knex.Transaction} trx 
 */
export default async function Run(trx) {
    // Drop license_image column from users table
    await trx.schema.raw("ALTER TABLE users DROP FOREIGN KEY users_license_image_foreign");
    await trx.schema.alterTable("users", table => {
        table.dropColumn("license_image");
    });

    // num + data_hash should be a unique conbination in images table
    // num should also not be nullable
    // Change data to a larger type in images table
    await trx.schema.alterTable("images", table => {
        table.integer("num")
            .alter()
            .unsigned()
            .notNullable()
            .defaultTo(0)
            .comment("Used to uniquely identify images when the data_hash of 2 unique images collide.");
        table.renameColumn("data_hash", "integrity")
            .comment("Hash of file data, used to assist in duplicate detection.");
    });
    await trx.schema.alterTable("images", table => {
        table.unique(["num", "integrity"]);
    });
    await trx.schema.raw("ALTER TABLE `images` CHANGE `data` `data` LONGBLOB NULL COMMENT 'File data as binary.'");

    // Add credit_approved field to users
    await trx.schema.alterTable("users", table => {
        table.boolean("credit_approved")
            .notNullable()
            .defaultTo(false)
            .comment("Users credit assessment outcome.");
    })

    return "Dropped 'license_image' column from table 'users'. \
    Renamed 'data_hash' to 'integriy', added unique constaint, and increased maximum size of 'data' column in 'images' table.\
    Added 'credit_approved' field to 'users' table.";
}
