// client/src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, Users, Layers, Bell } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: 'User', role: 'GUEST' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate('/');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const SidebarLink = ({ path, icon: Icon, label }) => {
    const isActive = location.pathname === path;
    return (
      <div 
        onClick={() => navigate(path)}
        className={`flex items-center px-4 py-3.5 mx-3 rounded-lg cursor-pointer transition-all duration-200 group ${
          isActive 
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={20} className={`mr-3 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
        <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-300">
      
      {/* SIDEBAR - Darker Shade */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-lg">
                <Layers className="text-cyan-400" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Novum Labs</h1>
                <p className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Institute Manager</p>
            </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarLink path="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink path="/students" icon={Users} label="Students" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="flex items-center text-slate-400 hover:text-red-400 hover:bg-slate-800/50 w-full px-4 py-3 rounded-lg transition"
          >
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        
        {/* TOP NAVBAR - Transparent/Dark */}
        <header className="bg-slate-900/80 backdrop-blur-md h-16 border-b border-slate-800 flex justify-between items-center px-8 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-slate-100 capitalize">
                {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h2>

            <div className="flex items-center gap-6">
                <button className="relative text-slate-400 hover:text-cyan-400 transition p-2 hover:bg-slate-800 rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-1 right-2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                </button>
                
                <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-cyan-500 font-medium">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center font-bold shadow-lg">
                        {user.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
            <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;