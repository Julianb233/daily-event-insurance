# PRD: Partner Dashboard System

## Introduction

The Partner Dashboard is the primary interface for insurance distribution partners to manage their business with Daily Event Insurance. Partners use this dashboard to create quotes, track policies sold, monitor earnings and commissions, access marketing materials, and manage their account settings. The dashboard provides real-time analytics and tools to help partners maximize their insurance revenue.

## Goals

- Enable partners to create and manage quotes in under 30 seconds
- Provide real-time visibility into earnings and commission tier progress
- Reduce partner support requests by 70% through self-service tools
- Increase partner engagement with daily/weekly usage targets
- Provide analytics to help partners optimize their insurance sales
- Simplify access to marketing and integration resources

## Target Users

1. **Active Partners**: Gym owners, facility managers actively selling insurance
2. **New Partners**: Recently onboarded partners learning the platform
3. **Multi-Location Partners**: Managers overseeing multiple facilities
4. **Partner Staff**: Front desk employees using quote tools

## User Stories

### US-001: Partner Dashboard Home
**Description:** As a partner, I want to see my key metrics at a glance so I can track my performance.

**Acceptance Criteria:**
- [ ] Dashboard displays: Policies Sold (today/week/month), Revenue Earned
- [ ] Current commission tier and progress to next tier
- [ ] Conversion rate: quotes created vs policies sold
- [ ] Recent activity: last 5 quotes/policies
- [ ] Quick action buttons: New Quote, View Earnings, Get Help
- [ ] Notifications for important updates
- [ ] npm run build passes

### US-002: Create New Quote
**Description:** As a partner, I want to quickly create a quote for a customer so they can see pricing.

**Acceptance Criteria:**
- [ ] /partner/quotes/new opens quote creation form
- [ ] Fields: Event Type, Event Date, Number of Participants, Duration
- [ ] Coverage Type selector: Liability, Equipment, Cancellation
- [ ] Customer info (optional): Name, Email
- [ ] Real-time price preview as fields are filled
- [ ] Shows breakdown: Base price, Risk factors, Commission
- [ ] Submit creates quote and shows shareable link
- [ ] Form completes in under 30 seconds

### US-003: Quote List Management
**Description:** As a partner, I want to see all my quotes so I can track and follow up.

**Acceptance Criteria:**
- [ ] /partner/quotes displays paginated quote list
- [ ] Columns: Quote #, Customer, Event, Price, Status, Created, Expires
- [ ] Filter by: status (pending, accepted, expired, declined)
- [ ] Search by quote number or customer name
- [ ] Sort by date, price, status
- [ ] Click row to view quote detail
- [ ] Quick actions: Copy Link, Send Email, Extend Expiration

### US-004: Quote Detail View
**Description:** As a partner, I want to see full quote details so I can discuss with customers.

**Acceptance Criteria:**
- [ ] /partner/quotes/[id] shows complete quote
- [ ] Event details: type, date, participants, duration, location
- [ ] Pricing breakdown: base, risk factors, final price
- [ ] Commission: amount partner will earn
- [ ] Customer info if provided
- [ ] Quote status with timestamps
- [ ] Actions: Copy Link, Email Quote, Extend, Cancel
- [ ] Link to policy if converted

### US-005: Policy Tracking
**Description:** As a partner, I want to see all policies from my quotes so I know what coverage is active.

**Acceptance Criteria:**
- [ ] /partner/policies displays paginated policy list
- [ ] Columns: Policy #, Customer, Coverage, Premium, Commission, Status, Date
- [ ] Filter by: status (active, expired, cancelled), coverage type, date
- [ ] Search by policy number or customer
- [ ] Summary stats: total active, total revenue, total commission
- [ ] Click row to view policy detail
- [ ] Export to CSV

### US-006: Policy Detail View
**Description:** As a partner, I want to see policy details so I can answer customer questions.

**Acceptance Criteria:**
- [ ] /partner/policies/[id] shows complete policy
- [ ] Coverage: type, effective dates, participants covered
- [ ] Customer: name, email (if available)
- [ ] Payment: amount, date, status
- [ ] Commission: earned amount, payout status
- [ ] Print/download policy summary
- [ ] Link to original quote

### US-007: Earnings Dashboard
**Description:** As a partner, I want to see my earnings so I can track my income.

**Acceptance Criteria:**
- [ ] /partner/earnings displays earnings overview
- [ ] Period selector: This Week, This Month, Last Month, Custom
- [ ] Total earnings for selected period
- [ ] Breakdown by coverage type
- [ ] Policies sold count
- [ ] Average commission per policy
- [ ] Chart: earnings trend over time
- [ ] Pending vs paid earnings

### US-008: Commission Tier Progress
**Description:** As a partner, I want to see my tier status so I know how to increase my commission rate.

**Acceptance Criteria:**
- [ ] Shows current tier name and rate (e.g., "Silver - 27.5%")
- [ ] Progress bar to next tier
- [ ] Participants needed to reach next tier
- [ ] Next tier benefits preview
- [ ] Rolling 30-day volume calculation
- [ ] Historical tier changes
- [ ] Tips to increase sales volume

