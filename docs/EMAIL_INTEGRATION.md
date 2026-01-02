# Email Integration Setup Complete

## Overview

Complete Resend email integration has been created for Daily Event Insurance with:
- Core email sending with rate limiting and retry logic
- 4 automated nurture sequences (gym, wellness, ski-resort, fitness)
- Email scheduling system with cron job processing
- Database schema for sequence and schedule tracking

## Files Created

### Core Email Library (`/lib/email/`)

1. **resend.ts** - Core Resend client
   - Automatic retry with exponential backoff (3 attempts)
   - Rate limiting (100 emails/minute)
   - Error handling and logging
   - Support for HTML/text, attachments, CC/BCC
   - From: "Daily Event Insurance <noreply@dailyeventinsurance.com>"

2. **sequences.ts** - Email automation sequences
   - 4 vertical-specific sequences (gym, wellness, ski-resort, fitness)
   - Each sequence has 4 emails (Day 0, 2, 5, 10)
   - Dynamic content with lead data (name, company, revenue)
   - Sequence management: start, pause, resume, complete
   - Status tracking in database

3. **scheduler.ts** - Email scheduling system
   - Schedule emails for future delivery
   - Process scheduled emails via cron
   - Retry failed emails
   - Cancel scheduled emails
   - Detailed status tracking and analytics

4. **index.ts** - Module exports
   - Clean API for importing email functionality

5. **README.md** - Complete documentation
   - Setup instructions
   - API reference
   - Usage examples
   - Troubleshooting guide

### Database Schema

**Updated `/lib/db/schema.ts`** with two new tables:

1. **email_sequences** - Tracks nurture sequences
   - Links to leads table
   - Sequence type (gym-nurture, wellness-nurture, etc.)
   - Current step tracking
   - Status (active, paused, completed, cancelled)
   - Metadata for sequence-specific data

2. **scheduled_emails** - Individual scheduled emails
   - Links to sequences and leads
   - Email content (subject, HTML, text)
   - Scheduling info (scheduled_for, sent_at)
   - Status tracking (pending, processing, sent, failed, cancelled)
   - Resend ID for tracking
   - Error logging

**Created `/lib/db/email-schema.ts`** - Standalone schema file for reference

### Migration

**Created `/scripts/migrations/001_add_email_tables.sql`**
- SQL migration for creating email tables
- Indexes for performance
- Comments for documentation
- Ready to run with psql or Drizzle

### API Routes

**Created `/app/api/cron/email/route.ts`**
- Cron endpoint for processing scheduled emails
- Bearer token authentication with CRON_SECRET
- Runs every 5 minutes (configured in vercel.json)
- Returns processing statistics

### Configuration

**Updated `.env.example`** with:
```env
# Resend Email
RESEND_API_KEY=re_your_resend_api_key_here

# Cron Job Security
CRON_SECRET=your-cron-secret-here
```

**Updated `vercel.json`** with:
```json
{
  "crons": [{
    "path": "/api/cron/email",
    "schedule": "*/5 * * * *"
  }]
}
```

### Package Installation

**Installed `resend` package** (v6.6.0)
- Added to package.json dependencies
- Installed with --legacy-peer-deps

## Next Steps

### 1. Configure Resend Account

```bash
# Get API key from https://resend.com/api-keys
# Add to .env.local
echo "RESEND_API_KEY=re_your_actual_key" >> .env.local
```

### 2. Verify Domain (Important!)

You need to verify your sending domain in Resend:

1. Go to https://resend.com/domains
2. Add "dailyeventinsurance.com"
3. Add DNS records to your domain provider
4. Verify the domain

**Until domain is verified, use Resend's test email:**
- From: can only be "onboarding@resend.dev"
- To: your verified email only

### 3. Run Database Migration

```bash
# Option 1: Using psql
psql $DATABASE_URL -f scripts/migrations/001_add_email_tables.sql

# Option 2: Using Drizzle (recommended)
npm run db:push
```

### 4. Configure Cron Secret

```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env.local
echo "CRON_SECRET=your_generated_secret" >> .env.local

# Also add to Vercel environment variables in dashboard
```

### 5. Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Add Resend email integration with automation sequences"

# Push to deploy
git push origin main

# Verify cron job in Vercel dashboard
```

### 6. Test Email Sending

Create a test file `/scripts/test-email.ts`:

```typescript
import { sendEmail } from '@/lib/email'

async function testEmail() {
  const result = await sendEmail({
    to: 'your-email@example.com',
    subject: 'Test Email from Daily Event Insurance',
    html: '<h1>It works!</h1><p>Email integration is configured correctly.</p>',
    text: 'It works! Email integration is configured correctly.',
  })

  console.log('Result:', result)
}

testEmail()
```

Run with:
```bash
npx tsx scripts/test-email.ts
```

### 7. Test Sequence Creation

```typescript
import { startSequence } from '@/lib/email'

