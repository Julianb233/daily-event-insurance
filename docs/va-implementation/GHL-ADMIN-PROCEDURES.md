# GoHighLevel Admin Procedures
## Daily Event Insurance - CRM Administration Guide

**Version:** 1.0  
**Last Updated:** January 2025  
**Audience:** Team Leads, Account Managers, System Administrators

---

## Table of Contents

1. [User Management](#user-management)
2. [Permission Levels](#permission-levels)
3. [Workflow Management](#workflow-management)
4. [Pipeline Administration](#pipeline-administration)
5. [Tag & Field Management](#tag--field-management)
6. [Form Administration](#form-administration)
7. [Reporting & Dashboards](#reporting--dashboards)
8. [Troubleshooting](#troubleshooting)

---

## User Management

### Adding a New VA User

1. Navigate to **Settings → Team Management → Add User**
2. Enter user details:
   - Name: [First Last]
   - Email: [user@email.com]
   - Phone: [Optional]
3. Select **User Role**: `VA - Call Center`
4. Set permissions (see [Permission Levels](#permission-levels))
5. Click **Save & Send Invite**
6. User receives email to set password

### Deactivating a User

1. Go to **Settings → Team Management**
2. Find user and click **Edit**
3. Toggle **Active** to OFF
4. **Reassign open tasks** to another team member
5. Click **Save**

⚠️ **Note:** Deactivated users retain data history but cannot log in.

### Password Reset

1. User clicks "Forgot Password" on login
2. **OR** Admin: Settings → Team → User → **Send Password Reset**
3. Link expires in 24 hours

---

## Permission Levels

### VA - Call Center Role

| Feature | Access Level |
|---------|--------------|
| Contacts | View, Edit (assigned only) |
| Pipelines | View, Move stages |
| Phone/SMS | Full access |
| Tasks | Create, Edit, Complete |
| Calendar | View, Book |
| Workflows | View only |
| Forms | View only |
| Tags | Apply only (cannot create) |
| Reporting | Personal metrics only |
| Settings | No access |

### Team Lead Role

| Feature | Access Level |
|---------|--------------|
| Contacts | Full access |
| Pipelines | Full access |
| Phone/SMS | Full access + monitoring |
| Tasks | Full access |
| Calendar | Full access |
| Workflows | View, Enable/Disable |
| Forms | View, Edit |
| Tags | Create, Edit |
| Reporting | Team metrics |
| Settings | Limited |

### Admin Role

| Feature | Access Level |
|---------|--------------|
| All features | Full access |
| Users | Create, Edit, Deactivate |
| Billing | View only |
| API Keys | Manage |
| Integrations | Configure |

### Setting Permissions

1. **Settings → Team Management → Roles**
2. Select or create role
3. Toggle permissions per feature
4. **Save Changes**
5. Assign role to user

---

## Workflow Management

### Enabling/Disabling a Workflow

1. Navigate to **Automation → Workflows**
2. Find workflow by name
3. Toggle the **Active** switch
4. Confirm action

⚠️ **Warning:** Disabling a workflow stops ALL contacts currently in it.

### Checking Workflow Status

1. Go to **Automation → Workflows**
2. Click on workflow name
3. View **Stats** tab:
   - Active contacts in workflow
   - Completion rate
   - Error count
4. Click **History** for individual contact paths

### Manually Adding/Removing Contacts from Workflow

**Add to Workflow:**
1. Open contact profile
2. Click **Workflows** tab
3. Click **Add to Workflow**
4. Select workflow
5. Choose starting step (optional)

**Remove from Workflow:**
1. Open contact profile
2. Click **Workflows** tab
3. Find active workflow
4. Click **Remove from Workflow**
5. Confirm action

### Common Workflow Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Contact not entering | Trigger conditions not met | Check tags, pipeline stage |
| Emails not sending | Invalid email or bounced | Verify email, check bounce list |
| SMS failing | Invalid phone or opt-out | Check phone format, DND status |
| Contact stuck | Wait step or condition | Check timeline, manual advance |

---

## Pipeline Administration

### Current Pipelines

| Pipeline | Purpose | Stages |
|----------|---------|--------|
| Partner Acquisition | Lead to close | New Lead → Contacted → Demo Scheduled → Qualified → Proposal Sent → Negotiating → Won/Lost |
| Partner Onboarding | Setup process | Signed Contract → Portal Setup → Integration → Testing → Launch Ready → Active |

### Moving Contacts Between Pipelines

1. Open contact profile
2. Click **Pipeline** card
3. Select new pipeline from dropdown
4. Select stage
5. Changes auto-save

### Updating Pipeline Stages

1. **Settings → Pipelines**
2. Select pipeline
3. Click **Edit** on stage
4. Update: Name, Probability %, Color
5. **Save**

### Adding New Stage

1. **Settings → Pipelines → Select Pipeline**
2. Click **Add Stage**
3. Configure:
   - Stage Name
   - Win Probability (%)
   - Color coding
4. Drag to reorder if needed
5. **Save**

---

## Tag & Field Management

### Creating a New Tag

1. **Settings → Tags**
2. Click **Add Tag**
3. Enter tag name following convention:
   - `[Category] - [Specific]`
   - Example: `Lead - Qualified`, `Call - Left Voicemail`
4. Select color
5. **Save**

### Tag Naming Conventions

| Category | Format | Examples |
|----------|--------|----------|
| Lead Status | `Lead - [Status]` | Lead - New Inquiry, Lead - Qualified |
| Call Outcome | `Call - [Outcome]` | Call - Left Voicemail, Call - No Answer |
| Partner Status | `Partner - [Status]` | Partner - Active, Partner - Churned |
| Business Type | `Business - [Type]` | Business - Gym, Business - Climbing |

### Creating Custom Fields

1. **Settings → Custom Fields**
2. Select object type (Contact, Opportunity, etc.)
3. Click **Add Field**
4. Configure:
   - Field Name: `snake_case`
   - Display Label: "Human Readable"
   - Field Type: Text, Number, Dropdown, Date, etc.
   - Required: Yes/No
5. **Save**

### Required Custom Fields for Call Center

| Field Name | Display Label | Type | Object |
|------------|---------------|------|--------|
| `business_type` | Business Type | Dropdown | Contact |
| `business_size` | Business Size | Text | Contact |
| `preferred_contact_time` | Preferred Contact Time | Dropdown | Contact |
| `call_status` | Call Status | Dropdown | Contact |
| `next_follow_up_at` | Next Follow-Up | Date/Time | Contact |
| `do_not_call_reason` | DNC Reason | Dropdown | Contact |

---

## Form Administration

### Active Forms

| Form | Purpose | Linked Workflow |
|------|---------|-----------------|
| Partner Inquiry | Website lead capture | New Partner Inquiry |
| Request a Callback | Phone callback requests | Callback Request Handler |
| Partner Application | Detailed application | Application Review |
| Support Request | Existing partner support | Support Ticket |

### Editing a Form

1. **Sites → Forms**
2. Select form
3. Use drag-and-drop builder
4. Configure fields:
   - Field label
   - Placeholder text
   - Required status
   - Map to GHL field
5. **Save** and **Publish**

### Form Embedding

Get embed code:
1. **Sites → Forms → Select Form**
2. Click **Integrate**
3. Choose: **Embed (Inline)** or **Embed (Popup)**
4. Copy code
5. Paste in website HTML

### Form Submission Testing

1. Open form preview
2. Submit test entry
3. Verify in GHL:
   - Contact created
   - Fields populated
   - Tags applied
   - Workflow triggered

---

## Reporting & Dashboards

### Key Dashboards

| Dashboard | Purpose | Audience |
|-----------|---------|----------|
| Call Center Overview | Daily/weekly call metrics | Team Leads |
| Pipeline Performance | Lead flow and conversions | Management |
| VA Performance | Individual agent metrics | Team Leads |
| SLA Tracking | Response time monitoring | All |

### Creating a Dashboard Widget

1. **Reporting → Dashboards**
2. Select or create dashboard
3. Click **Add Widget**
4. Choose type:
   - Metric Card
   - Chart
   - Table
   - Pipeline Funnel
5. Configure data source and filters
6. **Save**

### Key Metrics to Track

| Metric | Formula | Target |
|--------|---------|--------|
| First Response Time | Avg(first_contact_at - created_at) | < 20 min |
| SLA Compliance | Contacts responded within SLA / Total | > 90% |
| Calls per VA per Day | Total calls / VA count | 30-50 |
| Demo Booking Rate | Demos scheduled / Qualified leads | > 25% |
| Pipeline Velocity | Avg days in each stage | Varies |

### Scheduled Reports

1. **Reporting → Scheduled Reports**
2. Click **Create Report**
3. Configure:
   - Report type
   - Date range
   - Recipients
   - Frequency (Daily, Weekly, Monthly)
4. **Save**

---

## Troubleshooting

### Common Issues

#### "Contact not receiving emails"

1. Check contact email validity
2. Check **Email → Bounce** list
3. Verify workflow is active
4. Check spam folder confirmation

#### "Workflow not triggering"

1. Verify trigger conditions are met
2. Check contact has required tag/stage
3. Confirm workflow is enabled
4. Review workflow error log

#### "Phone calls not working"

1. Verify phone number format (E.164)
2. Check available credits
3. Confirm caller ID configured
4. Test from different user account

#### "Tags not applying"

1. Check automation is enabled
2. Verify tag exists (case-sensitive)
3. Check contact isn't at limit
4. Review workflow logic

### Getting Help

- **GHL Support:** In-app chat or support@gohighlevel.com
- **Internal Escalation:** Contact system admin
- **Documentation:** help.gohighlevel.com

---

## Audit & Security

### Activity Log Review

1. **Settings → Audit Log**
2. Filter by:
   - User
   - Date range
   - Action type
3. Export for compliance if needed

### Regular Admin Tasks

| Task | Frequency | Responsibility |
|------|-----------|----------------|
| User access review | Monthly | Admin |
| Inactive user cleanup | Quarterly | Admin |
| Workflow performance review | Weekly | Team Lead |
| Tag cleanup | Quarterly | Team Lead |
| Dashboard accuracy check | Monthly | Admin |

---

## Emergency Procedures

### System Outage

1. Check GHL status page: status.gohighlevel.com
2. Notify team via backup channel
3. Document affected contacts/time period
4. Resume operations when restored
5. Run data integrity check

### Accidental Data Deletion

1. **Stop immediately**
2. Note what was deleted and when
3. Contact GHL support ASAP
4. Request data restoration
5. Document incident

---

*This document is maintained by the Daily Event Insurance Operations Team*
