const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String, 
    required: true // Format: YYYY-MM-DD
  },
  subject: {
    type: String,
    required: true
  },
  startTime: {
    type: String // Optional: ক্লাস কখন শুরু হওয়ার কথা ছিল
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherStatus: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Absent'
  },
  studentStatus: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Absent'
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // কোন অ্যাডমিন মার্ক করেছেন
  }
}, { timestamps: true });

// একজন স্টুডেন্ট+টিচার+সাবজেক্ট+তারিখ মিলিয়ে যেন একটাই রেকর্ড থাকে
attendanceSchema.index({ date: 1, student: 1, teacher: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);