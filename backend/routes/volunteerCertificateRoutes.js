import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getEligibleEvents, generateCertificate } from "../controllers/certificateController.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/eligible-events", getEligibleEvents);
router.get("/generate/:eventId", generateCertificate);

export default router;
