import { Router } from "express";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.use(checkIfLoggedIn);
router.route("/user/toggleFollow/:id").post(toggleSubscription);

export default router;