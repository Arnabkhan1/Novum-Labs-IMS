const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs'); // ✅ ফাইল সিস্টেম ইম্পোর্ট

// রাউট ইম্পোর্ট
const adminRoutes = require('./routes/adminRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classLogRoutes = require('./routes/classLogRoutes');
const studentRoutes = require('./routes/studentRoutes');

// কনফিগারেশন লোড
dotenv.config();
connectDB();

const app = express();

// মিডলওয়্যার
app.use(cors());
app.use(express.json());

// ✅✅ স্মার্ট সল্যুশন: অটোমেটিক uploads ফোল্ডার তৈরি ✅✅
const uploadDir = path.join(__dirname, 'uploads');

// যদি ফোল্ডার না থাকে, তবে তৈরি করে নাও
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log('📂 "uploads" folder created successfully!');
}

// ✅ স্ট্যাটিক ফোল্ডার সেটআপ (ফাইল ব্রাউজারে দেখার জন্য)
app.use('/uploads', express.static(uploadDir));


// বেসিক রাউট
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API রাউটস
app.use('/api/admin', adminRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/class-log', classLogRoutes);
app.use('/api/students', studentRoutes);

// সার্ভার চালু
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Files are stored in: ${uploadDir}`); // কনসোলে পাথ দেখাবে
});