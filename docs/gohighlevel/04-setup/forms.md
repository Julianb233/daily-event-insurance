# GoHighLevel Forms Setup

All forms required for the Daily Event Insurance partner acquisition and onboarding process.

---

## Form 1: Partner Inquiry Form (Website)

**Purpose**: Initial lead capture from website visitors
**Trigger**: New Partner Inquiry workflow
**Embed Location**: Website homepage, pricing page

### Form Fields

| Field | Type | Required | Maps To |
|-------|------|----------|---------|
| Your Name | Text | Yes | `contact.name` |
| Business Email | Email | Yes | `contact.email` |
| Phone Number | Phone | Yes | `contact.phone` |
| Business Name | Text | Yes | `contact.company_name` |
| Business Type | Dropdown | Yes | `contact.custom_field.business_type` |
| How did you hear about us? | Dropdown | No | `contact.custom_field.lead_source` |
| Message (Optional) | Textarea | No | `contact.custom_field.inquiry_message` |

### Dropdown Options

**Business Type:**
- Gym / Fitness Center
- Rock Climbing Facility
- Equipment Rental (Bikes, Kayaks, etc.)
- Adventure Sports (Zip Line, Trampoline, etc.)
- Other

**How did you hear about us?:**
- Google Search
- Social Media
- Referral from Partner
- Industry Event
- Other

### Form Settings

```
Form Name: DEI - Partner Inquiry
Form Type: Inline
Submit Button: "Get Started Today"
Success Message: "Thanks! We'll be in touch within 24 hours."
Redirect URL: /thank-you
Add Tags: "Lead - New Inquiry", "Source - Website Form"
Add to Pipeline: Partner Acquisition → New Lead
```

### Embed Code Example

```html
<!-- GoHighLevel Form Embed -->
<iframe 
  src="https://forms.gohighlevel.com/DEI-partner-inquiry" 
  style="width:100%; height:500px; border:none;"
  title="Partner Inquiry Form">
</iframe>
```

---

## Form 2: Partner Application Form (Qualification)

**Purpose**: Detailed information collection after initial interest
**Trigger**: Sent via email to qualified leads
**Use Case**: Gather data needed for partnership agreement

### Form Fields

| Section | Field | Type | Required |
|---------|-------|------|----------|
| **Business Info** | Legal Business Name | Text | Yes |
| | Business Address | Address | Yes |
| | Website URL | URL | No |
| | Years in Business | Dropdown | Yes |
| **Contact Info** | Primary Contact Name | Text | Yes |
| | Primary Contact Email | Email | Yes |
| | Primary Contact Phone | Phone | Yes |
| | Secondary Contact | Text | No |
| **Operations** | Average Daily Check-ins | Dropdown | Yes |
| | Current Booking Software | Text | No |
| | Number of Locations | Number | No |
| **Technical** | Preferred Integration Method | Dropdown | Yes |
| | IT Contact (if different) | Text | No |
| **Agreement** | Terms Agreement | Checkbox | Yes |

### Dropdown Options

**Years in Business:**
- Less than 1 year
- 1-3 years
- 3-5 years
- 5-10 years
- 10+ years

**Average Daily Check-ins:**
- Less than 50
- 50-100
- 100-200
- 200-500
- 500+

**Preferred Integration Method:**
- Widget (Easiest - Copy/Paste)
- API Integration (Developer Required)
- Done-For-You (We Handle It)

### Form Settings

```
Form Name: DEI - Partner Application
Form Type: Multi-Step (3 pages)
Submit Button: "Submit Application"
Success Message: "Application received! Your dedicated success manager will contact you within 48 hours."
Add Tags: "Lead - Application Submitted"
Update Pipeline: Partner Acquisition → Qualified
Create Task: "Review Partner Application - {{contact.company_name}}"
```

---

## Form 3: Integration Request Form

**Purpose**: Collect technical details for integration setup
**Trigger**: Sent after contract signing
**Use Case**: Gather info needed by tech team

### Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Partner ID | Text (Auto-filled) | Yes | Pre-populated |
| Business Name | Text (Auto-filled) | Yes | Pre-populated |
| Integration Method | Dropdown | Yes | Widget/API/Done-For-You |
| Current Booking/POS System | Text | Yes | e.g., Mindbody, Pike13, custom |
| Website URL | URL | Yes | Where widget will be embedded |
| Technical Contact Name | Text | Yes | |
| Technical Contact Email | Email | Yes | |
| Preferred Integration Date | Date | No | |
| Special Requirements | Textarea | No | Custom needs |

### Dropdown Options

