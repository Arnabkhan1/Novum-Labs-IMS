import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ShieldCheck } from 'lucide-react'; // অপ্রয়োজনীয় আইকন সরিয়ে দিয়েছি
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 0 });
  const [user, setUser] = useState({ name: 'User', role: 'GUEST' });

  useEffect(() => {
    // ১. লোকাল স্টোরেজ থেকে ইউজার লোড করা
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // ২. API থেকে স্ট্যাটস লোড করা
    const fetchStats = async () => {
      try {
        const response = await api.get('/students/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. HERO BANNER (Dark Navy Gradient) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-slate-800 p-8 shadow-2xl">
        
        {/* Background Glow Effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500 opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-blue-600 opacity-5 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user.name}</span>! 🚀
            </h1>
            <p className="text-slate-400 max-w-lg text-sm leading-relaxed">
              System status is <span className="text-emerald-400 font-bold">Online</span>. 
              Currently managing the student database.
            </p>
            
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => navigate('/add-student')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(8,145,178,0.3)]"
              >
                <UserPlus size={18} /> Add Student
              </button>
            </div>
          </div>
          
          {/* Right Side 3D Icon Box */}
          <div className="hidden md:flex bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm items-center justify-center">
             <ShieldCheck size={56} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </div>
        </div>
      </div>

      {/* 2. ONLY TOTAL STUDENTS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          color="text-cyan-400" 
          bgColor="bg-cyan-950/40" 
          borderColor="border-cyan-500/20"
          shadowColor="shadow-cyan-900/20"
        />
        
        {/* Active Classes & Teachers Card removed as requested */}
      </div>

      {/* Recent Activity & Quick Actions removed as requested */}

    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, bgColor, borderColor, shadowColor }) => (
  <div className={`bg-slate-900/80 p-6 rounded-2xl border ${borderColor} shadow-lg ${shadowColor} backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 group`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-4xl font-extrabold text-white tracking-tight">{value < 10 ? `0${value}` : value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgColor} ${color} border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default Dashboard;