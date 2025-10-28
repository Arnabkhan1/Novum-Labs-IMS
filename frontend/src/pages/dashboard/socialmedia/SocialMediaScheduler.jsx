import DashboardLayout from "../../../layouts/DashboardLayout";

const SocialMediaScheduler = () => {
  const schedule = [
    { platform: "Instagram", post: "Classroom BTS", time: "Tomorrow 5:00 PM" },
    { platform: "Facebook", post: "Teacher Interview", time: "Friday 2:00 PM" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">🗓️ Post Scheduler</h2>
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {schedule.map((s, i) => (
          <div key={i} className="p-3 mb-2 bg-white/5 rounded-lg border border-white/10">
            <p><strong>{s.platform}</strong> — {s.post}</p>
            <p className="text-sm text-gray-300">Scheduled: {s.time}</p>
          </div>
        ))}

        <button className="mt-4 bg-[#0077C8] hover:bg-[#005fa3] text-white px-4 py-2 rounded-xl">
          + Add New Schedule
        </button>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaScheduler;
