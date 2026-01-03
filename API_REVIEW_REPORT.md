# API Review Report
## Daily Event Insurance - Campaigns & Leads Endpoints
**Date:** January 2, 2026
**Files Reviewed:**
- `/app/api/campaigns/outbound/route.ts`
- `/app/api/leads/route.ts`

---

## Executive Summary

The API endpoints demonstrate solid foundational architecture with proper validation, error handling, and response formatting. However, there are critical security concerns around TCPA compliance, authentication, and data handling that require immediate attention before production deployment.

**Overall Assessment:** 6.5/10 (Needs Fixes)
- ✅ Good validation structure
- ✅ Consistent response formatting
- ❌ Critical TCPA consent gaps
- ❌ Missing authentication on sensitive endpoints
- ❌ Data type inconsistencies
- ⚠️ Incomplete error handling

---

## Critical Issues (Must Fix)

### 1. TCPA Compliance - Missing Consent Tracking (CRITICAL)

**Location:** `/app/api/leads/route.ts` (POST endpoint) & `/app/api/campaigns/outbound/route.ts` (POST)

**Issue:**
The leads endpoint auto-triggers outbound email sequences without explicit TCPA consent tracking. The `leads` table schema does NOT include TCPA consent fields, yet emails are being sent automatically.

```typescript
// Current code (lines 161-178 in leads/route.ts)
if (['gym', 'wellness', 'ski-resort', 'fitness'].includes(data.vertical)) {
  const { startOutboundSequence } = await import('@/lib/email/sequences-outbound')

  const sequenceResult = await startOutboundSequence({
    // ... sends email without consent verification
  })
}
```

**Regulatory Risk:**
- TCPA violations can result in $500-$1,500 per message in damages
- Potential FTC enforcement action
- Class action lawsuit exposure

**Required Fixes:**
1. Add TCPA consent fields to `leads` table:
```typescript
export const leads = pgTable("leads", {
  // ... existing fields

  // TCPA Compliance Fields (ADD THESE)
  tcpaConsent: boolean("tcpa_consent").notNull().default(false),
  tcpaConsentIP: text("tcpa_consent_ip"),
  tcpaConsentTimestamp: timestamp("tcpa_consent_timestamp"),
  tcpaConsentSource: text("tcpa_consent_source"), // form, widget, manual
  smsOptIn: boolean("sms_opt_in").default(false),
  emailOptIn: boolean("email_opt_in").default(false),
})
```

2. Update validation schema in leads endpoint:
```typescript
const createLeadSchema = z.object({
  // ... existing fields
  tcpaConsent: z.boolean().refine(val => val === true, {
    message: "TCPA consent is required"
  }),
  emailOptIn: z.boolean().optional().default(false),
  smsOptIn: z.boolean().optional().default(false),
})
```

3. Only auto-start sequences if consent is true:
```typescript
if (data.tcpaConsent && ['gym', 'wellness', 'ski-resort', 'fitness'].includes(data.vertical)) {
  // start sequence
}
```

4. Add TCPA consent verification to campaign start endpoint:
```typescript
// In /app/api/campaigns/outbound/route.ts
const leadData = await db.select().from(leads).where(eq(leads.id, leadId))
if (!leadData[0]?.tcpaConsent) {
  return validationError('TCPA consent required to start campaign')
}
```

---

### 2. Missing Authentication on Sensitive Endpoints

**Location:** `/app/api/leads/route.ts` (GET endpoint - line 200)

**Issue:**
The GET endpoint lists all leads but lacks authentication protection:
```typescript
// Current code (line 201-202)
export async function GET(request: NextRequest) {
  // Note: This should be protected but keeping simple for now
  // In production, wrap with withAuth/requireAdmin
  try {
```

This is a DATA BREACH RISK. Any authenticated user or even unauthenticated users could potentially enumerate all leads with business intelligence (email, estimated revenue, company names).

