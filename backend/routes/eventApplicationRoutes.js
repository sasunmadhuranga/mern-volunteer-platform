import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import EventApplication from '../models/EventApplication.js';
import Event from "../models/Event.js";
import upload from "../middleware/upload.js"; // Cloudinary middleware
import { v2 as cloudinary } from "cloudinary";

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

      const qualificationFile = req.file
        ? {
            url: req.file.path,          // secure Cloudinary URL
            public_id: req.file.public_id, // REAL public_id
            format: req.file.format,      // pdf / jpg / png
            resource_type: req.file.resource_type,
          }
        : null;


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

    if (app.qualificationFile?.public_id) {
      await cloudinary.uploader.destroy(
      app.qualificationFile.public_id,
      { resource_type: app.qualificationFile.resource_type }
    );
    }


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

router.get("/download/:id", authenticateToken, async (req, res) => {
    const app = await EventApplication.findById(req.params.id);
    if (!app?.qualificationFile?.public_id) return res.status(404).send("File not found");

    // Check authorization (owner or org admin)
    const isOwner = app.userId.toString() === req.user.id;
    let isOrgAdmin = false;
    if (req.user.role === "ORG_ADMIN") {
        const event = await Event.findById(app.eventId);
        if (event && event.createdBy.toString() === req.user.id) isOrgAdmin = true;
    }
    if (!isOwner && !isOrgAdmin) return res.status(403).send("Unauthorized");

    // Use Cloudinary signed URL
    const url = cloudinary.url(app.qualificationFile.public_id, {
        resource_type: "raw",
        type: "authenticated",  // ensures a signed URL
        attachment: true,       // force download
    });

    return res.json({ url });
});



export default router;
