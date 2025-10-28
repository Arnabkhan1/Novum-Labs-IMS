import VideoProject from "../models/VideoProject.js";
import { generateAIThumbnail } from "../services/aiService.js";

// ✅ Create new project
export const createVideoProject = async (req, res) => {
  try {
    const { title, description, client, shootDate, assignedEditor, useAI } = req.body;
    let thumbnailUrl = "";

    if (useAI) {
      const result = await generateAIThumbnail(title);
      thumbnailUrl = result.imageUrl;
    }

    const newProject = await VideoProject.create({
      title,
      description,
      client,
      shootDate,
      assignedEditor,
      thumbnailUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Video project created", project: newProject });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Failed to create video project" });
  }
};

// ✅ Get all video projects
export const getAllVideoProjects = async (req, res) => {
  try {
    const projects = await VideoProject.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// ✅ Update project progress or upload
export const updateVideoProject = async (req, res) => {
  try {
    const { status, progress, videoUrl } = req.body;
    const project = await VideoProject.findByIdAndUpdate(
      req.params.id,
      { status, progress, videoUrl },
      { new: true }
    );
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project" });
  }
};
