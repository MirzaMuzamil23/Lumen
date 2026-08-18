import Link from "next/link";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const POSTS = [
  {
    title: "Why weekly delivery beats the big reveal",
    tag: "Process",
    date: "Jul 12, 2026",
    excerpt: "Shipping working software every week catches misalignment early — before it costs anyone a rewrite.",
    gradient: "linear-gradient(135deg, #b8862f, #7a5a1c)",
  },
  {
    title: "Choosing Postgres over a managed BaaS",
    tag: "Engineering",
    date: "Jun 28, 2026",
    excerpt: "For most product teams, a plain Postgres database you actually own beats vendor lock-in every time.",
    gradient: "linear-gradient(135deg, #5c7d68, #34473b)",
  },
  {
    title: "A design system is a contract, not a Figma file",
    tag: "Design",
    date: "Jun 9, 2026",
    excerpt: "Tokens and components only pay off once engineering treats them as the source of truth, not a reference.",
    gradient: "linear-gradient(135deg, #3c4a3f, #17201d)",
  },
  {
    title: "Observability from day one, not after the incident",
    tag: "DevOps",
    date: "May 22, 2026",
    excerpt: "Prometheus and Grafana cost you an afternoon to wire up. Waiting until production breaks costs a lot more.",
    gradient: "linear-gradient(135deg, #a97a1f, #5c7d68)",
  },
  {
    title: "What a six-week discovery sprint actually produces",
    tag: "Process",
    date: "May 3, 2026",
    excerpt: "Not a deck. A prioritized backlog, a clickable prototype, and a shared definition of done.",
    gradient: "linear-gradient(135deg, #7a5a1c, #3c4a3f)",
  },
  {
    title: "Queues aren't just for scale — they're for sanity",
    tag: "Engineering",
    date: "Apr 18, 2026",
    excerpt: "RabbitMQ and Redis-backed jobs turn fragile request-time work into something you can retry safely.",
    gradient: "linear-gradient(135deg, #34473b, #17201d)",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Insights</div>
          <h1 style={{ marginBottom: 20 }}>Notes from the studio.</h1>
          <p className="lead">
            Short, practical writing on design, engineering, and running a
            studio that ships — no fluff, no gated PDFs.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container">
          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {POSTS.map((post, i) => (
              <Reveal key={post.title} delay={(i % 3) * 80}>
                <TiltCard>
                  <div className="card card-equal">
                    <div
                      style={{
                        height: 120,
                        borderRadius: 4,
                        marginBottom: 20,
                        background: post.gradient,
                      }}
                    />
                    <div className="eyebrow" style={{ marginBottom: 10 }}>{post.tag}</div>
                    <h3 style={{ fontSize: 18, marginBottom: 10 }}>{post.title}</h3>
                    <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>{post.excerpt}</p>
                    <div style={{ marginTop: "auto", fontSize: 12.5 }} className="text-mono text-muted">
                      {post.date}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ marginBottom: 16 }}>Have a topic you'd like us to cover?</h2>
          <p className="text-muted" style={{ marginBottom: 28 }}>
            Tell us what you're stuck on — we write about the questions clients actually ask.
          </p>
          <Link href="/contact" className="btn btn-primary">Get in touch</Link>
        </div>
      </section>
    </>
  );
}