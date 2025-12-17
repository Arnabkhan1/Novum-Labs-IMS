import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, UserPlus, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]); // ক্লাস লিস্ট রাখার জন্য
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    classId: '', // এখানে সিলেক্ট করা ক্লাসের আইডি বসবে
  });

  // ১. পেজ লোড হলেই ক্লাসগুলো নিয়ে আসবে
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/students/classes');
        setClasses(response.data);
      } catch (error) {
        console.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.classId) {
        toast.error("Please select a class!");
        return;
    }

    setLoading(true);
    
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const autoEmail = `student${randomId}@novum.com`; 
    
    const payload = {
        name: formData.name,
        phone: formData.phone,
        classId: parseInt(formData.classId),
        
        email: autoEmail,
        password: '123',
        rollNo: `R-${randomId}`,
        guardianName: 'N/A',
        role: 'STUDENT'
    };

    try {
      await api.post('/auth/register', payload);
      toast.success('Student Added Successfully!');
      setTimeout(() => navigate('/students'), 1000);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add student!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-4 animate-fade-in">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-800 relative">
        
        {/* Header */}
        <div className="flex items-center mb-8 pb-4 border-b border-slate-800">
            <button onClick={() => navigate('/students')} className="mr-4 text-slate-400 hover:text-cyan-400">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <UserPlus className="text-cyan-400" /> New Admission
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Student Name</label>
            <input required name="name" type="text" onChange={handleChange} 
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 outline-none transition" 
              placeholder="Enter full name" 
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Phone Number</label>
            <input required name="phone" type="text" onChange={handleChange} 
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 outline-none transition" 
              placeholder="017..." 
            />
          </div>

          {/* Class Dropdown (Select Menu) */}
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-400 mb-2">Assign Class / Course</label>
            <div className="relative">
                <select 
                    required 
                    name="classId" 
                    onChange={handleChange} 
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer transition"
                    defaultValue=""
                >
                    <option value="" disabled>Select a Class (e.g. B.Tech, Class 10)</option>
                    {classes.length > 0 ? (
                        classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} - {cls.section}
                            </option>
                        ))
                    ) : (
                        <option disabled>Loading classes...</option>
                    )}
                </select>
                {/* Custom Arrow Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <ChevronDown size={20} />
                </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">* Select the course or class from the list.</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] mt-6 flex justify-center items-center gap-2 hover:-translate-y-1 transition-transform"
          >
            <Save size={20} />
            {loading ? "Saving..." : "Confirm Admission"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddStudent;