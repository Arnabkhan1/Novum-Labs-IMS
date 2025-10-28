import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/otp/send", { email });
      setMessage(data.message);
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] to-[#0077C8] p-6">
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-white mb-2">Forgot Password?</h2>
        <p className="text-center text-[#7ED6F4] mb-6">Enter your registered email</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-[#7ED6F4] focus:outline-none"
          />

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          {message && <p className="text-green-400 text-center text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-[#0077C8] hover:bg-[#005fa3] text-white py-3 rounded-xl transition font-medium"
          >
            Send OTP
          </button>
        </form>

        <p className="text-center text-sm text-[#7ED6F4] mt-6">
          Remember password?{" "}
          <a href="/login" className="hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
