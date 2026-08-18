const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),
  updateProfile: (token, payload) => request("/auth/me", { method: "PATCH", body: payload, token }),
  changePassword: (token, payload) => request("/auth/change-password", { method: "PATCH", body: payload, token }),
  listUsers: (token) => request("/auth/users", { token }),
  updateUserRole: (token, userId, role) =>
    request(`/auth/users/${userId}/role`, { method: "PATCH", body: { role }, token }),
  deleteUser: (token, userId) => request(`/auth/users/${userId}`, { method: "DELETE", token }),
  contact: (payload) => request("/contact", { method: "POST", body: payload }),
  // Projects
  listAllProjects: (token) => request("/projects", { token }),
  myProjects: (token) => request("/projects/mine", { token }),
  createProject: (token, payload) => request("/projects", { method: "POST", body: payload, token }),
  updateProject: (token, id, payload) => request(`/projects/${id}`, { method: "PATCH", body: payload, token }),
  deleteProject: (token, id) => request(`/projects/${id}`, { method: "DELETE", token }),
};