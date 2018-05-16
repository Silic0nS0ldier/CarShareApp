/**
 * @param {Knex.Transaction} trx 
 */
export default async function Run(trx) {
    // Update logs table with primary key
    await trx.schema.alterTable("logs", table => {
        table.increments()
            .comment("Unique identifier used for internal purposes.");
    });

    // Update listing_changes table with primary key
    await trx.schema.alterTable("listing_changes", table => {
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

    // Email verifications table
    await trx.schema.createTable("email_verifications", table => {
        table.comment("Stores email verification and change requests");
        table.string("code")
            .notNullable();
        table.dateTime("expires")
            .notNullable();
        table.integer("user_id")
            .unsigned()
            .notNullable()
            .references("users.id")
            .primary();
        table.string("new_email")
            .unique();
    });

    // Add fuel_type field to listings
    trx.schema.alterTable("listings", table => {
        table.string("fuel_type")
            .notNullable()
            .comment("Fuel type of vehicle.");
    });

    return "Updated 'logs' and 'listing_changes' table with a primary key on 'id'. \
Created tables 'sessions' and 'email_verifications'. \
Updated 'listings' table with a 'fuel_type' column.";
}
