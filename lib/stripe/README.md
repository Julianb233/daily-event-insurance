# Stripe Payment Processing Integration

Complete Stripe Checkout integration for Daily Event Insurance policy purchases.

## Overview

This integration provides a secure, PCI-compliant payment processing system using Stripe Checkout (hosted). It handles the full payment lifecycle from quote to policy creation.

## Architecture

### Flow

1. User receives a quote from the quote engine
2. User clicks "Buy Policy" → redirects to `/checkout?quote_id=xxx`
3. Checkout page calls `/api/stripe/checkout` to create a Checkout Session
4. User is redirected to Stripe's hosted checkout page
5. User completes payment
6. Stripe redirects back to `/checkout/success` or `/checkout/cancel`
7. Stripe sends webhook to `/api/stripe/webhook`
8. Webhook handler creates policy and payment records in database

### Components

```
lib/stripe/
├── client.ts         # Stripe SDK initialization and error handling
├── checkout.ts       # Checkout session creation and management
├── webhooks.ts       # Webhook signature verification and event handlers
└── index.ts          # Public exports

app/api/stripe/
├── checkout/route.ts # POST - Create checkout session
└── webhook/route.ts  # POST - Receive webhook events

app/checkout/
├── page.tsx          # Checkout redirect page
├── success/page.tsx  # Payment success page
└── cancel/page.tsx   # Payment cancelled page
```

## Installation

### 1. Install Dependencies

```bash
pnpm add stripe @stripe/stripe-js
```

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# Stripe API Keys (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret (from https://dashboard.stripe.com/test/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Set URL to: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Usage

### Creating a Checkout Session

```typescript
import { createCheckoutSession } from "@/lib/stripe"

const session = await createCheckoutSession({
  quote: quoteObject,
  customerEmail: "customer@example.com",
  successUrl: "https://yoursite.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
  cancelUrl: "https://yoursite.com/checkout/cancel?quote_id=xxx",
})

// Redirect user to session.url
window.location.href = session.url
```

### Retrieving Session Details

```typescript
import { getCheckoutSession, getSessionPaymentDetails } from "@/lib/stripe"

const session = await getCheckoutSession(sessionId)
const details = await getSessionPaymentDetails(sessionId)
```

### Handling Webhooks

Webhooks are automatically processed by the `/api/stripe/webhook` route. The handler:

1. Verifies the signature
2. Checks for duplicate events (idempotency)
3. Processes the event based on type
4. Records the event in the database

## API Routes

### POST /api/stripe/checkout

Creates a Stripe Checkout session.

**Request Body:**
```json
{
  "quoteId": "uuid",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/...",
  "quote": {
    "id": "uuid",
    "quoteNumber": "QT-20250101-12345",
    "premium": "49.90",
    "coverageType": "liability"
  }
}
```

### GET /api/stripe/checkout?session_id=xxx

Retrieves checkout session details.

**Response:**
```json
{
  "session": {
    "id": "cs_test_...",
    "status": "complete",
    "payment_status": "paid",
    "customer_email": "customer@example.com",
    "amount_total": 4990,
    "metadata": { ... }
  }
}
```

### POST /api/stripe/webhook

Receives Stripe webhook events (internal use only).

## Database Schema

### Webhook Events

All webhook events are logged in the `webhook_events` table:

```typescript
{
  id: string              // Stripe event ID (primary key)
  source: "stripe"
  eventType: string       // e.g., "checkout.session.completed"
  payload: string         // Full event JSON
  processed: boolean
  processedAt: Date | null
  error: string | null
  createdAt: Date
}
```

### Payments

Payment records are created when checkout completes:

```typescript
{
  id: uuid
  policyId: uuid
  partnerId: uuid
  paymentNumber: string   // PAY-YYYYMMDD-XXXXX
  stripePaymentIntentId: string
  stripeChargeId: string
  stripeCustomerId: string
  amount: decimal
  currency: string
  status: "succeeded" | "failed" | "refunded" | ...
  paymentMethod: string
  receiptUrl: string
  paidAt: Date
}
```

### Policies

Policies are created automatically when payment succeeds:

```typescript
{
  id: uuid
  partnerId: uuid
  quoteId: uuid
  policyNumber: string    // POL-YYYYMMDD-XXXXX
  status: "active" | "expired" | "cancelled"
  premium: decimal
  commission: decimal
  effectiveDate: Date
  expirationDate: Date
  customerEmail: string
  customerName: string
  // ... other fields from quote
}
```

## Error Handling

All Stripe operations include comprehensive error handling:

### Client Errors (don't retry)
- `StripeCardError` - Card declined
- `StripeInvalidRequestError` - Invalid parameters
- `StripeAuthenticationError` - API key issues

### Server Errors (auto-retry)
- `StripeAPIError` - Stripe API error
- `StripeConnectionError` - Network issues
- `StripeRateLimitError` - Rate limit exceeded

### Utilities

```typescript
import { formatStripeError, isStripeError } from "@/lib/stripe"

try {
  // Stripe operation
} catch (error) {
  if (isStripeError(error)) {
    const message = formatStripeError(error)
    // User-friendly error message
  }
}
```

## Testing

### Test Cards

Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`
- **Processing error**: `4000 0000 0000 0119`

Any future expiration date and any 3-digit CVC will work.

### Testing Webhooks Locally

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Trigger test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Manual Testing Flow

1. Create a quote via the partner dashboard or API
2. Navigate to `/checkout?quote_id={quoteId}`
3. Complete payment with test card `4242 4242 4242 4242`
4. Verify redirect to success page
5. Check database for:
   - Policy record created
   - Payment record created
   - Quote status updated to "accepted"
   - Webhook event logged

## Security

### Webhook Signature Verification

All webhook events are verified using Stripe's signature verification:

```typescript
const event = verifyWebhookSignature(rawBody, signature)
```

Never process webhook events without signature verification.

### Idempotency

Webhook events are checked for duplicates using the Stripe event ID:

```typescript
const alreadyProcessed = await isEventProcessed(event.id)
if (alreadyProcessed) return
```

### Environment Variables

- Never commit `.env.local` to version control
- Use test keys in development
- Rotate keys if compromised
- Use separate keys for production

## Production Checklist

- [ ] Replace test API keys with production keys
- [ ] Configure production webhook endpoint
- [ ] Test webhook signing with production secret
- [ ] Enable Stripe Tax if required
- [ ] Configure email notifications
- [ ] Set up monitoring and alerts
- [ ] Test refund flow
- [ ] Test dispute handling
- [ ] Configure statement descriptor
- [ ] Review Stripe Dashboard settings

## Troubleshooting

### "Webhook signature verification failed"

- Check `STRIPE_WEBHOOK_SECRET` is correct
- Ensure you're using the raw request body (not parsed)
- Verify webhook endpoint URL matches Stripe dashboard

### "Quote not found"

- Ensure quote exists in database
- Check quote ID format is valid UUID
- Verify quote hasn't expired

### "Policy already exists"

- This is expected - idempotency is working
- Multiple webhook deliveries won't create duplicates

### Payment succeeded but no policy created

1. Check webhook endpoint is accessible
2. Review webhook event logs in database
3. Check for errors in webhook processing
4. Verify database connection is working

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Support](https://support.stripe.com/)

For integration issues, contact the development team.
