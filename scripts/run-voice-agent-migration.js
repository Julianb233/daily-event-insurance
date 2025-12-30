const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Creating voice agent tables...\n');

  // Create tables in order

  // 1. voice_agent_config
  console.log('1. Creating voice_agent_config table...');
  await sql`
    CREATE TABLE IF NOT EXISTS voice_agent_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL DEFAULT 'Default Agent',
      is_active BOOLEAN NOT NULL DEFAULT true,
      system_prompt TEXT NOT NULL,
      greeting_message TEXT,
      fallback_message TEXT,
      voice TEXT NOT NULL DEFAULT 'alloy',
      max_response_length INTEGER DEFAULT 150,
      response_style TEXT DEFAULT 'professional',
      language TEXT DEFAULT 'en',
      business_hours JSONB DEFAULT '{"monday": {"enabled": true, "start": "09:00", "end": "17:00"}, "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"}, "wednesday": {"enabled": true, "start": "09:00", "end": "17:00"}, "thursday": {"enabled": true, "start": "09:00", "end": "17:00"}, "friday": {"enabled": true, "start": "09:00", "end": "17:00"}, "saturday": {"enabled": false, "start": "09:00", "end": "17:00"}, "sunday": {"enabled": false, "start": "09:00", "end": "17:00"}}',
      timezone TEXT DEFAULT 'America/New_York',
      after_hours_behavior TEXT DEFAULT 'voicemail',
      after_hours_message TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log('   ✓ voice_agent_config created');

  // 2. voice_calls
  console.log('2. Creating voice_calls table...');
  await sql`
    CREATE TABLE IF NOT EXISTS voice_calls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_name TEXT NOT NULL,
      caller_id TEXT NOT NULL,
      agent_id TEXT,
      agent_config_id UUID REFERENCES voice_agent_config(id),
      status TEXT NOT NULL DEFAULT 'initiated',
      started_at TIMESTAMP NOT NULL DEFAULT NOW(),
      ended_at TIMESTAMP,
      duration_seconds INTEGER,
      transcript TEXT,
      recording_url TEXT,
      sentiment_scores JSONB,
      topics_detected TEXT[],
      escalation_triggered BOOLEAN NOT NULL DEFAULT false,
      escalation_reason TEXT,
      metadata JSONB,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log('   ✓ voice_calls created');

  // 3. escalation_rules
  console.log('3. Creating escalation_rules table...');
  await sql`
    CREATE TABLE IF NOT EXISTS escalation_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id UUID NOT NULL REFERENCES voice_agent_config(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      priority INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      trigger_type TEXT NOT NULL,
      trigger_keywords TEXT[],
      sentiment_threshold DECIMAL(3, 2),
      time_limit_seconds INTEGER,
      trigger_intents TEXT[],
      custom_condition TEXT,
      action TEXT NOT NULL DEFAULT 'offer_transfer',
      transfer_to TEXT,
      action_message TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log('   ✓ escalation_rules created');

  // 4. knowledge_base
  console.log('4. Creating knowledge_base table...');
  await sql`
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id UUID NOT NULL REFERENCES voice_agent_config(id) ON DELETE CASCADE,
      entry_type TEXT NOT NULL DEFAULT 'faq',
      is_active BOOLEAN NOT NULL DEFAULT true,
      priority INTEGER NOT NULL DEFAULT 0,
      question TEXT,
      answer TEXT,
      document_title TEXT,
      document_content TEXT,
      document_url TEXT,
      product_name TEXT,
      product_description TEXT,
      product_price DECIMAL(10, 2),
      product_features TEXT[],
      category TEXT,
      tags TEXT[],
      search_keywords TEXT[],
      created_by TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log('   ✓ knowledge_base created');

  // 5. Create indexes
  console.log('5. Creating indexes...');

  await sql`CREATE INDEX IF NOT EXISTS idx_voice_agent_config_active ON voice_agent_config(is_active) WHERE is_active = true`;
  await sql`CREATE INDEX IF NOT EXISTS idx_voice_calls_agent_config ON voice_calls(agent_config_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON voice_calls(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_voice_calls_started_at ON voice_calls(started_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_voice_calls_caller ON voice_calls(caller_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_escalation_rules_config ON escalation_rules(config_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_knowledge_base_config ON knowledge_base(config_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_knowledge_base_type ON knowledge_base(entry_type)`;

  console.log('   ✓ Indexes created');

  // 6. Insert default config
  console.log('6. Inserting default configuration...');
  const existing = await sql`SELECT id FROM voice_agent_config WHERE name = 'Daily Event Insurance Agent' LIMIT 1`;

  if (existing.length === 0) {
    await sql`
      INSERT INTO voice_agent_config (
        name, is_active, system_prompt, greeting_message, fallback_message,
        voice, max_response_length, response_style, language,
        after_hours_behavior, after_hours_message
      ) VALUES (
        'Daily Event Insurance Agent',
        true,
        'You are a helpful AI support assistant for Daily Event Insurance. Your role is to:
- Help users with questions about event insurance coverage
- Assist with getting quotes for events
- Answer questions about policy terms and conditions
- Provide information about coverage options

Guidelines:
- Be friendly, professional, and concise
- If you do not know something, offer to connect them with a human agent
- Keep responses focused and avoid unnecessary filler',
        'Hello! Thank you for calling Daily Event Insurance. How can I help you today?',
        'I apologize, but I am unable to help with that specific question. Would you like me to connect you with a team member?',
        'alloy',
        150,
        'professional',
        'en',
        'voicemail',
        'Thank you for calling Daily Event Insurance. Our office is currently closed. Please leave a message and we will return your call on the next business day.'
      )
    `;
    console.log('   ✓ Default config inserted');
  } else {
    console.log('   ✓ Default config already exists');
  }

  // 7. Verify tables
  console.log('\n7. Verifying tables...');
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name IN ('voice_agent_config', 'voice_calls', 'escalation_rules', 'knowledge_base')
  `;
  console.log('   Created tables:', tables.map(t => t.table_name).join(', '));

  console.log('\n✅ Migration complete!');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
