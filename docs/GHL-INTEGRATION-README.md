# Go High Level (GHL) Integration Guide

## For: Vas
## Project: Daily Event Insurance - Partner Onboarding Automation

---

## Overview

This document outlines the integration strategy between **Daily Event Insurance**, **DocuSign**, and **Go High Level (GHL)** to automate the partner onboarding workflow.

### System Flow

```
Partner Signs Up → DocuSign Documents → Webhook → GHL Automation → Partner Approved
       ↓                   ↓                           ↓
   App Database      3 Documents              Email Sequences
                     to Sign                  Status Updates
                                             CRM Management
```

---

## 1. Partner Onboarding Journey

### Step 1: Partner Registration
- Partner visits `https://dailyeventinsurance.com/sign-up`
- Creates account with email/password
- Redirected to `/onboarding` page
- Fills out business information form

### Step 2: Document Signing (DocuSign)
After completing the onboarding form, partner must sign 3 documents:

| Document | Purpose | Required Fields |
|----------|---------|-----------------|
| **Partner Agreement** | Legal partnership terms | Business name, signature, date |
| **W-9 Tax Form** | IRS tax identification | SSN/EIN, legal name, address |
| **Direct Deposit Authorization** | Commission payment setup | Bank account, routing number |

### Step 3: Approval & Activation
- All 3 documents must be completed
- System verifies document completion
- Partner status changes to "Active"
- Partner gains access to dashboard

---

## 2. DocuSign Integration

### Webhook Events

DocuSign will send webhooks to our application at:
```
POST https://dailyeventinsurance.com/api/webhooks/docusign
```

### Key Webhook Events to Handle

| Event | Trigger | Action |
|-------|---------|--------|
| `envelope-sent` | Documents sent to partner | Update status to "Documents Pending" |
| `envelope-delivered` | Partner opened email | Log open timestamp |
| `recipient-completed` | Partner signed a document | Update document status |
| `envelope-completed` | All documents signed | Trigger GHL workflow |
| `envelope-declined` | Partner declined to sign | Alert admin, update status |
| `envelope-voided` | Documents cancelled | Update status, notify admin |

### Webhook Payload Structure

```json
{
  "event": "envelope-completed",
  "apiVersion": "v2.1",
  "uri": "/restapi/v2.1/accounts/{accountId}/envelopes/{envelopeId}",
  "retryCount": 0,
  "configurationId": 12345,
  "generatedDateTime": "2025-01-15T10:30:00.0000000Z",
  "data": {
    "accountId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "envelopeId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "envelopeSummary": {
      "status": "completed",
      "documentsUri": "/envelopes/{envelopeId}/documents",
      "recipientsUri": "/envelopes/{envelopeId}/recipients",
      "envelopeUri": "/envelopes/{envelopeId}",
      "emailSubject": "Daily Event Insurance - Partner Agreement",
      "envelopeId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "customFields": {
        "textCustomFields": [
          {
            "name": "partnerId",
            "value": "partner_abc123"
          },
          {
            "name": "partnerEmail",
            "value": "partner@business.com"
          }
        ]
      },
      "recipients": {
        "signers": [
          {
            "email": "partner@business.com",
            "name": "John Smith",
            "status": "completed",
            "signedDateTime": "2025-01-15T10:30:00.0000000Z"
          }
        ]
      }
    }
  }
}
```

---

## 3. GHL Integration Strategy

### Contact Fields to Create in GHL

Create these custom fields in GHL Contacts:

| Field Name | Field ID | Type | Description |
|------------|----------|------|-------------|
| Partner ID | `partner_id` | Text | Unique partner identifier |
| Business Name | `business_name` | Text | Partner's company name |
| Business Type | `business_type` | Dropdown | gym, climbing, rental, wellness, etc. |
| Integration Type | `integration_type` | Dropdown | widget, api, manual |
| Partner Status | `partner_status` | Dropdown | pending, documents_sent, documents_pending, active, suspended |
| Agreement Signed | `agreement_signed` | Checkbox | Partner Agreement complete |
| W9 Signed | `w9_signed` | Checkbox | W-9 Form complete |
| Direct Deposit Signed | `dd_signed` | Checkbox | Direct Deposit Authorization complete |
| All Docs Complete | `all_docs_complete` | Checkbox | All 3 documents signed |
| DocuSign Envelope ID | `docusign_envelope_id` | Text | For tracking |
| Signup Date | `signup_date` | Date | When partner registered |
| Approval Date | `approval_date` | Date | When partner was approved |

### GHL Pipelines

Create a **Partner Onboarding Pipeline** with these stages:

```
[New Lead] → [Documents Sent] → [Documents Pending] → [Review] → [Active Partner]
                                                           ↓
                                                    [Declined/Issues]
```

