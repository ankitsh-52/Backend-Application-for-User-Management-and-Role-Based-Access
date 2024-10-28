import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { Image } from "../models/image.model.js";

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


const likeCountEachImage = asyncHandler(async(req, res) => {
    let allImage = await Image.find({},{_id : 1}); 
    // console.log("Image data from like controller", allImage);
    
    let likeMap = new Map();
    for(let image of allImage){
        let likeCount = await Like.find({imageLiked : image._id}).countDocuments();
        likeMap.set(image, likeCount);
    }
    let likeCount = await Like.find().countDocuments();
    console.log("Total Like Count: ", likeCount, "each Image Like Count", likeMap);
    return likeMap;
})

export {
    toggleImageLike,
    likeCountEachImage,
}