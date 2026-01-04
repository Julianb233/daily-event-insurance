import postgres from "postgres"
import { config } from "dotenv"

config({ path: ".env.local" })

async function runMigration() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
  if (!connectionString) {
    console.error("DATABASE_URL or POSTGRES_PRISMA_URL not set")
    process.exit(1)
  }

  const sql = postgres(connectionString, { ssl: 'require' })

  console.log("Adding missing indexes...")

  // Only indexes that don't exist yet (based on verification)
  try {
    // Partners user_id (critical for auth lookups)
    console.log("Creating idx_partners_user_id...")
    await sql`CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id)`
    console.log("✓ idx_partners_user_id")
  } catch (e: any) {
    console.log(`○ idx_partners_user_id: ${e.message?.includes("exists") ? "exists" : e.message}`)
  }

  try {
    // Partners GHL contact (webhook lookups)
    console.log("Creating idx_partners_ghl_contact_id...")
    await sql`CREATE INDEX IF NOT EXISTS idx_partners_ghl_contact_id ON partners(ghl_contact_id) WHERE ghl_contact_id IS NOT NULL`
    console.log("✓ idx_partners_ghl_contact_id")
  } catch (e: any) {
    console.log(`○ idx_partners_ghl_contact_id: ${e.message?.includes("exists") ? "exists" : e.message}`)
  }

  try {
    // Partner documents composite
    console.log("Creating idx_partner_documents_partner_type...")
    await sql`CREATE INDEX IF NOT EXISTS idx_partner_documents_partner_type ON partner_documents(partner_id, document_type)`
    console.log("✓ idx_partner_documents_partner_type")
  } catch (e: any) {
    console.log(`○ idx_partner_documents_partner_type: ${e.message?.includes("exists") ? "exists" : e.message}`)
  }

  try {
    // Quotes composite for analytics
    console.log("Creating idx_quotes_partner_created...")
    await sql`CREATE INDEX IF NOT EXISTS idx_quotes_partner_created ON quotes(partner_id, created_at DESC)`
    console.log("✓ idx_quotes_partner_created")
  } catch (e: any) {
    console.log(`○ idx_quotes_partner_created: ${e.message?.includes("exists") ? "exists" : e.message}`)
  }

  try {
    // Policies composite for analytics
    console.log("Creating idx_policies_partner_created...")
    await sql`CREATE INDEX IF NOT EXISTS idx_policies_partner_created ON policies(partner_id, created_at DESC)`
    console.log("✓ idx_policies_partner_created")
  } catch (e: any) {
    console.log(`○ idx_policies_partner_created: ${e.message?.includes("exists") ? "exists" : e.message}`)
  }

  // Final verification
  console.log("\n--- All Indexes ---")
  const result = await sql`
    SELECT indexname, tablename
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
    ORDER BY tablename, indexname
  `

  for (const row of result) {
    console.log(`${row.tablename}.${row.indexname}`)
  }

  console.log(`\nTotal: ${result.length} indexes`)
}

runMigration().catch(console.error)
