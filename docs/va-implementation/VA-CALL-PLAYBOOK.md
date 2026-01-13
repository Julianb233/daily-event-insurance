# VA Call Playbook
## Daily Event Insurance - Call Center Operations

**Version:** 1.0  
**Last Updated:** January 2025  
**Audience:** Virtual Assistants / Call Center Representatives

---

## Table of Contents

1. [Daily Workflow](#daily-workflow)
2. [Call Flow Scripts](#call-flow-scripts)
3. [Call Dispositions & Actions](#call-dispositions--actions)
4. [Standard Notes Template](#standard-notes-template)
5. [Objection Handling](#objection-handling)
6. [Do Not Call (DNC) Procedures](#do-not-call-dnc-procedures)
7. [Escalation Guidelines](#escalation-guidelines)

---

## Daily Workflow

### Start of Shift

1. **Log into GoHighLevel** → Conversations + Phone
2. **Check Task Queue** → Sort by `Due Date` (oldest first)
3. **Review Missed Calls** → Return within 1 hour SLA
4. **Check Pipeline** → Focus on `New Lead` and `Contacted` stages

### Priority Order

| Priority | Task Type | SLA |
|----------|-----------|-----|
| 1 | New Web Inquiry | 15-30 minutes |
| 2 | Missed Call Callback | 1 hour |
| 3 | Scheduled Callbacks | At scheduled time |
| 4 | Follow-up Tasks | 2 business days max |
| 5 | Voicemail Follow-ups | 1 day after VM |
| 6 | Cold Outreach | After hot leads done |

### End of Shift

1. **Log all incomplete calls** with next action date
2. **Update pipeline stages** for all contacts worked
3. **Create tasks** for next-day follow-ups
4. **Check for SLA breaches** and alert if needed

---

## Call Flow Scripts

### Inbound: New Inquiry Call

> **Goal:** Qualify the lead, schedule demo or send proposal

```
[GREETING]
"Thank you for calling Daily Event Insurance, this is [NAME]. 
How can I help you today?"

[DISCOVERY - Get these 4 key items]
1. Business name and type (gym, climbing, rental, etc.)
2. Number of locations / estimated daily visitors
3. Current insurance situation (existing coverage? gaps?)
4. Timeline / urgency

[QUALIFICATION]
"Based on what you've shared, it sounds like our embedded 
coverage solution could be a great fit. Our partners typically 
see [benefit for their business type]."

[NEXT STEP]
Option A (Qualified, Ready): "Let me schedule a quick 15-minute 
demo to show you exactly how this works..."

Option B (Interested, Not Ready): "I'll send you our partner 
overview with pricing. When would be a good time for a 
follow-up call?"

Option C (Not a Fit): "I appreciate you reaching out. Based on 
[reason], we may not be the best fit right now, but feel free 
to reach out if your situation changes."

[CLOSE]
"You'll receive a confirmation email shortly. Is there anything 
else I can help you with today?"
```

### Outbound: New Lead Follow-Up

> **Goal:** Connect with web inquiry within 30 minutes

```
[OPENER]
"Hi [NAME], this is [YOUR NAME] calling from Daily Event Insurance. 
You recently submitted an inquiry on our website about insurance 
coverage for [BUSINESS TYPE]. Do you have a quick moment?"

[If YES - Continue]
"Great! I wanted to personally follow up and answer any questions. 
What prompted you to reach out today?"

[QUALIFY AND ADVANCE - use Discovery questions above]

[If VOICEMAIL]
"Hi [NAME], this is [YOUR NAME] from Daily Event Insurance. 
I'm following up on your recent inquiry. We help [gyms/climbing 
facilities/rental businesses] offer same-day insurance coverage 
to their members. I'd love to chat briefly about your needs. 
You can reach me at [NUMBER] or reply to our email. 
Thanks, and have a great day!"
```

### Outbound: Callback Request

> **Goal:** Connect at requested time

```
[OPENER]
"Hi [NAME], this is [YOUR NAME] from Daily Event Insurance. 
You requested a callback for [TIME] - is now still a good time?"

[If YES - Continue with Discovery]

[If NO]
"No problem! When would be a better time for us to chat? 
I want to make sure I have your full attention."
[Reschedule and set task]
```

### Outbound: Demo Reminder

> **Goal:** Confirm upcoming demo, reduce no-shows

```
"Hi [NAME], this is [YOUR NAME] from Daily Event Insurance. 
I'm calling to confirm your demo scheduled for [DATE/TIME]. 
Will you still be able to join?"

[If YES]
"Perfect! You should have a calendar invite with the meeting link. 
Any questions before we connect?"

[If RESCHEDULE]
"No problem, let's find a better time..."
[Update calendar, move pipeline stage if needed]
```

---

## Call Dispositions & Actions

After every call, select the appropriate disposition and complete these actions:

| Disposition | GHL Tags | Pipeline Action | Next Step |
|-------------|----------|-----------------|-----------|
| **Reached - Qualified** | `Lead - Qualified` | Move to "Qualified" | Create task: Schedule demo |
| **Demo Scheduled** | `Lead - Demo Scheduled` | Move to "Demo Scheduled" | Send calendar invite |
| **Proposal Sent** | `Lead - Proposal Sent` | Move to "Proposal Sent" | Create task: Follow-up in 2 days |
| **Left Voicemail** | `Call - Left Voicemail` | Stay in current stage | Set `next_follow_up_at: +1 day` |
| **No Answer** | `Call - No Answer` | Stay in current stage | Set `next_follow_up_at: +4 hours` |
| **Call Back Requested** | `Call - Call Back Requested` | Stay in current stage | Set task for callback time |
| **Not Interested** | `Call - Not Interested` | Move to "Lost" | Stop all outreach workflows |
| **Bad Fit** | `Call - Bad Fit` | Move to "Lost" | Log reason in notes |
| **Number Invalid** | `Call - Number Invalid` | Stay in current stage | Try alternate contact method |
| **Do Not Call** | `Call - Do Not Call` | Remove from workflows | Complete DNC process |

### Call Attempt Rules

- **Max attempts:** 6 calls over 14 days
- **Spacing:** 
  - Attempt 1-2: Same day (4 hours apart)
  - Attempt 3: Next business day
  - Attempt 4-5: Every 2-3 days
  - Attempt 6: Final attempt, then close as unresponsive
- **Voicemail:** Leave VM on attempts 1, 3, and 6 only

---

## Standard Notes Template

Use this format for all call notes in GHL:

```
📞 [DATE] [TIME] - [INBOUND/OUTBOUND]

Spoke with: [Contact name / Voicemail / No answer]
Business: [Business name if new info]
Type: [Gym/Climbing/Rental/Adventure]
Size: [Locations/daily visitors if discussed]

Discussion:
- [Key point 1]
- [Key point 2]
- [Objections or concerns]

Outcome: [Disposition]
Next action: [Specific next step with date]
```

**Example:**
```
📞 01/12/25 2:30 PM - OUTBOUND

Spoke with: Sarah Johnson (Owner)
Business: Peak Fitness Gym
Type: Gym
Size: 2 locations, ~150 members/day each

Discussion:
- Currently uses annual waiver only
- Interested in day-pass coverage option
- Main concern: member friction at check-in

Outcome: Demo Scheduled
Next action: Demo 01/15 at 10am - sent calendar invite
```

---

## Objection Handling

### "We already have insurance"

> "That's great - liability coverage is essential. What we offer is 
> different. This is participant accident coverage that your members 
> purchase themselves. It actually protects YOUR insurance by reducing 
> claims against your policy. Many partners see it as an additional 
> revenue stream while offering better protection."

### "Our members won't pay for it"

> "I understand that concern. What we've found is that when coverage 
> is optional and affordable - typically $5-15 per session - members 
> who want extra protection are happy to pay. It's especially popular 
> with first-timers and visitors. You're not requiring it, just 
> offering it as an option."

### "We don't have time to implement this"

> "That's exactly why we built this to be hands-off. The typical 
> integration takes about 2-3 hours total with our team handling most 
> of the technical setup. After that, it runs automatically with no 
> daily work required from your staff."

### "Send me some information"

> "Happy to! Before I do, can I ask what specific information would 
> be most helpful for you? That way I can make sure we include the 
> right details. Also, when would be a good time for a quick 
> follow-up call to answer any questions?"

### "What does it cost?"

> "There's no cost to your business to offer this - we handle all the 
> insurance and administration. You actually earn a commission on each 
> policy sold. For members, coverage starts at around $5 per day. Would 
> it help if I showed you the partner revenue model in a quick demo?"

### "I need to talk to my partner/lawyer/insurance agent"

> "Absolutely, important decisions need the right input. Can I schedule 
> a follow-up call for after you've had that conversation? I'm also 
> happy to join a call with your [partner/advisor] if that would help 
> answer any technical or legal questions."

---

## Do Not Call (DNC) Procedures

### When to Apply DNC

- Contact explicitly requests no further calls
- Contact is hostile or abusive
- Number is personal (non-business) and requests removal
- Legal/compliance request received

### DNC Process

1. **Acknowledge immediately:** "I apologize for the inconvenience. I'll remove you from our call list right now."
2. **In GHL:**
   - Add tag: `Call - Do Not Call`
   - Set `do_not_call_reason` field with details
   - Remove from all active workflows
3. **Document:** Add note with exact request and timestamp
4. **Do NOT:** 
   - Attempt to persuade them to stay on list
   - Call again for any reason
   - Transfer to another team member to try again

### DNC Reasons (Use in field)

- `Requested removal - no reason given`
- `Not the right business contact`
- `Business closed/sold`
- `Hostile/abusive`
- `Legal/compliance request`

---

## Escalation Guidelines

### Escalate to Team Lead / Account Manager

- Request to speak with manager
- Complex integration questions beyond standard scope
- Pricing negotiations or custom deals
- Complaints about previous interactions
- Large accounts (10+ locations)

### Escalate to Licensed Agent

⚠️ **IMPORTANT: VAs cannot provide insurance advice**

Escalate immediately if prospect asks:
- Specific coverage limits or exclusions
- Legal questions about policy terms
- Claims-related questions
- Questions requiring insurance expertise

**Response:**
> "That's a great question, and I want to make sure you get accurate 
> information. Let me have one of our licensed insurance specialists 
> follow up with you. They can answer that in detail. Is this the 
> best number to reach you?"

### Escalate to Tech Team

- Integration technical issues
- API or embed questions
- Bug reports from existing partners
- Portal access problems

---

## Quick Reference Card

### Business Types & Value Props

| Type | Key Benefit |
|------|-------------|
| **Gym** | Day-pass and drop-in coverage for non-members |
| **Climbing** | First-timer and visitor accident protection |
| **Rental** | Equipment damage and injury coverage bundled |
| **Adventure** | High-risk activity coverage on demand |

### Key Metrics (Know These)

- Coverage starts at **$5/day**
- Partner setup takes **2-3 hours**
- Partners earn **15-25% commission**
- Claims processed in **24-48 hours**

### Contact Information

- **Main Number:** [INSERT]
- **Support Email:** support@dailyeventinsurance.com
- **Partner Portal:** partners.dailyeventinsurance.com
- **Escalation Contact:** [Team Lead Name/Number]

---

*Document maintained by Daily Event Insurance Operations Team*
