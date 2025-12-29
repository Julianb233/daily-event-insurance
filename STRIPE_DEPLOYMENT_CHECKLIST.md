# Stripe Integration Deployment Checklist

Use this checklist to ensure proper deployment of the Stripe payment processing integration.

---

## Pre-Deployment Setup

### 1. Install Dependencies ⬜

```bash
pnpm install
```

**Verify:**
```bash
pnpm list stripe @stripe/stripe-js
```

Should show:
- ✅ stripe 17.5.0
- ✅ @stripe/stripe-js 5.0.0

---

### 2. Configure Environment Variables ⬜

Create `.env.local` with:

```bash
# Stripe Keys (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret (from https://dashboard.stripe.com/test/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Verify:**
```bash
npx tsx scripts/verify-stripe-setup.ts
```

---

### 3. Set Up Stripe Webhook (Development) ⬜

**Install Stripe CLI:**
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

**Configure:**
```bash
# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Copy webhook signing secret** to `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

### 4. Test Build ⬜

```bash
pnpm build
```

**Expected:** No TypeScript errors, successful build

---

## Local Testing

### 5. Start Development Server ⬜

Terminal 1:
```bash
pnpm dev
```

Terminal 2 (webhook forwarding):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

### 6. Create Test Quote ⬜

```bash
curl -X POST http://localhost:3000/api/partner/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "eventType": "Gym Session",
    "eventDate": "2025-02-15",
    "participants": 20,
    "coverageType": "liability",
    "customerEmail": "test@example.com",
    "customerName": "Test Customer"
  }'
```

**Save the `quote.id` from response**

---

### 7. Test Checkout Flow ⬜

Navigate to:
```
http://localhost:3000/checkout?quote_id=YOUR_QUOTE_ID
```

**Expected:**
- ✅ Redirects to Stripe Checkout
- ✅ Shows quote details
- ✅ No console errors

---

### 8. Complete Test Payment ⬜

**Use test card:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`
- ZIP: `12345`

**Complete payment**

---

### 9. Verify Payment Success ⬜

**Should redirect to:**
```
http://localhost:3000/checkout/success?session_id=cs_test_...
```

**Verify displays:**
- ✅ Success message
- ✅ Quote number
- ✅ Amount paid
- ✅ Confirmation email
- ✅ Next steps

---

### 10. Verify Database Records ⬜

```sql
-- Check policy created
SELECT * FROM policies WHERE quote_id = 'YOUR_QUOTE_ID';

-- Check payment created
SELECT * FROM payments WHERE policy_id = 'POLICY_ID';

-- Check webhook event logged
SELECT * FROM webhook_events
WHERE event_type = 'checkout.session.completed'
ORDER BY created_at DESC LIMIT 1;

-- Check quote updated
SELECT status FROM quotes WHERE id = 'YOUR_QUOTE_ID';
-- Should be 'accepted'
```

---

### 11. Test Payment Cancellation ⬜

1. Navigate to checkout with new quote
2. Click "Back" or close Stripe Checkout
3. Should redirect to `/checkout/cancel`

**Verify displays:**
- ✅ Cancellation message
- ✅ Quote still valid notice
- ✅ Retry button
- ✅ Help information

---

### 12. Test Webhook Events ⬜

```bash
# Trigger test event
stripe trigger checkout.session.completed
```

**Check database:**
```sql
SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 5;
```

**Expected:**
- ✅ Event logged
- ✅ `processed = true`
- ✅ No errors

---

### 13. Test Error Scenarios ⬜

**Declined Card:**
- Card: `4000 0000 0000 0002`
- Complete payment
- Should show decline error

**Insufficient Funds:**
- Card: `4000 0000 0000 9995`
- Complete payment
- Should show appropriate error

**Processing Error:**
- Card: `4000 0000 0000 0119`
- Complete payment
- Should show error message

---

## Production Deployment

### 14. Get Production API Keys ⬜

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Toggle "View test data" OFF
3. Copy production keys:
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)

---

### 15. Configure Production Webhook ⬜

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL:
   ```
   https://your-production-domain.com/api/stripe/webhook
   ```
4. Select events:
   - ✅ checkout.session.completed
   - ✅ payment_intent.payment_failed
   - ✅ charge.refunded
5. Copy signing secret (whsec_...)

---

### 16. Update Production Environment ⬜

**In your hosting platform (Vercel, etc.):**

```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (production)
NEXTAUTH_URL=https://your-production-domain.com
```

---

### 17. Deploy Application ⬜

```bash
# Commit changes (if not already)
git add .
git commit -m "Add Stripe payment integration"

