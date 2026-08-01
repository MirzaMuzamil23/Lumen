 "use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lumen_token");
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .me(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("lumen_token");
        localStorage.removeItem("lumen_user");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("lumen_token");
    localStorage.removeItem("lumen_user");
    router.push("/login");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("lumen_token");
    if (!token) return;
    const data = await api.me(token);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}