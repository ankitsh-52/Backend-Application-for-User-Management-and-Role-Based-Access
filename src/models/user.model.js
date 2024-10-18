import mongoose, {Schema} from "mongoose"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"  //JWt is a bearer token i.e who ever has the key can get the data.

const userSchema = new Schema( {
    watchHistory : [{
        type : Schema.Types.ObjectId,
        ref : "Video",
}   ],
    username : {
        type : String,
        required: true,
        unique : true,
        lowercase : true,
        index : true    //! Whenever it is required to search on any field then making 'index : true' optimizes it.
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        // index : true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    avatar: {
        type : String,  //cloudinary url
        required : true,
    },
    avatarPublicId: {
        type : String,
    },
    coverImage : {
        type : String,
    },
    password : {
        type : String,
        required: [true, 'Password is required'],
    },
    refreshToken: {
        type : String,
    }
}, {timestamps : true} )

//? This function is a Mongoose middleware that is executed before a document (in this case, a user) is saved to the database. It is used to hash the user's password before saving it, ensuring that passwords are not stored in plain text.  


/* 
?if(!this.isModified("password")) return next():
>> This line checks if the password field has been modified. The 
isModified() method checks if a particular field (in this case, 
"password") has been changed since the last save.

>> If the password hasn't been modified, the function simply calls next() to continue without re-hashing the password. This is important because you don't want to re-hash the password if it's already hashed.
*/


userSchema.pre("save", async function  (next) {
    if(!this.isModified("password")) return next()      //! Here isModified() is pre available method and needs a string as an argument.
    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
} )    //! Don't use arrow function inside save hook as arrow function doesn't have its own this.


// This function is a instance method defined on the user schema. It is used to compare a given password with the hashed password stored in the database to verify if they match. This is typically used during login to check if the provided password is correct.


/* 

? userSchema.methods.isPasswordCorrect:
userSchema.methods allows you to define instance methods ( In Mongoose, an instance method is a method that is defined on the schema and is available on instances (documents) of that schema.) for documents created from this schema. These methods are available on instances of the model (i.e., individual documents).

? async function (password):
This is an asynchronous function that takes password as an argument. This password is the one the user provides during login.

? return await bcrypt.compare(password, this.password):
>> bcrypt.compare() is a method from the bcrypt library that    compares the plaintext password provided (password) with the hashed password stored in the database (this.password).
>> The compare method returns a promise that resolves to true if the passwords match and false if they don't.
>> The await keyword is used to wait for the promise to resolve, ensuring that the result of the comparison is returned.
*/

/* Here '.methods' is instance method used to write custom 
methods on any schema's instance. In Mongoose, an instance 
method is a method that is defined on the schema and is 
available on instances (documents) of that schema. Unlike 
static methods, which are called on the model itself, instance 
methods are called on individual documents created from the 
model.
*/

userSchema.methods.isPasswordCorrect = async function ( password ) {
    return await bcrypt.compare( password, this.password ) //bcrypt.compare takes two parameter 1st is user entered password and 2nd is hashed pwd from DB to get it use 'this' It returns a boolean value.
}

//! How to use userSchema.methods.isPasswordCorrect() CHATGPT ex
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }

//     const isMatch = await user.isPasswordCorrect(password);

//     if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid password' });
//     }

    // Proceed with generating tokens or other login logic
// });




//? This function is an instance method that generates an access token for the user. Access tokens are typically used for authentication and authorization, allowing the user to access protected resources or perform actions on behalf of the user.


userSchema.methods.generateAccessToken = function() //? Read from miscellaneous doc for details
{
    return jwt.sign
    (
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//! Simple use case example of generateAccessToken function()
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !await user.isPasswordCorrect(password)) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const accessToken = user.generateAccessToken();
//     res.status(200).json({ accessToken });
// });


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign
    (
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

//! Simple use case example of generateRefreshToken function()
// app.post('/refresh-token', async (req, res) => {
//     const { refreshToken } = req.body;

//     try {
//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//         const user = await User.findById(decoded._id);

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         const newAccessToken = user.generateAccessToken();
//         res.json({ accessToken: newAccessToken });
//     } catch (error) {
//         res.status(403).json({ message: 'Invalid refresh token' });
//     }
// });


export const User = mongoose.model("User", userSchema);