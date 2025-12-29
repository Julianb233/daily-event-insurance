# Stripe Integration Setup Guide

Complete setup instructions for the Stripe payment processing integration.

## Prerequisites

- Node.js 18+ and pnpm installed
- Stripe account (create at https://stripe.com)
- Database configured and running
- Next.js application running locally

## Step 1: Install Dependencies

Run the following command in the project root:

```bash
pnpm add stripe @stripe/stripe-js
```

Or if using the installation script:

```bash
chmod +x install-stripe.sh
./install-stripe.sh
```

## Step 2: Get Stripe API Keys

### Test Mode (Development)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Production Mode

1. Toggle "View test data" off in Stripe Dashboard
2. Navigate to [API Keys](https://dashboard.stripe.com/apikeys)
3. Copy your **Publishable key** (starts with `pk_live_`)
4. Copy your **Secret key** (starts with `sk_live_`)

## Step 3: Configure Webhook Endpoint

### Local Development (Using Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin/
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`)

### Production (Using Stripe Dashboard)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL:
   ```
   https://your-production-domain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

Create or update `.env.local` in the project root:

```bash
# ===========================================
# STRIPE PAYMENT PROCESSING
# ===========================================

# Replace with your actual keys from Step 2
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Replace with your webhook secret from Step 3
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Important:**
- Never commit `.env.local` to version control
- Keep your secret key private
- Use test keys in development
- Use production keys only in production

## Step 5: Verify Installation

### Check Package Installation

```bash
pnpm list stripe @stripe/stripe-js
```

Expected output:
```
stripe 17.5.0
@stripe/stripe-js 5.0.0
```

### Verify Environment Variables

Create a test script `scripts/verify-stripe.ts`:

```typescript
import { validateStripeConfig } from "@/lib/stripe"

const result = validateStripeConfig()

if (result.valid) {
  console.log("✓ Stripe configuration is valid")
} else {
  console.error("✗ Stripe configuration errors:")
  result.errors.forEach(error => console.error(`  - ${error}`))
  process.exit(1)
}
```

Run:
```bash
npx tsx scripts/verify-stripe.ts
```

### Test Build

```bash
pnpm build
```

Expected: Build should complete without TypeScript errors.

## Step 6: Test the Integration

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Create a Test Quote

Use your API client or partner dashboard to create a quote:

```bash
curl -X POST http://localhost:3000/api/partner/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "eventType": "Gym Session",
    "eventDate": "2025-02-15",
    "participants": 20,
    "coverageType": "liability",
    "customerEmail": "test@example.com",
    "customerName": "Test Customer"
  }'
```

Save the returned `quote.id`.

### 3. Test Checkout Flow

Navigate to:
```
http://localhost:3000/checkout?quote_id=YOUR_QUOTE_ID
```

You should be redirected to Stripe Checkout.

### 4. Complete Test Payment

Use Stripe test card:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

### 5. Verify Success

After payment:
- Should redirect to `/checkout/success`
- Check database for:
  ```sql
  SELECT * FROM policies WHERE quote_id = 'YOUR_QUOTE_ID';
  SELECT * FROM payments WHERE policy_id = 'POLICY_ID';
  SELECT * FROM webhook_events WHERE source = 'stripe';
  ```

### 6. Test Webhook Locally

In a separate terminal, forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Trigger test event:
```bash
stripe trigger checkout.session.completed
```

Check webhook event logs:
```sql
SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 1;
```

## Stripe Test Cards

### Successful Payments
- **Success**: `4242 4242 4242 4242`
- **3D Secure required**: `4000 0025 0000 3155`

### Failed Payments
- **Generic decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`
- **Lost card**: `4000 0000 0000 9987`
- **Stolen card**: `4000 0000 0000 9979`
- **Expired card**: `4000 0000 0000 0069`
- **Incorrect CVC**: `4000 0000 0000 0127`
- **Processing error**: `4000 0000 0000 0119`
- **Incorrect number**: `4242 4242 4242 4241`

## Troubleshooting

### Build Errors

#### "Cannot find module 'stripe'"

**Solution:**
```bash
pnpm add stripe @stripe/stripe-js
pnpm install
```

#### "STRIPE_SECRET_KEY is not defined"

**Solution:**
1. Create `.env.local` file
2. Add `STRIPE_SECRET_KEY=sk_test_...`
3. Restart dev server

### Runtime Errors

#### "Webhook signature verification failed"

**Causes:**
- Wrong webhook secret
- Using parsed body instead of raw body
- Incorrect endpoint URL

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check webhook endpoint is `/api/stripe/webhook`
3. Ensure Next.js route uses raw body (already configured)

#### "Quote not found"

**Causes:**
- Invalid quote ID
- Quote expired
- Database not connected

**Solution:**
1. Verify quote exists: `SELECT * FROM quotes WHERE id = 'QUOTE_ID'`
2. Check quote hasn't expired
3. Verify database connection

#### "No checkout URL returned"

**Causes:**
- Stripe API error
- Network issues
- Invalid quote data

**Solution:**
1. Check server logs for Stripe errors
2. Verify all required environment variables
3. Test Stripe API connectivity

### Database Issues

#### Policy not created after payment

**Solution:**
1. Check webhook events:
   ```sql
   SELECT * FROM webhook_events
   WHERE event_type = 'checkout.session.completed'
   AND processed = false;
   ```
2. Look for errors in webhook processing
3. Manually process failed events if needed

## Production Deployment

### Pre-Deployment Checklist

- [ ] Replace test API keys with production keys
- [ ] Update `STRIPE_WEBHOOK_SECRET` with production webhook secret
- [ ] Configure production webhook endpoint in Stripe Dashboard
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Test webhook endpoint is publicly accessible
- [ ] Enable HTTPS/SSL on production domain
- [ ] Set up monitoring and error tracking
- [ ] Test complete payment flow in production
- [ ] Configure email notifications
- [ ] Review Stripe Dashboard settings

### Deploy Steps

1. Update environment variables in your hosting platform (Vercel, etc.)
2. Deploy application
3. Verify webhook endpoint:
   ```bash
   curl https://your-domain.com/api/stripe/webhook
   ```
4. Test with production test mode first
5. Switch to live mode when ready

### Post-Deployment Testing

1. Create test quote in production
2. Complete test payment (use test mode)
3. Verify policy created
4. Check webhook delivery in Stripe Dashboard
5. Test refund flow
6. Monitor error logs

## Security Best Practices

1. **Never expose secret keys**
   - Keep `STRIPE_SECRET_KEY` server-side only
   - Don't commit to version control
   - Rotate if compromised

2. **Always verify webhook signatures**
   - Required for security
   - Already implemented in `/api/stripe/webhook`

3. **Use HTTPS in production**
   - Required for Stripe webhooks
   - SSL certificate must be valid

4. **Implement idempotency**
   - Already handled by webhook event deduplication
   - Prevents duplicate policy creation

5. **Monitor webhook failures**
   - Set up alerts for failed webhook events
   - Review error logs regularly

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

## Next Steps

After setup is complete:

1. Integrate checkout button in quote UI
2. Set up email notifications for policy confirmations
3. Implement policy PDF generation
4. Configure partner commission tracking
5. Set up refund workflow
6. Implement customer dashboard
7. Add payment analytics

## Common Integration Points

### Adding "Buy Policy" Button to Quote Page

```tsx
import { useRouter } from "next/navigation"

function QuoteCard({ quote }) {
  const router = useRouter()

  const handleBuyPolicy = () => {
    router.push(`/checkout?quote_id=${quote.id}`)
  }

  return (
    <button onClick={handleBuyPolicy}>
      Buy Policy - ${quote.premium}
    </button>
  )
}
```

### Checking Payment Status

```typescript
import { getSessionPaymentDetails } from "@/lib/stripe"

const details = await getSessionPaymentDetails(sessionId)

if (details.status === "succeeded") {
  // Payment completed
  console.log("Receipt:", details.receiptUrl)
}
```

## Questions?

Contact the development team or refer to:
- `/lib/stripe/README.md` - Detailed API documentation
- Stripe support at https://support.stripe.com
