# Quote Engine Implementation Guide

## Overview

The comprehensive quote engine for Daily Event Insurance provides risk-based pricing, validation, and policy conversion capabilities. This implementation includes:

- **Risk-based pricing** with multiple factors
- **Business logic validation** with warnings
- **Manual review detection** for high-risk scenarios
- **Quote-to-policy conversion** workflow
- **Automatic quote expiration** handling

## Architecture

```
lib/pricing/
├── pricing-engine.ts     # Core pricing calculations with risk factors
├── risk-assessment.ts    # Risk evaluation and underwriting decisions
├── quote-validation.ts   # Business rules and validation logic
├── quote-expiration.ts   # Expiration management and batch updates
└── index.ts             # Public exports

app/api/partner/
├── quotes/
│   ├── route.ts         # List quotes & create new quotes
│   └── [quoteId]/
│       └── route.ts     # Get/update/delete specific quotes
└── cron/
    └── expire-quotes/
        └── route.ts     # Scheduled expiration processing
```

## Pricing Engine

### Risk Factors

The pricing engine evaluates multiple risk dimensions:

1. **Event Type Risk** (0.8 - 2.0x multiplier)
   - Low: Yoga, Pilates, Swimming (0.8 - 0.9x)
   - Medium: Running, CrossFit, Climbing (1.0 - 1.4x)
   - High: Mountain Biking, Zip Lines (1.5 - 1.8x)
   - Very High: Skydiving, Paragliding (1.9 - 2.0x)

2. **Participant Volume Risk** (0.8 - 1.0x multiplier)
   - Small groups (≤10): 1.0x base
   - Large events (100+): 0.9x (economies of scale)
   - Massive events (500+): 0.8x (best discount)

3. **Duration Risk** (0.9 - 1.3x multiplier)
   - Short (≤2 hours): 0.9 - 1.0x
   - Full day (4-8 hours): 1.2x
   - Extended (>8 hours): 1.3x

4. **Date Risk** (1.0 - 1.15x multiplier)
   - Weekends: +0.05x
   - Winter months (Dec-Feb): +0.1x
   - Summer heat (Jun-Aug): +0.05x

5. **Location Risk** (0.9 - 1.2x multiplier)
   - Indoor facilities: 0.9x
   - Outdoor parks: 1.0x
   - Remote/wilderness: 1.2x

6. **Coverage Type Risk** (1.0 - 1.3x multiplier)
   - Liability: 1.0x base
   - Equipment: 1.15x (higher loss frequency)
   - Cancellation: 1.3x (most complex)

### Pricing Formula

```typescript
basePrice = BASE_PRICES[coverageType] // $4.99, $9.99, or $14.99 per participant
basePremium = basePrice * participants

riskMultiplier =
  eventTypeRisk *
  participantRisk *
  durationRisk *
  dateRisk *
  locationRisk *
  coverageRisk

riskAdjustedPremium = basePremium * riskMultiplier
volumeDiscount = riskAdjustedPremium * (tierDiscount * 0.8)
finalPremium = max(
  riskAdjustedPremium - volumeDiscount,
  basePrice * participants * 0.5  // Minimum 50% of base
)

commission = finalPremium * 0.5  // 50% commission rate
```

### Usage Example

```typescript
import { calculatePricing } from "@/lib/pricing"

const result = calculatePricing({
  eventType: "Rock Climbing",
  coverageType: "liability",
  participants: 25,
  eventDate: new Date("2025-02-15"),
  duration: 3,
  location: "Indoor facility",
  partnerVolume: 5000, // For tier-based discounts
})

console.log(result.premium) // $139.44
console.log(result.commission) // $69.72
console.log(result.riskMultiplier) // 1.12
```

## Risk Assessment

### Risk Levels

- **Low** (0-29): Standard processing
- **Medium** (30-49): Normal underwriting
- **High** (50-69): Enhanced review
- **Very High** (70+): Requires manual review

### Underwriting Decisions

