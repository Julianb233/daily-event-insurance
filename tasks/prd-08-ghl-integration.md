# PRD: GoHighLevel (GHL) CRM Integration

## Introduction

The GoHighLevel Integration connects Daily Event Insurance with GHL for comprehensive CRM, automation, and communication management. This integration handles partner contact management, opportunity tracking through sales pipelines, document e-signing, automated email sequences, and webhook event processing. GHL serves as the central hub for sales and partner relationship management.

## Goals

- Sync all partner data bidirectionally between app and GHL
- Automate partner onboarding communications via GHL workflows
- Track partner opportunities through sales pipeline stages
- Enable e-signature document collection via GHL
- Process GHL webhooks for real-time data sync
- Reduce manual data entry by 90% through automation

## Target Users

1. **Sales Team**: Managing partner opportunities in GHL
2. **Onboarding Team**: Sending documents and tracking completion
3. **Marketing Team**: Running email campaigns to partners
4. **System**: Automated data sync and webhook processing

## User Stories

### US-001: Create GHL Contact on Partner Registration
**Description:** As the system, I need to create a GHL contact when a partner registers so sales can track the relationship.

**Acceptance Criteria:**
- [ ] Triggers on successful partner registration
- [ ] POST to GHL Contacts API
- [ ] Maps fields: firstName, lastName, email, phone, companyName
- [ ] Adds custom fields: businessType, integrationType, partnerStatus
- [ ] Tags contact with "Partner", "Pending Onboarding"
- [ ] Stores ghlContactId in partners table
- [ ] Handles API errors with retry (3 attempts, exponential backoff)
- [ ] npm run build passes

### US-002: Create GHL Opportunity
**Description:** As the system, I need to create an opportunity when a partner registers so sales can track the deal.

**Acceptance Criteria:**
- [ ] Creates opportunity linked to contact
- [ ] Pipeline: "Partner Onboarding"
- [ ] Stage: "New Application"
- [ ] Opportunity name: "{Business Name} - Partner Application"
- [ ] Custom fields: expectedMRR, businessType, facility count
- [ ] Stores ghlOpportunityId in partners table
- [ ] Triggers GHL workflow for initial outreach

### US-003: Update Opportunity Stage on Status Change
**Description:** As the system, I need to update GHL opportunity stage when partner status changes so pipeline is accurate.

**Acceptance Criteria:**
- [ ] Status mapping:
  - pending → "New Application"
  - documents_sent → "Documents Sent"
  - documents_pending → "Awaiting Signatures"
  - under_review → "Under Review"
  - active → "Won - Active Partner"
  - suspended → "Lost - Suspended"
- [ ] Triggers on partner status update in app
- [ ] PATCH to GHL Opportunities API
- [ ] Logs stage changes for audit

### US-004: Document E-Sign via GHL
**Description:** As the system, I need to send documents via GHL for e-signature so partners can sign digitally.

**Acceptance Criteria:**
- [ ] Triggers when admin clicks "Send Documents"
- [ ] Documents: Partner Agreement, W9, Direct Deposit Form
- [ ] Creates document package in GHL
- [ ] Assigns to partner contact
- [ ] Sets signing order if multiple signers
- [ ] Emails partner with signing link
- [ ] Stores document IDs in partnerDocuments table
- [ ] Updates documentsStatus to "sent"

### US-005: Webhook Handler for Document Events
**Description:** As the system, I need to receive GHL webhooks for document status updates.

**Acceptance Criteria:**
- [ ] POST /api/webhooks/ghl handles events
- [ ] Validates webhook source (IP whitelist or signature)
- [ ] Event types: document.sent, document.viewed, document.signed
- [ ] Updates partnerDocuments status on event
- [ ] Updates partner flags: agreementSigned, w9Signed, directDepositSigned
- [ ] When all signed: documentsStatus → "completed"
- [ ] Logs all events to webhookEvents table

### US-006: Webhook Handler for Contact Updates
**Description:** As the system, I need to sync contact changes from GHL so app data is current.

**Acceptance Criteria:**
- [ ] Receives contact.update webhook
- [ ] Maps GHL fields back to partner record
- [ ] Updates: email, phone, business name (if changed)
- [ ] Ignores fields managed only in app
- [ ] Handles contact merge events
- [ ] Logs sync events

### US-007: Automated Onboarding Email Sequence
**Description:** As the system, I need to trigger GHL email workflows so partners receive timely communications.

**Acceptance Criteria:**
- [ ] Workflow triggers:
  - Partner registered → "Welcome Sequence"
  - Documents sent → "Document Reminder" (if not signed in 2 days)
  - Partner approved → "Getting Started Sequence"
- [ ] Passes partner data to workflow for personalization
- [ ] Stops previous workflow when next stage reached
- [ ] Tracks email opens/clicks in GHL

### US-008: GHL Pipeline Configuration
**Description:** As an admin, I need GHL pipelines configured so partner tracking is organized.

**Acceptance Criteria:**
- [ ] Pipeline: "Partner Onboarding"
  - Stages: New Application, Documents Sent, Awaiting Signatures, Under Review, Won - Active Partner, Lost - Suspended, Lost - Declined
- [ ] Pipeline: "Partner Success"
  - Stages: Onboarding, First Policy, Growing, High Volume, At Risk, Churned
- [ ] Custom fields configured for both pipelines
- [ ] Automation rules for stage transitions

### US-009: Sync Partner Metrics to GHL
**Description:** As the system, I need to sync partner performance data to GHL so sales has visibility.

