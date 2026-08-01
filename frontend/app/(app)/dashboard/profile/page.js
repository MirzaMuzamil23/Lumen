"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      const token = localStorage.getItem("lumen_token");
      await api.updateProfile(token, { fullName });
      await refreshUser();
      setStatus({ type: "success", text: "Profile updated successfully." });
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
        <h1 style={{ fontSize: 28, marginBottom: 32 }}>Edit profile</h1>

        <div className="card">
          {status.type === "success" && <div className="form-success">{status.text}</div>}
          {status.type === "error" && <div className="form-error">{status.text}</div>}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" value={user?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
              <p className="text-muted" style={{ fontSize: 12.5, marginTop: 6 }}>
                Email changes aren't supported yet.
              </p>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
