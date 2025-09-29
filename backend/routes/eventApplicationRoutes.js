import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import EventApplication from '../models/EventApplication.js';
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/qualifications');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /api/event-applications
router.post('/', authenticateToken, upload.single('qualificationFile'), async (req, res) => {
  try {
    const { eventId, name, age, contactEmail, phone } = req.body;
    if (!eventId || !name || !age || !contactEmail || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const qualificationFile = req.file ? `/uploads/qualifications/${req.file.filename}` : null;

    const application = new EventApplication({
      userId: req.user.id,
      eventId,
      name,
      age,
      contactEmail,
      phone,
      qualificationFile,
    });

    await application.save();
    res.json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

export default router;
