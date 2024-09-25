import express from "express";
import cookieParser from "cookie-parser";   //? to perform CRUD operation on cookies.
import cors from "cors";
import { configDotenv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
configDotenv();

//! Use fileURLToPath to convert import.meta.url to a file path in simple terms __filename & __dirname had been used instead of app.set("views", path.join(__dirname, "src/views")); as type in package.json is ste to module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to ejs
app.set("view engine", "ejs");
// Define the location of the views folder
// app.set("views", path.join(__dirname, "views"));

//? MIDDLEWARES
app.use(cors({  //TODO understand cors.
    origin : process.env.CORS_ORIGIN,
    credentials : true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//Routes import
import userRouter from "./routes/user.routes.js";
// route to get all the routes 
app.use("/", userRouter);

// It simply means that when we go to /users it will be handled to userRouter.
//http:localhost:8000/users/register //We have to use app.use() because we separated routes & controllers in different folders, so it is must. 

export {app};