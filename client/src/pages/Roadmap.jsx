import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  CheckCircle, Clock, Edit3, ChevronRight, Send, ShieldCheck,
  Target, Zap, Plus, Trash2, Layers, Lock, Activity, BookOpen, Sparkles, MapPin, Flag
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion'; // Motion Import

const Roadmap = () => {
  const { user } = useContext(AuthContext);

  // Data States
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(user.role === 'STUDENT' ? user : null);
  const [roadmapData, setRoadmapData] = useState([]);
  const [activeMonth, setActiveMonth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState("");
  const [selectedTopicForLog, setSelectedTopicForLog] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editSubjects, setEditSubjects] = useState([]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // --- Animation Variants ---
  const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };

  // --- 1. Load Data ---
  useEffect(() => {
    if (user.role !== 'STUDENT') {
      api.get('/admin/students').then(res => setStudents(res.data)).catch(console.error);
    } else {
      loadStudentData(user._id);
    }
  }, [user]);

  const loadStudentData = async (studentId) => {
    try {
      const res = await api.get(`/roadmap?studentId=${studentId}`);
      setRoadmapData(res.data);
      const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
      const currentPlan = res.data.find(r => r.month === currentMonthName);
      handleMonthClick(currentPlan || { month: currentMonthName, subjects: [] }, true);
    } catch (e) { console.error(e); }
  };

  const handleStudentChange = (e) => {
    const student = students.find(s => s._id === e.target.value);
    setSelectedStudent(student);
    loadStudentData(student._id);
  };

  // --- 2. Logic ---
  const handleMonthClick = async (monthData, force = false) => {
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

    if (!force && user.role === 'STUDENT' && monthData.month !== currentMonthName) {
      return toast.error(`Future Locked: Focus on ${currentMonthName} first.`);
    }

    // Smooth transition reset
    setActiveMonth(null);
    setTimeout(() => {
        setActiveMonth(monthData);
        setIsEditing(false);
        if (monthData.subjects && monthData.subjects.length > 0) {
          setSelectedTopicForLog(monthData.subjects[0].name);
          fetchLogs(monthData.month);
        } else {
          setSelectedTopicForLog("");
          setLogs([]);
        }
    }, 100);
  };

  const fetchLogs = async (month) => {
    try {
      const res = await api.get(`/class-log?month=${month}`);
      const studentLogs = res.data.filter(l => {
        const logStudentId = l.student?._id ? l.student._id.toString() : (l.student ? l.student.toString() : "");
        const currentStudentId = selectedStudent?._id ? selectedStudent._id.toString() : "";
        return logStudentId === currentStudentId;
      });
      setLogs(studentLogs);
    } catch (e) { console.error(e); }
  };

  // --- 3. Actions ---
  const handleSavePlan = async () => {
    try {
      const validSubjects = editSubjects.filter(s => s.name.trim() !== "");
      await api.post('/roadmap/assign', {
        studentId: selectedStudent._id,
        month: activeMonth.month,
        subjects: validSubjects
      });
      toast.success("Mission Updated!");
      setIsEditing(false);
      loadStudentData(selectedStudent._id);
    } catch (e) { toast.error("Failed to save plan"); }
  };

  const handleAddLog = async () => {
    if (!newLog.trim()) return;
    if (!selectedTopicForLog) return toast.error("Select a milestone first!");
    try {
      await api.post('/class-log/add', {
        month: activeMonth.month,
        subject: selectedTopicForLog,
        topicCovered: newLog
      });
      toast.success("Progress Recorded!");
      setNewLog("");
      fetchLogs(activeMonth.month);
    } catch (e) { toast.error("Failed to add log"); }
  };

  const handleVerify = async (logId) => {
    try {
      await api.put(`/class-log/verify/${logId}`);
      toast.success("Verified");
      setLogs(logs.map(l => l._id === logId ? { ...l, status: 'Verified' } : l));
    } catch (e) { toast.error("Failed verify"); }
  };

  const getStatus = (m) => {
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    if (user.role === 'STUDENT' && m !== currentMonthName) return 'locked';
    const plan = roadmapData.find(r => r.month === m);
    if (activeMonth?.month === m) return 'selected';
    if (plan && plan.subjects.length > 0) return 'ready';
    return 'empty';
  };

  return (
    <div className="min-h-screen bg-[] text-slate-200 p-6 font-sans relative overflow-hidden">
      
      {/* --- CUSTOM SCROLLBAR CSS --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}</style>

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* === HEADER === */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center gap-2">
                <Sparkles size={24} className="text-cyan-400" /> NEXUS
              </span> Roadmap
            </h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm font-medium">
              <Activity size={16} className="text-cyan-400" />
              {selectedStudent ? `Orbit Active: ${selectedStudent.name}` : "System Standby: Select Student"}
            </p>
          </div>

          {user.role !== 'STUDENT' && (
            <div className="w-full md:w-72">
               <div className="relative group">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                 <select className="relative w-full bg-[#0b1121] border border-white/10 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition shadow-xl appearance-none cursor-pointer" onChange={handleStudentChange} value={selectedStudent?._id || ""}>
                    <option value="" disabled>Initialize Student View</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <ChevronRight className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" size={20}/>
               </div>
            </div>
          )}
        </motion.div>

        {!selectedStudent ? (
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col items-center justify-center py-32 text-slate-500 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/5 backdrop-blur-sm">
             <Layers size={64} className="mb-4 opacity-50 animate-bounce" />
             <p className="text-lg font-medium">Select a student profile to load mission data.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]">

            {/* === LEFT: TIMELINE (Connected) === */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full lg:w-[25%] bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-2 overflow-hidden flex flex-col shadow-xl">
              <div className="overflow-y-auto custom-scrollbar p-3 space-y-1 flex-1 relative">
                {/* Connecting Line */}
                <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-white/5 rounded-full z-0"></div>

                {months.map((m, idx) => {
                  const status = getStatus(m);
                  const plan = roadmapData.find(r => r.month === m);
                  const subjectCount = plan?.subjects?.length || 0;
                  const isLocked = status === 'locked';
                  const isSelected = status === 'selected';

                  return (
                    <motion.div key={idx} variants={fadeIn}
                      onClick={() => handleMonthClick(plan || { month: m, subjects: [] })}
                      className={`relative z-10 p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group
                        ${isSelected ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 
                          isLocked ? 'opacity-40 cursor-not-allowed border-transparent' : 
                          'border-transparent hover:bg-white/5'}
                      `}>
                      
                      {/* Status Dot */}
                      <div className={`w-3 h-3 rounded-full border-[2px] shadow-lg transition-all
                        ${isSelected ? 'bg-cyan-400 border-cyan-200 scale-125 shadow-cyan-500/50' : 
                          isLocked ? 'bg-slate-800 border-slate-700' :
                          subjectCount > 0 ? 'bg-slate-900 border-cyan-500' : 'bg-slate-900 border-slate-600'}
                      `}></div>

                      <div className="flex-1">
                        <h3 className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{m}</h3>
                        <p className="text-[10px] uppercase tracking-wider font-bold opacity-60">
                           {isLocked ? "Locked" : subjectCount > 0 ? `${subjectCount} Missions` : "Pending"}
                        </p>
                      </div>

                      {isSelected && <ChevronRight size={16} className="text-cyan-400" />}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* === RIGHT: DASHBOARD (Glass Panel) === */}
            <div className="w-full lg:w-[75%] flex flex-col bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
              <AnimatePresence mode='wait'>
              {activeMonth ? (
                <motion.div 
                  key={activeMonth.month}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  
                  {/* Top Bar */}
                  <div className="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-900 to-transparent">
                     <div>
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-2 block flex items-center gap-2"><Target size={14}/> Active Sector</span>
                        <h2 className="text-4xl font-black text-white">{activeMonth.month}</h2>
                     </div>

                     {user.role === 'ADMIN' && !isEditing && (
                       <button onClick={() => { 
                         setEditSubjects(activeMonth.subjects?.length ? activeMonth.subjects : [{ name: '', tech: '', examDate: '' }]); 
                         setIsEditing(true); 
                       }} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 px-4 py-2 rounded-xl border border-white/10 transition text-xs font-bold uppercase tracking-wide">
                          <Edit3 size={14}/> Edit Mission
                       </button>
                     )}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-black/20">

                     {/* Edit Form */}
                     {isEditing ? (
                        <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/10 max-w-2xl mx-auto shadow-2xl">
                           <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-white">Configure Missions</h3><button onClick={() => setEditSubjects([...editSubjects, { name: '', tech: '', examDate: '' }])} className="text-xs flex items-center gap-1 text-cyan-400 hover:bg-cyan-900/20 px-3 py-1.5 rounded-lg border border-cyan-900/50"><Plus size={14}/> Add Subject</button></div>
                           {editSubjects.map((sub, idx) => (
                             <div key={idx} className="flex gap-2 items-start mb-3 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                <div className="flex-1 space-y-2"><input placeholder="Subject" className="w-full bg-transparent border border-white/10 p-2 rounded-lg text-white text-sm focus:border-cyan-500 outline-none" value={sub.name} onChange={e => {const l=[...editSubjects]; l[idx].name=e.target.value; setEditSubjects(l)}} /><div className="flex gap-2"><input placeholder="Tech" className="flex-1 bg-transparent border border-white/10 p-2 rounded-lg text-white text-xs" value={sub.tech} onChange={e => {const l=[...editSubjects]; l[idx].tech=e.target.value; setEditSubjects(l)}} /><input placeholder="Exam" className="w-1/3 bg-transparent border border-white/10 p-2 rounded-lg text-white text-xs" value={sub.examDate} onChange={e => {const l=[...editSubjects]; l[idx].examDate=e.target.value; setEditSubjects(l)}} /></div></div>
                                <button onClick={() => {const l=[...editSubjects]; l.splice(idx,1); setEditSubjects(l)}} className="p-2 text-slate-500 hover:text-red-400"><Trash2 size={16}/></button>
                             </div>
                           ))}
                           <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-white/10">
                              <button onClick={() => setIsEditing(false)} className="text-sm text-slate-400 hover:text-white px-4 py-2">Cancel</button>
                              <button onClick={handleSavePlan} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20">Save Changes</button>
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-8">

                           {/* Subject Cards (Modern Glass) */}
                           {activeMonth.subjects && activeMonth.subjects.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeMonth.subjects.map((sub, i) => (
                                   <motion.div key={i} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}
                                     onClick={() => setSelectedTopicForLog(sub.name)} 
                                     className={`p-5 rounded-[1.5rem] border transition-all cursor-pointer group relative overflow-hidden backdrop-blur-md
                                       ${selectedTopicForLog === sub.name 
                                          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border-cyan-400/50 shadow-[0_10px_30px_rgba(6,182,212,0.1)]' 
                                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
                                     `}>
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2.5 rounded-xl shadow-lg ${selectedTopicForLog === sub.name ? 'bg-cyan-400 text-black' : 'bg-[#020617] text-cyan-400 border border-white/10'}`}>
                                          <BookOpen size={20}/>
                                        </div>
                                      </div>
                                      <h3 className={`text-lg font-bold ${selectedTopicForLog === sub.name ? 'text-white' : 'text-slate-200'}`}>{sub.name}</h3>
                                      <p className="text-xs text-slate-400 font-mono mt-1 opacity-80">{sub.tech}</p>
                                      
                                      {selectedTopicForLog === sub.name && (
                                         <motion.div layoutId="glowBar" className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                                      )}
                                   </motion.div>
                                ))}
                             </div>
                           ) : (
                             <div className="text-center py-16 text-slate-500 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5">
                                <Layers size={48} className="mb-4 opacity-30 mx-auto"/>
                                <p className="text-base font-medium">No plans initialized for this sector.</p>
                             </div>
                           )}

                           {/* Logs Section (Renamed to Learning Timeline) */}
                           <div className="bg-[#0b1121] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative">
                              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#020617]">
                                 <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-cyan-500"/>
                                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Learning Timeline</h3>
                                 </div>
                                 <div className="text-[10px] text-slate-500 font-mono">TRACKING PROGRESS...</div>
                              </div>
                              
                              <div className="p-6 space-y-6 max-h-[350px] overflow-y-auto custom-scrollbar bg-black/20 relative">
                                 {logs.length > 0 ? logs.map((log, index) => (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} delay={index * 0.1} key={log._id} className="flex gap-4 group">
                                       {/* Timeline Line */}
                                       <div className="flex flex-col items-center relative">
                                          <div className={`w-3 h-3 rounded-full border-2 z-10 ${log.status === 'Verified' ? 'bg-green-500 border-green-900 shadow-[0_0_10px_lime]' : 'bg-yellow-500 border-yellow-900'}`}></div>
                                          <div className="w-0.5 h-full bg-white/5 absolute top-3 bottom-[-24px] group-last:hidden"></div>
                                       </div>

                                       <div className="flex-1 bg-white/5 border border-white/10 p-4 rounded-r-2xl rounded-bl-2xl hover:border-white/20 transition backdrop-blur-sm">
                                          <div className="flex justify-between items-start mb-2">
                                             <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold bg-cyan-900/30 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">{log.subject}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{new Date(log.date).toLocaleDateString()}</span>
                                             </div>
                                             {log.status === 'Verified' 
                                                ? <span className="text-[10px] text-green-400 font-bold flex items-center gap-1"><ShieldCheck size={12}/> Verified</span>
                                                : <span className="text-[10px] text-yellow-500 flex items-center gap-1"><Clock size={12}/> Pending</span>
                                             }
                                          </div>
                                          <p className="text-sm text-slate-200 leading-relaxed">{log.topicCovered}</p>
                                          
                                          {user.role === 'ADMIN' && log.status === 'Pending' && (
                                             <button onClick={() => handleVerify(log._id)} className="mt-3 w-full bg-green-900/20 hover:bg-green-900/30 text-green-400 text-xs font-bold py-2 rounded-lg transition border border-green-900/50">
                                                Approve Milestone
                                             </button>
                                          )}
                                       </div>
                                    </motion.div>
                                 )) : (
                                    <div className="flex flex-col items-center justify-center py-8 opacity-50">
                                       <Flag size={32} className="text-slate-600 mb-2"/>
                                       <p className="text-slate-500 text-sm">No milestones recorded yet.</p>
                                    </div>
                                 )}
                              </div>

                              {/* Student Input */}
                              {user.role === 'STUDENT' && !isEditing && activeMonth.subjects?.length > 0 && (
                                 <div className="p-5 border-t border-white/10 bg-[#0f172a] relative z-20">
                                    {selectedTopicForLog ? (
                                       <div className="relative group">
                                          <span className="absolute -top-3 left-4 text-[10px] font-bold bg-slate-700 text-white px-3 py-0.5 rounded-full border border-slate-600 z-10">
                                             Adding to: {selectedTopicForLog}
                                          </span>
                                          <input 
                                            value={newLog}
                                            onChange={e => setNewLog(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && handleAddLog()}
                                            placeholder="What did you achieve today?"
                                            className="w-full bg-[#020617] border border-slate-700 rounded-2xl py-4 pl-6 pr-16 text-white font-medium text-sm focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)] outline-none transition"
                                          />
                                          <button onClick={handleAddLog} className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition flex items-center justify-center shadow-lg">
                                             <Send size={20}/>
                                          </button>
                                       </div>
                                    ) : (
                                       <div className="text-center text-xs text-slate-500 py-2 flex items-center justify-center gap-2">
                                          <Zap size={14} className="animate-pulse"/> Select a milestone above to log progress.
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-6 opacity-50">
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl">
                      <Lock size={64} strokeWidth={1.5} className="text-slate-500"/>
                   </div>
                   <p className="text-lg font-light tracking-widest uppercase">Select a Month</p>
                </div>
              )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;