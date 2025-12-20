import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Map, FileText, Trash2, Save, Loader2, Paperclip, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Roadmap = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // আপলোডিং স্টেট
  const [fetching, setFetching] = useState(true); // ডাটা ফেচিং স্টেট
  const [students, setStudents] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  // ফর্ম স্টেট
  const [studentId, setStudentId] = useState('');
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      let fetchedStudents = [];

      // ১. স্টুডেন্ট লিস্ট লোড
      if (user.role !== 'STUDENT') {
        let studentUrl = '/admin/students';
        if (user.role === 'TEACHER') {
            studentUrl = `/admin/students?teacherId=${user._id}`;
        }
        const resStudents = await api.get(studentUrl);
        if (resStudents.data) {
            setStudents(resStudents.data);
            fetchedStudents = resStudents.data;
        }
      }

      // ২. ফাইল/রোডম্যাপ লোড করা
      const resRoadmaps = await api.get('/roadmap/all');
      let allRoadmaps = resRoadmaps.data;

      // টিচার ফিল্টার
      if (user.role === 'TEACHER') {
          const myStudentIds = fetchedStudents.map(s => s._id);
          allRoadmaps = allRoadmaps.filter(r => myStudentIds.includes(r.student?._id));
      }

      setRoadmaps(allRoadmaps);

    } catch (error) {
      console.error("Data load error", error);
      toast.error("Failed to load data");
    } finally {
        setFetching(false);
    }
  };

  useEffect(() => {
    if(user) fetchData();
  }, [user]);

  // আপলোড ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !studentId) {
      toast.error("Please select both student and file!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('description', 'File Uploaded'); 

    try {
      await api.post('/roadmap/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("File Uploaded Successfully! 📁");
      fetchData();
      setStudentId(''); setFile(null);
      document.getElementById('fileInput').value = ""; 
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this file?")) return;
    try {
        await api.delete(`/roadmap/${id}`);
        setRoadmaps(roadmaps.filter(r => r._id !== id));
        toast.success("Deleted successfully");
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  // স্টুডেন্ট ফিল্টার
  const displayedRoadmaps = user.role === 'STUDENT' 
    ? roadmaps.filter(r => r.student?._id === user._id) 
    : roadmaps;

  // ফেচিং লোডার
  if (fetching) {
      return (
          <div className="flex h-[80vh] justify-center items-center">
              <Loader2 className="animate-spin text-novum-cyan" size={48} />
          </div>
      );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <Map className="text-novum-cyan" /> 
             {user.role === 'STUDENT' ? 'My Study Materials' : 'Student Resources'}
           </h1>
           <p className="text-novum-muted text-sm mt-1">
             {user.role === 'ADMIN' 
                ? 'Upload necessary study materials (Word/PDF).' 
                : 'View and download your assigned study resources.'}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === বাম পাশ: আপলোড ফর্ম (শুধুমাত্র ADMIN দেখবে) === */}
        {user.role === 'ADMIN' && (
          <div className="lg:col-span-1">
            <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Upload Document</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-novum-muted uppercase group-focus-within:text-novum-cyan transition-colors">Select Student</label>
                  <select 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                    required 
                    className="w-full p-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white focus:border-novum-cyan outline-none transition cursor-pointer"
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.class})</option>)}
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-novum-muted uppercase ml-1 group-focus-within:text-novum-cyan transition-colors">Select File (Word/PDF)</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-novum-cyan transition"><Paperclip size={18}/></div>
                      <input 
                          required
                          id="fileInput"
                          type="file" 
                          accept=".doc,.docx,.pdf,.txt"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="w-full pl-10 pr-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-novum-cyan file:text-novum-dark hover:file:bg-novum-hover cursor-pointer focus:outline-none focus:border-novum-cyan transition-all"
                      />
                  </div>
                  {file && (
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 mt-2">
                          <FileText size={14} className="text-emerald-400"/>
                          <p className="text-xs text-emerald-400 font-mono truncate">{file.name}</p>
                      </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !file || !studentId} 
                  className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {loading ? 'Uploading...' : 'Upload Now'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* === ডান পাশ: ফাইলের লিস্ট === */}
        <div className={user.role === 'ADMIN' ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-novum-light rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <h2 className="text-xl font-bold text-white p-6 border-b border-slate-800 flex justify-between items-center">
                <span>{user.role === 'STUDENT' ? 'My Resources' : 'Uploaded Files'}</span>
                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{displayedRoadmaps.length} Files</span>
            </h2>
            
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-slate-900/50 text-xs font-bold text-novum-muted uppercase">
                        <tr>
                            <th className="p-5">File Info</th>
                            {user.role !== 'STUDENT' && <th className="p-5">Student Assigned</th>}
                            <th className="p-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {displayedRoadmaps.length > 0 ? (
                            displayedRoadmaps.map((item) => {
                                const isPdf = item.fileUrl?.toLowerCase().endsWith('.pdf');
                                // লোকালহোস্টের জন্য URL জেনারেট করা হচ্ছে
                                const fileLink = item.fileUrl ? `http://localhost:5000/${item.fileUrl.replace(/\\/g, "/")}` : null;

                                return (
                                    <tr key={item._id} className="hover:bg-slate-800/30 transition group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${isPdf ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                    {isPdf ? <FileText size={20} /> : <Paperclip size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm group-hover:text-novum-cyan transition-colors">{item.title}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                                        Uploaded: {new Date(item.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {user.role !== 'STUDENT' && (
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                                                        {item.student?.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-slate-300">{item.student?.name}</span>
                                                </div>
                                            </td>
                                        )}

                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-3">
                                                {/* View/Download Button */}
                                                {fileLink && (
                                                    <a 
                                                        href={fileLink} target="_blank" rel="noreferrer"
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition border border-slate-700 hover:bg-slate-800 hover:border-novum-cyan text-slate-300 hover:text-white"
                                                        title="View File"
                                                    >
                                                        <Download size={14} /> View
                                                    </a>
                                                )}

                                                {/* Delete Button (Only Admin) */}
                                                {user.role === 'ADMIN' && (
                                                    <button 
                                                        onClick={() => handleDelete(item._id)} 
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                        title="Delete File"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="3" className="p-12 text-center text-slate-500 italic">No study materials found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;