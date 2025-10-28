import DashboardLayout from "../../../layouts/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">👨‍💼 Admin Dashboard</h1>
      <p className="text-[#7ED6F4] mb-4">
        Manage your institute operations, teachers, students, and courses here.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Total Users", value: "54" },
          { title: "Active Teachers", value: "12" },
          { title: "Running Batches", value: "8" },
        ].map((card) => (
          <div
            key={card.title}
            className="p-4 bg-white/10 border border-white/20 rounded-2xl text-center backdrop-blur-xl"
          >
            <h2 className="text-[#7ED6F4] text-sm">{card.title}</h2>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
