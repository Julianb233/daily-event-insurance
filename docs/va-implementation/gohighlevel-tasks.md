# GoHighLevel Implementation Tasks

Step-by-step tasks for VAs to implement the GHL setup.

---

## Prerequisites

Before starting, ensure you have:
- [ ] GHL admin account access
- [ ] Access to this documentation repo
- [ ] Understanding of GHL workflows, pipelines, and automations

---

## Task 1: Create Custom Fields (30 min)

**Reference:** `/docs/gohighlevel/04-setup/custom-fields.md`

### Steps:
1. Navigate to Settings → Custom Fields
2. Create the following Contact fields:

| Field Name | Field ID | Type | Options |
|------------|----------|------|---------|
| Business Type | `business_type` | Dropdown | Gym, Climbing, Rental, Adventure, Other |
| Business Size | `business_size` | Dropdown | <50, 50-100, 100-500, 500+ daily check-ins |
| Partner ID | `partner_id` | Text | - |
| Partner Tier | `partner_tier` | Dropdown | Starter, Growth, Enterprise |
| Integration Method | `integration_method` | Dropdown | Widget, API, Manual |
| Integration Status | `integration_status` | Dropdown | Not Started, In Progress, Complete, Issues |
| Lead Source | `lead_source` | Dropdown | Website, Referral, Event, Ads, Outbound |

3. Verify all fields are created
4. Test by manually entering data on a test contact

**Completion Criteria:**
- [ ] All 7 custom fields created
- [ ] Dropdown options match documentation
- [ ] Test data entry successful

---

## Task 2: Set Up Tags (15 min)

**Reference:** `/docs/gohighlevel/04-setup/custom-fields.md` (Tag Naming Convention section)

### Steps:
1. Navigate to Settings → Tags
2. Create all tags from the following categories:

**Lead Status Tags:**
- Lead - New Inquiry
- Lead - Contacted
- Lead - Qualified
- Lead - Demo Scheduled
- Lead - Demo Completed
- Lead - Proposal Sent
- Lead - Negotiating

**Partner Status Tags:**
- Partner - Signed Contract
- Partner - Onboarding
- Partner - Integration In Progress
- Partner - Integration Complete
- Partner - Active
- Partner - Revenue Active

**Business Type Tags:**
- Business Type - Gym
- Business Type - Climbing
- Business Type - Rental
- Business Type - Adventure

**Source Tags:**
- Source - Website Form
- Source - Referral
- Source - Outbound

3. Verify tags appear in the tag selector

**Completion Criteria:**
- [ ] All tags created with exact naming
- [ ] Tags visible in contact management

---

## Task 3: Create Pipelines (40 min)

### 3a. Partner Acquisition Pipeline

**Steps:**
1. Navigate to Opportunities → Pipelines
2. Create new pipeline: "Partner Acquisition"
3. Add stages:

| Stage | Order | Probability |
|-------|-------|-------------|
| New Lead | 1 | 10% |
| Contacted | 2 | 20% |
| Demo Scheduled | 3 | 40% |
| Qualified | 4 | 60% |
| Proposal Sent | 5 | 75% |
| Negotiating | 6 | 85% |
| Won | 7 | 100% |
| Lost | 8 | 0% |

### 3b. Partner Onboarding Pipeline

**Steps:**
1. Create new pipeline: "Partner Onboarding"
2. Add stages:

| Stage | Order |
|-------|-------|
| Signed Contract | 1 |
| Portal Setup | 2 |
| Integration | 3 |
| Testing | 4 |
| Launch Ready | 5 |
| Active | 6 |

**Completion Criteria:**
- [ ] Both pipelines created
- [ ] All stages added in correct order
- [ ] Pipeline settings configured

---

## Task 4: Import Email Templates (1 hour)

**Reference:** 
- `/docs/gohighlevel/02-emails/welcome-series.md`
- `/docs/gohighlevel/02-emails/onboarding-emails.md`
- `/docs/gohighlevel/02-emails/initial-outreach.md`

### Steps:
1. Navigate to Marketing → Templates → Emails
2. Create templates for each email in documentation:

**Welcome Series (5 emails):**
- DEI - Welcome - Thank You
- DEI - Demo Reminder
- DEI - Value Proposition
- DEI - Social Proof
- DEI - Final Check-In

**Onboarding Series (6 emails):**
- DEI - Onboarding - Welcome
- DEI - Onboarding - Portal Access
- DEI - Onboarding - Integration
- DEI - Onboarding - Integration Check
- DEI - Onboarding - Launch Ready
- DEI - Onboarding - First Week

**Initial Outreach (5 emails):**
- DEI - Outreach - Introduction
- DEI - Outreach - Value Proposition
- DEI - Outreach - Social Proof
- DEI - Outreach - Problem Solution
- DEI - Outreach - Final Touch

