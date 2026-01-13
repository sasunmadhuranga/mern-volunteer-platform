import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/:id/public", async (req, res) => {
  try {
    const org = await User.findOne({
        _id: req.params.id,
        role: "ORG_ADMIN"
    }).select("name aboutInfo profilePic contactEmail phone");

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({
      id: org._id,
      name: org.name,
      aboutInfo: org.aboutInfo,
      profilePic: org.profilePic,
      contactEmail: org.contactEmail,
      phone: org.phone,
      
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;