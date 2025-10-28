import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import {
  createBatch,
  getBatches,
  deleteBatch,
} from "../controllers/batchController.js";

const router = express.Router();

router.post("/", protect, verifyRole(["admin", "superadmin"]), createBatch);
router.get("/", protect, verifyRole(["admin", "coordinator", "superadmin"]), getBatches);
router.delete("/:id", protect, verifyRole(["admin", "superadmin"]), deleteBatch);

export default router;
