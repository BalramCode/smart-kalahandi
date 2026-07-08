import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Mail, RefreshCw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import api from "@/services/api";

type SessionHistoryItem = {
  _id: string;
  status: "active" | "completed";
  createdAt: string;
  expiresAt?: string;
  emailSent?: boolean;
  attendanceCount?: number;
  subject?: {
    name?: string;
    fullName?: string;
    semester?: string;
    batch?: {
      name?: string;
    };
  };
};

const getSubjectName = (session: SessionHistoryItem) =>
  session.subject?.fullName || session.subject?.name || "Attendance Session";

const getBatchLabel = (session: SessionHistoryItem) =>
  session.subject?.batch?.name || session.subject?.semester || "General";

const Sessions = () => {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await api.get("/session/history");
        setSessions(res.data?.data?.sessions || []);
      } catch (err) {
        console.error("Failed to fetch session history", err);
        toast.error("Failed to load session history");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleResendReport = async (sessionId: string) => {
    try {
      setResendingId(sessionId);
      await api.post(`/session/${sessionId}/resend-report`);
      setSessions((current) =>
        current.map((session) =>
          session._id === sessionId ? { ...session, emailSent: true } : session
        )
      );
      toast.success("Report resent to your email");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend report");
    } finally {
      setResendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Past Sessions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review completed classes and resend attendance reports.
        </p>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <Card className="rounded-lg">
            <CardContent className="p-8 text-center text-muted-foreground">
              No sessions found yet.
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => {
            const isCompleted = session.status === "completed";
            const date = new Date(session.createdAt);
            const endTime = session.expiresAt ? new Date(session.expiresAt) : null;

            return (
              <Card key={session._id} className="rounded-lg hover-lift">
                <CardContent className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground truncate">
                          {getSubjectName(session)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {isCompleted ? "Completed" : "Active"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {endTime ? ` - ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                        · {getBatchLabel(session)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:justify-end">
                    <div className="flex items-center gap-1.5 text-success">
                      <Users className="h-4 w-4" />
                      <span className="font-bold text-sm">{session.attendanceCount || 0}</span>
                    </div>
                    {isCompleted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendReport(session._id)}
                        disabled={resendingId === session._id}
                      >
                        {resendingId === session._id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        Resend Report
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sessions;
