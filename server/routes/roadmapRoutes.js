const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { assignMonthPlan, getStudentRoadmap } = require('../controllers/roadmapController');

const router = express.Router();

router.post('/assign', protect, adminOnly, assignMonthPlan); // অ্যাডমিন প্ল্যান সেট করবে
router.get('/', protect, getStudentRoadmap); // স্টুডেন্ট বা অ্যাডমিন দেখবে

module.exports = router;