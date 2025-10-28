import DashboardLayout from "../../../layouts/DashboardLayout";

const StudentAttendance = () => {
  const attendanceData = [
    { date: "25 Oct", status: "Present" },
    { date: "26 Oct", status: "Absent" },
    { date: "27 Oct", status: "Present" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">📅 Attendance Record</h2>
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {attendanceData.map((a, i) => (
          <div
            key={i}
            className={`p-3 mb-2 rounded-lg border ${
              a.status === "Present"
                ? "border-green-500 bg-green-500/10"
                : "border-red-500 bg-red-500/10"
            }`}
          >
            <p><strong>{a.date}</strong> — {a.status}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
