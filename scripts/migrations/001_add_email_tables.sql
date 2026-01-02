-- Migration: Add Email Sequences and Scheduled Emails tables
-- Date: 2026-01-02
-- Description: Creates tables for email automation sequences and email scheduling

-- Email Sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Sequence configuration
  sequence_type TEXT NOT NULL, -- gym-nurture, wellness-nurture, ski-resort-nurture, fitness-nurture
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, completed, cancelled
  last_email_sent_at TIMESTAMP,
  completed_at TIMESTAMP,

  -- Additional data
  metadata TEXT, -- JSON string

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Scheduled Emails table
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

  -- Email details
  to TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT,
  text_content TEXT,

  -- Scheduling
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, sent, failed, cancelled
  resend_id TEXT,

  -- Error tracking
  error TEXT,
  attempted_at TIMESTAMP,

  -- Sequence tracking
  step_number INTEGER,

  -- Additional data
  metadata TEXT, -- JSON string

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for email_sequences
CREATE INDEX IF NOT EXISTS idx_email_sequences_lead_id ON email_sequences(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_type ON email_sequences(sequence_type);

-- Indexes for scheduled_emails
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_sequence_id ON scheduled_emails(sequence_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_lead_id ON scheduled_emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status ON scheduled_emails(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_scheduled_for ON scheduled_emails(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_sent_at ON scheduled_emails(sent_at);

-- Comments for documentation
COMMENT ON TABLE email_sequences IS 'Tracks email automation sequences for lead nurturing';
COMMENT ON TABLE scheduled_emails IS 'Individual scheduled emails, part of sequences or standalone';
COMMENT ON COLUMN email_sequences.sequence_type IS 'Type of sequence: gym-nurture, wellness-nurture, ski-resort-nurture, fitness-nurture';
COMMENT ON COLUMN email_sequences.current_step IS 'Current step in the sequence (0-indexed)';
COMMENT ON COLUMN email_sequences.status IS 'Sequence status: active, paused, completed, cancelled';
COMMENT ON COLUMN scheduled_emails.status IS 'Email status: pending, processing, sent, failed, cancelled';
COMMENT ON COLUMN scheduled_emails.resend_id IS 'Resend API email ID after sending';
