"use client";

import { useState } from "react";
import Link from "next/link";
import ArcMark from "@/components/ArcMark";
import Reveal from "@/components/Reveal";
import { api } from "@/lib/api";

const MINI_FAQ = [
  { q: "How fast do you reply?", a: "Within one business day, usually sooner." },
  { q: "Do you take calls before a contract?", a: "Yes — a free 20-minute intro call to see if we're a fit." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      await api.contact(form);
      setStatus({ type: "success", text: "Thanks — your message has been sent. We'll reply within a day." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="section" style={{ paddingTop: 72 }}>
        <div className="container grid-2">
          <Reveal>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Get in touch</div>
              <h2 style={{ marginBottom: 18 }}>Let's talk about your project.</h2>
              <p className="text-muted" style={{ marginBottom: 32, maxWidth: 44 + "ch" }}>
                Whether you have a scoped brief or a rough idea, tell us about it —
                we typically reply within one business day.
              </p>

              <div className="grid-2" style={{ gap: 24, marginBottom: 32 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Email</div>
                  <div>hello@lumen.studio</div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Studio</div>
                  <div>Karachi, Pakistan</div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Office hours</div>
                  <div className="text-muted" style={{ fontSize: 14.5 }}>Mon–Fri, 10am–6pm PKT</div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>Response time</div>
                  <div className="text-muted" style={{ fontSize: 14.5 }}>Under 24 hours</div>
                </div>
              </div>

              <ArcMark size={100} />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card">
              {status.type === "success" && <div className="form-success">{status.text}</div>}
              {status.type === "error" && <div className="form-error">{status.text}</div>}

              <form onSubmit={onSubmit}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" required value={form.name} onChange={onChange} placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="you@example.com" />
                </div>
                <div className="field">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" value={form.subject} onChange={onChange} placeholder="What's this about?" />
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required value={form.message} onChange={onChange} placeholder="Tell us a bit about your project…" />
                </div>
                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                  {loading ? "Sending…" : "Send message"}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 700 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 24 }}>Quick answers</div>
          </Reveal>
          {MINI_FAQ.map((f, i, arr) => (
            <Reveal key={f.q} delay={i * 60}>
              <div>
                <div style={{ padding: "18px 0" }}>
                  <h3 style={{ fontSize: 16, marginBottom: 6 }}>{f.q}</h3>
                  <p className="text-muted" style={{ fontSize: 14 }}>{f.a}</p>
                </div>
                {i < arr.length - 1 && <hr className="divider" />}
              </div>
            </Reveal>
          ))}
          <p className="text-muted" style={{ marginTop: 20, fontSize: 14 }}>
            More questions? Visit the full <Link href="/faq" style={{ color: "var(--gold-deep)" }}>FAQ page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}