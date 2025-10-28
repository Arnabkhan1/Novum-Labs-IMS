import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../utils/api";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#7ED6F4", "#0077C8"];

const TeacherReports = () => {
  const [attendanceStats, setAttendanceStats] = useState(0);
  const [attendanceList, setAttendanceList] = useState([]);

  const fetchData = async () => {
    const stats = await api.get("/attendance/stats");
    const list = await api.get("/attendance");
    setAttendanceStats(stats.data.attendanceRate);
    setAttendanceList(list.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    { name: "Present", value: attendanceStats },
    { name: "Absent", value: 100 - attendanceStats },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">📊 Attendance & Reports</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Attendance Pie Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl mb-4 text-[#7ED6F4] font-semibold">
            Attendance Rate
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center mt-3 text-gray-300">
            Attendance Rate:{" "}
            <span className="text-[#7ED6F4] font-semibold">
              {attendanceStats}%
            </span>
          </p>
        </div>

        {/* Attendance by Batch */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl mb-4 text-[#7ED6F4] font-semibold">
            Attendance Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
              <thead className="bg-white/20">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Batch</th>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Students Present</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((a) => (
                  <tr key={a._id} className="border-t border-white/20">
                    <td className="p-2">{a.date}</td>
                    <td className="p-2">{a.batch?.name}</td>
                    <td className="p-2">{a.course?.name}</td>
                    <td className="p-2 text-[#7ED6F4]">
                      {a.records.filter((r) => r.status === "Present").length} /{" "}
                      {a.records.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherReports;
