import { asyncHandler } from "../utils/asyncHandler.js";
import { Image } from "../models/image.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { checkIfLoggedIn } from "../middlewares/checkIfLoggedIn.middleware.js"; 
import { User } from "../models/user.model.js";
// import { upload } from "../middlewares/multer.middleware.js";

const imageUploadPage = asyncHandler(async(req, res) => {
    res.render("uploadImage.ejs");
});

const uploadImage = asyncHandler( async(req, res) => {
    let { title, description } = req.body;
    // let user = req.user1;

    const imageLocalPath = req.file ? req.file.path : null;
    // req.file: This refers to the file that has been uploaded. When you use Multer with upload.single('fieldName'), req.file holds the file object.

    if( !imageLocalPath ){
        let { statusCode, message } = new ApiError ( 400, "Image is missing" );
        res.render( "error.ejs", { statusCode, message } );
    }
    const image = await uploadOnCloudinary(imageLocalPath);

    if( !image ){
        let { statusCode, message } = new ApiError ( 400, "Image is missing" );
        res.render( "error.ejs", { statusCode, message } );
    }

    const img = await Image.create({
        title,
        description,
        imageFile: image.url,
        owner: req.user._id,
    });
    const uploadedImage = await Image.findById(img._id);

    if(!uploadedImage){
        // throw new ApiError (500, "Error while user registration")
        let { statusCode, message } = new ApiError ( 500, "Error while image uploading" );
        res.render( "error.ejs", { statusCode, message } );
    }
    return res.json(
        new ApiResponse(200, "Image Uploaded Successfully")
    )
    // res.redirect("/currentUser");
});

const userPhotosView = asyncHandler( async(req, res) => {
    let user = req.user;
    // console.log( user,"######" );
    
    if( !user ){
        let { statusCode, message } = new ApiError ( 400, "Please Login" );
        res.render( "error.ejs", { statusCode, message } );
    }
    let photos = await Image.find({owner : user._id}, {imageFile : 1, description : 1}).populate("owner", "username");
    // console.log(photos, "^^^^^^^^^^^^");
    res.render("user.photos.ejs", { photos });
} );

const userPhotos = asyncHandler(async(req, res) => {
    let { username } = req.params;
    // console.log(username);
    let user_id = await User.findOne({username}, {_id: 1});
    // console.log(user_id);
    let photos = await Image.find({owner : user_id}, {imageFile : 1, description : 1}).populate("owner", "username");
    // console.log(photos);
    res.render("public.user.photos.ejs", {photos})
});

const deleteImage = asyncHandler(async(req, res) => {
    let imageId = req.params;
    
})

export {
    imageUploadPage,
    uploadImage,
    userPhotosView,
    userPhotos,
}

