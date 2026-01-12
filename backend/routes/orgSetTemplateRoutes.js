import express from 'express';
import path from 'path';
import fs from 'fs';
import { authenticateToken, isOrgAdmin } from '../middleware/authMiddleware.js';
import OrgCertificateTemplate from '../models/OrgCertificateTemplate.js';
import User from '../models/User.js'; // import User model
import upload from '../middleware/upload.js';

const router = express.Router();

// Select template and upload signature
router.post(
  "/select-template",
  authenticateToken,
  isOrgAdmin,
  upload.single("signature"), // Cloudinary
  async (req, res) => {
    try {
      const { templateId } = req.body;
      if (!templateId) return res.status(400).json({ message: "Template ID is required" });

      let orgTemplate = await OrgCertificateTemplate.findOne({ orgId: req.user.id });
      if (!orgTemplate) orgTemplate = new OrgCertificateTemplate({ orgId: req.user.id });

      orgTemplate.templateId = templateId;

      if (req.file && req.file.path) {
        orgTemplate.signature = req.file.path; // Cloudinary URL
      }

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
