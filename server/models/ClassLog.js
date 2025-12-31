const mongoose = require('mongoose');

const classLogSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g., "January"
  subject: { type: String, required: true }, // e.g., "Backend Engineering"
  topicCovered: { type: String, required: true }, // Student will write this (e.g., "FastAPI Routing intro")
  
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Verified'], 
    default: 'Pending' 
  },
  
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Teacher or Admin ID
  },
  
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ClassLog', classLogSchema);