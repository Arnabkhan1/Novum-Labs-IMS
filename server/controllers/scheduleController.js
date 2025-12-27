const Schedule = require('../models/Schedule');
const User = require('../models/User');

// ১. নতুন ক্লাস শিডিউল তৈরি করা (ম্যানুয়াল)
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

// ২. সব শিডিউল দেখা (ম্যানুয়াল + অটোমেটিক রুটিন)
const getAllSchedules = async (req, res) => {
  try {
    // A. প্রথমে ম্যানুয়াল শিডিউলগুলো ডাটাবেস থেকে আনি
    // lean() ব্যবহার করছি যাতে আমরা এর সাথে নতুন ডাটা যোগ করতে পারি
    let schedules = await Schedule.find()
      .populate('student', 'name email')
      .populate('teacher', 'name email')
      .sort({ date: 1, startTime: 1 })
      .lean(); 

    // B. অটোমেটিক শিডিউল জেনারেশন লজিক
    // আমরা সব স্টুডেন্টদের খুঁজব যাদের classDays সেট করা আছে
    const students = await User.find({ role: 'STUDENT' })
        .populate('teacherId', 'name email') // স্টুডেন্টের অ্যাসাইন করা টিচারের তথ্য
        .select('name email classDays teacherId');

    const today = new Date();
    const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let autoSchedules = [];

    // আগামী ৪ সপ্তাহ (২৮ দিন) এর জন্য রুটিন বানাবো
    const daysToGenerate = 28; 

    students.forEach(student => {
      // যদি স্টুডেন্টের ক্লাসের দিন এবং টিচার সেট করা থাকে
      if (student.classDays && student.classDays.length > 0 && student.teacherId) {
        
        for (let i = 0; i < daysToGenerate; i++) {
          let futureDate = new Date();
          futureDate.setDate(today.getDate() + i); // আজকের তারিখের সাথে i দিন যোগ
          
          let dayName = daysMap[futureDate.getDay()]; // বারের নাম (যেমন Sunday)

          // যদি আজকের বারটি স্টুডেন্টের ক্লাস ডে-র সাথে মিলে যায়
          if (student.classDays.includes(dayName)) {
            
            // ডুপ্লিকেট চেক: ওই তারিখে কি ইতিমধ্যে ম্যানুয়াল ক্লাস আছে?
            const alreadyExists = schedules.some(s => 
              s.student && s.student._id.toString() === student._id.toString() && 
              new Date(s.date).toDateString() === futureDate.toDateString()
            );

            // যদি ম্যানুয়াল ক্লাস না থাকে, তবেই অটোমেটিক রুটিন দেখাবো
            if (!alreadyExists) {
              autoSchedules.push({
                _id: `auto-${student._id}-${i}`, // একটি ইউনিক টেম্পোরারি আইডি
                student: { 
                    _id: student._id, 
                    name: student.name, 
                    email: student.email 
                },
                teacher: { 
                    _id: student.teacherId._id, 
                    name: student.teacherId.name, 
                    email: student.teacherId.email 
                },
                subject: 'Weekly Class', // ডিফল্ট নাম
                date: futureDate.toISOString(),
                startTime: '10:00 AM', // ডিফল্ট টাইম (আপনি চাইলে চেঞ্জ করতে পারেন)
                endTime: '11:00 AM',
                note: `Recurring class on ${dayName}`,
                isAuto: true // ফ্রন্টএন্ডে চেনার জন্য ফ্ল্যাগ (Weekly Plan ব্যাজ দেখানোর জন্য)
              });
            }
          }
        }
      }
    });

    // C. ম্যানুয়াল এবং অটোমেটিক শিডিউল মার্জ করে তারিখ অনুযায়ী সাজানো
    const finalSchedules = [...schedules, ...autoSchedules].sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(finalSchedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ৩. শুধু টিচারদের লিস্ট আনা
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'TEACHER' }).select('name email');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSchedule, getAllSchedules, getTeachers };