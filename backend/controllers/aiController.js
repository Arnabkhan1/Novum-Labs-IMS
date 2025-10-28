import { getAttendanceAnalytics, getPerformanceSummary, getGuardianSentiment } from "../services/analyticsService.js";
import { generateAIInsights } from "../services/aiService.js";

export const getAIDashboardData = async (req, res) => {
  try {
    const attendance = await getAttendanceAnalytics();
    const performance = await getPerformanceSummary();
    const sentiment = await getGuardianSentiment();

    const aiSummary = await generateAIInsights(attendance, performance, sentiment);

    res.status(200).json({
      aiSummary,
      attendance,
      performance,
      sentiment,
    });
  } catch (error) {
    console.error("AI Dashboard Error:", error);
    res.status(500).json({ message: "Failed to generate AI dashboard data" });
  }
};
