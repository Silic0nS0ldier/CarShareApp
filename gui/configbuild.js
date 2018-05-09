// Builds frontend safe configuration file.

import objectMerge from "object-merge";
import { readFileSync, writeFileSync } from "fs";

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

writeFileSync("./src/config.json", JSON.stringify({
    url: {
        api: config.url.api,
        img: config.url.img,
        gui: config.url.gui
    }
}));

console.log("User-domain safe configuration file has been created.");
