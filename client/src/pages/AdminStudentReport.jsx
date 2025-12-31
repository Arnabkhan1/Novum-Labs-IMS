import { useEffect, useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  PieChart, Calendar, CheckCircle, XCircle, Loader2, Filter, 
  ChevronDown, TrendingUp, Clock, Sparkles, Target, Activity, Users, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminStudentReport = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('monthly'); 
  
  // Admin Selection States
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  
  const [data, setData] = useState({ stats: { total: 0, present: 0, absent: 0, percentage: 0 }, history: [] });

  // Dropdown UI States
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const timeDropdownRef = useRef(null);

  const filterOptions = [
    { value: 'weekly', label: '📅 This Week' },
    { value: 'monthly', label: '📆 This Month' },
    { value: '6months', label: '🗓️ Last 6 Months' },
    { value: 'yearly', label: '📅 This Year' },
    { value: 'all', label: '∞ All Time' }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setIsTimeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Load Students List
  useEffect(() => {
    const loadStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
        } catch (e) { console.error(e); }
    };
    loadStudents();
  }, []);

  // 2. Fetch Report when Student or Filter changes
  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Backend now handles studentId param for admins
        const res = await api.get(`/attendance/my-history?studentId=${selectedStudentId}&range=${filter}`);
        setData(res.data);
      } catch (error) {
        console.error(error);
        setData({ stats: { total: 0, present: 0, absent: 0, percentage: 0 }, history: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [filter, selectedStudentId]);

  const currentLabel = filterOptions.find(opt => opt.value === filter)?.label;

  // Animations
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="min-h-screen bg-[] text-slate-200 p-6 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 space-y-8">

        {/* === HEADER & CONTROLS === */}
        <motion.div initial="hidden" animate="visible" variants={itemVariants} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center gap-2">
                            <Users size={32} className="text-blue-400" /> STUDENT
                        </span> REPORT
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Select a student to view detailed analytics.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    
                    {/* 1. Student Selector */}
                    <div className="w-full md:w-64">
                         <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Select Student</label>
                         <div className="relative group">
                             <select 
                                 className="w-full bg-[#0b1121] border border-white/10 text-white p-4 rounded-xl outline-none focus:border-cyan-500 transition shadow-lg appearance-none cursor-pointer"
                                 onChange={(e) => setSelectedStudentId(e.target.value)}
                                 value={selectedStudentId}
                             >
                                 <option value="" disabled>Choose a student...</option>
                                 {students.map(s => (
                                     <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                                 ))}
                             </select>
                             <ChevronDown className="absolute right-4 top-[18px] text-slate-500 pointer-events-none" size={18}/>
                         </div>
                    </div>

                    {/* 2. Time Range Filter */}
                    <div className="w-full md:w-56 relative" ref={timeDropdownRef}>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Time Range</label>
                        <button 
                            onClick={() => setIsTimeOpen(!isTimeOpen)}
                            className={`w-full flex items-center justify-between bg-[#0b1121] border p-4 rounded-xl transition-all duration-300 text-left
                            ${isTimeOpen ? 'border-cyan-500 text-white' : 'border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <span className="font-bold text-sm">{currentLabel}</span>
                            <ChevronDown size={18} className={`transition-transform ${isTimeOpen ? 'rotate-180 text-cyan-500' : 'text-slate-500'}`}/>
                        </button>

                        <AnimatePresence>
                            {isTimeOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-[110%] left-0 right-0 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100]"
                                >
                                    {filterOptions.map((option) => (
                                        <div key={option.value} onClick={() => { setFilter(option.value); setIsTimeOpen(false); }}
                                            className={`p-3.5 cursor-pointer flex items-center justify-between border-b border-slate-800 last:border-0 hover:bg-slate-800 ${filter === option.value ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'}`}
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
            </div>
        </motion.div>

        {/* === CONTENT AREA === */}
        {!selectedStudentId ? (
             <div className="flex h-64 justify-center items-center bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm border-dashed">
                <div className="text-center text-slate-500">
                    <Search size={64} className="mx-auto mb-4 opacity-30"/>
                    <p className="text-lg">Please select a student from the dropdown above.</p>
                </div>
             </div>
        ) : loading ? (
             <div className="flex h-64 justify-center items-center bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
             </div>
        ) : (
            <>
                {/* Stats Cards */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <motion.div variants={itemVariants} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                        <div className="p-3 w-fit rounded-2xl bg-slate-800 text-white mb-4"><TrendingUp size={24}/></div>
                        <h3 className="text-4xl font-black text-white">{data.stats.total}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase mt-2">Total Scheduled</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md border-emerald-500/20">
                        <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4"><CheckCircle size={24}/></div>
                        <h3 className="text-4xl font-black text-emerald-400">{data.stats.present}</h3>
                        <p className="text-xs text-emerald-600/80 font-bold uppercase mt-2">Present</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md border-red-500/20">
                        <div className="p-3 w-fit rounded-2xl bg-red-500/10 text-red-500 mb-4"><XCircle size={24}/></div>
                        <h3 className="text-4xl font-black text-red-400">{data.stats.absent}</h3>
                        <p className="text-xs text-red-600/80 font-bold uppercase mt-2">Absent</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md border-cyan-500/20 relative overflow-hidden">
                        <div className="p-3 w-fit rounded-2xl bg-cyan-500/10 text-cyan-500 mb-4 relative z-10"><Target size={24}/></div>
                        <h3 className="text-4xl font-black text-cyan-400 relative z-10">{data.stats.percentage}%</h3>
                        <p className="text-xs text-cyan-600/80 font-bold uppercase mt-2 relative z-10">Attendance Rate</p>
                        <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-1000" style={{ width: `${data.stats.percentage}%` }}></div>
                    </motion.div>
                </motion.div>

                {/* Timeline History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0b1121] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3"><Clock size={20} className="text-cyan-500"/> REPORT HISTORY</h3>
                        <span className="text-xs font-mono text-slate-500">FOUND {data.history.length} RECORDS</span>
                    </div>
                    
                    <div className="space-y-4 relative pl-4">
                        <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-white/5 rounded-full"></div>
                        {data.history.length > 0 ? (
                            data.history.map((record, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-6 relative group">
                                    <div className={`w-4 h-4 rounded-full border-[3px] z-10 shadow-lg ${record.studentStatus === 'Present' ? 'bg-emerald-500 border-[#0b1121]' : 'bg-red-500 border-[#0b1121]'}`}></div>
                                    <div className="flex-1 bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:bg-white/10">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-200">{record.subject}</h4>
                                            <p className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-2"><Calendar size={12}/> {new Date(record.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 text-xs font-bold rounded-lg border ${record.studentStatus === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {record.studentStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-50"><p className="text-slate-500 font-mono">NO RECORDS FOUND</p></div>
                        )}
                    </div>
                </motion.div>
            </>
        )}
      </div>
    </div>
  );
};

export default AdminStudentReport;