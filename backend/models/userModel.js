const pool = require("../config/db");

const UserModel = {
  async create({ fullName, email, passwordHash }) {
    const query = `
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, role, created_at
    `;
    const { rows } = await pool.query(query, [fullName, email, passwordHash]);
    return rows[0];
  },

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  async findById(id) {
    const query = `SELECT id, full_name, email, role, created_at FROM users WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
  // Includes password_hash — only for internal use (e.g. verifying current password).
  async findByIdFull(id) {
    const query = `SELECT * FROM users WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Admin only: list every user, most recent first.
  async findAll() {
    const query = `
      SELECT id, full_name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async updateProfile(id, { fullName }) {
    const query = `
      UPDATE users
      SET full_name = $1
      WHERE id = $2
      RETURNING id, full_name, email, role, created_at
    `;
    const { rows } = await pool.query(query, [fullName, id]);
    return rows[0];
  },

  async countAll() {
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS count FROM users`);
    return rows[0].count;
  },
  // Admin only: promote/demote a user.
  async updateRole(id, role) {
    const query = `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, full_name, email, role, created_at
    `;
    const { rows } = await pool.query(query, [role, id]);
    return rows[0];
  },

  // Admin only: remove a user entirely.
  async deleteById(id) {
    const { rows } = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows[0];
  },

  async updatePassword(id, passwordHash) {
    await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
      passwordHash,
      id,
    ]);
  },
  async setResetToken(id, tokenHash, expiresAt) {
    await pool.query(
      `UPDATE users SET reset_token_hash = $1, reset_token_expires = $2 WHERE id = $3`,
      [tokenHash, expiresAt, id]
    );
  },

  async findByResetTokenHash(tokenHash) {
    const query = `
      SELECT * FROM users
      WHERE reset_token_hash = $1 AND reset_token_expires > NOW()
    `;
    const { rows } = await pool.query(query, [tokenHash]);
    return rows[0];
  },

  async clearResetToken(id) {
    await pool.query(
      `UPDATE users SET reset_token_hash = NULL, reset_token_expires = NULL WHERE id = $1`,
      [id]
    );
  },
};

module.exports = UserModel;