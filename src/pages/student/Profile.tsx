import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import {
  ArrowLeft,
  User,
  Mail,
  Hash,
  GraduationCap,
  Building,
  CheckCircle2,
  XCircle,
  BarChart3,
  BookOpen
} from "lucide-react";
import FullScreenLoader from "@/components/FullScreenLoader";

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/attendance/student/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (!user) return <FullScreenLoader />;

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

  const batchName = user.batch?.name || "Not Assigned";
  const departmentName = user.department || "Computer Science and Engineering"; // Placeholder since it's missing in DB

  const totalSessions = dashboard?.total || 0;
  const sessionsAttended = dashboard?.present || 0;
  const sessionsMissed = totalSessions - sessionsAttended;
  const attendancePercentage = dashboard?.percentage || 0;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-indigo-500/30 font-sans p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Navigation & Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
          >
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Student <span className="text-indigo-400">Profile</span>
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Personal Info Card */}
          <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
            <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>

              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 relative z-10 mb-4 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center">
                  <User size={40} className="text-indigo-400" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white relative z-10">{user.name}</h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1 relative z-10">
                {user.role}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</p>
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Hash size={18} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Roll Number</p>
                  <p className="text-sm font-medium text-white truncate">{user.rollNo || "N/A"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Academic & Attendance */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">

            {/* Academic Info */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap size={18} className="text-indigo-400" />
                Academic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Batch</p>
                  <p className="font-medium text-white">{batchName}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Department</p>
                  <p className="font-medium text-white">{departmentName}</p>
                </div>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 size={18} className="text-emerald-400" />
                  Attendance Statistics
                </h3>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-white/5 rounded-2xl"></div>
                  <div className="h-24 bg-white/5 rounded-2xl"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
                      <span className="text-2xl font-black text-white">{attendancePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] ${attendancePercentage >= 75 ? 'bg-emerald-500' : attendancePercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${attendancePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                      <BookOpen size={20} className="text-blue-400 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</p>
                      <p className="text-xl font-black text-white mt-1">{totalSessions}</p>
                    </div>

                    <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                      <CheckCircle2 size={20} className="text-emerald-400 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">Attended</p>
                      <p className="text-xl font-black text-emerald-400 mt-1">{sessionsAttended}</p>
                    </div>

                    <div className="bg-rose-500/10 rounded-2xl p-4 border border-rose-500/20 flex flex-col items-center justify-center text-center">
                      <XCircle size={20} className="text-rose-400 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500/70">Missed</p>
                      <p className="text-xl font-black text-rose-400 mt-1">{sessionsMissed}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
