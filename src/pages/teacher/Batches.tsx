import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Calendar, Users, X } from "lucide-react";

const Batches = () => {
  const navigate = useNavigate();
  
  // 1. Move batches to state so we can add to it dynamically
  const [batches, setBatches] = useState([
    { id: "1", name: "2024–2027", students: 45 },
    { id: "2", name: "2025–2028", students: 38 },
  ]);

  // 2. Modal state and form inputs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const handleAddBatch = (e) => {
    e.preventDefault();
    if (!startYear || !endYear) return;

    const newBatch = {
      id: Date.now().toString(), // Simple unique ID
      name: `${startYear}–${endYear}`,
      students: 0, // New batches start with 0 students
    };

    setBatches([...batches, newBatch]);
    setStartYear("");
    setEndYear("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Your Batches</h1>
          <p className="text-slate-500 mt-1">Manage your classes and student groups.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-lg active:scale-95"
        >
          <Plus size={20} />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Grid Layout */}
      {batches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <FolderOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No batches yet</h3>
          <p className="text-slate-500">Create your first batch to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.id}
              onClick={() => navigate(`/teacher/batches/${batch.id}`)}
              className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-40"
            >
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-3 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                  <Calendar size={16} />
                  <span className="text-sm font-semibold tracking-wide">Academic Year</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{batch.name}</h2>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                  <Users size={16} />
                  <span>{batch.students} Students</span>
                </div>
                <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-sm font-semibold">
                  View Class &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal for Adding a Batch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add New Batch</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2024"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2027"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95"
                >
                  Create Batch
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;