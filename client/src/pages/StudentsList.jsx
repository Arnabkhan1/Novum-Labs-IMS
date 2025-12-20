import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Trash2, Edit, Phone, Layers, User, Loader2, RefreshCw, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const StudentsList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ডাটা লোড করার ফাংশন
  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = '/admin/students';

      // লজিক: যদি ইউজার 'TEACHER' হয়, তবে শুধু তার স্টুডেন্ট লোড হবে
      // (ব্যাকএন্ডে এই ফিল্টারিং থাকতে হবে, অথবা ফ্রন্টএন্ডে ফিল্টার করতে হবে)
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
        await api.delete(`/admin/students/${id}`);
        setStudents(students.filter(student => student._id !== id));
        toast.success("Student deleted successfully");
    } catch (error) {
        toast.error("Failed to delete student");
    }
  };

  // সার্চ লজিক
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm) ||
    student.rollNo?.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      
      {/* === Header & Search Section === */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-2">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <UserCheck className="text-novum-cyan" />
             {user?.role === 'TEACHER' ? 'My Students' : 'All Students'}
           </h1>
           <p className="text-novum-muted text-sm mt-1">
             Total Students: <span className="text-novum-cyan font-bold">{students.length}</span>
           </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by Name, Phone..." 
                  className="w-full pl-11 pr-4 py-3 bg-novum-light border border-slate-700 rounded-xl text-white focus:border-novum-cyan focus:outline-none transition placeholder-slate-600 shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={fetchStudents} className="p-3 bg-novum-light border border-slate-700 rounded-xl text-novum-cyan hover:bg-slate-800 transition shadow-sm">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* === Table Card === */}
      <div className="bg-novum-light rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-900/50 border-b border-slate-800">
              <tr>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest">Student Info</th>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest">Class & Roll</th>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest">Contact</th>
                <th className="p-5 text-xs font-bold text-novum-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                    <td colSpan="4" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-novum-cyan">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="text-sm">Loading Data...</span>
                        </div>
                    </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition duration-200 group">
                    
                    {/* Name & Guardian */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        {/* Avatar Circle */}
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-novum-cyan font-bold border border-slate-700 group-hover:border-novum-cyan transition shadow-md">
                            {student.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-white group-hover:text-novum-cyan transition text-sm md:text-base">{student.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><User size={10} /> {student.guardianName || 'Guardian N/A'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Class & Roll */}
                    <td className="p-5">
                        <div className="flex flex-col items-start gap-1">
                            <span className="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-800 flex items-center gap-1.5">
                              <Layers size={12} className="text-purple-400"/> {student.class || 'N/A'}
                            </span>
                            <span className="text-xs text-slate-500 font-mono pl-1">Roll: {student.rollNo || '-'}</span>
                        </div>
                    </td>

                    {/* Phone */}
                    <td className="p-5 text-slate-400 font-mono text-sm">
                        <div className="flex items-center gap-2 bg-slate-800/50 w-fit px-2 py-1 rounded border border-transparent group-hover:border-slate-700 transition">
                            <Phone size={12} className="text-slate-500" /> {student.phone || 'N/A'}
                        </div>
                    </td>

                    {/* Actions Buttons */}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        
                        {/* Edit Button (Admins only) */}
                        {user?.role === 'ADMIN' && (
                            <button 
                                onClick={() => navigate(`/edit-student/${student._id}`)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-novum-cyan/20 rounded-lg transition border border-transparent hover:border-novum-cyan/30" 
                                title="Edit Student"
                            >
                                <Edit size={16} />
                            </button>
                        )}

                        {/* Delete Button (Admins only) */}
                        {user?.role === 'ADMIN' && (
                            <button 
                                onClick={() => handleDelete(student._id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/30" 
                                title="Delete Student"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-12 text-center text-slate-500 italic">No students found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;