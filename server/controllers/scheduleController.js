const Schedule = require('../models/Schedule');
const User = require('../models/User');

// ১. নতুন ক্লাস শিডিউল তৈরি করা
const createSchedule = async (req, res) => {
  try {
    const { studentId, teacherId, subject, date, startTime, endTime, note } = req.body;

    const schedule = await Schedule.create({
      student: studentId,
      teacher: teacherId,
      subject,
      date,
      startTime,
      endTime,
      note
    });

    res.status(201).json({ message: "Class Scheduled Successfully! ✅", schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ২. সব শিডিউল দেখা (সাথে স্টুডেন্ট ও টিচারের নামসহ)
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('student', 'name email') // স্টুডেন্টের নাম ও ইমেইল দেখাবে
      .populate('teacher', 'name email') // টিচারের নাম ও ইমেইল দেখাবে
      .sort({ date: 1, startTime: 1 });  // তারিখ অনুযায়ী সাজানো থাকবে

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ৩. শুধু টিচারদের লিস্ট আনা (শিডিউল ফর্মের ড্রপডাউনের জন্য)
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'TEACHER' }).select('name email');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSchedule, getAllSchedules, getTeachers };