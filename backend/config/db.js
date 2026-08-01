const { Pool } = require("pg");
require("dotenv").config();

// Central PostgreSQL connection pool.
// All models import this instead of creating their own connections.
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

pool.on("connect", () => {
  console.log("PostgreSQL pool: new client connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
  process.exit(1);
});

module.exports = pool;
