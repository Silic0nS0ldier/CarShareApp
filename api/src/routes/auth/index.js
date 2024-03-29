import argon2 from "argon2";
import dataUriToBuffer from "data-uri-to-buffer";
import express from "express";
import jws from "jws";
import randomString from "crypto-random-string";
import sharp from "sharp";
import ssri from "ssri";

/**
 * Registers all auth related routes.
 */
export default function register(authGuard, { ImageModel, LogModel, UserModel, EmailVerificationModel }, mailer, config) {
    const router = express.Router();

    // POST: Login
    router.post("/login", async (req, res) => {
        let um = null;
        let img = null;
        // Locate account via email
        if (req.body.email) {
            try {
                um = await UserModel
                    .query()
                    .where("email", req.body.email)
                    .select("id", "password", "fname", "mnames", "lname", "user_image");
                if (um.length === 0) {
                    res.status(400).send({
                        feedback: "Email or password incorrect."
                    });
                    return;
                } else {
                    um = um[0];
                }

                // Grab user image
                img = await um.$relatedQuery("userImage").select("num", "integrity", "extension");
            } catch (error) {
                res.sendStatus(500);
                return;
            }
        } else {
            res.status(400).send({
                feedback: "Email is required."
            });
            return;
        }

        // Verify password
        if (req.body.pwd) {
            try {
                if (!await argon2.verify(um.password, req.body.pwd)) {
                    res.status(400).send({
                        feedback: "Email or password incorrect."
                    });
                    return;
                }
            } catch (error) {
                res.sendStatus(500);
                return;
            }
        } else {
            res.status(400).send({
                feedback: "Password is required."
            });
            return;
        }

        // Create session (and generate JWT)
        let token = null;
        try {
            token = jws.sign({
                header: {
                    alg: "HS256",// There are better algorithms, but they are a pita to set up
                    typ: "JWT"
                },
                payload: {
                    user_id: um.id,
                    iat: new Date().valueOf(),
                    exp: new Date(new Date().getTime() + 1209600000).valueOf(),// Current time + 14 days
                    img: `${img.num}.${img.integrity}.${img.extension}`
                },
                secret:  config.jwt_secret
            });
        } catch (error) {
            res.sendStatus(500);
            return;
        }

        // Send access token
        res.status(200).send({
            access_token: token
        });
        return;
    });

    // POST: Register
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

        // Send verificaion/2nd registration email
        try {
            let evm = await EmailVerificationModel
                .query()
                .insert({
                    code: randomString(25),
                    expires: (new Date(new Date().getTime() + 1800000)).toISOString().slice(0, 19).replace('T', ' '),// Current time + 30 min to mysql format
                    user_id: um.id
                })
                .select("code");

            // Send email (and put to console)
            console.log("Verification link: " + config.url.gui + "verify/" + encodeURIComponent(um.email) + "/" + evm.code);
            mailer.sendMail({
                from: "\"Car Share\" <carshare@example.com>", // sender address
                to: um.email, // list of receivers
                subject: "Car Share - Continue Registration", // Subject line
                text: "Please visit " + config.url.gui + "verify/" + encodeURIComponent(um.email) + "/" + evm.code + " to complete complete registration.", // plain text body
                html: "Please visit <a href=\"" + config.url.gui + "verify/" + encodeURIComponent(um.email) + "/" + evm.code + "\">" + config.url.gui + "verify/" + encodeURIComponent(um.email) + "/" + evm.code + "</a> to complete complete registration." // html body
            });
        } catch (error) {
            /** @todo Log error */
            res.status(400).send({
                feedback: "<ul><li>We hit a snag preparing your verification email. Please contact support.</li></ul>"
            });
            return;
        }

        res.status(200).send();
    });

    // POST: Verify
    router.post("/verify", async (req, res) => {
        // Verify code
        let evm = null;
        let um = null;
        try {
            um = await UserModel
                .query()
                .where("email", req.body.email)
                .select("id");
            if (um.length !== 1) {
                throw new Error("No or too many users returned!");
            }
            um = um[0];
            evm = await EmailVerificationModel
                .query()
                .andWhere("user_id", um.id);
            if (evm.length !== 1) {
                throw new Error("No or too many email verifications returned!");
            }
            evm = evm[0];
        } catch (error) {
            res.status(400).send({
                feedback: "We hit a snag processing your request. Try again or contact support."
            });
            return;
        }

        /** @todo Create new link if expired (and delete old) */

        // Make sure code matches
        if (evm.code !== req.body.code) {
            res.status(400).send({
                feedback: "This link has been replaced or is invalid. If you came here from the verification email, place look for a newer email or contact support."
            });
            return;
        }

        // Mark email as verified and 'lodge' credit check
        try {
            let update = {
                email_verified: true
            };
            // Blacklist logic (for demonstration purposes, we hate people who have a license number containing 1)
            if (req.body.license_num.indexOf("1") !== -1) {
                mailer.sendMail({
                    from: "\"Car Share\" <carshare@example.com>", // sender address
                    to: req.body.email, // list of receivers
                    subject: "Car Share - Credit Assessment Outcome", // Subject line
                    text: "Your (" + req.body.email + ") credit is bad. Site access has been denied.", // plain text body
                });
                console.log("Your (" + req.body.email + ") credit is bad. Site access has been denied.");
            } else {
                mailer.sendMail({
                    from: "\"Car Share\" <carshare@example.com>", // sender address
                    to: req.body.email, // list of receivers
                    subject: "Car Share - Your In!", // Subject line
                    text: "Your (" + req.body.email + ") credit is good. Welcome! Head to " + config.url.gui + "login", // plain text body
                });
                console.log("Your (" + req.body.email + ") credit is good. Welcome! Head to " + config.url.gui + "login");
                update.credit_approved = true;
            }
            await UserModel
                .query()
                .patch(update)
                .where("id", um.id);
            await EmailVerificationModel
                .query()
                .delete()
                .where("code", evm.code);
        } catch (error) {
            res.status(400).send({
                feedback: "We hit a snag while processing your request. Please contact support."
            });
            return;
        }

        // Note success (and end request)
        res.sendStatus(200);
        return;
    });

    // GET: Get current users details
    /** @todo Testing */
    router.get("/user", authGuard, async (req, res) => {
        try {
            // Fetch data
            const user = await UserModel.query()
                .where("id", res.locals.user_id)
                .select("fname", "mnames", "lname", "email", "user_image")
                .eager("[userImage, bookingsCustomer, bookingsProvider]")
                .pick(ImageModel, ["num", "integrity", "extension"]);
            // Make sure something was found
            if (user.length > 1) {
                res.sendStatus(500);
                return;
            } else if (user.length === 0) {
                res.sendStatus(404);
                return;
            }
            // And send it back
            res.status(200).send({
                data: user[0]
            })
            return;
        } catch (error) {
            res.sendStatus(500);
            return;
        }
    });

    // GET: Get a users details
    /** @todo Testing */
    router.get("/user/:id", authGuard, async (req, res) => {
        try {
            // Fetch data
            const user = await UserModel.query()
                .where("id", req.params.id)
                .select("fname", "mnames", "lname", "user_image", "email")
                .eager("[userImage, bookingsProvider.[review]]")
                .pick(ImageModel, ["num", "integrity", "extension"]);

            // Make sure something was found
            if (user.length > 1) {
                res.sendStatus(500);
                return;
            } else if (user.length === 0) {
                res.sendStatus(404);
                return;
            }
            // And send it back
            res.status(200).send({
                data: user[0]
            })
            return;
        } catch (error) {
            res.sendStatus(500);
            return;
        }
    });

    // POST: Change Password of user signed in.
    router.post("/profile/password", async (req, res) => {
        // Sanitize user input (objection validation does the leg work)
        /** @type {string[]} */
        let feedback = [];
        let data = {};

        
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

        // Abort if feedback already generated
        if (feedback.length !== 0) {
            res.status(400).send({
                feedback: "<ul><li>" + feedback.join("</li><li>") + "</li></ul>"
            });
            return;
        }

        // Save user details
        try {
            let um = await UserModel.query()
                .patch({
                    password: data.password
                })
                .where("id", req.body.user_id);
        } catch (error) {
            /** @todo Log error */
            res.status(400).send({
                feedback: "<ul><li>We encountered an error while saving your details. Please contact support.</li></ul>"
            });
            return;
        }

        res.sendStatus(200);
        return;
    });

    return router;
};