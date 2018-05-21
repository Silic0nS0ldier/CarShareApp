import Knex from "knex";
/**
 * @param {Knex.Transaction} trx 
 */
export default async function Run(trx) {

    // Bookings table
    await trx.schema.createTable("bookings", table => {
        table.increments();//id
        table.string("VIN")
            .notNullable()
            .references("listings.VIN");
        table.timestamp("booked_at")
            .defaultTo(trx.fn.now())
            .notNullable();
        table.integer("provider_id")
            .unsigned()
            .notNullable()
            .references("users.id");
        table.integer("customer_id")
            .unsigned()
            .notNullable()
            .references("users.id");
        table.dateTime("commences_at")
            .notNullable();
        table.dateTime("ends_at")
            .notNullable();
        table.integer("fee")
            .notNullable();
        table.boolean("cancelled")
            .defaultTo(false)
            .notNullable();
        table.json("history");
    });

    // Messages table
    await trx.schema.createTable("messages", table => {
        table.increments();//id
        table.integer("booking_id")
            .unsigned()
            .notNullable()
            .references("bookings.id");
        table.integer("sender_id")
            .unsigned()
            .notNullable()
            .references("users.id");
        table.text("message")
            .notNullable();
        table.timestamp("sent_at")
            .defaultTo(trx.fn.now())
            .notNullable();
    });

    // Ratings
    await trx.schema.createTable("ratings", table => {
        table.integer("booking_id")
            .unsigned()
            .notNullable()
            .references("bookings.id");
        table.integer("user_id")
            .unsigned()
            .references("users.id");
        table.string("subject")//provider, vehicle, customer, etc.
            .notNullable();
        table.boolean("recommend");//true=yes,null=neither,false=no
        table.text("comment");
    });

    // Add 'unlisted' boolean to listings
    await trx.schema.alterTable("listings", table => {
        table.boolean("unlisted")
            .defaultTo(false)
            .notNullable();
    });
    
    return "'bookings', 'messages', and 'ratings' tables.";
}
