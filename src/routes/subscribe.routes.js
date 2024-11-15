import { Router } from "express";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import { 
    toggleSubscription,
    removeFollower,
    unFollowFollowingUser
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(checkIfLoggedIn);
router.route("/user/toggleFollow/:id").post(toggleSubscription);
router.route("/:id/unfollowFollowing").delete(unFollowFollowingUser);
router.route("/:id/removeFollower").delete(removeFollower);
export default router;