# Resend Email Integration - Setup Checklist

## ✅ Completed

- [x] Core email client with rate limiting (`resend.ts`)
- [x] Email automation sequences (`sequences.ts`)
- [x] Email scheduler with cron processing (`scheduler.ts`)
- [x] Database schema for email_sequences and scheduled_emails
- [x] SQL migration file created
- [x] Cron API route created
- [x] Package installed (resend v6.6.0)
- [x] Environment variables documented
- [x] Vercel.json cron configuration
- [x] Complete documentation with examples

**Total Code:** 1,179 lines of TypeScript

## 🚀 Quick Start (5 Steps)

### 1. Get Resend API Key
```bash
# Sign up at https://resend.com
# Go to API Keys and create a new key
# Add to .env.local:
RESEND_API_KEY=re_your_actual_api_key_here
```

### 2. Verify Domain (Important!)
```bash
# In Resend dashboard:
# 1. Go to Domains
# 2. Add "dailyeventinsurance.com"
# 3. Add DNS records to your domain provider
# 4. Wait for verification (usually < 1 hour)
```

### 3. Run Database Migration
```bash
# Apply the migration
psql $DATABASE_URL -f scripts/migrations/001_add_email_tables.sql

# Or with Drizzle:
npm run db:push
```

### 4. Set Cron Secret
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
CRON_SECRET=your_generated_secret_here

# Add to Vercel dashboard environment variables
```

### 5. Deploy & Test
```bash
# Commit changes
git add .
git commit -m "Add Resend email integration"
git push

# Test manually (replace with your email)
curl -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/email
```

## 📋 What to Do Next

### Immediate (Required)
1. [ ] Add RESEND_API_KEY to .env.local
2. [ ] Verify domain in Resend dashboard
3. [ ] Run database migration
4. [ ] Add CRON_SECRET to environment
5. [ ] Deploy to Vercel

### Soon (Recommended)
6. [ ] Test email sending with test script
7. [ ] Customize email templates in sequences.ts
8. [ ] Set up lead capture to trigger sequences
9. [ ] Monitor cron job in Vercel logs
10. [ ] Add email tracking/analytics

### Later (Optional)
11. [ ] Add unsubscribe handling
12. [ ] Create admin dashboard for sequences
13. [ ] Add A/B testing for email content
14. [ ] Implement bounce handling
15. [ ] Set up email templates library

## 🎯 Integration Points

### Where to Use

1. **New Lead Created** (Quote Form)
```typescript
// In /app/api/leads/route.ts or wherever leads are created
import { startSequence } from '@/lib/email'

await startSequence(
  lead.id,
  'gym-nurture', // or wellness-nurture, ski-resort-nurture, fitness-nurture
  lead.email,
  lead.contactName,
  lead.businessName,
  lead.estimatedRevenue
)
```

2. **Lead Converted to Partner**
```typescript
import { pauseSequence } from '@/lib/email'

// Stop nurture sequence
await pauseSequence(leadId)
```

3. **Manual Follow-Up**
```typescript
import { scheduleEmail } from '@/lib/email'

await scheduleEmail({
  to: 'contact@example.com',
  subject: 'Following up',
  html: '<p>Content here</p>',
  sendAt: new Date('2026-01-10T10:00:00Z')
})
```

## 📊 Files Created

```
lib/email/
├── resend.ts          (256 lines) - Core client with retry & rate limiting
├── sequences.ts       (588 lines) - 4 automated nurture sequences
├── scheduler.ts       (312 lines) - Email scheduling & cron processing
├── index.ts           (23 lines)  - Module exports
└── README.md          - Complete documentation

lib/db/
├── schema.ts          - Updated with email tables
└── email-schema.ts    - Standalone email schema

scripts/migrations/
└── 001_add_email_tables.sql - Migration for email tables

app/api/cron/email/
└── route.ts           - Cron endpoint (runs every 5 minutes)

docs/
├── EMAIL_INTEGRATION.md - Full setup guide
└── (this file)

.env.example           - Updated with RESEND_API_KEY and CRON_SECRET
vercel.json            - Updated with cron configuration
package.json           - Added resend@6.6.0
```

## ⚠️ Important Notes

### Before Production
- **Domain Verification**: Must verify sending domain in Resend
- **Rate Limits**: Free tier = 100 emails/day, 3,000/month
- **Cron Secret**: Required for security (don't skip!)
- **Database**: Migration must be applied before use

### Testing
- Use test@resend.dev for testing before domain verification
- Test cron endpoint manually before relying on it
- Monitor Resend dashboard for delivery issues

### Common Issues
1. **"Domain not verified"** - Complete DNS setup in Resend
2. **"Unauthorized"** - Check CRON_SECRET matches in Vercel
3. **"Database error"** - Run migration first
4. **"Rate limit"** - Upgrade Resend plan or reduce frequency

## 🔗 Resources

- **Resend Docs**: https://resend.com/docs
- **Resend Dashboard**: https://resend.com/domains
- **Vercel Cron Docs**: https://vercel.com/docs/cron-jobs
- **Project README**: /lib/email/README.md
- **Setup Guide**: /docs/EMAIL_INTEGRATION.md

## 💡 Quick Test

Test email sending immediately:

```typescript
// Create test.ts
import { sendEmail } from '@/lib/email'

await sendEmail({
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<h1>It works!</h1>',
  text: 'It works!'
})
```

Run:
```bash
npx tsx test.ts
```

---

**Status**: ✅ Integration Complete - Ready for Configuration & Deployment
