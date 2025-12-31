const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addLog, getLogs, verifyLog } = require('../controllers/classLogController');

const router = express.Router();

router.post('/add', protect, addLog); // Student
router.get('/', protect, getLogs); // All
router.put('/verify/:logId', protect, verifyLog); // Teacher/Admin

module.exports = router;