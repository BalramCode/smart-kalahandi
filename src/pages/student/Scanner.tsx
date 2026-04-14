import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CollegeBranding from "@/components/CollegeBranding";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, XCircle, LayoutDashboard } from "lucide-react";

type ScanState = "scanning" | "success" | "error";

const Scanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("scanning");

  const simulateScan = () => {
    setScanState("success");
  };

  const simulateError = () => {
    setScanState("error");
    setTimeout(() => setScanState("scanning"), 3000);
  };

  if (scanState === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-bg">
        <div className="animate-check-bounce">
          <CheckCircle2 className="h-24 w-24 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-6">Attendance Marked!</h1>
        <p className="text-muted-foreground mt-2 text-center">
          Successfully recorded for {user?.name}
        </p>
        <Button
          onClick={() => navigate("/student/dashboard")}
          className="mt-8 gradient-primary text-primary-foreground rounded-xl px-8 h-11"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          View Dashboard
        </Button>
      </div>
    );
  }

  if (scanState === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-bg">
        <div className="animate-check-bounce">
          <XCircle className="h-24 w-24 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-6">Session Expired</h1>
        <p className="text-muted-foreground mt-2">Please try again with an active QR code</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-6 animate-fade-in relative">
        <CollegeBranding size="sm" />

        <h1 className="text-xl font-bold text-foreground text-center">Scan QR to Mark Attendance</h1>

        {/* Scanner Frame */}
        <div className="relative w-72 h-72 rounded-2xl border-2 border-primary/30 overflow-hidden bg-foreground/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-16 w-16 text-muted-foreground/30" />
          </div>
          {/* Scanning line animation */}
          <div className="absolute left-2 right-2 h-0.5 bg-primary/60 rounded-full animate-bounce" style={{ top: "50%" }} />
          {/* Corner decorations */}
          {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 right-0 rotate-180", "bottom-0 left-0 -rotate-90"].map((pos, i) => (
            <div key={i} className={`absolute ${pos}`}>
              <div className="w-8 h-8 border-l-3 border-t-3 border-primary rounded-tl-lg" style={{ borderWidth: "3px 0 0 3px" }} />
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Point your camera at the QR code displayed by your teacher
        </p>

        <div className="flex gap-3 w-full">
          <Button onClick={simulateScan} className="flex-1 gradient-primary text-primary-foreground rounded-xl h-11 hover-lift">
            Simulate Scan
          </Button>
          <Button onClick={simulateError} variant="outline" className="flex-1 rounded-xl h-11">
            Test Error
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/student/dashboard")}
          className="text-muted-foreground text-sm"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Scanner;
