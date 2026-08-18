const pool = require("../config/db");

const ProjectModel = {
  // Admin: every project, with client name/email attached.
  async findAll() {
    const query = `
      SELECT p.*, u.full_name AS client_name, u.email AS client_email
      FROM projects p
      JOIN users u ON u.id = p.client_id
      ORDER BY p.updated_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // A specific user's own projects.
  async findByClientId(clientId) {
    const query = `
      SELECT * FROM projects
      WHERE client_id = $1
      ORDER BY updated_at DESC
    `;
    const { rows } = await pool.query(query, [clientId]);
    return rows;
  },

  async create({ name, clientId, status, progress, notes }) {
    const query = `
      INSERT INTO projects (name, client_id, status, progress, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name,
      clientId,
      status || "planning",
      progress || 0,
      notes || null,
    ]);
    return rows[0];
  },

  async update(id, { name, status, progress, notes }) {
    const query = `
      UPDATE projects
      SET name = COALESCE($1, name),
          status = COALESCE($2, status),
          progress = COALESCE($3, progress),
          notes = COALESCE($4, notes),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name, status, progress, notes, id]);
    return rows[0];
  },

  async deleteById(id) {
    const { rows } = await pool.query(
      `DELETE FROM projects WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0];
  },
};

module.exports = ProjectModel;