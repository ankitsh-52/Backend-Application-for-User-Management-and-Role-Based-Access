import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    imageUploadPage, 
    uploadImage,
    userPhotos,
    deleteImage, } from "../controllers/image.controller.js";

const router = Router();
router.route("/:username/photo").get(userPhotos);

router.route("/image").get(checkIfLoggedIn, imageUploadPage );
router.route("/image").post( checkIfLoggedIn, upload.single("image"), uploadImage );
router.route("/image/:id/deleteImage").delete (checkIfLoggedIn,deleteImage);

export default router;