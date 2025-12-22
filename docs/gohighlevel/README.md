# Daily Event Insurance - GoHighLevel Implementation Guide

This folder contains the complete GoHighLevel (GHL) implementation documentation for the Daily Event Insurance business partner onboarding system.

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Implementation Phases](#implementation-phases)
4. [Quick Start](#quick-start)

---

## Overview

Daily Event Insurance uses GoHighLevel as the primary CRM and automation platform for:

- **Partner Onboarding** - Automated nurture sequences for new business inquiries
- **Lead Qualification** - Segmenting leads by business type and readiness
- **Contract & Integration** - Guiding partners through setup process
- **Ongoing Communication** - Partner success and support automation

### Target Audience

- Gym & Fitness Center Owners
- Rock Climbing Facility Operators
- Equipment Rental Businesses
- Adventure Sports Operators

---

## Folder Structure

```
docs/gohighlevel/
├── README.md                    # This file
├── 01-workflows/
│   ├── new-partner-inquiry.md   # Initial form submission workflow
│   ├── qualification-sequence.md # Lead qualification automation
│   ├── onboarding-sequence.md   # Partner onboarding workflow
│   └── partner-success.md       # Ongoing nurture & engagement
├── 02-emails/
│   ├── welcome-series.md        # Welcome email sequence (5 emails)
│   ├── qualification-emails.md  # Qualification follow-ups
│   ├── onboarding-emails.md     # Onboarding step emails
│   └── partner-success-emails.md # Ongoing engagement emails
├── 03-automations/
│   ├── wait-steps.md            # Wait timing reference
│   ├── conditional-logic.md     # If/then branching rules
│   └── tagging-strategy.md      # Tag naming conventions
└── 04-setup/
    ├── pipeline-setup.md        # Pipeline configuration
    ├── custom-fields.md         # Custom field definitions
    └── integration-guide.md     # Website → GHL integration
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Configure GHL sub-account
- [ ] Set up custom fields and tags
- [ ] Create pipelines and stages
- [ ] Import email templates

### Phase 2: Automation (Week 2)
- [ ] Build new partner inquiry workflow
- [ ] Create qualification sequence
- [ ] Set up onboarding automation
- [ ] Configure SMS templates

### Phase 3: Integration (Week 3)
- [ ] Connect website form to GHL
- [ ] Test end-to-end workflow
- [ ] Configure calendar booking
- [ ] Set up notifications

### Phase 4: Optimization (Week 4+)
- [ ] Monitor performance metrics
- [ ] A/B test email subject lines
- [ ] Refine wait step timing
- [ ] Add partner success automation

---

## Quick Start

### Prerequisites
- GoHighLevel Agency account
- Sub-account for Daily Event Insurance
- Website form ready for integration

### First Steps
1. Review `04-setup/custom-fields.md` and create required fields
2. Follow `04-setup/pipeline-setup.md` to configure stages
3. Import email templates from `02-emails/`
4. Build workflows as documented in `01-workflows/`

---

## Contact

For questions about this implementation:
- **Technical Lead**: Julian Bradley
- **Client**: Aaron Drew (HiQOR)
- **Project**: Daily Event Insurance

