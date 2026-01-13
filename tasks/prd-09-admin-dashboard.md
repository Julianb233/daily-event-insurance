# PRD: Admin Dashboard System

## Introduction

The Admin Dashboard is the central command center for Daily Event Insurance operations. Administrators use this dashboard to manage partners, review policies, process claims, configure commission tiers, manage payouts, and generate business reports. The dashboard provides real-time visibility into platform metrics and actionable controls for all administrative functions.

## Goals

- Provide single-pane-of-glass visibility into all platform operations
- Enable efficient partner management and onboarding oversight
- Streamline claims review and approval workflow
- Configure and manage commission tier structures
- Track and process partner payouts accurately
- Generate business intelligence reports for decision-making
- Reduce admin operational time by 60% through automation

## Target Users

1. **Super Admins**: Full access to all features and settings
2. **Claims Adjusters**: Access to claims review and policy details
3. **Partner Managers**: Access to partner management and support
4. **Finance Team**: Access to payouts, commissions, and financial reports

## User Stories

### US-001: Admin Dashboard Overview
**Description:** As an admin, I want to see key metrics at a glance so I can monitor platform health quickly.

**Acceptance Criteria:**
- [ ] Dashboard displays: Active Partners, Total Policies (today/week/month), Revenue
- [ ] Real-time quote volume and conversion rate
- [ ] Pending claims count with urgency indicators
- [ ] Partner onboarding pipeline summary
- [ ] Recent activity feed (last 24 hours)
- [ ] Quick action buttons for common tasks
- [ ] npm run build passes

### US-002: Partner Management List
**Description:** As an admin, I want to view and manage all partners so I can oversee the partner network.

**Acceptance Criteria:**
- [ ] /admin/partners displays paginated partner list
- [ ] Columns: Business Name, Status, Policies Sold, Revenue, Commission Tier, Joined Date
- [ ] Filter by: status (pending, active, suspended), business type, tier
- [ ] Search by business name, contact name, or email
- [ ] Sort by: name, status, policies, revenue, date
- [ ] Click row to open partner detail page
- [ ] Bulk actions: Send Message, Update Tier, Suspend

### US-003: Partner Detail & Edit
**Description:** As an admin, I want to view and edit partner details so I can manage individual partner relationships.

**Acceptance Criteria:**
- [ ] /admin/partners/[id] shows complete partner profile
- [ ] Business info: name, type, address, contact details
- [ ] Performance metrics: policies sold, revenue, conversion rate
- [ ] Commission tier and custom rate overrides
- [ ] Document status (Agreement, W9, Direct Deposit)
- [ ] Activity log of all partner actions
- [ ] Edit button opens inline editing mode
- [ ] Action buttons: Approve, Suspend, Send Documents, Reset Password

### US-004: Policy Management
**Description:** As an admin, I want to view all policies so I can track coverage and handle issues.

**Acceptance Criteria:**
- [ ] /admin/policies displays paginated policy list
- [ ] Columns: Policy #, Customer, Partner, Coverage, Premium, Status, Date
- [ ] Filter by: status (active, expired, cancelled), coverage type, date range
- [ ] Search by policy number, customer name, or partner
- [ ] Click row to view policy detail
- [ ] Export to CSV for reporting
- [ ] Bulk status updates for expired policies

### US-005: Policy Detail View
**Description:** As an admin, I want to see complete policy information so I can resolve customer issues.

**Acceptance Criteria:**
- [ ] /admin/policies/[id] shows full policy details
- [ ] Customer info: name, email, phone
- [ ] Coverage details: type, dates, participants, premium
- [ ] Payment info: amount, method, Stripe reference
- [ ] Partner info: business name, commission earned
- [ ] Linked claims if any
- [ ] Cancel policy button with refund confirmation
- [ ] Send policy documents to customer

### US-006: Claims Dashboard
**Description:** As a claims adjuster, I want to see all claims so I can process them efficiently.

**Acceptance Criteria:**
- [ ] /admin/claims displays claims queue
- [ ] Columns: Claim #, Policy #, Customer, Type, Amount, Status, Filed Date
- [ ] Filter by: status (pending, under_review, approved, denied), type, date
- [ ] Priority queue: high-value claims and those approaching SLA
- [ ] Assignee filter for workload management
- [ ] Quick actions: Assign, Approve, Deny

### US-007: Claim Review & Processing
**Description:** As a claims adjuster, I want to review and process individual claims so customers are resolved quickly.

**Acceptance Criteria:**
- [ ] /admin/claims/[id] shows full claim details
- [ ] Claim info: description, amount requested, date of incident
- [ ] Attached evidence: photos, videos, documents
- [ ] Policy and customer context
- [ ] Communication history with customer
- [ ] Approve button: sets amount, reason, triggers payment
- [ ] Deny button: requires reason, triggers notification
- [ ] Request More Info: sends email to customer

### US-008: Commission Tiers Configuration
**Description:** As an admin, I want to configure commission tiers so partner incentives are aligned.

**Acceptance Criteria:**
- [ ] /admin/commission-tiers displays tier structure
- [ ] Tiers show: name, volume threshold, percentage, location bonus
- [ ] Edit tier: change thresholds, rates, bonuses
- [ ] Add new tier with validation
- [ ] Preview impact: show how many partners affected by changes
- [ ] Audit log of tier changes
- [ ] Effective date for tier changes

