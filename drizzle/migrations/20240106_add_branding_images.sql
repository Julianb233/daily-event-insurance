-- Migration: Add branding_images column to partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS branding_images JSONB DEFAULT '[]'::jsonb;
