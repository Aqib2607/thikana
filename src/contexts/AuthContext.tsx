import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserRole } from "@/types/thikana";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  preferredLanguage?: "bn" | "en";
  bio?: string;
  createdAt: string;
}

export const DEMO_USERS: Record<UserRole, User> = {
  tenant: {
    id: "u-tenant-1",
    name: "তানভীর আহমেদ",
    email: "tanvir.tenant@thikana.local",
    phone: "01711223344",
    role: "tenant",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    preferredLanguage: "bn",
    bio: "খুলনা বিশ্ববিদ্যালয়ের শিক্ষার্থী। শান্ত ও পরিচ্ছন্ন পরিবেশে ১-২ রুমের ফ্ল্যাট খুঁজছি।",
    createdAt: "2026-01-15",
  },
  landlord: {
    id: "l-p-1001",
    name: "হাসান মাহমুদ",
    email: "hasan.landlord@thikana.local",
    phone: "01722334455",
    role: "landlord",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    preferredLanguage: "bn",
    bio: "সোনাডাঙ্গা ও বয়রা এলাকার প্রপার্টি মালিক। সময়মতো ভাড়া পরিশোধকারী ভাড়াটিয়া কাম্য।",
    createdAt: "2025-11-02",
  },
  admin: {
    id: "u-admin-1",
    name: "অ্যাডমিন মডারেটর",
    email: "admin@thikana.local",
    phone: "01799887766",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    preferredLanguage: "bn",
    bio: "ঠিকানা প্ল্যাটফর্মের সিস্টেম ও কন্টেন্ট অ্যাডমিনিস্ট্রেটর।",
    createdAt: "2025-01-01",
  },
};

const AUTH_STORAGE_KEY = "thikana.auth.user";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLandlord: boolean;
  isTenant: boolean;
  login: (email?: string, password?: string, defaultRole?: UserRole) => Promise<User>;
  register: (data: { name: string; email: string; phone: string; role: UserRole }) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setPersona: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return DEMO_USERS.tenant;
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch {
      // ignore parse error
    }
    return DEMO_USERS.tenant;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [user]);

  const login = async (email?: string, _password?: string, defaultRole: UserRole = "tenant"): Promise<User> => {
    let targetUser: User;
    if (email) {
      const matched = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
      targetUser = matched ?? {
        id: `u-${Date.now()}`,
        name: email.split("@")[0] || "User",
        email,
        phone: "01700000000",
        role: defaultRole,
        createdAt: new Date().toISOString().slice(0, 10),
      };
    } else {
      targetUser = DEMO_USERS[defaultRole];
    }

    setUser(targetUser);
    return targetUser;
  };

  const register = async (data: { name: string; email: string; phone: string; role: UserRole }): Promise<User> => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLandlord: user?.role === "landlord",
        isTenant: user?.role === "tenant",
        login,
        register,
        logout,
        switchRole,
        setPersona: switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
