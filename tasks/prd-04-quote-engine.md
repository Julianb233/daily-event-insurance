# PRD: Quote Engine & Pricing System

## Introduction

The Quote Engine is the core pricing and underwriting system for Daily Event Insurance. It calculates risk-based premiums for insurance coverage, validates quote requests, performs automated underwriting decisions, and manages quote lifecycle (creation, expiration, conversion to policy). The system supports multiple coverage types and uses a multi-factor risk assessment model to price policies appropriately.

## Goals

- Calculate accurate, risk-adjusted premiums in < 10ms
- Automate underwriting decisions for 95% of quotes
- Reduce manual review to only high-risk edge cases
- Support three coverage types: Liability, Equipment, Cancellation
- Manage quote validity and automatic expiration
- Enable seamless quote-to-policy conversion
- Provide tiered commission rates based on partner volume

## Target Users

1. **Partners**: Submit quote requests via API or dashboard
2. **Customers**: Receive quotes and purchase policies
3. **Underwriters**: Review flagged quotes requiring manual decision
4. **System**: Automated pricing and expiration processing

## User Stories

### US-001: Create Insurance Quote
**Description:** As a partner, I want to create a quote for a customer so they can see the price before purchasing.

**Acceptance Criteria:**
- [ ] POST /api/partner/quotes creates new quote
- [ ] Required fields: eventType, eventDate, participants, coverageType
- [ ] Optional fields: duration, location, customerEmail, customerName
- [ ] Returns quote with: quoteNumber, premium, commission, riskMultiplier, expiresAt
- [ ] Quote number format: QT-YYYYMMDD-XXXXX (5 random chars)
- [ ] Quote expires in 30 days by default
- [ ] Status set to "pending"
- [ ] npm run build passes

### US-002: Risk-Based Premium Calculation
**Description:** As the system, I need to calculate premiums based on multiple risk factors so pricing reflects actual risk.

**Acceptance Criteria:**
- [ ] Base prices: Liability $4.99, Equipment $9.99, Cancellation $14.99 per participant
- [ ] Event Type Risk multiplier (0.8 - 2.0x) based on activity type
- [ ] Participant Volume Risk (0.8 - 1.0x) based on group size
- [ ] Duration Risk (0.9 - 1.3x) based on event hours
- [ ] Date Risk (1.0 - 1.15x) for weekends, holidays, peak seasons
- [ ] Location Risk (0.9 - 1.2x) for indoor vs outdoor, location type
- [ ] Coverage Type Risk (1.0 - 1.3x) based on coverage level
- [ ] Final premium = base × participants × combined risk multiplier
- [ ] Calculation completes in < 10ms

### US-003: Risk Assessment Scoring
**Description:** As the system, I need to generate a risk score so underwriting decisions can be automated.

**Acceptance Criteria:**
- [ ] Risk score calculated on 0-100 scale
- [ ] Score factors: event type, participant count, duration, date, location
- [ ] Risk levels: Low (0-29), Medium (30-49), High (50-69), Very High (70+)
- [ ] Risk assessment stored in quote metadata
- [ ] Individual risk factors stored for transparency

### US-004: Automated Underwriting Decision
**Description:** As the system, I want to automatically approve or flag quotes so processing is instant for standard cases.

**Acceptance Criteria:**
- [ ] Auto-Approve: Risk score ≤ 60
- [ ] Review Required: Risk score 61-79
- [ ] Decline: Risk score ≥ 80 or critical risk factors present
- [ ] Critical factors: extreme sports, very large groups (>500), hazardous conditions
- [ ] requiresReview flag set when manual review needed
- [ ] reviewReasons array populated with specific concerns
- [ ] Decision made synchronously during quote creation

### US-005: Quote Validation
**Description:** As the system, I need to validate quote requests so invalid data is rejected upfront.

**Acceptance Criteria:**
- [ ] Event type: 2-100 characters required
- [ ] Event date: Must be 4 hours to 365 days in the future
- [ ] Participants: 1-10,000 range
- [ ] Duration: 0.5-24 hours
- [ ] Coverage type: Must be liability, equipment, or cancellation
- [ ] Customer email: Valid format if provided
- [ ] Validation errors return specific field-level messages
- [ ] Warnings returned for edge cases (non-blocking)

### US-006: List Partner Quotes
**Description:** As a partner, I want to see all my quotes so I can track and manage them.

**Acceptance Criteria:**
- [ ] GET /api/partner/quotes returns paginated list
- [ ] Filter by status: pending, accepted, declined, expired
- [ ] Filter by coverage type
- [ ] Filter by date range
- [ ] Order by creation date (newest first)
- [ ] Default page size 20, max 100
- [ ] Returns pagination metadata (total, pages, hasNext)

### US-007: Get Quote Details
**Description:** As a partner, I want to view a specific quote so I can see full details and take action.

**Acceptance Criteria:**
- [ ] GET /api/partner/quotes/[quoteId] returns full quote
- [ ] Includes risk factors breakdown
- [ ] Includes validation warnings if any
- [ ] Includes time remaining until expiration
- [ ] Returns 404 if quote not found or not owned by partner

### US-008: Convert Quote to Policy
**Description:** As the system, I need to convert accepted quotes to policies so coverage becomes active.

