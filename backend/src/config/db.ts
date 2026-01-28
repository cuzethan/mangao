import { Pool } from "pg"

const pool = new Pool({
    max: 20, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,
})

// Export the query method to be used site-wide
export const sendQuery = async (text: string, params?: any[]) => {
    if (params) { return pool.query(text, params); }
    else return pool.query(text);
}

export default pool;