**Required Fixes:**
```typescript
import { withAuth, requireAdmin } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    // Verify admin role
    if (user.role !== 'admin') {
      return forbiddenError('Admin access required')
    }

    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Cap at 100
      // ... rest of implementation
    } catch (error) {
      console.error('Error fetching leads:', error)
      return serverError('Failed to fetch leads')
    }
  })
}
```

**The campaigns/outbound GET endpoint should also be protected:**
```typescript
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    // Verify user owns the lead or is admin
    // ... implementation
  })
}
```

---

### 3. Data Type Inconsistency - estimatedRevenue

**Location:** Both endpoints use inconsistent data types

**Issues:**
- In `/app/api/leads/route.ts`: estimatedRevenue calculated as `number` (lines 59-92)
- Stored in database as `decimal` string: `String(estimatedRevenue)` (line 153)
- In response: returned as `number` (line 186)
- In `/app/api/campaigns/outbound/route.ts`: stored directly as `number` in metadata

**Problem Example:**
```typescript
// Line 107 - calculated as number
const estimatedRevenue = calculateEstimatedRevenue(data)

// Line 153 - converted to string for DB
estimatedRevenue: String(estimatedRevenue)

// But the schema expects decimal
estimatedRevenue: decimal("estimated_revenue", { precision: 10, scale: 2 })
```

**Required Fix:**
Standardize to proper decimal handling:
```typescript
// In calculateEstimatedRevenue - return as number
return Math.round(volume * OPT_IN_RATE * COMMISSION_PER_POLICY * multiplier)

// In POST handler - use decimal.toString()
estimatedRevenue: estimatedRevenue.toFixed(2)

// In response
estimatedRevenue: parseFloat(newLead.estimatedRevenue)
```

---

## High Priority Issues

### 4. Insufficient Input Validation on Optional Fields

**Location:** `/app/api/leads/route.ts` (lines 32-46)

**Issue:**
Multiple optional fields lack length constraints, allowing potential DoS or data bloat:
```typescript
eventName: z.string().optional(),  // No maxLength
eventLocation: z.string().optional(),  // No maxLength
message: z.string().optional(),  // Could be 10MB+
```

**Required Fix:**
```typescript
eventName: z.string().max(255).optional(),
eventLocation: z.string().max(255).optional(),
message: z.string().max(5000).optional(), // Reasonable limit
treatmentTypes: z.array(z.string().max(100)).max(20).optional(),
```

---

### 5. Race Condition - Sequence Already Started

**Location:** `/app/api/campaigns/outbound/route.ts` (POST - line 27-70)

**Issue:**
No check to prevent starting multiple sequences for the same lead:
```typescript
// Could be called twice, creating duplicate sequences
const result = await startOutboundSequence({ leadId, ... })
```

**Required Fix:**
```typescript
// In startOutboundSequence function (sequences-outbound.ts)
try {
  // Check if sequence already exists
  const [existing] = await db!
    .select()
    .from(emailSequences)
    .where(
      and(
        eq(emailSequences.leadId, leadId),
        eq(emailSequences.status, 'active')
      )
    )
    .limit(1)

  if (existing) {
    return {
      success: false,
      error: 'Active sequence already exists for this lead'
    }
  }

  // ... continue with creation
}
```

---

### 6. Missing Rate Limiting

**Location:** Both endpoints

**Issue:**
No rate limiting on lead submission endpoint could allow:
- Form spam attacks
- Abuse of calculation endpoint
- Data exfiltration via campaign status checks

**Required Implementation:**
```typescript
// Create a rate limiting utility
import { Ratelimit } from '@upstash/ratelimit'

const leadSubmissionLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 leads per hour per IP
})

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await leadSubmissionLimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429 }
    )
  }
  // ... rest of handler
}
```

---

## Medium Priority Issues

### 7. Hardcoded Constants Should Be Configurable

**Location:** `/app/api/leads/route.ts` (lines 60-61)

**Issue:**
Commission constants are hardcoded:
```typescript
const OPT_IN_RATE = 0.65
const COMMISSION_PER_POLICY = 14
```

These should be configurable and versioned.