### US-009: Payout History
**Description:** As a partner, I want to see my payout history so I can reconcile with my bank.

**Acceptance Criteria:**
- [ ] List of all payouts with: Date, Amount, Period, Status
- [ ] Filter by: status (pending, processing, completed), date range
- [ ] Click row for payout detail breakdown
- [ ] Shows individual policy commissions in payout
- [ ] Download payout statement PDF
- [ ] Payment method on file

### US-010: Marketing Materials
**Description:** As a partner, I want to access marketing materials so I can promote insurance to my members.

**Acceptance Criteria:**
- [ ] /partner/materials displays available resources
- [ ] Categories: Posters, Digital Assets, Email Templates, Social Media
- [ ] Preview images/PDFs before download
- [ ] Download individual assets
- [ ] Download all as ZIP
- [ ] Custom co-branded materials with partner logo
- [ ] Widget embed code for website integration

### US-011: Integration Widget Setup
**Description:** As a partner, I want to add a quote widget to my website so members can self-serve.

**Acceptance Criteria:**
- [ ] Widget configuration page
- [ ] Customize: colors to match partner branding
- [ ] Select: default coverage type, pre-filled event types
- [ ] Generate embed code (script tag)
- [ ] Preview widget appearance
- [ ] Copy code to clipboard
- [ ] Documentation link for developers

### US-012: Partner Profile Management
**Description:** As a partner, I want to update my business information so my records are current.

**Acceptance Criteria:**
- [ ] /partner/profile shows current business info
- [ ] Editable: Business name, address, phone, website
- [ ] Editable: Primary contact name, email
- [ ] Upload business logo
- [ ] View/update bank account for payouts
- [ ] View signed documents (Agreement, W9)
- [ ] Request document updates if needed

### US-013: Partner Settings
**Description:** As a partner, I want to configure my account settings so the platform works my way.

**Acceptance Criteria:**
- [ ] /partner/settings shows configuration options
- [ ] Notification preferences: email frequency, types
- [ ] Default coverage type for new quotes
- [ ] Team access: add/remove staff users (Phase 2)
- [ ] API key management for integrations
- [ ] Two-factor authentication setup
- [ ] Password change

### US-014: Quote Calculator Widget (Embeddable)
**Description:** As a partner, I want an embeddable calculator so customers can get instant quotes.

**Acceptance Criteria:**
- [ ] Lightweight JavaScript widget
- [ ] Configurable via data attributes
- [ ] Matches partner brand colors
- [ ] Fields: participants, coverage type, event date
- [ ] Real-time price calculation
- [ ] "Get Quote" submits to partner's account
- [ ] Mobile responsive
- [ ] Works on any website

## Functional Requirements

- FR-1: Partner dashboard requires authentication with partner role
- FR-2: Dashboard data scoped to authenticated partner only
- FR-3: Quote creation validates input and shows real-time pricing
- FR-4: Policy list includes only policies from partner's quotes
- FR-5: Earnings calculated from policy commissions with tier rates
- FR-6: Commission tier calculated from 30-day rolling participant volume
- FR-7: Payout history shows all completed and pending payouts
- FR-8: Marketing materials downloadable with optional co-branding
- FR-9: Widget embed code unique to partner with tracking
- FR-10: Profile updates trigger re-validation for sensitive fields

## Non-Goals (Out of Scope)

- Multi-user team management (single user per partner for v1)
- White-label fully custom domain
- Direct customer communication via dashboard
- Claims filing by partners
- Custom pricing overrides
- Partner-to-partner referrals

## Technical Considerations

- **Routes**: /partner/* protected by middleware role check
- **Data Isolation**: All queries filtered by partner_id from session
- **Performance**: Earnings queries may be slow; use caching/aggregates
- **Widget**: Served from CDN with CORS for any origin
- **Caching**: Dashboard metrics cached with 5-minute TTL
- **Mobile**: Fully responsive design, mobile-first for quick quote creation

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/partner/dashboard | GET | Dashboard metrics |
| /api/partner/quotes | GET, POST | Quote list, create |
| /api/partner/quotes/[id] | GET, PATCH | Quote detail, update |
| /api/partner/quotes/estimate | POST | Price preview (no save) |
| /api/partner/policies | GET | Policy list |
| /api/partner/policies/[id] | GET | Policy detail |
| /api/partner/earnings | GET | Earnings summary |
| /api/partner/payouts | GET | Payout history |
| /api/partner/materials | GET | Marketing materials list |
| /api/partner/profile | GET, PATCH | Profile management |
| /api/partner/settings | GET, PATCH | Settings management |
| /api/partner/widget | GET | Widget configuration |

## Success Metrics

- Partner dashboard load time < 1.5 seconds
- Quote creation < 30 seconds average
- Daily active partner rate > 40%
- Quote-to-policy conversion > 35%
- Partner support tickets reduced by 60%
- Widget integration rate > 25% of partners

## Open Questions

- Should partners be able to create quotes on behalf of customers via phone?
- What is the minimum payout threshold before processing?
- Should we show competitor comparison in earnings?
