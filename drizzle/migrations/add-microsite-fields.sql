ALTER TABLE partners ADD COLUMN website_url TEXT;
ALTER TABLE partners ADD COLUMN microsite_slug TEXT UNIQUE;
ALTER TABLE partners ADD COLUMN microsite_url TEXT;
ALTER TABLE partners ADD COLUMN microsite_active BOOLEAN DEFAULT false;
ALTER TABLE partners ADD COLUMN brand_logo_url TEXT;
ALTER TABLE partners ADD COLUMN brand_primary_color TEXT;
ALTER TABLE partners ADD COLUMN brand_secondary_color TEXT;
ALTER TABLE partners ADD COLUMN brand_font_family TEXT;
ALTER TABLE partners ADD COLUMN microsite_generated_at TIMESTAMP;

CREATE UNIQUE INDEX idx_partners_microsite_slug ON partners(microsite_slug) WHERE microsite_slug IS NOT NULL;
