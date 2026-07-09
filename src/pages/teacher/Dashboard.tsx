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
              {/* Left & Middle Box Block: Side-by-side on mobile, standalone blocks on laptop */}
              <div className="grid grid-cols-2 gap-4 col-span-1 sm:col-span-2 sm:grid-cols-2 sm:gap-6">
                {statCards
                  .filter((s) => s.label.toLowerCase().includes("session") || s.label.toLowerCase().includes("enroll"))
                  .map((s) => (
                    <div key={s.label} className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all flex flex-col justify-between">
                      <div>
                        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                          <s.icon className={`${s.color} h-5 w-5 sm:h-6 sm:w-6`} />
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{s.value}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                        {s.label}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Right Box (Avg Attendance): Spans full width on mobile, standard third column on laptop */}
              {statCards
                .filter((s) => s.label.toLowerCase().includes("attend") || s.label.toLowerCase().includes("avg"))
                .map((s) => (
                  <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all col-span-1 flex flex-col justify-between">
                    <div>
                      <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                        <s.icon size={24} className={s.color} />
                      </div>
                      <p className="text-3xl font-black text-slate-900 leading-none">{s.value}</p>
                    </div>
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
                {data?.recentSessions?.slice(0, 4).map((session: any) => (
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
                        {Math.min(100, Math.round((session.attendanceCount / (data?.stats?.enrolledStudents || 1)) * 100))}% Rate
                      </div>
                    </div>
                  </div>
                ))}

                {/* Fallback if list is empty */}
                {(!data?.recentSessions || data.recentSessions.length === 0) && (
                  <p className="text-slate-400 text-xs italic col-span-full text-center py-6">No recent sessions found.</p>
                )}
              </div>
            </section>
          </div>
          {/* RIGHT: Live Feed */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-fit border border-white/5">

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <h3 className="font-bold uppercase text-xs tracking-widest text-indigo-300">
                    Recent Attendance
                  </h3>
                </div>
              </div>

              {/* Scrollable Feed Container */}
              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1 scrollbar-none">
                {data?.recentActivity?.length > 0 ? (
                  data.recentActivity.map((act: any, i: number) => (
                    <div
                      key={act.id || i}
                      className="flex items-center justify-between group cursor-pointer p-1 rounded-xl hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar Icon */}
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-black text-xs text-indigo-300 border border-white/5 transition-transform duration-300 group-hover:scale-105 group-hover:bg-indigo-500/30">
                          {act?.studentName?.charAt(0) || "?"}
                        </div>

                        {/* Student Metadata */}
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors duration-200">
                            {act?.studentName || "Unknown Student"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            {act?.timeAgo}
                          </p>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <CheckCircle2
                        size={16}
                        className="text-emerald-400 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-slate-500 text-xs italic">No recent logs found.</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {/* <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 active:scale-[0.98] transition-all duration-200">
                Full Activity Log
              </button> */}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
