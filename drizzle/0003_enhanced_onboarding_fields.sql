-- Migration: Add enhanced onboarding fields
-- Date: 2026-01-04
-- Description: Adds website URL, direct contact info, and participant count fields to partners table
--              Adds QR code URL to microsites table

-- Add new fields to partners table
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

-- Add comments for documentation
COMMENT ON COLUMN partners.website_url IS 'Partner business website URL for logo/image fetching';
COMMENT ON COLUMN partners.direct_contact_name IS 'Direct point of contact name for onboarding';
COMMENT ON COLUMN partners.direct_contact_email IS 'Direct point of contact email for onboarding';
COMMENT ON COLUMN partners.direct_contact_phone IS 'Direct point of contact phone for onboarding';
COMMENT ON COLUMN partners.estimated_monthly_participants IS 'Estimated number of participants per month';
COMMENT ON COLUMN partners.estimated_annual_participants IS 'Estimated number of participants per year';
COMMENT ON COLUMN partners.business_address IS 'Full business address';
COMMENT ON COLUMN microsites.qr_code_url IS 'QR code image URL linking to the microsite';

