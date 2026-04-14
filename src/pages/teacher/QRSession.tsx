import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, BookOpen, MapPin, User } from "lucide-react";

const MOCK_STUDENTS = [
  { name: "Rahul Patel", time: "10:02 AM" },
  { name: "Priya Singh", time: "10:03 AM" },
  { name: "Amit Kumar", time: "10:04 AM" },
  { name: "Sneha Das", time: "10:05 AM" },
];

const QRSession = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);
  const [attended, setAttended] = useState<typeof MOCK_STUDENTS>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive) return;
    const delays = [2000, 5000, 9000, 14000];
    const timers = MOCK_STUDENTS.map((s, i) =>
      setTimeout(() => setAttended((prev) => [...prev, s]), delays[i])
    );
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  const endSession = useCallback(() => {
    setIsActive(false);
    navigate("/teacher/sessions");
  }, [navigate]);

  const pct = (timeLeft / 30) * 100;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Live Session</h1>

      {/* Session Info */}
      <Card className="glass-card rounded-xl">
        <CardContent className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { icon: BookOpen, label: "Subject", value: "Data Structures" },
            { icon: User, label: "Faculty", value: user?.name || "Teacher" },
            { icon: MapPin, label: "Room", value: "Room 204 · MMU" },
            { icon: Clock, label: "Time", value: "10:00 – 11:00 AM" },
          ].map((info) => (
            <div key={info.label} className="flex items-start gap-2">
              <info.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{info.label}</p>
                <p className="font-medium text-foreground">{info.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* QR + Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card rounded-xl">
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <div className="w-48 h-48 bg-foreground rounded-2xl flex items-center justify-center">
              {/* Mock QR pattern */}
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <rect fill="hsl(var(--foreground))" width="100" height="100" rx="4" />
                {[0,1,2,3,4,5,6].map(r =>
                  [0,1,2,3,4,5,6].map(c => {
                    const filled = Math.random() > 0.35;
                    return filled ? (
                      <rect key={`${r}-${c}`} x={14+c*10} y={14+r*10} width="8" height="8" rx="1" fill="hsl(var(--background))" />
                    ) : null;
                  })
                )}
                <rect x="10" y="10" width="22" height="22" rx="3" fill="none" stroke="hsl(var(--background))" strokeWidth="3" />
                <rect x="68" y="10" width="22" height="22" rx="3" fill="none" stroke="hsl(var(--background))" strokeWidth="3" />
                <rect x="10" y="68" width="22" height="22" rx="3" fill="none" stroke="hsl(var(--background))" strokeWidth="3" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">Students scan this QR to mark attendance</p>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-xl">
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke={timeLeft > 10 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${timeLeft > 10 ? "text-foreground" : "text-destructive"}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-success">
              <Users className="h-5 w-5" />
              <span className="text-lg font-bold">{attended.length}</span>
              <span className="text-sm text-muted-foreground">attended</span>
            </div>

            <Button onClick={endSession} variant="destructive" className="w-full rounded-xl h-11">
              End Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Attended List */}
      {attended.length > 0 && (
        <Card className="glass-card rounded-xl animate-fade-in">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-3">Students Attended</h3>
            <div className="space-y-2">
              {attended.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {s.name[0]}
                    </div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRSession;
