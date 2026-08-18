"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthSplit from "@/components/AuthSplit";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", text: "Passwords don't match." });
      return;
    }
    if (!token) {
      setStatus({ type: "error", text: "Missing or invalid reset link." });
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ token, newPassword: form.newPassword });
      setStatus({ type: "success", text: "Password reset! Redirecting to login…" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      eyebrow="Reset password"
      title="Choose a new password"
      subtitle="Make it something you haven't used before."
      footer={
        <>
          Back to <Link href="/login" style={{ color: "var(--gold-deep)" }}>Log in</Link>
        </>
      }
    >
      {status.type === "success" && <div className="form-success">{status.text}</div>}
      {status.type === "error" && <div className="form-error">{status.text}</div>}

      {!token && (
        <div className="form-error">
          No reset token found in the URL. Use the link from your "forgot password" request.
        </div>
      )}

      <form onSubmit={onSubmit}>
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
        <button className="btn btn-primary btn-block" type="submit" disabled={loading || !token}>
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </AuthSplit>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}