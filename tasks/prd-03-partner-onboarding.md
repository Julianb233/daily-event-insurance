# PRD: Partner Onboarding System

## Introduction

The Partner Onboarding System enables gym owners, climbing facilities, equipment rental businesses, and adventure sports venues to sign up as insurance distribution partners. Partners complete a multi-step application process, sign required documents (Agreement, W9, Direct Deposit), and get approved to start selling embedded insurance to their members. The system integrates with GoHighLevel (GHL) for CRM/document management and provides both admin oversight and automated status tracking.

## Goals

- Enable B2B partners to apply and onboard in under 10 minutes
- Automate document collection and signing workflow
- Provide admin visibility into partner pipeline and status
- Reduce manual onboarding work by 80% through automation
- Track partner status through complete lifecycle: pending → documents_sent → under_review → active
- Integrate with GoHighLevel for CRM and document signing

## Target Users

1. **Prospective Partners**: Gym owners, fitness center managers, climbing facility operators, equipment rental businesses
2. **Admin Users**: DEI staff who review and approve partner applications
3. **System**: Automated processes for document tracking and status updates

## User Stories

### US-001: Partner Registration Form
**Description:** As a prospective partner, I want to submit my business information so that I can apply to become an insurance distribution partner.

**Acceptance Criteria:**
- [ ] Registration form captures: Business name, business type, contact name, email, phone
- [ ] Business type dropdown includes: gym, climbing, rental, adventure, other
- [ ] Form validates required fields before submission
- [ ] Email validation ensures proper format
- [ ] Phone number accepts US formats
- [ ] Success message displayed after submission
- [ ] Data saved to partners table with status "pending"
- [ ] npm run build passes

### US-002: Partner Profile Creation
**Description:** As the system, I need to create a complete partner profile on registration so that the partner can be tracked through onboarding.

**Acceptance Criteria:**
- [ ] Creates user record in users table with role="partner"
- [ ] Creates partner record linked to user
- [ ] Sets initial status to "pending"
- [ ] Sets documentsStatus to "not_sent"
- [ ] Generates default product configurations (liability, equipment, cancellation)
- [ ] Primary color defaults to #14B8A6 (teal)
- [ ] Integration type defaults to "widget"

### US-003: GHL Integration - Contact Creation
**Description:** As the system, I need to create a GHL contact for new partners so that sales/onboarding team can manage the relationship.

**Acceptance Criteria:**
- [ ] Creates contact in GoHighLevel on partner registration
- [ ] Stores ghlContactId in partner record
- [ ] Creates opportunity in partner onboarding pipeline
- [ ] Stores ghlOpportunityId in partner record
- [ ] Handles GHL API errors gracefully with retry logic

### US-004: Document Sending Workflow
**Description:** As an admin, I want to send required documents to partners so they can complete legal requirements.

**Acceptance Criteria:**
- [ ] Admin can trigger document sending from partner detail page
- [ ] System sends Partner Agreement, W9, and Direct Deposit forms
- [ ] Updates documentsStatus to "sent"
- [ ] Records documentsSentAt timestamp
- [ ] Creates partnerDocuments records for each document type
- [ ] Integrates with GHL document/e-sign service

### US-005: Document Status Tracking
**Description:** As an admin, I want to see document completion status so I know when a partner is ready for approval.

**Acceptance Criteria:**
- [ ] Dashboard shows document status for each partner
- [ ] Individual document statuses: pending, sent, viewed, signed
- [ ] Visual indicators: ❌ not signed, ⏳ pending, ✅ signed
- [ ] agreementSigned, w9Signed, directDepositSigned flags update on completion
- [ ] documentsCompletedAt timestamp set when all documents signed

### US-006: Webhook Handler for Document Events
**Description:** As the system, I need to process GHL webhooks so document statuses update automatically.

**Acceptance Criteria:**
- [ ] POST /api/webhooks/ghl endpoint receives document events
- [ ] Validates webhook signature/source
- [ ] Updates partnerDocuments status on document.viewed, document.signed events
- [ ] Updates partner flags when individual documents signed
- [ ] Updates documentsStatus to "completed" when all 3 documents signed
- [ ] Logs all webhook events to webhookEvents table for audit

