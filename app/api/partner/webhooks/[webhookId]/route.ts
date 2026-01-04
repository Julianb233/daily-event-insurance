import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { generateWebhookSecret, WebhookEventType } from "@/lib/webhooks/outbound"
import postgres from "postgres"

// Valid webhook event types
const VALID_EVENTS: WebhookEventType[] = [
  "policy.created",
  "policy.updated",
  "policy.cancelled",
  "commission.earned",
  "commission.paid",
  "claim.filed",
  "claim.updated",
]

interface WebhookRow {
  id: string
  partner_id: string
  location_id: string | null
  url: string
  secret: string
  events: string
  is_active: boolean
  headers: string | null
  last_triggered_at: Date | null
  last_success_at: Date | null
  last_failure_at: Date | null
  failure_count: number
  created_at: Date
  updated_at: Date
}

function formatWebhook(row: WebhookRow, includeSecret = false) {
  return {
    id: row.id,
    partnerId: row.partner_id,
    locationId: row.location_id,
    url: row.url,
    ...(includeSecret ? { secret: row.secret } : { hasSecret: !!row.secret }),
    events: JSON.parse(row.events || "[]"),
    isActive: row.is_active,
    headers: row.headers ? JSON.parse(row.headers) : null,
    lastTriggeredAt: row.last_triggered_at,
    lastSuccessAt: row.last_success_at,
    lastFailureAt: row.last_failure_at,
    failureCount: row.failure_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * GET /api/partner/webhooks/[webhookId]
 * Get a specific webhook subscription with delivery logs
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { webhookId } = await params

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    const connectionString = process.env.DATABASE_URL!
    const sql = postgres(connectionString, { ssl: "require" })

    try {
      // Get webhook (verify it belongs to this partner)
      const [webhook] = await sql<WebhookRow[]>`
        SELECT
          id, partner_id, location_id, url, secret, events, is_active,
          headers, last_triggered_at, last_success_at, last_failure_at,
          failure_count, created_at, updated_at
        FROM webhook_subscriptions
        WHERE id = ${webhookId} AND partner_id = ${partner.id}
        LIMIT 1
      `

      if (!webhook) {
        await sql.end()
        return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
      }

      // Get recent delivery logs
      const deliveryLogs = await sql`
        SELECT
          id, event_type, status_code, success, response_time_ms,
          error_message, delivered_at, created_at
        FROM webhook_delivery_logs
        WHERE subscription_id = ${webhookId}
        ORDER BY created_at DESC
        LIMIT 20
      `

      await sql.end()

      return NextResponse.json({
        webhook: formatWebhook(webhook),
        deliveryLogs: deliveryLogs.map((log) => ({
          id: log.id,
          eventType: log.event_type,
          statusCode: log.status_code,
          success: log.success,
          responseTimeMs: log.response_time_ms,
          errorMessage: log.error_message,
          deliveredAt: log.delivered_at,
          createdAt: log.created_at,
        })),
      })
    } catch (error: any) {
      await sql.end()
      console.error("[Webhooks API] Error fetching webhook:", error)
      return NextResponse.json(
        { error: "Database error", message: error.message },
        { status: 500 }
      )
    }
  })
}

