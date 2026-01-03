# Outbound Email Campaigns

## Overview

High-conversion email campaigns and landing pages for each vertical, written in Alex Hormozi style (direct, benefit-focused, numbers-heavy).

## What Was Created

### 1. Email Templates (`lib/email/templates/outbound.ts`)

**Style**: Alex Hormozi direct response
- Subject lines with specific dollar amounts
- Opening line addresses pain/opportunity immediately
- Body focuses on quantifiable results
- Zero fluff, all benefits
- Strong PS with urgency or additional value

**Verticals**:
- Gym (`gymEmails`)
- Wellness/Spa (`wellnessEmails`)
- Ski Resort (`skiResortEmails`)
- Fitness Events (`fitnessEmails`)

**Sequence**:
1. **Initial** - Immediate send, establishes value prop with specific revenue numbers
2. **Follow-up 1** - Day 3, social proof and simplified ask
3. **Follow-up 2** - Day 7, breakup email with simple YES/NO choice

### 2. Landing Pages

Each vertical has a conversion-optimized landing page at `/landing/{vertical}`:

- `/landing/gym` - For gym owners and fitness centers
- `/landing/wellness` - For wellness centers, spas, IV therapy
- `/landing/ski-resort` - For ski resorts and mountain recreation
- `/landing/fitness` - For race directors and event organizers

**Structure**:
1. Hero: Big promise with specific dollar amount
2. Problem: What they're losing now
3. Solution: How it works (3 simple steps)
4. Calculator: Interactive ROI calculator
5. Social proof: Real testimonials with real numbers
6. Offer: Zero risk, no contracts, quick setup
7. FAQ: Handle common objections
8. Final CTA: Strong close with urgency

### 3. Email Sequence System (`lib/email/sequences-outbound.ts`)

**Functions**:
- `startOutboundSequence()` - Initiate 3-email sequence
- `stopOutboundSequence()` - Cancel when prospect replies/converts
- `getOutboundSequenceStatus()` - Check sequence progress

**Timing**:
- Email 1: Immediate
- Email 2: Day 3
- Email 3: Day 7

### 4. API Endpoints

#### `POST /api/campaigns/outbound`
Start an outbound sequence manually:

```json
{
  "leadId": "lead_123",
  "vertical": "gym",
  "email": "owner@gymname.com",
  "contactName": "John",
  "companyName": "Peak Fitness",
  "estimatedRevenue": 38400
}
```

Response:
```json
{
  "success": true,
  "data": {
    "sequenceId": "seq_456",
    "vertical": "gym",
    "emailCount": 3,
    "schedule": [
      { "step": 1, "delay": "immediate", "type": "initial" },
      { "step": 2, "delay": "3 days", "type": "followUp1" },
      { "step": 3, "delay": "7 days", "type": "followUp2" }
    ]
  }
}
```

#### `DELETE /api/campaigns/outbound`
Stop a sequence:

```json
{
  "leadId": "lead_123"
}
```

#### `GET /api/campaigns/outbound?leadId=xxx`
Check sequence status

### 5. Auto-Start Integration

Modified `/api/leads` to automatically start outbound sequences when leads submit quote forms:

```typescript
// Auto-triggers for: gym, wellness, ski-resort, fitness
// Skips for: race, other (generic verticals)
```

## Key Features

### Email Copy Principles (Hormozi Style)

1. **Numbers-Heavy**
   - Specific dollar amounts in subject lines
   - Revenue projections in opening paragraphs
   - Social proof with exact figures

2. **Direct & Blunt**
   - "You're leaving money on the table"
   - "Either you want free money or you don't"
   - "Math doesn't lie"

3. **Zero Fluff**
   - No long stories
   - No corporate speak
   - Straight to value prop

4. **Risk Reversal**
   - "No contracts"
   - "Cancel anytime"
   - "5-minute setup"

5. **Strong PS**
   - Additional urgency
   - Lost opportunity cost
   - Simple action step

### Landing Page Principles

1. **Value Prop in Headline**
   - "$14 Profit Per Treatment"
   - "Add $2,730/Day To Your Bottom Line"

2. **Interactive Calculator**
   - Let prospects calculate their own revenue
   - Personalized numbers = higher conversion

3. **Social Proof with Specifics**
   - Real names (first name + last initial)
   - Exact revenue numbers
   - Specific opt-in rates

4. **FAQ as Objection Handling**
   - Address concerns directly
   - Short, confident answers
   - Always close with benefit

## Usage Examples

### Manual Campaign Trigger

```typescript
// Start outbound sequence for a cold prospect
const response = await fetch('/api/campaigns/outbound', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leadId: 'lead_abc123',
    vertical: 'gym',
    email: 'owner@summitfitness.com',
    contactName: 'Mike',
    companyName: 'Summit Fitness',
    estimatedRevenue: 42000
  })
})
```

### Auto-Start on Quote Form Submission

Automatically happens when someone fills out a quote form at:
- `/for-gyms` → Triggers gym sequence
- `/wellness` → Triggers wellness sequence
- `/ski-resorts` → Triggers ski-resort sequence
- `/fitness` → Triggers fitness sequence

### Stop Sequence When They Reply

```typescript
// When prospect replies or books a call
await fetch('/api/campaigns/outbound', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ leadId: 'lead_abc123' })
})
```

