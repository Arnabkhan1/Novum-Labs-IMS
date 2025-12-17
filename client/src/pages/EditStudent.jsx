import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, PenTool } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL থেকে ID নেওয়া
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    classId: '',
  });

  // আগের ডাটা লোড করা
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // ১. সব স্টুডেন্ট নিয়ে আসছি
        const response = await api.get('/students');
        
        // ২. যেই আইডির সাথে মিলবে তাকে খুঁজে বের করছি
        // URL এর id স্ট্রিং থাকে, তাই parseInt করতে হবে
        const foundStudent = response.data.find(s => s.id === parseInt(id));
        
        if (foundStudent) {
            setFormData({
                name: foundStudent.user.name, // User টেবিল থেকে নাম
                phone: foundStudent.phone,
                classId: foundStudent.classId
            });
        } else {
            toast.error("Student not found!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    if(id) fetchStudentData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // শুধু নাম, ফোন আর ক্লাস আপডেট হবে
      const payload = {
        name: formData.name,
        phone: formData.phone,
        classId: parseInt(formData.classId)
      };

      await api.put(`/students/${id}`, payload);
      toast.success('Student Updated Successfully!');
      setTimeout(() => navigate('/students'), 1000);
    } catch (error) {
      console.error(error);
      toast.error('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-4 animate-fade-in">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-800">
        
        <div className="flex items-center mb-8 pb-4 border-b border-slate-800">
            <button onClick={() => navigate('/students')} className="mr-4 text-slate-400 hover:text-cyan-400">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <PenTool className="text-cyan-400" size={24} /> Edit Student
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Student Name</label>
            <input required name="name" type="text" value={formData.name} onChange={handleChange} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Phone Number</label>
            <input required name="phone" type="text" value={formData.phone} onChange={handleChange} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Class ID</label>
            <input required name="classId" type="number" value={formData.classId} onChange={handleChange} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-cyan-500 outline-none" 
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg mt-4 flex justify-center items-center gap-2"
          >
            <Save size={20} />
            {loading ? "Updating..." : "Update Student"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditStudent;