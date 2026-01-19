import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "general";
    let resource_type = "image"; // default

    if (file.fieldname === "profilePic") {
      folder = "profilePics";
      resource_type = "image";
    } else if (file.fieldname === "qualificationFile") {
      folder = "qualifications";
      resource_type = "raw"; // IMPORTANT: PDF/DOCX/other files
    } else if (file.fieldname === "signature") {
      folder = "signatures";
      resource_type = "image";
    }

    // Remove extension from public_id; Cloudinary handles it
    const public_id = `${req.user ? req.user.id : "unknown"}-${Date.now()}`;

    return {
      folder,
      resource_type,
      public_id,
    };
  },
});

export default multer({ storage });