3. For each template:
   - Copy HTML content from documentation
   - Set correct subject line
   - Add personalization tokens ({{contact.first_name}}, etc.)
   - Test preview with sample data

**Completion Criteria:**
- [ ] 16 email templates created
- [ ] All templates use correct naming convention
- [ ] Personalization tokens working
- [ ] Preview looks correct

---

## Task 5: Build New Partner Inquiry Workflow (45 min)

**Reference:** `/docs/gohighlevel/01-workflows/new-partner-inquiry.md`

### Steps:
1. Navigate to Automation → Workflows
2. Create new workflow: "DEI - New Partner Inquiry"
3. Set trigger: Form Submitted (Partner Inquiry form)
4. Add steps per documentation:

```
Trigger: Form Submitted
  ↓
Step 1: Add Tag "Lead - New Inquiry"
  ↓
Step 2: Add Tag based on Business Type field
  ↓
Step 3: Add to Pipeline "Partner Acquisition" → "New Lead"
  ↓
Step 4: Send Email "DEI - Welcome - Thank You"
  ↓
Step 5: Wait 2 minutes
  ↓
Step 6: Send SMS (welcome message)
  ↓
Step 7: Create Task "Review new lead: {{contact.company_name}}"
  ↓
Step 8: Internal Notification (Slack/Email)
  ↓
Step 9: Wait 1 day
  ↓
Step 10: If/Else - Has tag "Booked Demo"?
  YES → Exit
  NO → Continue to welcome sequence
```

5. Test workflow with a test form submission

**Completion Criteria:**
- [ ] Workflow created and published
- [ ] All steps configured correctly
- [ ] Test submission triggers workflow
- [ ] Tags and pipeline updated

---

## Task 6: Build Onboarding Sequence Workflow (1 hour)

**Reference:** `/docs/gohighlevel/01-workflows/onboarding-sequence.md`

### Steps:
1. Create new workflow: "DEI - Partner Onboarding"
2. Set trigger: Tag Added "Partner - Signed Contract"
3. Add all steps per documentation (Day 0 through Day 10)
4. Include conditional logic for integration status checks
5. Test with a test contact

**Completion Criteria:**
- [ ] 10-day sequence created
- [ ] All wait steps correct
- [ ] Conditional logic working
- [ ] Test run successful

---

## Task 7: Build Initial Outreach Workflow (45 min)

**Reference:** `/docs/gohighlevel/02-emails/initial-outreach.md`

### Steps:
1. Create new workflow: "DEI - Cold Outreach"
2. Set trigger: Manual or Tag "Outreach - Add to Sequence"
3. Build 5-email sequence over 14 days
4. Include exit conditions

**Completion Criteria:**
- [ ] 5-email sequence over 14 days
- [ ] Exit conditions configured
- [ ] Tags applied at each step

---

## Task 8: Create Forms (1 hour)

**Reference:** `/docs/gohighlevel/04-setup/forms.md`

### Steps:
1. Create each form per documentation:
   - Partner Inquiry Form (website embed)
   - Partner Application Form (qualification)
   - Integration Request Form
   - Partner Feedback Form
   - Support Request Form

2. Configure form settings:
   - Field mappings to custom fields
   - Auto-tagging on submission
   - Redirect URLs
   - Success messages

3. Generate embed codes for website forms

**Completion Criteria:**
- [ ] 5 forms created
- [ ] All field mappings correct
- [ ] Tags applied on submission
- [ ] Embed codes ready

---

## Task 9: End-to-End Testing (2 hours)

### Test Scenarios:

**Scenario 1: New Lead Journey**
1. Submit Partner Inquiry form
2. Verify welcome email received
3. Verify SMS received
4. Verify tags applied
5. Verify pipeline stage updated
6. Wait for Day 1 email
7. Book a demo (verify sequence stops)

**Scenario 2: Partner Onboarding**
1. Add "Partner - Signed Contract" tag
2. Verify Day 0 email received
3. Check pipeline stage
4. Simulate Day 1, 3, 5, 7, 10 emails
5. Verify integration check logic

**Scenario 3: Cold Outreach**
1. Add test contact to outreach
2. Verify Email 1 sent
3. Check timing of subsequent emails
4. Test reply exit condition

**Completion Criteria:**
- [ ] All scenarios pass
- [ ] No broken automations
- [ ] Timing correct
- [ ] Tags/pipeline working

---

## Quality Checklist

Before marking implementation complete:

- [ ] All custom fields created and tested
- [ ] All tags created with correct naming
- [ ] Both pipelines configured
- [ ] All 16 email templates created
- [ ] All 3 main workflows built and published
- [ ] All 5 forms created
- [ ] End-to-end testing passed
- [ ] Documentation reviewed for accuracy

