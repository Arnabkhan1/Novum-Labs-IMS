const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ১. fs মডিউল ইম্পোর্ট করা হলো

const { createRoadmap, getAllRoadmaps, deleteRoadmap } = require('../controllers/roadmapController');

// ২. uploads ফোল্ডার আছে কিনা চেক করা, না থাকলে তৈরি করা
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer কনফিগারেশন
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // এখন আর এরর দেবে না
  },
  filename: (req, file, cb) => {
    // ফাইলের নামে স্পেস থাকলে সমস্যা হতে পারে, তাই রিপ্লেস করা হলো
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// রাউট
router.post('/create', upload.single('file'), createRoadmap);
router.get('/all', getAllRoadmaps);
router.delete('/:id', deleteRoadmap);

module.exports = router;