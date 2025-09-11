import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";  // <-- make sure Event model exists

const router = express.Router();

// Add Event (only ORG_ADMINs should be allowed ideally)
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const {
      eventName,
      institute,
      location,
      startDate,
      endDate,
      opportunity,
      minAge,
      maxAge,
      description,
      minDay,
    } = req.body;

    // ✅ basic validation
    if (!eventName || !institute || !location || !startDate || !opportunity || !minAge || !maxAge || !description || !minDay) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // ✅ create event
    const event = new Event({
      eventName,
      institute,
      location,
      startDate,
      endDate,
      opportunity,
      minAge,
      maxAge,
      description,
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

export default router;
