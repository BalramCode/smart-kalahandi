import React from "react";
import { useEffect, useState } from "react";
import api from "@/services/api";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  QrCode, LogOut, Bell, User,
  ArrowUpRight, CheckCircle2, XCircle, Clock,
  Zap, BarChart3
} from "lucide-react";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/attendance/student/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* 1. Global Navigation - Responsive Name */}
      <nav className="sticky top-0 z-[100] bg-[#0F172A]/80 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center">
                <User size={16} className="text-indigo-400" />
              </div>
            </div>
            {/* Name stays visible on mobile now */}
            <div className="flex flex-col">
              <h2 className="text-xs md:text-sm font-bold text-white tracking-tight truncate max-w-[120px] md:max-w-none">
                {user?.name || "Balram Naik"}
              </h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{user?.rollNo || "MMU Student"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
              <Bell size={18} className="text-slate-400" />
            </button>
            <button
              onClick={logout}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl border border-rose-500/20 transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>
      {loading && (
        <div className="text-center text-slate-400 text-sm mb-4">
          Loading dashboard...
        </div>
      )}

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* LEFT: Main Controls */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <header>
              <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                Smart <span className="text-indigo-400">Attendance.</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-slate-500 text-sm mt-2 font-medium">
                Real-time tracking for the current academic session.
              </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Check-In Action */}
              <motion.button
                variants={itemVariants}
                onClick={() => navigate("/student/scanner")}
                className="relative overflow-hidden bg-indigo-600 rounded-[2rem] p-6 text-left group transition-all active:scale-95"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <QrCode size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Check-In</h3>
                  <p className="text-indigo-100/70 text-xs font-medium">Scan QR to mark present</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                  <Zap size={80} strokeWidth={1} />
                </div>
              </motion.button>

              {/* Avg Attendance Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg. Attendance</span>
                  <BarChart3 size={16} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-4xl font-black text-white italic">
                    {loading ? "--" : `${dashboard?.percentage?.toFixed(1) || 0}%`}
                  </h4>

                  <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                      style={{ width: `${dashboard?.percentage || 0}%` }}
                    />

                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Live History */}
          <div className="lg:col-span-4">
            <motion.div
              variants={itemVariants}
              className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Live Logs</h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="text-xs text-slate-400">Loading...</p>
                ) : !dashboard?.logs || dashboard.logs.length === 0 ? (
                  <p className="text-xs text-slate-400">No attendance yet</p>
                ) : (
                  dashboard?.logs?.map((log: any) => (
                    <div
                      key={log._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.status === "present"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                          }`}
                      >
                        {log.status === "present" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {log.sessionId?.subject?.name || "Unknown Subject"}

                        </p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">
                          {new Date(log.markedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}

              </div>

              <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                Full Records
              </button>
            </motion.div>
          </div>

        </div>
      </motion.main>
    </div>
  );
};

export default StudentDashboard;