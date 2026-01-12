# Service Level Agreement (SLA) Policy
## Daily Event Insurance - Call Center Operations

**Version:** 1.0  
**Effective Date:** January 2025  
**Review Frequency:** Quarterly

---

## Overview

This document defines the response time standards for the Daily Event Insurance call center team. Adherence to these SLAs ensures timely prospect engagement and maximizes conversion rates.

---

## Response Time Standards

### Tier 1: Immediate Priority

| Lead Source | Target Response | Maximum Response | Escalation |
|-------------|-----------------|------------------|------------|
| New Web Inquiry (Form) | 15 minutes | 30 minutes | Alert team lead at 20 min |
| Inbound Phone Call (Missed) | 30 minutes | 1 hour | Alert team lead at 45 min |
| Chat Request | 2 minutes | 5 minutes | Auto-escalate at 3 min |

**Why it matters:** Studies show response within 5 minutes is 21x more effective than 30+ minutes. Our 15-30 minute target balances speed with operational reality.

### Tier 2: High Priority

| Task Type | Target Response | Maximum Response |
|-----------|-----------------|------------------|
| Scheduled Callback | At scheduled time | Within 15 min of scheduled time |
| Demo Reminder Call | 24 hours before demo | 4 hours before demo |
| Demo No-Show Follow-Up | 15 minutes | 1 hour |
| Proposal Follow-Up | 2 business days | 3 business days |

### Tier 3: Standard Priority

| Task Type | Target Response | Maximum Response |
|-----------|-----------------|------------------|
| Voicemail Follow-Up | 1 business day | 2 business days |
| Email Reply (Prospect) | 4 business hours | 8 business hours |
| Warm Lead Nurture | Every 2 business days | Every 3 business days |
| Cold Outreach | Per sequence schedule | +1 day variance allowed |

---

## Business Hours Definition

**Standard Business Hours:** Monday - Friday, 9:00 AM - 6:00 PM (Local Time Zone)

- SLA timers **pause** outside business hours
- A lead received Friday at 5:30 PM has until Monday 9:30 AM for 30-minute SLA
- Weekend/holiday inquiries are queued for Monday morning priority

### After-Hours Protocol

1. Voicemail greeting indicates next-day callback
2. Auto-response email acknowledges receipt
3. All after-hours inquiries flagged for first-thing follow-up

---

## SLA Tracking & Measurement

### Key Metrics

| Metric | Target | Red Flag |
|--------|--------|----------|
| First Response Time (Avg) | < 20 minutes | > 35 minutes |
| SLA Compliance Rate | > 90% | < 80% |
| Speed to First Call | < 30 minutes | > 1 hour |
| Missed Call Callback Rate | > 95% | < 85% |
| Same-Day Contact Rate | > 75% | < 60% |

### GoHighLevel Tracking

SLAs are tracked using these GHL fields:

- `created_at` - Lead creation timestamp
- `first_contact_at` - First successful contact timestamp
- `next_follow_up_at` - Scheduled follow-up datetime
- `call_status` - Current call/contact status

**Dashboard Alerts:**
- Yellow: SLA at 75% of maximum time
- Red: SLA breached
- Weekly: SLA compliance report

---

## Escalation Procedures

### Level 1: Self-Correction (0-75% of SLA)
- VA prioritizes task immediately
- No escalation needed

### Level 2: Peer Assist (75-100% of SLA)
- VA alerts team chat
- Available team member picks up task
- Original VA notes handoff

### Level 3: Team Lead Alert (100%+ of SLA - Breach)
- Automatic GHL notification to team lead
- Team lead assigns or handles directly
- Breach logged for review

### Level 4: Management Review (Pattern of Breaches)
- 3+ breaches in one week triggers review
- Process or staffing evaluation
- Corrective action if needed

---

## SLA Exceptions

The following situations **pause or reset** SLA timers:

### Valid Exceptions
- Contact explicitly requests callback at specific time
- Contact is out of office (OOO reply)
- System outage (documented)
- Incorrect contact information (documented attempts)
- Holiday/weekend (auto-pause)

### Not Valid Exceptions
- High call volume (staff accordingly)
- "I forgot" (process issue to address)
- Technical issues with personal equipment
- Other tasks taking priority

---

## Follow-Up Cadence Standards

### New Lead (Hot)
| Attempt | Timing | Action |
|---------|--------|--------|
| 1 | Within 30 min | Call + Email |
| 2 | Same day (+4 hrs) | Call only |
| 3 | Next business day | Call + SMS |
| 4 | Day 3 | Call only |
| 5 | Day 5 | Call + Email |
| 6 | Day 7 | Final call + close |

### Warm Lead (Engaged but not converted)
- Touch every 2 business days
- Alternate call/email/SMS
- Maximum 30 days in nurture
- Then move to long-term drip

### Cold Outreach
- Follow automated sequence timing
- 5 emails over 14 days
- Calls on days 1, 5, 10
- Respect unsubscribe/opt-out immediately

---

## Accountability

### Individual VA Metrics (Weekly Review)
- Total calls made
- First response time (average)
- SLA compliance %
- Conversion rate (lead → demo)
- Call quality scores

### Team Metrics (Monthly Review)
- Overall SLA compliance
- Lead-to-close conversion
- Average response times by lead source
- Customer satisfaction (if measured)

### Consequences
- **Exceeds standards:** Recognition, performance bonus eligibility
- **Meets standards:** Normal operations
- **Below standards:** Coaching and support
- **Consistent failure:** Performance improvement plan

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Jan 2025 | Initial policy | Operations Team |

---

*This SLA policy is a living document and will be updated based on operational learnings and business needs.*
