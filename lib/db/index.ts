import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

// Check if database is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL

// Create database connection
function createDb() {
  if (!isDatabaseConfigured) {
    console.log("[DB] Database not configured - mock mode active")
    return null
  }

  const sql = neon(process.env.DATABASE_URL!)
  return drizzle(sql, { schema })
}

export const db = createDb()

// Export schema for use in queries
export * from "./schema"

// Helper to check if DB is available
export function isDbConfigured() {
  return isDatabaseConfigured && db !== null
}