# Push to production
git push origin main

# Or deploy via platform
vercel --prod
```

---

### 18. Verify Production Webhook ⬜

Test webhook endpoint:
```bash
curl https://your-production-domain.com/api/stripe/webhook
```

**Expected:** Response (method not allowed is OK)

**In Stripe Dashboard:**
- Go to Webhooks
- Click on your endpoint
- Send test webhook
- Verify it's received

---

### 19. Production Test Payment ⬜

**IMPORTANT: Use test mode first!**

1. Create test quote in production
2. Complete payment with test card
3. Verify all database records created
4. Check webhook delivery in Stripe Dashboard

---

### 20. Switch to Live Mode ⬜

**Only when fully tested:**

1. Update environment variables to live keys
2. Test with real card (small amount)
3. Verify refund works
4. Monitor for first few transactions

---

## Post-Deployment

### 21. Set Up Monitoring ⬜

**Webhook Monitoring:**
```sql
-- Check for failed webhooks daily
SELECT * FROM webhook_events
WHERE processed = false
AND created_at > NOW() - INTERVAL '24 hours';
```

**Payment Monitoring:**
```sql
-- Check for failed payments
SELECT * FROM payments
WHERE status = 'failed'
AND created_at > NOW() - INTERVAL '24 hours';
```

---

### 22. Configure Alerts ⬜

Set up alerts for:
- ✅ Webhook failures
- ✅ Payment failures
- ✅ Refund requests
- ✅ High-value transactions
- ✅ Unusual activity patterns

---

### 23. Documentation ⬜

Ensure team has access to:
- ✅ `STRIPE_SETUP.md` - Setup guide
- ✅ `lib/stripe/README.md` - Technical docs
- ✅ `STRIPE_IMPLEMENTATION_SUMMARY.md` - Overview
- ✅ Stripe Dashboard credentials
- ✅ Webhook endpoint URLs

---

### 24. Training ⬜

Team members know how to:
- ✅ Handle payment disputes
- ✅ Process refunds
- ✅ Debug webhook issues
- ✅ Read Stripe Dashboard
- ✅ Contact Stripe support

---

## Ongoing Maintenance

### Weekly Tasks ⬜

- Review failed payments
- Check webhook delivery status
- Monitor transaction volumes
- Review Stripe Dashboard for alerts

### Monthly Tasks ⬜

- Reconcile payments with Stripe reports
- Review and optimize payment flows
- Update test coverage
- Review security logs

### Quarterly Tasks ⬜

- Review Stripe API version updates
- Update dependencies
- Security audit
- Performance optimization review

---

## Emergency Procedures

### Payment Processing Down ⬜

1. Check Stripe Status: https://status.stripe.com
2. Verify webhook endpoint is accessible
3. Check environment variables
4. Review server logs
5. Contact Stripe support if needed

### Webhook Failures ⬜

1. Check webhook signing secret
2. Verify endpoint URL in Stripe Dashboard
3. Review webhook event logs in database
4. Manually process failed events if needed
5. Contact support if persistent

### Refund Request ⬜

```typescript
// Via Stripe Dashboard or API
const refund = await stripe.refunds.create({
  payment_intent: 'pi_...',
  reason: 'requested_by_customer',
})
```

---

## Success Metrics

Track these metrics:

- ✅ Payment success rate (target: >98%)
- ✅ Webhook delivery rate (target: >99%)
- ✅ Average checkout completion time
- ✅ Cart abandonment rate
- ✅ Refund rate (target: <2%)
- ✅ Dispute rate (target: <0.5%)

---

## Support Contacts

- **Stripe Support:** https://support.stripe.com
- **Stripe Status:** https://status.stripe.com
- **Technical Docs:** `/lib/stripe/README.md`
- **Setup Guide:** `/STRIPE_SETUP.md`

---

**Deployment Date:** _______________

**Deployed By:** _______________

**Production URL:** _______________

**Status:** ⬜ Development | ⬜ Staging | ⬜ Production

---

✅ **All items checked = Ready for production!**
