import mongoose, {Schema} from "mongoose";

const profileSchema = new Schema({
    fullName : {
        required : true,
        type : String,
        trim : true,
    },
    location : {
        type : String,
    },
    personalSite : {
        type : String
    },
    bio : {
        type : String,
    },
    avatar : {
        type : String,
        required : true,
    },
    avatarPublicId : {
        type : String,
        required : true,
    },
    twitter : {
        type : String
    },
    facebook : {
        type : String
    },
    linkedin: {
        type : String
    },
    instagram : {
        type : String
    },
}, {timestamps : true});

export const PROFILE = mongoose.model("PROFILE", profileSchema);