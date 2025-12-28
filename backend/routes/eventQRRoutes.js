import express from "express";
import QRCode from "qrcode";
import crypto from "crypto";
import Event from "../models/Event.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Normalize to YYYY-MM-DD
const normalizeDateKey = (d) => new Date(d).toISOString().split("T")[0];

// Generate QR for a specific event date
router.get("/:eventId/qr/:date/:scanType", authenticateToken, async (req, res) => {
  try {
    const { eventId, date, scanType } = req.params;

    // Validate scanType
    if (!["check-in", "check-out"].includes(scanType)) {
      return res.status(400).json({ message: "Invalid scan type" });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const dateKey = normalizeDateKey(date);
    const startKey = normalizeDateKey(event.startDate);
    const endKey = normalizeDateKey(event.endDate);

    if (dateKey < startKey || dateKey > endKey) {
      return res.status(403).json({ message: "QR not valid outside event date range" });
    }

    // Ensure dailyTokens is a Map
    if (!(event.dailyTokens instanceof Map)) {
      event.dailyTokens = new Map(Object.entries(event.dailyTokens || {}));
    }

    // Generate or get token for this date
    let token = event.dailyTokens.get(dateKey);
    if (!token) {
      token = crypto.randomBytes(32).toString("hex"); // 32 bytes for better security
      event.dailyTokens.set(dateKey, token);
      event.dailyTokens = Object.fromEntries(event.dailyTokens); // save as plain object
      await event.save();
    }

    // QR payload now includes scanType
    const qrPayload = {
      eventId: event._id.toString(),
      date: dateKey,
      token,
      scanType, // encoded in QR, backend will use this
      expiresAt: `${dateKey}T23:59:59Z`,
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));

    res.json({ qrImage, token, date: dateKey, eventId: event._id, scanType });
  } catch (err) {
    console.error("QR generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
