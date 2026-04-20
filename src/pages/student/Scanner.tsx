import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { Camera, Upload, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. Success Handler: Extract token and call backend
  const onScanSuccess = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Extract token (handling both raw token or full URL)
    const token = decodedText.includes('/') ? decodedText.split('/').pop() : decodedText;

    try {
      const userToken = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/attendance/mark",
        { qrToken: token },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      
      setScanResult("SUCCESS");
      setTimeout(() => navigate("/student/dashboard"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to mark attendance");
      setIsProcessing(false);
    }
  };

  // 2. Camera Scanner Initialization
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } }, 
      false
    );

    scanner.render(onScanSuccess, (err) => {
      // We don't alert errors here to avoid spamming the console
    });

    return () => scanner.clear();
  }, []);

  // 3. File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const imageFile = e.target.files[0];
    // Create a temporary instance for file scanning
    const html5QrCode = new Html5Qrcode("reader");

    try {
      // Clear any existing error
      setError("");
      // Scan the file
      const decodedText = await html5QrCode.scanFile(imageFile, true);
      onScanSuccess(decodedText);
    } catch (err) {
      console.error("Scan Error:", err);
      setError("QR code not detected. Please ensure the image is clear and focused.");
    } finally {
      // Always clear the instance to prevent memory leaks
      html5QrCode.clear();
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-black mb-2 text-center">Scan QR Code</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Align the QR inside the frame to mark attendance</p>

        {/* The Scanner Element */}
        <div id="reader" className="overflow-hidden rounded-2xl bg-black border-2 border-slate-700 mb-6"></div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-4 flex items-center gap-3 text-red-500 text-sm font-bold">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {scanResult === "SUCCESS" && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl mb-4 flex items-center gap-3 text-emerald-500 text-sm font-bold">
            <CheckCircle size={20} /> Attendance Marked! Redirecting...
          </div>
        )}

        {/* Upload Button Overlay */}
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl font-bold cursor-pointer transition-all">
            <Upload size={20} />
            <span>Upload from Gallery</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-400 font-bold hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;