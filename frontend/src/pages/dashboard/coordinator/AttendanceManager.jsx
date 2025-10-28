import { useState, useEffect } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";

const AttendanceManager = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    classId: "",
    status: "Present",
  });

  const [classes, setClasses] = useState([]);

  const fetchAttendance = async () => {
    const { data } = await api.get("/attendance");
    setAttendanceList(data);
  };

  const fetchClasses = async () => {
    const { data } = await api.get("/schedule");
    setClasses(data);
  };

  useEffect(() => {
    fetchAttendance();
    fetchClasses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/attendance", form);
    fetchAttendance();
    setForm({ studentName: "", studentId: "", classId: "", status: "Present" });
  };

  const handleDelete = async (id) => {
    await api.delete(`/attendance/${id}`);
    fetchAttendance();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">🧾 Attendance Manager</h1>

      {/* Attendance Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20"
      >
        <input
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <input
          name="studentId"
          placeholder="Student ID (Mongo _id)"
          value={form.studentId}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />

        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.subject} — {c.date}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>

        <button className="col-span-2 bg-[#0077C8] hover:bg-[#005fa3] py-2 rounded-xl transition">
          Mark Attendance
        </button>
      </form>

      {/* Attendance Table */}
      <div className="mt-8">
        <h2 className="text-xl mb-3">📅 Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
            <thead className="bg-white/20">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Class</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((a) => (
                <tr key={a._id} className="border-t border-white/20">
                  <td className="p-2">{a.date}</td>
                  <td className="p-2">{a.studentName}</td>
                  <td className="p-2">{a.classId?.subject}</td>
                  <td
                    className={`p-2 ${
                      a.status === "Present"
                        ? "text-green-400"
                        : a.status === "Late"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceManager;
