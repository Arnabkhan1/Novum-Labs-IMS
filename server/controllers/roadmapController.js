const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

// ১. স্টুডেন্টের রোডম্যাপ সেট করা (Admin Only)
const assignMonthPlan = async (req, res) => {
  try {
    const { studentId, month, subjects } = req.body;

    // যদি আগে থাকে আপডেট করবে, না থাকলে নতুন বানাবে (Upsert)
    const plan = await Roadmap.findOneAndUpdate(
      { student: studentId, month: month },
      { subjects: subjects },
      { new: true, upsert: true }
    );

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ২. রোডম্যাপ দেখা (Student নিজেরটা দেখবে, Admin সবারটা দেখতে পারবে)
const getStudentRoadmap = async (req, res) => {
  try {
    let targetStudentId = req.user._id;

    // যদি অ্যাডমিন বা টিচার হয় এবং অন্য কারোটা দেখতে চায়
    if ((req.user.role === 'ADMIN' || req.user.role === 'TEACHER') && req.query.studentId) {
      targetStudentId = req.query.studentId;
    }

    const roadmap = await Roadmap.find({ student: targetStudentId });
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignMonthPlan, getStudentRoadmap };