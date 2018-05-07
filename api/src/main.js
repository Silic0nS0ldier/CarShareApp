import express from "express";
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

// Initialise express application
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(8088);
