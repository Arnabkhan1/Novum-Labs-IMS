const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const authRoutes = require('./routes/authRoutes');

// কনফিগারেশন লোড
dotenv.config();

// ডাটাবেস কানেকশন কল করা
connectDB();

const app = express();

// মিডলওয়্যার (Frontend এর সাথে কানেক্ট করার জন্য)
app.use(cors());
app.use(express.json()); // JSON ডাটা রিসিভ করার জন্য
app.use('/uploads', express.static('uploads'));

// বেসিক রাউট (টেস্ট করার জন্য)
app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use('/api/admin', adminRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/auth', authRoutes);

// সার্ভার চালু করা
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});