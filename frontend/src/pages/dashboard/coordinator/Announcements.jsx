import { useEffect, useState } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";

const Announcements = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    targetRoles: [],
  });
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    const { data } = await api.get("/announcement");
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckbox = (role) => {
    setForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/announcement", form);
    setForm({ title: "", message: "", targetRoles: [] });
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    await api.delete(`/announcement/${id}`);
    fetchAnnouncements();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">📢 Announcements</h1>

      {/* Create Announcement Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl space-y-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Announcement Title"
          className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your message..."
          rows="3"
          className="w-full p-2 rounded bg-white/10 text-white border border-white/20"
        />

        {/* Target Roles */}
        <div className="flex flex-wrap gap-3 text-sm">
          {["student", "teacher", "coordinator", "admin"].map((role) => (
            <label
              key={role}
              className={`px-3 py-1 rounded-xl cursor-pointer border border-white/20 ${
                form.targetRoles.includes(role)
                  ? "bg-[#0077C8]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <input
                type="checkbox"
                value={role}
                onChange={() => handleCheckbox(role)}
                checked={form.targetRoles.includes(role)}
                className="hidden"
              />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </label>
          ))}
        </div>

        <button className="w-full bg-[#0077C8] hover:bg-[#005fa3] py-2 rounded-xl transition">
          Publish Announcement
        </button>
      </form>

      {/* Announcements List */}
      <div className="mt-8">
        <h2 className="text-xl mb-3">🧾 Recent Announcements</h2>
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-[#7ED6F4]">{a.title}</h3>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✖
                </button>
              </div>
              <p className="text-white/80">{a.message}</p>
              <p className="text-sm text-[#7ED6F4] mt-2">
                📤 Sent to: {a.targetRoles.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Announcements;
