import { useEffect, useState } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    duration: "",
  });

  const fetchCourses = async () => {
    const { data } = await api.get("/course");
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/course", form);
    setForm({ name: "", code: "", description: "", duration: "" });
    fetchCourses();
  };

  const handleDelete = async (id) => {
    await api.delete(`/course/${id}`);
    fetchCourses();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">📘 Course Manager</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white/10 p-6 rounded-2xl backdrop-blur-xl border border-white/20"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Course Name"
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Course Code"
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (e.g., 6 Months)"
          className="p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="col-span-2 p-2 rounded bg-white/10 text-white border border-white/20"
        />
        <button className="col-span-2 bg-[#0077C8] hover:bg-[#005fa3] py-2 rounded-xl transition">
          Add Course
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl mb-3">📚 Course List</h2>
        <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t border-white/20">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.code}</td>
                <td className="p-2">{c.duration}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(c._id)}
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

export default CourseManager;
