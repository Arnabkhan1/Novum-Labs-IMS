import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Phone, UserCheck, Layers, Hash, Save, Loader2, ArrowLeft, Briefcase, BookOpen, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);

  // ১. সাধারণ তথ্য স্টেট
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', guardianName: '', userClass: '', rollNo: ''
  });

  // ২. কোর্সের তালিকা স্টেট
  const [courses, setCourses] = useState([]);

  // ৩. নতুন কোর্স অ্যাড করার টেম্পোরারি স্টেট
  const [currentCourse, setCurrentCourse] = useState({
    subject: '',
    teacherId: '',
    classDays: []
  });

  const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // ডাটা লোড করা
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [studentRes, teachersRes] = await Promise.all([
                api.get(`/admin/students/${id}`),
                api.get('/schedule/teachers')
            ]);
            
            const data = studentRes.data;
            const teachersList = teachersRes.data;

            // বেসিক তথ্য সেট করা
            setFormData({
                name: data.name,
                email: data.email,
                phone: data.phone,
                guardianName: data.guardianName,
                userClass: data.class, 
                rollNo: data.rollNo,
            });

            // ✅ কোর্স লিস্ট সেট করা (Teacher ID ফরম্যাট ঠিক করা হচ্ছে)
            if (data.courses && Array.isArray(data.courses)) {
                const formattedCourses = data.courses.map(c => ({
                    subject: c.subject,
                    classDays: c.classDays,
                    // যদি পপুলেট করা থাকে তাহলে ._id নেব, না হলে সরাসরি আইডি
                    teacherId: c.teacherId?._id || c.teacherId 
                }));
                setCourses(formattedCourses);
            }

            setTeachers(teachersList);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch student data");
        }
    };
    fetchData();
  }, [id]);

  // ইনপুট হ্যান্ডলার (Basic Info)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ইনপুট হ্যান্ডলার (Current Course)
  const handleCourseInput = (e) => {
    setCurrentCourse({ ...currentCourse, [e.target.name]: e.target.value });
  };

  // ডে সিলেকশন হ্যান্ডলার
  const handleDayChange = (day) => {
    setCurrentCourse(prev => {
      const newDays = prev.classDays.includes(day)
        ? prev.classDays.filter(d => d !== day) 
        : [...prev.classDays, day]; 
      return { ...prev, classDays: newDays };
    });
  };

  // ✅ কোর্স লিস্টে যোগ করা
  const addCourseToList = () => {
    if (!currentCourse.subject || !currentCourse.teacherId || currentCourse.classDays.length === 0) {
      toast.error("Please fill Subject, Teacher and select Days.");
      return;
    }
    setCourses([...courses, currentCourse]);
    setCurrentCourse({ subject: '', teacherId: '', classDays: [] }); // রিসেট
    toast.success("Course added to list!");
  };

  // ❌ কোর্স রিমুভ করা
  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  // ফাইনাল আপডেট সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ ডাটা পাঠানো হচ্ছে (Info + Updated Courses)
      const payload = {
        ...formData,
        courses: courses
      };

      await api.put(`/admin/students/${id}`, payload);
      toast.success('Student Updated Successfully! 🎉');
      setTimeout(() => navigate('/students'), 1000); 
    } catch (error) {
      console.error(error);
      toast.error('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  // হেল্পার: টিচারের নাম বের করা
  const getTeacherName = (id) => teachers.find(t => t._id === id)?.name || 'Unknown Teacher';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/students')} className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 text-white transition shadow-lg hover:shadow-cyan-500/20">
            <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
               Edit Student Profile
            </h1>
            <p className="text-novum-muted text-sm mt-1">Update details and manage subject courses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT SIDE: EDIT INFO & ADD COURSE === */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Student Info Form */}
            <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup label="Full Name" name="name" icon={User} value={formData.name} onChange={handleChange} />
                    <InputGroup label="Email (Read Only)" name="email" icon={Mail} value={formData.email} readOnly={true} />
                    <InputGroup label="Phone Number" name="phone" icon={Phone} value={formData.phone} onChange={handleChange} />
                    <InputGroup label="Guardian Name" name="guardianName" icon={UserCheck} value={formData.guardianName} onChange={handleChange} />
                    <InputGroup label="Class" name="userClass" icon={Layers} value={formData.userClass} onChange={handleChange} />
                    <InputGroup label="Roll No" name="rollNo" icon={Hash} value={formData.rollNo} onChange={handleChange} />
                </div>
            </div>

            {/* 2. Add New Course Section */}
            <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-novum-cyan/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2 relative z-10">
                    <BookOpen size={20} className="text-novum-cyan"/> Add New Course
                </h2>

                <div className="space-y-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Subject Name</label>
                            <input type="text" name="subject" value={currentCourse.subject} onChange={handleCourseInput} placeholder="e.g. Chemistry" className="w-full px-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-white focus:outline-none focus:border-novum-cyan" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Assign Teacher</label>
                            <select name="teacherId" value={currentCourse.teacherId} onChange={handleCourseInput} className="w-full px-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-white focus:outline-none focus:border-novum-cyan cursor-pointer">
                                <option value="">-- Select Teacher --</option>
                                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Class Days</label>
                        <div className="flex flex-wrap gap-2">
                            {daysOptions.map(day => (
                                <label key={day} className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-bold transition-all select-none ${currentCourse.classDays.includes(day) ? 'bg-novum-cyan text-black border-novum-cyan' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}>
                                    <input type="checkbox" className="hidden" checked={currentCourse.classDays.includes(day)} onChange={() => handleDayChange(day)} />
                                    {day.slice(0, 3)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="button" onClick={addCourseToList} className="w-full py-3 mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-novum-cyan font-bold border border-slate-700 hover:border-novum-cyan transition flex justify-center items-center gap-2">
                        <Plus size={18} /> Add To List
                    </button>
                </div>
            </div>
        </div>

        {/* === RIGHT SIDE: COURSE LIST & SAVE === */}
        <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-novum-light p-5 rounded-3xl border border-slate-800 shadow-xl min-h-[300px]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                    <span>Enrolled Courses</span>
                    <span className="text-xs bg-novum-cyan text-black px-2 py-1 rounded-full">{courses.length}</span>
                </h3>

                <div className="space-y-3">
                    {courses.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm italic border-2 border-dashed border-slate-800 rounded-xl">
                            No courses assigned.
                        </div>
                    ) : (
                        courses.map((course, idx) => (
                            <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 relative group hover:border-slate-600 transition">
                                <button onClick={() => removeCourse(idx)} className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition"><X size={14}/></button>
                                
                                <div className="flex items-center gap-2 mb-1">
                                    <BookOpen size={14} className="text-novum-cyan"/>
                                    <span className="font-bold text-white">{course.subject}</span>
                                </div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                                    <Briefcase size={12}/> {getTeacherName(course.teacherId)}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {course.classDays.map(d => (
                                        <span key={d} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">{d.slice(0, 3)}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Update Profile' : 'Save Changes'}
            </button>
        </div>

      </div>
    </div>
  );
};

const InputGroup = ({ label, name, icon: Icon, value, onChange, readOnly = false }) => (
  <div className="space-y-1 group">
    <label className="text-xs font-bold text-slate-400 uppercase ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Icon size={18} /></div>
      <input required={!readOnly} readOnly={readOnly} type="text" name={name} value={value || ''} onChange={onChange} className={`w-full pl-11 pr-4 py-3.5 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-novum-cyan ${readOnly ? 'bg-slate-900/50 cursor-not-allowed text-slate-400' : 'bg-novum-dark'}`} />
    </div>
  </div>
);

export default EditStudent;