import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import axios from 'axios'; 
import { Map, FileText, Trash2, Save, Loader2, Paperclip, Download, Eye, File } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Roadmap = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [students, setStudents] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  const [studentId, setStudentId] = useState('');
  const [file, setFile] = useState(null);

  // সার্ভার URL জেনারেটর
  const getBaseUrl = () => {
    const apiUrl = api.defaults.baseURL; 
    if (!apiUrl) return 'http://localhost:5000';
    return apiUrl.replace('/api', ''); 
  };

  const fetchData = async () => {
    try {
      let fetchedStudents = [];
      if (user.role !== 'STUDENT') {
        let studentUrl = '/admin/students';
        if (user.role === 'TEACHER') studentUrl = `/admin/students?teacherId=${user._id}`;
        
        const resStudents = await api.get(studentUrl);
        if (resStudents.data) {
            setStudents(resStudents.data);
            fetchedStudents = resStudents.data;
        }
      }

      const resRoadmaps = await api.get('/roadmap/all');
      let allRoadmaps = resRoadmaps.data;

      if (user.role === 'TEACHER') {
          const myStudentIds = fetchedStudents.map(s => s._id);
          allRoadmaps = allRoadmaps.filter(r => myStudentIds.includes(r.student?._id));
      }
      setRoadmaps(allRoadmaps);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
        setFetching(false);
    }
  };

  useEffect(() => {
    if(user) fetchData();
  }, [user]);

  // Force Download Function
  const handleDownload = async (fileUrl, fileName, id) => {
    setDownloadingId(id);
    try {
        const response = await axios.get(fileUrl, {
            responseType: 'blob', 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Download Started! 📥");
    } catch (error) {
        console.error("Download error:", error);
        toast.error("Download failed.");
    } finally {
        setDownloadingId(null);
    }
  };

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
    
    try {
      await api.post('/roadmap/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("File Uploaded Successfully!");
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

  const displayedRoadmaps = user.role === 'STUDENT' ? roadmaps.filter(r => r.student?._id === user._id) : roadmaps;

  if (fetching) return <div className="flex h-[80vh] justify-center items-center"><Loader2 className="animate-spin text-novum-cyan" size={48} /></div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <Map className="text-novum-cyan" /> 
             {user.role === 'STUDENT' ? 'My Study Materials' : 'Student Resources'}
           </h1>
           <p className="text-novum-muted text-sm mt-1">
             Manage and access study documents securely.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form (Admin Only) */}
        {user.role === 'ADMIN' && (
          <div className="lg:col-span-1">
            <div className="bg-novum-light p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Upload Document</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-400 uppercase">Select Student</label>
                  <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="w-full p-3.5 bg-novum-dark border border-slate-700 rounded-xl text-white focus:border-novum-cyan outline-none cursor-pointer">
                    <option value="">-- Choose Student --</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.class})</option>)}
                  </select>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-slate-400 uppercase">Select File</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Paperclip size={18}/></div>
                      <input required id="fileInput" type="file" accept=".doc,.docx,.pdf,.txt,.png,.jpg" onChange={(e) => setFile(e.target.files[0])} className="w-full pl-10 pr-4 py-3 bg-novum-dark border border-slate-700 rounded-xl text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-novum-cyan file:text-novum-dark cursor-pointer focus:outline-none focus:border-novum-cyan" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-novum-cyan to-blue-600 hover:from-novum-hover hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} {loading ? 'Uploading...' : 'Upload Now'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* File List */}
        <div className={user.role === 'ADMIN' ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="bg-novum-light rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <h2 className="text-xl font-bold text-white p-6 border-b border-slate-800 flex justify-between items-center">
                <span>Uploaded Files</span>
                <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{displayedRoadmaps.length} Files</span>
            </h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[750px]">
                    <thead className="bg-slate-900/50 text-xs font-bold text-novum-muted uppercase">
                        <tr><th className="p-5">File Info</th>{user.role !== 'STUDENT' && <th className="p-5">Student</th>}<th className="p-5 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {displayedRoadmaps.length > 0 ? (
                            displayedRoadmaps.map((item) => {
                                const fileExt = item.fileUrl?.split('.').pop().toLowerCase();
                                const isPdf = fileExt === 'pdf';
                                const isImage = ['jpg', 'jpeg', 'png'].includes(fileExt);
                                const isWord = ['doc', 'docx'].includes(fileExt);
                                
                                // ✅ ব্রাউজারে দেখার মত ফাইল কিনা চেক করা
                                const canViewOnline = isPdf || isImage;

                                const BASE_URL = getBaseUrl();
                                const fileLink = item.fileUrl ? `${BASE_URL}/${item.fileUrl.replace(/\\/g, "/")}` : "#";

                                return (
                                    <tr key={item._id} className="hover:bg-slate-800/30 transition">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${isPdf ? 'bg-red-500/10 text-red-400' : isWord ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                                                    {isPdf ? <FileText size={20} /> : isWord ? <FileText size={20} /> : <File size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm max-w-[200px] truncate" title={item.title}>{item.title}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {user.role !== 'STUDENT' && (
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">{item.student?.name?.charAt(0)}</div>
                                                    <span className="text-sm text-slate-300">{item.student?.name}</span>
                                                </div>
                                            </td>
                                        )}

                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                
                                                {/* ✅ VIEW BUTTON (Only for PDF & Images) */}
                                                {canViewOnline && (
                                                  <a 
                                                      href={fileLink} 
                                                      target="_blank" 
                                                      rel="noopener noreferrer" 
                                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition" 
                                                      title="View Online"
                                                  >
                                                      <Eye size={14} /> View
                                                  </a>
                                                )}

                                                {/* ✅ DOWNLOAD BUTTON (Always visible) */}
                                                <button 
                                                    onClick={() => handleDownload(fileLink, item.title, item._id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-novum-cyan border border-slate-700 hover:bg-novum-cyan hover:text-black transition shadow-sm"
                                                    disabled={downloadingId === item._id}
                                                >
                                                    {downloadingId === item._id ? <Loader2 size={14} className="animate-spin"/> : <Download size={14} />}
                                                    {downloadingId === item._id ? '...' : 'Download'}
                                                </button>

                                                {/* Delete Button */}
                                                {user.role === 'ADMIN' && (
                                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition ml-1"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="3" className="p-12 text-center text-slate-500 italic">No files uploaded yet.</td></tr>
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