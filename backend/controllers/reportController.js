import Attendance from "../models/Attendance.js";
import ClassSchedule from "../models/ClassSchedule.js";

export const getCoordinatorReport = async (req, res) => {
  try {
    // Total classes
    const totalClasses = await ClassSchedule.countDocuments();

    // Upcoming classes (today or future)
    const today = new Date().toISOString().split("T")[0];
    const upcomingClasses = await ClassSchedule.countDocuments({ date: { $gte: today } });

    // Attendance summary
    const attendance = await Attendance.find();
    const totalAttendance = attendance.length;
    const present = attendance.filter((a) => a.status === "Present").length;
    const absent = attendance.filter((a) => a.status === "Absent").length;
    const late = attendance.filter((a) => a.status === "Late").length;

    const attendancePercentage =
      totalAttendance > 0 ? ((present / totalAttendance) * 100).toFixed(1) : 0;

    // Teacher activity
    const teacherData = {};
    attendance.forEach((a) => {
      const teacher = a.classId?.teacher || "Unknown";
      if (!teacherData[teacher]) teacherData[teacher] = 0;
      teacherData[teacher] += 1;
    });

    const teacherStats = Object.entries(teacherData).map(([teacher, count]) => ({
      teacher,
      count,
    }));

    res.json({
      totalClasses,
      upcomingClasses,
      attendancePercentage,
      present,
      absent,
      late,
      teacherStats,
    });
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ message: "Failed to generate report", error });
  }
};
