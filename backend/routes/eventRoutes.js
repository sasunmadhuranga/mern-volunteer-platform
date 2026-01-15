import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";  // <-- make sure Event model exists
import QRCode from 'qrcode';
import * as crypto from 'crypto';

const router = express.Router();

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const {
      eventType,
      eventName,
      institute,
      location,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      opportunity,
      minAge,
      maxAge,
      description,
      qualification,
      qualificationType,
      minDay,
    } = req.body;

    // ✅ basic validation
    if (!eventType || !eventName || !institute || !location || !city || !startDate || !endDate || !startTime || !endTime || !opportunity || !minAge || !maxAge || !description || !qualification || !minDay) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    if (qualification === "Required" && !qualificationType) {
      return res.status(400).json({ message: "Qualification type is required when qualification is 'Required'" });
    }

    // ✅ create event
    const event = new Event({
      eventType,
      eventName,
      institute,
      location,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      opportunity,
      minAge,
      maxAge,
      description,
      qualification,
      qualificationType,
      minDay,
      createdBy: req.user.id, // org id
    });

    await event.save();
    res.json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/all", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }
    const events = await Event.find().populate("createdBy", "name contactEmail phone role");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// 🌍 Public events (Landing Page)
router.get("/public", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      status: "approved",
      endDate: { $gte: today }
    })
      .sort({ startDate: 1 }) // nearest events first
      .limit(6)
      .populate("createdBy", "name _id");

    const publicEvents = events.map(event => ({
      _id: event._id,
      eventName: event.eventName,
      eventType: event.eventType,
      institute: event.institute || event.createdBy?.name,
      city: event.city,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate
    }));

    res.json(publicEvents);
  } catch (err) {
    console.error("Public events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { eventType, eventName, city } = req.query;
    const query = {};

    if (eventType) {
      query.eventType = eventType;
    }

    if (eventName) {
      query.eventName = { $regex: eventName, $options: "i" };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (req.user.role === "VOLUNTEER") {
      query.status = "approved";
    }

    // Populate createdBy to get org user info (name, email, etc.)
    const events = await Event.find(query).populate("createdBy", "name _id role");

    // Map events to add organizerId and optionally overwrite institute with createdBy.name
    const mappedEvents = events.map(event => ({
      _id: event._id,
      eventType: event.eventType,
      eventName: event.eventName,
      institute: event.institute || event.createdBy.name, // fallback to createdBy name if institute missing
      location: event.location,
      city: event.city,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      opportunity: event.opportunity,
      minAge: event.minAge,
      maxAge: event.maxAge,
      description: event.description,
      qualification: event.qualification,
      qualificationType: event.qualificationType,
      minDay: event.minDay,
      status: event.status,
      organizerId: event.createdBy._id.toString(),  // this is what frontend expects
    }));

    res.json(mappedEvents);
  } catch (err) {
    console.error("Error searching events:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get events created by the current ORG_ADMIN
router.get("/org", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ORG_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const events = await Event.find({ createdBy: req.user.id }).select(
      "eventType eventName location city startDate endDate status"
    );

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching ORG_ADMIN events:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update Event (ORG_ADMIN only)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ORG_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      eventName,
      startDate,
      endDate,
      startTime,
      endTime,
      opportunity,
      minAge,
      maxAge,
      description,
      qualification,
      qualificationType,
      minDay,
    } = req.body;

    // Basic validation
    if (!eventName || !startDate || !endTime || !opportunity || !minAge || !maxAge || !description || !qualification || !minDay) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch event to verify ownership
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this event" });
    }

    // Only update allowed fields
    event.eventName = eventName;
    event.startDate = startDate;
    event.endDate = endDate;
    event.startTime = startTime;
    event.endTime = endTime;
    event.opportunity = opportunity;
    event.minAge = minAge;
    event.maxAge = maxAge;
    event.description = description;
    event.qualification = qualification;
    event.qualificationType = qualification === "Required" ? qualificationType : "";
    event.minDay = minDay;

    await event.save();
    res.json({ message: "Event updated successfully", event });

  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Event (ORG_ADMIN only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ORG_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this event" });
    }

    await event.deleteOne();  // or use `await Event.findByIdAndDelete(req.params.id);`
    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single event by ID (for edit form)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Optional: Check if user is the creator (ORG_ADMIN only)
    if (req.user.role === "ORG_ADMIN" && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to view this event" });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    console.error("Error fetching event by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const normalizeDateKey = (d) => {
  return new Date(d).toISOString().split("T")[0];
};

router.get("/:eventId/qr/:date", authenticateToken, async (req, res) => {
  try {
    const { eventId, date } = req.params;

    // Validate date format first
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Normalize dates (date-only comparison)
    const dateKey = date;
    const startKey = event.startDate.toISOString().slice(0, 10);
    const endKey = event.endDate.toISOString().slice(0, 10);

    if (dateKey < startKey || dateKey > endKey) {
      return res.status(403).json({
        message: "QR not valid outside event date range"
      });
    }

    // Ensure Map
    if (!(event.dailyTokens instanceof Map)) {
      event.dailyTokens = new Map(Object.entries(event.dailyTokens || {}));
    }

    let token = event.dailyTokens.get(dateKey);

    if (!token) {
      token = crypto.randomBytes(32).toString("hex");
      event.dailyTokens.set(dateKey, token);
      await event.save(); // save ONCE
    }

    const scanType = req.query.type; // "check-in" or "check-out"

    if (!["check-in", "check-out"].includes(scanType)) {
      return res.status(400).json({ message: "Invalid scan type" });
    }

    const qrPayload = JSON.stringify({
      eventId: event._id,
      date,
      token,
      scanType
    });


    const qrImage = await QRCode.toDataURL(qrPayload);

    res.json({ qrImage });

  } catch (err) {
    console.error("QR generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
