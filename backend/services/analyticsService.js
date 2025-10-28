import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Feedback from "../models/Feedback.js";

// ✅ Attendance Analysis
export const getAttendanceAnalytics = async () => {
  const data = await Attendance.aggregate([
    { $group: { _id: "$studentId", total: { $sum: 1 }, present: { $sum: { $cond: ["$present", 1, 0] } } } },
    { $project: { studentId: "$_id", attendanceRate: { $multiply: [{ $divide: ["$present", "$total"] }, 100] } } },
  ]);
  return data;
};

// ✅ Performance Summary
export const getPerformanceSummary = async () => {
  const data = await Student.aggregate([
    { $unwind: "$marks" },
    { $group: { _id: "$_id", avgMarks: { $avg: "$marks.score" } } },
    { $project: { studentId: "$_id", performance: "$avgMarks" } },
  ]);
  return data;
};

// ✅ Guardian Sentiment Summary
export const getGuardianSentiment = async () => {
  const data = await Feedback.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);
  return data[0] || { avgRating: 0 };
};
