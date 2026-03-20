import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

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


router.put(
  "/update",
  authenticateToken,
  upload.single("profilePic"), 
  async (req, res) => {
    try {
      const {
        name,
        email,
        contactEmail,
        phone,
        aboutInfo,
        birthday,
        gender,
        address,
        city,
        removeProfilePic,
      } = req.body;

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

    
      if (removeProfilePic === "true") {
        user.profilePic = null;
      }

   
      if (req.file && req.file.path) {
        user.profilePic = req.file.path; // Cloudinary URL
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
