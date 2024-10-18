import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const currentUserCheck = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            // req.CheckCurrentUser = currentUser;
            res.locals.currUser = null;
            return next();
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id, { password: 0, refreshToken: 0 });

        if (!user) {
            // req.CheckCurrentUser = currentUser;
            res.locals.currUser = null;
            return next(); // Stop if no user is found
        }
        res.locals.currUser = user;
        return next();
    } catch (error) {
        res.locals.currUser = null;
        return next();
    }
})

export{
    currentUserCheck
}