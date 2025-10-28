import Course from "../models/Course.js";

// ✅ Create Course
export const createCourse = async (req, res) => {
  try {
    const { name, code, description, duration, teacher } = req.body;
    const existing = await Course.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Course code already exists" });

    const course = await Course.create({ name, code, description, duration, teacher });
    res.status(201).json({ message: "Course created", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to create course", error });
  }
};

// ✅ Get All Courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
};

// ✅ Update Course
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Course updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error });
  }
};

// ✅ Delete Course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error });
  }
};
