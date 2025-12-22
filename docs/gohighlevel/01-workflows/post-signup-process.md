# Post-Signup Process Flow

Complete journey from form submission to active partner status.

---

## Process Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DAILY EVENT INSURANCE                                │
│                       POST-SIGNUP PROCESS FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

[LEAD CAPTURE]                    [QUALIFICATION]                [ONBOARDING]
     │                                  │                              │
     ▼                                  ▼                              ▼
┌─────────┐    ┌─────────┐    ┌─────────────┐    ┌─────────┐    ┌──────────┐
│ Website │───▶│  Form   │───▶│  Welcome    │───▶│  Demo   │───▶│ Contract │
│  Visit  │    │ Submit  │    │  Sequence   │    │  Call   │    │  Signed  │
└─────────┘    └─────────┘    └─────────────┘    └─────────┘    └──────────┘
                   │                                                  │
                   ▼                                                  ▼
              Auto-Tags:                                         Triggers:
              • Lead - New                                       • Onboarding
              • Source - Website                                   Sequence
              • Business Type                                    • Portal Access
                                                                 • Integration

[INTEGRATION]                     [LAUNCH]                    [ONGOING SUCCESS]
     │                               │                              │
     ▼                               ▼                              ▼
┌───────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌───────────┐
│Integration│───▶│  Test   │───▶│  Go     │───▶│ First   │───▶│  Monthly  │
│   Setup   │    │ Policy  │    │  Live!  │    │  Week   │    │  Success  │
└───────────┘    └─────────┘    └─────────┘    └─────────┘    └───────────┘
     │                               │                              │
     ▼                               ▼                              ▼
 Day 3-5:                        Day 7:                         Ongoing:
 • Widget/API                    • Enable live                  • Monthly reports
 • Credentials                   • Staff training               • Quarterly reviews
 • Test mode                     • Marketing kit                • NPS surveys
