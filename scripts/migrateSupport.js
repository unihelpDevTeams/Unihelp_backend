import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const query = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR,
      subject VARCHAR NOT NULL,
      message TEXT NOT NULL,
      user_id VARCHAR,
      status VARCHAR DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR,
      display_name VARCHAR,
      email VARCHAR,
      report_type VARCHAR NOT NULL,
      title VARCHAR NOT NULL,
      description TEXT NOT NULL,
      attachments JSONB DEFAULT '[]'::jsonb,
      status VARCHAR DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR,
      title VARCHAR NOT NULL,
      category VARCHAR NOT NULL,
      description TEXT,
      status VARCHAR DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS support_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      entity_type VARCHAR NOT NULL,
      entity_id UUID NOT NULL,
      admin_id VARCHAR NOT NULL,
      admin_name VARCHAR,
      note TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("Creating support tables...");
    await pool.query(query);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await pool.end();
  }
}

run();
