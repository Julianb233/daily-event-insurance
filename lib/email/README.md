# Email Integration - Daily Event Insurance

Complete Resend email integration with automation sequences and scheduling.

## Setup

1. **Install Resend package** (if not already installed):
```bash
npm install resend
```

2. **Add environment variable** to `.env.local`:
```env
RESEND_API_KEY=re_your_api_key_here
```

3. **Run database migration**:
```bash
psql $DATABASE_URL -f scripts/migrations/001_add_email_tables.sql
```

Or use Drizzle Kit:
```bash
npm run db:push
```

## File Structure

```
lib/email/
├── resend.ts          # Core Resend client with rate limiting
├── sequences.ts       # Email automation sequences
├── scheduler.ts       # Email scheduling system
├── index.ts           # Module exports
└── README.md          # This file
```

## Core Features

### 1. Email Sending (`resend.ts`)

Basic email sending with automatic retry and rate limiting:

```typescript
import { sendEmail } from '@/lib/email'

const result = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to Daily Event Insurance',
  html: '<h1>Welcome!</h1>',
  text: 'Welcome!',
})

if (result.success) {
  console.log('Email sent:', result.id)
} else {
  console.error('Failed:', result.error)
}
```

**Features:**
- Rate limiting (100 emails/minute)
- Automatic retry with exponential backoff (3 attempts)
- Error handling for invalid emails
- Support for HTML and plain text
- Attachments, CC, BCC, custom headers

### 2. Email Sequences (`sequences.ts`)

Automated nurture sequences for different verticals:

```typescript
import { startSequence } from '@/lib/email'

// Start a gym nurture sequence
await startSequence(
  leadId,
  'gym-nurture',
  'contact@gymname.com',
  'John Doe',
  'CrossFit Momentum',
  1500.00 // Estimated monthly revenue
)
```

**Available Sequences:**
- `gym-nurture` - 4 emails (Day 0, 2, 5, 10)
- `wellness-nurture` - 4 emails (Day 0, 2, 5, 10)
- `ski-resort-nurture` - 4 emails (Day 0, 2, 5, 10)
- `fitness-nurture` - 4 emails (Day 0, 2, 5, 10)

**Sequence Management:**
```typescript
// Pause a sequence
await pauseSequence(leadId)

// Resume a sequence
await resumeSequence(leadId)

// Get sequence status
const status = await getSequenceStatus(leadId)
console.log(status.sequence.currentStep, status.scheduledEmails)
```

### 3. Email Scheduling (`scheduler.ts`)

Schedule individual emails or process scheduled emails:

```typescript
import { scheduleEmail, processScheduledEmails } from '@/lib/email'

// Schedule an email
await scheduleEmail({
  to: 'user@example.com',
  subject: 'Reminder',
  html: '<p>Don\'t forget!</p>',
  sendAt: new Date('2026-01-10T10:00:00Z'),
  metadata: { type: 'reminder', userId: '123' }
})

// Process scheduled emails (run via cron)
const results = await processScheduledEmails()
console.log(`Sent: ${results.sent}, Failed: ${results.failed}`)
```

## Database Schema

### `email_sequences` Table
Tracks automation sequences for leads.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| lead_id | UUID | Reference to leads table |
| sequence_type | TEXT | Type: gym-nurture, wellness-nurture, etc. |
| current_step | INTEGER | Current step (0-indexed) |
| total_steps | INTEGER | Total steps in sequence |
| status | TEXT | active, paused, completed, cancelled |
| last_email_sent_at | TIMESTAMP | Last email sent time |
| completed_at | TIMESTAMP | Completion timestamp |
| metadata | TEXT | JSON string for additional data |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### `scheduled_emails` Table
Individual scheduled emails.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| sequence_id | UUID | Optional reference to sequence |
| lead_id | UUID | Optional reference to lead |
| to | TEXT | Recipient email(s) |
| subject | TEXT | Email subject |
| html_content | TEXT | HTML email body |
| text_content | TEXT | Plain text body |
| scheduled_for | TIMESTAMP | When to send |
| sent_at | TIMESTAMP | When actually sent |
| status | TEXT | pending, processing, sent, failed, cancelled |
| resend_id | TEXT | Resend API email ID |
| error | TEXT | Error message if failed |
| attempted_at | TIMESTAMP | Last send attempt |
| step_number | INTEGER | Sequence step number |
| metadata | TEXT | JSON string for additional data |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Cron Job Setup

Create a cron job to process scheduled emails:

**Using Vercel Cron:**

1. Create `/app/api/cron/email/route.ts`:
```typescript
import { processScheduledEmails } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const results = await processScheduledEmails()
  return NextResponse.json(results)
}
```

2. Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/email",
    "schedule": "*/5 * * * *"
  }]
}
```

3. Add `CRON_SECRET` to environment variables.

**Using Node-Cron (self-hosted):**

```typescript
import cron from 'node-cron'
import { processScheduledEmails } from '@/lib/email'

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Processing scheduled emails...')
  const results = await processScheduledEmails()
  console.log(`Processed: ${results.processed}, Sent: ${results.sent}`)
})
```

## Usage Examples

### Example 1: New Lead from Quote Form

```typescript
import { startSequence } from '@/lib/email'

// When a new lead is created
async function handleNewLead(lead: Lead) {
  if (lead.vertical === 'gym') {
    await startSequence(
      lead.id,
      'gym-nurture',
      lead.email,
      lead.contactName,
      lead.businessName || 'your business',
      lead.estimatedRevenue || 0
    )
  }
}
```

### Example 2: Schedule Follow-Up Email

```typescript
import { scheduleEmail } from '@/lib/email'

// Schedule a follow-up 3 days from now
const followUpDate = new Date()
followUpDate.setDate(followUpDate.getDate() + 3)

await scheduleEmail({
  to: 'contact@gymname.com',
  subject: 'Following up on your quote',
  html: '<p>Just wanted to check in...</p>',
  text: 'Just wanted to check in...',
  sendAt: followUpDate,
  leadId: lead.id,
  metadata: { type: 'manual-follow-up' }
})
```

### Example 3: Cancel Sequence on Conversion

```typescript
import { pauseSequence } from '@/lib/email'

// When lead converts to partner
async function handleLeadConversion(leadId: string) {
  // Pause the nurture sequence
  await pauseSequence(leadId)

  // Send welcome email
  await sendEmail({
    to: partner.contactEmail,
    subject: 'Welcome to Daily Event Insurance!',
    html: getWelcomeEmailHtml(partner),
  })
}
```

## API Reference

### `sendEmail(options: EmailOptions)`
Send an email immediately with retry logic.

**Options:**
- `to` - Recipient email(s)
- `subject` - Email subject
- `html` - HTML content (optional)
- `text` - Plain text content (optional)
- `replyTo` - Reply-to address (optional)
- `cc` - CC recipients (optional)
- `bcc` - BCC recipients (optional)
- `attachments` - File attachments (optional)
- `tags` - Resend tags (optional)
- `headers` - Custom headers (optional)

**Returns:** `{ success: boolean, id?: string, error?: string }`

### `startSequence(leadId, vertical, email, contactName, companyName, estimatedRevenue)`
Start an automated email sequence for a lead.

**Returns:** `{ success: boolean, error?: string }`

### `scheduleEmail(options: ScheduleEmailOptions)`
Schedule an email to be sent at a specific time.

**Options:**
- All `EmailOptions` fields
- `sendAt` - When to send (Date)
- `sequenceId` - Associated sequence (optional)
- `leadId` - Associated lead (optional)
- `metadata` - Additional data (optional)

**Returns:** `{ success: boolean, emailId?: string, error?: string }`

### `processScheduledEmails()`
Process all pending scheduled emails. Run this via cron every 5 minutes.

**Returns:**
```typescript
{
  processed: number,
  sent: number,
  failed: number,
  errors: string[]
}
```

## Rate Limits

- **Resend:** 100 emails per second per domain (we limit to 100/minute)
- **Database:** No hard limits, but recommend batching large operations

## Error Handling

All functions return a result object with `success` boolean and optional `error` string:

```typescript
const result = await sendEmail({ ... })

if (!result.success) {
  console.error('Email failed:', result.error)
  // Handle error (log, retry, notify admin, etc.)
}
```

## Monitoring

Check scheduler statistics:

```typescript
import { getSchedulerStats } from '@/lib/email'

const stats = await getSchedulerStats()
console.log(stats) // { pending: 5, sent: 120, failed: 2, cancelled: 1 }
```

## Testing

Test email sending without hitting Resend:

```typescript
// Use a test email address
await sendEmail({
  to: 'test@resend.dev',
  subject: 'Test Email',
  html: '<p>This is a test</p>',
})
```

## Troubleshooting

### Emails not sending
1. Check `RESEND_API_KEY` is set
2. Verify domain is verified in Resend dashboard
3. Check `scheduled_emails` table for `failed` status
4. Review error messages in `scheduled_emails.error` column

### Rate limit errors
- Reduce cron frequency
- Batch emails more conservatively
- Check Resend dashboard for limits

### Sequence not progressing
- Verify cron job is running
- Check `email_sequences.status` is `active`
- Review `scheduled_emails` for that sequence

## Next Steps

1. **Set up domain verification** in Resend dashboard
2. **Configure cron job** for `processScheduledEmails`
3. **Customize email templates** in `sequences.ts`
4. **Add email analytics** tracking (opens, clicks)
5. **Implement unsubscribe handling**
6. **Create admin dashboard** for email management
