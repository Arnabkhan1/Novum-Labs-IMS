const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // রোল ম্যানেজমেন্ট
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'], 
    default: 'STUDENT',
  },
  phone: {
    type: String,
  },
  
  // === স্টুডেন্টদের জন্য স্পেশাল ফিল্ড ===
  guardianName: {
    type: String,
  },
  class: {
    type: String, // যেমন: "Class 10" বা "B.Tech CSE"
  },
  rollNo: {
    type: String, // স্টুডেন্ট রোল নম্বর
  },
  
  // ✅ নতুন যোগ করা হলো: টিচার অ্যাসাইনমেন্ট
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // এটিও একজন User (কিন্তু Role হবে Teacher)
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);