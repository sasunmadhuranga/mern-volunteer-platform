import express from 'express';
import { getActiveTemplates } from '../controllers/certificateTemplateController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/active", authenticateToken, getActiveTemplates);

export default router;
