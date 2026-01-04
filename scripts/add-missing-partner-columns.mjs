#!/usr/bin/env node
/**
 * Migration to add missing partner columns to match schema.ts
 */

import { getDb, closeDb } from './db-utils.mjs'

const sql = getDb()

async function main() {
  console.log('Adding missing columns to partners table...\n')

  // Add missing columns
  const columnsToAdd = [
    { name: 'business_address', type: 'TEXT' },
    { name: 'website_url', type: 'TEXT' },
    { name: 'direct_contact_name', type: 'TEXT' },
    { name: 'direct_contact_email', type: 'TEXT' },
    { name: 'direct_contact_phone', type: 'TEXT' },
    { name: 'estimated_monthly_participants', type: 'INTEGER' },
    { name: 'estimated_annual_participants', type: 'INTEGER' },
  ]

  for (const col of columnsToAdd) {
    try {
      await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS ${sql(col.name)} ${sql.unsafe(col.type)}`
      console.log(`✅ Added column: ${col.name}`)
    } catch (e) {
      console.log(`⚠️  Column ${col.name}: ${e.message}`)
    }
  }

  // Verify columns
  console.log('\n📊 Partners table columns:')
  const columns = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'partners'
    ORDER BY ordinal_position
  `

  columns.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`))

  console.log('\n✅ Migration complete')
  await closeDb()
}

main().catch(async (e) => {
  console.error('Migration failed:', e)
  await closeDb()
  process.exit(1)
})
