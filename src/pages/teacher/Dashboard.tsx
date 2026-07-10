import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, CalendarDays, TrendingUp,
  Plus, ArrowUpRight, Clock,
  CheckCircle2, BookOpen, GraduationCap,
  RefreshCw, History
} from "lucide-react";
import api from "../../services/api"; // Ensure this path is correct

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for real data
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalSessions: 0, enrolledStudents: 0, avgAttendance: 0 },
    recentSessions: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/attendance/teacher/dashboard-stats");
      // Expected Response: { stats: {...}, recentSessions: [...], recentActivity: [...] }
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Sessions", value: data.stats.totalSessions, icon: CalendarDays, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Enrolled Students", value: data.stats.enrolledStudents, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg. Attendance", value: `${data.stats.avgAttendance}%`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <RefreshCw className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200/60 px-6 py-8 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-600 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase tracking-widest">Faculty</span>
              <span className="text-slate-400 text-sm font-medium">MMU · Computer Science</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Professor {user?.name?.split(" ")[0] || "Instructor"} 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Overview of your academic performance.</p>
          </div>

          <button
            onClick={() => navigate("/teacher/batches")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} />
            New Session
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Stats & Recent Sessions */}
          <div className="lg:col-span-8 space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {statCards.map((s) => (
                <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all">
                  <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                    <s.icon size={24} className={s.color} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 leading-none">{s.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Sessions History */}
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <History size={20} className="text-indigo-600" />
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Recent Sessions</h3>
                </div>
                <button
                  onClick={() => navigate("/teacher/sessions")}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View History
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.recentSessions.map((session: any) => (
                  <div key={session.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                        {/* If it looks like a MongoID, show a generic label */}
                        {session.batchName.match(/^[0-9a-fA-F]{24}$/) ? "Active Batch" : session.batchName}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-800 mb-1">{session.subjectName}</h4>

                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mt-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={16} /> {session.attendanceCount} Present
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        {/* Corrected Math: (Present / Total Students) * 100 */}
                        {Math.min(100, Math.round((session.attendanceCount / (data.stats.enrolledStudents || 1)) * 100))}% Rate
                      </div>
                    </div>

                    {/* <button 
                      onClick={() => navigate(`/teacher/session/${session.id}`)}
                      className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      View Report <ArrowUpRight size={16} />
                    </button> */}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Live Feed */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-fit">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <h3 className="font-bold uppercase text-xs tracking-widest text-indigo-300">Recent Attendance</h3>
                </div>
              </div>

              <div className="space-y-6">
                {data.recentActivity.length > 0 ? (
                  data.recentActivity.map((act: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-black text-xs text-indigo-300 border border-white/5">
                          {act.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{act.studentName}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{act.timeAgo}</p>
                        </div>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs text-center py-4 italic">No recent logs found.</p>
                )}
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                Full Activity Log
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
