import Attendance from "../models/Attendance.js";

// ✅ Create attendance record
export const createAttendance = async (req, res) => {
  try {
    const { date, batch, course, records } = req.body;

    const attendance = await Attendance.create({
      date,
      batch,
      course,
      teacher: req.user.id,
      records,
    });

    res.status(201).json({ message: "Attendance recorded", attendance });
  } catch (error) {
    res.status(500).json({ message: "Failed to create attendance", error });
  }
};

// ✅ Get attendance by teacher
export const getTeacherAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ teacher: req.user.id })
      .populate("batch", "name")
      .populate("course", "name")
      .populate("records.student", "name email");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance", error });
  }
};

// ✅ Summary analytics (present percentage)
export const getAttendanceStats = async (req, res) => {
  try {
    const data = await Attendance.aggregate([
      { $unwind: "$records" },
      {
        $group: {
          _id: "$teacher",
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$records.status", "Present"] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = data.map((d) => ({
      attendanceRate: ((d.present / d.total) * 100).toFixed(2),
    }));

    res.json(stats[0] || { attendanceRate: 0 });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate stats", error });
  }
};
