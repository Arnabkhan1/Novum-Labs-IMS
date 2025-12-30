import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Trash2, Edit, Loader2, RefreshCw, BookOpen, Briefcase, Plus, UserCircle, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const StudentCourses = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = '/admin/students';
      
      // টিচার হলে শুধু তার স্টুডেন্টরা লোড হবে (যদি আপনার ব্যাকএন্ডে এই ফিল্টার থাকে)
      if (user?.role === 'TEACHER') {
        url = `/admin/students?teacherId=${user._id}`;
      }
      
      const response = await api.get(url);
      let data = response.data;

      // ✅ SECURITY LOGIC: স্টুডেন্ট হলে পুরো লিস্ট ফিল্টার করে শুধু তাকে রাখা হবে
      if (user?.role === 'STUDENT') {
        data = data.filter(student => student._id === user._id);
      }

      setStudents(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user) fetchStudents();
  }, [user]);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this student?")) return;
    try {
        await api.delete(`/admin/student/${id}`);
        setStudents(students.filter(student => student._id !== id));
        toast.success("Student deleted successfully");
    } catch (error) {
        toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm) ||
    student.rollNo?.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in max-w-[98%] mx-auto space-y-8 pb-10">
      
      {/* === Hero Header Section === */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-novum-cyan/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-3 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-600 shadow-inner">
                        <BookOpen className="text-novum-cyan" size={28} />
                   </div>
                   <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                     {user.role === 'STUDENT' ? 'My Course Details' : 'Course Manager'}
                   </h1>
               </div>
               <p className="text-slate-400 text-sm md:text-base ml-1">
                 {user.role === 'STUDENT' 
                    ? "View your assigned subjects, teachers, and weekly schedule."
                    : <span>Overseeing <span className="text-white font-bold">{students.length} Students</span> and their weekly schedules.</span>
                 }
               </p>
            </div>
            
            {/* Search Bar (Hidden for Students) */}
            {user.role !== 'STUDENT' && (
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-novum-cyan transition-colors" size={20} />
                        <input 
                        type="text" 
                        placeholder="Find student by name..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950/30 border border-slate-600/50 rounded-2xl text-white focus:border-novum-cyan/50 focus:bg-slate-900/80 focus:outline-none transition-all shadow-inner backdrop-blur-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchStudents} className="p-3.5 bg-slate-800 border border-slate-600/50 rounded-2xl text-novum-cyan hover:bg-novum-cyan hover:text-black transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95">
                        <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* === Content Grid === */}
      <div className="space-y-6">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-80 text-novum-cyan/80">
                <Loader2 className="animate-spin mb-4" size={48} />
                <span className="text-xl font-bold tracking-wide">Loading Data...</span>
            </div>
        ) : filteredStudents.length > 0 ? (
            
            <div className="grid grid-cols-1 gap-6">
                {filteredStudents.map((student) => (
                    // === Student Row Card ===
                    <div key={student._id} className="relative bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-slate-800/60 p-1 hover:border-slate-600/60 transition-all duration-300 group shadow-lg">
                        
                        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6">
                            
                            {/* Left: Student Identity */}
                            <div className="p-6 lg:w-[280px] flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                                            {student.name?.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-novum-cyan transition-colors">{student.name}</h3>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <UserCircle size={12}/> {student.guardianName || 'Guardian N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-5 flex items-center gap-3">
                                    <span className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                        <GraduationCap size={14}/> {student.class || 'N/A'}
                                    </span>
                                    <span className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-mono text-slate-400">
                                        Roll: {student.rollNo || '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Middle: Courses Scroll Area */}
                            <div className="flex-1 p-6 overflow-hidden">
                                <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                    
                                    {/* Edit/Add Button (Only for Admin) */}
                                    {user.role === 'ADMIN' && (
                                        <button 
                                            onClick={() => navigate(`/edit-student/${student._id}`)}
                                            className="min-w-[60px] flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 text-slate-500 hover:text-novum-cyan hover:border-novum-cyan/50 hover:bg-novum-cyan/5 transition-all duration-300 group/add"
                                        >
                                            <div className="p-2 rounded-full bg-slate-800 group-hover/add:bg-novum-cyan group-hover/add:text-black transition">
                                                <Plus size={18}/>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wide">Manage</span>
                                        </button>
                                    )}

                                    {/* Course Cards */}
                                    {student.courses && student.courses.length > 0 ? (
                                        student.courses.map((course, idx) => (
                                            <div key={idx} className="min-w-[240px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-4 relative group/card hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-900/10 hover:border-novum-cyan/30 transition-all duration-300">
                                                
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-lg bg-novum-cyan/10 text-novum-cyan border border-novum-cyan/10">
                                                            <BookOpen size={14}/>
                                                        </div>
                                                        <span className="font-bold text-white text-sm tracking-wide">{course.subject}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-4 pl-1">
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Instructor</p>
                                                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                                                        <Briefcase size={12} className="text-purple-400"/>
                                                        {course.teacherId?.name || "Unassigned"}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5">
                                                    {course.classDays.map((day, dIdx) => (
                                                        <span key={dIdx} className="text-[9px] font-bold uppercase px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400 group-hover/card:border-slate-600 transition-colors">
                                                            {day.slice(0, 3)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-3 text-slate-500 italic bg-slate-900/30 px-6 py-4 rounded-2xl border border-slate-800/50 min-w-[200px]">
                                            No courses enrolled yet.
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Right: Actions (Only for Admin) */}
                            {user?.role === 'ADMIN' && (
                                <div className="hidden lg:flex flex-col justify-center border-l border-slate-800/50 p-4 gap-2">
                                    <button onClick={() => navigate(`/edit-student/${student._id}`)} className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition" title="Edit Full Profile">
                                        <Edit size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(student._id)} className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition" title="Delete Student">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                ))}
            </div>

        ) : (
            <div className="text-center py-24 bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-800">
                <Search size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">
                    {user.role === 'STUDENT' ? "Profile loading..." : "No students found"}
                </h3>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;