/**
 * Stripe Webhook API Route
 *
 * POST /api/stripe/webhook
 * Receives and processes Stripe webhook events
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature, handleWebhookEvent } from "@/lib/stripe/webhooks"

/**
 * POST /api/stripe/webhook
 *
 * Receives Stripe webhook events and processes them
 *
 * IMPORTANT: This route must be configured in your Stripe Dashboard
 * under Developers > Webhooks with the following events:
 * - checkout.session.completed
 * - payment_intent.payment_failed
 * - charge.refunded
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body as text for signature verification
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.error("[Stripe Webhook] Missing stripe-signature header")
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = verifyWebhookSignature(body, signature)
    } catch (error) {
      console.error("[Stripe Webhook] Signature verification failed:", error)
      return NextResponse.json(
        {
          error: "Webhook signature verification failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 401 }
      )
    }

    console.log("[Stripe Webhook] Received event:", event.type, event.id)

    // Handle the event
    try {
      await handleWebhookEvent(event)

      console.log("[Stripe Webhook] Event processed successfully:", event.id)

      return NextResponse.json(
        {
          received: true,
          eventId: event.id,
          eventType: event.type,
        },
        { status: 200 }
      )
    } catch (error) {
      console.error("[Stripe Webhook] Event processing failed:", error)

      // Return 200 to acknowledge receipt but log the error
      // This prevents Stripe from retrying events that will always fail
      return NextResponse.json(
        {
          received: true,
          eventId: event.id,
          eventType: event.type,
          error: "Processing failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("[Stripe Webhook] Unexpected error:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * Disable body parsing for webhook routes
 * Next.js needs the raw body for signature verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
}