/**
 * PATCH /api/partner/webhooks/[webhookId]
 * Update a webhook subscription
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { webhookId } = await params
    const body = await request.json()

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    const connectionString = process.env.DATABASE_URL!
    const sql = postgres(connectionString, { ssl: "require" })

    try {
      // Verify webhook belongs to this partner
      const [existingWebhook] = await sql<WebhookRow[]>`
        SELECT id, partner_id FROM webhook_subscriptions
        WHERE id = ${webhookId} AND partner_id = ${partner.id}
        LIMIT 1
      `

      if (!existingWebhook) {
        await sql.end()
        return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
      }

      // Build update fields
      const updates: string[] = []
      const values: any[] = []
      let paramIndex = 1

      // Update URL if provided
      if (body.url !== undefined) {
        try {
          new URL(body.url)
        } catch {
          await sql.end()
          return NextResponse.json(
            { error: "Validation error", message: "Invalid webhook URL format" },
            { status: 400 }
          )
        }

        if (!body.url.startsWith("https://") && process.env.NODE_ENV === "production") {
          await sql.end()
          return NextResponse.json(
            { error: "Validation error", message: "Webhook URL must use HTTPS" },
            { status: 400 }
          )
        }
      }

      // Update events if provided
      if (body.events !== undefined) {
        if (!Array.isArray(body.events) || body.events.length === 0) {
          await sql.end()
          return NextResponse.json(
            { error: "Validation error", message: "At least one event type is required" },
            { status: 400 }
          )
        }

        const invalidEvents = body.events.filter(
          (e: string) => !VALID_EVENTS.includes(e as WebhookEventType)
        )
        if (invalidEvents.length > 0) {
          await sql.end()
          return NextResponse.json(
            {
              error: "Validation error",
              message: `Invalid event types: ${invalidEvents.join(", ")}`,
              validEvents: VALID_EVENTS,
            },
            { status: 400 }
          )
        }
      }

      // Determine if we should reset failure count
      // Reset when URL or events are updated
      const shouldResetFailureCount = body.url !== undefined || body.events !== undefined

      // Build the update query dynamically
      let newSecret: string | null = null
      if (body.regenerateSecret) {
        newSecret = generateWebhookSecret()
      }

      const [updatedWebhook] = await sql<WebhookRow[]>`
        UPDATE webhook_subscriptions
        SET
          url = COALESCE(${body.url ?? null}, url),
          events = COALESCE(${body.events ? JSON.stringify(body.events) : null}, events),
          is_active = COALESCE(${body.isActive ?? null}, is_active),
          location_id = COALESCE(${body.locationId ?? null}, location_id),
          headers = COALESCE(${body.headers !== undefined ? JSON.stringify(body.headers) : null}, headers),
          secret = COALESCE(${newSecret}, secret),
          failure_count = CASE
            WHEN ${shouldResetFailureCount} THEN 0
            ELSE failure_count
          END,
          updated_at = NOW()
        WHERE id = ${webhookId} AND partner_id = ${partner.id}
        RETURNING
          id, partner_id, location_id, url, secret, events, is_active,
          headers, last_triggered_at, last_success_at, last_failure_at,
          failure_count, created_at, updated_at
      `

      await sql.end()

      const response: any = {
        webhook: formatWebhook(updatedWebhook),
        message: "Webhook updated successfully",
      }

      // Include new secret if regenerated
      if (newSecret) {
        response.webhook.secret = newSecret
        response.message = "Webhook updated with new secret. Save the secret - it won't be shown again!"
      }

      if (shouldResetFailureCount) {
        response.failureCountReset = true
      }

      return NextResponse.json(response)
    } catch (error: any) {
      await sql.end()
      console.error("[Webhooks API] Error updating webhook:", error)
      return NextResponse.json(
        { error: "Database error", message: error.message },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE /api/partner/webhooks/[webhookId]
 * Delete a webhook subscription
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { webhookId } = await params

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    const partner = partnerResult[0]

    const connectionString = process.env.DATABASE_URL!
    const sql = postgres(connectionString, { ssl: "require" })

    try {
      // Verify webhook belongs to this partner and delete
      const result = await sql`
        DELETE FROM webhook_subscriptions
        WHERE id = ${webhookId} AND partner_id = ${partner.id}
        RETURNING id
      `

      await sql.end()

      if (result.length === 0) {
        return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
      }

      return NextResponse.json({
        message: "Webhook subscription deleted successfully",
        deletedId: webhookId,
      })
    } catch (error: any) {
      await sql.end()
      console.error("[Webhooks API] Error deleting webhook:", error)
      return NextResponse.json(
        { error: "Database error", message: error.message },
        { status: 500 }
      )
    }
  })
}
