import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import EventApplication from '../models/EventApplication.js';
import Event from "../models/Event.js";
import upload from "../middleware/upload.js"; // Cloudinary middleware

const router = express.Router();

// POST /api/event-applications → upload qualification PDF
router.post(
  '/',
  authenticateToken,
  upload.single('qualificationFile'), // Cloudinary
  async (req, res) => {
    try {
      const { eventId, name, age, contactEmail, phone } = req.body;
      if (!eventId || !name || !age || !contactEmail || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const qualificationFile = req.file ? req.file.path : null; // Cloudinary URL

      const application = new EventApplication({
        userId: req.user.id,
        eventId,
        name,
        age,
        contactEmail,
        phone,
        qualificationFile,
        qualificationFileName: req.file ? req.file.originalname : null,
      });

      await application.save();
      res.json({ message: 'Application submitted successfully', application });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit application' });
    }
  }
);

// Get applications for the logged-in user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const applications = await EventApplication.find({ userId: req.user.id })
      .populate('eventId')
      .sort({ createdAt: -1 });
    
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// PATCH /api/event-applications/:id/status → Update application status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['cancelled', 'approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const app = await EventApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    if (req.user.role === 'ORG_ADMIN') {
      const event = await Event.findById(app.eventId);
      if (!event || event.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not allowed to update application for this event' });
      }
    }

    app.status = status;
    await app.save();

    res.json({ message: `Application status updated to ${status}`, application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE /api/event-applications/:id → Delete application
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const app = await EventApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!app) return res.status(404).json({ error: 'Application not found' });

    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// GET /api/event-applications/event/:eventId
router.get('/event/:eventId', authenticateToken, async (req, res) => {
  try {
    const applications = await EventApplication.find({ eventId: req.params.eventId })
      .populate("userId", "name email");
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;
