-- Schema updates for enhanced onboarding and microsite features
-- Run this migration to add new fields to partners table

ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS direct_contact_name TEXT,
ADD COLUMN IF NOT EXISTS direct_contact_email TEXT,
ADD COLUMN IF NOT EXISTS direct_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS estimated_monthly_participants INTEGER,
ADD COLUMN IF NOT EXISTS estimated_annual_participants INTEGER,
ADD COLUMN IF NOT EXISTS business_address TEXT;

-- Add QR code URL to microsites table
ALTER TABLE microsites
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Create index for website_url lookups
CREATE INDEX IF NOT EXISTS idx_partners_website_url ON partners(website_url);

