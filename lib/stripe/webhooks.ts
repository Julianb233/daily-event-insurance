/**
 * Stripe Webhook Handler
 *
 * Handles and processes Stripe webhook events with signature verification
 * and idempotent event processing.
 */

import Stripe from "stripe"
import { stripe, stripeConfig, isStripeError } from "./client"
import { db, quotes, policies, payments, webhookEvents, NewPolicy, NewPayment } from "@/lib/db"
import { eq } from "drizzle-orm"

export interface WebhookEvent {
  id: string
  type: string
  data: Stripe.Event.Data
  created: number
}

/**
 * Verify Stripe webhook signature
 *
 * @param payload - Raw request body as string
 * @param signature - Stripe signature header
 * @returns Verified Stripe event
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!stripeConfig.webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
  }

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.webhookSecret
    )
  } catch (error) {
    if (isStripeError(error)) {
      throw new Error(`Webhook signature verification failed: ${error.message}`)
    }
    throw new Error("Webhook signature verification failed")
  }
}

/**
 * Check if webhook event has already been processed (idempotency)
 */
async function isEventProcessed(eventId: string): Promise<boolean> {
  try {
    const [existing] = await db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.id, eventId))
      .limit(1)

    return !!existing
  } catch (error) {
    console.error("[Webhook] Error checking event status:", error)
    return false
  }
}

/**
 * Record webhook event in database
 */
async function recordWebhookEvent(
  event: Stripe.Event,
  processed: boolean = false,
  error?: string
): Promise<void> {
  try {
    await db.insert(webhookEvents).values({
      id: event.id,
      source: "stripe",
      eventType: event.type,
      payload: JSON.stringify(event),
      processed,
      processedAt: processed ? new Date() : null,
      error: error || null,
    })
  } catch (err) {
    console.error("[Webhook] Failed to record event:", err)
  }
}

/**
 * Generate unique policy number
 * Format: POL-YYYYMMDD-XXXXX
 */
function generatePolicyNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
  return `POL-${dateStr}-${random}`
}

/**
 * Generate unique payment number
 * Format: PAY-YYYYMMDD-XXXXX
 */
function generatePaymentNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
  return `PAY-${dateStr}-${random}`
}

