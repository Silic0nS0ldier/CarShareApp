import Knex from "knex";
/**
 * @param {Knex.Transaction} trx 
 */
export default async function Run(trx) {
    let makeVIN = () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        for (var i = 0; i < 9; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text; 
    }

    let ranNum = (num) => {
        return Math.floor(Math.random()*(1+num));
    }

    let ranYear = () => {
        var year = null;
        var yearCheck = true;
        while(yearCheck) {
            year = Math.floor(Math.random()*10000);
            if(year >= 1970 && year <= 2018) {
                yearCheck = false;
            }
        }
        return year;
    }

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
    });

    await trx("images").insert({
        num: 0,
        extension: "png",
        size_bytes: 487,
        data: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABmUlEQVR42u3TAQ0AAAzCMPybBgU38LQSliwFTpEADAIGAYOAQcAgYBAwCBgEDAIYBAwCBgGDgEHAIGAQMAgYBAwCGAQMAgYBg4BBwCBgEDAIGAQwCBgEDAIGAYOAQcAgYBAwCBgEMAgYBAwCBgGDgEHAIGAQMAhgEDAIGAQMAgYBg4BBwCBgEDAIYBAwCBgEDAIGAYOAQcAgYBDAIGAQMAgYBAwCBgGDgEHAIGAQwCBgEDAIGAQMAgYBg4BBwCBgEAnAIGAQMAgYBAwCBgGDgEHAIIBBwCBgEDAIGAQMAgYBg4BBwCCAQcAgYBAwCBgEDAIGAYOAQQCDgEHAIGAQMAgYBAwCBgGDgEEAg4BBwCBgEDAIGAQMAgYBgwAGAYOAQcAgYBAwCBgEDAIGAYMABgGDgEHAIGAQMAgYBAwCBgEMAgYBg4BBwCBgEDAIGAQMAgYBDAIGAYOAQcAgYBAwCBgEDAIGkQAMAgYBg4BBwCBgEDAIGAQMAhgEDAIGAYOAQcAgYBAwCBgEDAIYBAwCBgGDgEHAIGAQ+GgODrNzIejOmAAAAABJRU5ErkJggg==", "base64"),
        integrity: "sha512-8wkNOxZFmBUSi4i71sEOziVy/R8i4RzIY8SmA7wNxEnL2pLl+3JQRdi0VeyeE+uaC4ft4+bA4ovkCw2+91Zung=="
    });

    await trx("users").insert({
        fname: "Admin",
        lname: "Ivoski",
        email: "admin@norris.codes",
        email_verified: 1,
        password: "Password",
        disabled: 0,
        user_image: 1,
        credit_approved: 1
    });


    let seeder = trx("listings");
    let brands = ["Suzuki", "Peugeot", "Citroen", "Toyota", "Jeep", "Holden", "Ford", "Fiat", "Honda", "Volkswagen"];
    let models = ["Rav4", "Prado", "Landcruiser", "Commodore", "Tucson", "Barina", "Costa", "Comet", "Wrangler", "Mondeo"];
    let types = ["Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Convertible", "Wagon", "Van", "Jeep", "Shrug"];
    for (let i = 0;  i < 400; i++) {
        await seeder.insert({
            VIN: makeVIN(),
            // created_at: (new Date()).getTime().toISOString().slice(0, 19).replace('T', ' '),
            owner_user_id: 1,
            summary: "None",
            description: "NOPE NOPE NOPE",
            image_front: 1,
            image_back: 1,
            image_left: 1,
            image_right: 1,
            odometer: ranNum(999999),
            // odometer_last_update: (new Date()).getTime().toISOString().slice(0, 19).replace('T', ' '),
            brand: brands[ranNum(9)],
            model: models[ranNum(9)],
            type: types[ranNum(9)],
            year: ranYear(),
            ac: ranNum(1),
            seat_min: 1,
            seat_max: ranNum(8),
            misc_json: ''
        });
    }

    // Drop sessions table
    await trx.schema.dropTable("sessions");

    return "Dropped 'license_image' column from table 'users'. \
    Renamed 'data_hash' to 'integriy', added unique constaint, and increased maximum size of 'data' column in 'images' table.\
    Added 'credit_approved' field to 'users' table.\
    Seeded tables for demonstration.\
    Dropped 'sessions' table as now irrelevent.";
}
