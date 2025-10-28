import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createVideoProject,
  getAllVideoProjects,
  updateVideoProject,
} from "../controllers/videoController.js";

const router = express.Router();

router.post("/", protect, verifyRole(["videoeditor"]), createVideoProject);
router.get("/", protect, verifyRole(["videoeditor"]), getAllVideoProjects);
router.put("/:id", protect, verifyRole(["videoeditor"]), updateVideoProject);

export default router;
