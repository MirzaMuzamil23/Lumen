import Link from "next/link";
import ArcMark from "@/components/ArcMark";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const TEAM = [
  { name: "Sana Malik", role: "Founder & Design Lead" },
  { name: "Bilal Ahmed", role: "Engineering Lead" },
  { name: "Hira Farooq", role: "Product Strategist" },
];

const VALUES = [
  { title: "Fewer things, done well", desc: "We turn down work that doesn't fit rather than stretch thin across too many clients." },
  { title: "Transparent by default", desc: "You see the backlog, the estimates, and the tradeoffs — not a polished summary after the fact." },
  { title: "Code you can keep", desc: "No proprietary frameworks or locked-in tooling. What we build is yours to run without us." },
];

const MILESTONES = [
  { year: "2020", text: "Lumen founded as a two-person freelance partnership." },
  { year: "2022", text: "Grew to a six-person studio; shipped our first enterprise engagement." },
  { year: "2024", text: "Crossed 100 delivered projects across fintech, healthcare, and e-commerce." },
  { year: "2026", text: "Expanded into full DevOps & observability offerings alongside product work." },
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
          <Reveal>
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
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ArcMark size={220} />
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* Values */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>What we value</div>
              <h2>Principles, not slogans.</h2>
            </div>
          </Reveal>
          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <TiltCard>
                  <div className="card card-equal">
                    <h3 style={{ fontSize: 17, marginBottom: 10 }}>{v.title}</h3>
                    <p className="text-muted" style={{ fontSize: 14.5 }}>{v.desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Milestones */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Milestones</div>
              <h2>Six years, briefly.</h2>
            </div>
          </Reveal>
          <div>
            {MILESTONES.map((m, i, arr) => (
              <Reveal key={m.year} delay={i * 60}>
                <div>
                  <div className="timeline-row" style={{ padding: "26px 0" }}>                    <div style={{ fontFamily: "var(--font-mono)", color: "var(--gold-deep)", fontSize: 15 }}>{m.year}</div>
                    <p className="text-muted" style={{ maxWidth: "56ch" }}>{m.text}</p>
                  </div>
                  {i < arr.length - 1 && <hr className="divider" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Team */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}>The team</div>
            <h2 style={{ marginBottom: 40 }}>People behind the work.</h2>
          </Reveal>
          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <TiltCard>
                  <div className="card card-equal">
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--ink-surface-2)", border: "1px solid var(--border-strong)", marginBottom: 16 }} />
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{m.name}</h3>
                    <p className="text-muted" style={{ fontSize: 14.5 }}>{m.role}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section" style={{ textAlign: "center" }}>
        <Reveal>
          <div className="container" style={{ maxWidth: 560 }}>
            <h2 style={{ marginBottom: 16 }}>Want to work together?</h2>
            <p className="text-muted" style={{ marginBottom: 28 }}>
              We're currently taking on two new engagements this quarter.
            </p>
            <Link href="/contact" className="btn btn-primary">Start a conversation</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}