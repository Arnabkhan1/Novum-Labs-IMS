import SocialPost from "../models/SocialPost.js";

export const createPost = async (data) => {
  const post = new SocialPost(data);
  return await post.save();
};

export const getAllPosts = async () => {
  return await SocialPost.find().sort({ createdAt: -1 });
};

export const updatePost = async (id, data) => {
  return await SocialPost.findByIdAndUpdate(id, data, { new: true });
};

export const deletePost = async (id) => {
  return await SocialPost.findByIdAndDelete(id);
};
