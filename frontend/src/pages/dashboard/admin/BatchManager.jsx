import { useEffect, useState } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";

const BatchManager = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    course: "",
    startDate: "",
    endDate: "",
  });

  // ✅ Fetch existing batches
  const fetchBatches = async () => {
    const { data } = await api.get("/batch");
    setBatches(data);
  };

  // ✅ Fetch course list for dropdown
  const fetchCourses = async () => {
    const { data } = await api.get("/course");
    setCourses(data);
  };

  useEffect(() => {
    fetchBatches();
    fetchCourses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Create new batch
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/batch", form);
    setForm({ name: "", course: "", startDate: "", endDate: "" });
    fetchBatches();
  };

  // ✅ Delete batch
  const handleDelete = async (id) => {
    await api.delete(`/batch/${id}`);
    fetchBatches();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">🗂️ Batch Manager</h1>

      {/* Batch Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Batch Name (e.g., BSc-2025-A)"
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />

        <select
          name="course"
          value={form.course}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />

        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />

        <button
          type="submit"
          className="col-span-2 bg-[#0077C8] hover:bg-[#005fa3] py-2 rounded-xl transition"
        >
          Add Batch
        </button>
      </form>

      {/* Batch List */}
      <div className="mt-8">
        <h2 className="text-xl mb-3">📋 Existing Batches</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
            <thead className="bg-white/20">
              <tr>
                <th className="p-2 text-left">Batch Name</th>
                <th className="p-2 text-left">Course</th>
                <th className="p-2 text-left">Start</th>
                <th className="p-2 text-left">End</th>
                <th className="p-2 text-left">Students</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b._id} className="border-t border-white/20">
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.course?.name || "N/A"}</td>
                  <td className="p-2">{b.startDate}</td>
                  <td className="p-2">{b.endDate}</td>
                  <td className="p-2 text-[#7ED6F4]">
                    {b.students?.length || 0}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BatchManager;
