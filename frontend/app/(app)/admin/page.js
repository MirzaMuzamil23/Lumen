"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import DonutChart from "@/components/DonutChart";
import AdvancedBarChart from "@/components/AdvancedBarChart";

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildSignupSeries(users) {
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const day = daysAgo(6 - i);
    return { day, count: 0 };
  });
  users.forEach((u) => {
    const created = new Date(u.created_at);
    created.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.day.getTime() === created.getTime());
    if (bucket) bucket.count += 1;
  });
  return buckets;
}

function downloadCSV(users) {
  const header = "ID,Full Name,Email,Role,Joined\n";
  const rows = users
    .map((u) => `${u.id},"${u.full_name}",${u.email},${u.role},${new Date(u.created_at).toISOString()}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lumen-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, regular: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [projectForm, setProjectForm] = useState({ name: "", clientId: "", status: "planning", progress: 0 });
  const [creatingProject, setCreatingProject] = useState(false);

  const loadUsers = async () => {
    const token = localStorage.getItem("lumen_token");
    const data = await api.listUsers(token);
    setUsers(data.data);
    setStats(data.stats);
  };

  const loadProjects = async () => {
    const token = localStorage.getItem("lumen_token");
    const data = await api.listAllProjects(token);
    setProjects(data.data);
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (!user) return;

    loadUsers()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    loadProjects()
      .catch((err) => setProjectError(err.message))
      .finally(() => setProjectsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const signupSeries = useMemo(() => buildSignupSeries(users), [users]);
  const maxSignups = Math.max(1, ...signupSeries.map((b) => b.count));
  const recentSignups = useMemo(
    () => [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [users]
  );
  const adminPct = stats.total ? Math.round((stats.admins / stats.total) * 100) : 0;

  const projectStatusData = useMemo(() => {
    const labels = { planning: "Planning", in_progress: "In progress", review: "Review", completed: "Completed" };
    const counts = { planning: 0, in_progress: 0, review: 0, completed: 0 };
    projects.forEach((p) => {
      if (counts[p.status] !== undefined) counts[p.status] += 1;
    });
    return Object.keys(labels).map((key) => ({ label: labels[key], value: counts[key] }));
  }, [projects]);

  const toggleRole = async (target) => {
    setActionError("");
    setBusyId(target.id);
    try {
      const token = localStorage.getItem("lumen_token");
      const newRole = target.role === "admin" ? "user" : "admin";
      await api.updateUserRole(token, target.id, newRole);
      await loadUsers();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (target) => {
    if (!confirm(`Delete ${target.full_name}? This can't be undone.`)) return;
    setActionError("");
    setBusyId(target.id);
    try {
      const token = localStorage.getItem("lumen_token");
      await api.deleteUser(token, target.id);
      await loadUsers();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.clientId) return;
    setProjectError("");
    setCreatingProject(true);
    try {
      const token = localStorage.getItem("lumen_token");
      await api.createProject(token, {
        name: projectForm.name,
        clientId: Number(projectForm.clientId),
        status: projectForm.status,
        progress: Number(projectForm.progress),
      });
      setProjectForm({ name: "", clientId: "", status: "planning", progress: 0 });
      await loadProjects();
    } catch (err) {
      setProjectError(err.message);
    } finally {
      setCreatingProject(false);
    }
  };

  const updateProjectField = async (project, field, value) => {
    setProjectError("");
    try {
      const token = localStorage.getItem("lumen_token");
      await api.updateProject(token, project.id, { [field]: value });
      await loadProjects();
    } catch (err) {
      setProjectError(err.message);
    }
  };

  const removeProject = async (project) => {
    if (!confirm(`Delete project "${project.name}"?`)) return;
    setProjectError("");
    try {
      const token = localStorage.getItem("lumen_token");
      await api.deleteProject(token, project.id);
      await loadProjects();
    } catch (err) {
      setProjectError(err.message);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <section className="section">
        <div className="container text-muted">Checking access…</div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Admin</div>
            <h1 style={{ fontSize: 28 }}>User management</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => downloadCSV(filtered)} style={{ padding: "10px 18px" }}>
            Export CSV
          </button>
        </div>

        <div className="grid-3" style={{ marginBottom: 24 }}>
          <div className="card">
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--gold-deep)" }}>{stats.total}</div>
            <div className="text-muted" style={{ fontSize: 13.5, marginTop: 6 }}>Total users</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--gold-deep)" }}>{stats.admins}</div>
            <div className="text-muted" style={{ fontSize: 13.5, marginTop: 6 }}>Admins</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--gold-deep)" }}>{stats.regular}</div>
            <div className="text-muted" style={{ fontSize: 13.5, marginTop: 6 }}>Regular users</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 24, gap: 24 }}>
          <div className="card">
            <AdvancedBarChart
              data={signupSeries.map((b) => ({
                label: b.day.toLocaleDateString(undefined, { weekday: "short" }),
                value: b.count,
              }))}
            />
            <DonutChart
              data={[
                { label: "Admins", value: stats.admins, color: "#c9932a" },
                { label: "Regular users", value: stats.regular, color: "#5c7d68" },
              ]}
              size={140}
            />
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Role distribution</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span className="text-muted">Admins</span>
              <span className="text-mono">{adminPct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 20, background: "var(--ink-surface-2)", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ width: `${adminPct}%`, height: "100%", background: "var(--gold)" }} />
            </div>

            <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Recent signups</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentSignups.map((u) => (
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{u.full_name}</span>
                  <span className="text-muted text-mono" style={{ fontSize: 11 }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 220,
              background: "var(--ink-surface-2)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius)",
              padding: "11px 14px",
              color: "var(--porcelain)",
              fontSize: 14.5,
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "admin", "user"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={roleFilter === r ? "btn btn-primary" : "btn btn-ghost"}
                style={{ padding: "9px 16px", fontSize: 13, textTransform: "capitalize" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {actionError && <div className="form-error">{actionError}</div>}

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div className="text-muted" style={{ padding: 32 }}>Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="text-muted" style={{ padding: 32 }}>No users match your search.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "14px 20px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--porcelain-muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const isSelf = u.id === user.id;
                  const isBusy = busyId === u.id;
                  return (
                    <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--porcelain-muted)" }}>
                        #{u.id}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 14.5 }}>
                        {u.full_name} {isSelf && <span className="text-muted" style={{ fontSize: 12 }}>(you)</span>}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--porcelain-muted)" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          className="text-mono"
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 20,
                            border: "1px solid var(--border-strong)",
                            color: u.role === "admin" ? "var(--gold-deep)" : "var(--sage)",
                          }}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--porcelain-muted)" }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "6px 12px", fontSize: 12 }}
                            disabled={isSelf || isBusy}
                            onClick={() => toggleRole(u)}
                            title={isSelf ? "You can't change your own role" : ""}
                          >
                            {u.role === "admin" ? "Demote" : "Promote"}
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: "6px 12px", fontSize: 12, color: isSelf ? undefined : "var(--danger)" }}
                            disabled={isSelf || isBusy}
                            onClick={() => removeUser(u)}
                            title={isSelf ? "You can't delete your own account" : ""}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16 }}>Project pipeline</h3>
            <span className="text-mono text-muted" style={{ fontSize: 11 }}>{projects.length} total</span>
          </div>
          <AdvancedBarChart data={projectStatusData} color="#5c7d68" height={130} />
        </div>

        {/* Projects section — client project tracking */}
        <div style={{ marginTop: 48, marginBottom: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Client work</div>
          <h2 style={{ fontSize: 24 }}>Projects</h2>
        </div>

        {projectError && <div className="form-error">{projectError}</div>}

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 18 }}>New project</h3>
          <form onSubmit={createProject} className="form-grid-5">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Client</label>
              <select
                value={projectForm.clientId}
                onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                required
                style={{
                  width: "100%",
                  background: "var(--input-bg)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius)",
                  padding: "13px 14px",
                  fontSize: 14.5,
                  color: "var(--porcelain)",
                }}
              >
                <option value="">Select a user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                style={{
                  width: "100%",
                  background: "var(--input-bg)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius)",
                  padding: "13px 14px",
                  fontSize: 14.5,
                  color: "var(--porcelain)",
                }}
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Progress %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={projectForm.progress}
                onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={creatingProject} style={{ height: 47 }}>
              {creatingProject ? "Adding…" : "Add"}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {projectsLoading ? (
            <div className="text-muted" style={{ padding: 32 }}>Loading projects…</div>
          ) : projects.length === 0 ? (
            <div className="text-muted" style={{ padding: 32 }}>No projects yet — add one above.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Project", "Client", "Status", "Progress", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "14px 20px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--porcelain-muted)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14.5 }}>{p.name}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: "var(--porcelain-muted)" }}>
                      {p.client_name}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <select
                        value={p.status}
                        onChange={(e) => updateProjectField(p, "status", e.target.value)}
                        className="text-mono"
                        style={{
                          fontSize: 12,
                          padding: "5px 10px",
                          borderRadius: 20,
                          border: "1px solid var(--border-strong)",
                          background: "var(--input-bg)",
                          color: "var(--gold-deep)",
                        }}
                      >
                        <option value="planning">Planning</option>
                        <option value="in_progress">In progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 20px", minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 20, background: "var(--ink-surface-2)", overflow: "hidden" }}>
                          <div style={{ width: `${p.progress}%`, height: "100%", background: "linear-gradient(90deg, var(--gold-soft), var(--gold-deep))" }} />
                        </div>
                        <span className="text-mono text-muted" style={{ fontSize: 11.5 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "6px 12px", fontSize: 12, color: "var(--danger)" }}
                        onClick={() => removeProject(p)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}