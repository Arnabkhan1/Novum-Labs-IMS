import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Plus, Trash2, Edit, Phone, BookOpen, Layers } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this student?")) return;
    try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter(student => student.id !== id));
        toast.success("Student deleted successfully");
    } catch (error) {
        toast.error("Failed to delete student");
    }
  };

  const filteredStudents = students.filter(student => 
    student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Layers className="text-cyan-400" />
            Students List
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Manage student names, phones, and classes.</p>
        </div>
        
        <button 
          onClick={() => navigate('/add-student')} 
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105"
        >
          <Plus size={20} /> Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Search Name or Phone..." 
          className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 rounded-2xl shadow-xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Class</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr><td colSpan="4" className="p-12 text-center text-cyan-400 animate-pulse">Loading...</td></tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/50 transition duration-200 group">
                  
                  {/* Name */}
                  <td className="p-5 font-bold text-slate-200 group-hover:text-cyan-400 transition">
                    {student.user.name}
                  </td>

                  {/* Phone (N/A ফিক্স করার উপায়) */}
                  <td className="p-5 text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className={student.phone ? "text-cyan-400" : "text-slate-600"} /> 
                        {student.phone ? student.phone : <span className="text-slate-600 text-xs italic">No Number</span>}
                    </div>
                  </td>

                  {/* Class (FIXED: removed redundant 'Class' text) */}
                  <td className="p-5">
                    <span className="bg-slate-950 text-slate-300 px-3 py-1 rounded-lg text-xs font-bold border border-slate-800">
                       <BookOpen size={12} className="inline mr-1 mb-0.5 text-purple-400"/>
                       {/* যদি ডাটাবেসে 'Class 10' থাকে, তাহলে শুধু সেটাই দেখাবে */}
                       {student.class.name} 
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-5 flex justify-center gap-3">
                    <button 
                        onClick={() => navigate(`/edit-student/${student.id}`)}
                        className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg transition" title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition" title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="p-12 text-center text-slate-500">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;