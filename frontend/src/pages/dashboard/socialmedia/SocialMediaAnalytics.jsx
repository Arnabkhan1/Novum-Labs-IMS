import DashboardLayout from "../../../layouts/DashboardLayout";

const SocialMediaAnalytics = () => {
  const analytics = [
    { platform: "Instagram", reach: "12.4k", engagement: "2.3k", growth: "+8%" },
    { platform: "Facebook", reach: "9.2k", engagement: "1.5k", growth: "+4%" },
    { platform: "YouTube", reach: "15.6k", engagement: "3.1k", growth: "+10%" },
  ];

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">📊 Social Media Analytics</h2>

      <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-xl">
        {analytics.map((a, i) => (
          <div key={i} className="p-3 mb-2 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
            <p><strong>{a.platform}</strong></p>
            <div className="text-sm text-gray-300 text-right">
              <p>Reach: {a.reach}</p>
              <p>Engagement: {a.engagement}</p>
              <p className="text-green-400">{a.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaAnalytics;
