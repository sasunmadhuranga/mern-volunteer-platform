import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "general";
    let resource_type = "image";

    if (file.fieldname === "profilePic") {
      folder = "profilePics";
    } else if (file.fieldname === "qualificationFile") {
      folder = "qualifications";
      resource_type = "raw";
    } else if (file.fieldname === "signature") {
      folder = "signatures";
    }

    return {
      folder,
      resource_type,
      public_id: `upload-${Date.now()}`, // ✅ SAFE
    };
  },
});

console.log("Cloudinary ENV:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: !!process.env.CLOUDINARY_API_KEY,
  secret: !!process.env.CLOUDINARY_API_SECRET,
});


export default multer({ storage });

