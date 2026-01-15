/**
 * Webhook Signature Verification Utilities
 * Generic signature verification for POS webhooks
 */

import crypto from 'crypto'

/**
 * Helper function for timing-safe comparison of hex strings
 * Handles Buffer to Uint8Array conversion for Node.js compatibility
 */
function timingSafeCompare(a: string, b: string, encoding: BufferEncoding = 'hex'): boolean {
  const bufA = Buffer.from(a, encoding)
  const bufB = Buffer.from(b, encoding)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(
    new Uint8Array(bufA.buffer, bufA.byteOffset, bufA.byteLength),
    new Uint8Array(bufB.buffer, bufB.byteOffset, bufB.byteLength)
  )
}

export interface WebhookVerificationResult {
  valid: boolean
  error?: string
  timestamp?: number
}

export interface WebhookVerifierConfig {
  secret: string
  tolerance?: number // Timestamp tolerance in seconds (default: 300)
}

/**
 * Generic Webhook Verifier Class
 */
export class WebhookVerifier {
  private secret: string
  private tolerance: number

  constructor(config: WebhookVerifierConfig) {
    this.secret = config.secret
    this.tolerance = config.tolerance ?? 300 // 5 minutes default
  }

  /**
   * Verify webhook signature with timestamp validation
   */
  verify(
    payload: string,
    signature: string,
    timestamp?: string | number
  ): WebhookVerificationResult {
    try {
      // Validate timestamp if provided
      if (timestamp) {
        const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
        const now = Math.floor(Date.now() / 1000)

        if (Math.abs(now - ts) > this.tolerance) {
          return {
            valid: false,
            error: 'Webhook timestamp outside tolerance window',
            timestamp: ts,
          }
        }
      }

      // Calculate expected signature
      const signedPayload = timestamp ? `${timestamp}.${payload}` : payload
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(signedPayload)
        .digest('hex')

      // Timing-safe comparison
      const valid = timingSafeCompare(signature, expectedSignature)

      return {
        valid,
        timestamp: timestamp ? (typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp) : undefined,
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Signature verification failed',
      }
    }
  }
}

/**
 * Verify Mindbody webhook signature
 * Mindbody uses HMAC-SHA256 with the webhook secret
 */
export function verifyMindbodyWebhook(
  payload: string,
  secret: string,
  signature: string
): WebhookVerificationResult {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const valid = timingSafeCompare(signature.toLowerCase(), expectedSignature)

    return { valid }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed',
    }
  }
}

/**
 * Verify Pike13 webhook signature
 * Pike13 uses HMAC-SHA256 with timestamp
 */
export function verifyPike13Webhook(
  payload: string,
  secret: string,
  signature: string,
  timestamp?: string
): WebhookVerificationResult {
  try {
    const signedPayload = timestamp ? `${timestamp}.${payload}` : payload
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    // Handle different signature formats
    const sigToCompare = signature.startsWith('sha256=')
      ? signature.slice(7)
      : signature

    const valid = timingSafeCompare(sigToCompare.toLowerCase(), expectedSignature)

    return {
      valid,
      timestamp: timestamp ? parseInt(timestamp, 10) : undefined,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed',
    }
  }
}

/**
 * Verify Square webhook signature
 * Square uses HMAC-SHA256 with signature key and notification URL
 */
export function verifySquareWebhook(
  payload: string,
  signatureKey: string,
  signature: string,
  notificationUrl: string
): WebhookVerificationResult {
  try {
    // Square includes the notification URL in the signature
    const signedPayload = notificationUrl + payload
    const expectedSignature = crypto
      .createHmac('sha256', signatureKey)
      .update(signedPayload)
      .digest('base64')

    // Square uses base64 encoding and prefixes with 'sha256='
    const sigToCompare = signature.startsWith('sha256=')
      ? signature.slice(7)
      : signature

    const valid = expectedSignature === sigToCompare

    return { valid }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed',
    }
  }
}

/**
 * Verify Daily Event Insurance webhook signature
 * Uses format: t={timestamp},v1={signature}
 */
export function verifyDailyEventWebhook(
  payload: string,
  secret: string,
  signatureHeader: string
): WebhookVerificationResult {
  try {
    // Parse signature header
    const parts = signatureHeader.split(',')
    const timestampPart = parts.find(p => p.startsWith('t='))
    const signaturePart = parts.find(p => p.startsWith('v1='))

    if (!timestampPart || !signaturePart) {
      return {
        valid: false,
        error: 'Invalid signature header format',
      }
    }

    const timestamp = timestampPart.slice(2)
    const signature = signaturePart.slice(3)

    // Check timestamp tolerance (5 minutes)
    const now = Math.floor(Date.now() / 1000)
    const ts = parseInt(timestamp, 10)

    if (Math.abs(now - ts) > 300) {
      return {
        valid: false,
        error: 'Webhook timestamp outside tolerance window',
        timestamp: ts,
      }
    }

    // Calculate expected signature
    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    const sigBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    const valid = crypto.timingSafeEqual(
      new Uint8Array(sigBuffer.buffer, sigBuffer.byteOffset, sigBuffer.byteLength),
      new Uint8Array(expectedBuffer.buffer, expectedBuffer.byteOffset, expectedBuffer.byteLength)
    )

    return { valid, timestamp: ts }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed',
    }
  }
}
