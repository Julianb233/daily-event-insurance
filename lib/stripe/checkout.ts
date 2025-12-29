/**
 * Stripe Checkout Session Management
 *
 * Handles creation and management of Stripe Checkout sessions
 * for policy purchases.
 */

import Stripe from "stripe"
import { stripe, stripeConfig, retryStripeOperation } from "./client"
import type { Quote } from "@/lib/db/schema"

export interface CheckoutSessionInput {
  quote: Quote
  customerEmail?: string
  customerName?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export interface CheckoutSessionResult {
  sessionId: string
  url: string
}

/**
 * Create a Stripe Checkout session for a quote
 *
 * @param input - Session configuration
 * @returns Checkout session ID and redirect URL
 */
export async function createCheckoutSession(
  input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  const { quote, customerEmail, customerName, successUrl, cancelUrl, metadata } = input

  // Validate quote data
  if (!quote.id || !quote.quoteNumber) {
    throw new Error("Invalid quote: missing required fields")
  }

  if (!quote.premium || parseFloat(quote.premium.toString()) <= 0) {
    throw new Error("Invalid quote: premium must be greater than zero")
  }

  // Prepare line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: stripeConfig.currency,
        product_data: {
          name: `${quote.coverageType.charAt(0).toUpperCase() + quote.coverageType.slice(1)} Insurance`,
          description: [
            `Quote: ${quote.quoteNumber}`,
            `Event Type: ${quote.eventType}`,
            `Participants: ${quote.participants}`,
            `Event Date: ${new Date(quote.eventDate).toLocaleDateString()}`,
          ].join(" • "),
          metadata: {
            quote_id: quote.id,
            quote_number: quote.quoteNumber,
            coverage_type: quote.coverageType,
            event_type: quote.eventType,
          },
        },
        unit_amount: Math.round(parseFloat(quote.premium.toString()) * 100), // Convert to cents
      },
      quantity: 1,
    },
  ]

  // Prepare session metadata
  const sessionMetadata: Record<string, string> = {
    quote_id: quote.id,
    quote_number: quote.quoteNumber,
    partner_id: quote.partnerId,
    coverage_type: quote.coverageType,
    event_type: quote.eventType,
    participants: quote.participants.toString(),
    event_date: new Date(quote.eventDate).toISOString(),
    ...metadata,
  }

  // Create Checkout session
  const session = await retryStripeOperation(async () => {
    return await stripe.checkout.sessions.create({
      mode: stripeConfig.checkoutMode,
      payment_method_types: stripeConfig.paymentMethodTypes,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || quote.customerEmail || undefined,
      metadata: sessionMetadata,

      // Enable customer to enter email if not provided
      ...((!customerEmail && !quote.customerEmail) && {
        customer_creation: "always" as const,
      }),

      // Billing and shipping address collection
      billing_address_collection: "auto",

      // Payment intent data for additional metadata
      payment_intent_data: {
        metadata: sessionMetadata,
        description: `Insurance Policy: ${quote.quoteNumber}`,
        ...(customerEmail || quote.customerEmail
          ? { receipt_email: customerEmail || quote.customerEmail || undefined }
          : {}),
      },

      // Checkout session expiration (30 minutes)
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,

      // Allow promotion codes
      allow_promotion_codes: true,

      // Automatic tax calculation (if enabled in Stripe)
      automatic_tax: {
        enabled: false, // Set to true if you have Stripe Tax enabled
      },

      // Consent collection for terms of service
      consent_collection: {
        terms_of_service: "required",
      },

      // Custom text
      custom_text: {
        submit: {
          message: "By completing this purchase, you agree to our Terms of Service and Privacy Policy.",
        },
      },
    })
  })

  if (!session.id || !session.url) {
    throw new Error("Failed to create checkout session")
  }

  return {
    sessionId: session.id,
    url: session.url,
  }
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return await retryStripeOperation(async () => {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "customer"],
    })
  })
}

/**
 * Retrieve payment details from a completed session
 */
export async function getSessionPaymentDetails(sessionId: string) {
  const session = await getCheckoutSession(sessionId)

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed")
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id

  if (!paymentIntentId) {
    throw new Error("No payment intent found")
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  })

  const charge =
    typeof paymentIntent.latest_charge === "string"
      ? await stripe.charges.retrieve(paymentIntent.latest_charge)
      : paymentIntent.latest_charge

  return {
    session,
    paymentIntent,
    charge,
    amount: paymentIntent.amount / 100, // Convert from cents
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    receiptUrl: charge?.receipt_url || null,
    paymentMethodDetails: charge?.payment_method_details || null,
    customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
    customerEmail: session.customer_email || null,
  }
}

/**
 * List all checkout sessions for a customer email
 */
export async function listCustomerSessions(
  customerEmail: string,
  limit = 10
): Promise<Stripe.Checkout.Session[]> {
  const sessions = await stripe.checkout.sessions.list({
    limit,
    customer_details: {
      email: customerEmail,
    },
  })

  return sessions.data
}

/**
 * Expire a checkout session (cancel it before completion)
 */
export async function expireCheckoutSession(sessionId: string): Promise<void> {
  await stripe.checkout.sessions.expire(sessionId)
}

/**
 * Validate checkout session metadata
 */
export function validateSessionMetadata(
  metadata: Stripe.Metadata | null | undefined
): {
  valid: boolean
  quoteId?: string
  partnerId?: string
  errors: string[]
} {
  const errors: string[] = []

  if (!metadata) {
    errors.push("Session metadata is missing")
    return { valid: false, errors }
  }

  if (!metadata.quote_id) {
    errors.push("quote_id is missing from session metadata")
  }

  if (!metadata.partner_id) {
    errors.push("partner_id is missing from session metadata")
  }

  return {
    valid: errors.length === 0,
    quoteId: metadata.quote_id,
    partnerId: metadata.partner_id,
    errors,
  }
}