1. **Auto-Approve** (score ≤60)
   - Standard activities
   - Small to medium groups
   - Adequate advance notice

2. **Review Required** (61-79)
   - Large events (>1000 participants)
   - Short notice (<12 hours)
   - Remote locations
   - First-time organizers

3. **Decline** (≥80 or critical factors)
   - Past event dates
   - Extremely high-risk activities
   - Insufficient safety measures

### Assessment Example

```typescript
import { assessRisk } from "@/lib/pricing"

const assessment = assessRisk({
  eventType: "Marathon",
  participants: 500,
  eventDate: new Date("2025-03-20"),
  coverageType: "liability",
  eventDetails: {
    hasMedicalStaff: true,
    hasEmergencyPlan: true,
  },
})

console.log(assessment.overallRisk) // "medium"
console.log(assessment.riskScore) // 45
console.log(assessment.decision) // "auto-approve"
```

## Quote Validation

### Validation Rules

1. **Event Type**
   - Min: 2 characters
   - Max: 100 characters
   - Warning: Test entries

2. **Event Date**
   - Not in past
   - Min advance: 4 hours
   - Max advance: 365 days
   - Warning: <24 hours notice

3. **Participants**
   - Range: 1-10,000
   - Integer values only
   - Warning: >1000 (large event)

4. **Duration**
   - Range: 0.5-24 hours
   - Warning: <1 hour or >8 hours

5. **Coverage Type**
   - Valid: liability, equipment, cancellation

### Validation Example

```typescript
import { validateQuote } from "@/lib/pricing"

const validation = validateQuote({
  eventType: "5K Race",
  eventDate: new Date("2025-04-01"),
  participants: 150,
  coverageType: "liability",
  customerEmail: "customer@example.com",
})

if (!validation.valid) {
  console.log(validation.errors) // Array of ValidationError
}

if (validation.warnings.length > 0) {
  console.log(validation.warnings) // Array of ValidationWarning
}
```

## Quote API Endpoints

### POST /api/partner/quotes

Create a new insurance quote.

**Request Body:**
```json
{
  "eventType": "Rock Climbing",
  "eventDate": "2025-03-15T10:00:00Z",
  "participants": 25,
  "coverageType": "liability",
  "eventDetails": {
    "location": "Indoor climbing gym",
    "duration": 3,
    "description": "Beginner climbing session"
  },
  "customerEmail": "john@example.com",
  "customerName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "quote_123",
      "quote_number": "QT-20250228-00123",
      "event_type": "Rock Climbing",
      "event_date": "2025-03-15T10:00:00.000Z",
      "participants": 25,
      "coverage_type": "liability",
      "premium": "139.44",
      "commission": "69.72",
      "status": "pending",
      "expires_at": "2025-03-30T00:00:00.000Z",
      "metadata": "{\"riskMultiplier\":1.12,\"requiresReview\":false}"
    },
    "warnings": [],
    "requiresReview": false
  },
  "message": "Quote created successfully"
}
```

### GET /api/partner/quotes

List partner's quotes with pagination and filters.

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20, max: 100)
- `status` (pending, accepted, declined, expired)
- `coverageType` (liability, equipment, cancellation)
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [/* array of quotes */],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /api/partner/quotes/[quoteId]

Get a specific quote by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "quote": {/* quote object */}
  }
}
```

### PATCH /api/partner/quotes/[quoteId]

Update quote status or convert to policy.

**Accept Quote (Convert to Policy):**
```json
{
  "action": "accept",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "policy": {
      "id": "policy_456",
      "policy_number": "POL-20250228-00456",
      "status": "active",
      "effective_date": "2025-02-28T00:00:00.000Z",
      "expiration_date": "2025-03-15T10:00:00.000Z"
    },
    "quote": {
      "id": "quote_123",
      "status": "accepted",
      "accepted_at": "2025-02-28T12:00:00.000Z"
    }
  },
  "message": "Policy created successfully"
}
```

**Decline Quote:**
```json
{
  "action": "decline"
}
```

**Update Customer Info:**
```json
{
  "action": "update-customer",
  "customerEmail": "newemail@example.com",
  "customerName": "Jane Doe"
}
```

### DELETE /api/partner/quotes/[quoteId]

Cancel a pending or declined quote (soft delete).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Quote cancelled successfully"
  }
}
```

