import { NextRequest } from "next/server"
import { db, isDbConfigured, policies, partners } from "@/lib/db"
import { eq } from "drizzle-orm"

import {
  successResponse,
  serverError,
  validationError,
  unauthorizedError,
} from "@/lib/api-responses"
import crypto from "crypto"

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "dev-webhook-secret"

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex")

  return crypto.timingSafeEqual(
    new Uint8Array(Buffer.from(signature)),
    new Uint8Array(Buffer.from(expectedSignature))
  )
}

/**
 * POST /api/webhooks/policy-updates
 * Receive policy update webhooks from external systems
 *
 * Headers:
 * - x-webhook-signature: HMAC-SHA256 signature of the payload
 *
 * Body:
 * - event_type: "policy.created" | "policy.updated" | "policy.cancelled" | "claim.filed"
 * - policy_id: string
 * - data: object (event-specific data)
 * - timestamp: ISO date string
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-webhook-signature")
    const payload = await request.text()

    // Verify signature
    if (!signature) {
      return unauthorizedError("Missing webhook signature")
    }

    if (!verifySignature(payload, signature)) {
      console.error("[Webhook] Invalid signature")
      return unauthorizedError("Invalid webhook signature")
    }

    const body = JSON.parse(payload)
    const { event_type, policy_id, data, timestamp } = body

    // Validate required fields
    if (!event_type) {
      return validationError("Missing event_type", {
        event_type: ["Event type is required"]
      })
    }

    if (!policy_id) {
      return validationError("Missing policy_id", {
        policy_id: ["Policy ID is required"]
      })
    }

    // Log webhook receipt
    console.log(`[Webhook] Received ${event_type} for policy ${policy_id}`)



    // Handle different event types
    switch (event_type) {
      case "policy.created":
        await handlePolicyCreated(policy_id, data)
        break

      case "policy.updated":
        await handlePolicyUpdated(policy_id, data)
        break

      case "policy.cancelled":
        await handlePolicyCancelled(policy_id, data)
        break

      case "claim.filed":
        await handleClaimFiled(policy_id, data)
        break

      default:
        console.warn(`[Webhook] Unknown event type: ${event_type}`)
    }

    return successResponse({
      received: true,
      event_type,
      policy_id,
      processed_at: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[Webhook] Error:", error)
    return serverError(error.message || "Webhook processing failed")
  }
}

/**
 * Handle policy created event
 */
async function handlePolicyCreated(policyId: string, data: any) {
  console.log(`[Webhook] Policy created: ${policyId}`, data)
  // Additional processing like sending confirmation emails, updating analytics, etc.
}

/**
 * Handle policy updated event
 */
async function handlePolicyUpdated(policyId: string, data: any) {
  console.log(`[Webhook] Policy updated: ${policyId}`, data)

  // Update policy in database if needed
  if (data.status) {
    await db!
      .update(policies)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(policies.id, policyId))
  }
}

/**
 * Handle policy cancelled event
 */
async function handlePolicyCancelled(policyId: string, data: any) {
  console.log(`[Webhook] Policy cancelled: ${policyId}`, data)

  await db!
    .update(policies)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: data.reason || "External cancellation",
      updatedAt: new Date(),
    })
    .where(eq(policies.id, policyId))
}

/**
 * Handle claim filed event
 */
async function handleClaimFiled(policyId: string, data: any) {
  console.log(`[Webhook] Claim filed for policy: ${policyId}`, data)

  // Update policy metadata with claim information
  const policyResult = await db!
    .select()
    .from(policies)
    .where(eq(policies.id, policyId))
    .limit(1)

  if (policyResult.length > 0) {
    const policy = policyResult[0]
    const existingMetadata = policy.metadata ? JSON.parse(policy.metadata) : {}

    const updatedMetadata = {
      ...existingMetadata,
      claim: {
        filed_at: new Date().toISOString(),
        claim_id: data.claim_id,
        status: "pending",
        ...data,
      },
    }

    await db!
      .update(policies)
      .set({
        metadata: JSON.stringify(updatedMetadata),
        updatedAt: new Date(),
      })
      .where(eq(policies.id, policyId))
  }
}

/**
 * GET /api/webhooks/policy-updates
 * Health check endpoint
 */
export async function GET() {
  return successResponse({
    status: "healthy",
    endpoint: "/api/webhooks/policy-updates",
    supported_events: [
      "policy.created",
      "policy.updated",
      "policy.cancelled",
      "claim.filed",
    ],
  })
}
