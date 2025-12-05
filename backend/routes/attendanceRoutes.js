import express from "express";
import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import EventApplication from "../models/EventApplication.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/scan", authenticateToken, async (req, res) => {
  try {
    const { eventId, date, token } = req.body;
    const volunteerId = req.user.id;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // ---- FIXED: Correct token retrieval ----
    const correctToken = event.dailyTokens[date];
    if (!correctToken || token !== correctToken) {
      return res.status(400).json({ message: "Invalid or expired QR code" });
    }

    // Validate date range
    const scanDate = new Date(date);
    if (scanDate < event.startDate || scanDate > event.endDate) {
      return res.status(403).json({ message: "QR code is not valid for this day" });
    }

    // Validate time range
    const now = new Date();
    const eventStart = new Date(date + "T" + event.startTime);
    const eventEnd = new Date(date + "T" + event.endTime);

    if (now < eventStart || now > eventEnd) {
      return res.status(403).json({ message: "QR code scan is outside event time" });
    }

    // Approvals check
    const application = await EventApplication.findOne({
      userId: volunteerId,
      eventId,
      status: "approved",
    });

    if (!application) {
      return res.status(403).json({
        message: "You are not approved for this event",
      });
    }

    // Check if user already checked in/out today
    const existing = await Attendance.findOne({ eventId, volunteerId, date });

    let scanType = "check-in";

    if (!existing) {
      // First scan → check-in
      scanType = "check-in";
    } else {
      if (existing.scanType === "check-out") {
        return res.status(400).json({ message: "You already checked out today" });
      }
      // Second scan → check-out
      scanType = "check-out";
    }

    const attendance = await Attendance.findOneAndUpdate(
      { eventId, volunteerId, date },
      {
        eventId,
        volunteerId,
        eventApplicationId: application._id,
        date,
        scanType,
        scanTime: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.json({
      message: `Successfully recorded ${scanType}`,
      attendance,
    });

  } catch (err) {
    console.error("Attendance scan error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
