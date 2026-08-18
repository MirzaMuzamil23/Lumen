"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
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
        .nav-bar-inner { position: relative; display: flex; align-items: center; justify-content: space-between; height: 76px; }
        .nav-links-desktop { display: flex; gap: 30px; align-items: center; }
        .nav-links-desktop a { font-size: 14.5px; color: var(--porcelain-muted); transition: color .15s; }
        .nav-links-desktop a:hover { color: var(--gold-deep); }
        .nav-actions-desktop { display: flex; gap: 12px; align-items: center; }
        .nav-logo { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-family: var(--font-display); font-size: 22px; font-weight: 600; }
        .nav-menu-toggle { display: none; margin-left: auto; background: none; border: 1px solid var(--border-strong); border-radius: 4px; width: 40px; height: 40px; color: var(--porcelain); }
        .nav-mobile-panel { display: none; }

        @media (max-width: 860px) {
          .nav-links-desktop, .nav-actions-desktop { display: none; }
          .nav-menu-toggle { display: block; }
          .nav-mobile-panel {
            display: ${open ? "flex" : "none"};
            flex-direction: column;
            gap: 18px;
            position: absolute;
            top: 76px;
            left: 0;
            right: 0;
            background: var(--ink-surface);
            border-bottom: 1px solid var(--border);
            padding: 24px 28px 28px;
          }
          .nav-mobile-panel a.nav-mobile-link { font-size: 15px; color: var(--porcelain); }
          .nav-mobile-panel .nav-mobile-actions { display: flex; gap: 12px; padding-top: 8px; border-top: 1px solid var(--border); margin-top: 4px; }
        }
      ` }} />

      <div className="container nav-bar-inner">
        <nav className="nav-links-desktop">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="nav-logo">
          LUMEN
        </Link>

        <div className="nav-actions-desktop">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost" style={{ padding: "9px 18px" }}>
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary" style={{ padding: "9px 18px" }}>
            Sign up
          </Link>
        </div>

        <button
          className="nav-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <div className="nav-mobile-panel">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="nav-mobile-link" onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="nav-mobile-actions">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setOpen(false)}>
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}