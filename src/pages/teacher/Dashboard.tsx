import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  QrCode, Users, CalendarDays, TrendingUp, 
  MoreVertical, Plus, ArrowUpRight, Clock, 
  CheckCircle2, BookOpen, GraduationCap 
} from "lucide-react";

// Realistic Data Objects
const stats = [
  { label: "Total Sessions", value: "24", icon: CalendarDays, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Enrolled Students", value: "156", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Avg. Attendance", value: "82%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
];

const currentClasses = [
  { id: 1, name: "Data Structures", code: "CS-402", time: "10:00 AM", students: 42, status: "Active" },
  { id: 2, name: "Operating Systems", code: "CS-405", time: "02:00 PM", students: 38, status: "Upcoming" },
];

const recentActivity = [
  { student: "Balram Naik", time: "2 mins ago", subject: "Data Structures", avatar: "BN" },
  { student: "Rahul Sharma", time: "5 mins ago", subject: "Data Structures", avatar: "RS" },
  { student: "Ananya Iyer", time: "12 mins ago", subject: "Data Structures", avatar: "AI" },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* 1. Header Section */}
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
            <p className="text-slate-500 mt-1 font-medium">Here's what's happening with your classes today.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/teacher/create-session")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus size={20} />
              New Session
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Stats & Class Management (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                    <s.icon size={24} className={s.color} />
                  </div>
                  <p className="text-3xl font-black text-slate-900 leading-none">{s.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Active Classes */}
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" />
                  <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Today's Schedule</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentClasses.map((cls) => (
                  <div key={cls.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                      <GraduationCap size={80} />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                        {cls.code}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${cls.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${cls.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        {cls.status}
                      </div>
                    </div>

                    <h4 className="text-xl font-black text-slate-800 mb-1">{cls.name}</h4>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mt-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} /> {cls.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={16} /> {cls.students} Enrolled
                      </div>
                    </div>

                    <button className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">
                      {cls.status === 'Active' ? 'Monitor Session' : 'Start Session'}
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Live Feed & Quick Actions (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Live Attendance Feed */}
            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <h3 className="font-bold uppercase text-xs tracking-widest text-indigo-300">Live Feed</h3>
                </div>
                <button className="text-[10px] font-black text-slate-400 hover:text-white uppercase transition-colors">Clear</button>
              </div>

              <div className="space-y-6">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs text-indigo-300 border border-white/5">
                        {act.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{act.student}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{act.time}</p>
                      </div>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                View Detailed Logs
              </button>
            </section>

            {/* Attendance Analytics (Placeholder) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-6">Class Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-slate-500">Attendance Rate</span>
                  <span className="text-[11px] font-black text-indigo-600">82%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <p className="text-[10px] text-slate-400 italic">Up 4% from last week</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;