**Recommendation:**
Move to environment variables or database config table:
```typescript
const OPT_IN_RATE = parseFloat(process.env.OPT_IN_RATE || '0.65')
const COMMISSION_PER_POLICY = parseFloat(process.env.COMMISSION_PER_POLICY || '14')
```

---

### 8. Incomplete Error Context

**Location:** `/app/api/campaigns/outbound/route.ts` (lines 48, 90, etc.)

**Issue:**
Generic error messages don't help debugging:
```typescript
if (!result.success) {
  return serverError(result.error || 'Failed to start campaign')
}
```

**Better Approach:**
```typescript
if (!result.success) {
  const errorMessage = result.error || 'Failed to start campaign'
  console.error(`Campaign start failed for lead ${leadId}:`, {
    error: errorMessage,
    vertical,
    timestamp: new Date().toISOString()
  })
  return serverError(errorMessage)
}
```

---

### 9. Partner Attribution Not Validated

**Location:** `/app/api/leads/route.ts` (line 155)

**Issue:**
Partner ID is accepted but never validated:
```typescript
partnerId: z.string().uuid().optional(),
// ...
partnerId: data.partnerId || null // Just trusts it
```

**Risk:** Users could attribute leads to arbitrary partners.

**Required Fix:**
```typescript
// Verify partner exists and is active
if (data.partnerId) {
  const partner = await db!
    .select()
    .from(partners)
    .where(
      and(
        eq(partners.id, data.partnerId),
        eq(partners.status, 'active')
      )
    )
    .limit(1)

  if (!partner.length) {
    return validationError('Invalid or inactive partner')
  }
}
```

---

### 10. GET Endpoint Pagination Not Secure

**Location:** `/app/api/leads/route.ts` (line 206)

**Issue:**
```typescript
const limit = parseInt(searchParams.get('limit') || '20')
```

No upper bound - malicious user could request 1 million records.

**Required Fix:**
```typescript
const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
if (limit < 1) {
  return validationError('Limit must be between 1 and 100')
}
```

---

## Low Priority Issues / Best Practices

### 11. Unused Import

**Location:** `/app/api/campaigns/outbound/route.ts` (line 117)

```typescript
const { startOutboundSequence, getOutboundSequenceStatus } = await import(...)
```

The `startOutboundSequence` is imported but not used in GET handler (only `getOutboundSequenceStatus` is needed).

**Fix:** Remove unused import:
```typescript
const { getOutboundSequenceStatus } = await import('@/lib/email/sequences-outbound')
```

---

### 12. Inconsistent Error Handling

Some catch blocks use generic error while sequences-outbound.ts properly extracts error message.

**Standardize to:**
```typescript
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  console.error('Operation failed:', { error: errorMessage, context: {...} })
  return serverError(errorMessage)
}
```

---

### 13. Missing X-Request-ID for Tracing

**Location:** Both endpoints

**Recommendation:**
Add correlation ID for debugging:
```typescript
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  const requestId = randomUUID()
  const context = { requestId, timestamp: new Date().toISOString() }

  try {
    console.log('[POST /leads]', { ...context, action: 'lead_submission_start' })
    // ... process
    console.log('[POST /leads]', { ...context, action: 'lead_submission_complete' })
  } catch (error) {
    console.error('[POST /leads]', { ...context, error })
  }
}
```

---

### 14. Response Inconsistency

**Location:** Both endpoints

**Issue:**
Pagination is missing in leads GET production response (line 291) while it exists in dev mock (lines 269-274):

```typescript
// Dev response (good)
return NextResponse.json({
  success: true,
  data: paged,
  pagination: {
    page,
    limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit)
  }
})

// Production response (missing pagination details)
return NextResponse.json({
  success: true,
  data: results,
  pagination: { page, limit } // Missing total and totalPages
})
```

**Fix:**
Query for total count in production:
```typescript
const [{ count }] = await db!
  .select({ count: sql<number>`count(*)` })
  .from(leads)

return NextResponse.json({
  success: true,
  data: results,
  pagination: {
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit)
  }
})
```

---

## Security Checklist Summary

