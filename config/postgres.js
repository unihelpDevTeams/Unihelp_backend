import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Setup Notifications Table
export const setupDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        type VARCHAR(100) DEFAULT 'general',
        url VARCHAR(255),
        announcement_id VARCHAR(255),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create index on user_id for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    `);
    
    console.log("PostgreSQL Database connected and notifications table ready.");
    client.release();
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
  }
};