## Customization Points

### Update Email Copy

Edit `lib/email/templates/outbound.ts`:
- Modify subject lines
- Adjust value propositions
- Update social proof examples
- Change timing/urgency elements

### Adjust Sequence Timing

Edit `lib/email/templates/outbound.ts`:

```typescript
export const sequenceTiming = {
  initial: 0,      // Change to delay initial email
  followUp1: 3,    // Change follow-up 1 delay
  followUp2: 7,    // Change follow-up 2 delay
}
```

### Modify Calculator Defaults

Edit each landing page's initial state:
- `monthlyMembers` (gym)
- `monthlyClients` (wellness)
- `dailyVisitors` (ski-resort)
- `participantsPerEvent` (fitness)

### Update Opt-In Rates

Current defaults (based on industry data):
- Gym: 65%
- Wellness: 95%
- Ski Resort: 65%
- Fitness Events: 82%

## Environment Variables

Required for email sending:

```bash
RESEND_API_KEY=re_xxx  # Resend API key for email delivery
```

## Testing Sequences

### Development Mode
When `RESEND_API_KEY` is not set, sequences log to console instead of sending:

```
[DEV] Would start outbound sequence: {
  leadId: 'lead_123',
  vertical: 'gym',
  email: 'test@example.com',
  estimatedRevenue: '$38,400/year'
}
```

### Production Mode
With API key set:
1. Emails are scheduled in `scheduled_emails` table
2. Cron job (or manual trigger) processes queue
3. Resend sends emails according to schedule
4. Track delivery status in database

## Landing Page URLs

Live URLs for campaigns:
- Gym: `https://dailyeventinsurance.com/landing/gym`
- Wellness: `https://dailyeventinsurance.com/landing/wellness`
- Ski Resort: `https://dailyeventinsurance.com/landing/ski-resort`
- Fitness: `https://dailyeventinsurance.com/landing/fitness`

Use these URLs in email templates (already configured).

## Metrics to Track

### Email Performance
- Open rate (target: >40%)
- Reply rate (target: >5%)
- Click-through to landing page (target: >15%)
- Booking rate (target: >3%)

### Landing Page Performance
- Calculator usage (target: >60%)
- Time on page (target: >2 minutes)
- CTA click rate (target: >25%)
- Form submission rate (target: >8%)

### Revenue Impact
- Leads started in sequence
- Leads converted from sequence
- Average deal size from outbound
- CAC (Customer Acquisition Cost)

## Next Steps

1. **Add Calendar Integration**
   - Replace `[CALENDAR_LINK]` placeholders with actual Calendly/Cal.com links
   - Different links per vertical if needed

2. **A/B Testing**
   - Test different subject lines
   - Test different value props in hero
   - Test calculator placement on landing pages

3. **Email Scheduler**
   - Set up cron job to process `scheduled_emails` table
   - Endpoint: `POST /api/email/process-scheduled`

4. **Analytics Integration**
   - Track email opens (Resend webhooks)
   - Track landing page visits (GA4/Plausible)
   - Attribution: email → landing page → booking

5. **Notification Integration**
   - Alert sales team when prospect replies
   - Slack notification on high-value lead submission
   - Daily digest of sequence performance

## Copywriting Notes

### Hormozi Principles Used

1. **Specific Numbers**: "$14 profit per member" not "earn commissions"
2. **Social Proof**: "Mike R. from Denver" not "our clients"
3. **Risk Reversal**: "Cancel anytime" not "flexible terms"
4. **Value Stack**: Show everything they get (and don't have to do)
5. **Direct CTA**: "Reply YES or NO" not "let us know your thoughts"

### Owen Cook (RSD) Positioning

1. **Zero Risk**: No contracts, no minimums, no commitments
2. **Quick Win**: "5-minute setup" not "easy process"
3. **MRR Focus**: Monthly recurring revenue emphasized
4. **Better Service**: "Your members get protection" not just "you make money"

## File Structure

```
lib/email/
├── templates/
│   └── outbound.ts          # Hormozi-style email templates
├── sequences-outbound.ts    # Outbound sequence management
├── sequences.ts             # Original nurture sequences (keep for reference)
├── scheduler.ts             # Email scheduling system
└── resend.ts               # Email sending client

app/landing/
├── gym/page.tsx            # Gym landing page
├── wellness/page.tsx       # Wellness landing page
├── ski-resort/page.tsx     # Ski resort landing page
└── fitness/page.tsx        # Fitness events landing page

app/api/
├── campaigns/
│   └── outbound/route.ts   # Campaign trigger endpoint
└── leads/route.ts          # Auto-starts sequences on submission
```

## Quick Start

1. Set `RESEND_API_KEY` in environment variables
2. Deploy landing pages to production
3. Update `[CALENDAR_LINK]` placeholders with actual booking URLs
4. Test sequence by submitting quote form
5. Monitor results in database (`email_sequences` and `scheduled_emails` tables)

## Support

For questions or issues:
- Check sequence status: `GET /api/campaigns/outbound?leadId=xxx`
- Stop sequence: `DELETE /api/campaigns/outbound` with `{ leadId: 'xxx' }`
- View scheduled emails in database: `SELECT * FROM scheduled_emails WHERE lead_id = 'xxx'`
