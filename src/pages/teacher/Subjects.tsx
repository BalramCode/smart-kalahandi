import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, BookOpen, PlayCircle, MoreVertical, Users, User } from "lucide-react"; // Added User icon
import api from "../../services/api";

interface TeacherRef {
  _id: string;
  name: string;
  email?: string;
}

interface Subject {
  _id: string;
  name: string;
  fullName: string;
  teacher?: TeacherRef | string | null;
}

interface ActiveSession {
  _id: string;
  teacherId?: TeacherRef | string | null;
}

const Subjects = () => {
  const navigate = useNavigate();
  const { batchId, semId } = useParams();

  // State Management
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", fullName: "" });
  const [activeSessions, setActiveSessions] = useState<{ [key: string]: ActiveSession | null }>({});
  const [checkingSessions, setCheckingSessions] = useState(true);

  const getTeacherName = (subject: Subject, session?: ActiveSession | null) => {
    if (subject.teacher && typeof subject.teacher === "object" && subject.teacher.name) {
      return subject.teacher.name;
    }

    if (session?.teacherId && typeof session.teacherId === "object" && session.teacherId.name) {
      return session.teacherId.name;
    }

    return "Unassigned";
  };

  // Load Subjects and their Session Statuses
  useEffect(() => {
    const fetchData = async () => {
      setCheckingSessions(true);
      try {
        const res = await api.get(`/subjects/${batchId}/${semId}`);
        const subjectsData = res.data;
        setSubjects(subjectsData);

        const sessions: { [key: string]: ActiveSession | null } = {};
        await Promise.all(
          subjectsData.map(async (sub: any) => {
            try {
              const statusRes = await api.get(`/session/active/${sub._id}`);
              sessions[sub._id] = statusRes.data?.data?.session || null;
            } catch (e) {
              sessions[sub._id] = null;
            }
          })
        );
        setActiveSessions(sessions);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setCheckingSessions(false);
        setLoading(false);
      }
    };
    fetchData();
  }, [batchId, semId]);

  const handleLaunchSession = async (id: string) => {
    try {
      const res = await api.get(`/session/active/${id}`);
      if (res.data?.data?.session) {
        navigate(`/teacher/session/${id}`);
      } else {
        const createRes = await api.post("/session/create", { subject: id });
        if (createRes.data?.data?.session) {
          navigate(`/teacher/session/${id}`);
        }
      }
    } catch (err) {
      console.error("Launch failed", err);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/subjects", {
        name: newSubject.name.toUpperCase(),
        fullName: newSubject.fullName,
        batch: batchId,
        semester: semId,
      });
      setSubjects([...subjects, res.data]);
      setNewSubject({ name: "", fullName: "" });
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving subject.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Accessing Ledger...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans antialiased">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200" />
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Academic <span className="text-indigo-600">Ledger</span></h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            <span>New Subject</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Ledger Column Labels */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
          <div className="col-span-3">Professor</div>
          <div className="col-span-3 border-l pl-4">Subject</div>
          <div className="col-span-3 border-l pl-4">Topic</div>
          <div className="col-span-3 text-right">Status / Action</div>
        </div>

        {/* Ledger Rows */}
        <div className="space-y-2">
          {subjects.length === 0 ? (
            <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
              <BookOpen size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm font-medium">The ledger is empty. Add a subject to begin.</p>
            </div>
          ) : (
            subjects.map((sub, index) => {
              const activeSession = activeSessions[sub._id];
              const hasSession = !!activeSession;
              const teacherName = getTeacherName(sub, activeSession);
              return (
                <div
                  key={sub._id}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border border-slate-200/60 p-4 md:p-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:border-indigo-200 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Column 1: Teacher */}
                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasSession ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <User size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate">{teacherName}</span>
                  </div>

                  {/* Column 2: Subject */}
                  <div className="md:col-span-3 md:border-l border-slate-100 md:pl-4">
                    <label className="md:hidden text-[9px] font-bold text-slate-400 uppercase mb-1 block">Subject</label>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{sub.name}</span>
                  </div>

                  {/* Column 3: Topic */}
                  <div className="md:col-span-3 md:border-l border-slate-100 md:pl-4">
                    <label className="md:hidden text-[9px] font-bold text-slate-400 uppercase mb-1 block">Title</label>
                    <span className="text-xs text-slate-500 font-medium line-clamp-1">{sub.fullName}</span>
                  </div>

                  {/* Column 4: Actions */}
                  <div className="md:col-span-3 flex items-center justify-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <button
                      onClick={() => handleLaunchSession(sub._id)}
                      className={`flex-grow md:flex-grow-0 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${hasSession
                          ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          : "bg-slate-900 text-white hover:bg-indigo-600 shadow-md"
                        }`}
                    >
                      {hasSession ? <Users size={14} /> : <PlayCircle size={14} />}
                      {hasSession ? "See Attendance" : "Create Session"}
                    </button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Darker, sharper overlay to fix the "blurry" look */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-[360px] rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center bg-white border-b border-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">New Subject</h3>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Academic Entry</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddSubject} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Subject
                </label>
                <input
                  placeholder="e.g. CS101"
                  className="w-full bg-slate-50/50 px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold uppercase transition-all placeholder:text-slate-300"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Topic Title
                </label>
                <input
                  placeholder="e.g. Advanced Algorithms"
                  className="w-full bg-slate-50/50 px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-medium transition-all placeholder:text-slate-300"
                  value={newSubject.fullName}
                  onChange={(e) => setNewSubject({ ...newSubject, fullName: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full group mt-2 relative py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Commit to Ledger</span>
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
