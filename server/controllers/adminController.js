const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ১. স্টুডেন্ট অ্যাড করা
const addStudent = async (req, res) => {
  try {
    const { name, email, password, phone, guardianName, userClass, rollNo, teacherId } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, phone, role: 'STUDENT', guardianName, class: userClass, rollNo,
      assignedTeacher: teacherId || null 
    });

    res.status(201).json({ message: 'Student added successfully! ✅' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ২. সব স্টুডেন্ট দেখা
const getAllStudents = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let query = { role: 'STUDENT' };

    if (teacherId) {
      query.assignedTeacher = teacherId;
    }

    const students = await User.find(query)
      .select('-password')
      .populate('assignedTeacher', 'name') 
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ৩. স্টুডেন্ট ডিলিট করা
const deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ৪. স্টুডেন্ট আপডেট করা
const updateStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.guardianName = req.body.guardianName || user.guardianName;
    user.class = req.body.userClass || user.class;
    user.rollNo = req.body.rollNo || user.rollNo;
    
    if (req.body.teacherId) {
        user.assignedTeacher = req.body.teacherId;
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({ message: 'Student updated successfully! ✅', user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ৫. নির্দিষ্ট স্টুডেন্ট ডাটা পাওয়া
const getStudentById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('assignedTeacher', 'name');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ৬. টিচার অ্যাড করা (আগের ভার্সন যদি থাকে)
const addTeacher = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, phone, role: 'TEACHER' });
    res.status(201).json({ message: 'Teacher added successfully! 👨‍🏫', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ৭. অ্যাডমিন তৈরি করা
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: 'ADMIN' });
    res.status(201).json({ message: 'Admin Created Successfully! 👑', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ৮. নতুন টিচার তৈরি করা (আপনার বর্তমান রিকোয়ারমেন্ট)
const createTeacher = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'TEACHER', 
      class: 'N/A'
    });

    res.status(201).json({ message: 'Teacher Created Successfully! 👨‍🏫', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    addStudent, 
    getAllStudents, 
    deleteStudent, 
    updateStudent, 
    getStudentById,
    addTeacher,
    createAdmin,
    createTeacher // <--- এটি অবশ্যই থাকতে হবে
};