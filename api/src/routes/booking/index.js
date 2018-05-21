import argon2 from "argon2";
import dataUriToBuffer from "data-uri-to-buffer";
import express from "express";
import sharp from "sharp";
import ssri from "ssri";
import todParser from "timeofday-parser";

/**
 * Registers all booking related routes.
 */
export default function register(authGuard, { BookingModel, ImageModel, UserModel, ListingModel }) {
    const router = express.Router();

    // Bind middleware
    router.use(authGuard);

    // POST: Create booking
    router.post("/booking/new", async (req, res) => {
        // Sanitize user input
        /** @type {string[]} */
        let feedback = [];
        let data = {};

        // Ensure dates are valid
        let sDate = null;
        let sTime = null;
        let eDate = null;
        let eTime = null;
        try {
            sDate = Date.parse(req.body.sdate);
            sTime = todParser.parse(req.body.stime);
            if (isNaN(sDate)) {
                feedback.push("Start date is invalid.");
            }
            if (!sTime) {
                feedback.push("Preferred pickup time is invalid.");
            }

            eDate = Date.parse(req.body.edate);
            eTime = todParser.parse(req.body.etime);
            if (isNaN(eDate)) {
                feedback.push("Start date is invalid.");
            }
            if (!eTime) {
                feedback.push("Preferred pickup time is invalid.");
            }
        } catch (error) {
            feedback.push("We hit snag while processing the provided times. Try again or contact support.")
        }

        // Abort if feedback generated
        if (feedback.length !== 0) {
            res.status(400).send({
                feedback: "<ul><li>" + feedback.join("</li><li>") + "</li></ul>"
            });
            return;
        }

        // Build date objects and add start and end times
        let startDate = new Date(sDate);
        startDate.setHours(sTime.h);
        startDate.setMinutes(sTime.m);

        let endDate = new Date(eDate);
        endDate.setHours(eTime.h);
        endDate.setMinutes(eTime.m);

        // Sanity check date range (bookings must go for at least a day)
        if (startDate >= endDate) {
            feedback.push("Start date cannot be after end date!");
        }

        // Validate VIN is here and points to a real active listing
        let listing = null;
        if (!req.body.vin) {
            feedback.push("The vehicle identification number wasn't found. Try again or contact support.");
        } else {
            try {
                listing = await ListingModel.query()
                    .where("VIN", req.body.vin)
                    .where("unlisted", false)
                    .select("VIN", "owner_user_id");
                if (listing.length > 1) {
                    feedback.push("Something strange happened. Try again and contact support if issues persist.");
                } else if (listing.length === 0) {
                    feedback.push("The vehicle you are attempting to book has been unlisted or may not exist.");
                }
            } catch (error) {
                feedback.push("We hit a snag looking for the vehicle you intend to book. Try again and contact support if issues persist.");
            }
        }

        // Abort if feedback generated
        if (feedback.length !== 0) {
            res.status(400).send({
                feedback: "<ul><li>" + feedback.join("</li><li>") + "</li></ul>"
            });
            return;
        }

        // Ensure booking is possible
        try {
            let bookings = await BookingModel.query()
                // Bookings that end after the start date of proposed (we can't cap the results as it'll introduce an edge case for long bookings)
                .where("ends_at", ">=", startDate.toISOString().slice(0, 19).replace('T', ' '))
                .where("VIN", req.body.vin);
            if (bookings.length > 0) {
                // Look for overlaps
                for (let booking in bookings) {
                    // A booking started before this
                    //that.startdate <= this.startdate
                    // A booking starting during this
                    //that.startdate <= this.enddate
                    // We don't need to check that end date
                    const bookingCommenceDate = new Date(booking.commences_at);
                    if (bookingCommenceDate <= startDate || bookingCommenceDate <= endDate) {
                        feedback.push("Vehicle already booked within requested timeframe.");
                        break;
                    }
                }
            }
        } catch (error) {
            feedback.push("We encountered an error while checking booking viability. Try again or contact support.");
        }

        // Abort if feedback generated
        if (feedback.length !== 0) {
            res.status(400).send({
                feedback: "<ul><li>" + feedback.join("</li><li>") + "</li></ul>"
            });
            return;
        }

        // Create booking
        try {
            await BookingModel.query()
                .insert({
                    VIN: req.body.vin,
                    customer_id: res.locals.user_id,
                    provider_id: listing[0].owner_user_id,
                    commences_at: startDate.toISOString().slice(0, 19).replace('T', ' '),
                    ends_at: endDate.toISOString().slice(0, 19).replace('T', ' '),
                    fee: 400/**@todo this is a default placeholder value*/
                });
            
            res.sendStatus(200);
            return;
        } catch (error) {
            feedback.push("An error occured. Please contact support.");
            res.status(500).send({
                feedback: "<ul><li>" + feedback.join("</li><li>") + "</li></ul>"
            })
            return;
        }

        /** @todo send confirmation email */
    });

    // GET: Get booking info
    /** @todo Testing */
    router.get("/booking/:id", async (req, res) => {
        console.log("He is in");
        if (!req.params.id) {
            res.sendStatus(400);
            return;
        }
        try {
            // Fetch booking
            const booking = await BookingModel.query()
                .where("id", req.params.id);

            // Make sure exactly 1 record returned
            if (booking.length > 1) {
                res.sendStatus(500);
                return;
            } else if (booking.length === 0) {
                res.sendStatus(404);
                return;
            }

            // Ensure user allowed (admin is always allowed)
            if (res.locals.user_id !== 0 ||
                (booking[0].customer_id !== res.locals.user_id && booking[0].provider_id !== res.locals.user_id)) {
                res.sendStatus(401);
                return;
            }

            // Send data
            res.status(200).send({
                data: booking[0]
            });
            return;
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
    });

    // GET: Get users bookings
    /** @todo Testing */
    router.get("/bookings", async (req, res) => {
        try {
            // Grab data
            const data = {
                asCustomer: await BookingModel.query().where("customer_id"),
                asProvider: await BookingModel.query().where("provider_id")
            };

            // Send payload
            res.status(200).send({
                data
            });
        } catch (error) {
            res.sendStatus(500);
            return;
        }
    });

    return router;
};