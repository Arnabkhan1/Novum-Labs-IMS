const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllStudents, assignCourseToStudent } = require('../controllers/studentController');

const router = express.Router();

// Get Students (Admin sees all, Teacher sees theirs)
router.get('/', protect, getAllStudents);

// ✅ Assign Course (Only Admin can do this)
router.post('/assign-course', protect, adminOnly, assignCourseToStudent);

module.exports = router;