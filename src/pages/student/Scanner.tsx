import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Upload, CheckCircle, AlertCircle,
  ArrowLeft, RefreshCw, Smartphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../services/api";
import { getInstallationId } from "@/lib/installationId";

const Scanner = () => {
  const [scanResult, setScanResult] = useState<null | "SUCCESS">(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScannerStarted, setIsScannerStarted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);
  const isStoppingRef = useRef(false);


  // Explicit Dashboard Navigation
  const goToDashboard = async () => {
    scannedRef.current = true; // 🔥 prevent scan during navigation
    await stopScanner();
    navigate("/student/dashboard");
  };

  const onScanSuccess = async (decodedText: string) => {
    if (scannedRef.current) return;   // 🔥 prevents multiple calls
    scannedRef.current = true;

    setIsProcessing(true);

    await stopScanner();

    const token = decodedText.includes('/')
      ? decodedText.split('/').pop()
      : decodedText;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude, accuracy } = pos.coords;
          const installationId = getInstallationId();

          await api.post("/attendance/mark", {
            qrToken: token,
            lat: latitude,
            lng: longitude,
            accuracy,
            device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            installationId,
          });

          setScanResult("SUCCESS");

          setTimeout(() => {
            navigate("/student/dashboard");
          }, 1200);

        } catch (err: any) {
          const message = err.response?.data?.message || "Attendance failed";
          const status = err.response?.status;

          // Device-already-used: show a toast and do NOT allow retry
          if (status === 409) {
            toast.error(message);
          }

          setError(message);
          setIsProcessing(false);
          scannedRef.current = false;   // 🔥 allow retry
          // setTimeout(() => {
          //   startScanner();
          // }, 2000); // ⏱️ 2 seconds delay
        }
      },
      () => {
        setError("Location permission is required");
        setIsProcessing(false);
        scannedRef.current = false;
        setTimeout(() => {
          startScanner();
        }, 2000); // ⏱️ 2 seconds delay
      },
      { enableHighAccuracy: true }
    );
  };



  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }

      if (!scannerRef.current.isScanning) {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          () => { }
        );
        setIsScannerStarted(true);
        setError("");
      }
    } catch (err) {
      setError("Camera access denied or not found.");
      setIsScannerStarted(false);
    }
  };

  const stopScanner = async () => {
    if (isStoppingRef.current) return; // 🔥 prevent double stop
    isStoppingRef.current = true;

    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear(); // 🔥 required
      }
    } catch (err) {
      console.warn("Scanner already stopped", err);
    } finally {
      setIsScannerStarted(false);
      isStoppingRef.current = false; // 🔥 reset
    }
  };



  useEffect(() => {
  // We only want the cleanup (stop) logic here.
  // Do NOT call startScanner() on mount.
  return () => {
    stopScanner();
  };
}, []);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await stopScanner(); // 🔥 stop camera first

      const html5QrCode = new Html5Qrcode("reader");

      try {
        setError("");
        const decodedText = await html5QrCode.scanFile(e.target.files[0], true);
        onScanSuccess(decodedText);
      } catch (err) {
        setError("No QR code found in image.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center p-6 font-sans">
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />

      {/* Updated Header with Real Text Navigation */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-8 mt-4">
        <button
          onClick={goToDashboard}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group w-fit"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide">Back to Dashboard</span>
        </button>

        <div className="flex justify-between items-end px-1">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic">Scanner</h1>
            <p className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] font-bold">Attendance System</p>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
            <div className={`h-2 w-2 rounded-full animate-pulse ${isScannerStarted ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {scanResult === "SUCCESS" && (
          <div className="absolute inset-0 z-50 bg-emerald-600 rounded-[2.5rem] flex flex-col items-center justify-center animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <CheckCircle size={80} className="mb-4 animate-bounce" />
            <h2 className="text-2xl font-black italic">SUCCESSFUL!</h2>
            <p className="text-emerald-100 opacity-80 text-sm">Redirecting to home...</p>
          </div>
        )}

        {/* Main Interface Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[3rem] p-6 shadow-2xl overflow-hidden relative">

          {/* Glass Overlay for scanner */}
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-950 group border border-white/10">
  <div id="reader" className="w-full h-full" />

  {/* 1. Idle State: Show this when nothing is happening */}
  {!isScannerStarted && !isProcessing && (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8 text-center bg-slate-950">
      <div className="mb-6 p-4 bg-indigo-500/10 rounded-full">
        <Smartphone size={40} className="text-indigo-400 opacity-50" />
      </div>
      <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">
        Ready to Scan
      </h3>
      <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-tight">
        Tap <span className="text-indigo-400">"Open Camera"</span> to scan QR <br /> 
        or <span className="text-indigo-400">"From Gallery"</span> to upload
      </p>
      
      {/* Decorative corners for the 'target' look */}
      <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-white/10 rounded-tl-xl" />
      <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-white/10 rounded-tr-xl" />
      <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-white/10 rounded-bl-xl" />
      <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-white/10 rounded-br-xl" />
    </div>
  )}

  {/* 2. Active Scanning State */}
  {isScannerStarted && !isProcessing && (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_#818cf8] animate-scan-move" />
      <div className="absolute inset-10 border border-white/10 rounded-3xl opacity-20" />
    </div>
  )}

  {/* 3. Processing State */}
  {isProcessing && (
    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
      <div className="relative">
        <RefreshCw size={56} className="text-indigo-500 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse" />
      </div>
      <p className="mt-6 text-xs font-black tracking-[0.4em] text-white">VALIDATING</p>
    </div>
  )}
</div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <label className="flex flex-col items-center justify-center gap-3 bg-slate-800/40 hover:bg-slate-800/60 py-6 rounded-[2rem] border border-white/5 cursor-pointer transition-all active:scale-95 group">
              <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
                <Upload size={24} className="text-indigo-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">From Gallery</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>

            <button
              onClick={isScannerStarted ? stopScanner : startScanner}
              className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[2rem] border transition-all active:scale-95 group ${isScannerStarted
                ? 'bg-red-500/5 border-red-500/10 text-red-400'
                : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                }`}
            >
              <div className={`p-3 rounded-2xl transition-colors ${isScannerStarted ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                <Smartphone size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isScannerStarted ? "Close Camera" : "Open Camera"}
              </span>
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-[11px] font-bold animate-shake">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mt-10 bg-white/5 p-5 rounded-3xl border border-white/5">
          <p className="text-center text-slate-400 text-[11px] leading-relaxed italic">
            Keep the QR code steady inside the scanner frame for instant recognition.
          </p>
        </div>
      </div>

      <style>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        @keyframes scan-move {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(350px); opacity: 0; }
        }
        .animate-scan-move {
          animation: scan-move 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
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