| Issue | Severity | Status |
|-------|----------|--------|
| TCPA Consent Missing | 🔴 CRITICAL | ❌ Not Implemented |
| GET Endpoint Unprotected | 🔴 CRITICAL | ❌ Not Implemented |
| Data Type Inconsistency | 🟠 HIGH | ⚠️ Partial |
| Input Validation Gaps | 🟠 HIGH | ❌ Not Implemented |
| Race Condition Risk | 🟠 HIGH | ❌ Not Implemented |
| Rate Limiting Missing | 🟠 HIGH | ❌ Not Implemented |
| Partner Validation Missing | 🟡 MEDIUM | ❌ Not Implemented |
| Pagination Not Bounded | 🟡 MEDIUM | ❌ Not Implemented |
| Unused Imports | 🟢 LOW | ✅ Minor |
| Response Inconsistency | 🟢 LOW | ⚠️ Partial |

---

## File-by-File Recommendations

### `/app/api/campaigns/outbound/route.ts`

**Strengths:**
- Good Zod validation schemas
- Proper error logging
- Clean separation of POST/DELETE/GET

**Must Fix:**
1. Add authentication to all three methods
2. Verify TCPA consent before starting campaigns
3. Fix duplicate import
4. Add duplicate sequence check
5. Add rate limiting

**Implementation Priority:** 1. Auth, 2. TCPA, 3. Validation

---

### `/app/api/leads/route.ts`

**Strengths:**
- Comprehensive validation schema
- Proper database type handling (mostly)
- Dev/prod mode support
- Auto-sequence triggering concept

**Must Fix:**
1. Add TCPA consent fields and validation (CRITICAL)
2. Protect GET endpoint with auth (CRITICAL)
3. Fix estimatedRevenue data types
4. Add input validation limits
5. Validate partner IDs
6. Bound pagination
7. Consistent pagination responses
8. Add rate limiting

**Implementation Priority:** 1. TCPA & Auth, 2. Data Types, 3. Validation, 4. Pagination

---

## Deployment Checklist

Before deploying to production, verify:

- [ ] TCPA consent fields added to schema and captured in form
- [ ] All lead endpoints require authentication
- [ ] Campaign endpoints verify TCPA consent
- [ ] estimatedRevenue uses consistent decimal handling
- [ ] Input validation includes length limits
- [ ] Rate limiting implemented
- [ ] Partner IDs validated
- [ ] Pagination bounded to max 100
- [ ] Responses consistent between dev/prod
- [ ] Error logging includes request context
- [ ] All env variables documented
- [ ] GDPR/CCPA compliance review completed
- [ ] Data retention policies implemented

---

## Testing Recommendations

### Unit Tests Needed:
```typescript
// Test TCPA consent validation
test('POST /leads rejects missing TCPA consent', async () => {})
test('POST /api/campaigns/outbound prevents sequence without consent', async () => {})

// Test auth
test('GET /leads requires admin auth', async () => {})
test('GET /api/campaigns/outbound requires auth', async () => {})

// Test race conditions
test('POST /api/campaigns/outbound prevents duplicate sequences', async () => {})

// Test data types
test('estimatedRevenue stored and returned consistently', async () => {})

// Test validation
test('POST /leads rejects oversized message field', async () => {})
test('GET /leads pagination bounded to 100', async () => {})
```

### Integration Tests:
- Full lead submission → auto-sequence flow with consent
- Campaign stopping when lead converts
- Partner attribution tracking
- Pagination edge cases

---

## Conclusion

The API endpoints have a solid foundation but require critical security fixes before production deployment. The three main issues—TCPA compliance, authentication, and data consistency—must be addressed immediately.

**Estimated Remediation Time:** 3-4 hours for all critical issues

**Estimated Testing Time:** 2 hours

**Go-Live Recommendation:** Once all CRITICAL issues are resolved and tested.

---

**Report Generated:** 2026-01-02
**Reviewed By:** Backend API Developer Agent
**Review Scope:** Security, Input Validation, Authentication, TCPA Compliance
