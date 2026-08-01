"use client";

import { useState } from "react";
import ArcMark from "@/components/ArcMark";
import { api } from "@/lib/api";

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
    <section className="section">
      <div className="container grid-2">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Get in touch</div>
          <h2 style={{ marginBottom: 18 }}>Let's talk about your project.</h2>
          <p className="text-muted" style={{ marginBottom: 32, maxWidth: 44 + "ch" }}>
            Whether you have a scoped brief or a rough idea, tell us about it —
            we typically reply within one business day.
          </p>

          <div style={{ marginBottom: 24 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Email</div>
            <div>hello@lumen.studio</div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Studio</div>
            <div>Karachi, Pakistan</div>
          </div>

          <ArcMark size={100} />
        </div>

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
      </div>
    </section>
  );
}
