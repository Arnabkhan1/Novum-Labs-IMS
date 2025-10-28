import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../utils/api";

const VideoDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/video").then((res) => setProjects(res.data));
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-4">Video Projects</h2>
      <button
        onClick={() => (window.location.href = "/dashboard/videoeditor/create")}
        className="mb-4 px-4 py-2 bg-[#0077C8] rounded-xl hover:bg-[#005fa3]"
      >
        + New Project
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-lg"
          >
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-[#7ED6F4]">{p.client}</p>
            <p className="text-xs mt-1">Status: {p.status}</p>
            {p.thumbnailUrl && (
              <img
                src={p.thumbnailUrl}
                alt="Thumbnail"
                className="w-full rounded-xl mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default VideoDashboard;
