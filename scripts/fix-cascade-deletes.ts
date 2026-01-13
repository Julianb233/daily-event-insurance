import postgres from "postgres"
import { config } from "dotenv"

config({ path: ".env.local" })

async function fixCascadeDeletes() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set")
    process.exit(1)
  }

  const sql = postgres(process.env.DATABASE_URL, { prepare: false })

  console.log("Fixing cascade delete rules...\n")

  // 1. partner_products - add cascade delete
  console.log("1. partner_products → partners")
  try {
    await sql`
      ALTER TABLE partner_products
      DROP CONSTRAINT IF EXISTS partner_products_partner_id_partners_id_fk
    `
    await sql`
      ALTER TABLE partner_products
      ADD CONSTRAINT partner_products_partner_id_partners_id_fk
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
    `
    console.log("   ✓ CASCADE added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 2. monthly_earnings - add cascade delete
  console.log("2. monthly_earnings → partners")
  try {
    await sql`
      ALTER TABLE monthly_earnings
      DROP CONSTRAINT IF EXISTS monthly_earnings_partner_id_partners_id_fk
    `
    await sql`
      ALTER TABLE monthly_earnings
      ADD CONSTRAINT monthly_earnings_partner_id_partners_id_fk
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
    `
    console.log("   ✓ CASCADE added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 3. quotes - add cascade delete
  console.log("3. quotes → partners")
  try {
    await sql`
      ALTER TABLE quotes
      DROP CONSTRAINT IF EXISTS quotes_partner_id_partners_id_fk
    `
    await sql`
      ALTER TABLE quotes
      ADD CONSTRAINT quotes_partner_id_partners_id_fk
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
    `
    console.log("   ✓ CASCADE added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 4. policies → partners - add cascade delete
  console.log("4. policies → partners")
  try {
    await sql`
      ALTER TABLE policies
      DROP CONSTRAINT IF EXISTS policies_partner_id_partners_id_fk
    `
    await sql`
      ALTER TABLE policies
      ADD CONSTRAINT policies_partner_id_partners_id_fk
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
    `
    console.log("   ✓ CASCADE added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 5. policies → quotes - SET NULL (preserve policy if quote deleted)
  console.log("5. policies → quotes (SET NULL)")
  try {
    await sql`
      ALTER TABLE policies
      DROP CONSTRAINT IF EXISTS policies_quote_id_quotes_id_fk
    `
    await sql`
      ALTER TABLE policies
      ADD CONSTRAINT policies_quote_id_quotes_id_fk
      FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL
    `
    console.log("   ✓ SET NULL added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 6. resource_downloads → partners - cascade
  console.log("6. resource_downloads → partners")
  try {
    await sql`
      ALTER TABLE resource_downloads
      DROP CONSTRAINT IF EXISTS resource_downloads_partner_id_partners_id_fk
    `
    await sql`
      ALTER TABLE resource_downloads
      ADD CONSTRAINT resource_downloads_partner_id_partners_id_fk
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
    `
    console.log("   ✓ CASCADE added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 7. resource_downloads → partner_resources - cascade
  console.log("7. resource_downloads → partner_resources")
  try {
    await sql`
      ALTER TABLE resource_downloads
      DROP CONSTRAINT IF EXISTS resource_downloads_resource_id_partner_resources_id_fk
    `
    await sql`
      ALTER TABLE resource_downloads
      ADD CONSTRAINT resource_downloads_resource_id_partner_resources_id_fk
      FOREIGN KEY (resource_id) REFERENCES partner_resources(id) ON DELETE CASCADE
    `
    console.log("   ✓ CASCADE added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // 8. webhook_events → partners - SET NULL (preserve audit log)
  console.log("8. webhook_events → partners (SET NULL)")
  try {
    await sql`
      ALTER TABLE webhook_events
      DROP CONSTRAINT IF EXISTS webhook_events_partner_id_partners_id_fk
    `
    await sql`
      ALTER TABLE webhook_events
      ADD CONSTRAINT webhook_events_partner_id_partners_id_fk
      FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
    `
    console.log("   ✓ SET NULL added")
  } catch (e: any) {
    console.log(`   ✗ ${e.message}`)
  }

  // Verify constraints
  console.log("\n--- Foreign Key Constraints ---")
  const result = await sql`
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table,
      rc.delete_rule
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    ORDER BY tc.table_name
  `

  for (const row of result) {
    const rule = row.delete_rule === 'CASCADE' ? '🔴 CASCADE' :
                 row.delete_rule === 'SET NULL' ? '🟡 SET NULL' :
                 '⚪ ' + row.delete_rule
    console.log(`${row.table_name}.${row.column_name} → ${row.foreign_table} [${rule}]`)
  }

  console.log("\n✓ Cascade delete rules fixed")

  await sql.end()
}

fixCascadeDeletes().catch(console.error)
