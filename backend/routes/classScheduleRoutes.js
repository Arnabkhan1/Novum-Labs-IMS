import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createClassSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/classScheduleController.js";

const router = express.Router();

// Coordinator-only access
router.post("/", protect, verifyRole(["coordinator"]), createClassSchedule);
router.get("/", protect, verifyRole(["coordinator", "admin", "superadmin"]), getAllSchedules);
router.put("/:id", protect, verifyRole(["coordinator"]), updateSchedule);
router.delete("/:id", protect, verifyRole(["coordinator"]), deleteSchedule);

export default router;
