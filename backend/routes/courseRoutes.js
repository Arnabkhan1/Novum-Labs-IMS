import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.post("/", protect, verifyRole(["admin", "superadmin"]), createCourse);
router.get("/", protect, verifyRole(["admin", "coordinator", "superadmin"]), getCourses);
router.put("/:id", protect, verifyRole(["admin", "superadmin"]), updateCourse);
router.delete("/:id", protect, verifyRole(["admin", "superadmin"]), deleteCourse);

export default router;
