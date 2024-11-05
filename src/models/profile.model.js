import mongoose, {Schema} from "mongoose";

const profileSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    fullName : {
        required : true,
        type : String,
        trim : true,
    },
    location : {
        type : String,
        default : "",
    },
    personalSite : {
        type : String,
        default : "",
    },
    bio : {
        type : String,
        default : "",
    },
    twitter : {
        type : String,
        default : "",
    },
    facebook : {
        type : String,
        default : "",
    },
    linkedin: {
        type : String,
        default : "",
    },
    instagram : {
        type : String,
        default : "",
    },
}, {timestamps : true});

export const Profile = mongoose.model("Profile", profileSchema);