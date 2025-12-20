const express = require('express');
const router = express.Router();

const { 
    addStudent, 
    getAllStudents, 
    deleteStudent, 
    updateStudent, 
    getStudentById,
    createAdmin,
    createTeacher // <--- ইম্পোর্ট করা হয়েছে
} = require('../controllers/adminController');

// রাউট সমূহ
router.post('/add-student', addStudent);
router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);
router.put('/students/:id', updateStudent);
router.get('/students/:id', getStudentById);
router.post('/create-admin', createAdmin);

// ✅ নতুন রাউট (404 এরর ফিক্স করার জন্য এটি জরুরি)
router.post('/create-teacher', createTeacher);

module.exports = router;