## Quote Expiration

### Automatic Expiration

Quotes expire 30 days after creation by default. A cron job processes expired quotes.

**Setup Cron (vercel.json):**
```json
{
  "crons": [{
    "path": "/api/cron/expire-quotes",
    "schedule": "0 * * * *"
  }]
}
```

**Environment Variable:**
```env
CRON_SECRET=your-secure-random-string
```

### Manual Expiration Processing

```typescript
import { processExpiredQuotes } from "@/lib/pricing/quote-expiration"

const result = await processExpiredQuotes()
console.log(`Expired ${result.expired} quotes`)
```

### Extend Quote Expiration

```typescript
import { extendQuoteExpiration } from "@/lib/pricing/quote-expiration"

const result = await extendQuoteExpiration(quoteId, 7) // +7 days
if (result.success) {
  console.log(`New expiration: ${result.newExpiresAt}`)
}
```

### Check Expiration Status

```typescript
import { getQuoteExpirationStatus } from "@/lib/pricing/quote-expiration"

const status = getQuoteExpirationStatus(quote.expiresAt)
console.log(status.isExpired) // boolean
console.log(status.isExpiringSoon) // Within 24 hours
console.log(status.daysRemaining) // Number
```

## Quote-to-Policy Conversion

### Conversion Requirements

1. Quote status must be "pending"
2. Quote must not be expired
3. Customer email required
4. Customer name required

### Conversion Process

1. Validate quote eligibility
2. Create policy record with:
   - Unique policy number (POL-YYYYMMDD-XXXXX)
   - Active status
   - Effective date (immediately)
   - Expiration date (event date)
   - All quote details copied
3. Update quote status to "accepted"
4. Set acceptedAt timestamp

### Policy Properties

```typescript
{
  id: uuid,
  policy_number: "POL-20250228-00123",
  partner_id: uuid,
  quote_id: uuid,
  event_type: string,
  event_date: Date,
  participants: number,
  coverage_type: "liability" | "equipment" | "cancellation",
  premium: decimal,
  commission: decimal,
  status: "active" | "expired" | "cancelled",
  effective_date: Date,
  expiration_date: Date,
  customer_email: string,
  customer_name: string,
  customer_phone: string?,
  event_details: JSON?,
  certificate_issued: boolean,
  created_at: Date
}
```

## Testing the Quote Engine

### Test Scenarios

1. **Low Risk Quote**
```typescript
{
  eventType: "Yoga Class",
  participants: 15,
  eventDate: +14 days,
  duration: 1.5,
  location: "Indoor studio",
  coverageType: "liability"
}
// Expected: Low risk, auto-approve, ~$75 premium
```

2. **High Risk Quote**
```typescript
{
  eventType: "White Water Rafting",
  participants: 50,
  eventDate: +7 days,
  duration: 6,
  location: "Remote river",
  coverageType: "liability"
}
// Expected: High risk, review required, ~$540 premium
```

3. **Large Event Quote**
```typescript
{
  eventType: "Marathon",
  participants: 2000,
  eventDate: +60 days,
  coverageType: "cancellation"
}
// Expected: Review required, volume discount applied
```

4. **Invalid Quote**
```typescript
{
  eventType: "A", // Too short
  participants: 15000, // Too many
  eventDate: -1 days, // Past
  coverageType: "invalid"
}
// Expected: Validation errors
```

### Manual Testing with curl

