import { useEffect, useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  PieChart, Calendar, CheckCircle, XCircle, Loader2, Filter, 
  ChevronDown, TrendingUp, Clock, Sparkles, Target, Activity, Users, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyAttendance = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('monthly'); 
  const [data, setData] = useState({ stats: { total: 0, present: 0, absent: 0, percentage: 0 }, history: [] });

  // Admin Specific State
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(user.role === 'STUDENT' ? user : null);

  // Dropdown State
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = [
    { value: 'weekly', label: '📅 This Week' },
    { value: 'monthly', label: '📆 This Month' },
    { value: '6months', label: '🗓️ Last 6 Months' },
    { value: 'yearly', label: '📅 This Year' },
    { value: 'all', label: '∞ All Time' }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Load Students if Admin
  useEffect(() => {
    if (user.role !== 'STUDENT') {
      api.get('/admin/students').then(res => setStudents(res.data)).catch(console.error);
    }
  }, [user]);

  // 2. Fetch Data when Student or Filter changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedStudent) return; // স্টুডেন্ট সিলেক্ট না করলে কল হবে না
      
      setLoading(true);
      try {
        // স্টুডেন্ট আইডি কুয়েরি প্যারামিটারে পাঠানো হচ্ছে (Admin এর জন্য)
        // যদি স্টুডেন্ট হয়, তাহলে backend অটোমেটিক req.user._id নেবে (backend লজিক চেক করতে হবে)
        // ভালো প্র্যাকটিস: Backend এ studentId প্যারামিটার সাপোর্ট করানো।
        
        // Backend আপডেট না করে থাকলে Admin এর জন্য কাজ করবে না। 
        // তাই URL টি একটু পরিবর্তন করছি যাতে ব্যাকএন্ডে studentId পাঠানো যায়।
        const url = user.role === 'STUDENT' 
            ? `/attendance/my-history?range=${filter}` 
            : `/attendance/student-history/${selectedStudent._id}?range=${filter}`; // নতুন রাউট লাগতে পারে

        // অথবা যদি একই রাউট ব্যবহার করেন, তাহলে ব্যাকএন্ড আপডেট করতে হবে।
        // আপাতত ধরে নিচ্ছি আপনি ব্যাকএন্ডে studentId রিসিভ করছেন বা করবেন।
        // সেফটির জন্য আমি সাধারণ রাউটই রাখছি, আপনি ব্যাকএন্ডে 'studentId' query param চেক করবেন।
        
        const res = await api.get(`/attendance/my-history?range=${filter}&studentId=${selectedStudent._id}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
        // Error handling for empty data
        setData({ stats: { total: 0, present: 0, absent: 0, percentage: 0 }, history: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [filter, selectedStudent, user]);

  const currentLabel = filterOptions.find(opt => opt.value === filter)?.label;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[] text-slate-200 p-6 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 5 }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 space-y-8">

        {/* === HEADER === */}
        <motion.div initial="hidden" animate="visible" variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-50">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
                        <Activity size={32} className="text-emerald-400" /> ATTENDANCE
                    </span> DASHBOARD
                </h1>
                <p className="text-slate-400 mt-2 font-medium">
                    {selectedStudent ? `Report for: ${selectedStudent.name}` : "Select a student to view report."}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                
                {/* 🔍 ADMIN: Student Selector */}
                {user.role !== 'STUDENT' && (
                    <div className="w-full md:w-64 relative">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block flex items-center gap-2 tracking-widest">
                            <Users size={12}/> Select Student
                        </label>
                        <div className="relative group">
                            <select 
                                onChange={(e) => {
                                    const std = students.find(s => s._id === e.target.value);
                                    setSelectedStudent(std);
                                }}
                                className="w-full bg-[#0b1121] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-cyan-500 transition shadow-lg appearance-none cursor-pointer"
                                value={selectedStudent?._id || ""}
                            >
                                <option value="" disabled>Select Student</option>
                                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={18}/>
                        </div>
                    </div>
                )}

                {/* 🕒 TIME FILTER (High Z-Index Fix) */}
                <div className="w-full md:w-64 relative" ref={dropdownRef}>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block flex items-center gap-2 tracking-widest">
                        <Filter size={12}/> Time Range
                    </label>
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full flex items-center justify-between bg-[#0b1121] border p-4 rounded-xl transition-all duration-300 text-left relative z-20
                        ${isOpen ? 'border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-white/10 text-slate-300 hover:border-white/20'}`}
                    >
                        <span className="font-bold text-sm">{currentLabel}</span>
                        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-500' : 'text-slate-500'}`}/>
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute top-[110%] left-0 right-0 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100]" // z-[100] added
                            >
                                {filterOptions.map((option) => (
                                    <div 
                                        key={option.value}
                                        onClick={() => {
                                            setFilter(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`p-3.5 cursor-pointer flex items-center justify-between border-b border-slate-800 last:border-0 transition-colors
                                            ${filter === option.value ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                        `}
                                    >
                                        <span className="text-sm font-medium">{option.label}</span>
                                        {filter === option.value && <Sparkles size={14}/>}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>

        {!selectedStudent ? (
             <div className="flex h-64 justify-center items-center bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                <div className="text-center text-slate-500">
                    <Search size={48} className="mx-auto mb-3 opacity-50"/>
                    <p>Select a student to view attendance report.</p>
                </div>
             </div>
        ) : loading ? (
             <div className="flex h-64 justify-center items-center bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
             </div>
        ) : (
            <>
                {/* === STATS GRID (Lower Z-Index) === */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-0"
                >
                    {/* Card 1 */}
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 hover:border-white/20 transition group backdrop-blur-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 group-hover:text-white transition"><TrendingUp size={24}/></div>
                        </div>
                        <h3 className="text-4xl font-black text-white">{data.stats.total}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase mt-2 tracking-wider">Total Classes</p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 hover:border-emerald-500/50 transition group backdrop-blur-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500"><CheckCircle size={24}/></div>
                        </div>
                        <h3 className="text-4xl font-black text-emerald-400">{data.stats.present}</h3>
                        <p className="text-xs text-emerald-600/80 font-bold uppercase mt-2 tracking-wider">Present</p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 hover:border-red-500/50 transition group backdrop-blur-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500"><XCircle size={24}/></div>
                        </div>
                        <h3 className="text-4xl font-black text-red-400">{data.stats.absent}</h3>
                        <p className="text-xs text-red-600/80 font-bold uppercase mt-2 tracking-wider">Absent</p>
                    </motion.div>

                    {/* Card 4 (Rate) */}
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 hover:border-cyan-500/50 transition group backdrop-blur-md relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500"><Target size={24}/></div>
                        </div>
                        <h3 className="text-4xl font-black text-cyan-400 relative z-10">{data.stats.percentage}%</h3>
                        <p className="text-xs text-cyan-600/80 font-bold uppercase mt-2 tracking-wider relative z-10">Attendance Rate</p>
                        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000" style={{ width: `${data.stats.percentage}%` }}></div>
                    </motion.div>
                </motion.div>

                {/* === HISTORY TIMELINE === */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0b1121] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative z-0"
                >
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Clock size={20} className="text-cyan-500"/> TIMELINE LOG
                        </h3>
                        <div className="text-[10px] font-mono text-slate-500">
                            SHOWING {data.history.length} RECORDS
                        </div>
                    </div>
                    
                    <div className="space-y-6 relative pl-4">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-white/5 rounded-full"></div>

                        {data.history.length > 0 ? (
                            data.history.map((record, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-6 relative group"
                                >
                                    {/* Timeline Dot */}
                                    <div className={`w-4 h-4 rounded-full border-[3px] z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-300
                                        ${record.studentStatus === 'Present' || record.status === 'Present' 
                                            ? 'bg-emerald-500 border-[#0b1121] group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                            : 'bg-red-500 border-[#0b1121] group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]'}
                                    `}></div>

                                    {/* Content Card */}
                                    <div className="flex-1 bg-white/5 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{record.subject}</h4>
                                            <p className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-2">
                                               <Calendar size={12} className="text-cyan-500"/> 
                                               {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            {record.studentStatus === 'Present' || record.status === 'Present' ? (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 shadow-sm">
                                                    PRESENT <CheckCircle size={14}/>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 shadow-sm">
                                                    ABSENT <XCircle size={14}/>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-50 pl-0">
                                <Calendar size={64} className="mx-auto mb-4 text-slate-700"/>
                                <p className="text-slate-500 font-mono">NO_DATA_FOUND</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;