// server/routes/studentRoutes.js
import express from 'express';
// নোট: ফাইলের শেষে .js এক্সটেনশন দেওয়া জরুরি
import { getStudents, updateStudent, deleteStudent, getAllClasses, getDashboardStats} from '../controllers/studentController.js'; 

const router = express.Router();

// Get All Classes
router.get('/classes', getAllClasses);

// ২. ড্যাশবোর্ড স্ট্যাটস
router.get('/stats', getDashboardStats);

// Get All Students
router.get('/', getStudents);

// Update Student
router.put('/:id', updateStudent);

// Delete Student
router.delete('/:id', deleteStudent);

export default router;