"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

 const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/security", label: "Security" },
    { href: "/dashboard/invoices", label: "Invoices" },
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const initials = (user?.full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          background: "rgba(10,22,20,0.92)",
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Link href="/dashboard" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>
              LUMEN
            </Link>
            <nav style={{ display: "flex", gap: 26 }} className="shell-links">
              <style>{`
                .shell-links a { font-size: 14px; color: var(--porcelain-muted); transition: color .15s; }
                .shell-links a.active { color: var(--gold-soft); }
                .shell-links a:hover { color: var(--gold-soft); }
                @media (max-width: 720px) { .shell-links { display: none; } }
              `}</style>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {user?.role === "admin" && (
              <span
                className="text-mono"
                style={{
                  fontSize: 11,
                  padding: "5px 10px",
                  border: "1px solid var(--border-strong)",
                  borderRadius: 20,
                  color: "var(--gold-soft)",
                }}
              >
                ADMIN
              </span>
            )}
            <div
              title={user?.full_name}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--gold)",
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {initials}
            </div>
            <button className="btn btn-ghost" onClick={logout} style={{ padding: "8px 16px" }}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}