import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = express.Router();

// Coordinator & Admin can create
router.post("/", protect, verifyRole(["coordinator", "admin"]), createAnnouncement);

// All roles can read
router.get("/", protect, getAnnouncements);

// Only coordinator/admin can delete
router.delete("/:id", protect, verifyRole(["coordinator", "admin"]), deleteAnnouncement);

export default router;
