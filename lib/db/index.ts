import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Check if database is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL

// Create database connection
function createDb() {
  if (!isDatabaseConfigured) {
    console.log("[DB] Database not configured - mock mode active")
    return null
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase (usually)
  })
  return drizzle(pool, { schema })
}

export const db = createDb()

// Export schema for use in queries
export * from "./schema"

// Helper to check if DB is available
export function isDbConfigured() {
  return isDatabaseConfigured && db !== null
}
