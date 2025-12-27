import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Trash2, Edit, Phone, Layers, User, Loader2, RefreshCw, Mail, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const StudentsList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ডাটা লোড করা
  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = '/admin/students';
      if (user?.role === 'TEACHER') {
        url = `/admin/students?teacherId=${user._id}`;
      }
      const response = await api.get(url);
      setStudents(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user) fetchStudents();
  }, [user]);

  // ডিলিট লজিক
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
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      
      {/* === Header & Search === */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-2">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <UserCheck className="text-novum-cyan" />
             Student Directory
           </h1>
           <p className="text-novum-muted text-sm mt-1">
             Quick view of <span className="text-novum-cyan font-bold">{students.length}</span> registered students.
           </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search Name, Phone, Roll..." 
                  className="w-full pl-11 pr-4 py-3 bg-novum-light border border-slate-700 rounded-xl text-white focus:border-novum-cyan focus:outline-none transition placeholder-slate-600 shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={fetchStudents} className="p-3 bg-novum-light border border-slate-700 rounded-xl text-novum-cyan hover:bg-slate-800 transition shadow-sm">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* === Clean Table === */}
      <div className="bg-novum-light rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-900/50 border-b border-slate-800">
              <tr>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest w-[30%]">Student Profile</th>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest w-[20%]">Academic Info</th>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest w-[30%]">Contact Details</th>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest text-right w-[20%]">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                    <td colSpan="4" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-novum-cyan">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="text-sm">Loading Directory...</span>
                        </div>
                    </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/20 transition duration-200 group">
                    
                    {/* 1. Student Profile */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-novum-cyan font-bold text-lg shadow-sm">
                            {student.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-white text-base group-hover:text-novum-cyan transition">{student.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><User size={10} /> {student.guardianName || 'Guardian N/A'}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Academic Info */}
                    <td className="p-5">
                        <div className="flex flex-col items-start gap-1.5">
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                              <Layers size={12} className="text-purple-400"/> {student.class || 'N/A'}
                            </span>
                            <span className="text-xs text-slate-500 font-mono pl-1">Roll No: <span className="text-slate-300">{student.rollNo || '-'}</span></span>
                        </div>
                    </td>

                    {/* 3. Contact Details */}
                    <td className="p-5">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Phone size={14} className="text-slate-600"/> {student.phone || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Mail size={14} className="text-slate-600"/> {student.email}
                            </div>
                        </div>
                    </td>

                    {/* 4. Actions */}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {user?.role === 'ADMIN' && (
                            <>
                                <button onClick={() => navigate(`/edit-student/${student._id}`)} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-novum-cyan rounded-xl transition shadow-sm border border-transparent hover:border-novum-cyan/30" title="Edit Profile">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(student._id)} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition shadow-sm border border-transparent hover:border-red-500/30" title="Delete Student">
                                    <Trash2 size={16} />
                                </button>
                            </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-12 text-center text-slate-500 italic">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;