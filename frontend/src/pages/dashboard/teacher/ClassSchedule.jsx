import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../utils/api";
import { CalendarDays } from "lucide-react";

const ClassSchedule = () => {
  const [classes, setClasses] = useState([]);

  // Fetch teacher classes
  const fetchClasses = async () => {
    try {
      const { data } = await api.get("/teacher/classes");
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays size={28} className="text-[#7ED6F4]" />
        <h1 className="text-3xl font-semibold">📅 Class Schedule</h1>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl">
        {classes.length === 0 ? (
          <p className="text-gray-300 text-center py-10">
            No upcoming classes scheduled.
          </p>
        ) : (
          <div className="grid gap-4">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-[#7ED6F4]">
                    {cls.topic}
                  </h2>
                  <span className="text-sm text-gray-300">
                    {cls.date} • {cls.time} ({cls.duration})
                  </span>
                </div>
                <p className="text-sm">
                  Course: <span className="text-[#7ED6F4]">{cls.course?.name}</span>
                </p>
                <p className="text-sm">
                  Batch: <span className="text-[#7ED6F4]">{cls.batch?.name}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassSchedule;
