import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const ROLES = [
  { title: "Senior Full-Stack Engineer", type: "Full-time · Remote", team: "Engineering" },
  { title: "Product Designer", type: "Full-time · Remote", team: "Design" },
  { title: "DevOps / Platform Engineer", type: "Contract · Remote", team: "Engineering" },
  { title: "Studio Operations Lead", type: "Full-time · Karachi", team: "Operations" },
];

const VALUES = [
  { title: "Ship weekly", desc: "Momentum beats perfection. We'd rather learn from something real than polish something imaginary." },
  { title: "Own the outcome", desc: "Everyone here can talk to a client, read a database query, and defend a design decision." },
  { title: "Write it down", desc: "Decisions live in docs, not in one person's head. Async-first, always." },
];

export default function CareersPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Careers</div>
          <h1 style={{ marginBottom: 20 }}>Build things people actually use.</h1>
          <p className="lead">
            We're a small, senior team — no layers of management, no busywork.
            If that sounds good, here's what's open.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 14 }}>How we work</div>
          <h2 style={{ marginBottom: 40 }}>What we actually value.</h2>
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

      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 14 }}>Open roles</div>
          <h2 style={{ marginBottom: 40 }}>Current openings.</h2>

          <div>
            {ROLES.map((role, i, arr) => (
              <Reveal key={role.title} delay={i * 60}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                      padding: "26px 0",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 17, marginBottom: 6 }}>{role.title}</h3>
                      <p className="text-muted" style={{ fontSize: 13.5 }}>
                        {role.team} · {role.type}
                      </p>
                    </div>
                    <Link href="/contact" className="btn btn-ghost">Apply</Link>
                  </div>
                  {i < arr.length - 1 && <hr className="divider" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ marginBottom: 16 }}>Don't see the right role?</h2>
          <p className="text-muted" style={{ marginBottom: 28 }}>
            We're always open to hearing from strong generalists. Send us a note anyway.
          </p>
          <Link href="/contact" className="btn btn-primary">Introduce yourself</Link>
        </div>
      </section>
    </>
  );
}