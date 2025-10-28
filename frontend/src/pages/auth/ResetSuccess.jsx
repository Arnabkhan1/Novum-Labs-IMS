const ResetSuccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] to-[#0077C8] p-6">
    <div className="w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-center">
      <h2 className="text-2xl font-semibold text-white mb-3">✅ Password Reset Successful</h2>
      <p className="text-[#7ED6F4] mb-6">You can now log in with your new password</p>
      <a
        href="/login"
        className="inline-block bg-[#0077C8] hover:bg-[#005fa3] text-white px-6 py-2 rounded-xl transition font-medium"
      >
        Go to Login
      </a>
    </div>
  </div>
);

export default ResetSuccess;
