const User = require('../models/User');
const mongoose = require('mongoose');

// ✅ 1. Get All Students (Robust Teacher Filter)
const getAllStudents = async (req, res) => {
  try {
    // লগইন চেক
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ডিবাগ: টার্মিনালে দেখুন কে লগইন করেছে
    console.log(`API Caller: ${req.user.name} | Role: ${req.user.role} | ID: ${req.user._id}`);

    let query = { role: 'STUDENT' };

    // 🔴 FILTER LOGIC (Case Insensitive Check)
    const userRole = req.user.role.toUpperCase(); // 'Teacher' -> 'TEACHER'

    if (userRole === 'TEACHER') {
      console.log("✅ Applying TEACHER Filter...");
      // টিচারের আইডি দিয়ে স্টুডেন্ট ফিল্টার
      query['courses.teacherId'] = new mongoose.Types.ObjectId(req.user._id);
    } 
    else if (req.query.teacherId) {
      // অ্যাডমিন যদি নির্দিষ্ট টিচারের স্টুডেন্ট দেখতে চায়
      console.log("✅ Applying Query Param Filter...");
      query['courses.teacherId'] = new mongoose.Types.ObjectId(req.query.teacherId);
    }

    // ফাইনাল কুয়েরিটি কনসোলে প্রিন্ট হবে (ডিবাগিংয়ের জন্য)
    console.log("Final Database Query:", JSON.stringify(query));

    const students = await User.find(query)
      .select('-password')
      .populate('courses.teacherId', 'name email'); 

    console.log(`--> Result: Found ${students.length} students`);
    
    // ব্রাউজারকে বলা হচ্ছে ক্যাশ না করতে (যাতে 304 না আসে)
    res.set('Cache-Control', 'no-store');
    res.json(students);

  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ 2. Assign Course
const assignCourseToStudent = async (req, res) => {
  try {
    const { studentId, subject, teacherId } = req.body;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ডুপ্লিকেট কোর্স আটকাতে চাইলে এই চেকটি রাখতে পারেন
    const alreadyAssigned = student.courses.some(c => c.teacherId.toString() === teacherId);
    if(!alreadyAssigned) {
        student.courses.push({ subject, teacherId });
        await student.save();
    }

    res.json({ message: "Course assigned successfully", student });
  } catch (error) {
    console.error("Error in assignCourse:", error);
    res.status(500).json({ message: "Failed to assign course" });
  }
};

module.exports = { getAllStudents, assignCourseToStudent };