**Acceptance Criteria:**
- [ ] PATCH /api/partner/quotes/[quoteId] with action: "accept"
- [ ] Validates quote is still pending and not expired
- [ ] Creates new policy record with all quote details
- [ ] Policy number format: POL-YYYYMMDD-XXXXX
- [ ] Sets quote status to "accepted" with acceptedAt timestamp
- [ ] Policy status set to "pending" (awaiting payment)
- [ ] Returns created policy details

### US-009: Decline Quote
**Description:** As a partner, I want to decline a quote so I can clean up quotes customers won't use.

**Acceptance Criteria:**
- [ ] PATCH /api/partner/quotes/[quoteId] with action: "decline"
- [ ] Sets status to "declined" with declinedAt timestamp
- [ ] Optional decline reason stored
- [ ] Cannot decline already accepted quotes

### US-010: Automatic Quote Expiration
**Description:** As the system, I need to expire old quotes so pricing stays current.

**Acceptance Criteria:**
- [ ] Cron endpoint POST /api/cron/expire-quotes
- [ ] Finds all quotes where expiresAt < now and status = "pending"
- [ ] Updates status to "expired" in batch
- [ ] Secured with CRON_SECRET header
- [ ] Runs hourly via Vercel cron
- [ ] Returns count of expired quotes

### US-011: Extend Quote Expiration
**Description:** As a partner, I want to extend a quote's validity so customers have more time to decide.

**Acceptance Criteria:**
- [ ] PATCH /api/partner/quotes/[quoteId] with action: "extend"
- [ ] Extends by 30 days from current date
- [ ] Maximum total validity: 90 days from creation
- [ ] Can only extend pending quotes
- [ ] Returns updated expiration date

### US-012: Commission Tier Calculation
**Description:** As the system, I need to calculate partner commission based on volume so high-volume partners earn more.

**Acceptance Criteria:**
- [ ] 6 commission tiers from 25% to 37.5%
- [ ] Tier determined by last 30 days participant volume
- [ ] Commission = premium × tier rate
- [ ] Tier thresholds: 0-999 (25%), 1000-2499 (27.5%), 2500-4999 (30%), 5000-9999 (32.5%), 10000-24999 (35%), 25000+ (37.5%)
- [ ] Location bonus adds $0.50-$2.00 per participant for multi-location partners

### US-013: Price Estimate Preview
**Description:** As a partner, I want to get a price estimate without creating a quote so customers can see approximate cost.

**Acceptance Criteria:**
- [ ] POST /api/partner/quotes/estimate returns pricing preview
- [ ] Same calculation as full quote
- [ ] Does not create database record
- [ ] Returns: premium, commission, riskMultiplier, perParticipant
- [ ] Useful for widget/calculator integrations

## Functional Requirements

- FR-1: Pricing engine calculates risk-adjusted premiums using 6 risk factors
- FR-2: Base prices are $4.99 (liability), $9.99 (equipment), $14.99 (cancellation) per participant
- FR-3: Risk multipliers range from 0.8x to 2.0x based on combined factors
- FR-4: Risk assessment generates 0-100 score for underwriting automation
- FR-5: Quotes auto-approved when risk score ≤ 60
- FR-6: Quotes flagged for review when risk score 61-79
- FR-7: Quotes auto-declined when risk score ≥ 80 or critical factors present
- FR-8: Quote validation rejects invalid data with specific error messages
- FR-9: Quotes expire after 30 days if not converted to policy
- FR-10: Quote-to-policy conversion creates policy and updates quote status
- FR-11: Commission calculated per tier based on 30-day rolling volume
- FR-12: All API endpoints require partner authentication

## Non-Goals (Out of Scope)

- Machine learning-based risk models (using static rules for v1)
- Weather API integration for outdoor event risk
- Multi-coverage bundles (single coverage per quote)
- Automatic quote renewal
- Customer-facing quote portal (partner-initiated only)
- Real-time claims data integration for risk adjustment

## Technical Considerations

- **Performance**: Pricing calculation < 10ms, risk assessment < 15ms
- **Database**: Quotes table with indexes on partner_id, status, expires_at, created_at
- **Caching**: Partner volume calculation can be cached (TTL: 1 hour)
- **Modules**: lib/pricing/pricing-engine.ts, risk-assessment.ts, quote-validation.ts, quote-expiration.ts
- **API**: RESTful endpoints under /api/partner/quotes

## Risk Factor Configuration

```typescript
// Event Type Risk Examples
{
  "Yoga Class": 0.8,
  "Weight Training": 1.0,
  "Rock Climbing": 1.4,
  "Martial Arts": 1.5,
  "Skydiving": 2.0
}

// Participant Risk
{
  "1-10": 0.9,
  "11-50": 1.0,
  "51-100": 1.0,
  "101-500": 1.05,
  "500+": 1.1
}
```

## Success Metrics

- Quote creation API response time < 200ms
- 95% of quotes auto-approved without manual review
- Quote-to-policy conversion rate > 30%
- Zero pricing calculation errors in production
- Quote expiration processing < 500ms for 1000 quotes

## Open Questions

- Should expired quotes be reactivated with updated pricing?
- What happens to quotes when partner is suspended?
- Should we implement quote versioning for audit purposes?
