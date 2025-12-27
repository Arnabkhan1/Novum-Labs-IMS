import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Lock, Phone, UserCheck, Layers, Hash, Save, Loader2, Briefcase, CalendarCheck, BookOpen, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);

  // ১. সাধারণ স্টুডেন্ট তথ্য
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', guardianName: '', userClass: '', rollNo: ''
  });

  // ২. কোর্সের তালিকা (যা সেভ হবে)
  const [courses, setCourses] = useState([]);

  // ৩. বর্তমানে যে কোর্সটি অ্যাড করা হচ্ছে (Temporary State)
  const [currentCourse, setCurrentCourse] = useState({
    subject: '',
    teacherId: '',
    classDays: []
  });

  const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // টিচার লোড করা
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

  // ইনপুট হ্যান্ডলার (Student Info)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ইনপুট হ্যান্ডলার (Current Course)
  const handleCourseInput = (e) => {
    setCurrentCourse({ ...currentCourse, [e.target.name]: e.target.value });
  };

  // ডে সিলেকশন হ্যান্ডলার (Current Course)
  const handleDayChange = (day) => {
    setCurrentCourse(prev => {
      const newDays = prev.classDays.includes(day)
        ? prev.classDays.filter(d => d !== day)
        : [...prev.classDays, day];
      return { ...prev, classDays: newDays };
    });
  };

  // ✅ কোর্স লিস্টে যোগ করা (Add Button Logic)
  const addCourseToList = () => {
    // ভ্যালিডেশন
    if (!currentCourse.subject || !currentCourse.teacherId || currentCourse.classDays.length === 0) {
      toast.error("Please fill Subject, Teacher and select at least one Day.");
      return;
    }

    // লিস্টে যোগ করা
    setCourses([...courses, currentCourse]);

    // ইনপুট রিসেট
    setCurrentCourse({ subject: '', teacherId: '', classDays: [] });
    toast.success("Course added to list! Add more or Save.");
  };

  // ❌ কোর্স রিমুভ করা
  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  // ফাইনাল সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ ডাটা পাঠানো হচ্ছে (Info + Courses)
      const payload = {
        ...formData,
        role: 'STUDENT',
        courses: courses // পুরো অ্যারে যাচ্ছে
      };

      await api.post('/admin/add-student', payload);
      
      toast.success("Student & Courses Added Successfully! 🎉");
      
      // সব রিসেট
      setFormData({ name: '', email: '', password: '', phone: '', guardianName: '', userClass: '', rollNo: '' });
      setCourses([]);
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // হেল্পার: টিচারের নাম বের করা (আইডি থেকে)
  const getTeacherName = (id) => teachers.find(t => t._id === id)?.name || 'Unknown';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <UserCheck className="text-novum-cyan" size={32} />
          Register New Student
        </h1>
        <p className="text-novum-muted mt-2 ml-1 text-sm md:text-base">Enter details and assign multiple subject courses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT SIDE: STUDENT INFO === */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                <User size={20} className="text-novum-cyan"/> Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Full Name" name="name" icon={User} placeholder="e.g. Rahul Sharma" value={formData.name} onChange={handleChange} />
                <InputGroup label="Email Address" name="email" icon={Mail} type="email" placeholder="student@example.com" value={formData.email} onChange={handleChange} />
                <InputGroup label="Password" name="password" icon={Lock} type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <InputGroup label="Phone Number" name="phone" icon={Phone} placeholder="017..." value={formData.phone} onChange={handleChange} />
                <InputGroup label="Guardian Name" name="guardianName" icon={UserCheck} placeholder="Father/Mother Name" value={formData.guardianName} onChange={handleChange} />
                <InputGroup label="Class" name="userClass" icon={Layers} placeholder="e.g. Class 10" value={formData.userClass} onChange={handleChange} />
                <InputGroup label="Roll No" name="rollNo" icon={Hash} placeholder="e.g. 101" value={formData.rollNo} onChange={handleChange} />
            </div>
          </div>

          {/* === COURSE ASSIGNMENT SECTION === */}
          <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
             {/* Glow Effect */}
             <div className="absolute top-0 right-0 w-40 h-40 bg-novum-cyan/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

             <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2 relative z-10">
                <BookOpen size={20} className="text-novum-cyan"/> Add Course / Subject
            </h2>

            <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subject Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Subject Name</label>
                        <input type="text" name="subject" value={currentCourse.subject} onChange={handleCourseInput} placeholder="e.g. Physics" className="w-full px-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-white focus:outline-none focus:border-novum-cyan" />
                    </div>

                    {/* Teacher Select */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Assign Teacher</label>
                        <select name="teacherId" value={currentCourse.teacherId} onChange={handleCourseInput} className="w-full px-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-white focus:outline-none focus:border-novum-cyan cursor-pointer">
                            <option value="">-- Select Teacher --</option>
                            {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Days Selection */}
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

                {/* Add Course Button */}
                <button type="button" onClick={addCourseToList} className="w-full py-3 mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-novum-cyan font-bold border border-slate-700 hover:border-novum-cyan transition flex justify-center items-center gap-2">
                    <Plus size={18} /> Add This Course
                </button>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE: SUMMARY & SUBMIT === */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Added Courses List */}
            <div className="bg-novum-light p-5 rounded-3xl border border-slate-800 shadow-xl min-h-[300px]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                    <span>Selected Courses</span>
                    <span className="text-xs bg-novum-cyan text-black px-2 py-1 rounded-full">{courses.length}</span>
                </h3>

                <div className="space-y-3">
                    {courses.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm italic border-2 border-dashed border-slate-800 rounded-xl">
                            No courses added yet. <br/> Fill details and click "Add This Course".
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

            {/* Final Submit Button */}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Saving Data...' : 'Save Student'}
            </button>
        </div>

      </div>
    </div>
  );
};

// Reusable Input Component
const InputGroup = ({ label, name, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-1 group">
    <label className="text-xs font-bold text-slate-400 uppercase ml-1 group-focus-within:text-novum-cyan transition-colors">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition-colors">
        <Icon size={18} />
      </div>
      <input required type={type} name={name} value={value} onChange={onChange} className="w-full pl-11 pr-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-novum-cyan transition-all" placeholder={placeholder} />
    </div>
  </div>
);

export default AddStudent;