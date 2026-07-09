import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, GraduationCap, ArrowLeft, Layout } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";

const Semesters = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const [batchName, setBatchName] = useState("");

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await api.get(`/batches/${batchId}`);
        setBatchName(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };

    if (batchId) fetchBatch();
  }, [batchId]);

  // Clean data structure
  const semesters = [
    { id: "sem1", name: "Semester 1" },
    { id: "sem2", name: "Semester 2" },
    { id: "sem3", name: "Semester 3" },
    { id: "sem4", name: "Semester 4" },
    { id: "sem5", name: "Semester 5" },
    { id: "sem6", name: "Semester 6" },
  ];

  return (
    <div className="w-full h-full flex-1 p-6 md:p-10 bg-slate-50/50 overflow-y-auto">
      {/* Top Navigation / Breadcrumbs */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Batches</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
            <GraduationCap size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Semesters</h1>
        </div>
        <p className="text-sm text-slate-500">
          Managing curriculum for{" "}
          <span className="font-semibold text-slate-700">
            Batch {batchName || "Loading..."}
          </span>
        </p>
      </div>

      {/* Stylish, Medium-Sized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {semesters.map((sem) => (
          <div
            key={sem.id}
            onClick={() => navigate(`/teacher/batches/${batchId}/${sem.id}`)}
            className="group relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px]"
          >
            {/* Subtle top-right decorative accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full transition-all duration-300 group-hover:scale-110" />

            {/* Icon Block */}
            <div className="p-2.5 w-10 h-10 bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-xl transition-all duration-300 flex items-center justify-center">
              <Layout size={20} />
            </div>

            {/* Title and Arrow Action */}
            <div className="flex items-end justify-between mt-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {sem.name}
                </h2>
                <span className="text-xs text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Modules →
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Semesters;