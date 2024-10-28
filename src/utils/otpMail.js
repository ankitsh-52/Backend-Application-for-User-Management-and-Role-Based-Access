import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';
// import { asyncHandler } from "../utils/asyncHandler.js"
import bcrypt  from "bcrypt"
// import { ApiError } from './apiErrors.js';
import { ApiResponse } from './ApiResponse.js';

configDotenv();

const mailAuthentication = (async (options) => {
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

        let otpRandom = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: options.to,
            subject: options.subject,
            text: `Your OTP number is: ${otpRandom}`
        };
        await transporter.sendMail(mailOptions);
        
        console.log("Email Sent Successfully!!!");
        const salt = await bcrypt.genSalt(10);
        let hashedOtp = await bcrypt.hash(otpRandom.toString(), salt);
        return hashedOtp;

    } catch (error) {
        console.error('Error sending email: ', error);
        return null;
    }
});

export { mailAuthentication };
