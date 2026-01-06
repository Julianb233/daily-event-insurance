
import { config } from 'dotenv'
config({ path: '.env.local' })
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { partners } from "../lib/db/schema"

async function testConnection() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        console.log("No DATABASE_URL")
        return
    }

    console.log("Testing with ssl: 'require'...")
    try {
        const client = postgres(connectionString, { ssl: 'require' })
        const db = drizzle(client)
        const result = await db.select().from(partners).limit(1)
        console.log("✅ SSL 'require' worked. Result:", result.length)
        await client.end()
    } catch (e) {
        console.log("❌ SSL 'require' failed:", e.message)
    }

    console.log("Testing with ssl: false...")
    try {
        const client2 = postgres(connectionString, { ssl: false })
        const db2 = drizzle(client2)
        const result2 = await db2.select().from(partners).limit(1)
        console.log("✅ SSL false worked. Result:", result2.length)
        await client2.end()
    } catch (e) {
        console.log("❌ SSL false failed:", e.message)
    }
}

testConnection()
