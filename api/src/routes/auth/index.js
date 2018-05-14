import express from "express";

/**
 * Registers all auth related routes.
 */
export default async function register({ ImageModel, LogModel, UserModel }) {
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
    router.post("/register", (req, res) => {

    });

    // Verify
    router.post("/verify", (req, res) => {

    });
};