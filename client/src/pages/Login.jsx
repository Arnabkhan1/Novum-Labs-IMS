import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ১. user স্টেটটিও আনা হলো (রিডাইরেক্ট চেকিংয়ের জন্য)
  const { login, user } = useContext(AuthContext); 
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ২. অটোমেটিক রিডাইরেক্ট লজিক (সবচেয়ে নিরাপদ উপায়)
  // ইউজার যদি লগইন অবস্থায় থাকে, তাকে ড্যাশবোর্ডে পাঠিয়ে দেবে
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // ৩. লগইন ফাংশন কল
        // সফল হলে AuthContext এর user স্টেট আপডেট হবে এবং উপরের useEffect কাজ করবে
        const isSuccess = await login(email, password);

        // যদি ব্যর্থ হয়, শুধু তখনই লোডিং বন্ধ হবে
        if (!isSuccess) {
            setLoading(false);
        }
    } catch (error) {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-novum-dark px-4 py-12">
      <div className="w-full max-w-md bg-novum-light p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden animate-fade-in">
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-novum-cyan/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back!</h1>
            <p className="text-slate-400 text-sm md:text-base">Please sign in to continue learning.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-novum-muted uppercase tracking-widest ml-1 group-focus-within:text-novum-cyan transition-colors">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-11 pr-4 py-4 bg-novum-dark border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-novum-cyan focus:ring-1 focus:ring-novum-cyan transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold text-novum-muted uppercase tracking-widest ml-1 group-focus-within:text-novum-cyan transition-colors">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-11 pr-4 py-4 bg-novum-dark border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-novum-cyan focus:ring-1 focus:ring-novum-cyan transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>
          
          <p className="text-center text-slate-500 text-sm mt-8">
            Forgot your password? <span className="text-novum-cyan hover:underline cursor-pointer transition-colors">Contact Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;