import { Model } from "objection";
import Knex from "knex";
import { readFileSync } from "fs";
import objectMerge from "object-merge";

// Load configuration
const config = (() => {
    const rawConfig = JSON.parse(readFileSync("../config/config.json", "utf8"));
    switch (process.env.SCENARIO) {
        case "production":
            return rawConfig.production;
        case "staging":
            return objectMerge(rawConfig.production, rawConfig.staging);
        case "development":
            return objectMerge(rawConfig.production, rawConfig.staging, rawConfig.development);
        default:
            throw new Error("Environment variable SCENARIO must be set to production, staging or development.");
    }
})();

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

export default {
    Knex: KnexInstance,
    ImageModel
};
