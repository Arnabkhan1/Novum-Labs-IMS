const mongoose = require('mongoose');

// ✅ সাব-স্কিমা: কোর্সের গঠন (যাতে কোড পরিষ্কার থাকে)
// এটি আলাদা কোনো কালেকশন না, এটি ইউজারের পেটের ভেতর থাকবে।
const courseSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // টিচার রেফারেন্স
    required: true
  },
  subject: {
    type: String,
    required: true // বিষয় (যেমন: Math, Physics)
  },
  classDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }]
}, { _id: false }); // _id: false দিচ্ছি কারণ সাব-ডকুমেন্টের আলাদা ইউনিক আইডির দরকার নেই

// ✅ মেইন ইউজার স্কিমা
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
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT'], 
    default: 'STUDENT',
  },
  phone: {
    type: String,
  },
  
  // === স্টুডেন্ট ডাটা ===
  guardianName: String,
  class: String,
  rollNo: String,
  
  // ⚠️⚠️ গুরত্বপূর্ণ পরিবর্তন (Multi-Teacher System) ⚠️⚠️
  // আগের 'teacherId' এবং 'classDays' রুট লেভেল থেকে সরিয়ে ফেলা হলো।
  // এখন 'courses' এর ভেতরে সবকিছু থাকবে।
  
  courses: {
    type: [courseSchema], // ওপরে বানানো স্কিমা ব্যবহার করা হলো
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);