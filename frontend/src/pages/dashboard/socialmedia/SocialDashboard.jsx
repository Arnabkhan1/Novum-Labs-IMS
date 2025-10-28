import DashboardLayout from "../../../layouts/DashboardLayout";

const SocialMediaDashboard = () => {
  const posts = [
    { title: "New Batch Announcement", status: "Scheduled", time: "Tomorrow 9:00 AM" },
    { title: "Student Success Story", status: "Published", time: "Today 10:00 AM" },
    { title: "Behind The Scenes Video", status: "Draft", time: "Pending Review" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">📱 Social Media Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scheduled Posts */}
        <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
          <h3 className="text-xl text-[#7ED6F4] font-semibold mb-3">Scheduled Posts</h3>
          {posts.map((post, i) => (
            <div key={i} className="p-3 mb-2 bg-white/5 rounded-lg border border-white/10">
              <p><strong>{post.title}</strong></p>
              <p className="text-sm text-gray-300">
                {post.status} — {post.time}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl text-center">
          <h3 className="text-xl text-[#7ED6F4] font-semibold mb-3">Quick Actions</h3>
          <button className="bg-[#0077C8] hover:bg-[#005fa3] text-white px-4 py-2 rounded-xl w-full mb-3">
            + Create New Post
          </button>
          <button className="bg-[#7ED6F4]/20 hover:bg-[#7ED6F4]/30 text-[#7ED6F4] px-4 py-2 rounded-xl w-full">
            Generate Hashtags (AI)
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaDashboard;
