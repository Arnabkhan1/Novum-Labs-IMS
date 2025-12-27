const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ১. স্টুডেন্ট অ্যাড করা (Multi-Teacher Supported)
const addStudent = async (req, res) => {
  try {
    // এখানে এখন courses অ্যারে আসবে
    const { name, email, password, phone, guardianName, userClass, rollNo, courses } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // courses ডাটা ভ্যালিডেশন (যদি থাকে)
    let validCourses = [];
    if (courses && Array.isArray(courses)) {
        validCourses = courses.map(c => ({
            teacherId: c.teacherId, // টিচার আইডি
            subject: c.subject,     // বিষয়
            classDays: c.classDays || [] // দিনগুলো
        }));
    }

    const user = await User.create({
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      role: 'STUDENT', 
      guardianName, 
      class: userClass, 
      rollNo,
      courses: validCourses // ✅ নতুন courses অ্যারে সেভ হচ্ছে
    });

    res.status(201).json({ message: 'Student added successfully! ✅', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ২. সব স্টুডেন্ট দেখা
const getAllStudents = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let query = { role: 'STUDENT' };

    // ফিল্টারিং লজিক (যদি টিচার লগইন করে থাকে)
    if (teacherId) {
      // courses অ্যারের ভেতরে teacherId খুঁজবে
      query['courses.teacherId'] = teacherId;
    }

    const students = await User.find(query)
      .select('-password')
      .populate('courses.teacherId', 'name email') // ✅ টিচারের নাম পপুলেট করা
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

// ৪. স্টুডেন্ট আপডেট করা (Multi-Teacher Supported)
const updateStudent = async (req, res) => {
  try {
    console.log("🔥 Update Request for ID:", req.params.id);
    console.log("📦 Incoming Data:", req.body);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // সাধারণ তথ্য আপডেট
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.guardianName = req.body.guardianName || user.guardianName;
    user.class = req.body.userClass || user.class;
    user.rollNo = req.body.rollNo || user.rollNo;
    
    // ✅ Courses অ্যারে আপডেট
    if (req.body.courses) {
        console.log("📚 Updating Courses List...");
        user.courses = req.body.courses; // পুরো নতুন লিস্ট রিপ্লেস করবে
    }

    // পাসওয়ার্ড আপডেট
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    console.log("✅ Update Successful!");

    res.json({ message: 'Student updated successfully! ✅', user: updatedUser });

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ৫. নির্দিষ্ট স্টুডেন্ট ডাটা পাওয়া
const getStudentById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('courses.teacherId', 'name'); // ✅ টিচারের নাম পপুলেট
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ৬. টিচার অ্যাড করা
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

// ৮. নতুন টিচার তৈরি করা
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
    createTeacher 
};