import Link from "next/link";
import ArcMark from "./ArcMark";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function AuthSplit({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div style={{ minHeight: "100vh" }} className="auth-split-wrap">
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .auth-split-mobile-header { display: none; }
        @media (max-width: 900px) {
          .auth-split { grid-template-columns: 1fr !important; min-height: 0; }
          .auth-split-brand { display: none !important; }
          .auth-desktop-toggle { display: none !important; }
          .auth-split-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
          }
        }
      ` }} />

      {/* Mobile-only top bar — logo + way back to the main site */}
      <div className="auth-split-mobile-header">
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600 }}>
          LUMEN
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle />
          <Link href="/" className="text-mono" style={{ fontSize: 13, color: "var(--gold-deep)" }}>
            ← Back to home
          </Link>
        </div>
      </div>

      <div className="auth-split">
        {/* Left — brand / navigation panel (desktop only) */}
        <div
          className="auth-split-brand"
          style={{
            background: "linear-gradient(160deg, #1a2320 0%, #2c3a34 55%, #3c4a3f 100%)",
            color: "#f2efe9",
            padding: "48px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "#f2efe9" }}>
            LUMEN
          </Link>

          <div>
            <ArcMark size={110} variant="dark" />
            <h2 style={{ color: "#f2efe9", fontSize: 32, marginTop: 24, marginBottom: 14, maxWidth: "14ch" }}>
              We build the details others skip.
            </h2>
            <p style={{ color: "rgba(242,239,233,0.7)", maxWidth: "34ch", fontSize: 15 }}>
              Product design and engineering for teams who care about the finish, not just the function.
            </p>
          </div>

          <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 13.5, color: "rgba(242,239,233,0.65)" }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right — form panel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 28px", position: "relative" }}>
          <div style={{ position: "absolute", top: 24, right: 28 }} className="auth-desktop-toggle">
            <ThemeToggle />
          </div>
          <div style={{ width: "100%", maxWidth: 400 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
            <h1 style={{ fontSize: 30, marginBottom: 10 }}>{title}</h1>
            {subtitle && <p className="text-muted" style={{ fontSize: 15, marginBottom: 32 }}>{subtitle}</p>}

            {children}

            {footer && (
              <p className="text-muted" style={{ textAlign: "center", marginTop: 24, fontSize: 14.5 }}>
                {footer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}