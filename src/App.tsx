import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherLayout from "./components/TeacherLayout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import QRSession from "./pages/teacher/QRSession";
import Sessions from "./pages/teacher/Sessions";
import Scanner from "./pages/student/Scanner";
import StudentDashboard from "./pages/student/Dashboard";
import NotFound from "./pages/NotFound";
import Batches from "./pages/teacher/Batches"
import Semesters from "./pages/teacher/Semesters"
import SessionRoom from "./pages/teacher/SessionRoom"
import Subjects from "./pages/teacher/Subjects"
import CompleteProfile from "./pages/CompleteProfile";
import FullScreenLoader from "@/components/FullScreenLoader";

const queryClient = new QueryClient();


// ✅ Protected Route (uses localStorage, NOT useAuth)
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

if (isLoading) return <FullScreenLoader />;


  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "teacher" ? "/teacher/dashboard" : "/student/scanner"}
        replace
      />
    );
  }

  return children;
};



const AuthRedirect = ({ children }) => {
  const { user, isLoading } = useAuth();
if (isLoading) return <FullScreenLoader />;


  if (user) {
    return (
      <Navigate
        to={user.role === "teacher" ? "/teacher/dashboard" : "/student/scanner"}
        replace
      />
    );
  }

  return children;
};



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Root */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
          
          <Route path="/complete-profile" element={<CompleteProfile />} />

          {/* Teacher */}
          {/* Teacher */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<TeacherDashboard />} />

            {/* Batches */}
            <Route path="batches" element={<Batches />} />

            {/* Semesters (inside batch) */}
            <Route path="batches/:batchId" element={<Semesters />} />

            {/* Subjects (inside semester) */}
            <Route path="batches/:batchId/:semId" element={<Subjects />} />

            {/* Session Room (QR + attendance) */}
            <Route path="session/:subjectId" element={<SessionRoom />} />
          </Route>


          {/* Student */}
          <Route
            path="/student/scanner"
            element={
              <ProtectedRoute role="student">
                <Scanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
