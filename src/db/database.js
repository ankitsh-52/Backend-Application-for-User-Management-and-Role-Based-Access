import mongoose from "mongoose";
// import { DB_NAME } from "../constant.js";
import express from "express";
import { configDotenv } from "dotenv";

const app = express();
const port  = process.env.PORT;
configDotenv();

const connectDB = async () => {
    try { 
        /* 
        TODO : 1.) ${process.env.MONGODB_URI}/${DB_NAME}
        TODO : 2.)console.log(`Mongo Db Connected!! ${connectionDB.connection.host}`);
        TODO 3.) process.exit(1)
         */
        // const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}`, {
        //     maxPoolSize : 10,
        //     minPoolSize: 5,
        // });
        // const connectionDB = await mongoose.connect(`${process.env.COMPASS_URI}`)
        const connectionDB = await mongoose.connect(`${process.env.ATLASDB_URI}`, {
            minPoolSize: 5,
            maxPoolSize : 10,
        })
        console.log(`MongoDB atlas Connected!! ${connectionDB.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1)
    }
}

export default connectDB;
