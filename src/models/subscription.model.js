import mongoose, { Schema } from "mongoose";

/* subscribedBy: makes it clear that this field represents the user who is doing the subscribing.
subscribedTo: clearly indicates that this field represents the user who is being followed or subscribed to.
*/

const subscriptionSchema = new Schema({
    subscribedBy: {
        type: Schema.Types.ObjectId, //The user who is subscribing to you.
        ref: "User"
    },
    subscribedTo: {
        type: Schema.Types.ObjectId, //The user you are subscribing
        ref: "User"
    },
}, { timestamps : true } )



export const Subscription = mongoose.model( "Subscription", subscriptionSchema );