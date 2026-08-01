"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function SecurityPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", text: "New passwords don't match." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("lumen_token");
      await api.changePassword(token, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setStatus({ type: "success", text: "Password updated successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Account</div>
        <h1 style={{ fontSize: 28, marginBottom: 32 }}>Security</h1>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Change password</h3>

          {status.type === "success" && <div className="form-success">{status.text}</div>}
          {status.type === "error" && <div className="form-error">{status.text}</div>}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="currentPassword">Current password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={form.currentPassword}
                onChange={onChange}
              />
            </div>
            <div className="field">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                value={form.newPassword}
                onChange={onChange}
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={onChange}
              />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}