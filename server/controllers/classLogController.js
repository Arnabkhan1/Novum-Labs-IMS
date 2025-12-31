const ClassLog = require('../models/ClassLog');

// ১. লগ জমা দেওয়া (Student)
const addLog = async (req, res) => {
  try {
    const { month, subject, topicCovered } = req.body;
    
    const newLog = await ClassLog.create({
      month,
      subject,
      topicCovered,
      student: req.user._id,
      status: 'Pending'
    });

    // পপুলেট করে রিটার্ন করছি যাতে ফ্রন্টএন্ডে সাথে সাথে নাম দেখায়
    const populatedLog = await ClassLog.findById(newLog._id)
      .populate('student', 'name email')
      .populate('verifiedBy', 'name'); // অ্যাডমিনের নাম

    res.status(201).json(populatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ২. লগ দেখা (সবাই দেখতে পাবে)
const getLogs = async (req, res) => {
  try {
    const { month, subject } = req.query;
    
    let query = { month };
    if (subject) {
      query.subject = subject; // সাবজেক্ট থাকলে তবেই ফিল্টার হবে
    }

    const logs = await ClassLog.find(query)
      .populate('student', 'name email')
      .populate('verifiedBy', 'name email')
      .sort({ date: -1 });
      
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ৩. লগ ভেরিফাই করা (ONLY ADMIN)
const verifyLog = async (req, res) => {
  try {
    // সিকিউরিটি চেক: টিচার বা স্টুডেন্ট যেন ভেরিফাই না করতে পারে
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Only Admin can verify logs." });
    }

    const { logId } = req.params;
    
    const updatedLog = await ClassLog.findByIdAndUpdate(
      logId,
      { 
        status: 'Verified',
        verifiedBy: req.user._id // অ্যাডমিনের আইডি বসবে
      },
      { new: true }
    )
    .populate('student', 'name')
    .populate('verifiedBy', 'name');

    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addLog, getLogs, verifyLog };