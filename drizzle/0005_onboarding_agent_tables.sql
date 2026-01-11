-- Onboarding Agent Tables Migration
-- Creates tables for the onboarding and integration agent system

-- Onboarding Sessions - tracks each business's journey through onboarding
CREATE TABLE IF NOT EXISTS onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  visitor_id TEXT,
  session_token TEXT UNIQUE,
  current_state TEXT NOT NULL DEFAULT 'welcome',
  current_sub_state TEXT,
  progress_percent INTEGER DEFAULT 0,
  collected_data JSONB DEFAULT '{}',
  integration_data JSONB DEFAULT '{}',
  agent_context JSONB DEFAULT '{}',
  is_complete BOOLEAN DEFAULT FALSE,
  needs_human_review BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  total_messages INTEGER DEFAULT 0,
  total_tool_calls INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER,
  last_interaction_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for onboarding_sessions
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_partner_id ON onboarding_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_user_id ON onboarding_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_visitor_id ON onboarding_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_current_state ON onboarding_sessions(current_state);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_is_complete ON onboarding_sessions(is_complete);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_created_at ON onboarding_sessions(created_at);

-- Onboarding Messages - conversation history with the agent
CREATE TABLE IF NOT EXISTS onboarding_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tool_name TEXT,
  tool_args JSONB,
  tool_result JSONB,
  state_at_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for onboarding_messages
CREATE INDEX IF NOT EXISTS idx_onboarding_messages_session_id ON onboarding_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_messages_role ON onboarding_messages(role);
CREATE INDEX IF NOT EXISTS idx_onboarding_messages_created_at ON onboarding_messages(created_at);

-- Onboarding Tasks - checklist items the agent guides through
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  task_key TEXT NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP,
  completed_by TEXT,
  requires_verification BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  task_data JSONB,
  last_error TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for onboarding_tasks
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_session_id ON onboarding_tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_task_key ON onboarding_tasks(task_key);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_category ON onboarding_tasks(category);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_status ON onboarding_tasks(status);

-- Integration Verifications - tracks verified integrations
CREATE TABLE IF NOT EXISTS integration_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  platform_slug TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verification_method TEXT,
  test_url TEXT,
  test_result JSONB,
  config_data JSONB,
  credentials JSONB,
  last_test_at TIMESTAMP,
  verified_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for integration_verifications
CREATE INDEX IF NOT EXISTS idx_integration_verifications_session_id ON integration_verifications(session_id);
CREATE INDEX IF NOT EXISTS idx_integration_verifications_partner_id ON integration_verifications(partner_id);
CREATE INDEX IF NOT EXISTS idx_integration_verifications_type ON integration_verifications(integration_type);
CREATE INDEX IF NOT EXISTS idx_integration_verifications_status ON integration_verifications(status);

-- Agent Action Logs - audit trail of agent actions
CREATE TABLE IF NOT EXISTS agent_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for agent_action_logs
CREATE INDEX IF NOT EXISTS idx_agent_action_logs_session_id ON agent_action_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_action_logs_action_type ON agent_action_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_agent_action_logs_success ON agent_action_logs(success);
CREATE INDEX IF NOT EXISTS idx_agent_action_logs_created_at ON agent_action_logs(created_at);

-- Add trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_onboarding_sessions_updated_at ON onboarding_sessions;
CREATE TRIGGER update_onboarding_sessions_updated_at
  BEFORE UPDATE ON onboarding_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_tasks_updated_at ON onboarding_tasks;
CREATE TRIGGER update_onboarding_tasks_updated_at
  BEFORE UPDATE ON onboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_verifications_updated_at ON integration_verifications;
CREATE TRIGGER update_integration_verifications_updated_at
  BEFORE UPDATE ON integration_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
