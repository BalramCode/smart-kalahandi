import React, { createContext, useContext, useState, useEffect } from "react";
// 1. Import your custom api instance instead of raw axios
import api from "../services/api"; 

export type UserRole = "student" | "teacher";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNo?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    rollNo?: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    rollNo?: string
  ) => {
    try {
      setIsLoading(true);

      // 2. Use 'api.post' and a short path. The URL comes from .env automatically.
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        ...(role === 'student' && { rollNo }),
      });

      const { token, user: userData } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role);

      setUser(userData);
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // 3. Notice we don't need to manually pass the Header here anymore!
        // Our api interceptor handles it.
        const res = await api.get("/auth/me");
        setUser(res.data.data.user);
      } catch (err) {
        console.error("Fetch user error:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); // Runs once on mount

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};