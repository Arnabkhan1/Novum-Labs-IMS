import Homework from "../models/Homework.js";
import ClassSession from "../models/ClassSession.js";

// ✅ Get teacher's own classes
export const getTeacherClasses = async (req, res) => {
  try {
    const classes = await ClassSession.find({ teacher: req.user.id })
      .populate("course", "name")
      .populate("batch", "name");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch classes", error });
  }
};

// ✅ Create Homework
export const createHomework = async (req, res) => {
  try {
    const { title, description, course, batch, dueDate } = req.body;
    const homework = await Homework.create({
      title,
      description,
      course,
      batch,
      teacher: req.user.id,
      dueDate,
    });
    res.status(201).json({ message: "Homework created", homework });
  } catch (error) {
    res.status(500).json({ message: "Failed to create homework", error });
  }
};

// ✅ Get all homework (for this teacher)
export const getTeacherHomework = async (req, res) => {
  try {
    const homeworks = await Homework.find({ teacher: req.user.id })
      .populate("course", "name")
      .populate("batch", "name");
    res.json(homeworks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch homework", error });
  }
};

// ✅ Delete homework
export const deleteHomework = async (req, res) => {
  try {
    await Homework.findByIdAndDelete(req.params.id);
    res.json({ message: "Homework deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete homework", error });
  }
};
