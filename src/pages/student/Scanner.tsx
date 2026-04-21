import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import {
  Camera, Upload, CheckCircle, AlertCircle,
  ArrowLeft, RefreshCw, Smartphone
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const Scanner = () => {
  const [scanResult, setScanResult] = useState<null | "SUCCESS">(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onScanSuccess = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const token = decodedText.includes('/')
      ? decodedText.split('/').pop()
      : decodedText;

    const userToken = localStorage.getItem("token");

    // 🔴 FIRST: Get location
    navigator.geolocation.getCurrentPosition(
  async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;

      // ✅ Use the centralized 'api' instance
      // No need for 'http://localhost:5000/api' or manual Headers!
      await api.post("/attendance/mark", {
        qrToken: token,
        lat: latitude,
        lng: longitude,
      });

      setScanResult("SUCCESS");
      setTimeout(() => navigate("/student/dashboard"), 1500);

    } catch (err: any) {
      // Handles 403 (Too far away), 410 (Expired), etc.
      setError(err.response?.data?.message || "Attendance failed");
      setIsProcessing(false);
    }
  },
  (err) => {
    // ❌ Geolocation blocked or failed
    setError("Location permission is required to mark attendance");
    setIsProcessing(false);
  },
  { enableHighAccuracy: true } // Added for better geofencing precision
);
  };


  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 20,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(onScanSuccess, () => { });

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const html5QrCode = new Html5Qrcode("reader");

      try {
        setError("");
        const decodedText = await html5QrCode.scanFile(imageFile, true);
        onScanSuccess(decodedText);
      } catch (err) {
        setError("No QR code detected in this image.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-4">
      {/* Background Glow Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-indigo-600/20 blur-[120px] -z-10" />

      {/* Top Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 px-2">
        <button
          onClick={() => navigate("/student/dashboard")}
          className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Scanner</p>
          <h2 className="text-lg font-bold">Attendance</h2>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Main Scanner Container */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-4 border border-slate-800 shadow-2xl relative overflow-hidden">

          {/* Success Overlay */}
          {scanResult === "SUCCESS" && (
            <div className="absolute inset-0 z-50 bg-emerald-500 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 scale-up-center">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter">SUCCESS!</h2>
              <p className="text-emerald-100 font-medium">Attendance Verified</p>
            </div>
          )}

          {/* QR Scan Area */}
          <div className="relative group">
            <div id="reader" className="overflow-hidden rounded-[2.2rem] bg-black border-4 border-slate-800 transition-all group-hover:border-indigo-500/30" />

            {/* Custom Scan Line Animation (Pure CSS) */}
            {!scanResult && !isProcessing && (
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan z-10" />
            )}

            {isProcessing && !scanResult && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-[2.2rem] z-20">
                <RefreshCw size={40} className="text-indigo-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3 p-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/40 p-3 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-shake">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-6 rounded-[2rem] cursor-pointer transition-all border border-slate-700/50 active:scale-95">
                <Upload size={24} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              <div className="flex flex-col items-center justify-center gap-2 bg-slate-800/30 py-6 rounded-[2rem] border border-slate-700/30 opacity-50">
                <Smartphone size={24} className="text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Cam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          Make sure the QR code is within the box. <br />
          Facing issues? <span className="text-indigo-400 underline underline-offset-4 cursor-pointer">Contact Support</span>
        </p>
      </div>

      {/* Custom Styles for Scanner & Animation */}
      <style>{`
        #reader__dashboard { display: none !important; }
        #reader__status_span { display: none !important; }
        #reader video { border-radius: 2rem !important; object-fit: cover !important; }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Scanner;