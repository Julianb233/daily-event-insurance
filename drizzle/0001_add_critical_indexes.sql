-- Migration: Add Critical Performance Indexes
-- Created: 2025-12-28
-- Impact: High-frequency foreign key lookups

-- Partner user lookup (used in all /api/partner/* routes)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_partners_user_id 
  ON partners(user_id);

-- GHL webhook partner lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_partners_ghl_contact_id 
  ON partners(ghl_contact_id) 
  WHERE ghl_contact_id IS NOT NULL;

-- Quote partner relationship
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quotes_partner_id 
  ON quotes(partner_id);

-- Policy partner relationship
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_policies_partner_id 
  ON policies(partner_id);

-- Policy-quote relationship (nullable)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_policies_quote_id 
  ON policies(quote_id) 
  WHERE quote_id IS NOT NULL;

-- Partner document composite lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_partner_documents_partner_type 
  ON partner_documents(partner_id, document_type);

-- Analytics time-series queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quotes_partner_created 
  ON quotes(partner_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_policies_partner_created 
  ON policies(partner_id, created_at DESC);

-- Status filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_policies_status ON policies(status);

-- Coverage type filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quotes_coverage_type ON quotes(coverage_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_policies_coverage_type ON policies(coverage_type);
