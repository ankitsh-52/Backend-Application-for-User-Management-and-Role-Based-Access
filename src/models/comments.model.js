import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        // required: true,
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Image"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
}, { timestamps: true });

export const Comment = mongoose.model( "Comment", commentSchema );