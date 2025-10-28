import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createAttendance,
  getTeacherAttendance,
  getAttendanceStats,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", protect, verifyRole(["teacher"]), createAttendance);
router.get("/", protect, verifyRole(["teacher"]), getTeacherAttendance);
router.get("/stats", protect, verifyRole(["teacher"]), getAttendanceStats);

export default router;
