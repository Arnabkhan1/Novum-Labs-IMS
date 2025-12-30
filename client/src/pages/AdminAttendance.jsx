import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Save, Check, X, User, Briefcase, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAttendance = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savingId, setSavingId] = useState(null); // কোন রো-টা সেভ হচ্ছে তা ট্র্যাক করার জন্য

  // ১. ক্লাস লিস্ট লোড করা
  const fetchDailyClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/daily-list?date=${selectedDate}`);
      setClasses(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load class list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyClasses();
  }, [selectedDate]); // তারিখ পাল্টালে আবার লোড হবে

  // ২. লোকাল স্টেটে স্ট্যাটাস চেঞ্জ করা (Teacher/Student)
  const handleStatusChange = (index, type, status) => {
    const updatedClasses = [...classes];
    if (type === 'teacher') {
      updatedClasses[index].teacherStatus = status;
    } else {
      updatedClasses[index].studentStatus = status;
    }
    // এডিট করলে 'isMarked' সাময়িকভাবে ফলস করি যাতে সেভ বাটন হাইলাইট হয়
    updatedClasses[index].isDirty = true; 
    setClasses(updatedClasses);
  };

  // ৩. ডাটাবেসে সেভ করা
  const handleSave = async (cls, index) => {
    setSavingId(index);
    try {
      await api.post('/attendance/mark-class', {
        date: selectedDate,
        studentId: cls.studentId,
        teacherId: cls.teacherId,
        subject: cls.subject,
        teacherStatus: cls.teacherStatus,
        studentStatus: cls.studentStatus
      });

      // সাকসেস হলে লোকাল স্টেট আপডেট
      const updatedClasses = [...classes];
      updatedClasses[index].isMarked = true;
      updatedClasses[index].isDirty = false;
      setClasses(updatedClasses);

      toast.success("Attendance Saved! ✅");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="flex h-[80vh] justify-center items-center"><Loader2 className="animate-spin text-novum-cyan" size={48} /></div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* === Header === */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-2xl flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" /> Class Attendance Manager
          </h1>
          <p className="text-slate-400 text-sm">
             Tracking <span className="text-white font-bold">{classes.length}</span> scheduled classes for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}.
          </p>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-auto">
           <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar size={12}/> Select Date</label>
           <input 
             type="date" 
             value={selectedDate} 
             onChange={(e) => setSelectedDate(e.target.value)}
             className="bg-slate-950 border border-slate-600 text-white text-sm rounded-xl p-3 focus:border-novum-cyan outline-none shadow-inner"
           />
        </div>
      </div>

      {/* === Attendance Table / Grid === */}
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {classes.map((cls, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border transition-all duration-300 ${cls.isMarked && !cls.isDirty ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-800/60 border-slate-600 shadow-lg'}`}>
              
              <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
                
                {/* 1. Subject Info */}
                <div className="w-full lg:w-1/4">
                  <h3 className="text-lg font-bold text-white">{cls.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {cls.isMarked && !cls.isDirty ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={10}/> Saved
                        </span>
                    ) : (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 flex items-center gap-1">
                            <AlertCircle size={10}/> Pending
                        </span>
                    )}
                  </div>
                </div>

                {/* 2. Teacher Control */}
                <div className="w-full lg:w-1/3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-purple-400"><Briefcase size={18}/></div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-500 uppercase font-bold">Teacher</p>
                            <p className="text-sm font-bold text-white truncate">{cls.teacherName}</p>
                        </div>
                    </div>
                    
                    {/* Teacher Toggle */}
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button 
                            onClick={() => handleStatusChange(idx, 'teacher', 'Present')}
                            className={`p-1.5 rounded-md transition ${cls.teacherStatus === 'Present' ? 'bg-emerald-500 text-black shadow' : 'text-slate-600 hover:text-slate-400'}`}
                            title="Present"
                        >
                            <Check size={16} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={() => handleStatusChange(idx, 'teacher', 'Absent')}
                            className={`p-1.5 rounded-md transition ${cls.teacherStatus === 'Absent' ? 'bg-red-500 text-white shadow' : 'text-slate-600 hover:text-slate-400'}`}
                            title="Absent"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* 3. Student Control */}
                <div className="w-full lg:w-1/3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-blue-400"><User size={18}/></div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-500 uppercase font-bold">Student</p>
                            <p className="text-sm font-bold text-white truncate">{cls.studentName}</p>
                        </div>
                    </div>

                    {/* Student Toggle */}
                    <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                        <button 
                            onClick={() => handleStatusChange(idx, 'student', 'Present')}
                            className={`p-1.5 rounded-md transition ${cls.studentStatus === 'Present' ? 'bg-emerald-500 text-black shadow' : 'text-slate-600 hover:text-slate-400'}`}
                            title="Present"
                        >
                            <Check size={16} strokeWidth={3} />
                        </button>
                        <button 
                            onClick={() => handleStatusChange(idx, 'student', 'Absent')}
                            className={`p-1.5 rounded-md transition ${cls.studentStatus === 'Absent' ? 'bg-red-500 text-white shadow' : 'text-slate-600 hover:text-slate-400'}`}
                            title="Absent"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* 4. Save Button */}
                <div>
                    <button 
                        onClick={() => handleSave(cls, idx)}
                        disabled={savingId === idx}
                        className={`p-3 rounded-xl transition shadow-lg ${
                            cls.isDirty || !cls.isMarked 
                            ? 'bg-novum-cyan text-black hover:bg-cyan-400 shadow-cyan-500/20' 
                            : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                        }`}
                        title="Save Record"
                    >
                        {savingId === idx ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                    </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-800">
             <Calendar size={48} className="mx-auto text-slate-700 mb-4" />
             <h3 className="text-xl font-bold text-slate-400">No classes found for this date.</h3>
             <p className="text-slate-600 text-sm mt-1">Try selecting a different date from the picker.</p>
        </div>
      )}

    </div>
  );
};

export default AdminAttendance;