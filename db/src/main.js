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
        connection: {
            host: "db",
            user: "root",
            password: "dev_root",
            database: "carsharedb"
        }
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
            return this.fname + " " + this.lname;
        }

        static get relationMappings() {
            return {
                user_image: {
                    relation: Model.HasOneRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "users.user_image",
                        to: "images.id"
                    }
                },
                license_image: {
                    relation: Model.HasOneRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "users.license_image",
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
                sessions: {
                    relation: Model.HasManyRelation,
                    modelClass: SessionModel,
                    join: {
                        from: "users.id",
                        to: "sessions.user_id"
                    }
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
                image_front: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_front",
                        to: "images.id"
                    }
                },
                image_back: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_back",
                        to: "images.id"
                    }
                },
                image_left: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_left",
                        to: "images.id"
                    }
                },
                image_right: {
                    relation: Model.HasManyRelation,
                    modelClass: ImageModel,
                    join: {
                        from: "listings.image_right",
                        to: "images.id"
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

    class SessionModel extends Model {
        static get tableName() {
            return "sessions";
        }

        static get relationMappings() {
            return {
                user: {
                    relation: Model.HasOneRelation,
                    modelClass: UserModel,
                    join: {
                        from: "sessions.user_id",
                        to: "users.id"
                    }
                }
            }
        }
    }

    return {
        Knex: KnexInstance,
        ImageModel,
        LogModel,
        UserModel,
        RoleModel,
        ListingModel,
        ListingChangeModel
    };
}
