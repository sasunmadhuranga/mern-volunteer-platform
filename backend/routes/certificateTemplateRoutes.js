import express from "express";
import {
  createTemplate,
  getActiveTemplates,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/certificateTemplateController.js";
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken, isAdmin);

router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);


export default router;



