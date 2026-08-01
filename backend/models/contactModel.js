const pool = require("../config/db");

const ContactModel = {
  async create({ name, email, subject, message }) {
    const query = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, subject, message, created_at
    `;
    const { rows } = await pool.query(query, [name, email, subject, message]);
    return rows[0];
  },

  async findAll() {
    const query = `SELECT * FROM contact_messages ORDER BY created_at DESC`;
    const { rows } = await pool.query(query);
    return rows;
  },
};

module.exports = ContactModel;
