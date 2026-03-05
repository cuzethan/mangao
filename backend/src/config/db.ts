import { Pool } from "pg"

const pool = new Pool({
    //connection string from railways
    connectionString: process.env.DATABASE_URL,

    //if conneciton string DNE< use env variables for local dev
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT) || 5432,

    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,
})

// Export the query method to be used site-wide
export const sendQuery = async (text: string, params?: any[]) => {
    if (params) { return pool.query(text, params); }
    else return pool.query(text);
}

export default pool;