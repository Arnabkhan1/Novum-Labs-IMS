const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // স্টুডেন্টের আইডি
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // টিচারের আইডি (যাকে সিলেক্ট করা হবে)
    required: true
  },
  subject: {
    type: String, 
    required: true
  },
  date: {
    type: Date, // তারিখ (YYYY-MM-DD)
    required: true
  },
  startTime: {
    type: String, // যেমন "10:00 AM"
    required: true
  },
  endTime: {
    type: String, // যেমন "11:00 AM"
    required: true
  },
  note: {
    type: String, // যদি কোনো স্পেশাল নোট থাকে
  }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);