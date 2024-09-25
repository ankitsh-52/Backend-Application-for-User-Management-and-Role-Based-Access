import mongoose, { Schema } from "mongoose";

/* subscriberUser: makes it clear that this field represents the user who is doing the subscribing.
subscribedTo: clearly indicates that this field represents the user who is being followed or subscribed to.
*/

const subscriptionSchema = new Schema({
    subscribedBy: {
        type: Schema.Types.ObjectId, //The user who is subscribing to someone else.
        ref: "User"
    },
    channel: {
        type: SchemA.Types.ObjectId, //The user being subscribed to
        ref: "User"
    },
}, { timestamps : true } )



export const Subscription = mongoose.model( "Subscription", subscriptionSchema );