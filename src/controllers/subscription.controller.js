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
        let alreadySubscribed = await Subscription.findOne
        ({$or : [
            { $and : [{ subscribedBy : subscribedByUser._id }, { subscribedTo : subscribedToUser._id }] 
            },
            {
                $and : [{ subscribedTo : subscribedByUser._id }, { subscribedBy : subscribedToUser._id }]
            }
        ]});
        
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

const getUserFollowerChannel = asyncHandler( async(req, res) => {
    let user = req.user;
    console.log("Checking subscription user", user);
    if(user){
        let followerData = await Subscription.find({ subscribedTo : user._id }, { subscribedBy : 1 }).countDocuments({ subscribedTo : user._id });
        console.log("User Follower data: ", followerData);
    }
} );

const getUserFollowingChannels = asyncHandler( async(req, res) => {
    
} )

const followerFollowingToggle = asyncHandler(async(req, res) => {
    let { id } = req.params;
    try {
        let subscribedToUser = await Subscription.findById(id).populate("subscribedTo", "username");
        console.log("subscribedTo user is: ", subscribedToUser);
        
        let currUser = res.locals.currUser;
        
    } catch (error) {
        
    }
})

export {
    toggleSubscription,
    getUserFollowingChannels,
    getUserFollowerChannel
}