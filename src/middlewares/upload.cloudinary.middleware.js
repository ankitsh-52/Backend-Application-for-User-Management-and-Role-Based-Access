import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler";

const uploadToCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("File uploaded successfully", response.url);
        fs.unlinkSync(localFilePath);   // Remove temp file after upload
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Error uploading to Cloudinary", error);
        return null;
    }
}

// Middleware to handle file upload
// const uploadFile = async (req, res, next) => {
//     try {
      // The file path is where Multer stored the file temporarily
//       const file = req.file.path;
      
      // Upload file to Cloudinary
//       const result = await uploadToCloudinary(file, 'uploads_folder'); // 'uploads_folder' is the folder name on Cloudinary
  
      // Save the Cloudinary URL in the response for further use
//       req.file.cloudinaryUrl = result.secure_url;
  
//       next();  // Move on to the next middleware or request handler
//     } catch (error) {
//       console.error("Error uploading to Cloudinary", error);
//       res.status(500).json({ error: "File upload failed" });
//     }
//   };

export { uploadToCloudinary };