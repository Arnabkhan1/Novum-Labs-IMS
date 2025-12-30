import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const MyAttendance = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, history: [] });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/attendance/my-history');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex h-[80vh] justify-center items-center"><Loader2 className="animate-spin text-novum-cyan" size={48} /></div>;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* === Header === */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-2xl flex items-center gap-6">
        <div className="p-4 bg-slate-950 rounded-full border border-slate-700 text-novum-cyan">
            <PieChart size={32} />
        </div>
        <div>
           <h1 className="text-3xl font-bold text-white">Attendance Report</h1>
           <p className="text-slate-400">Overview of your class participation.</p>
        </div>
      </div>

      {/* === Stats Cards === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-novum-light p-5 rounded-2xl border border-slate-800 text-center">
              <h3 className="text-4xl font-bold text-white">{data.stats.total}</h3>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Total Classes</p>
          </div>
          <div className="bg-novum-light p-5 rounded-2xl border border-slate-800 text-center">
              <h3 className="text-4xl font-bold text-emerald-400">{data.stats.present}</h3>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Present</p>
          </div>
          <div className="bg-novum-light p-5 rounded-2xl border border-slate-800 text-center">
              <h3 className="text-4xl font-bold text-red-400">{data.stats.absent}</h3>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Absent</p>
          </div>
          <div className="bg-novum-light p-5 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
              <h3 className="text-4xl font-bold text-novum-cyan">{data.stats.percentage}%</h3>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Attendance Rate</p>
          </div>
      </div>

      {/* === History List === */}
      <div className="bg-novum-light rounded-[2rem] border border-slate-800 p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-purple-400"/> History Log
        </h3>
        
        <div className="space-y-3">
            {data.history.length > 0 ? (
                data.history.map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:bg-slate-800 transition">
                        <div>
                            <h4 className="font-bold text-white">{record.subject}</h4>
                            <p className="text-sm text-slate-500">{new Date(record.date).toDateString()}</p>
                        </div>
                        <div>
                            {record.studentStatus === 'Present' ? (
                                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">
                                    <CheckCircle size={14}/> Present
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg border border-red-500/20">
                                    <XCircle size={14}/> Absent
                                </span>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-slate-500 py-10">No attendance records found.</p>
            )}
        </div>
      </div>

    </div>
  );
};

export default MyAttendance;