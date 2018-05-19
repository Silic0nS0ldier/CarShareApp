import argon2 from "argon2";
import dataUriToBuffer from "data-uri-to-buffer";
import express from "express";
import sharp from "sharp";
import ssri from "ssri";

/**
 * Registers all vehicle related routes.
 */
export default function register(authGuard, { ImageModel, LogModel, UserModel, ListingModel }) {
    const router = express.Router();

    // Bind middleware
    router.use(authGuard);

    // GET: Search results
    router.get("/vehicle/search", async (req, res) => {
        if (!req.query.term) {
            res.status(400).send({ feedback: "A search term is required." });
            return;
        }
        let term = req.query.term;
        try {
            let results = await ListingModel
                .query()
                .where("VIN", "like", `%${term}%`)
                .orWhere("summary", "like", `%${term}%`)
                .orWhere("brand", "like", `%${term}%`)
                .orWhere("type", "like", `%${term}%`)
                .orWhere("year", "like", `%${term}%`);
            res.status(200).send({
                data: results
            });
        } catch (error) {
            res.status(400).send({ feedback: "Error processing query." });
            return;
        }
    });

    // GET: Vehicle listing data
    router.get("/vehicle/:vin", async (req, res) => {
        let content = null;
        try {
            content = await ListingModel
                .query()
                .where("vin", req.params.vin);
            if (content.length > 1) {
                res.status(400).send({ message: "Duplicate result error." });
                return;
            } else if (content.length == 0) {
                res.status(404).send({ message: "No cars found with the specified VIN: " + req.params.vin + "." });
                return;
            } else {
                res.status(200).send(content[0]);
                return;
            }
        } catch (error) {
            res.status(400).send({ message: "System failure" });
            return;
        }
        res.status(404).send("Car not found");
    });

    return router;
};