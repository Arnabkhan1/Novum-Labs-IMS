import { useState, useEffect } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";

const ClassScheduler = () => {
  const [form, setForm] = useState({
    subject: "",
    teacher: "",
    classRoom: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    const { data } = await api.get("/schedule");
    setSchedules(data);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/schedule", form);
    fetchSchedules();
    setForm({ subject: "", teacher: "", classRoom: "", date: "", startTime: "", endTime: "" });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">📅 Class Scheduler</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20">
        <input name="subject" placeholder="Subject" onChange={handleChange} value={form.subject} className="p-2 rounded bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#7ED6F4]" />
        <input name="teacher" placeholder="Teacher Name" onChange={handleChange} value={form.teacher} className="p-2 rounded bg-white/10 text-white border border-white/20" />
        <input name="classRoom" placeholder="Classroom" onChange={handleChange} value={form.classRoom} className="p-2 rounded bg-white/10 text-white border border-white/20" />
        <input type="date" name="date" onChange={handleChange} value={form.date} className="p-2 rounded bg-white/10 text-white border border-white/20" />
        <input type="time" name="startTime" onChange={handleChange} value={form.startTime} className="p-2 rounded bg-white/10 text-white border border-white/20" />
        <input type="time" name="endTime" onChange={handleChange} value={form.endTime} className="p-2 rounded bg-white/10 text-white border border-white/20" />

        <button className="col-span-2 bg-[#0077C8] hover:bg-[#005fa3] py-2 rounded-xl transition">
          Add Schedule
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl mb-3">🧾 Scheduled Classes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
            <thead className="bg-white/20">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Teacher</th>
                <th className="p-2 text-left">Room</th>
                <th className="p-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s._id} className="border-t border-white/20">
                  <td className="p-2">{s.date}</td>
                  <td className="p-2">{s.subject}</td>
                  <td className="p-2">{s.teacher}</td>
                  <td className="p-2">{s.classRoom}</td>
                  <td className="p-2">
                    {s.startTime} - {s.endTime}
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

export default ClassScheduler;
