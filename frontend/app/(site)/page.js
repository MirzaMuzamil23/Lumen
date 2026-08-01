import Link from "next/link";
import ArcMark from "@/components/ArcMark";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop: 88 }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Digital product studio</div>
            <h1 style={{ marginBottom: 24 }}>
              We build the details<br />others skip.
            </h1>
            <p className="lead" style={{ marginBottom: 36 }}>
              Lumen partners with founders and teams to design and ship products
              that feel considered from the first pixel to the last line of code.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <Link href="/signup" className="btn btn-primary">Start a project</Link>
              <Link href="/services" className="btn btn-ghost">See our work</Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <ArcMark size={280} />
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Stats strip */}
      <section className="section-tight">
        <div className="container grid-4">
          {[
            ["120+", "Products shipped"],
            ["98%", "Client retention"],
            ["6 yrs", "In practice"],
            ["14", "Countries served"],
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--gold-soft)" }}>{num}</div>
              <div className="text-muted" style={{ fontSize: 14.5, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Services preview */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>What we do</div>
            <h2>Three disciplines, one team.</h2>
          </div>

          <div className="grid-3">
            {[
              {
                title: "Product design",
                desc: "Interfaces engineered for clarity — wireframes through to production-ready component libraries.",
              },
              {
                title: "Full-stack engineering",
                desc: "Next.js frontends and Express/PostgreSQL backends built to scale past the first thousand users.",
              },
              {
                title: "Brand systems",
                desc: "Typography, color, and voice that hold together across every surface your customers see.",
              },
            ].map((s) => (
              <div className="card" key={s.title}>
                <h3 style={{ marginBottom: 12 }}>{s.title}</h3>
                <p className="text-muted" style={{ fontSize: 15 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Process */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>How we work</div>
            <h2>Four steps, no surprises.</h2>
          </div>

          <div>
            {[
              { num: "01", title: "Discover", desc: "A short sprint to learn your users, constraints, and what success looks like for your team." },
              { num: "02", title: "Design", desc: "Wireframes through to high-fidelity UI, reviewed with you at every stage — not revealed once at the end." },
              { num: "03", title: "Build", desc: "Next.js frontend, Express/PostgreSQL backend, shipped in weekly cycles so you see real progress early." },
              { num: "04", title: "Launch & support", desc: "We stay on after launch — monitoring, fixes, and iteration based on real usage data." },
            ].map((s, i, arr) => (
              <div key={s.num}>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 32, padding: "30px 0" }}>
                  <div style={{ fontFamily: "var(--font-mono)", color: "var(--gold)", fontSize: 15 }}>{s.num}</div>
                  <div>
                    <h3 style={{ marginBottom: 8 }}>{s.title}</h3>
                    <p className="text-muted" style={{ maxWidth: "56ch" }}>{s.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && <hr className="divider" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Selected work */}
      <section className="section">
  <div className="container">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
      <div style={{ maxWidth: 520 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Selected work</div>
        <h2>Recent engagements.</h2>
      </div>
      <Link href="/services" className="btn btn-ghost">View all services</Link>
    </div>

    <div className="grid-3">
      {[
        { 
          tag: "Fintech", 
          title: "Nira Pay", 
          desc: "Full rebrand and dashboard redesign for a payments platform, cutting onboarding time by 40%.",
          // Dark moody financial data visualization / glowing charts
          image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=800&auto=format&fit=crop"
        },
        { 
          tag: "Healthcare", 
          title: "Wellcare Connect", 
          desc: "Patient portal built on Next.js and PostgreSQL, serving 30,000+ monthly active users.",
          // Futuristic dark neon pulse wave / medical telemetry vibe
          image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop"
        },
        { 
          tag: "E-commerce", 
          title: "Studio Anara", 
          desc: "Headless storefront with a custom component library used across three regional brands.",
          // Minimalist luxury design architecture / dark studio aesthetic
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
        },
      ].map((w) => (
        <div className="card" key={w.title}>
          <div 
            style={{ 
              height: 140, 
              borderRadius: 4, 
              border: "1px solid var(--border)", 
              marginBottom: 20,
              overflow: "hidden" 
            }}
          >
            <img 
              src={w.image} 
              alt={w.title} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                filter: "brightness(0.9) contrast(1.1)" // Enhances the deep contrast & luxury feel
              }} 
            />
          </div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{w.tag}</div>
          <h3 style={{ marginBottom: 10 }}>{w.title}</h3>
          <p className="text-muted" style={{ fontSize: 14.5 }}>{w.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
      <hr className="divider" />

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Client voices</div>
            <h2>What partners say.</h2>
          </div>

          <div className="grid-2">
            {[
              { quote: "Lumen felt like an in-house team from week one — fast, opinionated, and easy to trust with real decisions.", name: "Omar Siddiqui", role: "CEO, Nira Pay" },
              { quote: "The handoff was clean enough that our own engineers picked up the codebase in a single afternoon.", name: "Fatima Raza", role: "CTO, Wellcare Connect" },
            ].map((t) => (
              <div className="card" key={t.name}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, marginBottom: 20, lineHeight: 1.4 }}>
                  "{t.quote}"
                </p>
                <div className="text-mono" style={{ fontSize: 13, color: "var(--gold-soft)" }}>{t.name}</div>
                <div className="text-muted" style={{ fontSize: 13.5 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>FAQ</div>
            <h2>Common questions.</h2>
          </div>

          {[
            { q: "How long does a typical project take?", a: "Most single-flow projects ship in 2–4 weeks. Larger, multi-team engagements are scoped on a rolling monthly basis." },
            { q: "Do you work with existing codebases?", a: "Yes — we regularly join projects mid-flight, especially ones already on Next.js, Express, or PostgreSQL." },
            { q: "Can I hire Lumen for design only, or dev only?", a: "Both. Design, engineering, and brand are available standalone or bundled — see the Pricing page for details." },
          ].map((f, i, arr) => (
            <div key={f.q}>
              <div style={{ padding: "24px 0" }}>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{f.q}</h3>
                <p className="text-muted">{f.a}</p>
              </div>
              {i < arr.length - 1 && <hr className="divider" />}
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <h2 style={{ marginBottom: 18 }}>Have a project in mind?</h2>
          <p className="lead" style={{ margin: "0 auto 32px" }}>
            Tell us where you're headed — we'll tell you what it takes to get there.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link href="/contact" className="btn btn-primary">Get in touch</Link>
            <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
