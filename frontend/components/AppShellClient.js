"use client";

import { AuthProvider, useAuth } from "@/lib/AuthContext";
import DashboardShell from "@/components/DashboardShell";

function Gate({ children }) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <section className="section">
        <div className="container text-muted">Loading…</div>
      </section>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}

export default function AppShellClient({ children }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}