import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  getTeacherClasses,
  createHomework,
  getTeacherHomework,
  deleteHomework,
} from "../controllers/teacherController.js";

const router = express.Router();

router.get("/classes", protect, verifyRole(["teacher"]), getTeacherClasses);
router.post("/homework", protect, verifyRole(["teacher"]), createHomework);
router.get("/homework", protect, verifyRole(["teacher"]), getTeacherHomework);
router.delete("/homework/:id", protect, verifyRole(["teacher"]), deleteHomework);

export default router;
