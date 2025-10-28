import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/signup", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] to-[#0077C8] p-6">
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Create Account 🧠
        </h2>
        <p className="text-center text-[#7ED6F4] mb-8">
          Join Novum Labs IMS today
        </p>

        {success ? (
          <p className="text-center text-green-400 font-medium">
            Account created successfully! Redirecting to login...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-white text-sm mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                required
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-[#7ED6F4] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-[#7ED6F4] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-[#7ED6F4] focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-white text-sm mb-1">Select Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#7ED6F4] focus:outline-none"
              >
                <option className="bg-blue-950" value="student">🎓 Student</option>
                <option className="bg-blue-950" value="teacher">👨‍🏫 Teacher</option>
                <option className="bg-blue-950" value="coordinator">🎯 Coordinator</option>
                <option className="bg-blue-950" value="admin">👨‍💼 Admin</option>
                <option className="bg-blue-950" value="superadmin">🧠 SuperAdmin</option>
                <option className="bg-blue-950" value="socialmedia">📣 Social Media Handler</option>
                <option className="bg-blue-950" value="videoeditor">🎬 Video Editor</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0077C8] hover:bg-[#005fa3] text-white py-3 rounded-xl transition font-medium"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6 text-[#7ED6F4]">
          Already have an account?{" "}
          <a href="/login" className="hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
