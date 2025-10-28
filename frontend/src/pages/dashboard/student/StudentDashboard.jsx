import DashboardLayout from "../../../layouts/DashboardLayout";

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">🎓 Welcome to Your Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Summary */}
        <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
          <h3 className="text-xl text-[#7ED6F4] font-semibold mb-3">Quick Stats</h3>
          <p>Attendance: <span className="text-green-400 font-semibold">92%</span></p>
          <p>Homework Completed: <span className="text-green-400 font-semibold">15/17</span></p>
          <p>Upcoming Classes: 3</p>
        </div>

        {/* Notifications */}
        <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
          <h3 className="text-xl text-[#7ED6F4] font-semibold mb-3">Recent Notifications</h3>
          <ul className="list-disc list-inside text-gray-200">
            <li>Math test on Friday</li>
            <li>New homework uploaded by Physics teacher</li>
            <li>Parent meeting scheduled next week</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
