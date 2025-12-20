const Roadmap = require('../models/Roadmap');

const createRoadmap = async (req, res) => {
  try {
    const { studentId, title, description, link } = req.body;
    
    // ফাইল আছে কিনা চেক করা
    let fileUrl = '';
    let fileName = '';
    
    if (req.file) {
      fileUrl = req.file.path; // ফাইলের পাথ (যেমন: uploads/file.docx)
      fileName = req.file.originalname;
    }

    const roadmap = await Roadmap.create({
      student: studentId,
      title,
      description,
      link,     // যদি লিংক দেয়
      fileUrl,  // যদি ফাইল দেয়
      fileName
    });

    res.status(201).json({ message: "Roadmap assigned successfully! 🗺️", roadmap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// বাকি ফাংশনগুলো (getAllRoadmaps, deleteRoadmap) একই থাকবে...
const getAllRoadmaps = async (req, res) => {
    try {
      const roadmaps = await Roadmap.find()
        .populate('student', 'name email class')
        .sort({ createdAt: -1 });
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const deleteRoadmap = async (req, res) => {
    try {
      await Roadmap.findByIdAndDelete(req.params.id);
      res.json({ message: "Roadmap deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = { createRoadmap, getAllRoadmaps, deleteRoadmap };