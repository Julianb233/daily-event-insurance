import { config } from "dotenv"
config({ path: ".env.local" })
import { sql } from "drizzle-orm"

async function run() {
  console.log("Running manual migration...")

  // Dynamic import to ensure env vars are loaded first
  const { db } = await import("@/lib/db")

  if (!db) {
    console.error("Database connection failed (db is null). Check DATABASE_URL.")
    process.exit(1)
  }

  try {
    await db.execute(sql`
      ALTER TABLE partners ADD COLUMN IF NOT EXISTS branding_images JSONB DEFAULT '[]'::jsonb NOT NULL;
    `)
    console.log("Migration successful: Added branding_images column.")
  } catch (error) {
    console.error("Migration failed:", error)
  }
  process.exit(0)
}

run()