**Acceptance Criteria:**
- [ ] Nightly sync job updates GHL contacts
- [ ] Custom fields: totalPoliciesSold, totalRevenue, commissionTier
- [ ] Custom fields: lastPolicyDate, averageMonthlyPolicies
- [ ] Triggers based on thresholds (e.g., "at risk" if no policies in 30 days)
- [ ] Updates opportunity value based on actual revenue
- [ ] Logs sync results

### US-010: GHL Task Creation for Follow-ups
**Description:** As the system, I need to create GHL tasks so sales doesn't miss follow-ups.

**Acceptance Criteria:**
- [ ] Creates task when: partner hasn't signed docs in 3 days
- [ ] Creates task when: partner first policy (congratulations call)
- [ ] Creates task when: partner at risk (no activity 30 days)
- [ ] Assigns to appropriate team member
- [ ] Sets due date based on urgency
- [ ] Task links to contact and opportunity

### US-011: GHL Notes Sync
**Description:** As the system, I need to add notes to GHL contacts for important events.

**Acceptance Criteria:**
- [ ] Adds note on: partner approved
- [ ] Adds note on: first policy sold
- [ ] Adds note on: commission tier change
- [ ] Adds note on: support ticket created
- [ ] Notes include relevant details and timestamps
- [ ] Visible in GHL contact timeline

### US-012: Webhook Security
**Description:** As the system, I need to validate webhooks so only legitimate events are processed.

**Acceptance Criteria:**
- [ ] Validates request signature using GHL_WEBHOOK_SECRET
- [ ] Checks IP whitelist for GHL servers
- [ ] Rejects invalid requests with 401
- [ ] Rate limits endpoint (100 req/minute)
- [ ] Logs rejected requests for monitoring
- [ ] Returns 200 within 5 seconds to avoid retries

### US-013: GHL API Error Handling
**Description:** As the system, I need to handle GHL API errors gracefully so sync doesn't break.

**Acceptance Criteria:**
- [ ] Retry failed requests with exponential backoff
- [ ] Max 3 retry attempts
- [ ] Queue failed syncs for manual review
- [ ] Alert on repeated failures (>5 in 1 hour)
- [ ] Graceful degradation: app works without GHL
- [ ] Store pending syncs for retry when GHL is back

### US-014: GHL Admin Configuration
**Description:** As an admin, I want to configure GHL settings so integration works correctly.

**Acceptance Criteria:**
- [ ] /admin/settings/ghl configuration page
- [ ] Fields: Location ID, API Key, Pipeline IDs
- [ ] Webhook URL display with copy button
- [ ] Test connection button
- [ ] Field mapping configuration
- [ ] Enable/disable specific sync features
- [ ] View sync logs and errors

## Functional Requirements

- FR-1: Partner registration creates GHL contact and opportunity
- FR-2: Partner status changes update GHL opportunity stage
- FR-3: Document sending triggers GHL e-sign workflow
- FR-4: Webhook endpoint processes document and contact events
- FR-5: Email sequences triggered at key onboarding milestones
- FR-6: Partner metrics synced nightly to GHL custom fields
- FR-7: Tasks created for sales follow-ups
- FR-8: Notes added to contacts for significant events
- FR-9: Webhook validation ensures security
- FR-10: Error handling with retry and alerting

## Non-Goals (Out of Scope)

- Two-way calendar sync
- GHL phone/SMS integration
- GHL social media integration
- Custom GHL forms (using app forms)
- GHL payment processing (using Stripe)
- GHL membership/course features

## Technical Considerations

### Environment Variables
```bash
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_location_id
GHL_WEBHOOK_SECRET=your_webhook_secret
GHL_PIPELINE_ONBOARDING_ID=pipeline_id
GHL_PIPELINE_SUCCESS_ID=pipeline_id
```

### API Integration
```typescript
// lib/integrations/ghl/client.ts
class GHLClient {
  createContact(data: ContactData): Promise<GHLContact>
  updateContact(id: string, data: Partial<ContactData>): Promise<GHLContact>
  createOpportunity(data: OpportunityData): Promise<GHLOpportunity>
  updateOpportunityStage(id: string, stageId: string): Promise<void>
  sendDocuments(contactId: string, documents: Document[]): Promise<void>
  createTask(data: TaskData): Promise<GHLTask>
  addNote(contactId: string, note: string): Promise<void>
}
```

### Webhook Event Types
```typescript
type GHLWebhookEvent = 
  | 'contact.create'
  | 'contact.update'
  | 'contact.delete'
  | 'opportunity.update'
  | 'document.sent'
  | 'document.viewed'
  | 'document.signed'
  | 'document.declined'
  | 'task.completed'
```

### Database Schema
```sql
CREATE TABLE ghl_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id),
  sync_type TEXT NOT NULL, -- contact, opportunity, document, metrics
  direction TEXT NOT NULL, -- outbound, inbound
  ghl_resource_id TEXT,
  status TEXT NOT NULL, -- success, failed, pending
  request_data JSONB,
  response_data JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/webhooks/ghl | POST | Receive GHL webhooks |
| /api/admin/ghl/sync/contacts | POST | Trigger contact sync |
| /api/admin/ghl/sync/metrics | POST | Trigger metrics sync |
| /api/admin/ghl/test | GET | Test GHL connection |
| /api/admin/ghl/logs | GET | View sync logs |
| /api/admin/settings/ghl | GET, PATCH | GHL configuration |

## Success Metrics

- Contact sync success rate > 99%
- Webhook processing time < 2 seconds
- Document signing completion rate > 85%
- Zero duplicate contacts created
- Nightly metrics sync completes in < 5 minutes
- Partner pipeline accuracy > 95%

## Open Questions

- Should we sync customer contacts to GHL or only partners?
- What is the document expiration policy if not signed?
- Should we support multiple GHL locations (multi-tenant)?
