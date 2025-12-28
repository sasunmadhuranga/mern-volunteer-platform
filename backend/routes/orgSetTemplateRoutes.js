import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, isOrgAdmin } from '../middleware/authMiddleware.js';
import OrgCertificateTemplate from '../models/OrgCertificateTemplate.js';
import User from '../models/User.js'; // import User model

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return cb(new Error("User not found"));

      const uploadPath = path.join("uploads", "signatures");
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

// Route to select template and upload signature
router.post(
  "/select-template",
  authenticateToken,
  isOrgAdmin,
  upload.single("signature"),
  async (req, res) => {
    try {
      const { templateId } = req.body;
      if (!templateId) return res.status(400).json({ message: "Template ID is required" });

      let orgTemplate = await OrgCertificateTemplate.findOne({ orgId: req.user.orgId });
      if (!orgTemplate) orgTemplate = new OrgCertificateTemplate({ orgId: req.user.id });


      orgTemplate.templateId = templateId;
      if (req.file) orgTemplate.signature = `/uploads/signatures/${req.file.filename}`;

      await orgTemplate.save();
      res.json(orgTemplate);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save template selection" });
    }
  }
);

// Get current template for organization
router.get("/current", authenticateToken, isOrgAdmin, async (req, res) => {
  try {
    const orgTemplate = await OrgCertificateTemplate.findOne({
      orgId: req.user.id,
      isActive: true,
    }).populate("templateId");

    if (!orgTemplate) return res.status(404).json(null);

    res.json(orgTemplate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


export default router;
