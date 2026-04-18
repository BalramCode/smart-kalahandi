import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  LayoutDashboard, 
  RefreshCcw, 
  ShieldCheck, 
  Zap,
  RotateCcw,
  Info
} from "lucide-react";

const StudentScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [scanState, setScanState] = useState("scanning");
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);

  // 1. Real Camera Initialization
  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } // Prefer back camera on mobile
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasCameraError(true);
      }
    }

    if (scanState === "scanning") {
      enableCamera();
    }

    return () => {
      // Cleanup: Stop the camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [scanState]);

  const handleScanSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setScanState("success");
    }, 1800);
  };

  if (scanState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-emerald-100 text-center animate-in zoom-in duration-500">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-emerald-500 text-white p-6 rounded-full shadow-lg">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-8">Attendance Set!</h1>
          <p className="text-slate-500 mt-3 leading-relaxed">
            Your presence has been verified and synced with the university portal.
          </p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mt-10 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
          >
            <LayoutDashboard size={20} />
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Dynamic Background Blur */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-10 relative z-10">
        
        {/* Left Side: Instructions (Hidden on small mobile, visible on Tablet/PC) */}
        <div className="hidden lg:flex flex-col flex-1 text-white space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-w-xs">
            <ShieldCheck className="text-indigo-400 mb-4" size={32} />
            <h2 className="text-xl font-bold">Secure Verification</h2>
            <p className="text-slate-300 text-sm mt-2">We use encrypted dynamic QR codes to ensure your attendance is valid and tamper-proof.</p>
          </div>
          <div className="flex items-start gap-4 p-4 text-slate-400 italic">
            <Info size={20} className="mt-1" />
            <p className="text-sm">Make sure the QR code is well-lit and fits within the square frame.</p>
          </div>
        </div>

        {/* Right Side: The Scanner UI */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-2xl p-6 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight">Scanner live</h1>
            <p className="text-slate-400 text-sm mt-1">Ready to sync your session</p>
          </div>

          {/* Real Video Viewport */}
          <div className="relative group w-full aspect-square md:w-80 md:h-80 bg-black rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-inner">
            
            {hasCameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800">
                <XCircle size={40} className="text-rose-500 mb-2" />
                <p className="text-white text-xs font-bold">Camera Access Denied</p>
                <p className="text-slate-400 text-[10px] mt-1">Check your browser permissions</p>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
              />
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>
            
            {/* Scanning Line */}
            {scanState === "scanning" && !isProcessing && (
              <div className="absolute top-0 left-0 w-full h-full z-20">
                <div className="w-full h-1 bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,1)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
              </div>
            )}

            {/* Corner Bracket Decorations */}
            <div className="absolute inset-10 border border-white/10 rounded-3xl pointer-events-none"></div>
            <div className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-indigo-500 rounded-br-xl pointer-events-none"></div>

            {isProcessing && (
              <div className="absolute inset-0 z-30 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                  <RefreshCcw className="animate-spin text-indigo-600" size={20} />
                  <span className="font-bold text-sm text-indigo-900">Verifying...</span>
                </div>
              </div>
            )}
          </div>

          {/* Responsive Controls */}
          <div className="w-full mt-10 space-y-3">
            <button
              onClick={handleScanSimulation}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap size={20} />
              Simulate Scan
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
            >
              <RotateCcw size={14} />
              Retry Camera
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default StudentScanner;