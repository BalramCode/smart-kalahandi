import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import CollegeBranding from "@/components/CollegeBranding";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

import api from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState(""); // New State for Roll Number
  const [role, setRole] = useState<UserRole>("student");

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Sending:", { name, email, password, role, rollNo });
    e.preventDefault();

    // Validation: Only require rollNo if user is a student
    if (!name || !email || !password || (role === "student" && !rollNo)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Assuming you update your useAuth register function to accept rollNo as the 5th argument
      await register(name, email, password, role, rollNo);

      toast.success("Account created!");
      navigate(role === "teacher" ? "/teacher/dashboard" : "/student/scanner");
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 animate-scale-in relative">
        <div className="mb-8">
          <CollegeBranding />
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 text-foreground">Create Account</h1>
        <p className="text-center text-muted-foreground mb-6 text-sm">Join the smart attendance system</p>

        <div className="flex rounded-xl bg-muted p-1 mb-6">
          {(["student", "teacher"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 capitalize ${role === r
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-background" />
          </div>

          {/* Conditional Roll Number Field */}
          {role === "student" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                placeholder="e.g. CS202601"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="h-11 rounded-xl bg-background border-primary/20 focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@mmu.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl bg-background" />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover-lift">
            {isLoading ? <LoadingSpinner /> : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await api.post("/auth/google", {
                  token: credentialResponse.credential,
                  role: role,
                });

                const data = res.data.data;

                // ✅ store token
                localStorage.setItem("token", data.token);

                toast.success("Google Login Successful!");

                // 🔥 HANDLE STUDENT PROFILE
                if (data.needsProfileCompletion) {
                  navigate("/complete-profile");
                  return;
                }

                // ✅ NORMAL REDIRECT
                navigate(
                  data.user.role === "teacher"
                    ? "/teacher/dashboard"
                    : "/student/scanner"
                );

              } catch (err) {
                console.error("Backend Google Auth Error:", err);
                const errorMessage =
                  err.response?.data?.message || "Google login failed";
                toast.error(errorMessage);
              }
            }}

            onError={() => {
              console.log("Google Popup Closed or Failed");
              toast.error("Google Sign-In was interrupted");
            }}
          />

        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;