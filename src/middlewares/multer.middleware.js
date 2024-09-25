import multer from "multer";
// import path from 'path';

// const dir = path.join(__dirname, 'public/temp');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {     // cb: callBack
        cb(null, "../public/temp") //'./public/temp' is the directory where files will be stored temporarily
    },
    filename: function (req, file, cb) 
    {
        cb(null, file.originalname) // it will return file original path with name.
    }
})
// console.log(file);   use it to see different options provided by file of multer

const upload = multer( { storage } );
export { upload };
