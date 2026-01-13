/**
 * Stripe Checkout API Route
 *
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for a quote
 */

import { NextRequest, NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe/checkout"
import { db, quotes } from "@/lib/db"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { formatStripeError } from "@/lib/stripe/client"

/**
 * Request body schema
 */
const checkoutRequestSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID format"),
  customerEmail: z.string().email("Invalid email address").optional(),
  customerName: z.string().min(1).optional(),
})

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout session for purchasing a policy
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = checkoutRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { quoteId, customerEmail, customerName } = validationResult.data

    // Retrieve quote from database
    const [quote] = await db!.select().from(quotes).where(eq(quotes.id, quoteId)).limit(1)

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      )
    }

    // Validate quote status
    if (quote.status !== "pending") {
      return NextResponse.json(
        {
          error: "Quote is not available for purchase",
          details: { status: quote.status },
        },
        { status: 400 }
      )
    }

    // Check if quote has expired
    if (quote.expiresAt && new Date(quote.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Quote has expired" },
        { status: 400 }
      )
    }

    // Get base URL for redirect URLs
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin

    // Create checkout session
    const session = await createCheckoutSession({
      quote,
      customerEmail: customerEmail || quote.customerEmail || undefined,
      customerName: customerName || quote.customerName || undefined,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/checkout/cancel?quote_id=${quoteId}`,
      metadata: {
        created_from: "api",
        quote_number: quote.quoteNumber,
      },
    })

    // Return session details
    return NextResponse.json(
      {
        sessionId: session.sessionId,
        url: session.url,
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          premium: quote.premium,
          coverageType: quote.coverageType,
          eventType: quote.eventType,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Stripe Checkout] Error creating session:", error)

    const errorMessage = formatStripeError(error)

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/stripe/checkout?session_id=xxx
 *
 * Retrieves checkout session details (for verification)
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id parameter is required" },
        { status: 400 }
      )
    }

    const { getCheckoutSession } = await import("@/lib/stripe/checkout")
    const session = await getCheckoutSession(sessionId)

    return NextResponse.json(
      {
        session: {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          customer_email: session.customer_email,
          amount_total: session.amount_total ? session.amount_total / 100 : null,
          metadata: session.metadata,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Stripe Checkout] Error retrieving session:", error)

    const errorMessage = formatStripeError(error)

    return NextResponse.json(
      {
        error: "Failed to retrieve checkout session",
        message: errorMessage,
      },
      { status: 500 }
    )
  }
}