### US-007: Partner Approval Workflow
**Description:** As an admin, I want to approve partners once documents are complete so they can start selling insurance.

**Acceptance Criteria:**
- [ ] Approve button enabled only when all documents signed
- [ ] Approval sets status to "active"
- [ ] Records approvedAt timestamp and approvedBy user ID
- [ ] Triggers welcome email to partner (via GHL automation)
- [ ] Partner gains access to partner dashboard

### US-008: Partner Onboarding Dashboard (Admin)
**Description:** As an admin, I want to see all partners in the pipeline so I can manage onboarding efficiently.

**Acceptance Criteria:**
- [ ] Table view of all partners with columns: Business, Status, Documents, Created, Actions
- [ ] Filter by status: All, Pending, Documents Sent, Under Review, Active, Suspended
- [ ] Search by business name or contact email
- [ ] Click row to view partner detail page
- [ ] Bulk actions: Send Documents, Send Reminder
- [ ] Pagination for large partner lists

### US-009: Partner Detail Page (Admin)
**Description:** As an admin, I want to view and manage a single partner's onboarding so I can take necessary actions.

**Acceptance Criteria:**
- [ ] Shows complete partner profile information
- [ ] Document status section with individual document states
- [ ] Action buttons: Send Documents, Approve, Suspend
- [ ] Activity log showing status changes and document events
- [ ] Notes section for admin comments
- [ ] Edit button for profile corrections

### US-010: Partner Self-Service Status Page
**Description:** As a partner, I want to see my onboarding progress so I know what steps remain.

**Acceptance Criteria:**
- [ ] Progress stepper: Applied → Documents → Review → Active
- [ ] Current step highlighted
- [ ] Document checklist with completion status
- [ ] Resend document request button if documents not received
- [ ] Contact support link for questions

## Functional Requirements

- FR-1: Partner registration form validates and saves to database with "pending" status
- FR-2: System creates linked user (role=partner) and partner records
- FR-3: GHL contact and opportunity created on registration (async, with error handling)
- FR-4: Admin can send document package (Agreement, W9, Direct Deposit) to partner
- FR-5: Webhook endpoint processes GHL document events and updates status
- FR-6: Document completion triggers status update and admin notification
- FR-7: Admin approval sets partner to "active" and grants dashboard access
- FR-8: Partner status progression: pending → documents_sent → documents_pending → under_review → active
- FR-9: All status changes logged to webhookEvents or audit table
- FR-10: Partners can only access dashboard after status = "active"

## Non-Goals (Out of Scope)

- Multi-user partner accounts (single contact per partner for v1)
- Partner self-service document upload (using GHL e-sign)
- Automated partner rejection workflow
- Partner agreement versioning
- International partners (US only for v1)

## Technical Considerations

- **Database Tables**: users, partners, partnerDocuments, webhookEvents
- **External Integration**: GoHighLevel API for contacts, opportunities, documents
- **Authentication**: NextAuth with role-based access (partner vs admin)
- **Webhooks**: Secure endpoint with signature validation
- **Email**: GHL automations for welcome emails and reminders

## Database Schema

```typescript
// Key tables involved
partners: {
  status: "pending" | "documents_sent" | "documents_pending" | "under_review" | "active" | "suspended"
  documentsStatus: "not_sent" | "sent" | "pending" | "completed"
  agreementSigned, w9Signed, directDepositSigned: boolean
  ghlContactId, ghlOpportunityId: string
}

partnerDocuments: {
  documentType: "partner_agreement" | "w9" | "direct_deposit"
  status: "pending" | "sent" | "viewed" | "signed" | "declined" | "expired"
}
```

## Success Metrics

- Partner application to active status < 72 hours (when documents signed promptly)
- 95% of partners complete onboarding without support intervention
- Admin time per partner onboarding < 5 minutes
- Zero missed document completions (webhook reliability)

## Open Questions

- Should we support partial document signing (some signed, some pending)?
- What is the timeout/expiration policy for unsigned documents?
- Should suspended partners be able to reactivate themselves?
