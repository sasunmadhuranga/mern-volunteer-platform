import express from "express";
import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import EventApplication from "../models/EventApplication.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { DateTime } from "luxon";

const router = express.Router();

router.post("/scan", authenticateToken, async (req, res) => {
  try {
    const { eventId, date, token, scanType } = req.body; // frontend no longer decides
    const volunteerId = req.user.id;

    // Validate scanType
    if (!["check-in", "check-out"].includes(scanType)) {
      return res.status(400).json({ message: "Invalid scan type" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Convert dailyTokens to Map if needed
    if (!(event.dailyTokens instanceof Map)) {
      event.dailyTokens = new Map(Object.entries(event.dailyTokens || {}));
    }

    const correctToken = event.dailyTokens.get(date);
    if (!correctToken || token !== correctToken) {
      return res.status(400).json({ message: "Invalid or expired QR code" });
    }

    // Validate event date
    const scanDate = new Date(date);
    if (scanDate < event.startDate || scanDate > event.endDate) {
      return res.status(403).json({ message: "QR code not valid for this day" });
    }

    const tz = "Asia/Colombo";
    const eventStart = DateTime.fromISO(`${date}T${event.startTime}`, { zone: tz });
    const eventEnd = DateTime.fromISO(`${date}T${event.endTime}`, { zone: tz });
    const nowColombo = DateTime.now().setZone(tz);

    if (nowColombo < eventStart || nowColombo > eventEnd) {
      return res.status(403).json({ message: "QR scan is outside event time" });
    }

    // Check if volunteer is approved
    const application = await EventApplication.findOne({
      userId: volunteerId,
      eventId,
      status: "approved",
    });
    if (!application) {
      return res.status(403).json({ message: "You are not approved for this event" });
    }

    let attendance = await Attendance.findOne({ eventId, volunteerId, date });

    if (scanType === "check-in") {
      if (attendance?.checkInTime) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      if (!attendance) {
        attendance = await Attendance.create({
          eventId,
          volunteerId,
          eventApplicationId: application._id,
          date,
          checkInTime: nowColombo.toJSDate(),
        });
      } else {
        attendance.checkInTime = nowColombo.toJSDate();
        await attendance.save();
      }

      return res.json({ message: "Checked in successfully", attendance });
    }


    // Handle check-out
    if (scanType === "check-out") {
      if (!attendance?.checkInTime) {
        return res.status(400).json({ message: "Cannot check out before checking in" });
      }

      if (attendance.checkOutTime) {
        return res.status(400).json({ message: "Already checked out today" });
      }

      attendance.checkOutTime = nowColombo.toJSDate(); // ✅ correct
      await attendance.save();

      return res.json({ message: "Checked out successfully", attendance });
    }


  } catch (err) {
    console.error("Attendance scan error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



router.get("/history", authenticateToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;

    const records = await Attendance.find({ volunteerId })
      .populate("eventId", "eventName")
      .sort({ date: -1 });

    res.json({ history: records });
  } catch (err) {
    console.error("Attendance history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/history/grouped", authenticateToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;

    const records = await Attendance.find({ volunteerId })
      .populate("eventId", "eventName")
      .sort({ date: 1 }); // oldest → newest

    const grouped = {};

    records.forEach(rec => {
      const eventName = rec.eventId?.eventName || "Unknown Event";

      if (!grouped[eventName]) {
        grouped[eventName] = [];
      }

      grouped[eventName].push({
        date: rec.date,
        checkInTime: rec.checkInTime,
        checkOutTime: rec.checkOutTime
      });
    });

    res.json({ history: grouped });
  } catch (err) {
    console.error("Attendance history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/history/:eventId", authenticateToken, async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const eventId = req.params.eventId;

    const records = await Attendance.find({ volunteerId, eventId })
      .sort({ date: -1 });

    res.json({ eventId, history: records });
  } catch (err) {
    console.error("History by event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
