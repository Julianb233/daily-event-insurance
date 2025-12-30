-- Voice Agent Tables Migration
-- Generated for Daily Event Insurance
-- Date: 2025-12-29
--
-- This migration creates tables for the AI voice agent feature:
-- 1. voice_agent_config - Agent configuration and settings
-- 2. voice_calls - Call records and analytics
-- 3. escalation_rules - Rules for when to escalate calls
-- 4. knowledge_base - FAQ and product information for the agent

-- ============================================
-- SECTION 1: VOICE AGENT CONFIGURATION
-- ============================================

CREATE TABLE IF NOT EXISTS voice_agent_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic config
  name TEXT NOT NULL DEFAULT 'Default Agent',
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- AI prompting
  system_prompt TEXT NOT NULL,
  greeting_message TEXT,
  fallback_message TEXT,

  -- Voice settings
  voice TEXT NOT NULL DEFAULT 'alloy', -- OpenAI voice: alloy, echo, fable, onyx, nova, shimmer
  max_response_length INTEGER DEFAULT 150,
  response_style TEXT DEFAULT 'professional', -- professional, friendly, concise
  language TEXT DEFAULT 'en',

  -- Business hours (JSON)
  business_hours JSONB DEFAULT '{
    "monday": {"enabled": true, "start": "09:00", "end": "17:00"},
    "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"},
    "wednesday": {"enabled": true, "start": "09:00", "end": "17:00"},
    "thursday": {"enabled": true, "start": "09:00", "end": "17:00"},
    "friday": {"enabled": true, "start": "09:00", "end": "17:00"},
    "saturday": {"enabled": false, "start": "09:00", "end": "17:00"},
    "sunday": {"enabled": false, "start": "09:00", "end": "17:00"}
  }',
  timezone TEXT DEFAULT 'America/New_York',

  -- After hours behavior
  after_hours_behavior TEXT DEFAULT 'voicemail', -- voicemail, message, forward
  after_hours_message TEXT,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Config indexes
CREATE INDEX IF NOT EXISTS idx_voice_agent_config_active ON voice_agent_config(is_active) WHERE is_active = true;

-- ============================================
-- SECTION 2: VOICE CALLS (Analytics)
-- ============================================

CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Call identification
  room_name TEXT NOT NULL,
  caller_id TEXT NOT NULL,
  agent_id TEXT,
  agent_config_id UUID REFERENCES voice_agent_config(id),

  -- Call details
  status TEXT NOT NULL DEFAULT 'initiated', -- initiated, ringing, in_progress, completed, missed, failed
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_seconds INTEGER,

  -- Transcript and recording
  transcript TEXT,
  recording_url TEXT,

  -- AI Analysis
  sentiment_scores JSONB, -- {"positive": 0.8, "neutral": 0.15, "negative": 0.05}
  topics_detected TEXT[], -- Array of detected topics

  -- Escalation
  escalation_triggered BOOLEAN NOT NULL DEFAULT false,
  escalation_reason TEXT,

  -- Metadata
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Voice calls indexes
CREATE INDEX IF NOT EXISTS idx_voice_calls_agent_config ON voice_calls(agent_config_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON voice_calls(status);
CREATE INDEX IF NOT EXISTS idx_voice_calls_started_at ON voice_calls(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_calls_escalation ON voice_calls(escalation_triggered) WHERE escalation_triggered = true;
CREATE INDEX IF NOT EXISTS idx_voice_calls_caller ON voice_calls(caller_id);

-- ============================================
-- SECTION 3: ESCALATION RULES
-- ============================================

CREATE TABLE IF NOT EXISTS escalation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES voice_agent_config(id) ON DELETE CASCADE,

  -- Rule identification
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 0, -- Higher = more important
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Trigger conditions (at least one must be set)
  trigger_type TEXT NOT NULL, -- keyword, sentiment, duration, intent, custom
  trigger_keywords TEXT[], -- Keywords that trigger escalation
  sentiment_threshold DECIMAL(3, 2), -- e.g., 0.70 for 70% negative sentiment
  time_limit_seconds INTEGER, -- Escalate if call exceeds this duration
  trigger_intents TEXT[], -- AI-detected intents that trigger escalation
  custom_condition TEXT, -- Custom logic expression

  -- Action to take
  action TEXT NOT NULL DEFAULT 'offer_transfer', -- offer_transfer, auto_transfer, notify, log_only
  transfer_to TEXT, -- Phone number or agent ID to transfer to
  action_message TEXT, -- Message to play/say before action

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Escalation rules indexes
CREATE INDEX IF NOT EXISTS idx_escalation_rules_config ON escalation_rules(config_id);
CREATE INDEX IF NOT EXISTS idx_escalation_rules_active ON escalation_rules(config_id, priority DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_escalation_rules_type ON escalation_rules(trigger_type);

-- ============================================
-- SECTION 4: KNOWLEDGE BASE
-- ============================================

CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES voice_agent_config(id) ON DELETE CASCADE,

  -- Entry type
  entry_type TEXT NOT NULL DEFAULT 'faq', -- faq, document, product, policy
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,

  -- FAQ content
  question TEXT,
  answer TEXT,

  -- Document content
  document_title TEXT,
  document_content TEXT,
  document_url TEXT,

  -- Product content
  product_name TEXT,
  product_description TEXT,
  product_price DECIMAL(10, 2),
  product_features TEXT[],

  -- Categorization
  category TEXT,
  tags TEXT[],
  search_keywords TEXT[],

  -- Tracking
  created_by TEXT,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Knowledge base indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_base_config ON knowledge_base(config_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_type ON knowledge_base(entry_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_active ON knowledge_base(config_id, priority DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search ON knowledge_base USING gin(search_keywords);

-- ============================================
-- SECTION 5: UPDATE TRIGGERS
-- ============================================

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_voice_agent_config_updated_at ON voice_agent_config;
CREATE TRIGGER update_voice_agent_config_updated_at
  BEFORE UPDATE ON voice_agent_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_escalation_rules_updated_at ON escalation_rules;
CREATE TRIGGER update_escalation_rules_updated_at
  BEFORE UPDATE ON escalation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_knowledge_base_updated_at ON knowledge_base;
CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SECTION 6: INSERT DEFAULT CONFIGURATION
-- ============================================

INSERT INTO voice_agent_config (
  name,
  is_active,
  system_prompt,
  greeting_message,
  fallback_message,
  voice,
  max_response_length,
  response_style,
  language,
  after_hours_behavior,
  after_hours_message
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
- If you don''t know something, offer to connect them with a human agent
- Keep responses focused and avoid unnecessary filler
- When discussing pricing, always mention that quotes are customized based on event details',
  'Hello! Thank you for calling Daily Event Insurance. How can I help you today?',
  'I apologize, but I''m unable to help with that specific question. Would you like me to connect you with a team member who can assist you further?',
  'alloy',
  150,
  'professional',
  'en',
  'voicemail',
  'Thank you for calling Daily Event Insurance. Our office is currently closed. Please leave a message with your name, phone number, and a brief description of how we can help you, and we''ll return your call on the next business day.'
) ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Uncomment to verify migration success:
-- SELECT table_name FROM information_schema.tables WHERE table_name IN ('voice_agent_config', 'voice_calls', 'escalation_rules', 'knowledge_base');
-- SELECT * FROM voice_agent_config WHERE is_active = true;
