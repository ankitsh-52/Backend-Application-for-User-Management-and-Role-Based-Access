import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiErrors.js";

const toggleSubscription = asyncHandler(async(req, res) => {
    let { id } = req.params;
    // console.log("User id received for toggling check", id);
    try {
        let subscribedToUser = await User.findById( {_id : id}, { password : 0, refreshToken : 0 });
        if( !subscribedToUser ) {
            let { statusCode, message } = new ApiError ( 201, "User Not Found" );
            return res.render( "error.ejs", { statusCode, message } );
        }
        // console.log("Subscribed To User", subscribedToUser);

        let subscribedByUser = req.user;
        if( !subscribedByUser ){
            let { statusCode, message } = new ApiError ( 401, "Please Log in" );
            return res.render( "error.ejs", { statusCode, message } );
        }
        // console.log("Subscribed by User ", subscribedByUser);

        //check if already subscribed or not
        let alreadySubscribed = await Subscription.findOne({
            $and : [
                {subscribedTo : subscribedToUser._id},
                {subscribedBy : subscribedByUser._id}
            ]
        });
        
        if(alreadySubscribed){
            //unsubscribe logic
            let resp = await Subscription.deleteOne({$and : [
                { subscribedBy : subscribedByUser._id },
                { subscribedTo : subscribedToUser._id }
            ]});
            console.log("Deleted already subscribed user");
        } else{
            //subscribe logic
            let resp = await Subscription.create({
                subscribedBy : subscribedByUser._id,
                subscribedTo : subscribedToUser._id
            });
            console.log("Not subscribed user data added");
        }
        console.log("Subscription added check");
        return res.redirect(`/${subscribedToUser.username}`);
    } catch (error) {
        console.log("Error toggling subscription", error);
        let { statusCode, message } = new ApiError(500, "Server error");
        return res.render("error.ejs", { statusCode, message });
    }
});

const removeFollower = asyncHandler(async(req, res) => {
    let removingFollowerId= req.params.id;
    // console.log("removingFollowerId", removingFollowerId);
    
    if(!removingFollowerId){
        let { statusCode, message } = new ApiError ( 201, "User Not Found" );
        return res.render( "error.ejs", { statusCode, message } );
    }
    try {
        let currUser = req.user;
        // console.log("currUser", currUser._id, currUser.username);
        
        let followerData = await Subscription.findOne({
            $and : [
                {subscribedBy : removingFollowerId},
                {subscribedTo : currUser._id}
            ]
        });
        if(!followerData){
            let { statusCode, message } = new ApiError ( 201, "User Not Found" );
            return res.render( "error.ejs", { statusCode, message } );
        }
        else{
            let resp = await Subscription.deleteOne({
                $and : [
                    {subscribedTo : currUser._id},
                    {subscribedBy : removingFollowerId}
                ]
            })
            console.log("Follower user removed result", resp);
        }
        return res.redirect("/currentUser");
    } catch (error) {
        let { statusCode, message } = new ApiError ( 500, "Internal server error" );
        return res.render( "error.ejs", { statusCode, message } );
    }
});

const unFollowFollowingUser = asyncHandler(async(req, res) => {
    let unfollowId = req.params.id;
    console.log("Unfollowing user id", unfollowId);

    if(!unfollowId){
        let { statusCode, message } = new ApiError ( 201, "User Not Found" );
        return res.render( "error.ejs", { statusCode, message } );
    }
    try {
        let currentUser = req.user;
        let followingUserData = await Subscription.findOne({
            $and : [
                {subscribedBy : currentUser._id},
                {subscribedTo : unfollowId}
            ]
        })
        // console.log("followingUserData", followingUserData);

        if(!followingUserData){
            let { statusCode, message } = new ApiError ( 201, "User Not Found" );
            return res.render( "error.ejs", { statusCode, message } );
        }
        else{
            let resp = await Subscription.deleteOne({
                $and : [
                    {subscribedBy : currentUser._id},
                    {subscribedTo : unfollowId}
                ]
            })
            console.log("Successfully unfolowed the user", resp);
        }
        return res.redirect("/currentUser");
    } catch (error) {
        let { statusCode, message } = new ApiError ( 500, "Internal server error" );
        return res.render( "error.ejs", { statusCode, message } );
    }
});

export {
    toggleSubscription,
    removeFollower,
    unFollowFollowingUser
}