import { useState } from 'react';
import api from '../services/api';
import { User, Mail, Lock, Phone, Save, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTeacher = () => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Role 'TEACHER' হার্ডকোড করে পাঠানো হচ্ছে যাতে ব্যাকএন্ডে ভুল না হয়
      // আপনার রাউট '/admin/create-teacher' বা '/auth/register' হতে পারে, সেটা চেক করে নেবেন
      const response = await api.post('/admin/create-teacher', { ...formData, role: 'TEACHER' });
      
      if(response.data) {
        toast.success("Teacher Added Successfully! 👨‍🏫");
        setFormData({ name: '', email: '', password: '', phone: '' });
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
          <Briefcase className="text-emerald-400" size={32} />
          Register New Teacher
        </h1>
        <p className="text-novum-muted mt-2 ml-1 text-sm md:text-base">Create a profile for a new faculty member.</p>
      </div>

      {/* Form Card */}
      <div className="bg-novum-light p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Background Glow (Emerald Theme for Teachers) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          <InputGroup 
            label="Full Name" 
            name="name" 
            icon={User} 
            placeholder="e.g. Amit Sir" 
            value={formData.name} 
            onChange={handleChange} 
          />
          
          <InputGroup 
            label="Email Address" 
            name="email" 
            icon={Mail} 
            type="email" 
            placeholder="teacher@example.com" 
            value={formData.email} 
            onChange={handleChange} 
          />
          
          <InputGroup 
            label="Password" 
            name="password" 
            icon={Lock} 
            type="password" 
            placeholder="••••••••" 
            value={formData.password} 
            onChange={handleChange} 
          />
          
          <InputGroup 
            label="Phone Number" 
            name="phone" 
            icon={Phone} 
            placeholder="017..." 
            value={formData.phone} 
            onChange={handleChange} 
          />

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {loading ? 'Adding Teacher...' : 'Save Teacher Details'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Reusable Input Component with Emerald Theme Focus
const InputGroup = ({ label, name, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold text-novum-muted uppercase tracking-widest ml-1 group-focus-within:text-emerald-400 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
        <Icon size={18} />
      </div>
      <input
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={type === "password" ? "new-password" : "off"}
        className="w-full pl-11 pr-4 py-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default AddTeacher;