import DashboardLayout from "../../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../../utils/api";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);

  const fetchData = async () => {
    const classesRes = await api.get("/teacher/classes");
    const homeworkRes = await api.get("/teacher/homework");
    setClasses(classesRes.data);
    setHomeworks(homeworkRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-4">👨‍🏫 Teacher Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Classes Section */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl text-[#7ED6F4] mb-4">📅 Upcoming Classes</h2>
          <ul>
            {classes.map((cls) => (
              <li key={cls._id} className="mb-2 p-2 rounded bg-white/5 border border-white/10">
                <p className="font-semibold">{cls.topic}</p>
                <p className="text-sm text-gray-300">
                  {cls.date} — {cls.time} ({cls.course?.name})
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Homework Section */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-xl">
          <h2 className="text-xl text-[#7ED6F4] mb-4">🧾 Your Homework</h2>
          <ul>
            {homeworks.map((hw) => (
              <li key={hw._id} className="mb-2 p-2 rounded bg-white/5 border border-white/10">
                <p className="font-semibold">{hw.title}</p>
                <p className="text-sm text-gray-300">
                  Due: {hw.dueDate || "N/A"} ({hw.course?.name})
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
