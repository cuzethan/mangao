import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './db.js';

// --- ES Module __dirname Shim ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupDatabase = async () => {
  try {
    /**
     * PATH EXPLANATION:
     * Your code is running from: /app/dist/config/setupdb.js
     * Your SQL is located at:    /app/sql/init-db.sql
     * So we go up twice: .. (to dist) and .. (to app)
     */
    const sqlPath = path.resolve(__dirname, '../../sql/init-db.sql');
    
    console.log(`Reading SQL from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Database init failed:", err);
  }
};