| Stage | Trigger | Auto-Actions |
|-------|---------|--------------|
| New Lead | Partner completes signup | Send welcome email |
| Documents Sent | DocuSign envelope created | Start reminder sequence |
| Documents Pending | Partner opened documents | Update activity log |
| Review | All docs signed | Notify admin for review |
| Active Partner | Admin approves | Send activation email, grant dashboard access |
| Declined/Issues | Partner declines or issues | Notify admin, pause sequences |

---

## 4. GHL Workflows to Create

### Workflow 1: New Partner Welcome

**Trigger:** Contact added with tag `new-partner`

**Actions:**
1. Wait 2 minutes
2. Send Email: "Welcome to Daily Event Insurance Partner Program"
3. Add to Pipeline: "Partner Onboarding" → Stage: "New Lead"
4. Wait 1 hour
5. Send SMS: "Hi {first_name}, did you receive our partner agreement? Reply YES if you need help."

### Workflow 2: Document Reminder Sequence

**Trigger:** Contact moves to "Documents Sent" stage

**Actions:**
1. Wait 24 hours
2. Check: If `all_docs_complete` = false
   - Send Email: "Reminder: Complete Your Partner Documents"
3. Wait 48 hours
4. Check: If `all_docs_complete` = false
   - Send Email: "Your Partner Application is Almost Complete"
   - Send SMS: "Hi {first_name}, your Daily Event Insurance documents are waiting. Complete them here: {docusign_link}"
5. Wait 72 hours
6. Check: If `all_docs_complete` = false
   - Send Email: "Final Reminder - Partner Application Expiring Soon"
   - Create Task: "Follow up with partner manually"

### Workflow 3: Documents Completed

**Trigger:** Webhook updates `all_docs_complete` = true

**Actions:**
1. Move to Pipeline Stage: "Review"
2. Send Email: "Documents Received - Under Review"
3. Create Task for Admin: "Review new partner application: {business_name}"
4. Send Internal Notification: "New partner ready for review"

### Workflow 4: Partner Approved

**Trigger:** Contact moves to "Active Partner" stage

**Actions:**
1. Update Field: `partner_status` = "active"
2. Update Field: `approval_date` = current date
3. Send Email: "Congratulations! Your Partner Account is Active"
4. Send SMS: "Great news {first_name}! Your Daily Event Insurance partner account is now active. Log in: https://dailyeventinsurance.com/sign-in"
5. Add Tag: `active-partner`
6. Remove Tag: `new-partner`
7. Trigger Webhook to App: Update partner status in database

### Workflow 5: Partner Declined/Issues

**Trigger:** Contact moves to "Declined/Issues" stage

**Actions:**
1. Stop all other workflows
2. Send Email: "Regarding Your Partner Application"
3. Create Task: "Contact partner about application issues"
4. Send Internal Alert to Admin

---

## 5. Webhook Endpoints (App → GHL)

### Create/Update Contact in GHL

When a partner registers, send to GHL:

```
POST https://rest.gohighlevel.com/v1/contacts/
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "email": "partner@business.com",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+15551234567",
  "tags": ["new-partner"],
  "customField": {
    "partner_id": "partner_abc123",
    "business_name": "Smith Fitness Studio",
    "business_type": "gym",
    "integration_type": "widget",
    "partner_status": "pending",
    "signup_date": "2025-01-15"
  }
}
```

### Update Contact on Document Events

```
PUT https://rest.gohighlevel.com/v1/contacts/{contactId}
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "customField": {
    "partner_status": "documents_pending",
    "agreement_signed": true,
    "docusign_envelope_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### Trigger Workflow via Webhook

```
POST https://rest.gohighlevel.com/v1/contacts/{contactId}/workflow/{workflowId}
Authorization: Bearer {API_KEY}
```

---

## 6. Webhook Endpoints (GHL → App)

### Partner Status Update

GHL will call our app when admin approves a partner:

```
POST https://dailyeventinsurance.com/api/webhooks/ghl/partner-status

