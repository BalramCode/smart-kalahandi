import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export type UserRole = "student" | "teacher";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
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
    role: UserRole
  ) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const register = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  try {
    setIsLoading(true);

    const res = await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
      role,
    });

    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);

    setUser(user);
  } catch (err) {
    console.error(err);
    throw err; // important so frontend catch works
  } finally {
    setIsLoading(false);
  }
};

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

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
