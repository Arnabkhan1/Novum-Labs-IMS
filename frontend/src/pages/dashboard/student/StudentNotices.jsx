import DashboardLayout from "../../../layouts/DashboardLayout";

const StudentNotices = () => {
  const notices = [
    { title: "Midterm Exams start from 10 Nov", date: "28 Oct 2025" },
    { title: "Holiday on 2 Nov for event", date: "26 Oct 2025" },
    { title: "Project submission deadline extended", date: "25 Oct 2025" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">📢 Notices & Announcements</h2>
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {notices.map((n, i) => (
          <div key={i} className="p-3 mb-2 bg-white/5 rounded-lg border border-white/10">
            <p className="text-[#7ED6F4] font-semibold">{n.title}</p>
            <p className="text-sm text-gray-300">Date: {n.date}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotices;
