import { readFileSync } from "fs";
import AuthRegister from "./routes/auth";
import bodyParser from "body-parser";
import BookingRegister from "./routes/booking";
import cors from "cors";
import DB from "../../db";
import express from "express";
import { createTransport as nmCreateTransport } from "nodemailer";
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

    // Register auth routes
    app.use(AuthRegister(FullDB, config));
    app.use(BookingRegister(FullDB));
    app.use(VehicleRegister(FullDB));
    
    app.use("/:session_id", (req, res, next) => {
        // 1. look for session in sessions table

        // 2. if session exists ensure not expired
            // Grab user from users table
            // Add to res.locals
        // 2. Else
            // Return unauthorised response (400?)
    });

    if (process.env.DOCKER == true) {
        app.listen(8088);
    } else {
        app.listen(8080);
    }

    console.log("API is ready.");
}

Main();
