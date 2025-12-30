import { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, UserPlus, Calendar, Map, LogOut, Briefcase, 
  Menu, X, Bell, Search, MessageSquare, HelpCircle, ChevronDown, Book, PieChart, CheckCircle
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Updated Menu Items with Attendance Logic
  const allMenuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, role: ['ADMIN', 'TEACHER', 'STUDENT'] },
    
    // Admin & Teacher Only
    { name: 'All Students', path: '/students', icon: Users, role: ['ADMIN', 'TEACHER'] },
    
    // Admin Only Management
    { name: 'Add Student', path: '/add-student', icon: UserPlus, role: ['ADMIN'] },
    { name: 'Add Teacher', path: '/add-teacher', icon: Briefcase, role: ['ADMIN'] },
    
    // Course Management
    { name: 'Course Manager', path: '/student-courses', icon: Book, role: ['ADMIN', 'TEACHER'] },
    { name: 'My Courses', path: '/student-courses', icon: Book, role: ['STUDENT'] }, // Same path, different label logic handles in component

    // Resources
    { name: 'Roadmap', path: '/roadmap', icon: Map, role: ['ADMIN', 'TEACHER', 'STUDENT'] },

    // ✅ Attendance Logic Added Here
    { name: 'Attendance Manager', path: '/attendance', icon: CheckCircle, role: ['ADMIN'] },
    { name: 'My Attendance', path: '/my-attendance', icon: PieChart, role: ['STUDENT'] },
  ];

  // Role based filtering
  const myMenu = allMenuItems.filter(item => user && item.role.includes(user.role));
  
  // Get Current Page Name for Header
  const currentPage = allMenuItems.find(item => item.path === location.pathname)?.name || 'Portal';
  
  // Date Formatting
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      
      {/* === 1. SIDEBAR (Left) === */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex flex-col justify-center px-6 border-b border-slate-800 bg-slate-900">
          <h1 className="text-2xl font-extrabold text-white tracking-wider">
            NOVUM <span className="text-cyan-400">LABS</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">
            Institute Manager
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-2 custom-scrollbar">
          {myMenu.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={index} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                  ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-black' : 'text-slate-500 group-hover:text-cyan-400 transition-colors'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all">
            <LogOut size={20} /> <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* === 2. TOP NAVBAR (Fixed Top) === */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-40 flex items-center justify-between px-4 md:px-8 shadow-sm">
        
        {/* Left: Mobile Toggle & Title/Date */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white hover:bg-slate-800 rounded-lg md:hidden transition">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div>
            <h2 className="text-xl font-bold text-white capitalize leading-tight">
              {currentPage}
            </h2>
            <p className="text-xs text-slate-500 font-medium hidden md:block">
              {today}
            </p>
          </div>
        </div>

        {/* Center: Search Bar (Desktop Only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
                <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-500"
                />
            </div>
        </div>

        {/* Right: Icons & Profile */}
        <div className="flex items-center gap-3 md:gap-5">
           
           {/* Quick Action Icons */}
           <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
               <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition hidden sm:block" title="Help">
                  <HelpCircle size={20} />
               </button>
               <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition hidden sm:block" title="Messages">
                  <MessageSquare size={20} />
               </button>
               <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-full transition relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
               </button>
           </div>

           {/* User Profile */}
           <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-800 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-slate-700">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                 {user?.name?.charAt(0)}
              </div>
              <div className="hidden md:block">
                 <p className="text-xs font-bold text-white leading-none">{user?.name?.split(' ')[0]}</p>
                 <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wide mt-0.5">{user?.role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-500 hidden md:block" />
           </div>
        </div>
      </header>

      {/* === 3. OVERLAY (Mobile) === */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* === 4. MAIN CONTENT === */}
      <div className="pt-20 md:ml-64 min-h-screen bg-slate-900">
        <main className="p-4 md:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Layout;