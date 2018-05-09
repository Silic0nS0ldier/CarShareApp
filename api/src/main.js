import objectMerge from "object-merge";
import express from "express";
import { readFileSync } from "fs";

// Load configuration
const config = (() => {
    const rawConfig = JSON.parse(readFileSync("../config/config.json", "utf8"));
    switch (process.env.SCENARIO) {
        case "production":
            return rawConfig.production;
        case "staging":
            return objectMerge(rawConfig.production, rawConfig.staging);
        case "development":
        default: {
            if (process.env.DOCKER == true) throw new Error("Environment variable SCENARIO must be set to production, staging or development.");
            else {
                console.log("Assuming local non-docker development environment.");
                return objectMerge(rawConfig.production, rawConfig.staging, rawConfig.development);
            }
        }
    }
})();

// Initialise express application
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
})

if (process.env.DOCKER == true) {
    app.listen(8088);
} else {
    app.listen(8080);
}

