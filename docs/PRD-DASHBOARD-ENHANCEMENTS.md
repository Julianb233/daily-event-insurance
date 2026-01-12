# Product Requirements Document: Admin & Partner Dashboard Enhancements

**Version:** 2.0  
**Date:** January 12, 2026  
**Project:** Daily Event Insurance  
**Priority:** High  

---

## Business Model Clarification

**Daily Event Insurance is a broker/affiliate platform - NOT an insurance provider.**

- **Partners** = Businesses (gyms, climbing gyms, adventure sports, rentals) who refer customers
- Partners earn **commission** when their referred customers purchase insurance policies
- Insurance is provided by **insurance company partners** (carriers)
- **Claims are NOT managed by this platform** - handled directly by insurance carriers
- We track: leads, policies sold, commissions, partner performance

---

## 1. Current State Analysis

### Admin Dashboard - Existing Features ✅
- Dashboard overview with metrics
- Partner management with tier overrides
- Leads management with interest scoring
- Payouts management (pending/processing/paid)
- Commission tiers configuration
- Policies listing page
- Reports page (placeholder)

### Admin Dashboard - Gaps Identified 🔴
1. **No partner detail view** - `/admin/partners/[id]` missing
2. **No lead detail view** - `/admin/leads/[id]` incomplete
3. **Reports not functional** - Preview/Export buttons don't work
4. **Settings page incomplete** - No system configuration options
5. **No real-time data** - Most pages use mock data

### Partner Dashboard - Existing Features ✅
- Dashboard overview with earnings chart
- Earnings page with tier progress
- Quotes management with filtering
- Policies listing with stats
- Settings with notification preferences
- Materials/resources page
- Profile page
- Analytics page

### Partner Dashboard - Gaps Identified 🔴
1. **No quote editing** - Can only view quotes, not modify
2. **No policy certificates** - Can't download/view certificates
3. **No widget customization** - Partners can't configure embedded widget
4. **API keys page missing** - For API integration partners

---

## 2. Requirements

### 2.1 Admin Dashboard Enhancements

#### ADM-001: Partner Detail View
**Priority:** P0 - Critical
- Create `/admin/partners/[id]/page.tsx`
- Show full partner profile, documents status, activity history
- Commission history and current tier
- All policies and quotes by partner
- Actions: Edit profile, change status, override tier

#### ADM-002: Lead Detail View  
**Priority:** P1 - High
- Create `/admin/leads/[id]/page.tsx`
- Full lead profile with all communications
- Call/SMS/Email history
- Interest scoring breakdown
- Actions: Update status, schedule follow-up, convert to partner

#### ADM-003: Functional Reports System
**Priority:** P1 - High
- Connect reports to actual database queries
- Generate revenue reports by date range
- Commission reports by partner
- Policy reports by type/coverage
- Export to CSV/PDF functionality

#### ADM-004: Admin Settings Page
**Priority:** P2 - Medium
- System email configuration
- Default commission rates
- Policy pricing configuration
- Integration settings (GHL, etc.)

### 2.2 Partner Dashboard Enhancements

#### PTR-001: Analytics Page ✅ COMPLETE
- Policy conversion rates
- Revenue trends over time
- Coverage type breakdown
- Period comparison

#### PTR-002: Quote Editing
**Priority:** P2 - Medium
- Edit pending quotes
- Extend quote expiration
- Cancel/delete quotes
- Resend quote to customer

#### PTR-003: Policy Certificates
**Priority:** P1 - High
- View certificate of insurance
- Download PDF certificates
- Share certificate link

#### PTR-004: Widget Customization
**Priority:** P2 - Medium
- Customize widget colors
- Preview widget
- Get embed code

---

## 3. User Stories

### Story 1: Partner Performance Tracking
*Gym owner Sarah logs into her partner dashboard. She sees she's sold 127 policies this month, earning $3,178 in commission. Her analytics show she's up 13% from last month. She's at the Gold tier and only 500 participants away from Platinum, which would increase her rate by 5%.*

### Story 2: Admin Partner Management
*Admin Mike opens the partners page and sees 3 pending applications. He clicks on "Peak Fitness" to view details - their business info, document status, and projected volume. He approves them with one click and they receive their login credentials.*

### Story 3: Lead Conversion
*Admin Sales Rep Maria sees a hot lead from a climbing gym. She opens the lead detail page, reviews their quiz answers, and calls them. After a 15-minute call, she marks them as "Qualified" and schedules a demo. The lead converts to a partner the next week.*

### Story 4: Commission Payout
*It's the 1st of the month. Admin Lisa opens payouts and sees $45,000 pending across 15 partners. She processes all payouts and partners receive notifications that their commission is on the way.*

---

## 4. Database Schema (Supabase)

### Core Tables Required
- `users` - Authentication
- `partners` - Business partners (gyms, etc.)
- `leads` - Prospective partners
- `lead_communications` - Call/SMS/Email logs
- `quotes` - Insurance quote requests
- `policies` - Active insurance policies
- `commission_tiers` - Commission rate tiers
- `commission_payouts` - Payout history
- `monthly_earnings` - Partner earnings tracking

### Tables NOT Needed (removed)
- ~~`claims`~~ - Handled by insurance carriers
- ~~`claim_documents`~~ - Not applicable

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Partner activation time | < 24 hours |
| Lead conversion rate | > 20% |
| Report generation time | < 5 seconds |
| Partner dashboard engagement | 3x/week |

---

## 6. Implementation Status

### Completed ✅
- Partner Claims API (removed - not needed)
- Partner Analytics API
- Partner Analytics Page
- Admin Partner Detail API
- Admin Lead Detail API

### In Progress 🔄
- Sidebar navigation updates
- Build verification

### Remaining 📋
- Admin Partner Detail Page
- Admin Lead Detail Page
- Quote editing functionality
- Report generation
- Widget customization

---

*Document updated to reflect correct business model - Broker/Affiliate platform*
