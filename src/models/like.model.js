import  mongoose, { Schema } from "mongoose";

const likeSchema = new Schema ({
    imageLiked : {
        type : Schema.Types.ObjectId,
        ref : "Image"
    },
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    likeCount : {
        type : Number,
        default : 0,
    },
    dislikeCount : {
        type : Number,
        default : 0,
    }
}, { timestamps : true });

export const Like = mongoose.model("Like", likeSchema);

