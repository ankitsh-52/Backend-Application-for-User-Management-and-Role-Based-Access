import express from "express";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";   //? to perform CRUD operation on cookies.
import cors from "cors";
import { configDotenv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import { currentUserCheck } from "./middlewares/response.locals.user.js";

const app = express();
app.use(methodOverride('_method'));
configDotenv();

//! Use fileURLToPath to convert import.meta.url to a file path in simple terms __filename & __dirname had been used instead of app.set("views", path.join(__dirname, "src/views")); as type in package.json is ste to module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to ejs
app.set("view engine", "ejs");
app.engine( "ejs", ejsMate );
// Define the location of the views folder
// app.set("views", path.join(__dirname, "views"));

//? MIDDLEWARES
app.use(cors({  //TODO understand cors.
    origin : process.env.CORS_ORIGIN,
    // origin : 'http://localhost:8000', 
    credentials : true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(currentUserCheck);
// app.use((req, res, next) => {
//     console.log("App.js check res.locals.currUser", res.locals.currUser);
//     next();
// })


//Routes import
import userRouter from "./routes/user.routes.js";
import imageRouter from "./routes/image.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscribeRouter  from "./routes/subscribe.routes.js";
// route to get all the routes 

app.use("/", likeRouter);
app.use("/", imageRouter);
app.use("/", userRouter);
app.use("/", commentRouter);
app.use("/", subscribeRouter);


// It simply means that when we go to /users it will be handled to userRouter.
//http:localhost:8000/users/register //We have to use app.use() because we separated routes & controllers in different folders, so it is must. 

export {app};