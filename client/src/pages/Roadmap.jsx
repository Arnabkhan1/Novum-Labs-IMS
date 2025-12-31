import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  CheckCircle, Clock, Edit3, User, ChevronRight, Send, ShieldCheck, 
  Target, Zap, Calendar, Plus, Trash2, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const { user } = useContext(AuthContext);
  
  // States
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(user.role === 'STUDENT' ? user : null);
  const [roadmapData, setRoadmapData] = useState([]);
  const [activeMonth, setActiveMonth] = useState(null); 
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState("");
  
  // Multi-Subject Selection for Logging
  const [selectedTopicForLog, setSelectedTopicForLog] = useState("");

  // Admin Editing State (Multi-Subject)
  const [isEditing, setIsEditing] = useState(false);
  const [editSubjects, setEditSubjects] = useState([]); // Array of subjects

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
      
      // Load current month or empty
      handleMonthClick(currentPlan || { month: currentMonthName, subjects: [] });
    } catch (e) { console.error(e); }
  };

  const handleStudentChange = (e) => {
    const student = students.find(s => s._id === e.target.value);
    setSelectedStudent(student);
    loadStudentData(student._id);
  };

  // --- 2. Handle Month & Logs ---
  const handleMonthClick = async (monthData) => {
    setActiveMonth(monthData);
    setIsEditing(false);
    
    // Default select first topic for logging
    if (monthData.subjects && monthData.subjects.length > 0) {
      setSelectedTopicForLog(monthData.subjects[0].name);
      fetchLogs(monthData.month); // Fetch logs for ALL topics in this month
    } else {
      setSelectedTopicForLog("");
      setLogs([]);
    }
  };

  const fetchLogs = async (month) => {
    try {
      // ১. মাসের সব লগ আনা
      const res = await api.get(`/class-log?month=${month}`);
      
      // ২. রোবাস্ট ফিল্টারিং (String Conversion)
      const studentLogs = res.data.filter(l => {
        // লগ যে স্টুডেন্টের, তার আইডি স্ট্রিংয়ে নেওয়া
        const logStudentId = l.student?._id 
            ? l.student._id.toString() 
            : (l.student ? l.student.toString() : "");
            
        // বর্তমানে সিলেক্ট করা স্টুডেন্টের আইডি
        const currentStudentId = selectedStudent?._id 
            ? selectedStudent._id.toString() 
            : "";

        return logStudentId === currentStudentId;
      });

      console.log("Filtered Logs:", studentLogs); // ডিবাগিংয়ের জন্য
      setLogs(studentLogs);

    } catch (e) { 
      console.error("Fetch Logs Error:", e); 
    }
  };

  // --- 3. Admin: Save Multi-Subject Plan ---
  const handleAddSubjectRow = () => {
    setEditSubjects([...editSubjects, { name: '', tech: '', examDate: '' }]);
  };

  const handleRemoveSubjectRow = (index) => {
    const list = [...editSubjects];
    list.splice(index, 1);
    setEditSubjects(list);
  };

  const handleSubjectChange = (index, field, value) => {
    const list = [...editSubjects];
    list[index][field] = value;
    setEditSubjects(list);
  };

  const handleSavePlan = async () => {
    try {
      // Filter out empty rows
      const validSubjects = editSubjects.filter(s => s.name.trim() !== "");
      
      await api.post('/roadmap/assign', {
        studentId: selectedStudent._id,
        month: activeMonth.month,
        subjects: validSubjects
      });
      toast.success("Plan updated for " + activeMonth.month);
      setIsEditing(false);
      loadStudentData(selectedStudent._id);
    } catch (e) { toast.error("Failed to save plan"); }
  };

  // --- 4. Student: Add Log ---
  const handleAddLog = async () => {
    if(!newLog.trim()) return;
    if(!selectedTopicForLog) return toast.error("Select a topic first!");

    try {
      await api.post('/class-log/add', {
        month: activeMonth.month,
        subject: selectedTopicForLog, // Tagged with specific topic
        topicCovered: newLog
      });
      toast.success("Log added!");
      setNewLog("");
      fetchLogs(activeMonth.month);
    } catch (e) { toast.error("Failed to add log"); }
  };

  // --- 5. Verify ---
  const handleVerify = async (logId) => {
    try {
      await api.put(`/class-log/verify/${logId}`);
      toast.success("Log Verified");
      setLogs(logs.map(l => l._id === logId ? { ...l, status: 'Verified' } : l));
    } catch (e) { toast.error("Failed verify"); }
  };

  const getStatus = (m) => {
    const plan = roadmapData.find(r => r.month === m);
    if (activeMonth?.month === m) return 'selected';
    if (plan && plan.subjects.length > 0) return 'ready';
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans animate-fade-in">
      
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Nexus Roadmap
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm">
            <User size={14} className="text-cyan-400"/>
            {selectedStudent ? `Orbit: ${selectedStudent.name}` : "System Idle: Select Student"}
          </p>
        </div>

        {user.role !== 'STUDENT' && (
          <div className="w-full md:w-72">
             <div className="relative">
                <select className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-cyan-500 transition shadow-lg" onChange={handleStudentChange} value={selectedStudent?._id || ""}>
                  <option value="" disabled>Select Student Orbit</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
             </div>
          </div>
        )}
      </div>

      {!selectedStudent ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-600 border-2 border-dashed border-slate-800 rounded-[2rem]">
           <Layers size={64} className="mb-4 opacity-50"/>
           <p className="text-lg">Select a student to initialize roadmap sequence.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]">
          
          {/* === LEFT: TIMELINE (Scrollable) === */}
          <div className="w-full lg:w-1/4 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {months.map((m, idx) => {
              const status = getStatus(m);
              const plan = roadmapData.find(r => r.month === m);
              const subjectCount = plan?.subjects?.length || 0;
              
              return (
                <div key={idx} onClick={() => handleMonthClick(plan || { month: m, subjects: [] })}
                  className={`group relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4
                    ${status === 'selected' ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-900/20 translate-x-1' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800'}
                  `}>
                  
                  {/* Status Indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all
                    ${status === 'selected' ? 'bg-cyan-500 text-black border-cyan-400' : 
                      subjectCount > 0 ? 'bg-slate-800 text-cyan-400 border-slate-700' : 'bg-slate-900 text-slate-600 border-slate-800'}
                  `}>
                    {subjectCount > 0 ? <Zap size={18} fill="currentColor"/> : <Clock size={18}/>}
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold ${status === 'selected' ? 'text-white' : 'text-slate-400'}`}>{m}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      {subjectCount > 0 ? `${subjectCount} Modules` : "Locked"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* === RIGHT: DASHBOARD === */}
          <div className="w-full lg:w-3/4 flex flex-col bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden relative shadow-2xl">
            {activeMonth ? (
              <>
                {/* 1. TOP BAR: TITLE & EDIT */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-10 flex justify-between items-start">
                   <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-1 block">Active Module</span>
                      <h2 className="text-4xl font-black text-white">{activeMonth.month}</h2>
                   </div>
                   
                   {user.role === 'ADMIN' && !isEditing && (
                     <button onClick={() => { 
                       setEditSubjects(activeMonth.subjects?.length ? activeMonth.subjects : [{ name: '', tech: '', examDate: '' }]); 
                       setIsEditing(true); 
                     }} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 transition">
                        <Edit3 size={16}/> <span className="text-xs font-bold">Manage Topics</span>
                     </button>
                   )}
                </div>

                {/* 2. MAIN CONTENT AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                   
                   {/* EDIT MODE (Admin) */}
                   {isEditing ? (
                      <div className="space-y-4 max-w-2xl mx-auto">
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-white">Plan Configuration</h3>
                            <button onClick={handleAddSubjectRow} className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300"><Plus size={14}/> Add Subject</button>
                         </div>
                         
                         {editSubjects.map((sub, idx) => (
                           <div key={idx} className="flex gap-2 items-start bg-slate-950 p-3 rounded-xl border border-slate-800">
                              <div className="flex-1 space-y-2">
                                <input placeholder="Subject Name (e.g. Backend)" className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={sub.name} onChange={e => handleSubjectChange(idx, 'name', e.target.value)} />
                                <div className="flex gap-2">
                                  <input placeholder="Tech Stack" className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs" value={sub.tech} onChange={e => handleSubjectChange(idx, 'tech', e.target.value)} />
                                  <input placeholder="Exam Date" className="w-32 bg-slate-900 border border-slate-700 p-2 rounded text-white text-xs" value={sub.examDate} onChange={e => handleSubjectChange(idx, 'examDate', e.target.value)} />
                                </div>
                              </div>
                              <button onClick={() => handleRemoveSubjectRow(idx)} className="p-2 text-slate-600 hover:text-red-400"><Trash2 size={16}/></button>
                           </div>
                         ))}

                         <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button onClick={() => setIsEditing(false)} className="text-sm text-slate-400 hover:text-white transition">Cancel</button>
                            <button onClick={handleSavePlan} className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-cyan-900/20 transition">Save Changes</button>
                         </div>
                      </div>
                   ) : (
                      <div className="space-y-8">
                         
                         {/* SUBJECT CARDS GRID */}
                         {activeMonth.subjects && activeMonth.subjects.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {activeMonth.subjects.map((sub, i) => (
                                 <div key={i} onClick={() => setSelectedTopicForLog(sub.name)} 
                                   className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group
                                     ${selectedTopicForLog === sub.name ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/10' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}
                                   `}>
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                                       <Target size={40}/>
                                    </div>
                                    <h3 className={`text-lg font-bold ${selectedTopicForLog === sub.name ? 'text-white' : 'text-slate-300'}`}>{sub.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{sub.tech}</p>
                                    
                                    {selectedTopicForLog === sub.name && (
                                       <div className="absolute bottom-3 right-3 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                                    )}
                                 </div>
                              ))}
                           </div>
                         ) : (
                           <div className="text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                              No modules assigned. {user.role === 'ADMIN' && "Click 'Manage Topics' to add."}
                           </div>
                         )}

                         {/* LOGS SECTION */}
                         <div>
                            <div className="flex items-center gap-2 mb-4">
                               <Layers size={16} className="text-cyan-400"/>
                               <h3 className="text-sm font-bold text-white uppercase tracking-wider">Progress Log</h3>
                            </div>

                            <div className="space-y-3">
                               {logs.length > 0 ? logs.map(log => (
                                  <div key={log._id} className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl flex gap-4 hover:border-slate-700 transition">
                                     <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                        <div className={`p-1.5 rounded-full ${log.status === 'Verified' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                           {log.status === 'Verified' ? <ShieldCheck size={14}/> : <Clock size={14}/>}
                                        </div>
                                     </div>
                                     <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                           <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{log.subject}</span>
                                           <span className="text-[10px] text-slate-500">{new Date(log.date).toDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{log.topicCovered}</p>
                                        
                                        {/* Admin Action */}
                                        {user.role === 'ADMIN' && log.status === 'Pending' && (
                                           <button onClick={() => handleVerify(log._id)} className="mt-2 text-[10px] font-bold text-green-400 hover:text-green-300 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded transition">
                                              <CheckCircle size={12}/> Verify Log
                                           </button>
                                        )}
                                     </div>
                                  </div>
                               )) : (
                                  <p className="text-slate-600 text-sm italic ml-2">No logs recorded for this month.</p>
                               )}
                            </div>
                         </div>
                      </div>
                   )}
                </div>

                {/* 3. INPUT BAR (Student Only) */}
                {user.role === 'STUDENT' && !isEditing && activeMonth.subjects?.length > 0 && (
                   <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                      {selectedTopicForLog ? (
                         <div className="relative">
                            <span className="absolute -top-3 left-4 text-[10px] font-bold bg-cyan-500 text-black px-2 rounded">Logging for: {selectedTopicForLog}</span>
                            <input 
                              value={newLog}
                              onChange={e => setNewLog(e.target.value)}
                              onKeyPress={e => e.key === 'Enter' && handleAddLog()}
                              placeholder="What did you achieve today?"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-4 pr-14 text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition shadow-inner"
                            />
                            <button onClick={handleAddLog} className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition flex items-center justify-center">
                               <Send size={20}/>
                            </button>
                         </div>
                      ) : (
                         <div className="text-center text-sm text-yellow-500/80 bg-yellow-500/5 p-2 rounded-lg border border-yellow-500/20">
                            👆 Select a topic card above to start logging.
                         </div>
                      )}
                   </div>
                )}

              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                 <Calendar size={64} strokeWidth={1}/>
                 <p className="text-lg">Select a month to engage.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;