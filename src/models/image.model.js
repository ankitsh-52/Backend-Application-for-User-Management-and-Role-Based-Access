//TODO
import mongoose, {Schema} from "mongoose";
import { Comment } from "../models/comments.model.js";
import { Like } from "../models/like.model.js";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const imageModel = new Schema ({
    imageFile : {
        type : String,
        required : true,
    },
    imagePublicId : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    views : {
        type : Number,
        default : 0,
    },
    isPublished : {
        type : Boolean,
        default : true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    reviews: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
}, {timestamps : true})

// videoSchema.plugin(mongooseAggregatePaginate)   //it is a hook of mongoose used for 

imageModel.pre("deleteOne", async function ( next) {
    let filter = this.getFilter();
    console.log("Image delete filter", filter);

    try {
        let comments = await Comment.deleteMany( { image : filter } );
        console.log("Comment deleted from post using MW");
    } catch (error) {
        res.status(500).send('Error deleting comment of this image');
    }

    try {
        let likes = await Like.deleteMany( { imageLiked : filter } );
        console.log("Image like delete data", likes);
    } catch (error) {
        res.status(500).send('Error deleting like for this image');
    }
    next();
})


export const Image = mongoose.model("Image", imageModel)