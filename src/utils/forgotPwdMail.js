import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
import randomString from 'randomstring';
import bcrypt  from "bcrypt";
// import { asyncHandler } from "../utils/asyncHandler.js"
// import { ApiError } from './apiErrors.js';
// import { ApiResponse } from './ApiResponse.js';


configDotenv();

const forgotMailAuthentication = (async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        });

        let password = randomString.generate({
            length: 12,
            charset: 'alphabetic'
        });
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: options.to,
            subject: options.subject,
            text: `${options.text} Your new password is: ${password}.`
        };
        await transporter.sendMail(mailOptions);
        
        console.log("Forgot pwd Email Sent Successfully!!!");
        const salt = await bcrypt.genSalt(10);
        let hashedPwd = await bcrypt.hash(password.toString(), salt);
        return hashedPwd;
    } catch (error) {
        console.error('Error sending email: ', error);
        return null;
    }
});

export { forgotMailAuthentication };
