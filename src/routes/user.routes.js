//TODO read router 
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    UserRegistration, 
    allUsers, 
    loginUser, 
    loggedInUser, 
    getCurrentUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser } from  "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/").get( allUsers );

router.route("/register/new").get( UserRegistration );
router.route("/register").post(upload.fields
([
    /*upload.fields(): It is used when you need to upload multiple files with different field names at the same time. Each field name (like "avatar" or "coverImage") can have its own file, and these fields are mapped in the request under req.files by their respective names. */
    { name: "avatar", maxCount : 1 },
    { name: "coverImage", maxCount:1 }

]), registerUser);  //TODO uploads.fields()

//Secured Routes
router.route("/login/user").get(loggedInUser);
router.route("/login").post(loginUser); 
    
router.route("/currentUser").get(verifyJWT, getCurrentUser);
//Logout route
router.route( "/logout" ).post( verifyJWT, logoutUser );

router.route( "/refresh-token" ).post( refreshAccessToken );


export  default router;

/*
This is my file structure
your-project/
├── uploads/ 
├── public/temp       
├── src
        ├── controllers/
        ├── db/
        ├── middlewares/
        ├── models/
        ├── routes/
        ├── utils/
        ├── views/
├── app.js/
├── constant.js/
├── index.js/      

in controllers i have written user.controller.js, which basically takes all the info as per the user model schema in the models. to register an user. it takes name, email, password, avatar, coverImage.
in the middleware folder i have written multer, in the utils folder i have written cloudinary work 
*/