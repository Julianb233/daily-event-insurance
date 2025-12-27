-- Partner Portal Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Partners table - Main partner profiles
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL CHECK (business_type IN ('gym', 'climbing', 'rental', 'wellness', 'ski', 'water-sports', 'other')),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  integration_type TEXT NOT NULL DEFAULT 'widget' CHECK (integration_type IN ('widget', 'api', 'manual')),
  primary_color TEXT DEFAULT '#14B8A6',
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Create index on clerk_user_id for fast lookups
CREATE INDEX idx_partners_clerk_user_id ON partners(clerk_user_id);

-- Partner products - Product configurations per partner
CREATE TABLE partner_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL CHECK (product_type IN ('liability', 'equipment', 'cancellation')),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  customer_price DECIMAL(10, 2) NOT NULL DEFAULT 4.99,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, product_type)
);

-- Monthly earnings - Track participant numbers and commissions
CREATE TABLE monthly_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  year_month TEXT NOT NULL, -- Format: "2025-01"
  total_participants INTEGER NOT NULL DEFAULT 0,
  opted_in_participants INTEGER NOT NULL DEFAULT 0,
  partner_commission DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, year_month)
);

-- Create index for earnings queries
CREATE INDEX idx_monthly_earnings_partner_month ON monthly_earnings(partner_id, year_month);

-- Partner resources - Materials library
CREATE TABLE partner_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('marketing', 'training', 'documentation')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'video', 'image', 'link')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resource downloads tracking
CREATE TABLE resource_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES partner_resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners table
-- Partners can only see their own data
CREATE POLICY "Partners can view own profile" ON partners
  FOR SELECT USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Partners can update own profile" ON partners
  FOR UPDATE USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Service role can do everything
CREATE POLICY "Service role has full access to partners" ON partners
  FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- RLS Policies for partner_products
CREATE POLICY "Partners can view own products" ON partner_products
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Partners can update own products" ON partner_products
  FOR UPDATE USING (
    partner_id IN (
      SELECT id FROM partners WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Service role has full access to products" ON partner_products
  FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- RLS Policies for monthly_earnings
CREATE POLICY "Partners can view own earnings" ON monthly_earnings
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Service role has full access to earnings" ON monthly_earnings
  FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- RLS Policies for partner_resources (all partners can view)
CREATE POLICY "All authenticated users can view resources" ON partner_resources
  FOR SELECT USING (true);

CREATE POLICY "Service role has full access to resources" ON partner_resources
  FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- RLS Policies for resource_downloads
CREATE POLICY "Partners can view own downloads" ON resource_downloads
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Partners can insert own downloads" ON resource_downloads
  FOR INSERT WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Service role has full access to downloads" ON resource_downloads
  FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- Seed initial resources
INSERT INTO partner_resources (title, description, category, resource_type, file_url, sort_order) VALUES
  ('Partner Logo Pack', 'Official Daily Event Insurance logos in various formats', 'marketing', 'image', '/resources/logo-pack.zip', 1),
  ('Social Media Templates', 'Ready-to-use social media graphics and templates', 'marketing', 'image', '/resources/social-templates.zip', 2),
  ('Email Templates', 'Pre-written email templates for customer communication', 'marketing', 'pdf', '/resources/email-templates.pdf', 3),
  ('Integration Walkthrough', 'Step-by-step video guide for widget integration', 'training', 'video', 'https://www.youtube.com/watch?v=example', 1),
  ('Best Practices Guide', 'Tips for maximizing your partnership success', 'training', 'pdf', '/resources/best-practices.pdf', 2),
  ('Partner Handbook', 'Complete partner program overview and policies', 'documentation', 'pdf', '/resources/partner-handbook.pdf', 1),
  ('API Documentation', 'Technical documentation for API integration', 'documentation', 'link', '/docs/api', 2),
  ('FAQ & Troubleshooting', 'Common questions and solutions', 'documentation', 'pdf', '/resources/faq.pdf', 3);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for partners table
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
