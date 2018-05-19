import argon2 from "argon2";
import dataUriToBuffer from "data-uri-to-buffer";
import express from "express";
import sharp from "sharp";
import ssri from "ssri";

/**
 * Registers all booking related routes.
 */
export default function register(authGuard, { ImageModel, LogModel, UserModel }) {
    const router = express.Router();

    
    return router;
};