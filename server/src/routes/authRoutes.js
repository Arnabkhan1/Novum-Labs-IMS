// server/src/routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Routes: http://localhost:5000/api/auth/register
router.post('/register', register);
router.post('/login', login);

export default router;  