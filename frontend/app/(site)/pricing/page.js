import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "$1,200",
    period: "/ project",
    desc: "For a single, well-scoped page or feature.",
    features: ["1 page or flow", "2 design revisions", "Basic responsive build", "5-day delivery"],
    featured: false,
  },
  {
    name: "Studio",
    price: "$4,800",
    period: "/ month",
    desc: "For teams shipping continuously.",
    features: ["Unlimited requests", "Dedicated design + dev pair", "Weekly delivery cycles", "Component library included", "Priority support"],
    featured: true,
  },
  {
    name: "Partner",
    price: "Custom",
    period: "",
    desc: "For larger, multi-team engagements.",
    features: ["Multiple squads", "Custom SLAs", "On-site workshops", "Quarterly roadmap reviews"],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="section" style={{ paddingTop: 72 }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Pricing</div>
          <h1 style={{ marginBottom: 18 }}>Straightforward plans.</h1>
          <p className="lead" style={{ margin: "0 auto" }}>
            No hidden fees, no surprise scope. Pick what fits and change later as you grow.
          </p>
        </div>

        <div className="grid-3">
          {PLANS.map((p) => (
            <div
              className="card"
              key={p.name}
              style={p.featured ? { borderColor: "var(--gold)", background: "var(--ink-surface-2)" } : {}}
            >
              {p.featured && <div className="eyebrow" style={{ marginBottom: 10 }}>Most popular</div>}
              <h3 style={{ marginBottom: 6 }}>{p.name}</h3>
              <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 20 }}>{p.desc}</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 34 }}>{p.price}</span>
                <span className="text-muted" style={{ fontSize: 14 }}> {p.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ fontSize: 14.5, display: "flex", gap: 10 }}>
                    <span style={{ color: "var(--gold)" }}>—</span>
                    <span className="text-muted">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className={`btn btn-block ${p.featured ? "btn-primary" : "btn-ghost"}`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
