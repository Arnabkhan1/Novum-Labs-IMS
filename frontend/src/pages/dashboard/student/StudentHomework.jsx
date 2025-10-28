import DashboardLayout from "../../../layouts/DashboardLayout";

const StudentHomework = () => {
  const homework = [
    { subject: "Physics", task: "Read Chapter 5", deadline: "Tomorrow" },
    { subject: "Math", task: "Solve Exercise 3.2", deadline: "Today 8 PM" },
    { subject: "Computer", task: "Submit project report", deadline: "Next Monday" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">📝 Homework</h2>
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {homework.map((hw, idx) => (
          <div key={idx} className="p-3 mb-2 bg-white/5 rounded-lg border border-white/10">
            <p><strong>{hw.subject}</strong> — {hw.task}</p>
            <p className="text-sm text-gray-300">Deadline: {hw.deadline}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentHomework;
