import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackStats,
} from "../controllers/feedbackController.js";

const router = express.Router();

// Student: submit feedback
router.post("/", protect, verifyRole(["student"]), createFeedback);

// Admin: view all feedback + analytics
router.get("/", protect, verifyRole(["admin", "superadmin"]), getAllFeedback);
router.get("/stats", protect, verifyRole(["admin", "superadmin"]), getFeedbackStats);

export default router;
