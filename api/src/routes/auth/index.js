import argon2 from "argon2";
import dataUriToBuffer from "data-uri-to-buffer";
import express from "express";
import randomString from "crypto-random-string";
import sharp from "sharp";
import ssri from "ssri";

/**
 * Registers all auth related routes.
 */
export default function register({ ImageModel, LogModel, UserModel, EmailVerificationModel }, config) {
    const router = express.Router();
    // Session restore
    router.get("/session", (req, res) => {

    });

    // Session status check
    router.head("/session", (req, res) => {

    });

    // Login
    router.post("/login", (req, res) => {

    });

    // Register
    router.post("/register", async (req, res) => {
        // Sanitize user input (objection validation does the leg work)
        /** @type {string[]} */
        let feedback = [];
        let data = {};

        // Ensure first name defined
        if (!req.body.fname || req.body.fname === "") {
            feedback.push("First name is required");
        } else {
            data.fname = req.body.fname;
        }

        // Ensure last name defined
        if (!req.body.lname || req.body.lname === "") {
            feedback.push("Last name is required");
        } else {
            data.lname = req.body.lname;
        }

        // Add middle names if defined
        if (req.body.mnames && req.body.mnames !== "") {
            data.mnames = req.body.mnames;
        }

        // Verify email not in use, then add
        if (!req.body.email || req.body.email === "") {
            feedback.push("Email is required");
        } else {
            await UserModel
                .query()
                .where("email", req.body.email)
                .then(result => {
                    if (result.length != 0) {
                        feedback.push("Email already in use, please use another one.");
                    } else {
                        data.email = req.body.email;
                    }
                })
                .catch(error => {
                    /** @todo Log error */
                    feedback.push("An error occured while checking if the email was already in use. Please try again.");
                });
        }

        // Verify passwords match and are long enough length, then hash and add
        if (req.body.pwd !== req.body.pwd_verify) {
            // Passwords don't match
            feedback.push("Passwords must match!");
        } else if (req.body.pwd < 10) {
            // Password isn't long enough
            feedback.push("Password must be at least 10 characters long.");
        } else {
            // Hash it!
            data.password = await argon2.hash(req.body.pwd).catch(reason => {
                /** @todo Log error */
                feedback.push("We hit a snag while processing your password. Try again or use another password.");
            });
        }

        // Process user image (compress, resize, crop to square, png) and add
        let image = null;
        if (!req.body.usr_img || req.body.usr_img === "") {
            // Make sure image was provied
            feedback.push("A photo of you must be provided.");
        } else if (req.body.usr_img.length > 1) {
            feedback.push("Only 1 photo is required.");
        } else {
            // Attempt to decode image and process image
            try {
                // Decode and send to sharp
                image = sharp(dataUriToBuffer(req.body.usr_img[0]));
                // Process image
                image = image
                    .resize(200, 200)// Set resize values
                    .min()// Reduce image size
                    .crop(sharp.strategy.attention);// Crop remainder with focus on brightest section (e.g. face)
            } catch (error) {
                /** @todo Log error */
                feedback.push("There was an issue processing the provided image. Try again or use another photo.")
            }
        }

        // Abort if feedback already generated
        if (feedback.length !== 0) {
            res.status(400).send({
                feedback: "<ul><li>" + feedback.join("</li><li>") + "</li></ul>"
            });
            return;
        }

        // Try to process image and place in ImageModel pending insertion on user data final validation
        let im = null;// The ImageModel instance or ID of duplicate.
        try {
            // Get png buffer out
            let pngBuffer = await image.png().toBuffer();
            // Get byteLength from buffer
            let bytes = pngBuffer.byteLength;
            // Generate hash from buffer
            let integrityHash = ssri.fromData(pngBuffer, {
                algorithms: ["sha512"]// Technically defaults to this, but that could change and not everyone understands semver.
            }).toString();

            // Duplicate check
            // We could check the data itself, but node acts a little weird with binary data. For now bytes is enough.
            let results = await ImageModel.query().where("integrity", integrityHash).select("id", "size_bytes");
            for (let result of results) {
                if (result.size_bytes === bytes) {
                    im = result.id;
                    break;
                }
            }
            if (typeof im !== "number") {
                // Use model validator
                im = ImageModel.fromJson({
                    num: results.length,
                    extension: "png",
                    size_bytes: bytes,
                    data: pngBuffer,
                    integrity: integrityHash
                });
            }
        } catch (error) {
            /** @todo Log error *///ImageModel.ValidationError
            console.log(error)
            res.status(400).send({
                feedback: "<ul><li>We hit a snag processing the provided photo. Try again or use another photo.</li></ul>"
            });
            return;
        }

        // Create UserModel instance (for jsonSchema validation)
        let um = null;
        try {
            data.user_image = 0;
            um = UserModel.fromJson(data);
        } catch (error) {
            /** @todo Error object should have useful info, need to use it. *///UserModel.ValidationError
            res.status(400).send({
                feedback: "<ul><li>Please double check your details and try again.</li></ul>"
            });
            return;
        }

        // Handle image (store if duplicate wasn't found)
        try {
            if (typeof im !== "number") {
                um.user_image = (await ImageModel.query().insert(im).select("id")).id;
            } else {
                um.user_image = im;
            }
        }
        catch (error) {
            /** @todo Log error */
            res.status(400).send({
                feedback: "<ul><li>We hit a snag while storing your photo. Try again or use another photo.</li></ul>"
            });
            return;
        }
        
        // Save user details
        try {
            um = await UserModel.query().insert(um).select("id", "email");
        }
        catch (error) {
            /** @todo Log error */
            res.status(400).send({
                feedback: "<ul><li>We encountered an error while saving your details. Please contact support.</li></ul>"
            });
            return;
        }

        /** @todo Verification/2nd stage registration email */
        try {
            let evm = await EmailVerificationModel
                .query()
                .insert({
                    code: randomString(25),
                    expires: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    user_id: um.id
                })
                .select("code");

            // Pretend we sent an email
            console.log("Verification link: " + config.url.gui + "/verify" + encodeURIComponent(um.email) + "/" + evm.code);
        } catch (error) {
            /** @todo Log error */
            res.status(400).send({
                feedback: "<ul><li>We hit a snag preparing your verification email. Please contact support.</li></ul>"
            });
            return;
        }
        
        res.status(200).send();
    });

    // Verify
    // need to rail road this into a credit checker system
    router.post("/verify", (req, res) => {

    });

    return router;
};