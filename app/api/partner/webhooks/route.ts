import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { generateWebhookSecret, WebhookEventType } from "@/lib/webhooks/outbound"
import { webhookRateLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit"
import postgres from "postgres"

// SSRF Protection: Block private/internal IP ranges
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']
const PRIVATE_IP_PATTERNS = [
  /^10\./,                          // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
  /^192\.168\./,                    // 192.168.0.0/16
  /^169\.254\./,                    // Link-local
  /^127\./,                         // Loopback
  /^0\./,                           // Current network
]

function isPrivateOrLocalhost(hostname: string): boolean {
  const lowerHostname = hostname.toLowerCase()
  if (BLOCKED_HOSTS.includes(lowerHostname)) return true
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) return true
  }
  if (lowerHostname.endsWith('.local') || lowerHostname.endsWith('.internal')) return true
  return false
}

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

// Mock webhooks for dev mode
const MOCK_WEBHOOKS = [
  {
    id: "webhook-1",
    partnerId: "partner-1",
    locationId: null,
    url: "https://api.example.com/webhooks/dei",
    secret: "whsec_mock_secret_1234567890",
    events: JSON.stringify(["policy.created", "policy.cancelled"]),
    isActive: true,
    headers: null,
    lastTriggeredAt: new Date(Date.now() - 86400000).toISOString(),
    lastSuccessAt: new Date(Date.now() - 86400000).toISOString(),
    lastFailureAt: null,
    failureCount: 0,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "webhook-2",
    partnerId: "partner-1",
    locationId: "loc-1",
    url: "https://api.example.com/webhooks/location-1",
    secret: "whsec_mock_secret_0987654321",
    events: JSON.stringify(["commission.earned", "commission.paid"]),
    isActive: true,
    headers: JSON.stringify({ "X-Custom-Header": "value" }),
    lastTriggeredAt: null,
    lastSuccessAt: null,
    lastFailureAt: null,
    failureCount: 0,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
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

function formatWebhook(row: WebhookRow) {
  // Safe JSON parsing with error handling
  let events: string[] = []
  let headers: Record<string, string> | null = null

  try {
    events = JSON.parse(row.events || "[]")
  } catch (e) {
    console.error(`[Webhook ${row.id}] Invalid events JSON:`, e)
    events = []
  }

  if (row.headers) {
    try {
      headers = JSON.parse(row.headers)
    } catch (e) {
      console.error(`[Webhook ${row.id}] Invalid headers JSON:`, e)
      headers = null
    }
  }

  return {
    id: row.id,
    partnerId: row.partner_id,
    locationId: row.location_id,
    url: row.url,
    // Don't expose the full secret, just show it exists
    hasSecret: !!row.secret,
    events,
    isActive: row.is_active,
    headers,
    lastTriggeredAt: row.last_triggered_at,
    lastSuccessAt: row.last_success_at,
    lastFailureAt: row.last_failure_at,
    failureCount: row.failure_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * GET /api/partner/webhooks
 * List all webhook subscriptions for the authenticated partner
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Dev mode - return mock data
    if (isDevMode || !isDbConfigured()) {
      console.log("[DEV MODE] Returning mock webhooks data")
      return NextResponse.json({
        webhooks: MOCK_WEBHOOKS.map((w) => ({
          ...w,
          events: JSON.parse(w.events),
          headers: w.headers ? JSON.parse(w.headers) : null,
          hasSecret: true,
        })),
        total: MOCK_WEBHOOKS.length,
      })
    }

    // Get partner
    const partnerResult = await db!
      .select()
      .from(partners)
      .where(eq(partners.userId, userId))
      .limit(1)

    if (partnerResult.length === 0) {
      return NextResponse.json(
        { error: "Partner not found", message: "Partner profile not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]

    // Query webhook_subscriptions table using raw SQL
    const connectionString = process.env.DATABASE_URL!
    const sql = postgres(connectionString, { ssl: "require" })

    try {
      const webhooks = await sql<WebhookRow[]>`
        SELECT
          id, partner_id, location_id, url, secret, events, is_active,
          headers, last_triggered_at, last_success_at, last_failure_at,
          failure_count, created_at, updated_at
        FROM webhook_subscriptions
        WHERE partner_id = ${partner.id}
        ORDER BY created_at DESC
      `

      await sql.end()

      return NextResponse.json({
        webhooks: webhooks.map(formatWebhook),
        total: webhooks.length,
      })
    } catch (error: any) {
      await sql.end()
      console.error("[Webhooks API] Error fetching webhooks:", error)
      // SECURITY: Don't expose internal error details
      return NextResponse.json(
        { error: "Database error", message: "Failed to fetch webhooks" },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/partner/webhooks
 * Create a new webhook subscription
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    // Rate limiting
    const clientIP = getClientIP(request)
    const { success: withinLimit } = await webhookRateLimiter.check(`webhook-${userId}`)
    if (!withinLimit) {
      return rateLimitResponse(60 * 60 * 1000) // 1 hour
    }

    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Configuration error", message: "Database not configured" },
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
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      )
    }

    const partner = partnerResult[0]
    const body = await request.json()

    // Validate required fields
    if (!body.url) {
      return NextResponse.json(
        { error: "Validation error", message: "Webhook URL is required" },
        { status: 400 }
      )
    }

    // URL length limit
    if (body.url.length > 2048) {
      return NextResponse.json(
        { error: "Validation error", message: "Webhook URL too long (max 2048 characters)" },
        { status: 400 }
      )
    }

    // Validate URL format
    let webhookUrl: URL
    try {
      webhookUrl = new URL(body.url)
    } catch {
      return NextResponse.json(
        { error: "Validation error", message: "Invalid webhook URL format" },
        { status: 400 }
      )
    }

    // SECURITY: SSRF Protection - block private/internal addresses
    if (isPrivateOrLocalhost(webhookUrl.hostname)) {
      console.warn(`[SECURITY] Webhook SSRF attempt blocked: ${webhookUrl.hostname}`)
      return NextResponse.json(
        { error: "Validation error", message: "Webhook URL cannot point to private or internal addresses" },
        { status: 400 }
      )
    }

    // Require HTTPS in production
    if (!body.url.startsWith("https://") && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Validation error", message: "Webhook URL must use HTTPS" },
        { status: 400 }
      )
    }

    // Validate events array
    const events = body.events || []
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "Validation error", message: "At least one event type is required" },
        { status: 400 }
      )
    }

    const invalidEvents = events.filter((e: string) => !VALID_EVENTS.includes(e as WebhookEventType))
    if (invalidEvents.length > 0) {
      // SECURITY: Don't expose valid event types in production
      const isProduction = process.env.NODE_ENV === "production"
      return NextResponse.json(
        {
          error: "Validation error",
          message: isProduction
            ? "Invalid event types provided"
            : `Invalid event types: ${invalidEvents.join(", ")}`,
          ...(isProduction ? {} : { validEvents: VALID_EVENTS }),
        },
        { status: 400 }
      )
    }

    // Validate headers if provided
    if (body.headers && typeof body.headers !== "object") {
      return NextResponse.json(
        { error: "Validation error", message: "Headers must be an object" },
        { status: 400 }
      )
    }

    // Generate webhook secret
    const secret = generateWebhookSecret()

    const connectionString = process.env.DATABASE_URL!
    const sql = postgres(connectionString, { ssl: "require" })

    try {
      const [newWebhook] = await sql<WebhookRow[]>`
        INSERT INTO webhook_subscriptions (
          partner_id, location_id, url, secret, events, is_active, headers
        ) VALUES (
          ${partner.id},
          ${body.locationId || null},
          ${body.url},
          ${secret},
          ${JSON.stringify(events)},
          ${body.isActive !== false},
          ${body.headers ? JSON.stringify(body.headers) : null}
        )
        RETURNING
          id, partner_id, location_id, url, secret, events, is_active,
          headers, last_triggered_at, last_success_at, last_failure_at,
          failure_count, created_at, updated_at
      `

      await sql.end()

      return NextResponse.json({
        webhook: {
          ...formatWebhook(newWebhook),
          // Return the secret ONCE during creation - won't be shown again
          secret: secret,
        },
        message: "Webhook subscription created. Save the secret - it won't be shown again!",
      })
    } catch (error: any) {
      await sql.end()
      console.error("[Webhooks API] Error creating webhook:", error)
      // SECURITY: Don't expose internal error details
      return NextResponse.json(
        { error: "Database error", message: "Failed to create webhook" },
        { status: 500 }
      )
    }
  })
}