```

---

## Stage 1: Lead Capture (Day 0)

### Trigger
Website form submission

### Immediate Actions (Within 2 minutes)
| # | Action | Details |
|---|--------|---------|
| 1 | Create Contact | All form fields mapped to GHL |
| 2 | Apply Tags | `Lead - New Inquiry`, `Source - Website`, `Business Type - [X]` |
| 3 | Add to Pipeline | Partner Acquisition → New Lead |
| 4 | Send Welcome Email | Template: `DEI - Welcome - Thank You` |
| 5 | Wait 2 min | Then send SMS |
| 6 | Send Welcome SMS | Brief confirmation |
| 7 | Create Task | "Review new lead: [Business Name]" for sales team |
| 8 | Slack Notification | #new-leads channel |

### What Business Owner Sees
- ✅ Confirmation message on form
- ✅ Welcome email in inbox
- ✅ SMS confirmation
- ✅ Links to resources (How It Works, FAQ, Benefits)

### What's In It For Them (Messaging Focus)
> "You're taking the first step toward earning **$500-2,000/month** in new revenue while protecting your members."

---

## Stage 2: Qualification (Days 1-10)

### Trigger
24 hours after no demo booking

### Sequence Overview
| Day | Action | Goal |
|-----|--------|------|
| 1 | Demo Reminder Email | Book a call |
| 3 | Value Proposition Email | Show revenue potential |
| 5 | Social Proof Email | Partner testimonials |
| 10 | Final Check-In Email | Last touch before pause |

### Exit Conditions
Stop sequence if:
- Demo booked → Move to "Demo Scheduled"
- Replied → Manual follow-up
- Unsubscribed → Remove from sequence

### What Business Owner Sees
- 📧 4 emails over 10 days
- 📊 Revenue calculator link
- 📹 Video testimonials
- 📅 Easy calendar booking

### What's In It For Them (Messaging Focus)
> **Email 1**: "Facilities like yours earn $800-2,000/month extra"
> **Email 2**: "For 100 daily check-ins = ~$540/month in commissions"
> **Email 3**: "Peak Performance Gym earned $1,847 last month"
> **Email 4**: "Ready when you are – no pressure"

---

## Stage 3: Demo & Qualification Call

### Before Demo
- [ ] Review business info from form
- [ ] Prepare revenue projection for their volume
- [ ] Check if they have specific software integrations

### During Demo (15-20 min)
| Time | Topic | Key Points |
|------|-------|------------|
| 0-3 min | Intro | Their business, pain points |
| 3-8 min | Show Platform | Member checkout experience |
| 8-12 min | Partner Dashboard | Real-time earnings, reports |
| 12-15 min | Revenue Projection | Custom calculation for their volume |
| 15-18 min | Integration | Show how easy it is |
| 18-20 min | Next Steps | Contract, timeline |

### After Demo
| Action | Timeline |
|--------|----------|
| Send follow-up email | Within 1 hour |
| Send partnership agreement | Same day |
| Schedule follow-up call | 2-3 days |

### What's In It For Them (Key Demo Points)
- **Revenue**: Show exact monthly projection based on their numbers
- **Simplicity**: "Integration takes 10-15 minutes"
- **Risk**: "No contracts, cancel anytime"
- **Support**: "Dedicated success manager"

---

## Stage 4: Contract & Onboarding (Days 0-7)

### Trigger
Tag added: `Partner - Signed Contract`

### Day 0: Welcome
| Action | Details |
|--------|---------|
| Send Welcome Email | Template: `DEI - Onboarding - Welcome` |
| Create Partner ID | Auto-generate: `DEI-[YEAR]-[SEQUENTIAL]` |
| Update Pipeline | → Onboarding |
| Assign Success Manager | Based on region/volume |

### Day 1: Portal Access
| Action | Details |
|--------|---------|
| Create Portal Account | partners.dailyeventinsurance.com |
| Send Credentials Email | Template: `DEI - Onboarding - Portal Access` |
| Create Task | "Verify portal login - [Business Name]" |

### Day 3: Integration
| Action | Details |
|--------|---------|
| Send Integration Email | Template: `DEI - Onboarding - Integration` |
| Provide API Credentials | In partner portal |
| Schedule Integration Call | If "Done-For-You" selected |

### Day 5: Check-In
| Action | Details |
|--------|---------|
| Check Integration Status | Has `Integration Complete` tag? |
| If Not Complete | Send check-in email + offer help |
| If Complete | Skip to Day 7 |

### Day 7: Launch Ready
| Action | Details |
|--------|---------|
| Send Launch Email | Template: `DEI - Onboarding - Launch Ready` |
| Provide Marketing Kit | Download link in portal |
| Enable Live Mode | (Partner toggles in portal) |

### What's In It For Them (Onboarding Focus)
- **Day 0**: "Welcome! Here's your roadmap to revenue"
- **Day 1**: "Your dashboard is ready – see earnings in real-time"
- **Day 3**: "15 minutes to integration = lifetime of commissions"
- **Day 7**: "Go live today and start earning"

---

## Stage 5: Launch & First Week (Days 7-14)

### Go-Live Checklist
- [ ] Partner enabled live mode in portal
- [ ] Test transaction completed
- [ ] Staff briefed on insurance offering
- [ ] Signage/marketing materials displayed
- [ ] First real policy sold

### Day 10: First Week Check-In
| Action | Details |
|--------|---------|
| Send Check-In Email | Template: `DEI - Onboarding - First Week` |
| Review Dashboard Stats | Are policies being sold? |
| If No Sales | Create task for outreach call |
| If Sales Active | Celebrate, encourage |

### Success Metrics (Week 1)
| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Policies Sold | > 0 | Call to troubleshoot |
| Conversion Rate | > 10% | Review placement, training |
| Dashboard Logins | > 2 | Email reminder |

### What's In It For Them (Launch Focus)
- "Your first sale happened today – $1 earned!"
- "You're averaging 18% conversion – above industry average"
- "At this rate, you'll earn $600+ this month"

---

## Stage 6: Ongoing Partner Success

### Monthly Touchpoints
| Week | Action |
|------|--------|
| Week 2 | Performance check email |
| Week 3 | Best practices email |
| Month 1 | Monthly report + tips |
| Month 2 | Expansion opportunities |
| Month 3 | NPS survey |

### Quarterly Reviews
- Revenue performance analysis
- Conversion optimization suggestions
- Feature update previews
- Tier upgrade assessment

### Annual Partnership Review
- Full year revenue summary
- Partnership tier evaluation
- Renewal discussion
- Expansion opportunities (additional locations)

### What's In It For Them (Ongoing Focus)
- Monthly commission deposits
- Performance insights
- Best practice tips from top partners
- First access to new features

---

## Pipeline Stages Summary

| Stage | Trigger | Exit To |
|-------|---------|---------|
| New Lead | Form submission | Contacted, Lost |
| Contacted | Sales outreach | Demo Scheduled, Lost |
| Demo Scheduled | Calendar booking | Qualified, Not Qualified |
| Qualified | Demo completed, good fit | Proposal Sent, Lost |
| Proposal Sent | Contract emailed | Negotiating, Won, Lost |
| Negotiating | Discussion ongoing | Won, Lost |
| Won | Contract signed | (Onboarding Pipeline) |
| Onboarding | Contract signed | Integration, Active |
| Integration | Tech setup started | Active, Issues |
| Active | Live and selling | Expansion, Churned |

---

## Key Performance Indicators

### Lead-to-Partner Conversion
| Stage | Target Conversion |
|-------|-------------------|
| Lead → Demo | 30% |
| Demo → Qualified | 70% |
| Qualified → Proposal | 80% |
| Proposal → Won | 50% |
| **Overall Lead → Won** | **~8%** |

### Onboarding Success
| Metric | Target |
|--------|--------|
| Time to First Sale | < 7 days |
| Integration Completion | < 5 days |
| Week 1 Active | > 90% |
| 30-Day Retention | > 95% |

---

## Automation Summary

### Tags Applied Automatically
```
Lead Stage:
- Lead - New Inquiry
- Lead - Contacted
- Lead - Qualified
- Lead - Demo Scheduled
- Lead - Demo Completed
- Lead - Proposal Sent

Partner Stage:
- Partner - Signed Contract
- Partner - Onboarding
- Partner - Integration In Progress
- Partner - Integration Complete
- Partner - Active
- Partner - Revenue Active

Engagement:
- Opened: Welcome Email
- Clicked: Demo Link
- Booked: Demo Call
```

### Tasks Created Automatically
- "Review new lead: [Business Name]"
- "Follow up: Demo no-show [Business Name]"
- "Review Partner Application: [Business Name]"
- "Process Integration Request: [Business Name]"
- "Week 1 Check-In: [Business Name]"
- "Monthly Review: [Business Name]"

