//TODO
import mongoose, {Schema} from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const imageModel = new Schema ({
    imageFile : {
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

export const Image = mongoose.model("Image", imageModel)