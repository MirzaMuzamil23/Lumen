import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "56px 0 32px" }}>
      <div className="container">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", marginBottom: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 12 }}>LUMEN</div>
            <p className="text-muted" style={{ fontSize: 14.5 }}>
              A studio-grade product and design partner for teams who care about the details.
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Navigate</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/about" className="text-muted">About</Link>
              <Link href="/services" className="text-muted">Services</Link>
              <Link href="/pricing" className="text-muted">Pricing</Link>
              <Link href="/contact" className="text-muted">Contact</Link>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Account</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/login" className="text-muted">Log in</Link>
              <Link href="/signup" className="text-muted">Sign up</Link>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Studio</div>
            <p className="text-muted" style={{ fontSize: 14.5 }}>
              hello@lumen.studio<br />
              Karachi, Pakistan
            </p>
          </div>
        </div>

        <hr className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, fontSize: 13 }} className="text-muted">
          <span>© {new Date().getFullYear()} Lumen Studio. All rights reserved.</span>
          <span className="text-mono">Built Mirza Muzammil baig</span>
        </div>
      </div>
    </footer>
  );
}
