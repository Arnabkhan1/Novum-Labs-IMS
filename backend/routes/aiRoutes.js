import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import { getAIDashboardData } from "../controllers/aiController.js";

const router = express.Router();

// ✅ Only admin & superadmin can view AI dashboard
router.get("/", protect, verifyRole(["admin", "superadmin"]), getAIDashboardData);

export default router;
