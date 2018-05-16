import objectMerge from "object-merge";
import express from "express";
import { readFileSync } from "fs";

import DB from "../../db/src/index";

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
        default: {
            if (process.env.DOCKER == true) throw new Error("Environment variable SCENARIO must be set to production, staging or development.");
            else {
                console.log("Assuming local non-docker development environment.");
                return objectMerge(rawConfig.production, rawConfig.staging, rawConfig.development);
            }
        }
    }
})();

async function Main() {

    // Import required database bits
    const { ImageModel } = await DB(config);

    // Initialise express application
    const app = express();

    app.get("/*", (req, res) => {
        // 1. Extract image name from URL (system immune to directory traversal attacks)
        let imageName = req.url.substring(1);// Strips the leading slash

        // 2. Map to file in database (if possible) with pattern id.datahash.extension
        // 2.1. Split value into array
        let imageIds = imageName.split(".");
        // 2.2. Ensure array length is 3
        if (imageIds.length != 3) {
            res.status(400).send();
            return;
        }
        // 2.3. Ensure first value is a unsigned whole number
        if (isNaN(imageIds[0])) {
            res.status(400).send();
            return;
        }

        // 3 Query database, returning file with 200 or nothing with 404 depending on result.
        ImageModel.query()
            .where({
                num: imageIds[0],
                integrity: imageIds[1],
                extension: imageIds[2]
            })
            .select(["size_bytes", "data"])//data should be "binary" stored as a string, probably. worst case we do base64
            .then(images => {
                // Make sure there is actually an image
                if (images.length === 0) {
                    res.status(404).send();
                    return;
                }
                // ...and not more than 1 (in the event this every happens: HOW!? WHAT!?)
                if (images.length !== 1) {
                    res.status(500).send();
                    return;
                }

                let image = images[0];

                // If image has no data (a.k.a. deleted) then return 410 GONE status
                if (image.data == null) {
                    res.status(410).send();
                }

                // Send file
                res.status(200)
                    .attachment(imageName)
                    .append("Content-Transfer-Encoding", "binary")
                    .append("Content-Length", image.size_bytes)
                    .send(image.data);
            })
            .catch(reason => {
                // Something bad has happened.
                res.status(500).send();
            });

    })

    app.listen(8888);

    console.log("IMG is ready.");
}

Main();
