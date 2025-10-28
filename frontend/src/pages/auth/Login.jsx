import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] to-[#0077C8] p-6">
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-[#7ED6F4] mb-8">
          Sign in to your Novum Labs IMS account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#7ED6F4]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#7ED6F4]"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0077C8] hover:bg-[#005fa3] text-white py-3 rounded-xl font-medium transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm text-[#7ED6F4]">
          <a href="/forgot" className="hover:underline">
            Forgot password?
          </a>
          <a href="/signup" className="hover:underline">
            Create new account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
