import argon2 from "argon2";
import dataUriToBuffer from "data-uri-to-buffer";
import express from "express";
import sharp from "sharp";
import ssri from "ssri";

/**
 * Registers all booking related routes.
 */
export default function register(authGuard, { BookingModel, ImageModel, UserModel }) {
    const router = express.Router();

    // Bind middleware
    router.use(authGuard);

    // POST: Create booking
    router.post("/booking", (req, res) => {

    });

    // GET: Get booking info
    /** @todo Testing */
    router.get("/booking/:id", async (req, res) => {
        if (!req.params.id) {
            res.sendStatus(400);
            return;
        }
        try {
            // Fetch booking
            const booking = await BookingModel.query()
                .where("id", req.param.id);

            // Make sure exactly 1 record returned
            if (booking.length > 1) {
                res.sendStatus(500);
                return;
            } else if (booking.length === 0) {
                res.sendStatus(404);
                return;
            }

            // Ensure user allowed (admin is always allowed)
            if (req.locals.user_id !== 0 ||
            (booking[0].customer_id !== req.locals.user_id && booking[0].provider_id !== req.locals.user_id)) {
                res.sendStatus(401);
                return;
            }

            // Send data
            res.status(200).send(booking[0]);
            return;
        } catch (error) {
            res.sendStatus(500);
            return;
        }
    });

    // GET: Get users bookings
    router.get("/bookings", (req, res) => {

    });
    
    return router;
};