import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Clock } from "lucide-react";

const sessions = [
  { subject: "Data Structures", date: "Apr 14, 2026", time: "10:00 AM", students: 42, room: "Room 204" },
  { subject: "Operating Systems", date: "Apr 13, 2026", time: "11:00 AM", students: 38, room: "Room 301" },
  { subject: "Computer Networks", date: "Apr 12, 2026", time: "2:00 PM", students: 35, room: "Room 105" },
  { subject: "Database Systems", date: "Apr 11, 2026", time: "9:00 AM", students: 40, room: "Room 204" },
];

const Sessions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Past Sessions</h1>
      <div className="space-y-3">
        {sessions.map((s, i) => (
          <Card key={i} className="glass-card rounded-xl hover-lift cursor-pointer">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{s.subject}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3" /> {s.date} · {s.time} · {s.room}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-success">
                <Users className="h-4 w-4" />
                <span className="font-bold text-sm">{s.students}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
