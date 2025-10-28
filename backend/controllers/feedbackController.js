import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

// ✅ Student submits feedback
export const createFeedback = async (req, res) => {
  try {
    const { teacher, course, rating, comment } = req.body;

    const feedback = await Feedback.create({
      student: req.user.id,
      teacher,
      course,
      rating,
      comment,
    });

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit feedback", error });
  }
};

// ✅ Admin fetches all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name email")
      .populate("teacher", "name email")
      .populate("course", "name code");

    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch feedback", error });
  }
};

// ✅ Analytics summary (average ratings per teacher)
export const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: "$teacher",
          avgRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 },
        },
      },
    ]);

    const detailedStats = await Promise.all(
      stats.map(async (s) => {
        const teacher = await User.findById(s._id).select("name email");
        return {
          teacher: teacher?.name || "Unknown",
          avgRating: s.avgRating.toFixed(2),
          totalFeedbacks: s.totalFeedbacks,
        };
      })
    );

    res.json(detailedStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate stats", error });
  }
};
