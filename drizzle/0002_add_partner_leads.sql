CREATE TABLE partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  source TEXT DEFAULT 'microsite',
  status TEXT DEFAULT 'new',
  quote_id UUID REFERENCES quotes(id),
  policy_id UUID REFERENCES policies(id),
  converted_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_partner_leads_partner_id ON partner_leads(partner_id);
CREATE INDEX idx_partner_leads_status ON partner_leads(status);
CREATE INDEX idx_partner_leads_email ON partner_leads(email);
CREATE INDEX idx_partner_leads_created_at ON partner_leads(created_at);
