import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [form, setForm] = useState({ title: "", caption: "", useAI: false, scheduledAt: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post("/social", form);
    navigate("/dashboard/socialmedia");
  };

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-semibold mb-6">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          name="title"
          placeholder="Post Title"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          onChange={handleChange}
        />
        <textarea
          name="caption"
          placeholder="Caption"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="scheduledAt"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
          onChange={handleChange}
        />
        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            onChange={(e) => setForm({ ...form, useAI: e.target.checked })}
          />
          <span>Use AI for Caption</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#0077C8] hover:bg-[#005fa3] rounded-xl"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default CreatePost;
