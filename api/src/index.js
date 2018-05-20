import { createTransport as nmCreateTransport } from "nodemailer";
import { readFileSync } from "fs";
import AuthRegister from "./routes/auth";
import bodyParser from "body-parser";
import BookingRegister from "./routes/booking";
import cors from "cors";
import DB from "../../db";
import express from "express";
import jws from "jws";
import objectMerge from "object-merge";
import VehicleRegister from "./routes/vehicle";

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
    const FullDB = await DB(config);

    // Initialise express application
    const app = express();

    // Enable CORS
    app.use(cors());

    // Implement body-parser middleware to support JSON in body
    app.use(bodyParser.json({
        limit: "5MB"
    }));

    // Set up nodemailer
    const mailer = nmCreateTransport(config.mail.connectionString);

    // Handy authentication middleware
    const authGuard = (req, res, next) => {
        if (req.header("authorization")) {
            try {
                // Verify token
                if (!jws.verify(req.header("authorization"), "HS256", config.jwt_secret)) {
                    res.sendStatus(401);
                    return;
                }
                // Get contents
                const data = jws.decode(req.header("authorization"));
                // Check expiry
                if (new Date(data.payload.exp) <= new Date()) {
                    res.sendStatus(401);
                    return;
                }
                // Add user_id to locals (validate existance and type)
                if (typeof data.payload.user_id === "number") {
                    res.locals.user_id = data.payload.user_id;
                } else {
                    res.sendStatus(401);
                    return;
                }
            } catch (error) {
                res.sendStatus(500);
                return;
            }
        } else {
            // Abort! ⚡🔥😱
            res.status(400).send({
                feedback: "Authentication header not found."
            });
            return;
        }

        // Continue
        next();
    };

    // Register auth routes
    app.use(AuthRegister(authGuard, FullDB, mailer, config));
    app.use(BookingRegister(authGuard, FullDB));
    app.use(VehicleRegister(authGuard, FullDB));

    if (process.env.DOCKER == true) {
        app.listen(8088);
    } else {
        app.listen(8080);
    }

    console.log("API is ready.");
}

Main();
