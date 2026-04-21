import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  Share2,
  Copy,
  Send,
  LayoutDashboard,
  ExternalLink,
  ShieldCheck // <--- MAKE SURE THIS IS HERE
} from "lucide-react";
import axios from "axios";

import api from "../../services/api";

const Session = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [attendees, setAttendees] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  // 1. Session Initialization
  useEffect(() => {
    const initSession = async () => {
      try {
        const token = localStorage.getItem("token");

        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;

         const res = await api.post("/sessions/create", {
              subject: subjectId,
              lat: latitude,
              lng: longitude
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setSession(res.data.data.session);
        });

      } catch (err) {
        fetchActiveSession();
      }
    };


    const fetchActiveSession = async () => {
      try {
        const res = await api.get("/sessions/active");
        setSession(res.data.data.session);
      } catch (err) {
        navigate("/teacher/batches");
      }
    };

    initSession();
  }, [subjectId, navigate]);

  // 2. Poll for Live Attendance
  useEffect(() => {
    if (!session?._id) return;
    const fetchAttendees = async () => {
      try {
        const res = await api.get(`/attendance/session/${session._id}`);
        setAttendees(Array.isArray(res.data.data.records) ? res.data.data.records : []);
      } catch (err) {
        console.error("Live feed error:", err);
      }
    };
    const interval = setInterval(fetchAttendees, 3000);
    return () => clearInterval(interval);
  }, [session?._id]);

  // 3. Timer Logic
  useEffect(() => {
    if (!session?.expiresAt) return;
    const timer = setInterval(() => {
      const remaining = Math.round((new Date(session.expiresAt).getTime() - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const attendanceLink = `${window.location.origin}/mark-attendance/${session?.qrToken}`;

  const copyLink = () => {
    navigator.clipboard.writeText(attendanceLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `📢 *Attendance is Live!*\n\nClass: ${session?.subject?.name || 'Current Session'}\nClick the link below to mark your attendance:\n🔗 ${attendanceLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!session) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold text-slate-600 animate-pulse">Initializing Secure Session...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">

        {/* Top Navbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-semibold mb-2"
            >
              <ArrowLeft size={18} /> End Session
            </button>
            <h1 className="text-3xl font-black text-slate-900">Live Attendance <span className="text-indigo-600">.</span></h1>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-sm border bg-white ${timeLeft === "EXPIRED" ? "border-red-200" : "border-indigo-100"}`}>
              <Clock className={timeLeft === "EXPIRED" ? "text-red-500" : "text-indigo-600"} size={20} />
              <span className={`text-2xl font-black tabular-nums ${timeLeft === "EXPIRED" ? "text-red-600" : "text-slate-800"}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: QR & Sharing */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden text-center">
              {/* Decorative background pulse */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Check-in</h2>
              <p className="text-slate-400 mb-8 font-medium">Display this QR or share the link with your students</p>

              <div className="bg-slate-50 inline-block p-6 rounded-[2.5rem] border-4 border-white shadow-inner mb-8 transition-transform hover:scale-[1.02] duration-300">
                {timeLeft !== "EXPIRED" ? (
                  <QRCode
                    value={attendanceLink}
                    size={220}
                    level="H"
                    fgColor="#1e293b"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-[220px] h-[220px] flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-3xl border-2 border-dashed border-red-200">
                    <Clock size={48} className="mb-2" />
                    <span className="font-black">SESSION ENDED</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-green-100"
                >
                  <Send size={18} /> Share to Group
                </button>
                <button
                  onClick={copyLink}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-95 border-2 ${copied ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Security Active</p>
                  <p className="font-medium text-sm">Anti-proxy & Location verification enabled</p>
                </div>
              </div>
              <ExternalLink size={20} className="opacity-50" />
            </div>
          </div>

          {/* Right Column: Stats & Logs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Stats Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <Users className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" size={40} />
              <div className="relative z-10">
                <h3 className="text-7xl font-black mb-1">{attendees.length}</h3>
                <p className="text-indigo-300 font-bold uppercase text-xs tracking-widest">Verified Attendees</p>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Live Feed */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  Live Activity <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                </h4>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Recent</span>
              </div>

              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {attendees.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                      <Users size={24} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Waiting for students to join...</p>
                  </div>
                ) : (
                  attendees.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50/50 p-4 rounded-[1.25rem] border border-transparent hover:border-indigo-100 transition-all animate-in slide-in-from-right-4 duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {a.studentId?.name?.charAt(0) || "S"}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{a.studentId?.name || "Anonymous Student"}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-100 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="text-emerald-600" size={14} />
                        <span className="text-[10px] font-black text-emerald-700 uppercase">Verified</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Session;