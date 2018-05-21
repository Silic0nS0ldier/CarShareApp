import Knex from "knex";
import { readFileSync } from "fs";
import { Model } from "objection";

/**
 * Returns system database access components.
 * @param {object} config - System configuration object
 */
export default async function DB(config) {
    // Create Knex instance
    const KnexInstance = Knex({
        client: "mysql",
        //useNullAsDefault: true,
        connection: (() => {
            if (process.env.DOCKER == true) {
                return config.db.docker;
            } else {
                return config.db.self;
            }
        })()
    });

    // Wait for stable connection
    let unstable = true;
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    while (unstable) {
        await KnexInstance.raw("SELECT 1 + 1")
            .then(() => {
                unstable = false;
            })
            .catch(async error => {
                console.log("DB could not be accessed. Retrying in 1 second...");
                await snooze(1000);
            });
    }

    // Give Objection a copy.
    Model.knex(KnexInstance);

    class ImageModel extends Model {
        static get tableName() {
            return "images";
        }

        static get jsonSchema() {
            return {
                type: "object",
                required: [
                    "num",
                    "extension",
                    "size_bytes",
                    "data",
                    "integrity"
                ],
                properties: {
                    num: { type: "integer" },
                    extension: { type: "string", minLength: 3, maxLength: 255 },
                    size_bytes: { type: "integer" },
                    first_uploaded_at: { type: "string", format: "date-time" },
                    // Best way to handle data is to leave it as a buffer, which the valdiation doesn't understand. Hence not defined.
                    integrity: { type: "string", maxLength: 255 }
                }
            }
        }
    }

    class LogModel extends Model {
        static get tableName() {
            return "logs";
        }
    }

    class UserModel extends Model {
        static get tableName() {
            return "users";
        }

        fullName() {
            if (this.mnames) {
                return this.fname + " " + this.mnames + " " + this.lname;
            } else {
                return this.fname + " " + this.lname;
            }
        }

        static get relationMappings() {
            return {
                userImage: {
                    relation: Model.HasOneRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "users.user_image",
                        to: "images.id"
                    }
                },
                listings: {
                    relation: Model.HasManyRelation,
                    modelClass: ListingModel,
                    join: {
                        from: "users.id",
                        to: "listings.owner_user_id"
                    }
                },
                roles: {
                    relation: Model.ManyToManyRelation,
                    modelClass: RoleModel,
                    join: {
                        from: "users.id",
                        through: {
                            from: "users_roles.user_id",
                            to: "users_roles.role_id"
                        },
                        to: "roles.id"
                    }
                },
                bookingsCustomer: {
                    relation: Model.HasManyRelation,
                    modelClass: BookingModel,
                    join: {
                        from: "users.id",
                        to: "bookings.customer_id"
                    }
                },
                bookingsProvider: {
                    relation: Model.HasManyRelation,
                    modelClass: BookingModel,
                    join: {
                        from: "users.id",
                        to: "bookings.provider_id"
                    }
                }
            }
        }

        static get jsonSchema() {
            return {
                type: "object",
                required: [
                    "fname",
                    "lname",
                    "email",
                    "password",
                    "user_image"
                ],
                properties: {
                    id: { type: "integer" },
                    fname: { type: "string", minLength: 1, maxLength: 255 },
                    mnames: { type: ["string", "null"], maxLength: 255 },
                    lname: { type: "string", minLength: 1, maxLength: 255 },
                    email: { type: "string", format: "email", maxLength: 255 },
                    email_verified: { type: "boolean" },
                    password: { type: "string", maxLength: 255 },
                    disabled: { type: "boolean" },
                    user_image: { type: "integer" }
                }
            }
        }
    }

    class RoleModel extends Model {
        static get tableName() {
            return "roles";
        }

        static get relationMappings() {
            return {
                users: {
                    relation: Model.ManyToManyRelation,
                    modelClass: UserModel,
                    join: {
                        from: "roles.id",
                        through: {
                            from: "users_roles.role_id",
                            to: "users_roles.user_id"
                        },
                        to: "users.id"
                    }
                }
            }
        }
    }

    class ListingModel extends Model {
        static get tableName() {
            return "listings";
        }

        static get idColumn() {
            return "VIN";
        }

        static get relationMappings() {
            return {
                owner: {
                    relation: Model.HasOneRelation,
                    modelClass: UserModel,
                    join: {
                        from: "listings.owner_user_id",
                        to: "users.id"
                    }
                },
                imageFront: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_front",
                        to: "images.id"
                    }
                },
                imageBack: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_back",
                        to: "images.id"
                    }
                },
                imageLeft: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_left",
                        to: "images.id"
                    }
                },
                imageRight: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_right",
                        to: "images.id"
                    }
                },
                bookings: {
                    relation: Model.HasManyRelation,
                    modelClass: BookingModel,
                    join: {
                        from: "listings.VIN",
                        to: "bookings.VIN"
                    }
                },
                changes: {
                    relation: Model.HasManyRelation,
                    modelClass: ListingChangeModel,
                    join: {
                        from: "listings.VIN",
                        to: "listing_changes.VIN"
                    }
                }
            }
        }
    }

    class ListingChangeModel extends Model {
        static get tableName() {
            return "listing_changes";
        }

        static get relationMappings() {
            return {
                listing: {
                    relation: Model.HasOneRelation,
                    modelClass: ListingModel,
                    join: {
                        from: "listing_changes.VIN",
                        to: "listing.VIN"
                    }
                }
            }
        }
    }

    class EmailVerificationModel extends Model {
        static get tableName() {
            return "email_verifications";
        }

        static get idColumn() {
            return "code";
        }

        static get relationMappings() {
            return {
                user: {
                    relation: Model.HasOneRelation,
                    modelClass: UserModel,
                    join: {
                        from: "email_verifications.user_id",
                        to: "users.id"
                    }
                }
            }
        }

        static get jsonSchema() {
            return {
                type: "object",
                required: [
                    "code",
                    "expires",
                    "user_id"
                ],
                properties: {
                    code: { type: "string", minLength: 10, maxLength: 255 },
                    expires: { type: "string" },// This should be validated, but jsonSchema doesn't have a mysql compatible format
                    user_id: { type: "integer" },
                    new_email: { type: "string", format: "email" }
                }
            }
        }
    }

    class BookingModel extends Model {
        static get tableName() {
            return "bookings";
        }

        static get relationMappings() {
            return {
                customer: {
                    relation: Model.HasOneRelation,
                    modelClass: UserModel,
                    join: {
                        from: "bookings.customer_id",
                        to: "users.id"
                    }
                },
                provider: {
                    relation: Model.HasOneRelation,
                    modelClass: UserModel,
                    join: {
                        from: "bookings.provider_id",
                        to: "users.id"
                    }
                },
                listing: {
                    relation: Model.HasOneRelation,
                    modelClass: ListingModel,
                    join: {
                        from: "bookings.VIN",
                        to: "listings.VIN"
                    }
                }
            }
        }
    }

    return {
        Knex: KnexInstance,
        BookingModel,
        EmailVerificationModel,
        ImageModel,
        ListingChangeModel,
        ListingModel,
        LogModel,
        RoleModel,
        UserModel
    };
}
