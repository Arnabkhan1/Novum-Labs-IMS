import express from "express";
import {
  createSocialPost,
  getSocialPosts,
  updateSocialPost,
  deleteSocialPost,
} from "../controllers/socialController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createSocialPost)
  .get(protect, getSocialPosts);

router.route("/:id")
  .put(protect, updateSocialPost)
  .delete(protect, deleteSocialPost);

export default router;
