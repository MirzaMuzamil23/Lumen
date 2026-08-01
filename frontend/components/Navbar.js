"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "rgba(10,22,20,0.88)", backdropFilter: "blur(8px)", zIndex: 50 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "0.01em" }}>
          LUMEN
        </Link>

        <nav
          style={{
            display: open ? "flex" : undefined,
          }}
          className="nav-links"
        >
          <style>{`
            .nav-links { display: flex; gap: 34px; align-items: center; }
            .nav-links a { font-size: 14.5px; color: var(--porcelain-muted); transition: color .15s; }
            .nav-links a:hover { color: var(--gold-soft); }
            .nav-actions { display: flex; gap: 12px; align-items: center; }
            .menu-toggle { display: none; }
            @media (max-width: 860px) {
              .nav-links { display: ${open ? "flex" : "none"}; position: absolute; top: 76px; left: 0; right: 0; background: var(--ink-surface); flex-direction: column; padding: 24px 28px; border-bottom: 1px solid var(--border); gap: 18px; }
              .menu-toggle { display: block; }
            }
          `}</style>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <div className="nav-actions">
            <Link href="/login" className="btn btn-ghost" style={{ padding: "9px 18px" }}>
              Log in
            </Link>
            <Link href="/signup" className="btn btn-ghost" style={{ padding: "9px 18px" }}>
              Sign up
            </Link>
          </div>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "1px solid var(--border-strong)", borderRadius: 4, width: 40, height: 40, color: "var(--porcelain)" }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