/**
 * Handle checkout.session.completed event
 *
 * Creates policy and payment records when checkout is successful
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log("[Webhook] Processing checkout.session.completed:", session.id)

  // Extract metadata
  const quoteId = session.metadata?.quote_id
  const partnerId = session.metadata?.partner_id

  if (!quoteId || !partnerId) {
    throw new Error("Missing required metadata: quote_id or partner_id")
  }

  // Retrieve quote
  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId)).limit(1)

  if (!quote) {
    throw new Error(`Quote not found: ${quoteId}`)
  }

  // Check if policy already exists for this quote (idempotency)
  const [existingPolicy] = await db
    .select()
    .from(policies)
    .where(eq(policies.quoteId, quoteId))
    .limit(1)

  if (existingPolicy) {
    console.log("[Webhook] Policy already exists for quote:", quoteId)
    return
  }

  // Get payment intent details
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id

  if (!paymentIntentId) {
    throw new Error("No payment intent found in session")
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  })

  const charge =
    typeof paymentIntent.latest_charge === "string"
      ? await stripe.charges.retrieve(paymentIntent.latest_charge)
      : paymentIntent.latest_charge

  // Calculate policy dates
  const eventDate = new Date(quote.eventDate)
  const effectiveDate = new Date()
  const expirationDate = new Date(eventDate)
  expirationDate.setDate(expirationDate.getDate() + 1) // Policy expires 1 day after event

  // Create policy
  const policyData: NewPolicy = {
    partnerId: quote.partnerId,
    quoteId: quote.id,
    policyNumber: generatePolicyNumber(),
    eventType: quote.eventType,
    eventDate: quote.eventDate,
    participants: quote.participants,
    coverageType: quote.coverageType,
    premium: quote.premium,
    commission: quote.commission,
    status: "active",
    effectiveDate,
    expirationDate,
    customerEmail: session.customer_email || quote.customerEmail || "unknown@example.com",
    customerName:
      session.customer_details?.name || quote.customerName || "Unknown Customer",
    customerPhone: session.customer_details?.phone || null,
    eventDetails: quote.eventDetails,
    metadata: quote.metadata,
    duration: quote.duration,
    location: quote.location,
    riskMultiplier: quote.riskMultiplier,
    commissionTier: quote.commissionTier,
  }

  const [policy] = await db.insert(policies).values(policyData).returning()

  if (!policy) {
    throw new Error("Failed to create policy")
  }

  console.log("[Webhook] Policy created:", policy.policyNumber)

  // Create payment record
  const paymentData: NewPayment = {
    policyId: policy.id,
    partnerId: quote.partnerId,
    paymentNumber: generatePaymentNumber(),
    stripePaymentIntentId: paymentIntent.id,
    stripeChargeId: charge?.id || null,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : session.customer?.id || null,
    amount: (paymentIntent.amount / 100).toString(), // Convert from cents
    currency: paymentIntent.currency,
    status: paymentIntent.status === "succeeded" ? "succeeded" : "processing",
    paymentMethod: charge?.payment_method_details?.type || null,
    paymentMethodDetails: charge?.payment_method_details
      ? JSON.stringify({
          type: charge.payment_method_details.type,
          card: charge.payment_method_details.card
            ? {
                brand: charge.payment_method_details.card.brand,
                last4: charge.payment_method_details.card.last4,
                exp_month: charge.payment_method_details.card.exp_month,
                exp_year: charge.payment_method_details.card.exp_year,
              }
            : null,
        })
      : null,
    receiptUrl: charge?.receipt_url || null,
    paidAt: paymentIntent.status === "succeeded" ? new Date() : null,
    metadata: JSON.stringify({
      session_id: session.id,
      quote_number: quote.quoteNumber,
      policy_number: policy.policyNumber,
    }),
  }

  const [payment] = await db.insert(payments).values(paymentData).returning()

  if (!payment) {
    throw new Error("Failed to create payment record")
  }

  console.log("[Webhook] Payment recorded:", payment.paymentNumber)

  // Update quote status to accepted
  await db
    .update(quotes)
    .set({
      status: "accepted",
      acceptedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(quotes.id, quoteId))

  console.log("[Webhook] Quote updated to accepted:", quote.quoteNumber)

  // TODO: Send policy confirmation email
  // TODO: Generate policy PDF document
  // TODO: Trigger policy activation workflow
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log("[Webhook] Processing payment_intent.payment_failed:", paymentIntent.id)

  const quoteId = paymentIntent.metadata?.quote_id

  if (!quoteId) {
    console.warn("[Webhook] No quote_id in payment metadata")
    return
  }

  // Record failed payment if policy/payment exists
  const [existingPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
    .limit(1)

  if (existingPayment) {
    await db
      .update(payments)
      .set({
        status: "failed",
        failureCode: paymentIntent.last_payment_error?.code || null,
        failureMessage: paymentIntent.last_payment_error?.message || null,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, existingPayment.id))
  }

  console.log("[Webhook] Payment failure recorded")
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  console.log("[Webhook] Processing charge.refunded:", charge.id)

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.stripeChargeId, charge.id))
    .limit(1)

  if (!payment) {
    console.warn("[Webhook] No payment found for charge:", charge.id)
    return
  }

  const refundAmount = charge.amount_refunded / 100 // Convert from cents

  await db
    .update(payments)
    .set({
      status: charge.refunded ? "refunded" : "partially_refunded",
      refundAmount: refundAmount.toString(),
      refundedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(payments.id, payment.id))

  // Update policy status if fully refunded
  if (charge.refunded) {
    await db
      .update(policies)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: "Payment refunded",
        updatedAt: new Date(),
      })
      .where(eq(policies.id, payment.policyId))
  }

  console.log("[Webhook] Refund processed:", payment.paymentNumber)
}

/**
 * Main webhook event handler
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  // Check if event already processed (idempotency)
  const alreadyProcessed = await isEventProcessed(event.id)
  if (alreadyProcessed) {
    console.log("[Webhook] Event already processed:", event.id)
    return
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.payment_status === "paid") {
          await handleCheckoutSessionCompleted(session)
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        await handleChargeRefunded(charge)
        break
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type)
    }

    // Record successful processing
    await recordWebhookEvent(event, true)
  } catch (error) {
    console.error("[Webhook] Error processing event:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Record failed processing
    await recordWebhookEvent(event, false, errorMessage)

    throw error
  }
}
