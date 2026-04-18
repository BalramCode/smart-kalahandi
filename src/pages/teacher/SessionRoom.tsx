import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { 
  ArrowLeft, 
  Share2, 
  Users, 
  Clock, 
  CheckCircle2, 
  Copy, 
  MessageCircle, 
  Download,
  ShieldCheck
} from "lucide-react";

const Session = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // The link students will scan (adjust to your production domain)
  const attendanceLink = `https://your-app.com/mark-attendance/${sessionId}`;

  // Simulate real-time attendance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAttendeeCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(attendanceLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(`Class is live! Scan this QR or click the link to mark your attendance: ${attendanceLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="w-full h-full flex-1 p-6 md:p-10 bg-slate-50/50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">End Session</span>
        </button>
        
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 animate-pulse">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-bold uppercase tracking-wider">Live Session</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: QR Code Hero Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-indigo-100 border border-slate-100 text-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 -mr-16 -mt-16"></div>
            
            <h2 className="text-3xl font-black text-slate-800 mb-2">Scan for Attendance</h2>
            <p className="text-slate-500 mb-10">Students should point their camera at this screen</p>

            <div className="inline-block p-6 bg-white rounded-3xl shadow-2xl border-4 border-slate-50 mb-10 group transition-transform hover:scale-105">
              <QRCode 
                value={attendanceLink} 
                size={220}
                level="H"
                className="rounded-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={shareToWhatsApp}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
              >
                <MessageCircle size={20} />
                Share to WhatsApp
              </button>
              
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
              >
                {isCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                {isCopied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Session Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-wrap gap-8 justify-center md:justify-start">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Clock size={20}/></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Started At</p>
                  <p className="font-bold text-slate-700">10:45 AM</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><ShieldCheck size={20}/></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Security</p>
                  <p className="font-bold text-slate-700">Dynamic QR</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Real-time Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl">
            <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Users size={28} />
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">Real-time</span>
            </div>
            <h3 className="text-5xl font-black mb-2">{attendeeCount}</h3>
            <p className="text-indigo-100 font-medium">Students marked present</p>
            
            <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min((attendeeCount / 50) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="mt-3 text-xs text-indigo-200">Goal: 50 Students</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 px-2">Recent Joins</h4>
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400 text-xs">
                      UN
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Student ID: ...{230 + i}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Just now</p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Session;