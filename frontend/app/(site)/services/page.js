const SERVICES = [
  {
    num: "01",
    title: "Product design",
    desc: "User research, information architecture, wireframes, and high-fidelity UI — delivered as a component library your team can build straight from.",
  },
  {
    num: "02",
    title: "Full-stack development",
    desc: "Next.js and React frontends paired with Node.js/Express and PostgreSQL backends, built MVC-style for teams that will maintain the code long after we hand it off.",
  },
  {
    num: "03",
    title: "Brand identity",
    desc: "Naming, typography, color systems, and voice — the groundwork that keeps every future design decision consistent.",
  },
  {
    num: "04",
    title: "Growth & optimisation",
    desc: "Performance audits, conversion-focused landing pages, and analytics setup so you know what's actually working.",
  },
];

export default function ServicesPage() {
  return (
    <section className="section" style={{ paddingTop: 72 }}>
      <div className="container">
        <div style={{ maxWidth: 620, marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>What we offer</div>
          <h1 style={{ marginBottom: 20 }}>Services built around outcomes.</h1>
          <p className="lead">
            Four disciplines, each one available standalone or bundled into a
            single end-to-end engagement.
          </p>
        </div>

        <div>
          {SERVICES.map((s, i) => (
            <div key={s.num}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 32, padding: "36px 0" }}>
                <div style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", fontSize: 15 }}>{s.num}</div>
                <div>
                  <h3 style={{ marginBottom: 10 }}>{s.title}</h3>
                  <p className="text-muted" style={{ maxWidth: "58ch" }}>{s.desc}</p>
                </div>
              </div>
              {i < SERVICES.length - 1 && <hr className="divider" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
