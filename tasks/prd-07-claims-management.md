# PRD: Claims Management System

## Introduction

The Claims Management System handles the complete lifecycle of insurance claims from filing to resolution. Customers can file claims through a self-service portal, submit supporting evidence, and track claim status. Claims adjusters review submissions, request additional information, and process approvals or denials. The system integrates with the policy database and payment processing for seamless claim payouts.

## Goals

- Enable customers to file claims in under 5 minutes
- Automate 40% of simple claims with rules-based approval
- Reduce claim resolution time from 14 days to 5 days average
- Maintain complete audit trail for compliance
- Integrate video evidence from LiveKit consultations
- Provide transparency with real-time status updates

## Target Users

1. **Customers**: Policyholders filing and tracking claims
2. **Claims Adjusters**: Staff reviewing and processing claims
3. **Partners**: Viewing claims from their referred customers
4. **System**: Automated rules engine for simple claims

## User Stories

### US-001: File New Claim
**Description:** As a customer, I want to file a claim so I can get reimbursed for my covered loss.

**Acceptance Criteria:**
- [ ] /claims/new opens claim filing form
- [ ] Step 1: Select policy from active policies list
- [ ] Step 2: Incident details - date, time, location, description
- [ ] Step 3: Claim type - injury, property damage, cancellation
- [ ] Step 4: Amount requested with itemized breakdown
- [ ] Step 5: Evidence upload - photos, receipts, documents
- [ ] Step 6: Review and submit
- [ ] Confirmation with claim number: CLM-YYYYMMDD-XXXXX
- [ ] Email confirmation sent to customer
- [ ] npm run build passes

### US-002: Evidence Upload
**Description:** As a customer, I want to upload evidence so my claim can be processed accurately.

**Acceptance Criteria:**
- [ ] Supports: images (JPG, PNG, HEIC), PDFs, videos (MP4, MOV)
- [ ] Drag-and-drop upload interface
- [ ] Maximum file size: 50MB per file, 200MB total
- [ ] Preview uploaded files before submission
- [ ] Remove files before final submission
- [ ] Auto-compress large images
- [ ] Progress indicator for uploads
- [ ] Secure storage with encryption at rest

### US-003: Video Evidence Recording
**Description:** As a customer, I want to record video evidence so I can show the damage or incident.

**Acceptance Criteria:**
- [ ] "Record Video" button opens camera interface
- [ ] Maximum recording length: 3 minutes
- [ ] Preview before attaching to claim
- [ ] Re-record option if not satisfied
- [ ] Works on mobile and desktop
- [ ] Integrates with LiveKit for quality recording
- [ ] Automatic upload to secure storage

### US-004: Claim Status Tracking
**Description:** As a customer, I want to track my claim status so I know what's happening.

**Acceptance Criteria:**
- [ ] /claims/[id] shows claim detail and status
- [ ] Status timeline: Filed → Under Review → Additional Info → Approved/Denied
- [ ] Current status highlighted with timestamp
- [ ] Estimated resolution date
- [ ] Assigned adjuster name (if applicable)
- [ ] Communication history
- [ ] Next steps explanation

### US-005: Customer Claim List
**Description:** As a customer, I want to see all my claims so I can manage them in one place.

**Acceptance Criteria:**
- [ ] /claims displays customer's claim list
- [ ] Columns: Claim #, Policy #, Type, Amount, Status, Filed Date
- [ ] Filter by: status (open, closed), date range
- [ ] Sort by date filed or status
- [ ] Click row to view claim detail
- [ ] "File New Claim" button prominent
- [ ] Mobile responsive

### US-006: Respond to Information Request
**Description:** As a customer, I want to provide additional information so my claim can proceed.

**Acceptance Criteria:**
- [ ] Email notification when info requested
- [ ] Link to claim page with info request details
- [ ] Clear description of what's needed
- [ ] Text response field for explanations
- [ ] Additional file upload if needed
- [ ] Submit button updates claim status
- [ ] Confirmation message and email

### US-007: Claims Queue for Adjusters
**Description:** As a claims adjuster, I want to see my assigned claims so I can work through them efficiently.

**Acceptance Criteria:**
- [ ] /admin/claims displays claims queue
- [ ] Tabs: My Claims, Unassigned, All Claims
- [ ] Priority indicators: High (>$1000), Medium, Low
- [ ] SLA countdown: time until response due
- [ ] Filter by: status, type, amount range, date
- [ ] Bulk assignment for unassigned claims
- [ ] Quick view hover with summary

