import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { Image } from "../models/image.model.js";

// const likeImagedata = asyncHandler(async(req, res, next) => {
//     let likedUser = await Like.find({}, {likedBy : 1});
//     console.log("Liked User data",likedUser);
//     next();
// })

const toggleImageLike = asyncHandler(async(req, res) => {
    let { id } = req.params;
    // console.log("Image which is liked its id ",id);
    let user = req.user;
    if(!user) {
        let { statusCode, message } = new ApiError ( 400, "Please Login" );
        return res.render( "error.ejs", { statusCode, message } );
    }

    let alreadyLiked = await Like.findOne({ $and : [ { likedBy : user._id }, { imageLiked : id } ] });

    if(alreadyLiked){
        let resp = await Like.deleteOne({$and : [
            { likedBy : user._id },
            { imageLiked : id }
        ]});
        console.log("Already liked 1 decrease",resp);
    } else {
        let resp = await Like.create({
            imageLiked : id,
            likedBy : user._id
        });
        console.log("First time like", resp);
    }
    res.redirect("/");
});

export {
    toggleImageLike,
}