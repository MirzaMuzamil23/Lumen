"use client";

import { useState } from "react";
import Link from "next/link";
import AuthSplit from "@/components/AuthSplit";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setDevResetUrl("");
    setLoading(true);
    try {
      const data = await api.forgotPassword({ email });
      setStatus({ type: "success", text: data.message });
      if (data.resetUrl) setDevResetUrl(data.resetUrl);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      eyebrow="Reset password"
      title="Forgot your password?"
      subtitle="Enter your account email and we'll generate a reset link."
      footer={
        <>
          Remembered it? <Link href="/login" style={{ color: "var(--gold-deep)" }}>Log in</Link>
        </>
      }
    >
      {status.type === "success" && <div className="form-success">{status.text}</div>}
      {status.type === "error" && <div className="form-error">{status.text}</div>}

      {devResetUrl && (
        <div className="card" style={{ padding: 16, marginBottom: 20, background: "var(--ink-surface-2)" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Dev mode — no email service connected</div>
          <p style={{ fontSize: 13.5, marginBottom: 10 }}>
            In production this link would be emailed to you. For now, use it directly:
          </p>
          <Link href={devResetUrl.replace(/^https?:\/\/[^/]+/, "")} className="text-mono" style={{ fontSize: 12.5, color: "var(--gold-deep)", wordBreak: "break-all" }}>
            {devResetUrl}
          </Link>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthSplit>
  );
}