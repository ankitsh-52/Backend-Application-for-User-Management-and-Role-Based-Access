# Backend Application for User Management and Role-Based Access

## Overview

This project is a comprehensive backend application built using Node.js, Express, and MongoDB. It showcases essential backend development skills, including user authentication, role-based access control, session management, and CRUD operations. The project is designed to demonstrate backend capabilities for a fresher position and can serve as a foundation for more advanced applications.

## Features

- **User Authentication:**
  - Sign Up
  - Login
  - Logout
  - Password Reset (via email)

- **Session Management:**
  - Secure session handling using cookies.
  - Persistent login sessions.

- **CRUD Operations:**
  - Create, Read, Update, and Delete operations for user profiles.

- **File Uploading:**
  - Supports multi-file uploads with validation.
  - Stores files securely and integrates with cloud storage.

- **Data Validation:**
  - Comprehensive input validation for forms (sign-up, login, etc.)

- **Database Security:**
  - Secure storage of passwords using hashing.

- **API Development:**
  - RESTful API design for user management.
  - JSON-based API responses.

## Technology Stack

- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express.js**: Web framework for Node.js to build the server-side application.
- **MongoDB**: NoSQL database for storing user data and other application-related data.
- **Mongoose**: ODM for MongoDB to interact with the database in a structured way.
- **bcrypt**: Library for hashing passwords.
- **jsonwebtoken**: Library for creating and verifying JSON Web Tokens (JWT) for authentication.
- **Nodemailer**: Module for sending emails, used in the password reset feature.
- **dotenv**: Module for managing environment variables.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally or on a cloud service like MongoDB Atlas
- A GitHub account for version control and repository management

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

2. **Install dependencies::**
    npm install

3. **Create a .env file in the root directory and add the following environment variables:**
    - PORT=8000
    - MONGODB_URI=
    - ACCESS_TOKEN_SECRET=
    - ACCESS_TOKEN_EXPIRY=1h
    - REFRESH_TOKEN_SECRET=
    - REFRESH_TOKEN_EXPIRY=1d
    - CLOUDINARY_CLOUD_NAME=
    - CLOUDINARY_API_KEY=
    - CLOUDINARY_SECRET_KEY=
    - CORS_ORIGIN=*

4. **Run the application:**
    cd src
    nodemon index.js
