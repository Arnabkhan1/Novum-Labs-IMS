import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Users, Calendar, FileText, Clock, BookOpen, TrendingUp, Bell, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // লোডিং স্টেট যোগ করা হলো
  const [stats, setStats] = useState({ students: 0, classesToday: 0, files: 0 });
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ১. সব ডাটা প্যারালাল রিকোয়েস্ট দিয়ে আনা হচ্ছে
        const [resStudents, resSchedule, resFiles] = await Promise.all([
           user.role === 'ADMIN' ? api.get('/admin/students') : { data: [] },
           api.get('/schedule/all'),
           api.get('/roadmap/all')
        ]);

        // ২. আজকের তারিখ (YYYY-MM-DD ফরম্যাটে)
        const today = new Date().toISOString().split('T')[0];

        // ৩. রোল অনুযায়ী ডাটা ফিল্টার
        let myClasses = [];
        let myFiles = [];

        // শিডিউল ডাটা সেফটি চেক (যদি ডাটা না থাকে তো খালি অ্যারে)
        const allSchedules = resSchedule.data || [];
        const allFiles = resFiles.data || [];

        if (user.role === 'STUDENT') {
            // স্টুডেন্ট: শুধু নিজের ক্লাস এবং নিজের ফাইল
            myClasses = allSchedules.filter(s => s.student?._id === user._id && s.date.startsWith(today));
            myFiles = allFiles.filter(f => f.student?._id === user._id).slice(0, 3);
        } else if (user.role === 'TEACHER') {
            // টিচার: শুধু নিজের ক্লাস এবং লেটেস্ট আপলোড
            myClasses = allSchedules.filter(s => s.teacher?._id === user._id && s.date.startsWith(today));
            myFiles = allFiles.slice(0, 3);
        } else {
            // এডমিন: আজকের সব ক্লাস
            myClasses = allSchedules.filter(s => s.date.startsWith(today));
            myFiles = allFiles.slice(0, 3);
        }

        // ৪. স্টেট আপডেট
        setStats({
            students: resStudents.data?.length || 0,
            classesToday: myClasses.length,
            files: user.role === 'STUDENT' ? myFiles.length : allFiles.length
        });
        setTodaysClasses(myClasses);
        setRecentFiles(myFiles);

      } catch (error) {
        console.error("Dashboard data load failed", error);
      } finally {
        setLoading(false); // লোডিং শেষ
      }
    };

    if(user) fetchData();
  }, [user]);

  // লোডিং অবস্থায় স্পিনার দেখাবে
  if (loading) {
      return (
          <div className="flex h-[80vh] justify-center items-center">
              <Loader2 className="animate-spin text-novum-cyan" size={48} />
          </div>
      );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8">
      
      {/* === HEADER SECTION === */}
      <div className="bg-gradient-to-r from-novum-light to-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                Hello, <span className="text-novum-cyan">{user?.name}</span>! 👋
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
                {user.role === 'STUDENT' 
                    ? "Ready to learn something new today? Here is your daily summary." 
                    : "Here's what's happening in your institute today."}
            </p>
        </div>
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-novum-cyan/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      {/* === STATS CARDS GRID === */}
      {/* Mobile: 1 Col, Tablet: 2 Cols, Desktop: 3 Cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-novum-light p-6 rounded-2xl border border-slate-800 hover:border-novum-cyan/50 transition duration-300 group">
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${user.role === 'STUDENT' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'} group-hover:scale-110 transition-transform`}>
                    {user.role === 'STUDENT' ? <FileText size={24} /> : <Users size={24} />}
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{user.role === 'STUDENT' ? 'My Files' : 'Total Students'}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{stats.files || stats.students}</h3>
                </div>
            </div>
        </div>

        {/* Card 2 */}
        <div className="bg-novum-light p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition duration-300 group">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Classes Today</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{stats.classesToday}</h3>
                </div>
            </div>
        </div>

        {/* Card 3 */}
        <div className="bg-novum-light p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition duration-300 group">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-orange-500/10 text-orange-400 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Your Role</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{user.role}</h3>
                </div>
            </div>
        </div>
      </div>

      {/* === MAIN CONTENT SPLIT === */}
      {/* Mobile: Stacked, Desktop: Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Today's Schedule List */}
        <div className="bg-novum-light rounded-3xl border border-slate-800 p-6 md:p-8 flex flex-col h-full shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                <Clock className="text-novum-cyan" /> {user.role === 'STUDENT' ? 'My Schedule Today' : "Today's Class Routine"}
            </h2>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {todaysClasses.length > 0 ? (
                    todaysClasses.map(schedule => (
                        <div key={schedule._id} className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition flex justify-between items-center group">
                            <div>
                                <h4 className="font-bold text-white text-lg group-hover:text-novum-cyan transition-colors">{schedule.subject}</h4>
                                <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                    <Users size={14} /> 
                                    {user.role === 'STUDENT' 
                                        ? `Teacher: ${schedule.teacher?.name || 'N/A'}` 
                                        : `Student: ${schedule.student?.name || 'N/A'}`}
                                </p>
                            </div>
                            <div className="text-right min-w-[80px]">
                                <span className="px-3 py-1 bg-novum-cyan/10 text-novum-cyan text-xs font-bold rounded-lg border border-novum-cyan/20 whitespace-nowrap">
                                    {schedule.startTime}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center h-full">
                        <Bell size={32} className="mb-3 opacity-50" />
                        <p>No classes scheduled for today.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right: Recent Files / Notices */}
        <div className="bg-novum-light rounded-3xl border border-slate-800 p-6 md:p-8 flex flex-col h-full shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                <BookOpen className="text-purple-400" /> {user.role === 'STUDENT' ? 'Recent Study Materials' : "Recently Uploaded Files"}
            </h2>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {recentFiles.length > 0 ? (
                    recentFiles.map(file => (
                        <div key={file._id} className="p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 transition flex items-center gap-4 group cursor-pointer">
                            <div className="p-3 bg-slate-800 group-hover:bg-purple-500/20 group-hover:text-purple-400 rounded-lg text-slate-400 transition-colors">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-sm truncate">{file.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {new Date(file.createdAt).toLocaleDateString()} • {file.student?.name}
                                </p>
                            </div>
                            {user.role === 'STUDENT' && (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                    NEW
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center h-full">
                        <FileText size={32} className="mb-3 opacity-50" />
                        <p>No recent files uploaded.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;