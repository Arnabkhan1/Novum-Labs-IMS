import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Phone, UserCheck, Layers, Hash, Save, Loader2, ArrowLeft, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const EditStudent = () => {
  const { id } = useParams(); // URL থেকে ID নেওয়া
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]); // টিচার লিস্ট স্টেট

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', guardianName: '', userClass: '', rollNo: '', teacherId: ''
  });

  // ১. আগের ডাটা এবং টিচার লিস্ট লোড করা
  useEffect(() => {
    const fetchData = async () => {
        try {
            // প্যারালাল রিকোয়েস্ট দিয়ে স্টুডেন্ট ডাটা এবং টিচার লিস্ট একসাথে আনা হচ্ছে
            const [studentRes, teachersRes] = await Promise.all([
                api.get(`/admin/students/${id}`),
                api.get('/schedule/teachers')
            ]);
            
            const data = studentRes.data;
            
            setFormData({
                name: data.name,
                email: data.email,
                phone: data.phone,
                guardianName: data.guardianName,
                userClass: data.class, // ব্যাকএন্ডে 'class' নামে আছে
                rollNo: data.rollNo,
                teacherId: data.teacher?._id || '' // যদি টিচার অ্যাসাইন করা থাকে
            });

            setTeachers(teachersRes.data);

        } catch (error) {
            toast.error("Failed to fetch student data");
        }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ২. আপডেট সাবমিট করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/admin/students/${id}`, formData);
      toast.success('Student Updated Successfully! 🎉');
      setTimeout(() => navigate('/students'), 1000); // ১ সেকেন্ড পর লিস্ট পেজে নিয়ে যাবে
    } catch (error) {
      console.error(error);
      toast.error('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      
      {/* Header with Back Button */}
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/students')} className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 text-white transition shadow-lg hover:shadow-cyan-500/20">
            <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
               Edit Student Profile
            </h1>
            <p className="text-novum-muted text-sm mt-1">Update information for {formData.name || 'Student'}.</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-novum-light p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-novum-cyan/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          <InputGroup label="Full Name" name="name" icon={User} value={formData.name} onChange={handleChange} />
          <InputGroup label="Email (Read Only)" name="email" icon={Mail} value={formData.email} readOnly={true} />
          <InputGroup label="Phone Number" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} />
          <InputGroup label="Guardian Name" name="guardianName" icon={UserCheck} value={formData.guardianName} onChange={handleChange} />
          <InputGroup label="Class / Course" name="userClass" icon={Layers} value={formData.userClass} onChange={handleChange} />
          <InputGroup label="Roll Number" name="rollNo" icon={Hash} value={formData.rollNo} onChange={handleChange} />

          {/* Teacher Select Dropdown */}
          <div className="space-y-2 group">
            <label className="text-xs font-bold text-novum-muted uppercase tracking-widest ml-1 group-focus-within:text-novum-cyan transition-colors">
              Assigned Teacher
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
                <Briefcase size={18} />
              </div>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white focus:outline-none focus:border-novum-cyan focus:ring-1 focus:ring-novum-cyan transition-all appearance-none cursor-pointer"
              >
                <option value="">-- No Teacher Assigned --</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Updating Profile...' : 'Update Details'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Reusable Input Component (Read-Only Support Included)
const InputGroup = ({ label, name, icon: Icon, value, onChange, readOnly = false }) => (
  <div className="space-y-2 group">
    <label className={`text-xs font-bold uppercase tracking-widest ml-1 transition-colors ${readOnly ? 'text-slate-500' : 'text-novum-muted group-focus-within:text-novum-cyan'}`}>
        {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
        <Icon size={18} />
      </div>
      <input
        required={!readOnly}
        readOnly={readOnly}
        type="text"
        name={name}
        value={value || ''} // value null হলে যাতে এরর না দেয়
        onChange={onChange}
        className={`w-full pl-11 pr-4 py-3.5 border border-slate-700 rounded-xl text-white focus:outline-none transition-all 
        ${readOnly 
            ? 'bg-slate-900/50 cursor-not-allowed text-slate-400 focus:border-slate-700' 
            : 'bg-novum-dark focus:border-novum-cyan focus:ring-1 focus:ring-novum-cyan'}`}
      />
    </div>
  </div>
);

export default EditStudent;