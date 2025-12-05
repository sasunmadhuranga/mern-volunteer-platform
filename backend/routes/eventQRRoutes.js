import express from "express";
import QRCode from "qrcode";
import Event from "../models/Event.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate QR for a specific event + date
router.get("/:eventId/qr/:date", authenticateToken, async (req, res) => {
  try {
    const { eventId, date } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // FIXED: Access tokens correctly
    const token = event.dailyTokens[date];
    if (!token)
      return res.status(400).json({
        message: "Invalid date or QR token does not exist for this date",
      });

    // Validate date range
    const qrDate = new Date(date);
    if (qrDate < event.startDate || qrDate > event.endDate) {
      return res.status(403).json({ message: "QR not valid outside event date range" });
    }

    // Build JSON payload that volunteers will scan
    const qrPayload = JSON.stringify({
      eventId,
      date,
      token,
    });

    const qrImage = await QRCode.toDataURL(qrPayload);

    res.json({ qrImage });

  } catch (err) {
    console.error("QR generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
