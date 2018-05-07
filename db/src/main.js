import { Model } from "objection";
import Knex from "knex";
import { readFileSync } from "fs";
import objectMerge from "object-merge";

/**
 * Returns system database access components.
 * @param {object} config - System configuration object
 */
export default function DB(config) {
    // Initialise Knex, with a delay to account for MySQL quirks
    // Retry logic not possible due to unhandled async exceptions within libraries which cannot be caught up here a.k.a. "bad code"
    require("thread-sleep")(10000);
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

    return {
        Knex: KnexInstance,
        ImageModel
    };
}
