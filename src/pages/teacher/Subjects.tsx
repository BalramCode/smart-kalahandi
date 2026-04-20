import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, BookOpen, PlayCircle, MoreVertical } from "lucide-react";
import axios from "axios";

const Subjects = () => {
  const navigate = useNavigate();
  const { batchId, semId } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", fullName: "" });


  const handleLaunchSession = (id) => {
    navigate(`/teacher/session/${id}`);
  };
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/subjects/${batchId}/${semId}`);
        setSubjects(res.data);
      } catch (err) {
        console.error("Error loading subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [batchId, semId]);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/subjects", {
        name: newSubject.name.toUpperCase(),
        fullName: newSubject.fullName,
        batch: batchId,
        semester: semId
      });
      setSubjects([...subjects, res.data]);
      setNewSubject({ name: "", fullName: "" });
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving subject.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400 animate-pulse">Loading Academy...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Sleek Header */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all text-sm font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Semesters
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Subjects <span className="text-indigo-600">.</span>
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 w-fit px-3 py-1 rounded-full">
            <span>Batch {batchId.slice(-4)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{semId}</span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Interactive Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {subjects.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <BookOpen size={32} />
            </div>
            <p className="text-slate-400 font-medium">Empty curriculum. Start by adding a subject.</p>
          </div>
        ) : (
          subjects.map((sub) => (
            <div
              key={sub._id}
              className="group relative bg-white border border-slate-200/60 p-5 rounded-[1.5rem] transition-all duration-300 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg`}>
                    <BookOpen size={20} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-500 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {sub.name}
                </h2>
                <p className="text-slate-400 text-xs font-medium mt-1 line-clamp-1">
                  {sub.fullName}
                </p>
              </div>

              <button
  onClick={() => handleLaunchSession(sub._id)}
  className="relative z-10 mt-6 w-full py-2.5 bg-slate-50 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
>
  <PlayCircle size={16} />
  <span>Launch Session</span>
</button>
            </div>
          ))
        )}
      </div>

      {/* Modern Centered Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Add Subject</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="p-8 pt-2">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2 block ml-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Python"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2 block ml-1">Full Title</label>
                  <input
                    type="text"
                    placeholder="e.g. OpenCV"
                    value={newSubject.fullName}
                    onChange={(e) => setNewSubject({ ...newSubject, fullName: e.target.value })}
                    className="w-full bg-slate-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                Create Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;