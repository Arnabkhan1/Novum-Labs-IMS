const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
// ✅ নিশ্চিত করুন কন্ট্রোলার পাথ ঠিক আছে এবং ফাংশনগুলোর নাম ঠিক আছে
const { getDailyClassList, markClassAttendance, getStudentHistory } = require('../controllers/attendanceController');

const router = express.Router();

// রাউট
router.get('/daily-list', protect, getDailyClassList); // লিস্ট দেখার জন্য
router.post('/mark-class', protect, adminOnly, markClassAttendance); // সেভ করার জন্য (শুধু এডমিন)
router.get('/my-history', protect, getStudentHistory); // স্টুডেন্ট হিস্ট্রির জন্য

module.exports = router;