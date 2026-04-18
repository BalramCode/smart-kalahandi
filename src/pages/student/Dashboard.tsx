import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  QrCode, TrendingUp, CalendarDays, LogOut, CheckCircle2, 
  XCircle, Bell, ChevronRight, User, Award, ArrowUpRight 
} from "lucide-react";

const recentAttendance = [
  { subject: "Data Structures", date: "Apr 14, 2026", status: "Present", color: "text-emerald-500", bg: "bg-emerald-50" },
  { subject: "Operating Systems", date: "Apr 13, 2026", status: "Present", color: "text-emerald-500", bg: "bg-emerald-50" },
  { subject: "Computer Networks", date: "Apr 12, 2026", status: "Absent", color: "text-rose-500", bg: "bg-rose-50" },
  { subject: "Database Systems", date: "Apr 11, 2026", status: "Present", color: "text-emerald-500", bg: "bg-emerald-50" },
  { subject: "Discrete Math", date: "Apr 10, 2026", status: "Present", color: "text-emerald-500", bg: "bg-emerald-50" },
];

const weeklyData = [65, 40, 85, 90, 35, 20, 0]; // Sample data
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-10">
      {/* 1. Responsive Navigation */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 transform rotate-3">
            <User size={24} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-black text-slate-800 leading-none">{user?.name || "Balram Naik"}</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase mt-1 tracking-widest">CS Student · MMU</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-3 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all"
          >
            <LogOut size={18} />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Responsive Content Container */}
      <main className="max-w-7xl mx-auto p-4 md:p-10">
        
        {/* Grid Layout: 1 column on mobile, 12 columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (Stats & Chart) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Hero Attendance Card */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="relative inline-flex">
                  <svg className="w-32 h-32 md:w-40 md:h-40 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="44"
                      fill="none"
                      stroke="url(#dashboardGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 * (1 - 0.82)}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl md:text-4xl font-black italic">82%</span>
                    <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-tighter">Attendance</span>
                  </div>
                </div>

                <div className="text-center md:text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                    <Award size={14} />
                    On Track for Semester
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">Your Attendance is <br/><span className="text-indigo-400 font-black underline decoration-indigo-500/30 underline-offset-4">Strong.</span></h2>
                  <p className="text-slate-400 text-sm max-w-xs">You've missed only 2 sessions this month. Keep it above 75% to stay eligible for exams.</p>
                </div>
              </div>
            </div>

            {/* Weekly Activity Section - Fixed & Beautiful */}
<div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
  <div className="flex items-center justify-between mb-10">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-inner">
        <TrendingUp size={20}/>
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-lg leading-none">Weekly Activity</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Attendance Trend</p>
      </div>
    </div>
    
    <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
       <div className="flex items-center gap-1.5 px-2 py-1">
         <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
         <span className="text-[9px] font-black text-slate-500 uppercase">Present</span>
       </div>
    </div>
  </div>

  {/* Chart Container - Forced Height and Flex */}
  <div className="relative h-56 w-full flex items-end justify-between gap-2 md:gap-4 px-1 pb-2">
    {/* Background Grid Lines (Optional but makes it look pro) */}
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-full border-t border-slate-900"></div>
      ))}
    </div>

    {weeklyData.map((val, i) => (
      <div key={i} className="flex-1 h-full flex flex-col items-center justify-end group">
        {/* Tooltip on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 pointer-events-none">
          {val}%
        </div>

        {/* The Pillar Track */}
        <div className="relative w-full max-w-[16px] md:max-w-[28px] h-full bg-slate-50 rounded-full border border-slate-100/50 overflow-hidden">
          {/* The Actual Data Bar */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-700 via-indigo-500 to-purple-400 rounded-full transition-all duration-1000 ease-out delay-150 group-hover:scale-x-110 group-hover:brightness-110"
            style={{ 
              height: `${val}%`,
              boxShadow: val > 0 ? '0 -4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {/* Glossy highlight effect on the bar */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Day Label */}
        <span className="mt-4 text-[11px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">
          {days[i]}
        </span>
      </div>
    ))}
  </div>
</div>
          </div>

          {/* RIGHT COLUMN (Actions & Logs) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Action Card */}
            <button
              onClick={() => navigate("/student/scanner")}
              className="group  w-full h-64 bg-indigo-600 hover:bg-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 transition-all flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-500">
                <QrCode size={120} />
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <QrCode size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black">Scan Attendance</h3>
                <p className="text-indigo-100 text-sm mt-1 flex items-center gap-2">
                  Open Camera <ArrowUpRight size={16} />
                </p>
              </div>
            </button>

            {/* Recent Logs Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 text-slate-600 rounded-lg"><CalendarDays size={20}/></div>
                  <h3 className="font-bold text-slate-800 text-lg">Recent Logs</h3>
                </div>
                <button className="text-xs font-black text-indigo-600 uppercase hover:underline">View History</button>
              </div>

              <div className="space-y-4">
                {recentAttendance.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${a.bg} ${a.color} flex items-center justify-center`}>
                        {a.status === "Present" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{a.subject}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{a.date}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${a.bg} ${a.color}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;