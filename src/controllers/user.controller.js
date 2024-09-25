import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
// import { use } from "bcrypt/promises.js";
// import { use } from "bcrypt/promises.js";
// import req from "express/lib/request.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { json } from "express/lib/response.js";

// It is written as a separate because we need to use it multiples time we can use it inside but it is better.
const generateAccessAndRefreshTokens = async ( userId ) => {
    try {
        const user = await User.findById( userId );
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;   
        /* The refresh token is assigned to the refreshToken 
        field of the user document. This modifies the object in 
        memory but does not yet save the change to the database.
        */

        await user.save( { validateBeforeSave : false } ); //? here the refresh token needed to be saved in the DB and for that we can save using the save method. 

        //! why validateBeforeSave : false is used read below in comments.
        /* This line saves the modified user object (with the 
        new refresh token) to the database. The validateBeforeSave flag controls whether the document should be validated before saving:

        Validation: By default, Mongoose validates the fields of the document (such as checking required fields or correct data types) before saving.
        If validateBeforeSave is true (or omitted, as it's the default), Mongoose will run validations before saving the document.
        If false, Mongoose skips validation and just saves the document as-is.
        */

        return { accessToken, refreshToken };

    } catch ( error ) {
        throw new ApiError( 500, "Something went wrong while generating tokens" )
    }
}

const UserRegistration = asyncHandler(async(req, res) => {
    res.render( "registration.ejs" );
});

//User registration controller
const registerUser = asyncHandler(async(req, res) => {

    //TODO console.log(req.body)
    const {fullName, email, username, password} = req.body;
    // console.log(fullName, email, username, password);

    //checking for valid field entry.
    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields (full name, email, username, and password) are required.");
    }
    
    //Checking for existed user.
    //TODO console.log(existedUser)
    const existedUser = await User.findOne( {
        $or: [ { username }, { email } ]
    } )

    if( existedUser ) { throw new ApiError( 409, "User already exists" )};

    // upload avatar and cover image
    //TODO console.log(req.files)

    // console.log(req.files); It's output is below
//       avatar: [
//     {
//       fieldname: 'avatar',
//       originalname: 'ankit_img.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: '../public/temp',
//       filename: 'ankit_img.jpg',
//       path: '..\\public\\temp\\ankit_img.jpg',
//       size: 39106
//     }
//   ]

    //gets files location

    
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    const avatarLocalPath = req.files?.avatar ? req.files.avatar[0].path : null;
    const coverImageLocalPath = req.files?.coverImage ? req.files.coverImage[0].path : null;


    //* ?.(Optional chaining):This ensures that if req.files or avatar[0] is undefined or null, it won't throw an error. It will simply return undefined. This is useful for avoiding crashes when certain fields might not exist.

    if( !avatarLocalPath ){ throw new ApiError( 400, "Avatar file is missing" ) }

    //Upload on cloudinary
    const avatar = await uploadOnCloudinary ( avatarLocalPath );

    const coverImage = await uploadOnCloudinary ( coverImageLocalPath );

    if( !avatar ) {  // avoid DB crash if avatar is not present.
        throw new ApiError( 400, "Avatar is required" );
    }

    const user = await User.create 
    ( {
        fullName,  
        avatar: avatar.url,
        coverImage: coverImage?.url || "",  
        /*? Here we 1st check whether the user has given 
        coverImage or not as it is not required file, & since it is not req file we have previously not checked it like the avatar, therefore 'coverImage?.url' ?-> it means if available use else not leave it empty.
        */

        email,
        password,
        username : username.toLowerCase()
    } )

    //It is used to check whether the user is empty or null.
    const createdUser = await User.findOne 
    ( 
        { _id : user._id }, // Search by user ID
        { password : 0, refreshToken : 0 } // Exclude password and refreshToken
    );

    if(!createdUser){
        throw new ApiError (500, "Error while user registration")
    }

    //TODO understand its use, 2 status codes.
    // res.render("registration", { user } );
    res.redirect("login/user");
    // return res.status(201).json(
    //     new ApiResponse( 200, createdUser, "User registered successfully" )
    // )

});

const allUsers = asyncHandler(async(req, res) => {
    let allUsers = await User.find();
    // console.log(allUsers);
    
    res.render( "index" , { allUsers });
});

const loggedInUser = asyncHandler(async(req, res) => {
    res.render( "login.ejs" );
});

