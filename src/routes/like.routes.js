import { Router } from "express";
import { Like } from "../models/like.model.js";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import { toggleImageLike } from "../controllers/like.controller.js";

const router = Router();
// router.use(checkIfLoggedIn);
router.route("/image/toggleLike/:id").post( checkIfLoggedIn, toggleImageLike);

export default router;