const Attendance = require('../models/Attendance');
const User = require('../models/User');

// ১. আজকের সব ক্লাস এবং তাদের হাজিরার অবস্থা দেখা (Admin)
const getDailyClassList = async (req, res) => {
  try {
    const { date } = req.query; // ফ্রন্টএন্ড থেকে তারিখ আসবে (YYYY-MM-DD)
    
    // তারিখ থেকে বারের নাম বের করা (যেমন: Sunday)
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // সব স্টুডেন্ট লোড করি
    const students = await User.find({ role: 'STUDENT' }).populate('courses.teacherId', 'name email');

    let dailyClasses = [];

    // লুপ চালিয়ে আজকের শিডিউল জেনারেট করি
    for (const student of students) {
      if (student.courses && student.courses.length > 0) {
        for (const course of student.courses) {
          if (course.classDays && course.classDays.includes(dayName)) {
            
            // চেক করি এই ক্লাসের হাজিরা ইতিমধ্যে নেওয়া হয়েছে কিনা
            const existingRecord = await Attendance.findOne({
              date: date,
              student: student._id,
              teacher: course.teacherId?._id,
              subject: course.subject
            });

            dailyClasses.push({
              uniqueKey: `${student._id}-${course.subject}`,
              studentId: student._id,
              studentName: student.name,
              teacherId: course.teacherId?._id,
              teacherName: course.teacherId?.name || 'Unknown',
              subject: course.subject,
              
              // হাজিরা ডাটা
              isMarked: !!existingRecord,
              teacherStatus: existingRecord ? existingRecord.teacherStatus : 'Present', // ডিফল্ট Present
              studentStatus: existingRecord ? existingRecord.studentStatus : 'Present'
            });
          }
        }
      }
    }

    res.json(dailyClasses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch daily classes' });
  }
};

// ২. হাজিরা সেভ বা আপডেট করা (Admin)
const markClassAttendance = async (req, res) => {
  try {
    const { date, studentId, teacherId, subject, teacherStatus, studentStatus } = req.body;

    const record = await Attendance.findOneAndUpdate(
      { date, student: studentId, teacher: teacherId, subject },
      { 
        teacherStatus, 
        studentStatus, 
        markedBy: req.user._id 
      },
      { new: true, upsert: true } // Upsert: না থাকলে তৈরি করবে
    );

    res.json({ message: 'Attendance Saved!', data: record });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
};

// ৩. স্টুডেন্ট নিজের হিস্ট্রি দেখবে (Student) - [UPDATED with Filters]
// 3. স্টুডেন্ট হিস্ট্রি (Smart Filter: Admin can view any, Student views own)
const getStudentHistory = async (req, res) => {
  try {
    // ডিফল্টভাবে লগইন করা ইউজারের আইডি
    let targetStudentId = req.user._id;

    // যদি ইউজার ADMIN হয় এবং সে অন্য কারো আইডি পাঠায়, তাহলে সেটা সেট হবে
    if (req.user.role === 'ADMIN' && req.query.studentId) {
        targetStudentId = req.query.studentId;
    }

    const { range } = req.query; 
    let query = { student: targetStudentId }; // student ফিল্ডে টার্গেট আইডি বসবে

    // --- Date Filtering Logic ---
    if (range && range !== 'all') {
      const now = new Date();
      let startDate = new Date();

      if (range === 'weekly') {
        startDate.setDate(now.getDate() - 7); 
      } else if (range === 'monthly') {
        startDate.setMonth(now.getMonth() - 1); 
      } else if (range === '6months') {
        startDate.setMonth(now.getMonth() - 6); 
      } else if (range === 'yearly') {
        startDate.setFullYear(now.getFullYear() - 1); 
      }
      query.date = { $gte: startDate };
    }

    // ডাটা ফেস করা
    const records = await Attendance.find(query)
        .sort({ date: -1 })
        .populate('student', 'name email'); // নাম দেখানোর জন্য populate করা হলো

    // স্ট্যাটাস ক্যালকুলেশন
    const total = records.length;
    const present = records.filter(r => r.studentStatus === 'Present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    res.json({
      studentName: records.length > 0 ? records[0].student.name : "Student",
      stats: { total, present, absent: total - present, percentage },
      history: records
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// ✅ সব ফাংশন এক্সপোর্ট
module.exports = { 
  getDailyClassList, 
  markClassAttendance, 
  getStudentHistory 
};