### US-008: Claim Detail Review
**Description:** As a claims adjuster, I want to review complete claim details so I can make informed decisions.

**Acceptance Criteria:**
- [ ] /admin/claims/[id] shows full claim information
- [ ] Customer info with contact details
- [ ] Policy details: coverage, limits, effective dates
- [ ] Incident description and claimed amount
- [ ] All uploaded evidence with viewer/player
- [ ] Video consultation recordings if any
- [ ] Previous claims from same customer (fraud check)
- [ ] Partner info for context

### US-009: Evidence Review Tools
**Description:** As a claims adjuster, I want to examine evidence thoroughly so I can assess claims accurately.

**Acceptance Criteria:**
- [ ] Image viewer with zoom and pan
- [ ] Video player with playback controls
- [ ] PDF viewer with page navigation
- [ ] Download original files option
- [ ] Evidence metadata: upload date, file info
- [ ] Flag suspicious evidence for review
- [ ] Compare multiple images side-by-side
- [ ] Extract text from receipts (OCR)

### US-010: Request Additional Information
**Description:** As a claims adjuster, I want to request more information so I can complete my review.

**Acceptance Criteria:**
- [ ] "Request Info" button opens dialog
- [ ] Dropdown: common request types (receipts, photos, statement)
- [ ] Free-text field for specific requests
- [ ] Set response deadline
- [ ] Updates claim status to "additional_info_required"
- [ ] Triggers email to customer
- [ ] Logs request in claim history

### US-011: Approve Claim
**Description:** As a claims adjuster, I want to approve a claim so the customer receives payment.

**Acceptance Criteria:**
- [ ] "Approve" button opens approval dialog
- [ ] Enter approved amount (may differ from requested)
- [ ] Approval reason/notes required
- [ ] Payment method selection: original card, check, bank transfer
- [ ] Preview customer notification
- [ ] Submit triggers payment processing
- [ ] Updates status to "approved"
- [ ] Emails customer with approval details

### US-012: Deny Claim
**Description:** As a claims adjuster, I want to deny a claim so invalid claims are properly closed.

**Acceptance Criteria:**
- [ ] "Deny" button opens denial dialog
- [ ] Denial reason required: not covered, insufficient evidence, fraud, policy lapsed
- [ ] Free-text explanation for customer
- [ ] Preview denial letter
- [ ] Submit updates status to "denied"
- [ ] Emails customer with denial and appeal instructions
- [ ] Logs denial in claim history

### US-013: Claim Appeal Process
**Description:** As a customer, I want to appeal a denied claim so my case gets reconsidered.

**Acceptance Criteria:**
- [ ] "Appeal" button on denied claim page
- [ ] Appeal reason text field
- [ ] Upload additional evidence
- [ ] Submit creates appeal record
- [ ] Updates status to "appeal_pending"
- [ ] Email confirmation with timeline
- [ ] Senior adjuster assigned for review

### US-014: Auto-Approval Rules Engine
**Description:** As the system, I need to auto-approve simple claims so processing is instant.

**Acceptance Criteria:**
- [ ] Rules applied on claim submission
- [ ] Auto-approve if: amount < $100, valid policy, first claim, clear evidence
- [ ] Rules configurable by admin
- [ ] Logs auto-approval with rule triggered
- [ ] Customer notified immediately
- [ ] Payment queued automatically
- [ ] Flagged for spot-check audit

### US-015: Fraud Detection Flags
**Description:** As the system, I need to flag potential fraud so adjusters can investigate.

**Acceptance Criteria:**
- [ ] Check: multiple claims same customer in 30 days
- [ ] Check: claim amount near policy max
- [ ] Check: claim filed within 48 hours of policy purchase
- [ ] Check: duplicate evidence (image hash matching)
- [ ] Check: inconsistent metadata (photo date vs incident date)
- [ ] Fraud score calculated 0-100
- [ ] High score (>70) routes to senior adjuster
- [ ] Fraud flags visible in claim detail

### US-016: Payment Processing for Claims
**Description:** As the system, I need to process claim payments so customers receive funds.

**Acceptance Criteria:**
- [ ] Triggers on claim approval
- [ ] Payment methods: refund to original card, bank transfer
- [ ] Creates payment record linked to claim
- [ ] Integrates with Stripe for refunds
- [ ] Processes bank transfers via ACH
- [ ] Updates claim status to "paid"
- [ ] Sends receipt to customer
- [ ] Handles failed payments with retry

