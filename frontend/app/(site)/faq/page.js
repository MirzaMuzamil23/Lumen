import Link from "next/link";
import Reveal from "@/components/Reveal";

const CATEGORIES = [
  {
    title: "Working with us",
    items: [
      { q: "How long does a typical project take?", a: "Most single-flow projects ship in 2–4 weeks. Larger, multi-team engagements are scoped on a rolling monthly basis." },
      { q: "Do you work with existing codebases?", a: "Yes — we regularly join projects mid-flight, especially ones already on Next.js, Express, or PostgreSQL." },
      { q: "Can I hire Lumen for design only, or dev only?", a: "Both. Design, engineering, and brand are available standalone or bundled — see the Pricing page for details." },
    ],
  },
  {
    title: "Process & communication",
    items: [
      { q: "How often will we hear from you?", a: "Weekly delivery + a short async update. A live call only when there's a real decision to make together." },
      { q: "What if we need to change scope mid-project?", a: "Scope changes are normal. We re-estimate the affected work and adjust the timeline or budget before proceeding — no surprises." },
      { q: "Do you use our tools (Slack, Linear, etc.)?", a: "Yes, we work inside your existing stack rather than asking you to adopt ours." },
    ],
  },
  {
    title: "Technical",
    items: [
      { q: "What does the final handoff include?", a: "Full source code, a component library, deployment docs, and a walkthrough call with your team." },
      { q: "Can you help with DevOps and infrastructure?", a: "Yes — AWS, Docker, Kubernetes, and observability tooling (Prometheus, Grafana, ELK) are part of our regular stack." },
      { q: "Do you sign NDAs?", a: "Of course. We're happy to sign yours or share ours before any detailed discussion." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>FAQ</div>
          <h1 style={{ marginBottom: 20 }}>Questions, answered.</h1>
          <p className="lead">
            Everything we get asked most often — organized so you can jump to what matters.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          {CATEGORIES.map((cat, ci) => (
            <div key={cat.title} style={{ marginBottom: 56 }}>
              <Reveal>
                <div className="eyebrow" style={{ marginBottom: 20 }}>{cat.title}</div>
              </Reveal>
              {cat.items.map((f, i, arr) => (
                <Reveal key={f.q} delay={i * 60}>
                  <div>
                    <div style={{ padding: "22px 0" }}>
                      <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.q}</h3>
                      <p className="text-muted" style={{ fontSize: 14.5 }}>{f.a}</p>
                    </div>
                    {i < arr.length - 1 && <hr className="divider" />}
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ marginBottom: 16 }}>Still have a question?</h2>
          <p className="text-muted" style={{ marginBottom: 28 }}>
            We reply to every message within one business day.
          </p>
          <Link href="/contact" className="btn btn-primary">Ask us directly</Link>
        </div>
      </section>
    </>
  );
}