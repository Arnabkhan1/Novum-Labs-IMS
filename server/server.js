import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Import Routes
import authRoutes from './src/routes/authRoutes.js'; // <-- এই লাইনটি যোগ করুন
import studentRoutes from './src/routes/studentRoutes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Use Routes
app.use('/api/auth', authRoutes); // <-- এই লাইনটি যোগ করুন (Base URL)
app.use('/api/students', studentRoutes); // <-- এই লাইনটি যোগ করুন (Base URL)

app.get('/', (req, res) => {
    res.json({ message: 'Novum Labs API is Running... 🚀' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});