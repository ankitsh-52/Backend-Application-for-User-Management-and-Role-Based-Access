import mongoose from "mongoose";

const twitterSchema = new mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    content: {
        type: String,
        required: true,
    }
}, {timestamps: true});

export const Twitter = mongoose.model("Twitter", twitterSchema);