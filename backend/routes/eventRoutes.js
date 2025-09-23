import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";  // <-- make sure Event model exists


const router = express.Router();

// Add Event (only ORG_ADMINs should be allowed ideally)
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
      opportunity,
      minAge,
      maxAge,
      description,
      qualification,
      minDay,
    } = req.body;

    // ✅ basic validation
    if (!eventType || !eventName || !institute || !location || !city || !startDate || !opportunity || !minAge || !maxAge || !description || !qualification || !minDay) {
      return res.status(400).json({ message: "All required fields must be filled" });
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
      opportunity,
      minAge,
      maxAge,
      description,
      qualification,
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

export default router;