const loginUser = asyncHandler( async ( req, res ) => {
    /* 1. username or email
    2. find the user
    3. password & matching using isPasswordCorrect mongoose MW
    4. accessToken & refreshToken 
    5.  send using cookie
    6. successful log in
    */

    const { email, username, password } = req.body;
    if( !( username || email ) )
    {
        throw new ApiError ( 400, "username or email is required" );
    }

    const userExist = await User.findOne( { $or : [ { email }, { username } ] } );
    if( !userExist ) {
        throw new ApiError ( 404, "User doesn't exists" );
    };

    //! The custom methods written in the models file must be use on instances of User i.e userExist as these methods are for instances not from the mongoose.
    const isPasswordValid =  await userExist.isPasswordCorrect( password );
    if( !isPasswordValid ) {
        throw new ApiError ( 401, "Password incorrect" );
    };

    const { accessToken, refreshToken } =  await generateAccessAndRefreshTokens ( userExist._id ); // Here await is used as inside this method DB operations are happening.

    //* It’s important because while you need to return user data for the response, you should not expose sensitive information like passwords or tokens.
    const loggedInUser = await User.findById({ _id: userExist._id }, { password : 0, refreshToken :0 } ); 
    
    //? This step is basically a security step
    /*  These options define how the tokens (accessToken and refreshToken) will be sent as cookies:
    >> httpOnly: This ensures that the cookie cannot be accessed via JavaScript on the frontend, providing an extra layer of security.
    >> secure: Ensures the cookie is only sent over HTTPS, adding another level of security. 
    */
    
    const options = {   
        //It is used to make the cookie only server modifiable as by default anyone can modify it.
        httpOnly : true,
        secure : true
    }

    return res
    .cookie( "accessToken", accessToken, options )  //Here the res can access the cookie as we have injected the cookie-parser MW.
    .cookie ( "refreshToken", refreshToken, options )
    .redirect("/currentUser")
    // .json (
    //     new ApiResponse (
    //         200,
    //         {   //This scope is the data of the ApiResponse class we have made.
    //             //TODO why tokens are send to the user & what is this user is this key .
    //             user : loggedInUser, accessToken, refreshToken
    //         },
    //         "User logged in successfully"
    //     )
    // )
});

const getCurrentUser = asyncHandler( async( req, res ) => {
    let user = req.user;
    if (!user) {
        throw new ApiError ( 404, "User not found" );
    }
    res.render( "user.ejs", { user } )
});

//? To logout user we need to 1.) clear the cookie, 2.) remove the tokens and 3.) get the loggedIn user data to logout itself only to do this we have to make our own MW.

const logoutUser = asyncHandler ( async ( req, res ) => { 
    await User.findByIdAndUpdate(
        req.user._id,       //the req.user is MW
        {
/* $set: This is a MongoDB operator used to set the value of a field in a document.
refreshToken: undefined: You are setting the refreshToken field to undefined, effectively removing or invalidating the refresh token associated with the user. This is a security measure to ensure that once the user logs out, their refresh token cannot be used to generate new access tokens.*/
            $set: {
                refreshToken : undefined    
            }
        },
        {
/* new: true: This option ensures that the updated document returned by the findByIdAndUpdate method, is 
not the original one before the update. However, in this case, since you aren't using the returned 
document, it's not strictly necessary, but it's often used to ensure the function behaves predictably.
*/
            new: true
        }
    )

    /* In short, even though you're clearing the cookie (and it seems like nothing is left), you need to 
    pass the same options (httpOnly, secure) to ensure the cookie is correctly identified and securely 
    removed, following the same security rules under which it was initially set.
    */
    const options  = {  
        httpOnly: true,
        secure : true
    }

    console.log("Successfully logged out");
    return res
    .status( 200 )
    .clearCookie( "accessToken", options )
    .clearCookie( "refreshToken", options )
    // .json( new ApiResponse( 200, {}, "User logged out successfully" ) );
    .redirect("/login/user")
});