### US-009: Payout Management
**Description:** As a finance admin, I want to process partner payouts so partners receive their earnings.

**Acceptance Criteria:**
- [ ] /admin/payouts displays payout schedule
- [ ] Columns: Partner, Period, Gross Amount, Fees, Net Amount, Status
- [ ] Filter by: status (pending, processing, completed, failed), date
- [ ] Generate payout batch for selected period
- [ ] Review individual payout details before processing
- [ ] Mark as paid with reference number
- [ ] Export payout report for accounting

### US-010: Payout Batch Processing
**Description:** As a finance admin, I want to process payouts in batches so payments are efficient.

**Acceptance Criteria:**
- [ ] Select pay period (bi-weekly, monthly)
- [ ] Calculate commissions for all partners in period
- [ ] Display batch summary: total amount, partner count
- [ ] Individual partner amounts with breakdown
- [ ] Approve batch for processing
- [ ] Integration with payment processor (Stripe Connect or bank transfer)
- [ ] Email notification to partners when paid

### US-011: Business Reports
**Description:** As an admin, I want to generate reports so I can make data-driven decisions.

**Acceptance Criteria:**
- [ ] /admin/reports displays available report types
- [ ] Report types: Revenue, Policies, Partners, Claims, Commissions
- [ ] Date range selector for all reports
- [ ] Charts and graphs for visual analysis
- [ ] Tabular data with drill-down capability
- [ ] Export to CSV, PDF formats
- [ ] Schedule recurring reports via email

### US-012: Admin Settings
**Description:** As a super admin, I want to configure platform settings so the system operates correctly.

**Acceptance Criteria:**
- [ ] /admin/settings accessible only to super admins
- [ ] Pricing configuration: base prices, risk multipliers
- [ ] Email templates management
- [ ] Integration settings: Stripe keys, GHL config, LiveKit
- [ ] User management: add/remove admins, assign roles
- [ ] Feature flags for testing new functionality
- [ ] Audit log of all settings changes

### US-013: Admin User Management
**Description:** As a super admin, I want to manage admin users so team access is controlled.

**Acceptance Criteria:**
- [ ] List all admin users with roles
- [ ] Invite new admin via email
- [ ] Assign role: super_admin, claims_adjuster, partner_manager, finance
- [ ] Deactivate admin accounts
- [ ] Reset admin passwords
- [ ] View admin activity logs
- [ ] Role permissions are enforced throughout dashboard

## Functional Requirements

- FR-1: Admin dashboard requires authentication with admin or super_admin role
- FR-2: Role-based access control limits features by admin type
- FR-3: All admin actions logged to audit table with user and timestamp
- FR-4: Real-time dashboard metrics update via WebSocket or polling
- FR-5: Partner management supports CRUD operations with validation
- FR-6: Policy management includes search, filter, and export
- FR-7: Claims workflow supports assignment, review, approve/deny actions
- FR-8: Commission tier changes require approval and have effective dates
- FR-9: Payout processing integrates with payment provider
- FR-10: Reports are generated on-demand with caching for performance

## Non-Goals (Out of Scope)

- Mobile admin app (web responsive only)
- Real-time collaborative editing
- AI-powered recommendations (Phase 2)
- Custom report builder
- Admin role hierarchy beyond 4 levels
- Multi-tenancy for white-label partners

## Technical Considerations

- **Routes**: /admin/* protected by middleware role check
- **Database**: Read replicas for report queries to avoid main DB load
- **Caching**: Dashboard metrics cached with 60-second TTL
- **Audit**: All write operations logged to adminAuditLogs table
- **Export**: CSV/PDF generation via server-side streaming
- **Real-time**: WebSocket or SSE for live dashboard updates

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/admin/dashboard | GET | Dashboard metrics |
| /api/admin/partners | GET, POST | Partner list, create |
| /api/admin/partners/[id] | GET, PATCH, DELETE | Partner CRUD |
| /api/admin/policies | GET | Policy list with filters |
| /api/admin/policies/[id] | GET, PATCH | Policy detail, update |
| /api/admin/claims | GET | Claims queue |
| /api/admin/claims/[id] | GET, PATCH | Claim detail, process |
| /api/admin/commission-tiers | GET, POST, PATCH | Tier management |
| /api/admin/payouts | GET, POST | Payout list, create batch |
| /api/admin/payouts/[id] | PATCH | Process payout |
| /api/admin/reports | GET | Generate reports |
| /api/admin/settings | GET, PATCH | Platform settings |
| /api/admin/users | GET, POST, PATCH, DELETE | Admin user management |

## Success Metrics

- Admin dashboard load time < 2 seconds
- Partner lookup time < 500ms
- Claims processing SLA: 80% resolved within 48 hours
- Payout accuracy: 100% (no manual corrections needed)
- Report generation < 10 seconds for standard reports
- Admin task completion rate increased by 40%

## Open Questions

- Should we support multiple admin approval for high-value payouts?
- What is the retention policy for audit logs?
- Should claims have automatic escalation after N days?
