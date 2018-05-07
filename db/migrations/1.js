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
            .unsigned()
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
        table.unique(["id", "data_hash", "extension"]);
    });

    // Images dependency table
    // If we had more time, this would be a table used to track where an image is being used, thus enabling clean up operations later for images that are unused.
    // This would work in addition to the duplicate detection logic.
    // In the meantime, accidental deletions are prevented via consistency contraints in the database.

    // Users table
    await trx.schema.createTable("users", table => {
        table.comment("Contains user account data.");
        table.increments("id")
            .unsigned()
            .comment("Used by system to efficiently retrieve user data.");
        table.string("fname")
            .notNullable()
            .comment("Users first name.");
        table.string("mnames")
            .comment("Users middle name(s). Optional.")
        table.string("lname")
            .notNullable()
            .comment("Users last name.");
        table.string("email")
            .notNullable()
            .comment("Users email address.");
        table.boolean("email_verified")
            .defaultTo(false)
            .notNullable()
            .comment("Verification status of users email.");
        table.string("password")
            .notNullable()
            .comment("Users hashed password with Argon2.");
        table.boolean("disabled")
            .defaultTo(false)
            .notNullable()
            .comment("If the account disabled.");
        table.integer("user_image")
            .unsigned()
            .notNullable()
            .references("images.id")
            .comment("ID of users image.");
        table.integer("license_image")
            .unsigned()
            .notNullable()
            .references("images.id")
            .comment("ID of users license image.");
    });

    // Roles table
    await trx.schema.createTable("roles", table => {
        table.comment("Defines roles a user can have. Roles control access.")
        table.increments("id")
            .unsigned()
            .comment("Unqiue identifier for role.");
        table.string("name")
            .notNullable()
            .comment("A user friendly name for the role.");
    });

    // Seed roles
    await trx("roles").insert([
        {
            name: "Staff"
        }
    ]);

    // User-Role link table
    await trx.schema.createTable("users_roles", table => {
        table.comment("Establishes association between users and roles.");
        table.integer("user_id")
            .unsigned()
            .notNullable()
            .references("users.id")
            .comment("Reference to user.");
        table.integer("role_id")
            .unsigned()
            .notNullable()
            .references("roles.id")
            .comment("Reference to role.");
        table.primary(["user_id", "role_id"]);
    });

    // Vehicle listing table
    await trx.schema.createTable("listings", table => {
        table.comment("Contains listing data.");
        table.string("VIN")
            .notNullable()
            .primary()
            .comment("Vehicle Identification Number");
        table.dateTime("created_at")
            .notNullable()
            .defaultTo(trx.fn.now())
            .comment("Date listing created. Change dates tracked in changes table.");
        table.integer("owner_user_id")
            .unsigned()
            .notNullable()
            .references("users.id")
            .comment("Reference to owner.");
        table.string("summary")
            .comment("Description summary. Optional.");
        table.text("description")
            .notNullable()
            .comment("Description of listed vehicle.");
        table.integer("image_front")
            .unsigned()
            .notNullable()
            .references("images.id")
            .comment("Reference to image of vehicle front.");
        table.integer("image_back")
            .unsigned()
            .notNullable()
            .references("images.id")
            .comment("Reference to image of vehicle back.");
        table.integer("image_left")
            .unsigned()
            .notNullable()
            .references("images.id")
            .comment("Reference to image of vehicle left.");
        table.integer("image_right")
            .unsigned()
            .notNullable()
            .references("images.id")
            .comment("Reference to image of vehicle right.");
        table.integer("odometer")
            .unsigned()
            .notNullable()
            .comment("Odometer value in thousands.");
        table.date("odometer_last_update")
            .notNullable()
            .defaultTo(trx.fn.now())
            .comment("Date odometer value was last changed.");
        table.string("brand")
            .comment("Vehicle brand. NULL indicates custom.");
        table.string("model")
            .comment("Vehicle model. May be NULL if custom.");
        table.string("type")
            .notNullable()
            .comment("Vehicle type, e.g. Sedan.");
        table.string("year")
            .notNullable()
            .comment("Model year. Year of completion for custom.");
        table.boolean("ac")
            .notNullable()
            .comment("Whether or not vehicle has air conditioning.");
        table.integer("seat_min")
            .unsigned()
            .comment("Minimum vehicle can seat subject to configuration.");
        table.integer("seat_max")
            .unsigned()
            .comment("Maximum vehicle can seat subject to configuration.");
        table.json("misc_json")
            .comment("Miscellaneous details. Optional");
    });

    // Listing changes
    await trx.schema.createTable("listing_changes", table => {
        table.comment("Documents modifications to listings");
        table.string("VIN")
            .notNullable()
            .references("listings.VIN")
            .comment("Reference to listing via VIN.");
        table.dateTime("occured_at")
            .defaultTo(trx.fn.now())
            .notNullable()
            .comment("Date change occured.");
        table.json("modified_data")
            .notNullable()
            .comment("Removed or modified listing data.");
    });


    return "'logs', 'images', 'users', 'roles', 'users_roles', and 'listings' tables created.";
}

module.exports = Run;
