import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import { getCoordinatorReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", protect, verifyRole(["coordinator", "admin", "superadmin"]), getCoordinatorReport);

export default router;