{
  "event": "partner_approved",
  "contact_id": "ghl_contact_123",
  "partner_id": "partner_abc123",
  "email": "partner@business.com",
  "status": "active",
  "approved_by": "admin@dailyeventinsurance.com",
  "approved_at": "2025-01-15T14:30:00Z"
}
```

---

## 7. Email Templates Needed

### Template 1: Welcome Email
- Subject: "Welcome to the Daily Event Insurance Partner Program!"
- Content: Introduction, what to expect, support contact

### Template 2: Documents Sent
- Subject: "Action Required: Sign Your Partner Documents"
- Content: DocuSign link, list of documents, deadline

### Template 3: Document Reminder (Day 1)
- Subject: "Reminder: Complete Your Partner Documents"
- Content: Friendly reminder, DocuSign link

### Template 4: Document Reminder (Day 3)
- Subject: "Your Partner Application is Almost Complete"
- Content: Urgency, benefits reminder, support offer

### Template 5: Final Reminder (Day 5)
- Subject: "Final Reminder - Partner Application Expiring"
- Content: Deadline warning, contact support

### Template 6: Documents Received
- Subject: "Documents Received - Under Review"
- Content: Confirmation, next steps, timeline

### Template 7: Partner Approved
- Subject: "Congratulations! Your Partner Account is Now Active"
- Content: Login link, dashboard overview, getting started guide

### Template 8: Issues with Application
- Subject: "Regarding Your Partner Application"
- Content: Issue description, next steps, support contact

---

## 8. API Keys & Credentials Needed

| Service | Credential | Where to Get |
|---------|------------|--------------|
| GHL API Key | `GHL_API_KEY` | GHL Settings → API Keys |
| GHL Location ID | `GHL_LOCATION_ID` | GHL Settings → Business Info |
| DocuSign Integration Key | `DOCUSIGN_INTEGRATION_KEY` | DocuSign Admin → API & Keys |
| DocuSign Account ID | `DOCUSIGN_ACCOUNT_ID` | DocuSign Admin |
| DocuSign Base URL | `DOCUSIGN_BASE_URL` | `https://demo.docusign.net` (test) or `https://www.docusign.net` (prod) |

---

## 9. Testing Checklist

### Phase 1: GHL Setup
- [ ] Create all custom fields
- [ ] Create Partner Onboarding pipeline
- [ ] Create all 5 workflows
- [ ] Create email templates
- [ ] Set up internal notifications

### Phase 2: Integration Testing
- [ ] Test: New partner signup → GHL contact created
- [ ] Test: DocuSign envelope sent → GHL status updated
- [ ] Test: Document signed → GHL field updated
- [ ] Test: All docs complete → Workflow triggered
- [ ] Test: Admin approval → Partner activated
- [ ] Test: App status updated from GHL webhook

### Phase 3: End-to-End Testing
- [ ] Complete full partner signup flow
- [ ] Verify all emails sent correctly
- [ ] Verify all status updates work
- [ ] Verify dashboard access granted
- [ ] Test edge cases (declined, expired, etc.)

---

## 10. Support Contacts

| Role | Contact |
|------|---------|
| Technical Lead | Julian (julian@aiacrobatics.com) |
| GHL Implementation | Vas |
| DocuSign Setup | TBD |

---

## 11. Timeline

| Phase | Tasks | Duration |
|-------|-------|----------|
| Phase 1 | GHL Setup (fields, pipelines, workflows) | 2-3 days |
| Phase 2 | Email Templates | 1-2 days |
| Phase 3 | DocuSign Templates | 1-2 days |
| Phase 4 | Webhook Integration | 2-3 days |
| Phase 5 | Testing | 2-3 days |
| **Total** | | **8-13 days** |

---

## Appendix A: Partner Status Flow

```
pending
   ↓
documents_sent (DocuSign envelope created)
   ↓
documents_pending (Partner opened/started signing)
   ↓
documents_complete (All 3 signed)
   ↓
under_review (Awaiting admin approval)
   ↓
active (Approved and activated)

Alternative flows:
- documents_sent → expired (Partner didn't sign in 7 days)
- documents_pending → declined (Partner declined to sign)
- under_review → rejected (Admin rejected application)
- active → suspended (Account suspended)
```

---

## Appendix B: Document Details

### Document 1: Partner Agreement
- **Template ID:** (to be created in DocuSign)
- **Fields to capture:**
  - Partner legal business name
  - Partner signature
  - Date signed
  - Business address
- **Auto-populated from app:**
  - Partner ID
  - Partner email
  - Business type

### Document 2: W-9 Tax Form
- **Template ID:** (to be created in DocuSign)
- **Fields to capture:**
  - Legal name
  - Business name (if different)
  - Federal tax classification
  - Address
  - TIN (SSN or EIN)
  - Signature and date

### Document 3: Direct Deposit Authorization
- **Template ID:** (to be created in DocuSign)
- **Fields to capture:**
  - Account holder name
  - Bank name
  - Routing number
  - Account number
  - Account type (checking/savings)
  - Signature and date

---

## Questions for Julian

1. Should failed/declined partners be deleted from GHL or kept for reporting?
2. What's the document expiration period? (Suggested: 7 days)
3. Who should receive internal notifications for new partner approvals?
4. Are there any additional documents needed beyond the 3 listed?
5. Should we send SMS reminders? (Requires phone number collection)

---

*Last Updated: December 27, 2025*
*Version: 1.0*