### US-017: Claims Reporting
**Description:** As an admin, I want to see claims analytics so I can monitor loss ratios.

**Acceptance Criteria:**
- [ ] Claims report page in admin dashboard
- [ ] Metrics: total claims, approval rate, average payout, loss ratio
- [ ] Filter by: date range, claim type, coverage type
- [ ] Chart: claims volume over time
- [ ] Chart: approval vs denial ratio
- [ ] Chart: average resolution time
- [ ] Top claim reasons breakdown
- [ ] Export to CSV

## Functional Requirements

- FR-1: Claim filing captures policy, incident, amount, and evidence
- FR-2: Evidence uploaded to secure storage with size/type validation
- FR-3: Video recording integrates with LiveKit infrastructure
- FR-4: Customer portal shows claim status with timeline
- FR-5: Adjusters access claims queue with priority and SLA
- FR-6: Claim review includes all evidence and policy context
- FR-7: Approve/deny actions trigger email and payment processing
- FR-8: Appeal process routes to senior adjusters
- FR-9: Auto-approval rules process simple claims instantly
- FR-10: Fraud detection flags suspicious claims for review
- FR-11: Payment processing integrates with Stripe/ACH
- FR-12: All actions logged for audit compliance

## Non-Goals (Out of Scope)

- Subrogation processing (recovering from third parties)
- Litigation management
- External claims adjusters/vendors
- Physical mail correspondence
- Multi-policy claims (single policy per claim)
- International claims (US only)

## Technical Considerations

- **Storage**: S3 or similar for evidence files with encryption
- **Video**: LiveKit integration for recording
- **OCR**: Receipt text extraction for amount validation
- **Fraud**: ML model for fraud scoring (Phase 2)
- **Payments**: Stripe for card refunds, Plaid for ACH
- **Compliance**: 7-year retention for all claim records
- **Search**: Full-text search on claim descriptions

## Database Schema

```sql
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_number TEXT UNIQUE NOT NULL, -- CLM-YYYYMMDD-XXXXX
  policy_id UUID REFERENCES policies(id) NOT NULL,
  customer_id UUID REFERENCES users(id) NOT NULL,
  claim_type TEXT NOT NULL, -- injury, property, cancellation
  incident_date TIMESTAMP NOT NULL,
  incident_location TEXT,
  description TEXT NOT NULL,
  amount_requested DECIMAL(10,2) NOT NULL,
  amount_approved DECIMAL(10,2),
  status TEXT DEFAULT 'pending', -- pending, under_review, additional_info_required, approved, denied, appeal_pending, paid
  assigned_to UUID REFERENCES users(id),
  fraud_score INTEGER,
  fraud_flags JSONB,
  auto_approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  denial_reason TEXT,
  denial_explanation TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claim_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) NOT NULL,
  file_type TEXT NOT NULL, -- image, video, document
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_url TEXT NOT NULL,
  thumbnail_url TEXT,
  metadata JSONB, -- exif data, duration, etc.
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claim_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) NOT NULL,
  direction TEXT NOT NULL, -- inbound, outbound
  type TEXT NOT NULL, -- info_request, response, notification
  subject TEXT,
  content TEXT NOT NULL,
  sent_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/claims | GET, POST | List customer claims, file new |
| /api/claims/[id] | GET, PATCH | Claim detail, update |
| /api/claims/[id]/evidence | POST | Upload evidence |
| /api/claims/[id]/respond | POST | Customer response |
| /api/claims/[id]/appeal | POST | File appeal |
| /api/admin/claims | GET | Adjuster claims queue |
| /api/admin/claims/[id] | GET, PATCH | Review, process claim |
| /api/admin/claims/[id]/approve | POST | Approve claim |
| /api/admin/claims/[id]/deny | POST | Deny claim |
| /api/admin/claims/[id]/request-info | POST | Request more info |
| /api/admin/claims/reports | GET | Claims analytics |

## Success Metrics

- Claim filing completion rate > 85%
- Average resolution time < 5 days
- Auto-approval rate for eligible claims > 60%
- Customer satisfaction (claim) > 4.2/5
- Fraud detection accuracy > 90%
- Payment success rate > 99%

## Open Questions

- What is the appeal SLA and who reviews appeals?
- Should we offer expedited claim review for premium partners?
- How do we handle claims that exceed policy limits?
