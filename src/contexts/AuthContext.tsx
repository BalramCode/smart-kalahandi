import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("attendance_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const u: User = {
      id: crypto.randomUUID(),
      name: role === "teacher" ? "Dr. Sharma" : "Rahul Patel",
      email,
      role,
      department: "BSc Computer Science",
    };
    localStorage.setItem("attendance_user", JSON.stringify(u));
    setUser(u);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const u: User = { id: crypto.randomUUID(), name, email, role, department: "BSc Computer Science" };
    localStorage.setItem("attendance_user", JSON.stringify(u));
    setUser(u);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("attendance_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
