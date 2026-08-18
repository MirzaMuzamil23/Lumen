import Link from "next/link";
import ArcMark from "@/components/ArcMark";
import Reveal from "@/components/Reveal";
import HeroScene from "@/components/HeroScene";
import StackIcon from "@/components/StackIcon";
import AmbientParticles from "@/components/AmbientParticles";
import TiltCard from "@/components/TiltCard";
import StackedCard from "@/components/StackedCard";
import ProcessStep from "@/components/ProcessStep";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        className="section hero-section"
        style={{ paddingTop: 120, paddingBottom: 100, position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <HeroScene />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Digital product studio</div>
          <h1 style={{ marginBottom: 24 }}>
            We build the details<br />others skip.
          </h1>
          <p className="lead" style={{ marginBottom: 36 }}>
            Lumen partners with founders and teams to design and ship products
            that feel considered from the first pixel to the last line of code.
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/signup" className="btn btn-primary">Start a project</Link>
            <Link href="/services" className="btn btn-ghost">See our work</Link>
          </div>
        </div>
      </section>
      <hr className="divider" />

      {/* Stats strip */}
      <section className="section-tight">
        <Reveal>
          <div className="container grid-4">
            {[
              ["120+", "Products shipped"],
              ["98%", "Client retention"],
              ["6 yrs", "In practice"],
              ["14", "Countries served"],
            ].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--gold-deep)" }}>{num}</div>
                <div className="text-muted" style={{ fontSize: 14.5, marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <hr className="divider" />

      {/* Tech stack — categorized, professional showcase */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Our stack</div>
              <h2>What we build and run with.</h2>
              <p className="text-muted" style={{ marginTop: 14, fontSize: 15.5 }}>
                From the first line of application code to the infrastructure that keeps it online.
              </p>
            </div>
          </Reveal>

          <div className="grid-3 stack-grid" style={{ alignItems: "stretch" }}>
            <style dangerouslySetInnerHTML={{ __html: `
              .stack-card {
                transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
                position: relative;
                overflow: hidden;
                padding-top: 36px;
              }
              .stack-card::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--gold-soft), var(--gold-deep));
              }
              .stack-card:hover {
                border-color: var(--gold);
                box-shadow: 0 10px 24px rgba(23,32,29,0.08);
              }
              .stack-pill {
                display: inline-block;
                font-family: var(--font-mono);
                font-size: 12.5px;
                padding: 6px 12px;
                margin: 0 8px 8px 0;
                border-radius: 20px;
                border: 1px solid var(--border-strong);
                color: var(--porcelain-muted);
              }
              @media (max-width: 640px) {
                .stack-grid { grid-template-columns: 1fr !important; }
              }
            ` }} />

            {[
              { title: "Frontend", desc: "Fast, accessible interfaces users actually enjoy.", tools: ["Next.js", "React.js"], shape: "ico" },
              { title: "Backend", desc: "APIs and services built to handle real traffic.", tools: ["Node.js", "Express.js"], shape: "octa" },
              { title: "Cloud & DevOps", desc: "Infrastructure that scales without the drama.", tools: ["AWS"], shape: "sphere" },
              { title: "Containerization", desc: "Consistent environments from laptop to production.", tools: ["Docker", "Kubernetes", "Podman"], shape: "box" },
              { title: "Observability", desc: "Full visibility into what's happening, always.", tools: ["Prometheus", "Grafana", "ELK Stack", "New Relic"], shape: "torus" },
              { title: "Messaging & Queues", desc: "Reliable async processing, even under load.", tools: ["Redis", "RabbitMQ"], shape: "tetra" },
            ].map((cat, i) => (
              <Reveal key={cat.title} delay={i * 70}>
                <TiltCard>
                  <div className="card card-equal stack-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17 }}>{cat.title}</h3>
                      <StackIcon shape={cat.shape} size={44} />
                    </div>
                    <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 18 }}>{cat.desc}</p>
                    <div style={{ marginTop: "auto" }}>
                      {cat.tools.map((t) => (
                        <span className="stack-pill" key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Services preview */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>What we do</div>
              <h2>Three disciplines, one team.</h2>
            </div>
          </Reveal>

          <div className="grid-3" style={{ alignItems: "stretch" }}>
            {[
              {
                title: "Product design",
                desc: "Interfaces engineered for clarity — wireframes through to production-ready component libraries.",
                items: ["User research & flows", "High-fidelity UI kits", "Design-to-code handoff"],
              },
              {
                title: "Full-stack engineering",
                desc: "Next.js frontends and Express/PostgreSQL backends built to scale past the first thousand users.",
                items: ["React component architecture", "REST APIs & auth", "Cloud deployment & CI/CD"],
              },
              {
                title: "Brand systems",
                desc: "Typography, color, and voice that hold together across every surface your customers see.",
                items: ["Logo & visual identity", "Design tokens & guidelines", "Marketing site templates"],
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <TiltCard>
                  <div className="card card-equal">
                    <h3 style={{ marginBottom: 12 }}>{s.title}</h3>
                    <p className="text-muted" style={{ fontSize: 15, marginBottom: 20 }}>{s.desc}</p>
                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 9 }}>
                      {s.items.map((item) => (
                        <div key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5 }}>
                          <span style={{ color: "var(--gold-deep)", marginTop: 1 }}>✓</span>
                          <span className="text-muted">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Why Lumen — side-by-side comparison cards, mobile-friendly by default */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Why Lumen</div>
              <h2>What changes when you work with us.</h2>
            </div>
          </Reveal>

          <div className="grid-2" style={{ alignItems: "stretch" }}>
            <Reveal>
              <TiltCard>
                <div className="card card-equal" style={{ background: "var(--ink-surface-2)" }}>
                  <div className="eyebrow" style={{ marginBottom: 18, color: "var(--porcelain-muted)" }}>Typical agency</div>
                  <div>
                    {[
                      "One big reveal at the end",
                      "Rotating junior staff",
                      "A PDF style guide as handoff",
                      "Your code locked to their tooling",
                    ].map((item) => (
                      <div className="check-row" key={item}>
                        <span style={{ color: "var(--porcelain-muted)", fontSize: 15, lineHeight: 1 }}>–</span>
                        <span className="text-muted" style={{ fontSize: 14.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={80}>
              <TiltCard>
                <div className="card card-equal" style={{ borderColor: "var(--gold)", boxShadow: "0 10px 28px rgba(169,122,31,0.1)" }}>
                  <div className="eyebrow" style={{ marginBottom: 18 }}>Lumen</div>
                  <div>
                    {[
                      "Working software every week",
                      "The same senior pair, start to finish",
                      "A production-ready component library",
                      "Plain Next.js / Express — fully yours",
                    ].map((item) => (
                      <div className="check-row" key={item}>
                        <span style={{ color: "var(--gold-deep)", fontSize: 14, lineHeight: 1.4 }}>✓</span>
                        <span style={{ fontSize: 14.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Process */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>How we work</div>
              <h2>Four steps, no surprises.</h2>
            </div>
          </Reveal>

          <div className="grid-4">
            {[
              {
                num: "01",
                title: "Discover",
                desc: "A short sprint to learn your users and constraints.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="10" r="6" stroke="var(--gold-deep)" strokeWidth="1.8" />
                    <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="var(--gold-deep)" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Design",
                desc: "High-fidelity UI reviewed with you at every stage.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <line x1="4" y1="6" x2="14" y2="6" stroke="var(--gold-deep)" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="18" y2="12" stroke="var(--gold-deep)" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="4" y1="18" x2="11" y2="18" stroke="var(--gold-deep)" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Build",
                desc: "Shipped in weekly cycles so progress is visible early.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="var(--gold-deep)" strokeWidth="1.6" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="var(--gold-deep)" strokeWidth="1.6" />
                  </svg>
                ),
              },
              {
                num: "04",
                title: "Launch & support",
                desc: "We stay on after launch — monitoring, fixes, iteration.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="var(--gold-deep)" strokeWidth="1.6" />
                    <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="var(--gold-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 80}>
                <TiltCard>
                  <ProcessStep icon={s.icon} number={s.num} title={s.title} desc={s.desc} />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Selected work */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <div style={{ maxWidth: 520 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Selected work</div>
                <h2>Recent engagements.</h2>
              </div>
              <Link href="/services" className="btn btn-ghost">View all services</Link>
            </div>
          </Reveal>

          <div className="grid-3" style={{ alignItems: "stretch" }}>
            <style dangerouslySetInnerHTML={{ __html: `
              .work-cover {
                height: 150px;
                border-radius: 4px;
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .work-cover span {
                font-family: var(--font-display);
                font-size: 46px;
                font-weight: 500;
                color: rgba(255,255,255,0.9);
              }
              .work-tag-pill {
                display: inline-block;
                font-family: var(--font-mono);
                font-size: 11.5px;
                padding: 4px 10px;
                margin: 0 6px 6px 0;
                border-radius: 20px;
                border: 1px solid var(--border-strong);
                color: var(--porcelain-muted);
              }
            ` }} />

            {[
              {
                tag: "Fintech",
                title: "Nira Pay",
                desc: "Full rebrand and dashboard redesign for a payments platform.",
                stack: ["Next.js", "AWS", "Redis"],
                metric: "40% faster onboarding",
                gradient: "linear-gradient(135deg, #b8862f, #7a5a1c)",
              },
              {
                tag: "Healthcare",
                title: "Wellcare Connect",
                desc: "Patient portal built for scale, from intake to records.",
                stack: ["Next.js", "PostgreSQL", "Docker"],
                metric: "30,000+ monthly active users",
                gradient: "linear-gradient(135deg, #5c7d68, #34473b)",
              },
              {
                tag: "E-commerce",
                title: "Studio Anara",
                desc: "Headless storefront shared across three regional brands.",
                stack: ["Next.js", "Node.js", "RabbitMQ"],
                metric: "3 brands, 1 codebase",
                gradient: "linear-gradient(135deg, #3c4a3f, #17201d)",
              },
            ].map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <TiltCard>
                  <div className="card card-equal">
                    <div className="work-cover" style={{ background: w.gradient }}>
                      <span>{w.title.charAt(0)}</span>
                    </div>
                    <div className="eyebrow" style={{ marginBottom: 10 }}>{w.tag}</div>
                    <h3 style={{ marginBottom: 10 }}>{w.title}</h3>
                    <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 16 }}>{w.desc}</p>
                    <div style={{ marginBottom: 16 }}>
                      {w.stack.map((s) => (
                        <span className="work-tag-pill" key={s}>{s}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--gold-deep)", fontWeight: 600 }}>
                      ↑ {w.metric}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 560, marginBottom: 48 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Client voices</div>
              <h2>What partners say.</h2>
            </div>
          </Reveal>

          <div className="grid-2">
            {[
              { quote: "Lumen felt like an in-house team from week one — fast, opinionated, and easy to trust with real decisions.", name: "Omar Siddiqui", role: "CEO, Nira Pay" },
              { quote: "The handoff was clean enough that our own engineers picked up the codebase in a single afternoon.", name: "Fatima Raza", role: "CTO, Wellcare Connect" },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <Reveal key={t.name} delay={i * 100}>
                <StackedCard>
                  <div className="card" style={{ background: "var(--ink)" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, marginBottom: 20, lineHeight: 1.4 }}>
                      "{t.quote}"
                    </p>
                    <div className="text-mono" style={{ fontSize: 13, color: "var(--gold-deep)" }}>{t.name}</div>
                    <div className="text-muted" style={{ fontSize: 13.5 }}>{t.role}</div>
                  </div>
                </StackedCard>
              </Reveal>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <Reveal>
            <div style={{ marginBottom: 40 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>FAQ</div>
              <h2>Common questions.</h2>
            </div>
          </Reveal>

          {[
            { q: "How long does a typical project take?", a: "Most single-flow projects ship in 2–4 weeks. Larger, multi-team engagements are scoped on a rolling monthly basis." },
            { q: "Do you work with existing codebases?", a: "Yes — we regularly join projects mid-flight, especially ones already on Next.js, Express, or PostgreSQL." },
            { q: "Can I hire Lumen for design only, or dev only?", a: "Both. Design, engineering, and brand are available standalone or bundled — see the Pricing page for details." },
          ].map((f, i, arr) => (
            <Reveal key={f.q} delay={i * 60}>
              <div>
                <div style={{ padding: "24px 0" }}>
                  <h3 style={{ fontSize: 18, marginBottom: 10 }}>{f.q}</h3>
                  <p className="text-muted">{f.a}</p>
                </div>
                {i < arr.length - 1 && <hr className="divider" />}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* CTA */}
      <section className="section" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <AmbientParticles color={0xc9932a} count={110} />
        <Reveal>
          <div className="container" style={{ maxWidth: 640, position: "relative", zIndex: 1 }}>
            <h2 style={{ marginBottom: 18 }}>Have a project in mind?</h2>
            <p className="lead" style={{ margin: "0 auto 32px" }}>
              Tell us where you're headed — we'll tell you what it takes to get there.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              <Link href="/contact" className="btn btn-primary">Get in touch</Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}