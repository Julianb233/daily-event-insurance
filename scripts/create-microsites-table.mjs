#!/usr/bin/env node
import { getDb, closeDb } from './db-utils.mjs'

const sql = getDb()

async function main() {
  console.log('Creating microsites table...\n')

  await sql`
    CREATE TABLE IF NOT EXISTS microsites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
      domain TEXT UNIQUE,
      subdomain TEXT UNIQUE,
      custom_domain TEXT,
      site_name TEXT NOT NULL,
      primary_color TEXT DEFAULT '#14B8A6',
      logo_url TEXT,
      hero_image_url TEXT,
      monthly_charge DECIMAL(10, 2) DEFAULT 650,
      julian_share DECIMAL(10, 2) DEFAULT 500,
      operating_margin DECIMAL(10, 2) DEFAULT 150,
      setup_fee DECIMAL(10, 2) DEFAULT 10000,
      setup_fee_paid BOOLEAN DEFAULT false,
      setup_fee_paid_at TIMESTAMP,
      billing_status TEXT DEFAULT 'pending',
      next_billing_date TIMESTAMP,
      stripe_subscription_id TEXT,
      status TEXT DEFAULT 'building',
      launched_at TIMESTAMP,
      qr_code_url TEXT,
      total_visitors INTEGER DEFAULT 0,
      total_leads INTEGER DEFAULT 0,
      total_policies INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `

  console.log('✅ microsites table created')

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_microsites_partner_id ON microsites(partner_id)`
  await sql`CREATE INDEX IF NOT EXISTS idx_microsites_status ON microsites(status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_microsites_domain ON microsites(domain)`

  console.log('✅ indexes created')

  // Create document_templates table if missing
  await sql`
    CREATE TABLE IF NOT EXISTS document_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      version TEXT DEFAULT '1.0',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `
  console.log('✅ document_templates table created')

  // Verify
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ('microsites', 'document_templates')
  `
  console.log('\nVerified tables:', tables.map(t => t.table_name).join(', '))
}

main().catch(console.error)
