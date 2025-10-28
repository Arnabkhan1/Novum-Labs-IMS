import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../utils/api";

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/ai").then((res) => setData(res.data));
  }, []);

  if (!data) return <DashboardLayout>Loading AI Insights...</DashboardLayout>;

  const { aiSummary, attendance, performance, sentiment } = data;

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">AI Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg">
          <h3 className="text-xl text-[#7ED6F4] font-semibold">Attendance Overview</h3>
          <p className="text-4xl font-bold text-white mt-2">
            {attendance.length ? `${attendance[0].attendanceRate.toFixed(1)}%` : "N/A"}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg">
          <h3 className="text-xl text-[#7ED6F4] font-semibold">Performance</h3>
          <p className="text-4xl font-bold text-white mt-2">
            {performance.length ? `${performance[0].performance.toFixed(1)}%` : "N/A"}
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg">
          <h3 className="text-xl text-[#7ED6F4] font-semibold">Parent Sentiment</h3>
          <p className="text-4xl font-bold text-white mt-2">
            {sentiment.avgRating ? sentiment.avgRating.toFixed(1) : "N/A"} ⭐
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-lg">
        <h3 className="text-xl text-[#7ED6F4] font-semibold mb-2">AI Summary</h3>
        <p className="text-white mb-3">{aiSummary.summary}</p>
        <p className="text-[#7ED6F4] font-medium mb-2">
          Health: {aiSummary.overallHealth}
        </p>
        <ul className="list-disc list-inside text-gray-300">
          {aiSummary.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
