#!/usr/bin/env node
import { getDb, closeDb } from './db-utils.mjs'

const sql = getDb()

async function main() {
  console.log('Adding multi-location support...\n')

  // Add location columns to partners table
  try {
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS location_count INTEGER DEFAULT 1`
    await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS has_multiple_locations BOOLEAN DEFAULT false`
    console.log('✅ Added location tracking columns to partners table')
  } catch (e) {
    console.log('⚠️  Partners columns may already exist:', e.message)
  }

  // Create partner_locations table
  await sql`
    CREATE TABLE IF NOT EXISTS partner_locations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

      -- Location identification
      location_name TEXT NOT NULL,
      location_code TEXT,
      is_primary BOOLEAN DEFAULT false,

      -- Address
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      country TEXT DEFAULT 'USA',

      -- Location contact
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      contact_role TEXT,

      -- Location-specific branding/microsite
      microsite_id UUID REFERENCES microsites(id),
      qr_code_url TEXT,
      qr_code_color TEXT,
      custom_subdomain TEXT,

      -- Location metrics
      estimated_monthly_participants INTEGER,
      total_policies INTEGER DEFAULT 0,
      total_revenue DECIMAL(12, 2) DEFAULT 0,

      -- Status
      status TEXT DEFAULT 'active',
      activated_at TIMESTAMP,
      closed_at TIMESTAMP,

      -- Timestamps
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `
  console.log('✅ partner_locations table created')

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_partner_locations_partner_id ON partner_locations(partner_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_partner_locations_microsite_id ON partner_locations(microsite_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_partner_locations_status ON partner_locations(status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_partner_locations_city_state ON partner_locations(city, state)`
  await sql`CREATE INDEX IF NOT EXISTS idx_partner_locations_is_primary ON partner_locations(partner_id, is_primary)`
  console.log('✅ Indexes created')

  // Verify table exists
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'partner_locations'
  `
  console.log('\n✅ Verified table:', tables[0]?.table_name || 'NOT FOUND')

  // Show column structure
  const columns = await sql`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'partner_locations'
    ORDER BY ordinal_position
  `
  console.log('\n📊 partner_locations columns:')
  columns.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`))
}

main().catch(console.error)
