const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  // আগে শুধু link ছিল, এখন fileUrl যোগ হলো
  link: {
    type: String, // বাইরের লিংক (ঐচ্ছিক)
  },
  fileUrl: {
    type: String, // আপলোড করা ফাইলের ঠিকানা
  },
  fileName: {
    type: String, // ফাইলের আসল নাম
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);