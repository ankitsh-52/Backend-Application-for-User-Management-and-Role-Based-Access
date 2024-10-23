import { Router } from "express";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import { 
    toggleSubscription,
    getUserFollowerChannel,
    getUserFollowingChannels
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(checkIfLoggedIn);
router.route("/user/toggleFollow/:id").post(toggleSubscription);
router.route("/getFollowing").get(getUserFollowingChannels);
router.route("/user/followers").get(getUserFollowerChannel);
export default router;