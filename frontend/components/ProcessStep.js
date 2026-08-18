export default function ProcessStep({ icon, number, title, desc }) {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const ringLength = circumference * 0.72;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 22px" }}>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ position: "absolute", inset: 0 }}>
          <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="1.5" />
          <circle
            cx="48"
            cy="48"
            r={r}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeDasharray={`${ringLength} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: "50%",
            background: "var(--ink-surface)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div
          className="text-mono"
          style={{
            position: "absolute",
            bottom: -4,
            right: -2,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            border: "3px solid var(--ink)",
          }}
        >
          {number}
        </div>
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
      <p className="text-muted" style={{ fontSize: 14, maxWidth: "26ch", margin: "0 auto" }}>{desc}</p>
    </div>
  );
}