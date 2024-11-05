import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";


const router = Router();