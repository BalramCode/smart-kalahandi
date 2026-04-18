import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Database, 
  Cpu, 
  BrainCircuit, 
  PlayCircle, 
  Layout, 
  Plus,
  X,
  BookOpen
} from "lucide-react";

const Subjects = () => {
  const navigate = useNavigate();
  const { batchId, semId } = useParams();

  // 1. State for managing subjects list
  const [subjects, setSubjects] = useState([
    { 
      id: "dbms", 
      name: "DBMS", 
      fullName: "Database Management Systems", 
      icon: <Database size={24} />, 
      color: "from-blue-500 to-indigo-600" 
    },
    { 
      id: "os", 
      name: "Operating System", 
      fullName: "Kernel & Process Management", 
      icon: <Cpu size={24} />, 
      color: "from-purple-500 to-pink-600" 
    },
  ]);

  // 2. State for the Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", fullName: "" });

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.fullName) return;

    const subjectEntry = {
      id: newSubject.name.toLowerCase().replace(/\s+/g, '-'),
      name: newSubject.name,
      fullName: newSubject.fullName,
      icon: <BookOpen size={24} />, // Default icon for new entries
      color: "from-slate-700 to-slate-900" // Sophisticated dark theme for new items
    };

    setSubjects([...subjects, subjectEntry]);
    setNewSubject({ name: "", fullName: "" }); // Reset form
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="w-full h-full flex-1 p-6 md:p-10 bg-slate-50/50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-4"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Semesters</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subjects</h1>
          <p className="text-slate-500">
            Batch {batchId} <span className="mx-2 text-slate-300">/</span> {semId.toUpperCase()}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            <div className="p-8">
              <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${sub.color} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                {sub.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{sub.name}</h2>
              <p className="text-slate-400 text-sm">{sub.fullName}</p>
            </div>

            <div className="mt-auto p-6 bg-slate-50/30 border-t border-slate-50">
              <button
                onClick={() => navigate(`/teacher/session/${Date.now()}`)}
                className="w-full bg-white hover:bg-indigo-600 text-slate-700 hover:text-white py-3.5 rounded-xl border border-slate-200 hover:border-indigo-600 font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <PlayCircle size={18} />
                <span>Start Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">New Subject</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Short Name</label>
                  <input
                    type="text"
                    placeholder="e.g. OS, DBMS, AI"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Subject Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Operating Systems"
                    value={newSubject.fullName}
                    onChange={(e) => setNewSubject({...newSubject, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;