```bash
# Create quote
curl -X POST http://localhost:3000/api/partner/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "eventType": "Rock Climbing",
    "eventDate": "2025-03-15T10:00:00Z",
    "participants": 25,
    "coverageType": "liability"
  }'

# List quotes
curl http://localhost:3000/api/partner/quotes?page=1&pageSize=20 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific quote
curl http://localhost:3000/api/partner/quotes/QUOTE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Accept quote (convert to policy)
curl -X PATCH http://localhost:3000/api/partner/quotes/QUOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "action": "accept",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe"
  }'
```

## Integration Guide

### Partner Dashboard Integration

```typescript
// components/partner/quote-form.tsx
import { calculatePricing, validateQuote } from "@/lib/pricing"

async function handleCreateQuote(data) {
  // Client-side validation
  const validation = validateQuote(data)
  if (!validation.valid) {
    showErrors(validation.errors)
    return
  }

  // Show warnings if any
  if (validation.warnings.length > 0) {
    showWarnings(validation.warnings)
  }

  // Calculate preview pricing
  const pricing = calculatePricing({
    eventType: data.eventType,
    coverageType: data.coverageType,
    participants: data.participants,
    eventDate: data.eventDate,
  })

  // Confirm with user
  const confirmed = await confirmQuote({
    premium: pricing.premium,
    commission: pricing.commission,
  })

  if (confirmed) {
    // Submit to API
    const response = await fetch("/api/partner/quotes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}
```

### Widget Integration

```typescript
// For embedded quote widgets
import { getPricingEstimates } from "@/lib/pricing"

const estimates = getPricingEstimates("Rock Climbing", 25)
// Returns min, max, and typical pricing for all coverage types
```

## Performance Considerations

### Database Indexes

Ensure these indexes exist for optimal query performance:

```sql
CREATE INDEX idx_quotes_partner_status ON quotes(partner_id, status);
CREATE INDEX idx_quotes_expires_at ON quotes(expires_at) WHERE status = 'pending';
CREATE INDEX idx_quotes_event_date ON quotes(event_date);
CREATE INDEX idx_policies_partner_created ON policies(partner_id, created_at);
```

### Caching Recommendations

1. **Partner Volume**: Cache for 1 hour
2. **Commission Tiers**: Static data, cache indefinitely
3. **Event Type Risk Map**: Static data, cache indefinitely

## Monitoring & Alerts

### Key Metrics

1. **Quote Creation Rate**: Quotes/day
2. **Conversion Rate**: Policies/Quotes
3. **Average Premium**: By coverage type
4. **Risk Distribution**: Low/Medium/High/Very High
5. **Expiration Rate**: Expired/Total quotes

### Alert Conditions

- Conversion rate drops below 40%
- Average risk score increases above 60
- Expired quotes not processing (cron failure)
- Validation error rate above 10%

## Troubleshooting

### Common Issues

1. **"Quote has expired"**
   - Check expires_at vs current time
   - Use extendQuoteExpiration if needed

2. **"Cannot convert quote to policy"**
   - Verify status is "pending"
   - Check customerEmail and customerName present
   - Ensure quote not expired

3. **Pricing seems too high/low**
   - Review risk multiplier in metadata
   - Check riskFactors breakdown
   - Verify partnerVolume being calculated

4. **Cron not expiring quotes**
   - Verify CRON_SECRET configured
   - Check Vercel cron logs
   - Test endpoint manually

## Future Enhancements

1. **Dynamic Risk Adjustment**: Learn from claims data
2. **Partner-Specific Pricing**: Custom rates per partner
3. **Multi-Coverage Bundles**: Discounts for multiple coverages
4. **Seasonal Pricing**: Adjust rates by season
5. **Weather Integration**: Real-time weather risk pricing
6. **Renewal Workflows**: Auto-renew recurring events
7. **Payment Integration**: Stripe/payment processing
8. **Certificate Generation**: PDF policy certificates

## Support

For questions or issues:
- Email: support@dailyeventinsurance.com
- Docs: /docs/QUOTE-ENGINE-IMPLEMENTATION.md
- API Reference: /docs/API.md
