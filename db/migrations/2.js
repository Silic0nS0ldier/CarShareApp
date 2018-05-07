import Knex from "knex";
/**
 * @param {Knex.Transaction} trx 
 */
async function Run(trx) {
    // Update logs table with primary key
    await trx.schema.table("logs", table => {
        table.increments()
            .comment("Unique identifier used for internal purposes.");
    });

    // Update listing_changes table with primary key
    await trx.schema.table("listing_changes", table => {
        table.increments()
            .comment("Unique identifier used for internal purposes.");
    });

    return "Updated 'logs' and 'listing_changes' table with a primary key on 'id'.";
}

export default Run;
