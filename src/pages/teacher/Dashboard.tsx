import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Users, CalendarDays, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Sessions", value: "24", icon: CalendarDays, color: "text-primary" },
  { label: "Students Enrolled", value: "156", icon: Users, color: "text-success" },
  { label: "Avg. Attendance", value: "82%", icon: TrendingUp, color: "text-primary" },
];

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Manage your attendance sessions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card hover-lift rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card rounded-xl hover-lift">
        <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-pulse-ring">
            <QrCode className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Start Attendance Session</h2>
            <p className="text-sm text-muted-foreground mt-1">Generate a QR code for students to scan</p>
          </div>
          <Button
            onClick={() => navigate("/teacher/qr-session")}
            className="gradient-primary text-primary-foreground rounded-xl px-8 h-12 text-sm font-semibold hover-lift"
          >
            Start Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
