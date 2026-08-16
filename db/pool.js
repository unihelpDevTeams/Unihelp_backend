import pg from "pg";

const { Pool } = pg;

let pool = null;

export const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for PostgreSQL-backed routes");
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.PGSSLMODE === "disable" || process.env.NODE_ENV === "development"
          ? false
          : { rejectUnauthorized: false },
    });
  }

  return pool;
};

export const query = (text, params) => getPool().query(text, params);
