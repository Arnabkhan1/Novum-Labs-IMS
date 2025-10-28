import * as socialService from "../services/socialService.js";

export const createSocialPost = async (req, res) => {
  try {
    const post = await socialService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getSocialPosts = async (req, res) => {
  try {
    const posts = await socialService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const updateSocialPost = async (req, res) => {
  try {
    const updated = await socialService.updatePost(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deleteSocialPost = async (req, res) => {
  try {
    await socialService.deletePost(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
