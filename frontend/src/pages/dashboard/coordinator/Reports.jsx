import { useEffect, useState } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    const { data } = await api.get("/reports");
    setReport(data);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!report)
    return (
      <DashboardLayout>
        <p className="text-center text-[#7ED6F4] mt-20">Loading report data...</p>
      </DashboardLayout>
    );

  const COLORS = ["#7ED6F4", "#0077C8", "#002F6C"];

  const pieData = [
    { name: "Present", value: report.present },
    { name: "Absent", value: report.absent },
    { name: "Late", value: report.late },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">📈 Reports Dashboard</h1>

      {/* Top Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl text-center">
          <p className="text-[#7ED6F4] text-sm">Total Classes</p>
          <h2 className="text-2xl font-bold">{report.totalClasses}</h2>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl text-center">
          <p className="text-[#7ED6F4] text-sm">Upcoming Classes</p>
          <h2 className="text-2xl font-bold">{report.upcomingClasses}</h2>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl text-center">
          <p className="text-[#7ED6F4] text-sm">Attendance %</p>
          <h2 className="text-2xl font-bold">{report.attendancePercentage}%</h2>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl text-center">
          <p className="text-[#7ED6F4] text-sm">Total Records</p>
          <h2 className="text-2xl font-bold">
            {report.present + report.absent + report.late}
          </h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Attendance Pie Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl mb-4 text-[#7ED6F4] font-semibold">Attendance Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Teacher Activity Bar Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl mb-4 text-[#7ED6F4] font-semibold">Teacher Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.teacherStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="teacher" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#7ED6F4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
