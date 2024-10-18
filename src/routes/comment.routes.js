import { Router } from "express";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import{
    getCommentPage,
    postComment,
    deleteComment,
    editComment
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/images/:id/comments").get( getCommentPage );

router.use(checkIfLoggedIn);
router.route("/comment/:id/comments").post( postComment );
router.route("/comment/:id/deletecomment").delete( deleteComment );
router.route("/comment/:id/editcomment").patch( editComment );
export default router;