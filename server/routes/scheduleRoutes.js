const express = require('express');
const router = express.Router();
const { createSchedule, getAllSchedules, getTeachers } = require('../controllers/scheduleController');

// রাউটগুলো
router.post('/create', createSchedule); // শিডিউল বানানোর জন্য
router.get('/all', getAllSchedules);    // সব শিডিউল দেখার জন্য
router.get('/teachers', getTeachers);   // টিচার লিস্ট পাওয়ার জন্য

module.exports = router;