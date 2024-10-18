import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { User } from "../models/user.model.js";

configDotenv();

//TODO understand this 
const verifyJWT = asyncHandler( async( req, res, next ) => {
    try {
    /* From Cookies (req.cookies?.accessToken)
    >> This part checks if the accessToken is stored in the cookies.
    >>In many applications, httpOnly cookies are used to store the token for security reasons since they are not accessible via JavaScript.
    >>req.cookies?.accessToken tries to retrieve the token from the cookies. The ?. (optional chaining) ensures that no error occurs if the cookies object doesn't exist. 

    2. From the Authorization Header (req.header( "Authorization" )?.replace( "Bearer ", "" ))
    >>This checks if the token is sent in the Authorization header as a Bearer token.
    >>Commonly, APIs pass tokens in headers for authorization, so this part extracts the token from the Authorization header by removing the "Bearer " prefix using .replace("Bearer ", "").
    >>req.header("Authorization")?.replace("Bearer ", "") gets the token by first checking if the Authorization header is present (again using optional chaining ?.).
    */
    
    const token = req.cookies?.accessToken || req.header( "Authorization" )?.replace( "Bearer ", "" ) 
    if(!token){
            res.redirect( "/login" );
        }
    const decodedToken = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET )
    
    const user = await User.findById( decodedToken?._id, { password : 0, refreshToken : 0 } );
    if( !user ){
        //Todo discuss about frontend
        throw new ApiError( 401, "Invalid Access Token" )
        // res.redirect( "/login/user" );
    }
    // res.locals.currUser = user; // to use in ejs template.

    if(user) {
        res.locals.currentUser = user;
    }

    req.user = user;   
    // req.user: This creates a new property on the req object named user.
    //By setting req.user to the user object, you're essentially making the user's data available to the rest of your request handling pipeline. This is often used for authorization, personalization, or other tasks that require information about the authenticated user.

    next();
    } 
    catch (error) {
        // throw new ApiError( 401, error?.message || "Invalid access token" );
        let { statusCode, message } = new ApiError ( 401, "You are logged out" );
        return res.render( "error.ejs", { statusCode, message } );
    }
});

export  { verifyJWT };