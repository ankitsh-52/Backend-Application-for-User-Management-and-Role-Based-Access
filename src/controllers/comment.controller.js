import mongoose from "mongoose";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/apiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Image } from "../models/image.model.js";

const getCommentPage = asyncHandler(async(req, res) => {
    let { id } = req.params;    //image id
    let photo = await Image.findById(id);
    // console.log("Photo details from getCommentPage controller",photo);
    let reviews = await Comment.find({ image : id }).populate("image").populate("owner", "username");

    let currentUser = req.CheckCurrentUser; // using this to get delete edit button based on logged in or out.

    res.render("comment.form.ejs", { photo, reviews, currentUser });
});

const postComment = asyncHandler(async(req, res) => {
    let user = req.user;
    if( !user ){
        let { statusCode, message } = new ApiError ( 400, "Please Login" );
        res.render( "error.ejs", { statusCode, message } );
    }
    
    let { id } = req.params;
    let photo = await Image.findById(id);
    console.log("Image information$$^&^*&", photo);
    let userInfo = await Image.findById(id).populate("owner");
    console.log("User information from image", userInfo);
    
    let { rating, review } = req.body;
    // console.log(` ${id}  ${rating}  ${review} all these are these`);

    if( !rating || !review){
        let { statusCode, message } = new ApiError ( 400, "All fields (review, comments) are required." );
        return res.render( "error.ejs", { statusCode, message } );
    }

    if(rating < 1 || rating > 5){
        let { statusCode, message } = new ApiError ( 400, "Rating must be between 1 to 5" );
        return res.render( "error.ejs", { statusCode, message } );
    }

    const comment = await Comment.create({
        content : review,
        rating: rating,
        image : photo.id,
        owner : user._id,
    })
    console.log("Comment is successfully added", comment);
    res.redirect( `/images/${id}/comments` );
});

const deleteComment = asyncHandler(async(req, res) => {
    let user = req.user;
    // console.log("User id from req.user ",user._id, " ", user.username);

    let commentId = req.params.id;
    // console.log(commentId, "Comment id from params");

    let result = await Comment.findById(commentId);
    if( !result ){
        return res.status(404).json({ message: "Comment not found" });
    }
    // console.log("result console", result);
    
    if( result.owner.equals( user._id )){
        let resp = await Comment.findByIdAndDelete(commentId);
        // console.log(resp);
        setTimeout(() => {
            res.redirect(`/images/${result.image}/comments`);
        }, 500);
        // return res.status(200).json({ message: "Deleted Successfully" });
    }
    else{
        // console.log(false);
        return res.status(404).json({ message: "Not authorized to delete" });
    }
});

const editComment = asyncHandler( async(req, res) => {
    let user = req.user;
    let commentId = req.params.id;
    console.log("Comment id", commentId);

    let { text } = req.body;
    let result = await Comment.findById(commentId);
    console.log("result is", result);
    if( !result ){
        return res.status(404).json({ message: "Comment not found" });
    }

    if( result.owner.equals( user._id )){
        let resp = await Comment.findByIdAndUpdate( {_id : commentId },
            {
                $set : {
                    content : text
                }
            },
            {
                new : true
            }
        );
        await resp.save( { validateBeforeSave : false } );
        console.log("Response after edit", resp );
        res.redirect(`/images/${result.image}/comments`);
    }
    else{
        return res.status(404).json({ message: "Not authorized to edit" });
    }
})

export{
    getCommentPage,
    postComment,
    deleteComment,
    editComment,
}