const refreshAccessToken = asyncHandler( async( req, res ) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken; // req.body.refreshToken is for mobile

    if( !refreshAccessToken ){
        throw new ApiError ( 401, "Unauthorized request" );
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = User.findById( { _id : decodedToken._id } );
    
        if( !user ){
            throw new ApiError ( 400, "invalid request" );
        }
    
        if( decodedToken !== user.refreshToken ){
            throw new ApiError ()
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        return res
        .status (200)
        .cookie ( "accessToken", accessToken, options )
        .cookie( "refreshToken" ,newRefreshToken, options )
        .json(
            new ApiResponse(
                200,
                //todo check whether we need to use refreshToken
                ( accessToken, newRefreshToken ),
                "Access token refreshed "
            )
        )
    } catch (error) {
        throw new ApiError ( 401,  "**Invalid Refresh Token");
    }

});

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    let { newPassword, currentPassword } = req.body;

    const user = await User.findById(req.user?.id);

    if( !isPasswordCorrect(currentPassword) ){
        throw new ApiError( 401, "Unauthorized Access" );
    }

    user.password = newPassword;    // when we save the pwd then the pre hook on the pwd also executes & it handles the encryption
    await user.save( { validateBeforeSave : false } );

    return res
    .status ( 200 )
    .json( new ApiResponse( 200,{}, "Password Changed Successfully" ) );

});

//todo file update For file update make separate controller.
const updateAccountDetails = asyncHandler( async(req, res) => {
    const { fullName, email } = req.body;

    if( !( email & fullName ) ){
        throw new ApiError (400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate( 
        { _id: req.user?._id },
        {
            $set: {
                fullName,   //Both way is good
                email: email,
            }
        },
        {
            new: true,
        },
        {
            password : 0,
        }
    )

    return res
    .status (200)
    .json( new ApiResponse( 200, user, "Account details updated successfully " ) )
});

const updateUserAvatar = asyncHandler( async( req, res) =>{ 
    const avatarLocalPath = req.file?.path;
    if( !avatarLocalPath ){
        throw new ApiError( 400, "Avatar file is missing" )
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if( !avatar.url ){
        throw new ApiError( 400, "Error while updating avatar" )
    }


    const user = await User.findByIdAndUpdate({_id : req.user?._id}, 
        {
            $ste:{
                avatar : avatar.url
            }
        },
        {
            password : 0,
        },
        {
            new : true,
        }
    )
    await user.save( { validateBeforeSave : false } );

    //todo delete old avatar image.

    return res
    .status( 200 )
    .json(
        new ApiResponse( 200, user, "Avatar updated successfully" )
    )
});

const updateCoverImage = asyncHandler( async( req, res )=>{
    const coverImageLocalPath = req.file?.path;
    if( !coverImageLocalPath ){
        throw new ApiError(400, "No cover image file");
    }

    coverImageUrl = await uploadOnCloudinary( coverImageLocalPath );

    if( !coverImageUrl ){
        throw new ApiError( 401, "Error in uploading the cover image" )
    }

    const user = User.findByIdAndUpdate( 
        {_id : req.user?._id}, 
        {
            $set:{
                coverImage : coverImageUrl.url
            }
        },
        {
            new : true
        },
        {
            password : 0
        }
    );

    await user.save( { validateBeforeSave : false } );

    return res
    .status( 200 )
    .json( 
        new ApiResponse( 200, user, "Cover image updated successfully" )
    )
});

const getUserChannelProfile = asyncHandler( async( req, res )=>{
    const { username } = req.params;

    if( !username?.trim() ){   //todo why use trim()
        throw new ApiError( 400, "username is missing" )
    }

    const channel = await User.aggregate([
        {
            //This stage filters the User collection to find users whose username matches the provided username.
            $match: {
                username: username?.toLowerCase()   //optional chaining is just to make sure again.
            }
        },
        {   //? to count the no of subscribers
            $lookup : {
                from: "subscriptions",
                localField: "_id", //This is the current user's _id. It's the user whose subscribers you're counting.
                foreignField: "channel",
                as: "subscribers"
                /* Each document in the subscribers array will 
                contain:
                >>The subscribedBy field, which is the ID of 
                the user who subscribed to the channel.
                >>The channel field, which is the ID of the channel being subscribed to.*/
            }
        },
        {
            $lookup:{   // /? to count the no of user, he subscribed
                from:"subscriptions",
                foreignField: "subscribedBy",
                localField: "_id",
                as: "subscribed"
            }
        },
        {
            $addFields: { // it adds new fields
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribed"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscribed"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: { //it sends only the selected info.
                fullName : 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount:1,
                avatar: 1,
                coverImage: 1,
                email: 1,
            }
        }
    ])

    //todo console.log(channel) & what data type does return in aggregate pipeline
    
    if( !channel?.length ){
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse ( 200, channel[0], "user channel fetched successfully" )
    )

});

export {
    UserRegistration,
    registerUser,
    allUsers,
    loginUser,
    loggedInUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserChannelProfile,
}