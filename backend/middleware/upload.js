import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "general";
    let resource_type = "image"; // default

    // Determine folder and type based on fieldname
    if (file.fieldname === "profilePic") {
      folder = "profilePics";
      resource_type = "image";
    } else if (file.fieldname === "qualificationFile") {
      folder = "qualifications";
      resource_type = "auto";
    } else if (file.fieldname === "signature") {
      folder = "signatures";
      resource_type = "image";
    }

    const originalExtension = file.originalname.split('.').pop(); // "pdf" or "jpg"
    const publicId = `${req.user ? req.user.id : "unknown"}-${Date.now()}.${originalExtension}`;

    return {
      folder,
      resource_type,
      public_id: publicId,  // now includes extension
    };
  },
});

// Export multer upload middleware
export default multer({ storage });


