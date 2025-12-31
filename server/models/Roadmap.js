const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  month: { type: String, required: true }, // e.g., "January"
  year: { type: Number, default: 2026 },
  
  // অ্যাডমিন এই বিষয়গুলো সেট করে দেবেন
  subjects: [{
    name: { type: String }, // e.g., "Backend Engineering"
    tech: { type: String }, // e.g., "FastAPI, Python"
    examDate: { type: String } // e.g., "25th Jan" (Optional)
  }]
}, { timestamps: true });

// একজন স্টুডেন্টের যেন এক মাসে একটাই প্ল্যান থাকে
roadmapSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);