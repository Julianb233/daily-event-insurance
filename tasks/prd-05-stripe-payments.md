# PRD: Stripe Payment Processing System

## Introduction

The Stripe Payment Processing System enables customers to pay for insurance policies through Stripe Checkout. When a customer accepts a quote, they're redirected to a hosted Stripe Checkout page, and upon successful payment, the system automatically creates an active insurance policy. The system handles the complete payment lifecycle including webhooks for payment confirmation, refunds, and failure handling.

## Goals

- Enable seamless, PCI-compliant payment collection via Stripe Checkout
- Automatically create policies upon successful payment
- Handle payment failures and refunds gracefully
- Maintain complete audit trail of all payment events
- Ensure idempotent webhook processing (no duplicate policies)
- Support test mode for development and production mode for live payments

## Target Users

1. **Customers**: Pay for insurance policies via credit/debit card
2. **Partners**: See payment status on policies they've sold
3. **System**: Process webhooks and create policies automatically
4. **Admin**: View payment reports and handle disputes

## User Stories

### US-001: Initiate Checkout from Quote
**Description:** As a customer, I want to proceed to payment from a quote so I can purchase my insurance coverage.

**Acceptance Criteria:**
- [ ] Navigate to /checkout?quote_id={quoteId} initiates checkout
- [ ] Page displays quote summary: event, coverage, participants, price
- [ ] "Pay Now" button creates Stripe Checkout session
- [ ] Automatic redirect to Stripe Checkout page
- [ ] Loading state shown while session is created
- [ ] Error message if quote is expired or invalid
- [ ] npm run build passes

### US-002: Create Stripe Checkout Session
**Description:** As the system, I need to create a Checkout session so customers can pay securely.

**Acceptance Criteria:**
- [ ] POST /api/stripe/checkout creates session
- [ ] Required input: quoteId, optional: customerEmail, customerName
- [ ] Validates quote exists and is pending
- [ ] Validates quote is not expired
- [ ] Session includes: line item with coverage details, metadata with quote ID
- [ ] Success URL: /checkout/success?session_id={CHECKOUT_SESSION_ID}
- [ ] Cancel URL: /checkout/cancel?quote_id={quoteId}
- [ ] Returns: sessionId, checkout URL
- [ ] Session expires in 30 minutes

### US-003: Payment Success Page
**Description:** As a customer, I want to see confirmation after payment so I know my coverage is active.

**Acceptance Criteria:**
- [ ] /checkout/success displays order confirmation
- [ ] Shows: policy number, coverage details, effective dates
- [ ] Shows: customer name/email, premium amount
- [ ] "Print Confirmation" button for receipt
- [ ] "Download Policy PDF" button (if available)
- [ ] Next steps information
- [ ] Support contact information
- [ ] Graceful error if session not found

### US-004: Payment Cancelled Page
**Description:** As a customer, I want to return to my quote if I cancel payment so I can try again later.

**Acceptance Criteria:**
- [ ] /checkout/cancel shows cancellation message
- [ ] Informs quote is still valid and preserved
- [ ] "Try Again" button returns to checkout
- [ ] "Contact Support" link for assistance
- [ ] Quote ID preserved for retry

### US-005: Webhook Event Processing
**Description:** As the system, I need to receive Stripe webhooks so I can process payments automatically.

**Acceptance Criteria:**
- [ ] POST /api/stripe/webhook receives Stripe events
- [ ] Signature verification using STRIPE_WEBHOOK_SECRET
- [ ] Rejects invalid signatures with 400 response
- [ ] Handles checkout.session.completed event
- [ ] Handles payment_intent.payment_failed event
- [ ] Handles charge.refunded event
- [ ] Logs all events to webhookEvents table
- [ ] Returns 200 to acknowledge receipt

### US-006: Policy Creation on Payment Success
**Description:** As the system, I need to create a policy when payment succeeds so coverage is activated.

**Acceptance Criteria:**
- [ ] Triggered by checkout.session.completed webhook
- [ ] Extracts quoteId from session metadata
- [ ] Validates quote still exists and is pending
- [ ] Creates policy with: all quote details, status "active"
- [ ] Policy number format: POL-YYYYMMDD-XXXXX
- [ ] Sets effectiveDate to event date, expirationDate to day after event
- [ ] Creates payment record linked to policy
- [ ] Updates quote status to "accepted"
- [ ] Idempotent: skips if policy already exists for quote

### US-007: Payment Record Creation
**Description:** As the system, I need to record payment details so we have complete financial records.

