import DashboardLayout from "../../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../../utils/api";

const HomeworkManager = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    batch: "",
    dueDate: "",
  });
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [homeworks, setHomeworks] = useState([]);

  const fetchData = async () => {
    const courseRes = await api.get("/course");
    const batchRes = await api.get("/batch");
    const homeworkRes = await api.get("/teacher/homework");
    setCourses(courseRes.data);
    setBatches(batchRes.data);
    setHomeworks(homeworkRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/teacher/homework", form);
    setForm({ title: "", description: "", course: "", batch: "", dueDate: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/teacher/homework/${id}`);
    fetchData();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">🧾 Homework Manager</h1>

      {/* Add Homework */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20"
      >
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="p-2 rounded bg-white/10 text-white border border-white/20" />
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="p-2 rounded bg-white/10 text-white border border-white/20" />
        <select name="course" value={form.course} onChange={handleChange} className="p-2 rounded bg-white/10 text-white border border-white/20">
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="batch" value={form.batch} onChange={handleChange} className="p-2 rounded bg-white/10 text-white border border-white/20">
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="col-span-2 p-2 rounded bg-white/10 text-white border border-white/20" />
        <button type="submit" className="col-span-2 bg-[#0077C8] hover:bg-[#005fa3] py-2 rounded-xl transition">
          Add Homework
        </button>
      </form>

      {/* Homework List */}
      <div className="mt-8">
        <h2 className="text-xl mb-3">📋 Existing Homework</h2>
        <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Course</th>
              <th className="p-2 text-left">Batch</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {homeworks.map((h) => (
              <tr key={h._id} className="border-t border-white/20">
                <td className="p-2">{h.title}</td>
                <td className="p-2">{h.course?.name}</td>
                <td className="p-2">{h.batch?.name}</td>
                <td className="p-2">{h.dueDate}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(h._id)}
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
    </DashboardLayout>
  );
};

export default HomeworkManager;
