import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { authenticateToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Get logged-in user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// In your userRoutes.js or similar
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      // Fetch user from DB to access their role
      const user = await User.findById(req.user.id);
      if (!user) return cb(new Error("User not found"));

      let dirName = "profilePics"; // default

      if (user.role === "VOLUNTEER") {
        dirName = "vprofilePics";
      }

      const uploadPath = path.join("uploads", dirName);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    } catch (err) {
      console.error("Error in multer storage destination:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});


const upload = multer({ storage });

// Update profile
router.put(
  "/update",
  authenticateToken,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { name, email, contactEmail, phone, aboutInfo, birthday, gender, address, city, removeProfilePic } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (name) user.name = name;
      if (email) user.email = email;
      if (contactEmail !== undefined) user.contactEmail = contactEmail;
      if (phone !== undefined) user.phone = phone;
      if (aboutInfo !== undefined) user.aboutInfo = aboutInfo;
      if (birthday !== undefined) user.birthday = birthday;
      if (gender !== undefined) user.gender = gender;
      if (address !== undefined) user.address = address;
      if (city !== undefined) user.city = city;

      // Build absolute path helper
      const getAbsolutePath = (relativePath) => {
        return path.join(process.cwd(), relativePath.replace(/^\//, ""));
      };

      // Remove profile pic
      if (removeProfilePic === "true" && user.profilePic) {
        const oldPath = getAbsolutePath(user.profilePic);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
        user.profilePic = null;
      }

      // New profilePic upload
     if (req.file) {
        if (user.profilePic) {
          const oldPath = getAbsolutePath(user.profilePic);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        const uploadDir = user.role === "VOLUNTEER" ? "vprofilePics" : "profilePics";
        user.profilePic = `/uploads/${uploadDir}/${req.file.filename}`;
      }

      await user.save();
      res.json({ message: "Profile updated", user });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
