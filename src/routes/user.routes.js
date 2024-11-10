//TODO read router 
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { currentUserCheck } from "../middlewares/response.locals.user.js";
import { 
    registrationPage, 
    homePage, 
    loginUser, 
    logInPage, 
    getCurrentUser, 
    publicProfilePage,
    logoutUser, 
    refreshAccessToken, 
    registerUser,
    sendOtpPage,
    sendOtp,
    verifyOtp,
    getUserChannelProfile,
    updateAccountDetailsPage,
    updateUserAvatar,
    avatarUpdatePage,
    coverImageUpdatePage,
    updateCoverImage,
    followersListModal,
    changeCurrentPassword,
    userProfileData,
    userProfileDataPage,
    forgotPasswordPage,
    forgotPasswordEmail } from  "../controllers/user.controller.js";

const router = Router();
router.route("/").get(currentUserCheck, homePage );

router.route("/register").get( registrationPage );
// router.route("/otp").get( sendOtpPage );
router.route("/sendOtp").get( sendOtp );
router.route( "/verifyOtp" ).post( verifyOtp );
router.route("/register").post(upload.fields
([
    /*upload.fields(): It is used when you need to upload multiple files with different field names at the same time. Each field name (like "avatar" or "coverImage") can have its own file, and these fields are mapped in the request under req.files by their respective names. */
    { name: "avatar", maxCount : 1 },
    { name: "coverImage", maxCount:1 }

]), registerUser);  //TODO uploads.fields()

router.use(currentUserCheck);   //! TO GET USER LOGGED IN OR NOT INFORMATION.

router.route("/login").get( logInPage);
router.route("/login").post(currentUserCheck, loginUser); 
router.route("/currentUser").get(verifyJWT, getCurrentUser);
router.route( "/user/logout" ).post( verifyJWT, logoutUser );
router.route( "/refresh-token" ).post( refreshAccessToken );    //todo
router.route("/userProfileAndSetting").get(checkIfLoggedIn,updateAccountDetailsPage);
router.route("/getUserChannelProfile").get(getUserChannelProfile);  //TODO
router.route("/avatar").get(avatarUpdatePage);
router.route("/avatar").patch(checkIfLoggedIn, upload.single("avatar"), updateUserAvatar);
router.route("/coverImage").get(coverImageUpdatePage);
router.route("/coverImage").patch(checkIfLoggedIn, upload.single("coverImage"), updateCoverImage);

router.route("/:username").get(publicProfilePage);
router.route("/:username/followers").get(checkIfLoggedIn, followersListModal);
router.route("/user/changePassword").post(checkIfLoggedIn, changeCurrentPassword);
router.route("/:id/addProfile").get(checkIfLoggedIn, userProfileDataPage);
router.route("/:id/addProfile").post(checkIfLoggedIn, userProfileData);
router.route("/user/forgotPassword").get(forgotPasswordPage);
router.route("/user/forgotPassword").post(forgotPasswordEmail);

export  default router;