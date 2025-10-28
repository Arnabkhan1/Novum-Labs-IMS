import express from "express";
import protect from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/roleMiddleware.js";
import { getAllUsers, updateUserRole, deactivateUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, verifyRole(["admin", "superadmin"]), getAllUsers);
router.put("/role/:id", protect, verifyRole(["admin", "superadmin"]), updateUserRole);
router.put("/deactivate/:id", protect, verifyRole(["admin", "superadmin"]), deactivateUser);

export default router;
