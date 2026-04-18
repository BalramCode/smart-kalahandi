import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, GraduationCap, BookOpen, Clock, ArrowLeft } from "lucide-react";

const Semesters = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const semesters = [
    { id: "sem1", name: "Semester 1", subjects: 6, status: "Completed" },
    { id: "sem2", name: "Semester 2", subjects: 5, status: "Completed" },
    { id: "sem3", name: "Semester 3", subjects: 6, status: "In Progress" },
    { id: "sem4", name: "Semester 4", subjects: 5, status: "Upcoming" },
    { id: "sem5", name: "Semester 5", subjects: 4, status: "Upcoming" },
    { id: "sem6", name: "Semester 6", subjects: 4, status: "Upcoming" },
  ];

  return (
    <div className="w-full h-full flex-1 p-6 md:p-10 bg-slate-50/50 overflow-y-auto">
      {/* Top Navigation / Breadcrumbs */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Batches</span>
      </button>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Semesters</h1>
        </div>
        <p className="text-slate-500">
          Managing curriculum for <span className="font-semibold text-slate-700">Batch {batchId}</span>
        </p>
      </div>

      {/* Modern Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesters.map((sem) => (
          <div
            key={sem.id}
            onClick={() => navigate(`/teacher/batches/${batchId}/${sem.id}`)}
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-colors">
                <BookOpen size={24} />
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                sem.status === "In Progress" ? "bg-amber-100 text-amber-600" : 
                sem.status === "Completed" ? "bg-emerald-100 text-emerald-600" : 
                "bg-slate-100 text-slate-500"
              }`}>
                {sem.status}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-1">{sem.name}</h2>
            
            <div className="flex items-center gap-3 text-slate-500 text-sm mb-6">
              <span className="flex items-center gap-1">
                <Clock size={14} /> 4 Months
              </span>
              <span>•</span>
              <span>{sem.subjects} Subjects</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex -space-x-2">
                {/* Visual "Student" Bubbles placeholder */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  +30
                </div>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Subtle Progress Bar for "In Progress" semester */}
            {sem.status === "In Progress" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 overflow-hidden rounded-b-2xl">
                <div className="h-full bg-indigo-500 w-1/2 animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Semesters;