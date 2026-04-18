import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import CollegeBranding from "@/components/CollegeBranding";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginUser } from "../services/auth.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const { isLoading } = useAuth();
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const res = await loginUser(email, password);
    console.log(res);

    if (res.success) {
      localStorage.setItem("token", res.data.token);

      toast.success("Welcome back!");

      window.location.href =
        res.data.user.role === "teacher"
          ? "/teacher/dashboard"
          : "/student/scanner";

    } else {
      toast.error(res.message);
    }

  } catch (error) {
    toast.error("Login failed");
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

        <h1 className="text-2xl font-bold text-center mb-1 text-foreground">Welcome back</h1>
        <p className="text-center text-muted-foreground mb-6 text-sm">Sign in to your account</p>

        {/* Role Toggle */}
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@mmu.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover-lift"
          >
            {isLoading ? <LoadingSpinner /> : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
