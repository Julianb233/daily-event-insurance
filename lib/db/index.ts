import { drizzle as drizzleNeon } from "drizzle-orm/neon-http"
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres"
import { neon } from "@neondatabase/serverless"
import { Pool } from "pg"
import * as schema from "./schema"

// Check if database is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL

// Detect if using Supabase (contains supabase.co) or Neon
const isSupabase = process.env.DATABASE_URL?.includes("supabase.co")

// Create database connection
function createDb() {
  if (!isDatabaseConfigured) {
    console.log("[DB] Database not configured - mock mode active")
    return null
  }

  if (isSupabase) {
    // Use pg driver for Supabase PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
    console.log("[DB] Connected to Supabase PostgreSQL")
    return drizzlePg(pool, { schema })
  } else {
    // Use Neon serverless driver
    const sql = neon(process.env.DATABASE_URL!)
    console.log("[DB] Connected to Neon PostgreSQL")
    return drizzleNeon(sql, { schema })
  }
}

export const db = createDb()

// Export schema for use in queries
export * from "./schema"

// Helper to check if DB is available
export function isDbConfigured() {
  return isDatabaseConfigured && db !== null
}
