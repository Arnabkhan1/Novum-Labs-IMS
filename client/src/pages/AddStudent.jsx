import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Lock, Phone, UserCheck, Layers, Hash, Save, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    guardianName: '',
    userClass: '', // লক্ষ্য করুন: backend-এ এটি 'class' নামে রিসিভ হচ্ছে কিনা চেক করবেন
    rollNo: '',
    teacherId: ''
  });

  // ১. টিচারদের লিস্ট লোড করা
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/schedule/teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error("Failed to load teachers", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ২. ডাটা পাঠানো (সাথে role: 'STUDENT' হার্ডকোড করে দেওয়া হলো যাতে ভুল না হয়)
      // নোট: যদি আপনার ব্যাকএন্ড রাউট '/auth/register' হয়, তবে সেটি ব্যবহার করবেন।
      // এখানে আপনার দেওয়া '/admin/add-student' রাখা হলো।
      const response = await api.post('/admin/add-student', { ...formData, role: 'STUDENT' });
      
      if(response.data) {
        toast.success("Student Added Successfully! 🎉");
        // ফর্ম রিসেট
        setFormData({
            name: '', email: '', password: '', phone: '', guardianName: '', userClass: '', rollNo: '', teacherId: ''
        });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <UserCheck className="text-novum-cyan" size={32} />
          Register New Student
        </h1>
        <p className="text-novum-muted mt-2 ml-1 text-sm md:text-base">Enter the student's details and assign a teacher.</p>
      </div>

      {/* Form Card */}
      <div className="bg-novum-light p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-novum-cyan/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Inputs */}
          <InputGroup label="Full Name" name="name" icon={User} placeholder="e.g. Rahul Sharma" value={formData.name} onChange={handleChange} />
          
          <InputGroup label="Email Address" name="email" icon={Mail} type="email" placeholder="student@example.com" value={formData.email} onChange={handleChange} />

          <InputGroup label="Password" name="password" icon={Lock} type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />

          <InputGroup label="Phone Number" name="phone" icon={Phone} placeholder="017..." value={formData.phone} onChange={handleChange} />

          <InputGroup label="Guardian Name" name="guardianName" icon={UserCheck} placeholder="Father/Mother Name" value={formData.guardianName} onChange={handleChange} />

          {/* Note: Backend এ যদি 'class' ফিল্ড থাকে, তবে state name এবং backend schema মিলিয়ে নেবেন */}
          <InputGroup label="Class / Course" name="userClass" icon={Layers} placeholder="e.g. Class 10" value={formData.userClass} onChange={handleChange} />

          <InputGroup label="Roll Number" name="rollNo" icon={Hash} placeholder="e.g. 101" value={formData.rollNo} onChange={handleChange} />

          {/* Teacher Select Dropdown */}
          <div className="space-y-2 group">
            <label className="text-xs font-bold text-novum-muted uppercase tracking-widest ml-1 group-focus-within:text-novum-cyan transition-colors">
              Assign Teacher
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
                <option value="">-- Select Teacher (Optional) --</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {/* Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </div>

          {/* Submit Button - Full width on mobile, spans 2 cols on desktop */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Saving Student...' : 'Save Student Details'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputGroup = ({ label, name, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold text-novum-muted uppercase tracking-widest ml-1 group-focus-within:text-novum-cyan transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
        <Icon size={18} />
      </div>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-4 py-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-novum-cyan focus:ring-1 focus:ring-novum-cyan transition-all"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default AddStudent;