import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { User } from "../models/user.model.js";

configDotenv();

const checkIfLoggedIn = asyncHandler(async (req, res, next) => {
    try {
        // Check if token is available from cookies or authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token: ", token);

        if (!token) {
            return res.redirect("/login"); // Stop here if token is missing
        }

        // Verify token and extract user info
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id, { password: 0, refreshToken: 0 });

        if (!user) {
            return res.redirect("/login"); // Stop if no user is found
        }
        // res.locals.currUser = user;
        req.user = user;
        // res.locals.currUser = req.user;
        // console.log(res.locals.currUser, "@@@^^&&&");
        next();
    } catch (error) {
        console.log("Error in middleware:", error.message);
        return res.redirect("/login"); // Redirect to login if error occurs (e.g., token verification fails)
    }
});

export { checkIfLoggedIn };
