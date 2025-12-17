// client/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, Loader2, Layers, ArrowRight } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Login Successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Login failed!';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // CHANGE: h-screen এবং w-screen ব্যবহার করা হয়েছে যাতে পেজ ফিক্সড থাকে
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 font-sans relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <Toaster position="top-center" 
         toastOptions={{
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
         }}
      />
      
      {/* Main Card */}
      <div className="bg-slate-900/80 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800 relative z-10 backdrop-blur-md">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 mb-4 shadow-lg shadow-cyan-900/20">
            <Layers className="text-cyan-400 w-7 h-7 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to Novum Labs dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition" />
              </div>
              <input
                type="email" required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition placeholder-slate-600 sm:text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition" />
              </div>
              <input
                type="password" required
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition placeholder-slate-600 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-800 pt-4">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">Secured by Novum Labs</p>
        </div>
      </div>
    </div>
  );
};

export default Login;