async function testSequence() {
  const result = await startSequence(
    'lead-uuid-here',
    'gym-nurture',
    'contact@example.com',
    'John Doe',
    'Test Gym',
    1500.00
  )

  console.log('Sequence started:', result)
}
```

## Usage Examples

### Example 1: New Lead from Quote Form

```typescript
import { startSequence } from '@/lib/email'

export async function handleNewLead(lead: Lead) {
  // Determine sequence type based on vertical
  const sequenceMap: Record<string, SequenceType> = {
    'gym': 'gym-nurture',
    'wellness': 'wellness-nurture',
    'ski-resort': 'ski-resort-nurture',
    'fitness': 'fitness-nurture',
  }

  const sequenceType = sequenceMap[lead.vertical]

  if (sequenceType) {
    await startSequence(
      lead.id,
      sequenceType,
      lead.email,
      lead.contactName,
      lead.businessName || 'your business',
      lead.estimatedRevenue || 0
    )
  }
}
```

### Example 2: Manual Follow-Up Email

```typescript
import { scheduleEmail } from '@/lib/email'

const followUpDate = new Date()
followUpDate.setDate(followUpDate.getDate() + 3) // 3 days from now

await scheduleEmail({
  to: 'contact@gymname.com',
  subject: 'Following up on your insurance quote',
  html: '<p>Hi John, just wanted to check in...</p>',
  text: 'Hi John, just wanted to check in...',
  sendAt: followUpDate,
  leadId: lead.id,
  metadata: { type: 'manual-follow-up' }
})
```

### Example 3: Cancel Sequence on Conversion

```typescript
import { pauseSequence, sendEmail } from '@/lib/email'

async function handleLeadConversion(leadId: string, partner: Partner) {
  // Stop nurture sequence
  await pauseSequence(leadId)

  // Send welcome email
  await sendEmail({
    to: partner.contactEmail,
    subject: 'Welcome to Daily Event Insurance Partnership!',
    html: getWelcomeEmailTemplate(partner),
  })
}
```

## Email Sequence Structure

Each vertical has 4 emails with the following themes:

### Email 1 (Day 0) - Welcome
- Thank you for interest
- Value proposition
- Estimated revenue calculation
- Next steps

### Email 2 (Day 2) - Value & Questions
- Brief follow-up
- Common questions answered
- Integration details
- Setup timeline

### Email 3 (Day 5) - Social Proof
- Case study from similar business
- Specific results (revenue increase, opt-in rates)
- Customer testimonial
- Call to action

### Email 4 (Day 10) - Last Touch
- Final check-in
- Options to continue, pause, or stop
- No pressure approach
- Future contact preferences

## Monitoring & Maintenance

### Check Scheduler Stats

```typescript
import { getSchedulerStats } from '@/lib/email'

const stats = await getSchedulerStats()
console.log(`Pending: ${stats.pending}, Sent: ${stats.sent}, Failed: ${stats.failed}`)
```

### View Sequence Status

```typescript
import { getSequenceStatus } from '@/lib/email'

const status = await getSequenceStatus(leadId)
console.log(`Current step: ${status.sequence?.currentStep}`)
console.log(`Scheduled emails:`, status.scheduledEmails)
```

### Retry Failed Emails

```typescript
import { retryFailedEmail } from '@/lib/email'

await retryFailedEmail(emailId)
```

## Performance & Limits

- **Resend Free Tier**: 100 emails/day, 3,000 emails/month
- **Resend Pro**: 50,000 emails/month ($20/mo)
- **Rate Limiting**: 100 emails/minute (configured in resend.ts)
- **Retry Logic**: 3 attempts with exponential backoff
- **Cron Frequency**: Every 5 minutes (300 emails/hour max)

## Troubleshooting

### Emails Not Sending

1. Check RESEND_API_KEY is set correctly
2. Verify domain in Resend dashboard
3. Check scheduled_emails table for error messages
4. Review Resend dashboard for delivery issues

### Cron Job Not Running

1. Verify CRON_SECRET is set in Vercel
2. Check vercel.json has crons configuration
3. Review Vercel deployment logs
4. Test endpoint manually with curl

### Sequence Not Progressing

1. Ensure cron job is running
2. Check email_sequences.status is "active"
3. Review scheduled_emails for that sequence
4. Check database connection

## Security Notes

- Never commit .env.local with real API keys
- Use CRON_SECRET to protect cron endpoints
- Rate limiting prevents abuse
- All email content is sanitized by Resend
- Database queries use parameterized statements (Drizzle ORM)

## Future Enhancements

Consider adding:
1. Email open/click tracking (Resend supports this)
2. Unsubscribe handling
3. A/B testing for email content
4. Admin dashboard for sequence management
5. Email templates with WYSIWYG editor
6. Bounce and complaint handling
7. Advanced segmentation
8. Personalization tokens
9. Email preview before sending
10. Analytics dashboard

## Support

- Resend Documentation: https://resend.com/docs
- Resend Status: https://status.resend.com
- Drizzle ORM: https://orm.drizzle.team
- Next.js Cron: https://vercel.com/docs/cron-jobs

---

**Integration Complete!** Ready to start sending automated nurture emails to leads.
