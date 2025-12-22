# Custom Fields Setup

All custom fields required for Daily Event Insurance GHL implementation.

---

## Contact Custom Fields

### Business Information
| Field Name | Field ID | Type | Options | Required |
|------------|----------|------|---------|----------|
| Business Type | `business_type` | Dropdown | Gym, Climbing, Rental, Adventure, Other | Yes |
| Business Size | `business_size` | Dropdown | <50, 50-100, 100-500, 500+ daily check-ins | No |
| Current Software | `current_software` | Text | - | No |
| Estimated Monthly Revenue | `estimated_revenue` | Dropdown | $0-1K, $1-5K, $5-10K, $10K+ | No |

### Partner Status
| Field Name | Field ID | Type | Options | Required |
|------------|----------|------|---------|----------|
| Partner ID | `partner_id` | Text | Auto-generated | Auto |
| Partner Tier | `partner_tier` | Dropdown | Starter, Growth, Enterprise | No |
| Contract Signed Date | `contract_signed_date` | Date | - | No |
| Go Live Date | `go_live_date` | Date | - | No |

### Integration Status
| Field Name | Field ID | Type | Options | Required |
|------------|----------|------|---------|----------|
| Integration Method | `integration_method` | Dropdown | Widget, API, Manual | No |
| Integration Status | `integration_status` | Dropdown | Not Started, In Progress, Complete, Issues | No |
| Integration Date | `integration_date` | Date | - | No |

### Performance Metrics (Updated via API)
| Field Name | Field ID | Type | Description |
|------------|----------|------|-------------|
| Total Policies Sold | `total_policies` | Number | Lifetime policies |
| This Month Policies | `month_policies` | Number | Current month |
| Total Commission Earned | `total_commission` | Currency | Lifetime earnings |
| Last Sale Date | `last_sale_date` | Date | Most recent policy |

### Source Tracking
| Field Name | Field ID | Type | Options |
|------------|----------|------|---------|
| Lead Source | `lead_source` | Dropdown | Website, Referral, Event, Ads, Outbound |
| Referral Partner | `referral_partner` | Text | Referring partner name |
| UTM Campaign | `utm_campaign` | Text | Marketing campaign |
| UTM Source | `utm_source` | Text | Traffic source |

---

## Opportunity Custom Fields

### Deal Information
| Field Name | Field ID | Type | Options |
|------------|----------|------|---------|
| Expected Start Date | `expected_start` | Date | - |
| Estimated Monthly Volume | `est_monthly_volume` | Number | Policies/month |
| Estimated Monthly Commission | `est_monthly_commission` | Currency | - |
| Decision Makers | `decision_makers` | Text | Names and roles |

---

## Tag Naming Convention

### Lead Status Tags
```
Lead - New Inquiry
Lead - Contacted
Lead - Qualified
Lead - Demo Scheduled
Lead - Demo Completed
Lead - Proposal Sent
Lead - Negotiating
Lead - Lost (Reason)
```

### Partner Status Tags
```
Partner - Signed Contract
Partner - Onboarding
Partner - Integration In Progress
Partner - Integration Complete
Partner - Launch Ready
Partner - Active
Partner - Revenue Active
Partner - Churned
```

### Business Type Tags
```
Business Type - Gym
Business Type - Climbing
Business Type - Rental
Business Type - Adventure
Business Type - Other
```

### Source Tags
```
Source - Website Form
Source - Referral
Source - Event
Source - Paid Ads
Source - Outbound
Source - Partner Referral
```

### Engagement Tags
```
Booked Demo
Attended Demo
No Show - Demo
Watched Training Video
Opened Pricing Email
Clicked Integration Guide
```

---

## Field Mapping from Website Form

| Website Form Field | GHL Field |
|-------------------|-----------|
| Your Name | `contact.name` |
| Email Address | `contact.email` |
| Phone | `contact.phone` |
| Business Name | `contact.company_name` |
| Business Type | `contact.custom_field.business_type` |
| Message | `contact.custom_field.inquiry_message` |

---

## Automation Rules

### Auto-Update Business Type Tag
When `business_type` is set:
```
IF business_type = "Gym"
  → Add tag "Business Type - Gym"
IF business_type = "Climbing"
  → Add tag "Business Type - Climbing"
[etc.]
```

### Auto-Calculate Partner Tier
Based on monthly volume:
```
IF month_policies < 50
  → Set partner_tier = "Starter"
IF month_policies >= 50 AND < 200
  → Set partner_tier = "Growth"
IF month_policies >= 200
  → Set partner_tier = "Enterprise"
```