**Acceptance Criteria:**
- [ ] Payment record created with checkout.session.completed
- [ ] Payment number format: PAY-YYYYMMDD-XXXXX
- [ ] Stores: stripePaymentIntentId, stripeChargeId, stripeCustomerId
- [ ] Stores: amount, currency, status, paymentMethod
- [ ] Stores: receiptUrl from Stripe
- [ ] Status set to "succeeded"
- [ ] paidAt timestamp recorded

### US-008: Payment Failure Handling
**Description:** As the system, I need to track failed payments so we can follow up with customers.

**Acceptance Criteria:**
- [ ] Triggered by payment_intent.payment_failed webhook
- [ ] Creates or updates payment record with status "failed"
- [ ] Stores failureCode and failureMessage from Stripe
- [ ] Quote remains in "pending" status (customer can retry)
- [ ] Optional: Trigger failed payment notification to partner

### US-009: Refund Processing
**Description:** As the system, I need to update records when refunds occur so our data is accurate.

**Acceptance Criteria:**
- [ ] Triggered by charge.refunded webhook
- [ ] Updates payment record: refundAmount, refundedAt
- [ ] Sets status to "refunded" or "partially_refunded"
- [ ] Updates policy status to "cancelled" if full refund
- [ ] Stores refundReason if provided
- [ ] Does not create duplicate records for partial refunds

### US-010: Retrieve Session Details
**Description:** As a developer, I need to verify payment details so the success page shows accurate information.

**Acceptance Criteria:**
- [ ] GET /api/stripe/checkout?session_id={id} retrieves session
- [ ] Returns: payment status, customer details, amount paid
- [ ] Returns: associated quote and policy if exists
- [ ] Returns: receipt URL for download
- [ ] Handles expired or invalid session IDs gracefully

### US-011: Webhook Event Idempotency
**Description:** As the system, I need to handle duplicate webhooks so policies aren't created twice.

**Acceptance Criteria:**
- [ ] Check if webhookEvents already has this event ID
- [ ] Skip processing if event already processed
- [ ] Check if policy already exists for quote before creating
- [ ] Return 200 (success) even for already-processed events
- [ ] Log duplicate events for monitoring

### US-012: Environment Configuration
**Description:** As a developer, I need to configure Stripe for different environments so testing is safe.

**Acceptance Criteria:**
- [ ] STRIPE_SECRET_KEY: sk_test_* for development, sk_live_* for production
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_* or pk_live_*
- [ ] STRIPE_WEBHOOK_SECRET: whsec_* for webhook validation
- [ ] Runtime validation of required env vars
- [ ] Clear error messages for missing configuration

## Functional Requirements

- FR-1: Checkout page displays quote details and initiates Stripe session
- FR-2: Stripe Checkout session created with quote metadata
- FR-3: Success page retrieves session and displays confirmation
- FR-4: Webhook endpoint validates signatures and processes events
- FR-5: checkout.session.completed creates policy and payment records
- FR-6: payment_intent.payment_failed records failure details
- FR-7: charge.refunded updates payment and policy status
- FR-8: All webhook events logged to database for audit
- FR-9: Idempotent processing prevents duplicate policies
- FR-10: Payment records link to policies with Stripe references

## Non-Goals (Out of Scope)

- Multiple payment methods (credit card only for v1)
- Subscription/recurring payments
- Installment payment plans
- Customer payment portal/self-service refunds
- Invoice generation
- Multi-currency support (USD only)
- Apple Pay / Google Pay (Stripe Checkout handles if configured)

## Technical Considerations

- **PCI Compliance**: Stripe Checkout is hosted, fully PCI compliant
- **Webhooks**: Must be publicly accessible, signature verified
- **Idempotency**: Critical for avoiding duplicate charges/policies
- **Local Testing**: Use Stripe CLI for webhook forwarding
- **Error Handling**: Comprehensive error types with user-friendly messages
- **Retry Logic**: Network failures should retry with exponential backoff

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/stripe/checkout | POST | Create checkout session |
| /api/stripe/checkout | GET | Retrieve session details |
| /api/stripe/webhook | POST | Receive Stripe webhooks |

## Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 9995 | Insufficient funds |

## Success Metrics

- Payment success rate > 95%
- Checkout to payment completion < 3 minutes
- Zero duplicate policies from webhook processing
- 100% webhook delivery acknowledgment
- Refund processing < 1 business day

## Open Questions

- Should we support partial refunds with pro-rated policy coverage?
- What is the refund policy (24hr cancellation, event not started, etc.)?
- Should failed payments trigger automatic retry or customer notification?
