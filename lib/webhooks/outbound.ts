/**
 * Outbound Webhook System
 * Sends webhook notifications to partners when events occur (policies, commissions, etc.)
 */

import crypto from 'crypto'
import { db, isDbConfigured } from '@/lib/db'
import postgres from 'postgres'

// Event types that can trigger webhooks
export type WebhookEventType =
  | 'policy.created'
  | 'policy.updated'
  | 'policy.cancelled'
  | 'commission.earned'
  | 'commission.paid'
  | 'claim.filed'
  | 'claim.updated'

export interface WebhookPayload {
  event: WebhookEventType
  timestamp: string
  data: Record<string, any>
  location_id?: string
  partner_id: string
}

export interface WebhookSubscription {
  id: string
  partnerId: string
  locationId?: string | null
  url: string
  secret: string
  events: string // JSON array
  isActive: boolean
  headers?: string | null // JSON object
}

/**
 * Generate signature for webhook payload
 */
export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

/**
 * Send webhook to a specific URL
 */
async function sendWebhook(
  subscription: WebhookSubscription,
  payload: WebhookPayload,
  sql: postgres.Sql
): Promise<{ success: boolean; statusCode?: number; error?: string; responseTime: number }> {
  const startTime = Date.now()
  const payloadString = JSON.stringify(payload)
  const signature = generateSignature(payloadString, subscription.secret)

  // Parse custom headers if provided
  let customHeaders: Record<string, string> = {}
  if (subscription.headers) {
    try {
      customHeaders = JSON.parse(subscription.headers)
    } catch (e) {
      console.error('[Webhook] Invalid custom headers JSON')
    }
  }

  try {
    const response = await fetch(subscription.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': payload.event,
        'X-Webhook-Timestamp': payload.timestamp,
        ...customHeaders,
      },
      body: payloadString,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    const responseTime = Date.now() - startTime
    const responseBody = await response.text().catch(() => '')

    // Log the delivery
    await sql`
      INSERT INTO webhook_delivery_logs (
        subscription_id, event_type, payload, status_code, response_body,
        response_time_ms, success, delivered_at
      ) VALUES (
        ${subscription.id}, ${payload.event}, ${payloadString},
        ${response.status}, ${responseBody.slice(0, 1000)},
        ${responseTime}, ${response.ok}, NOW()
      )
    `

    if (response.ok) {
      // Update subscription success timestamp
      await sql`
        UPDATE webhook_subscriptions
        SET last_triggered_at = NOW(), last_success_at = NOW(), failure_count = 0, updated_at = NOW()
        WHERE id = ${subscription.id}
      `
    } else {
      // Update failure count
      await sql`
        UPDATE webhook_subscriptions
        SET last_triggered_at = NOW(), last_failure_at = NOW(), failure_count = failure_count + 1, updated_at = NOW()
        WHERE id = ${subscription.id}
      `
    }

    return {
      success: response.ok,
      statusCode: response.status,
      responseTime,
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime

    // Log the failed delivery
    await sql`
      INSERT INTO webhook_delivery_logs (
        subscription_id, event_type, payload, response_time_ms, success, error_message
      ) VALUES (
        ${subscription.id}, ${payload.event}, ${payloadString},
        ${responseTime}, false, ${error.message}
      )
    `

    // Update failure count
    await sql`
      UPDATE webhook_subscriptions
      SET last_triggered_at = NOW(), last_failure_at = NOW(), failure_count = failure_count + 1, updated_at = NOW()
      WHERE id = ${subscription.id}
    `

    return {
      success: false,
      error: error.message,
      responseTime,
    }
  }
}

/**
 * Trigger webhooks for a specific event
 */
export async function triggerWebhooks(
  partnerId: string,
  event: WebhookEventType,
  data: Record<string, any>,
  locationId?: string
): Promise<{ sent: number; failed: number }> {
  if (!isDbConfigured()) {
    console.log('[Webhook] Database not configured, skipping webhook delivery')
    return { sent: 0, failed: 0 }
  }

  const connectionString = process.env.DATABASE_URL!
  const sql = postgres(connectionString, { ssl: 'require' })

  try {
    // Find active subscriptions for this partner that subscribe to this event
    const subscriptions = await sql<WebhookSubscription[]>`
      SELECT id, partner_id as "partnerId", location_id as "locationId", url, secret, events, is_active as "isActive", headers
      FROM webhook_subscriptions
      WHERE partner_id = ${partnerId}
        AND is_active = true
        AND (location_id IS NULL OR location_id = ${locationId || null})
        AND events::jsonb ? ${event}
        AND failure_count < 10
    `

    if (subscriptions.length === 0) {
      await sql.end()
      return { sent: 0, failed: 0 }
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      partner_id: partnerId,
      location_id: locationId,
      data,
    }

    // Send webhooks in parallel
    const results = await Promise.all(
      subscriptions.map((sub) => sendWebhook(sub, payload, sql))
    )

    await sql.end()

    const sent = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    console.log(`[Webhook] Triggered ${event}: ${sent} sent, ${failed} failed`)

    return { sent, failed }
  } catch (error) {
    console.error('[Webhook] Error triggering webhooks:', error)
    await sql.end()
    return { sent: 0, failed: 0 }
  }
}

/**
 * Generate API key for a location
 */
export function generateApiKey(): { apiKey: string; apiSecret: string; apiSecretHash: string } {
  const apiKey = `dei_${crypto.randomBytes(16).toString('hex')}`
  const apiSecret = crypto.randomBytes(32).toString('hex')
  const apiSecretHash = crypto.createHash('sha256').update(apiSecret).digest('hex')

  return { apiKey, apiSecret, apiSecretHash }
}

/**
 * Generate webhook secret
 */
export function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(24).toString('hex')}`
}

/**
 * Generate embed code for a location
 */
export function generateEmbedCode(
  locationSubdomain: string,
  primaryColor: string = '#14B8A6'
): string {
  return `<!-- Daily Event Insurance Widget -->
<script>
  (function(d,e,i){
    var s=d.createElement('script');
    s.src='https://widget.dailyeventinsurance.com/embed.js';
    s.async=true;
    s.onload=function(){
      DEI.init({
        location:'${locationSubdomain}',
        color:'${primaryColor}',
        container:'dei-widget'
      });
    };
    d.head.appendChild(s);
  })(document);
</script>
<div id="dei-widget"></div>
<!-- End Daily Event Insurance Widget -->`
}