**Integration Method:**
- Widget (I'll embed the code myself)
- API (My developer will integrate)
- Done-For-You (Please schedule a call)

### Form Settings

```
Form Name: DEI - Integration Request
Form Type: Single Page
Submit Button: "Submit Integration Request"
Success Message: "Request received! Our tech team will send your credentials within 24 hours."
Add Tags: "Integration - Request Submitted"
Update Field: integration_status = "In Progress"
Create Task: "Process Integration Request - {{contact.company_name}}"
Notify Team: tech@dailyeventinsurance.com
```

---

## Form 4: Partner Feedback Form

**Purpose**: Collect NPS and feedback from active partners
**Trigger**: Sent at 30, 90, 180 days post-launch
**Use Case**: Quality improvement and testimonials

### Form Fields

| Field | Type | Required |
|-------|------|----------|
| How likely are you to recommend DEI to other business owners? (0-10) | Rating | Yes |
| What do you like most about partnering with us? | Textarea | No |
| What could we improve? | Textarea | No |
| Would you be willing to provide a testimonial? | Dropdown | No |
| Any other feedback? | Textarea | No |

### Rating Field

```
Type: NPS (0-10 scale)
Labels: 
  0-6: Detractor
  7-8: Passive
  9-10: Promoter
```

### Dropdown Options

**Testimonial Willingness:**
- Yes, I'd be happy to!
- Maybe, contact me to discuss
- Not at this time

### Form Settings

```
Form Name: DEI - Partner Feedback
Form Type: Single Page
Submit Button: "Submit Feedback"
Success Message: "Thank you for your feedback! It helps us serve you better."
Add Tags: 
  - If NPS 9-10: "Feedback - Promoter"
  - If NPS 7-8: "Feedback - Passive"
  - If NPS 0-6: "Feedback - Detractor"
Create Task (if Detractor): "Urgent: Follow up with {{contact.company_name}} - Low NPS Score"
```

---

## Form 5: Support Request Form

**Purpose**: Partner support ticket creation
**Trigger**: Available in partner portal
**Use Case**: Technical issues, billing questions, general support

### Form Fields

| Field | Type | Required |
|-------|------|----------|
| Partner ID | Text (Auto-filled) | Yes |
| Business Name | Text (Auto-filled) | Yes |
| Contact Name | Text | Yes |
| Contact Email | Email | Yes |
| Request Type | Dropdown | Yes |
| Priority | Dropdown | Yes |
| Subject | Text | Yes |
| Description | Textarea | Yes |
| Attachments | File Upload | No |

### Dropdown Options

**Request Type:**
- Technical Issue
- Billing Question
- Integration Help
- Feature Request
- General Question
- Other

**Priority:**
- Low (General inquiry)
- Medium (Needs attention this week)
- High (Affecting operations)
- Urgent (System down)

### Form Settings

```
Form Name: DEI - Support Request
Form Type: Single Page
Submit Button: "Submit Request"
Success Message: "Support ticket created! We'll respond within 24 hours (4 hours for urgent issues)."
Add Tags: "Support - Open Ticket"
Create Task: "Support: {{subject}} - {{contact.company_name}}"
Notify Team: support@dailyeventinsurance.com
Priority Routing:
  - Urgent → Immediate Slack notification
  - High → Email + task assignment
  - Medium/Low → Standard queue
```

---

## Form Design Guidelines

### Branding

```css
/* Form Styling */
--form-primary: #0D9488;
--form-primary-hover: #0F766E;
--form-background: #FFFFFF;
--form-border: #E2E8F0;
--form-text: #1E293B;
--form-placeholder: #94A3B8;
--form-error: #EF4444;
--form-success: #10B981;
```

### Best Practices

1. **Keep it short** - Only ask for essential information
2. **Use smart defaults** - Pre-fill when possible
3. **Mobile-first** - All forms must work on mobile
4. **Clear labels** - Use descriptive, action-oriented labels
5. **Progress indicators** - For multi-step forms
6. **Error handling** - Inline validation with clear messages

---

## Form-to-Workflow Mapping

| Form | Triggers Workflow | Pipeline Action |
|------|------------------|-----------------|
| Partner Inquiry | New Partner Inquiry | → New Lead |
| Partner Application | Qualification Review | → Qualified |
| Integration Request | Integration Setup | → Integration |
| Partner Feedback | Feedback Response | (no change) |
| Support Request | Support Ticket | (no change) |

---

## Testing Checklist

Before going live, verify each form:

- [ ] All required fields validate correctly
- [ ] Dropdown options are complete and logical
- [ ] Success messages display properly
- [ ] Tags are applied correctly
- [ ] Pipeline stages update
- [ ] Tasks are created with correct assignees
- [ ] Email notifications trigger
- [ ] Form data maps to correct custom fields
- [ ] Mobile responsive design works
- [ ] Form analytics/tracking is enabled

