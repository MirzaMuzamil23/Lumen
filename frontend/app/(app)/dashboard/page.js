"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArcMark from "@/components/ArcMark";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";

const ACTIVITY = [
  { time: "2 hours ago", text: "Logged in from a new device", tag: "Security" },
  { time: "Yesterday", text: "Contact message sent to the studio", tag: "Message" },
  { time: "3 days ago", text: "Account created", tag: "Account" },
];

const WEEK_USAGE = [40, 65, 30, 80, 55, 90, 45];

const STATUS_LABEL = {
  planning: "Planning",
  in_progress: "In progress",
  review: "In review",
  completed: "Completed",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "there";

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lumen_token");
    api
      .myProjects(token)
      .then((data) => setProjects(data.data))
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
  }, []);

  const activeCount = projects.filter((p) => p.status !== "completed").length;

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ marginBottom: 36 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Dashboard</div>
          <h1 style={{ fontSize: 28 }}>Welcome back, {firstName}.</h1>
        </div>

        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { label: "Active projects", value: String(activeCount) },
            { label: "Messages sent", value: "12" },
            { label: "Days active", value: "24" },
            { label: "Plan usage", value: "68%" },
          ].map((s) => (
            <div className="card" key={s.label} style={{ padding: 24 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--gold-deep)" }}>
                {s.value}
              </div>
              <div className="text-muted" style={{ fontSize: 13.5, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }} className="dashboard-main">
          <style>{`
            @media (max-width: 900px) { .dashboard-main { grid-template-columns: 1fr !important; } }
          `}</style>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* My projects — real data from the backend */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 17 }}>My projects</h3>
                <span className="text-mono text-muted" style={{ fontSize: 12 }}>Live data</span>
              </div>

              {projectsLoading ? (
                <div className="text-muted" style={{ fontSize: 14 }}>Loading…</div>
              ) : projects.length === 0 ? (
                <div className="text-muted" style={{ fontSize: 14 }}>
                  No projects yet — your studio contact will add one once work begins.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {projects.map((p) => (
                    <div key={p.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 14.5 }}>{p.name}</span>
                        <span className="text-mono text-muted" style={{ fontSize: 12 }}>
                          {STATUS_LABEL[p.status]} · {p.progress}%
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 20, background: "var(--ink-surface-2)", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${p.progress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, var(--gold-soft), var(--gold-deep))",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly activity mini chart */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 17 }}>Weekly activity</h3>
                <span className="text-mono text-muted" style={{ fontSize: 12 }}>Last 7 days</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
                {WEEK_USAGE.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: "100%",
                        height: `${v}%`,
                        borderRadius: 3,
                        background: i === 5 ? "var(--gold)" : "var(--ink-surface-2)",
                        border: "1px solid var(--border-strong)",
                      }}
                    />
                    <span className="text-mono text-muted" style={{ fontSize: 11 }}>
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity timeline */}
            <div className="card">
              <h3 style={{ fontSize: 17, marginBottom: 22 }}>Recent activity</h3>
              <div>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, paddingBottom: i < ACTIVITY.length - 1 ? 22 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--gold)", marginTop: 4 }} />
                      {i < ACTIVITY.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 6 }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: 4 }}>
                      <div style={{ fontSize: 14.5, marginBottom: 4 }}>{a.text}</div>
                      <div className="text-muted text-mono" style={{ fontSize: 12 }}>
                        {a.tag} · {a.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 14 }}>Account</div>
              <div style={{ marginBottom: 6 }}>{user?.full_name}</div>
              <div className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>{user?.email}</div>
              <hr className="divider" style={{ margin: "16px 0" }} />
              <div className="text-muted" style={{ fontSize: 13 }}>Member since</div>
              <div style={{ fontSize: 14.5 }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
              </div>
            </div>

            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 16 }}>Quick actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/dashboard/profile" className="btn btn-ghost btn-block">Edit profile</Link>
                <Link href="/dashboard/security" className="btn btn-ghost btn-block">Change password</Link>
                <Link href="/dashboard/invoices" className="btn btn-ghost btn-block">View invoices</Link>
                <Link href="/contact" className="btn btn-ghost btn-block">Contact support</Link>
              </div>
            </div>

            <div className="card">
              <div className="eyebrow" style={{ marginBottom: 16 }}>Notifications</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { text: "Your profile was updated.", time: "Today" },
                  { text: "New feature: dark-mode invoices.", time: "3d ago" },
                ].map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13.5 }}>{n.text}</div>
                      <div className="text-muted text-mono" style={{ fontSize: 11 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
              <ArcMark size={90} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}