import { useState } from "react";

import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { UserCheck, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner for toasts like in Login
import { useAuth } from "../contexts/AuthContext";

export default function CompleteProfile() {
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  // const [startYear, setStartYear] = useState("");
  // const [endYear, setEndYear] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!rollNo.trim()) {
      return toast.error("Roll number is required");
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/complete-profile", { rollNo });

      localStorage.setItem("token", res.data.data.token);
      setUser(res.data.data.user);

      toast.success("Profile verified successfully!");

      setTimeout(() => {
        navigate("/student/dashboard", { replace: true });
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">

          {/* Icon Header */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-300">
              <GraduationCap size={40} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Final Step <span className="text-indigo-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium">
              We just need your official Roll Number to link your attendance records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2 block ml-1">
                Official Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. BS24-063"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <UserCheck size={20} />
                </div>
              </div>
              {/* <div className="flex gap-4 mb-6">
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
              </div> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 font-medium px-4">
            By completing this, you agree to link your Google Identity with your University records.
          </p>
        </div>
      </div>
    </div>
  );
}
