
import { config } from "dotenv"
config({ path: ".env.local" })
import { Pool } from "pg"

async function main() {
    console.log("Testing raw pg connection...");
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const client = await pool.connect();
        console.log("Connected to DB");

        // Test Select
        const res = await client.query('SELECT now()');
        console.log("SELECT now() result:", res.rows[0]);

        // Test Table Select
        const users = await client.query('SELECT * FROM users LIMIT 1');
        console.log("Users count:", users.rowCount);

        client.release();
    } catch (err) {
        console.error("PG Error:", err);
    } finally {
        await pool.end();
    }
}

main();
