import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CollegeBranding from "@/components/CollegeBranding";
import { QrCode, TrendingUp, CalendarDays, LogOut, CheckCircle2 } from "lucide-react";

const recentAttendance = [
  { subject: "Data Structures", date: "Apr 14, 2026", status: "Present" },
  { subject: "Operating Systems", date: "Apr 13, 2026", status: "Present" },
  { subject: "Computer Networks", date: "Apr 12, 2026", status: "Absent" },
  { subject: "Database Systems", date: "Apr 11, 2026", status: "Present" },
  { subject: "Software Engineering", date: "Apr 10, 2026", status: "Present" },
];

const weeklyData = [65, 80, 72, 90, 85, 78, 88];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{user?.name}</h1>
          <p className="text-xs text-muted-foreground">{user?.department} · MMU</p>
        </div>
        <div className="flex items-center gap-2">
          <CollegeBranding size="sm" />
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-5 animate-fade-in">
        {/* Attendance Percentage */}
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardContent className="p-6 text-center">
            <div className="relative inline-flex">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - 0.82)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">82%</span>
                <span className="text-[10px] text-muted-foreground">attendance</span>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground mt-3">Overall Attendance</p>
            <p className="text-xs text-muted-foreground">{user?.department}</p>
          </CardContent>
        </Card>

        {/* Quick Scan */}
        <Button
          onClick={() => navigate("/student/scanner")}
          className="w-full gradient-primary text-primary-foreground rounded-xl h-12 font-semibold hover-lift"
        >
          <QrCode className="mr-2 h-5 w-5" />
          Scan QR Code
        </Button>

        {/* Weekly Chart */}
        <Card className="glass-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Weekly Trend</h3>
            </div>
            <div className="flex items-end justify-between gap-1 h-24">
              {weeklyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all duration-500 gradient-primary"
                    style={{ height: `${val}%`, animationDelay: `${i * 100}ms` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card className="glass-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Recent Attendance</h3>
            </div>
            <div className="space-y-2">
              {recentAttendance.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.subject}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${a.status === "Present" ? "text-success" : "text-destructive"}`}>
                    {a.status === "Present" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    {a.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
