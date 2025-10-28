import ClassSchedule from "../models/ClassSchedule.js";

// ✅ Create new schedule
export const createClassSchedule = async (req, res) => {
  try {
    const { subject, teacher, classRoom, date, startTime, endTime } = req.body;

    const schedule = await ClassSchedule.create({
      subject,
      teacher,
      classRoom,
      date,
      startTime,
      endTime,
      coordinator: req.user.id,
    });

    res.status(201).json({ message: "Class scheduled successfully", schedule });
  } catch (error) {
    res.status(500).json({ message: "Failed to create schedule", error });
  }
};

// ✅ Get all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await ClassSchedule.find().sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules", error });
  }
};

// ✅ Update schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ClassSchedule.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "Schedule updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// ✅ Delete schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await ClassSchedule.findByIdAndDelete(id);
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
