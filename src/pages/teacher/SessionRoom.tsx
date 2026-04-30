import React, { useState, useEffect, useRef } from "react";
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
  const [isExpired, setIsExpired] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  // NEW: Function to capture the QR and use the Device's native share menu
  const shareQRCodeImage = async () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        const padding = 40;
        const textHeight = 80;

        canvas.width = img.width + padding;
        canvas.height = img.height + padding + textHeight;

        if (ctx) {
          // Background
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 🔥 Add TEXT (TOP)
          ctx.fillStyle = "#000";
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";

          ctx.fillText("Attendance is Live!", canvas.width / 2, 30);
          ctx.font = "16px Arial";
          ctx.fillText("Scan QR to mark attendance", canvas.width / 2, 55);

          // QR Image
          ctx.drawImage(img, padding / 2, textHeight);

          // Convert to file
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png")
          );
          if (!blob) return;

          const file = new File([blob], "attendance_qr.png", {
            type: "image/png",
          });

          // Share
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
  files: [file],
  title: "Attendance QR",
  text: "Scan QR to mark attendance\nhttps://smartattendancecs.onrender.com",
});


          } else {
            alert("Sharing not supported on this device");
          }
        }
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };


  const shareAttendanceText = () => {
    if (!attendees || attendees.length === 0) {
      alert("No attendance data to share");
      return;
    }

    // 🔥 Extract session details safely
    const subjectName = session?.subject?.name || "Unknown Subject";
    const semester = session?.subject?.semester || "N/A";
    const batch = session?.subject?.batch?.name || "N/A";

    const date = new Date().toLocaleDateString();
    const sessionTime = session?.createdAt
      ? new Date(session.createdAt).toLocaleTimeString()
      : "N/A";

    // 🧾 Start building message
    let text = `*Attendance Report*\n\n`;

    text += `Attendance Report of Subject *${subjectName}*\n`;
    text += `Batch: ${batch}\n`;
    text += `Semester: ${semester}\n`;
    text += `Date: ${date}\n`;
    text += `Session Time: ${sessionTime}\n\n`;

    text += `Total Students Present: ${attendees.length}\n\n`;
    // 👨‍🎓 Student List
    attendees.forEach((rec, i) => {
      const name = rec.studentId?.name || "Student";
      const roll = rec.studentId?.rollNo || "N/A";
      const time = rec.markedAt
        ? new Date(rec.markedAt).toLocaleTimeString()
        : "N/A";

      text += `${i + 1}. ${name}\n`;
      text += `   Roll No.: ${roll}\n`;
    });
    // 📤 WhatsApp Share
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };





  // 1. Session Initialization
  // Update the initSession function inside your useEffect
  useEffect(() => {
    const initSession = async () => {
      try {
        // FIX: Pass the subjectId in the URL
        const activeRes = await api.get(`/session/active/${subjectId}`);

        if (activeRes.data?.data?.session) {
          setSession(activeRes.data.data.session);
        } else {
          alert("No session exists. Please launch from dashboard.");
          navigate(-1);
        }

      } catch (err) {
        createNewSession();
      }
    };

    const createNewSession = () => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await api.post("/session/create", {
            subject: subjectId,
            lat: latitude,
            lng: longitude
          });
          setSession(res.data.data.session);
        } catch (err) {
          console.error("Could not create session", err);
          navigate("/teacher/batches");
        }
      });
    };

    if (subjectId) initSession(); // Only run if subjectId exists
  }, [subjectId, navigate]);
  // 2. Poll for Live Attendance
  useEffect(() => {
    if (!session?._id) return;

    const fetchAttendees = async () => {
      try {
        const res = await api.get(`/attendance/session/${session._id}`);
        setAttendees(res.data.data.records || []);
      } catch (err) {
        console.error("Live feed error:", err);
      }
    };

    fetchAttendees(); // Run once immediately

    // Keep polling even if expired so late-arriving data is synced
    const interval = setInterval(fetchAttendees, 3000);
    return () => clearInterval(interval);
  }, [session?._id]);

  // 3. Timer Logic
  useEffect(() => {
    if (!session?.expiresAt) return;
    const timer = setInterval(() => {
      // Calculate remaining seconds
      const remaining = Math.round((new Date(session.expiresAt).getTime() - Date.now()) / 1000);

      if (remaining <= 0) {
        setIsExpired(true); // Trigger the "Session Ended" UI
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
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white text-center">

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {timeLeft === "EXPIRED" ? "Attendance Summary" : "Student Check-in"}
              </h2>
              <p className="text-slate-400 mb-8 font-medium">
                {timeLeft === "EXPIRED"
                  ? "This session has ended. You can still view the records below."
                  : "Display this QR or share it with your students"}
              </p>

              <div ref={qrRef} className="bg-slate-50 inline-block p-6 rounded-[2.5rem] border-4 border-white shadow-inner mb-8">
                {timeLeft !== "EXPIRED" ? (
                  <QRCode
                    value={attendanceLink}
                    size={220}
                    level="H"
                    fgColor="#1e293b"
                  />
                ) : (
                  /* Finalized Session View */
                  <div className="w-[220px] h-[220px] flex flex-col items-center justify-center text-indigo-600 bg-indigo-50 rounded-3xl border-2 border-dashed border-indigo-200 animate-in zoom-in duration-500">
                    <CheckCircle2 size={56} className="mb-3 text-emerald-500" />
                    <span className="font-black text-lg">SESSION CLOSED</span>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">Records Finalized</p>
                  </div>
                )}
              </div>

              {/* Action Buttons - Hide share buttons if expired to prevent late check-ins */}
              {timeLeft !== "EXPIRED" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={shareQRCodeImage}
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-green-100"
                  >
                    <Send size={18} /> Share Photo to WP
                  </button>
                  <button
                    onClick={copyLink}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border-2 ${copied ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-white border-slate-100 text-slate-600"
                      }`}
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              )}

              {/* NEW: Updated Expired Actions - Buttons appear side-by-side */}
              {timeLeft === "EXPIRED" && (
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </button>

                  <button
                    onClick={shareAttendanceText}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                  >
                    <Share2 size={18} /> Share Report
                  </button>
                </div>
              )}
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
                  attendees.map((record) => (
                    <div key={record._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {record.studentId?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{record.studentId?.name || "Student"}</p>
                          <p className="text-xs text-slate-400">{new Date(record.markedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <CheckCircle2 size={18} className="text-emerald-500" />
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