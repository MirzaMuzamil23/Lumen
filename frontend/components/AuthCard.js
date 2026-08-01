import ArcMark from "./ArcMark";

export default function AuthCard({ eyebrow, title, subtitle, children, footer }) {
  return (
    <section className="section" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <ArcMark size={64} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
          <h2 style={{ marginBottom: 8 }}>{title}</h2>
          {subtitle && <p className="text-muted" style={{ fontSize: 15 }}>{subtitle}</p>}
        </div>

        <div className="card">{children}</div>

        {footer && (
          <p className="text-muted" style={{ textAlign: "center", marginTop: 24, fontSize: 14.5 }}>
            {footer}
          </p>
        )}
      </div>
    </section>
  );
}
