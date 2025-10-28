import DashboardLayout from "../../../layouts/DashboardLayout";

const SocialMediaIdeas = () => {
  const ideas = [
    "Student Journey Mini Reel",
    "Behind the Scenes of Robotics Lab",
    "Interview with Top Performing Student",
    "Motivational Quote of the Day",
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">💡 Content Ideas</h2>
      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        <ul className="list-disc list-inside text-gray-200">
          {ideas.map((idea, i) => (
            <li key={i} className="mb-2">{idea}</li>
          ))}
        </ul>

        <button className="mt-4 bg-[#7ED6F4]/20 hover:bg-[#7ED6F4]/30 text-[#7ED6F4] px-4 py-2 rounded-xl">
          ✨ Generate AI Ideas
        </button>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaIdeas;
