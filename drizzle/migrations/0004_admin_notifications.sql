-- Admin Notifications Table Migration
-- This table stores admin notifications for the notification center

CREATE TABLE IF NOT EXISTS admin_notifications (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL CHECK (type IN ('escalation', 'partner_approval', 'payout_alert', 'system_health', 'claim_filed', 'integration_error', 'general')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500),
  action_label VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE
);

-- Index for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_notifications_status ON admin_notifications(status);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_priority ON admin_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- Enable real-time subscriptions for this table
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;

-- Row Level Security (optional - enable if needed)
-- ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated admin users to read notifications
-- CREATE POLICY "Allow admins to read notifications" ON admin_notifications
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- Policy to allow service role to insert/update notifications
-- CREATE POLICY "Allow service role to manage notifications" ON admin_notifications
--   FOR ALL
--   TO service_role
--   USING (true)
--   WITH CHECK (true);

COMMENT ON TABLE admin_notifications IS 'Stores admin dashboard notifications for real-time alerts';
COMMENT ON COLUMN admin_notifications.type IS 'Type of notification: escalation, partner_approval, payout_alert, system_health, claim_filed, integration_error, general';
COMMENT ON COLUMN admin_notifications.priority IS 'Priority level: low, medium, high, urgent';
COMMENT ON COLUMN admin_notifications.status IS 'Current status: unread, read, dismissed';
COMMENT ON COLUMN admin_notifications.metadata IS 'Additional JSON data specific to the notification type';
