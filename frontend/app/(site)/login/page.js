"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      localStorage.setItem("lumen_token", data.token);
      localStorage.setItem("lumen_user", JSON.stringify(data.user));
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Log in to Lumen"
      subtitle="Enter your details to access your dashboard."
      footer={
        <>
          Don't have an account? <Link href="/signup" style={{ color: "var(--gold-soft)" }}>Sign up</Link>
        </>
      }
    >
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={onChange} placeholder="••••••••" />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}