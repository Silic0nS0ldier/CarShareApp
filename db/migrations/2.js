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

    // Sessions table
    await trx.schema.createTable("sessions", table => {
        table.comment("Stores user sessions.");
        table.string("id")
            .primary()
            .comment("Unique session identifier.");
        table.integer("user_id")
            .unsigned()
            .notNullable()
            .references("users.id")
            .comment("User account associated with session.");
        table.string("ip_address")
            .notNullable()
            .comment("IP address of session.");
        table.dateTime("end_date")
            .notNullable()
            .comment("Date session terminates.")
    });

    return "Updated 'logs' and 'listing_changes' table with a primary key on 'id'. Created table 'sessions'.";
}

export default Run;
