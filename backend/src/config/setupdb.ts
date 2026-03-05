import fs from 'fs';
import path from 'path';
import pool from './db.js'; // Your pg Pool

export const setupDatabase = async () => {
  try {
    // Look for the SQL file we copied into the Docker image
    const sqlPath = path.join(__dirname, '../sql/init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Database init failed:", err);
  }
};