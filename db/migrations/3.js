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
        return Math.floor(Math.random() * (1 + num));
    }

    let ranYear = () => {
        var year = null;
        var yearCheck = true;
        while (yearCheck) {
            year = Math.floor(Math.random() * 10000);
            if (year >= 1970 && year <= 2018) {
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
        size_bytes: 3155,
        data: Buffer.from("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94CAAICAwOxa6i6L7wEBgWA66y6L7wEBgWgBactXbZ1V9oCAQDQnUx3aTlbbA3F4E524ZrxJXqs9yVo6/35v8cseb6ITuAwCgoBUCYCAEDwgHmEBUIqAACAgAMwd3wcC7UYA7kAAEBAABAQAAQEAAQFAQAAQEAAWBO+BwKSiv8/KuyPgDgQAAQFAQAAQEJiv1tRd/v+zICCwwO38sdwxl2dhkfCNhMT19vDr/CbiQtMcnoVFUAZ3IMS2unvX1L/9Tbu6m+byLLgDAcAdCAAUJCAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAYAQACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAACAgACAoCAACAgAAgIAAICAAICgIAAICAACAgAAgIAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAAICAACAgAAgIAAICgIAAgIAAICAACAgAAgKAgACAgAAgIAAICAACAoCAGAEAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgAAgIAAgIAAICgIAAICAACAgACAgAAgKAgAAgIAAICAAICAACAoCAACAgACAgAAgIAAICgIAAICAAICAACAgAAgKAgAAgIAAgIAAICAACAoCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/Ow7MvGjzNXV5AkAAAAASUVORK5CYII=", "base64"),
        integrity: "sha512-kjF/z52bEBjgjOvP+JwxZWVD6RUNxXfwiAbHFpqVA8IA4HWYaYgubHceuLb/NhNUv4wRCT3Y0KhnFOaDCANB/Q=="
    });

    await trx("images").insert({
        num: 0,
        extension: "png",
        size_bytes: 3362,
        data: Buffer.from("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", "base64"),
        integrity: "sha512-X2ljPzBLDpv19etgLPReqHsd31ErP7VbGDGdUfvFh+iFxWtRnR+cD+5FJqeLuvZDMQcfmgCztjtSN6ZewyBdtQ=="
    });

    await trx("users").insert({
        fname: "Admin",
        lname: "Ivoski",
        email: "admin@norris.codes",
        email_verified: 1,
        password: "$argon2i$v=19$m=4096,t=3,p=1$ZoxvZuYh9vXFfOuaW2K7tw$VAYY9K/IK/qzsweXgfigT3hf0oc+LMgXEdIVyf8iZog",//qwertyuiops
        disabled: 0,
        user_image: 2,
        credit_approved: 1
    });


    let seeder = trx("listings");
    let brands = ["Suzuki", "Peugeot", "Citroen", "Toyota", "Jeep", "Holden", "Ford", "Fiat", "Honda", "Volkswagen"];
    let models = ["Rav4", "Prado", "Landcruiser", "Commodore", "Tucson", "Barina", "Costa", "Comet", "Wrangler", "Mondeo"];
    let types = ["Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Convertible", "Wagon", "Van", "Jeep", "Shrug"];
    for (let i = 0; i < 400; i++) {
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

    return "Dropped 'license_image' column from 'users'. \
    Renamed 'data_hash' to 'integriy', added unique constaint, increased maximum size of 'data' in 'images'.\
    Added 'credit_approved' to 'users'.\
    Seeded tables for demo.\
    Dropped 'sessions'.";
}
