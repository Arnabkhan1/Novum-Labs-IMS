import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, FileText, Clock, BookOpen, TrendingUp, Bell, Loader2, ShieldCheck, User } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ classesToday: 0, files: 0 });
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ১. আমরা এখন 'Students' এর ডাটা থেকে রুটিন বের করব (Schedule API থেকে না)
        // কারণ Student-এর প্রোফাইলেই লেখা আছে সে সোমবারে পড়ে নাকি রবিবারে।
        const [resStudents, resFiles] = await Promise.all([
           api.get('/admin/students'), // সব স্টুডেন্টের ডাটা (যেখানে কোর্স ও বার লেখা আছে)
           api.get('/roadmap/all')
        ]);

        const allStudents = resStudents.data || [];
        const allFiles = resFiles.data || [];

        // ২. আজকের বারের নাম বের করা (যেমন: Sunday, Monday)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()]; // আজ কি বার?

        let myClasses = [];
        let myFiles = [];

        // ৩. অটোমেটিক রুটিন জেনারেশন লজিক
        allStudents.forEach(student => {
            if (student.courses && student.courses.length > 0) {
                student.courses.forEach(course => {
                    // চেক করি: এই কোর্সের ক্লাস কি আজকে (todayName) আছে?
                    if (course.classDays && course.classDays.includes(todayName)) {
                        
                        const classInfo = {
                            _id: course._id || Math.random(), // ইউনিক আইডি
                            subject: course.subject,
                            teacherName: course.teacherId?.name || 'Unknown Teacher',
                            studentName: student.name,
                            day: todayName
                        };

                        // রোল অনুযায়ী ফিল্টার
                        if (user.role === 'ADMIN') {
                            myClasses.push(classInfo);
                        } 
                        else if (user.role === 'TEACHER' && course.teacherId?._id === user._id) {
                            myClasses.push(classInfo);
                        } 
                        else if (user.role === 'STUDENT' && student._id === user._id) {
                            myClasses.push(classInfo);
                        }
                    }
                });
            }
        });

        // ৪. ফাইল ফিল্টারিং
        if (user.role === 'STUDENT') {
            myFiles = allFiles.filter(f => f.student?._id === user._id).slice(0, 3);
        } else {
            myFiles = allFiles.slice(0, 3);
        }

        // ৫. স্টেট আপডেট
        setStats({
            classesToday: myClasses.length,
            files: user.role === 'STUDENT' ? myFiles.length : allFiles.length
        });
        setTodaysClasses(myClasses);
        setRecentFiles(myFiles);

      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        setLoading(false);
      }
    };

    if(user) fetchData();
  }, [user]);

  if (loading) {
      return (
          <div className="flex h-[80vh] justify-center items-center">
              <Loader2 className="animate-spin text-novum-cyan" size={48} />
          </div>
      );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* === HEADER === */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-novum-cyan to-blue-500">{user?.name}</span>!
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                {user.role === 'STUDENT' 
                    ? "Your personalized learning hub. Here is your automated schedule for today." 
                    : "Overview of today's classes based on weekly student routines."}
            </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-novum-cyan/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none group-hover:bg-novum-cyan/10 transition duration-1000"></div>
      </div>

      {/* === STATS CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-novum-light p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                    <Calendar size={28} />
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                         {new Date().toLocaleDateString('en-US', { weekday: 'long' })}'s Classes
                    </p>
                    <h3 className="text-3xl font-bold text-white">{stats.classesToday}</h3>
                </div>
            </div>
        </div>

        <div className="bg-novum-light p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-all duration-300">
                    <FileText size={28} />
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                        {user.role === 'STUDENT' ? 'My Resources' : 'Total Uploads'}
                    </p>
                    <h3 className="text-3xl font-bold text-white">{stats.files}</h3>
                </div>
            </div>
        </div>

        <div className="bg-novum-light p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition duration-300 group hover:-translate-y-1 shadow-lg">
            <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition-all duration-300">
                    <ShieldCheck size={28} />
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Role</p>
                    <h3 className="text-3xl font-bold text-white">{user.role}</h3>
                </div>
            </div>
        </div>
      </div>

      {/* === CONTENT GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Auto Schedule */}
        <div className="bg-novum-light rounded-3xl border border-slate-800 p-6 md:p-8 flex flex-col h-full shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none"></div>
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-slate-800 pb-4 relative z-10">
                <Clock className="text-emerald-400" /> 
                Today's Routine ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})
            </h2>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar relative z-10">
                {todaysClasses.length > 0 ? (
                    todaysClasses.map((cls, idx) => (
                        <div key={idx} className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition flex justify-between items-center group">
                            <div>
                                <h4 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{cls.subject}</h4>
                                <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                    <User size={14} /> 
                                    {user.role === 'STUDENT' 
                                        ? `Teacher: ${cls.teacherName}` 
                                        : `Student: ${cls.studentName}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-slate-900 text-emerald-400 text-xs font-bold rounded-lg border border-slate-700 whitespace-nowrap uppercase">
                                    Today
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-slate-500 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center">
                        <Bell size={40} className="mb-4 opacity-30" />
                        <p className="text-sm">No classes scheduled for {new Date().toLocaleDateString('en-US', { weekday: 'long' })}.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Right: Files */}
        <div className="bg-novum-light rounded-3xl border border-slate-800 p-6 md:p-8 flex flex-col h-full shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[50px] pointer-events-none"></div>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-slate-800 pb-4 relative z-10">
                <BookOpen className="text-blue-400" /> 
                Recent Uploads
            </h2>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar relative z-10">
                {recentFiles.length > 0 ? (
                    recentFiles.map(file => (
                        <div key={file._id} className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800 transition flex items-center gap-4 group cursor-pointer">
                            <div className="p-3 bg-slate-900 group-hover:bg-blue-500 group-hover:text-white rounded-lg text-slate-400 transition-all duration-300">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{file.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {new Date(file.createdAt).toLocaleDateString()} • {file.student?.name}
                                </p>
                            </div>
                            {user.role === 'STUDENT' && (
                                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                    NEW
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 text-slate-500 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center">
                        <FileText size={40} className="mb-4 opacity-30" />
                        <p className="text-sm">No recent files found.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;