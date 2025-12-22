# Wait Steps Reference Guide

Standard wait timing for all Daily Event Insurance workflows.

---

## General Wait Step Philosophy

| Priority | Wait Duration | Use Case |
|----------|--------------|----------|
| Immediate | 0-2 minutes | Confirmations, SMS after email |
| Short | 1-2 days | Follow-ups, check-ins |
| Standard | 3-5 days | Nurture sequences |
| Long | 7-14 days | Re-engagement |

---

## New Partner Inquiry Workflow

```
Trigger: Form Submitted
├── Send Welcome Email
├── WAIT: 2 minutes
├── Send Welcome SMS
├── WAIT: 1 day
│   └── Check: Has "Booked Demo" tag?
│       ├── YES → Exit
│       └── NO → Continue
├── Send Demo Reminder Email
├── WAIT: 2 days
├── Send Value Proposition Email
├── WAIT: 2 days
├── Send Social Proof Email
├── WAIT: 5 days
└── Send Final Check-In Email
```

### Timing Summary
| Step | Wait Duration | Cumulative |
|------|--------------|------------|
| Welcome → SMS | 2 minutes | 2 min |
| SMS → Demo Reminder | 1 day | ~1 day |
| Demo Reminder → Value | 2 days | ~3 days |
| Value → Social Proof | 2 days | ~5 days |
| Social Proof → Final | 5 days | ~10 days |

---

## Partner Onboarding Workflow

```
Trigger: Tag "Partner - Signed Contract" Added
├── Day 0: Welcome Email
├── WAIT: 1 day
├── Day 1: Portal Access Email
├── WAIT: 2 days
├── Day 3: Integration Setup Email
├── WAIT: 2 days
├── Day 5: Integration Check-In
│   └── Check: Has "Integration Complete" tag?
│       ├── YES → Skip check-in
│       └── NO → Send check-in email + SMS
├── WAIT: 2 days
├── Day 7: Launch Ready Email
├── WAIT: 3 days
└── Day 10: First Week Check-In
```

### Timing Summary
| Step | Wait Duration | Target Day |
|------|--------------|------------|
| Welcome → Portal | 1 day | Day 1 |
| Portal → Integration | 2 days | Day 3 |
| Integration → Check-In | 2 days | Day 5 |
| Check-In → Launch | 2 days | Day 7 |
| Launch → Week 1 | 3 days | Day 10 |

---

## Qualification Sequence

```
Trigger: Contact has tag "Lead - Qualified"
├── Day 0: Qualification Confirmed Email
├── WAIT: 1 day
├── Day 1: ROI Calculator Email
├── WAIT: 2 days
├── Day 3: Case Study Email
├── WAIT: 2 days
├── Day 5: Demo Invitation Email
├── WAIT: 3 days
├── Day 8: Follow-Up Call (Create Task)
├── WAIT: 4 days
└── Day 12: Final Outreach Email
```

---

## Partner Success Sequence

```
Trigger: Contact has tag "Partner - Active" for 14 days
├── Week 2: Performance Check Email
├── WAIT: 7 days
├── Week 3: Best Practices Email
├── WAIT: 14 days
├── Month 1: Monthly Report + Tips
├── WAIT: 30 days
├── Month 2: Expansion Opportunities
├── WAIT: 30 days
└── Month 3: Partner Survey + NPS
```

---

## Wait Step Best Practices

### 1. Use Business Hours
Configure waits to respect business hours:
```
Wait until: Next business day at 9:00 AM
Skip: Weekends, holidays
```

### 2. Time Zone Considerations
Set waits based on contact's timezone:
```
Wait until: 10:00 AM in contact's timezone
```

### 3. Exit Conditions
Always include exit conditions to prevent over-messaging:
```
If contact has tag "Unsubscribed" → Exit workflow
If contact has tag "Contract Signed" → Move to onboarding
If contact has tag "Not Interested" → Exit workflow
```

---

## Wait Duration by Business Type

Different business types may need adjusted timing:

| Business Type | Suggested Adjustment |
|--------------|---------------------|
| Gym/Fitness | Standard timing |
| Climbing Facility | Standard timing |
| Equipment Rental | +1 day (seasonal considerations) |
| Adventure Sports | +2 days (often owner-operated) |

---

## Testing Wait Steps

When testing workflows:

1. **Use Test Mode**: Set all waits to 1 minute
2. **Tag Test Contacts**: Use tag "Test - Workflow Testing"
3. **Reset Before Live**: Switch back to production waits
4. **Document Changes**: Log any timing adjustments

