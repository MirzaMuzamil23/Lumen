"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

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
          background: "var(--header-bg)",
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .shell-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
          .shell-left { display: flex; align-items: center; gap: 36px; }
          .shell-links { display: flex; gap: 26px; }
          .shell-links a { font-size: 14px; color: var(--porcelain-muted); transition: color .15s; }
          .shell-links a.active { color: var(--gold-deep); }
          .shell-links a:hover { color: var(--gold-deep); }
          .shell-right { display: flex; align-items: center; gap: 14px; }
          .shell-menu-toggle { display: none; background: none; border: 1px solid var(--border-strong); border-radius: 4px; width: 38px; height: 38px; color: var(--porcelain); }
          .shell-mobile-panel { display: none; }

          @media (max-width: 720px) {
            .shell-links { display: none; }
            .shell-menu-toggle { display: block; }
            .shell-right .btn-ghost { display: none; }
            .shell-mobile-panel {
              display: ${open ? "flex" : "none"};
              flex-direction: column;
              gap: 16px;
              position: absolute;
              top: 68px;
              left: 0;
              right: 0;
              background: var(--ink-surface);
              border-bottom: 1px solid var(--border);
              padding: 20px 28px 24px;
              z-index: 49;
            }
            .shell-mobile-panel a { font-size: 15px; color: var(--porcelain); }
          }
        ` }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="shell-inner">
            <div className="shell-left">
              <Link href="/dashboard" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>
                LUMEN
              </Link>
              <nav className="shell-links">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="shell-right">
              <ThemeToggle />
              {user?.role === "admin" && (
                <span
                  className="text-mono"
                  style={{
                    fontSize: 11,
                    padding: "5px 10px",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 20,
                    color: "var(--gold-deep)",
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
              <button
                className="shell-menu-toggle"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? "✕" : "☰"}
              </button>
            </div>
          </div>

          <div className="shell-mobile-panel">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
              <ThemeToggle />
              <span className="text-muted" style={{ fontSize: 13.5 }}>Toggle theme</span>
            </div>
            <button className="btn btn-ghost btn-block" onClick={logout} style={{ marginTop: 4 }}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}