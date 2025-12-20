import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Calendar, Clock, BookOpen, Save, Loader2, RefreshCw, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Schedule = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // ফর্ম ডাটা
  const [formData, setFormData] = useState({
    studentId: '',
    teacherId: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    note: ''
  });

  const fetchData = async () => {
    try {
      if (user.role === 'ADMIN') {
        const [resStudents, resTeachers, resSchedules] = await Promise.all([
          api.get('/admin/students'),
          api.get('/schedule/teachers'),
          api.get('/schedule/all')
        ]);
        
        setStudents(resStudents.data);
        setTeachers(resTeachers.data);
        setSchedules(resSchedules.data);
      } else {
        const resSchedules = await api.get('/schedule/all');
        setSchedules(resSchedules.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    if(user) fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/schedule/create', formData);
      toast.success("Class Scheduled Successfully! 📅");
      fetchData();
      setFormData({ studentId: '', teacherId: '', subject: '', date: '', startTime: '', endTime: '', note: '' });
    } catch (error) {
      toast.error("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  const displayedSchedules = schedules.filter(s => {
    if (user.role === 'STUDENT') return s.student?._id === user._id;
    if (user.role === 'TEACHER') return s.teacher?._id === user._id;
    return true; 
  });

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8">
      
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <Calendar className="text-novum-cyan" /> 
             {user.role === 'STUDENT' ? 'My Class Routine' : (user.role === 'TEACHER' ? 'My Class Schedule' : 'Class Scheduling')}
           </h1>
           <p className="text-novum-muted text-sm mt-1">
             {user.role === 'ADMIN' 
                ? 'Assign classes to students with teachers.' 
                : 'Check your upcoming classes and timings.'}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === বাম পাশ: শিডিউল ফর্ম (শুধুমাত্র ADMIN দেখবে) === */}
        {user.role === 'ADMIN' && (
          <div className="lg:col-span-1">
            <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Set New Class</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-novum-muted uppercase group-focus-within:text-novum-cyan transition-colors">Select Student</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition"><User size={18}/></div>
                    <select name="studentId" value={formData.studentId} onChange={handleChange} required 
                      className="w-full pl-10 p-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white focus:border-novum-cyan outline-none transition appearance-none cursor-pointer">
                      <option value="">-- Choose Student --</option>
                      {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.class})</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-novum-muted uppercase group-focus-within:text-novum-cyan transition-colors">Select Teacher</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition"><Briefcase size={18}/></div>
                    <select name="teacherId" value={formData.teacherId} onChange={handleChange} required 
                      className="w-full pl-10 p-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white focus:border-novum-cyan outline-none transition appearance-none cursor-pointer">
                      <option value="">-- Choose Teacher --</option>
                      {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                <InputGroup label="Subject" name="subject" icon={BookOpen} placeholder="e.g. Physics" value={formData.subject} onChange={handleChange} />
                <InputGroup label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="Start Time" name="startTime" type="time" value={formData.startTime} onChange={handleChange} />
                   <InputGroup label="End Time" name="endTime" type="time" value={formData.endTime} onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-novum-cyan hover:bg-novum-hover text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 mt-4 shadow-lg hover:shadow-cyan-500/20">
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  {loading ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* === ডান পাশ: শিডিউল লিস্ট === */}
        <div className={user.role === 'ADMIN' ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-novum-light rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                    {user.role === 'ADMIN' ? 'All Scheduled Classes' : 'My Upcoming Classes'}
                </h2>
                <button onClick={fetchData} className="p-2 bg-slate-800 rounded-lg text-novum-cyan hover:bg-slate-700 transition"><RefreshCw size={18}/></button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-slate-900/50 text-xs font-bold text-novum-muted uppercase">
                        <tr>
                            <th className="p-5">Date & Time</th>
                            <th className="p-5">Class Details</th>
                            <th className="p-5">With</th>
                            <th className="p-5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {displayedSchedules.length > 0 ? (
                            displayedSchedules.map((schedule) => (
                                <tr key={schedule._id} className="hover:bg-slate-800/30 transition group">
                                    <td className="p-5">
                                        <div className="font-bold text-white text-lg">{new Date(schedule.date).toLocaleDateString()}</div>
                                        <div className="text-novum-cyan text-sm flex items-center gap-1 mt-1 font-mono">
                                            <Clock size={12} /> {schedule.startTime} - {schedule.endTime}
                                        </div>
                                    </td>
                                    
                                    <td className="p-5">
                                        <p className="font-bold text-white text-base group-hover:text-novum-cyan transition-colors">{schedule.subject}</p>
                                        
                                        {user.role === 'TEACHER' && (
                                            <p className="text-xs text-slate-500 mt-1">Student: <span className="text-slate-300 font-bold">{schedule.student?.name}</span></p>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <p className="text-xs text-slate-500 mt-1">Student: {schedule.student?.name}</p>
                                        )}
                                    </td>

                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                                                {user.role === 'TEACHER' 
                                                    ? schedule.student?.name?.charAt(0) 
                                                    : schedule.teacher?.name?.charAt(0)
                                                }
                                            </div>
                                            <span className="text-sm text-slate-300">
                                                {user.role === 'TEACHER' ? schedule.student?.name : schedule.teacher?.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-5">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                            Confirmed
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-12 text-center text-slate-500 italic">No classes scheduled.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Input Component
const InputGroup = ({ label, name, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-1 group">
    <label className="text-xs font-bold text-novum-muted uppercase ml-1 group-focus-within:text-novum-cyan transition-colors">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full py-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-novum-cyan transition-all ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default Schedule;