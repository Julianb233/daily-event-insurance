# Database Migration Guide - Partner API

## Overview

This guide covers the database changes needed to support the new partner API endpoints.

## New Tables

### 1. Quotes Table

Stores insurance quote requests from partners.

```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  quote_number TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  participants INTEGER NOT NULL,
  coverage_type TEXT NOT NULL,
  premium DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  event_details TEXT,
  customer_email TEXT,
  customer_name TEXT,
  metadata TEXT,
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP,
  declined_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_quotes_partner_id ON quotes(partner_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_coverage_type ON quotes(coverage_type);
CREATE INDEX idx_quotes_event_date ON quotes(event_date);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
```

### 2. Policies Table

Stores active insurance policies.

```sql
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  quote_id UUID REFERENCES quotes(id),
  policy_number TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  participants INTEGER NOT NULL,
  coverage_type TEXT NOT NULL,
  premium DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'active',
  effective_date TIMESTAMP NOT NULL,
  expiration_date TIMESTAMP NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  event_details TEXT,
  policy_document TEXT,
  certificate_issued BOOLEAN DEFAULT FALSE,
  metadata TEXT,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_policies_partner_id ON policies(partner_id);
CREATE INDEX idx_policies_quote_id ON policies(quote_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_policies_coverage_type ON policies(coverage_type);
CREATE INDEX idx_policies_event_date ON policies(event_date);
CREATE INDEX idx_policies_effective_date ON policies(effective_date);
CREATE INDEX idx_policies_created_at ON policies(created_at);
```

## Migration Steps

### Option 1: Using Drizzle Kit (Recommended)

```bash
# 1. Generate migration from schema
npx drizzle-kit generate:pg

# 2. Review the generated SQL in drizzle/migrations/
cat drizzle/migrations/XXXX_add_quotes_and_policies.sql

# 3. Apply migration to database
npx drizzle-kit push:pg
```

### Option 2: Manual SQL Execution

```bash
# Connect to your Neon database
psql $DATABASE_URL

# Run the SQL above
\i create_tables.sql

# Verify tables were created
\dt quotes
\dt policies
```

### Option 3: Drizzle Studio (Visual)

```bash
# Open Drizzle Studio
npx drizzle-kit studio

# Use the UI to:
# 1. View current schema
# 2. Generate migration
# 3. Apply migration
```

## Verification

After migration, verify the tables exist and have correct structure:

```sql
-- Check quotes table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quotes';

-- Check policies table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'policies';

-- Verify indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename IN ('quotes', 'policies');

-- Test insert (should work)
INSERT INTO quotes (
  partner_id, quote_number, event_type, event_date,
  participants, coverage_type, premium, commission
) VALUES (
  (SELECT id FROM partners LIMIT 1),
  'QT-20250128-00001',
  'Test Event',
  NOW() + INTERVAL '7 days',
  50,
  'liability',
  249.50,
  124.75
);

-- Verify insert
SELECT * FROM quotes ORDER BY created_at DESC LIMIT 1;

-- Clean up test data
DELETE FROM quotes WHERE quote_number = 'QT-20250128-00001';
```

## Rollback Plan

If you need to rollback the migration:

```sql
-- Drop tables (WARNING: This will delete all data)
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
```

## Data Seeding (Optional)

For development/testing, you can seed sample data:

```sql
-- Seed quotes
INSERT INTO quotes (partner_id, quote_number, event_type, event_date, participants, coverage_type, premium, commission, status, customer_email, customer_name)
SELECT
  p.id,
  'QT-20250' || LPAD(generate_series::text, 6, '0'),
  (ARRAY['Gym Session', 'Rock Climbing', 'Equipment Rental'])[1 + (generate_series % 3)],
  NOW() + (generate_series || ' days')::INTERVAL,
  20 + (generate_series % 50),
  (ARRAY['liability', 'equipment', 'cancellation'])[1 + (generate_series % 3)],
  (20 + (generate_series % 50)) * 4.99,
  (20 + (generate_series % 50)) * 4.99 * 0.5,
  (ARRAY['pending', 'accepted', 'declined'])[1 + (generate_series % 3)],
  'customer' || generate_series || '@example.com',
  'Customer ' || generate_series
FROM partners p, generate_series(1, 50)
WHERE p.status = 'active'
LIMIT 50;

-- Seed policies (from accepted quotes)
INSERT INTO policies (
  partner_id, quote_id, policy_number, event_type, event_date,
  participants, coverage_type, premium, commission, status,
  effective_date, expiration_date, customer_email, customer_name
)
SELECT
  q.partner_id,
  q.id,
  REPLACE(q.quote_number, 'QT-', 'POL-'),
  q.event_type,
  q.event_date,
  q.participants,
  q.coverage_type,
  q.premium,
  q.commission,
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  q.customer_email,
  q.customer_name
FROM quotes q
WHERE q.status = 'accepted'
LIMIT 30;
```

## Post-Migration Tasks

1. **Update API Keys/Secrets**
   - Ensure `DATABASE_URL` is set correctly
   - Verify connection pooling settings

2. **Test API Endpoints**
   ```bash
   # Test quote creation
   curl -X POST http://localhost:3000/api/partner/quotes \
     -H "Content-Type: application/json" \
     -d '{"eventType":"Test","eventDate":"2025-03-01","participants":10,"coverageType":"liability"}'

   # Test policy listing
   curl http://localhost:3000/api/partner/policies
   ```

3. **Monitor Performance**
   - Check query execution times
   - Verify indexes are being used
   - Monitor table sizes

4. **Set Up Backup**
   - Configure automatic backups in Neon
   - Test restore procedure

## Troubleshooting

### Error: relation "quotes" does not exist

**Solution**: Migration not applied. Run `npx drizzle-kit push:pg`

### Error: duplicate key value violates unique constraint

**Solution**: Quote/Policy number collision. The generation logic should prevent this, but if it happens:
```sql
-- Check for duplicates
SELECT quote_number, COUNT(*)
FROM quotes
GROUP BY quote_number
HAVING COUNT(*) > 1;
```

### Error: permission denied for table

**Solution**: Database user needs permissions:
```sql
GRANT ALL PRIVILEGES ON TABLE quotes TO your_user;
GRANT ALL PRIVILEGES ON TABLE policies TO your_user;
```

### Slow queries

**Solution**: Verify indexes exist and are being used:
```sql
EXPLAIN ANALYZE
SELECT * FROM quotes
WHERE partner_id = 'some-uuid'
AND status = 'pending';
```

## Environment Variables

Ensure these are set before migration:

```bash
# Required
DATABASE_URL=postgresql://user:password@host/database

# Optional (for Drizzle Studio)
DB_HOST=your-host.neon.tech
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
DB_SSL=true
```

## Production Migration Checklist

- [ ] Backup database before migration
- [ ] Test migration on staging environment first
- [ ] Schedule maintenance window if needed
- [ ] Run migration during low-traffic period
- [ ] Verify all indexes were created
- [ ] Test all API endpoints
- [ ] Monitor error logs
- [ ] Check database size and performance
- [ ] Update documentation
- [ ] Notify team of completion

## Next Migration

When schema changes are needed:

1. Update `/lib/db/schema.ts`
2. Run `npx drizzle-kit generate:pg`
3. Review generated SQL
4. Test on staging
5. Apply to production
6. Update this document

---

**Migration Version**: 1.0.0
**Created**: 2025-01-28
**Status**: Ready for execution
