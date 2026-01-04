#!/usr/bin/env node
import { getDb, closeDb } from './db-utils.mjs'

const sql = getDb()

async function main() {
  console.log('Testing database connection...\n')

  // List all tables
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `

  console.log('📊 Existing tables:')
  tables.forEach(t => console.log(`  - ${t.table_name}`))

  // Check partners table structure
  const partnersColumns = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'partners'
    ORDER BY ordinal_position
  `

  if (partnersColumns.length > 0) {
    console.log('\n👥 Partners table columns:')
    partnersColumns.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`))
  } else {
    console.log('\n⚠️  Partners table does not exist!')
  }

  // Count records
  try {
    const partnerCount = await sql`SELECT COUNT(*) as count FROM partners`
    console.log(`\n📈 Partner records: ${partnerCount[0].count}`)
  } catch (e) {
    console.log('\n❌ Could not count partners:', e.message)
  }

  try {
    const micrositeCount = await sql`SELECT COUNT(*) as count FROM microsites`
    console.log(`📈 Microsite records: ${micrositeCount[0].count}`)
  } catch (e) {
    console.log('❌ Could not count microsites:', e.message)
  }
}

main().catch(console.error)
