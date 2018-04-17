const { Model } = require("objection");
const Knex = require("knex");

// Initialise Knex
const KnexInstance = Knex({
    client: "mysql2",
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

class FileModel extends Model {
    static get tableName() {
        return "files";
    }
}

async function createFilesTable() {
    await KnexInstance.schema.createTable("files", table => {
        table.increments(id).primary();
        table.string("name").notNullable();
        table.string("extension");
        table.integer("size_bytes").notNullable();
        table.timestamp("first_uploaded_at").defaultTo(KnexInstance.fn.now()).notNullable().comment("When file was first uploaded to the database. ");
        table.binary("data").notNullable().comment("File data as binary.");
        table.string("data_hash").comment("Hash of file data, used to assist in duplicate detection.");// No need to store duplicate images. But this should be improved as collisions could occur for different images.
    });
}

// Stores logs for various aspects of the system such as migrations, errors, 
async function createLogsTable() {
    await KnexInstance.schema.createTable("logs", table => {
        table.string("category").comment("Category entry belongs too.");
        table.integer("severity").comment("0 = Information; 1 = Warning; 2 = Error;");
    });
}

module.exports = {
    Knex: KnexInstance
};
