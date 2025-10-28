import DashboardLayout from "../../../layouts/DashboardLayout";

const StudentClasses = () => {
  const classes = [
    { subject: "Physics", time: "10:00 AM", teacher: "Mr. Rajan" },
    { subject: "Math", time: "12:00 PM", teacher: "Mr. Bubai" },
    { subject: "Computer Science", time: "2:30 PM", teacher: "Mr. Aritra" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">📚 Today’s Classes</h2>
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {classes.map((cls, i) => (
          <div key={i} className="p-3 mb-2 bg-white/5 rounded-lg border border-white/10">
            <p><strong>{cls.subject}</strong> — {cls.time}</p>
            <p className="text-sm text-gray-300">Teacher: {cls.teacher}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
