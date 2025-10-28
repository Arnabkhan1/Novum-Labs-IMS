import { useEffect, useState } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const FeedbackReports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState([]);

  const fetchFeedback = async () => {
    const { data } = await api.get("/feedback");
    setFeedbacks(data);
  };

  const fetchStats = async () => {
    const { data } = await api.get("/feedback/stats");
    setStats(data);
  };

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">⭐ Feedback & Performance Reports</h1>

      {/* Analytics Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl mb-4 text-[#7ED6F4] font-semibold">Teacher Ratings Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="teacher" stroke="#fff" />
              <YAxis stroke="#fff" domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avgRating" fill="#7ED6F4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl mb-4 text-[#7ED6F4] font-semibold">Feedback Submission Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={feedbacks.map((f, i) => ({ index: i + 1, rating: f.rating }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="index" stroke="#fff" />
              <YAxis stroke="#fff" domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#0077C8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="mt-8">
        <h2 className="text-xl mb-3 text-[#7ED6F4]">📋 All Feedbacks</h2>
        <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Teacher</th>
              <th className="p-2 text-left">Course</th>
              <th className="p-2 text-left">Rating</th>
              <th className="p-2 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f._id} className="border-t border-white/20">
                <td className="p-2">{f.student?.name || "N/A"}</td>
                <td className="p-2">{f.teacher?.name || "N/A"}</td>
                <td className="p-2">{f.course?.name || "N/A"}</td>
                <td className="p-2 text-[#7ED6F4] font-semibold">{f.rating}</td>
                <td className="p-2">{f.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackReports;
