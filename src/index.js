// import express from "express";
// import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import connectDB from "./db/database.js";
import {app} from "./app.js"

configDotenv();
const port = process.env.PORT;

// Function to start the server & DB
const startServer = async () => {
    try {
        await connectDB(); 
        console.log("MongoDB Connected Successfully!");
        // Start the server after successful DB connection
        app.listen(port || 8000, () => {
            console.log(`Server listening on port: ${port}`);
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); // Exit process with failure
    }
};

startServer();

// connectDB();