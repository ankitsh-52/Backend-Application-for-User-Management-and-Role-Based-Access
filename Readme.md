# ProfilePix

## Overview

ProfilePix is a social platform where users can create profiles, share images, follow other users, and interact through likes and comments. It’s built to demonstrate backend capabilities, providing secure authentication, authorization, and efficient data management.


## Features

- **User Authentication**: Sign up/login, email OTP verification via Gmail.
- **Profile Management**: User profiles display personal image galleries, followers, and following lists.
- **Follow/Unfollow System**: Users can follow/unfollow others with real-time status updates.
- **Image Handling**: Users can upload, delete images, with real-time like and comment options.
- **Interactive UI**: Modals and dynamic routing enable a smooth user experience for managing connections and interactions.
- **Error Handling**: Custom error handling provides user-friendly feedback for better experience.


## Technology Stack
- **Backend**:          Node.js, Express.js
- **Database**:         MongoDB, Mongoose
- **Authentication**:   JWT for token-based state management, Nodemailer for OTP verification
- **Frontend**:         EJS templating engine, HTML, CSS, Bootstrap (for responsive modals and layout)
- **Other**:            Git (version control), RESTful APIs


### Prerequisites
1. **Node.js** - Make sure Node.js is installed on your system. [Download Node.js](https://nodejs.org)
2. **MongoDB** - Set up a MongoDB database locally or through MongoDB Atlas.
3. **Gmail API Credentials** - Required for Gmail authentication and sending OTP emails.
4. **Environment Variables** - Configure your `.env` file with the following variables:
    `PORT`                    : 8000
    `MONGODB_URI`             : mongodb://localhost:27017/videoTube
    `ACCESS_TOKEN_SECRET`     :
    `ACCESS_TOKEN_EXPIRY`     :
    `REFRESH_TOKEN_SECRET`    :
    `REFRESH_TOKEN_EXPIRY`    :
    `CLOUDINARY_CLOUD_NAME`   : 
    `CLOUDINARY_API_KEY`      : 
    `CLOUDINARY_SECRET_KEY`   : 
    `CLOUDINARY_SECRET_KEY`   : 
    `CORS_ORIGIN`             : 
    `EMAIL_HOST`              : smtp.gmail.com
    `EMAIL_PORT`              : 465
    `EMAIL_PASS`              :
    `EMAIL_USER`              :
    `EMAIL_SERVICE`           : ="gmail"


## Getting Started
1. **Clone the repository**: git clone

2. **Install dependencies**: npm install

3. **Set up environment variables** in a `.env` file (see prerequisites).

4. **Run the application**:
  - cd src
  - nodemon index.js

5. **Access the app**:
   Open `http://localhost:port` in your browser to explore ProfilePix.