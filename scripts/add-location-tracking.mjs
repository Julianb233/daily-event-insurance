#!/usr/bin/env node
/**
 * Migration to add location-level tracking and integration settings
 */

import { getDb, closeDb } from './db-utils.mjs'

const sql = getDb()

async function main() {
  console.log('Adding location tracking and integration settings...\n')

  // 1. Add locationId to policies table for per-location tracking
  console.log('📊 Adding locationId to policies table...')
  try {
    await sql`ALTER TABLE policies ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES partner_locations(id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_policies_location_id ON policies(location_id)`
    console.log('   ✅ policies.location_id added')
  } catch (e) {
    console.log(`   ⚠️  policies.location_id: ${e.message}`)
  }

  // 2. Add integration settings to partner_locations
  console.log('\n🔧 Adding integration settings to partner_locations...')
  const locationColumns = [
    { name: 'integration_type', type: 'TEXT' }, // ecommerce, pos, embedded, api
    { name: 'embed_code', type: 'TEXT' }, // Generated embed/widget code
    { name: 'api_key', type: 'TEXT' }, // Generated API key for this location
    { name: 'api_secret_hash', type: 'TEXT' }, // Hashed API secret
    { name: 'webhook_url', type: 'TEXT' }, // Partner's webhook URL for this location
    { name: 'webhook_secret', type: 'TEXT' }, // Secret for signing outbound webhooks
    { name: 'webhook_events', type: 'TEXT' }, // JSON array of subscribed events
    { name: 'pos_terminal_id', type: 'TEXT' }, // POS terminal identifier
    { name: 'ecommerce_platform', type: 'TEXT' }, // shopify, woocommerce, etc.
    { name: 'ecommerce_store_id', type: 'TEXT' }, // Store ID on the platform
  ]

  for (const col of locationColumns) {
    try {
      await sql`ALTER TABLE partner_locations ADD COLUMN IF NOT EXISTS ${sql(col.name)} ${sql.unsafe(col.type)}`
      console.log(`   ✅ Added: ${col.name}`)
    } catch (e) {
      console.log(`   ⚠️  ${col.name}: ${e.message}`)
    }
  }

  // 3. Create webhook_subscriptions table for outbound webhooks
  console.log('\n📤 Creating webhook_subscriptions table...')
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS webhook_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
        location_id UUID REFERENCES partner_locations(id) ON DELETE CASCADE,

        -- Webhook configuration
        url TEXT NOT NULL,
        secret TEXT NOT NULL,
        events TEXT NOT NULL DEFAULT '["policy.created"]', -- JSON array of events

        -- Status
        is_active BOOLEAN DEFAULT true,
        last_triggered_at TIMESTAMP,
        last_success_at TIMESTAMP,
        last_failure_at TIMESTAMP,
        failure_count INTEGER DEFAULT 0,

        -- Metadata
        description TEXT,
        headers TEXT, -- JSON object of custom headers

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_partner_id ON webhook_subscriptions(partner_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_location_id ON webhook_subscriptions(location_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_active ON webhook_subscriptions(is_active)`
    console.log('   ✅ webhook_subscriptions table created')
  } catch (e) {
    console.log(`   ⚠️  webhook_subscriptions: ${e.message}`)
  }

  // 4. Create webhook_delivery_logs table for tracking
  console.log('\n📋 Creating webhook_delivery_logs table...')
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS webhook_delivery_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,

        -- Delivery details
        event_type TEXT NOT NULL,
        payload TEXT NOT NULL, -- JSON payload sent

        -- Response
        status_code INTEGER,
        response_body TEXT,
        response_time_ms INTEGER,

        -- Status
        success BOOLEAN DEFAULT false,
        error_message TEXT,
        retry_count INTEGER DEFAULT 0,

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        delivered_at TIMESTAMP
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_subscription_id ON webhook_delivery_logs(subscription_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_created_at ON webhook_delivery_logs(created_at)`
    console.log('   ✅ webhook_delivery_logs table created')
  } catch (e) {
    console.log(`   ⚠️  webhook_delivery_logs: ${e.message}`)
  }

  // 5. Create location_stats view for real-time dashboard
  console.log('\n📈 Creating location_stats view...')
  try {
    await sql`
      CREATE OR REPLACE VIEW location_stats AS
      SELECT
        pl.id AS location_id,
        pl.partner_id,
        pl.location_name,
        pl.custom_subdomain,
        COUNT(DISTINCT p.id) AS total_policies,
        COALESCE(SUM(p.premium::numeric), 0) AS total_premium,
        COALESCE(SUM(p.commission::numeric), 0) AS total_commission,
        COUNT(DISTINCT CASE WHEN p.created_at >= NOW() - INTERVAL '30 days' THEN p.id END) AS policies_30_days,
        COUNT(DISTINCT CASE WHEN p.created_at >= NOW() - INTERVAL '7 days' THEN p.id END) AS policies_7_days,
        COUNT(DISTINCT CASE WHEN p.created_at >= NOW() - INTERVAL '1 day' THEN p.id END) AS policies_today,
        MAX(p.created_at) AS last_policy_at
      FROM partner_locations pl
      LEFT JOIN policies p ON p.location_id = pl.id
      GROUP BY pl.id, pl.partner_id, pl.location_name, pl.custom_subdomain
    `
    console.log('   ✅ location_stats view created')
  } catch (e) {
    console.log(`   ⚠️  location_stats view: ${e.message}`)
  }

  console.log('\n✅ Migration complete!')

  // Show updated schema
  console.log('\n📊 Updated partner_locations columns:')
  const columns = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'partner_locations'
    ORDER BY ordinal_position
  `
  columns.forEach(c => console.log(`  - ${c.column_name}: ${c.data_type}`))

  await closeDb()
}

main().catch(async (e) => {
  console.error('Migration failed:', e)
  await closeDb()
  process.exit(1)
})
