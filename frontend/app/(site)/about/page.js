import ArcMark from "@/components/ArcMark";

const TEAM = [
  { name: "Sana Malik", role: "Founder & Design Lead" },
  { name: "Bilal Ahmed", role: "Engineering Lead" },
  { name: "Hira Farooq", role: "Product Strategist" },
];

export default function AboutPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>About Lumen</div>
          <h1 style={{ marginBottom: 24 }}>Small studio, considered work.</h1>
          <p className="lead">
            Lumen is a six-person studio building product and brand for teams
            who'd rather do fewer things well than many things averagely.
            We work end to end — research, design, and the engineering that
            ships it — so nothing gets lost in translation between disciplines.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container grid-2" style={{ alignItems: "center" }}>
          <div>
            <h2 style={{ marginBottom: 18 }}>How we work</h2>
            <p className="text-muted" style={{ marginBottom: 16 }}>
              Every engagement starts with a short discovery sprint — we learn
              your users, your constraints, and what "done well" looks like
              for your team specifically.
            </p>
            <p className="text-muted">
              From there we move in weekly cycles: design, review, build,
              ship. You see working software early and often, not a single
              reveal at the end.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ArcMark size={220} />
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 14 }}>The team</div>
          <h2 style={{ marginBottom: 40 }}>People behind the work.</h2>
          <div className="grid-3">
            {TEAM.map((m) => (
              <div className="card" key={m.name}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--ink-surface-2)", border: "1px solid var(--border-strong)", marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, marginBottom: 4 }}>{m.name}</h3>
                <p className="text-muted" style={{ fontSize: 14.5 }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
