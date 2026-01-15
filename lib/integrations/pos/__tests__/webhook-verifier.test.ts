import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import crypto from 'crypto'
import {
  WebhookVerifier,
  verifyMindbodyWebhook,
  verifyPike13Webhook,
  verifySquareWebhook,
  verifyDailyEventWebhook,
} from '../shared/webhook-verifier'

describe('WebhookVerifier', () => {
  const secret = 'test-webhook-secret'

  describe('constructor', () => {
    it('should create verifier with required config', () => {
      const verifier = new WebhookVerifier({ secret })
      expect(verifier).toBeDefined()
    })

    it('should create verifier with custom tolerance', () => {
      const verifier = new WebhookVerifier({
        secret,
        tolerance: 600,
      })
      expect(verifier).toBeDefined()
    })
  })

  describe('verify', () => {
    it('should verify valid HMAC signature without timestamp', () => {
      const verifier = new WebhookVerifier({ secret })
      const payload = JSON.stringify({ event: 'test' })
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')

      const result = verifier.verify(payload, signature)
      expect(result.valid).toBe(true)
    })

    it('should reject invalid signature', () => {
      const verifier = new WebhookVerifier({ secret })
      const payload = JSON.stringify({ event: 'test' })

      const result = verifier.verify(payload, 'invalid-signature')
      expect(result.valid).toBe(false)
    })

    it('should verify signature with valid timestamp', () => {
      const verifier = new WebhookVerifier({ secret })
      const payload = JSON.stringify({ event: 'test' })
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const signedPayload = `${timestamp}.${payload}`
      const signature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex')

      const result = verifier.verify(payload, signature, timestamp)
      expect(result.valid).toBe(true)
      expect(result.timestamp).toBe(parseInt(timestamp))
    })

    it('should reject expired timestamp', () => {
      const verifier = new WebhookVerifier({
        secret,
        tolerance: 300, // 5 minutes
      })
      const payload = JSON.stringify({ event: 'test' })
      const oldTimestamp = (Math.floor(Date.now() / 1000) - 600).toString() // 10 minutes ago

      const result = verifier.verify(payload, 'any-signature', oldTimestamp)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('tolerance')
    })
  })
})

describe('verifyMindbodyWebhook', () => {
  const secret = 'mindbody-secret'

  it('should verify valid Mindbody webhook', () => {
    const payload = JSON.stringify({ siteId: 123, eventType: 'class.booked' })
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const result = verifyMindbodyWebhook(payload, secret, signature)
    expect(result.valid).toBe(true)
  })

  it('should reject invalid Mindbody webhook', () => {
    const payload = JSON.stringify({ siteId: 123 })
    const result = verifyMindbodyWebhook(payload, secret, 'bad-signature')
    expect(result.valid).toBe(false)
  })

  it('should handle uppercase signatures', () => {
    const payload = JSON.stringify({ siteId: 123 })
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
      .toUpperCase()

    const result = verifyMindbodyWebhook(payload, secret, signature)
    expect(result.valid).toBe(true)
  })
})

describe('verifyPike13Webhook', () => {
  const secret = 'pike13-secret'

  it('should verify valid Pike13 webhook without timestamp', () => {
    const payload = JSON.stringify({ type: 'visit.completed' })
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const result = verifyPike13Webhook(payload, secret, signature)
    expect(result.valid).toBe(true)
  })

  it('should verify valid Pike13 webhook with timestamp', () => {
    const payload = JSON.stringify({ type: 'visit.completed' })
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signedPayload = `${timestamp}.${payload}`
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    const result = verifyPike13Webhook(payload, secret, signature, timestamp)
    expect(result.valid).toBe(true)
    expect(result.timestamp).toBe(parseInt(timestamp))
  })

  it('should handle sha256= prefix in signature', () => {
    const payload = JSON.stringify({ type: 'visit.completed' })
    const hash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    const signature = `sha256=${hash}`

    const result = verifyPike13Webhook(payload, secret, signature)
    expect(result.valid).toBe(true)
  })
})

describe('verifySquareWebhook', () => {
  const signatureKey = 'square-webhook-signature-key'

  it('should verify valid Square webhook', () => {
    const payload = JSON.stringify({ type: 'payment.completed' })
    const notificationUrl = 'https://api.example.com/webhooks/square'
    const signedPayload = notificationUrl + payload
    const signature = crypto
      .createHmac('sha256', signatureKey)
      .update(signedPayload)
      .digest('base64')

    const result = verifySquareWebhook(payload, signatureKey, signature, notificationUrl)
    expect(result.valid).toBe(true)
  })

  it('should reject webhook with wrong URL', () => {
    const payload = JSON.stringify({ type: 'payment.completed' })
    const correctUrl = 'https://api.example.com/webhooks/square'
    const wrongUrl = 'https://other.example.com/webhooks/square'
    const signedPayload = correctUrl + payload
    const signature = crypto
      .createHmac('sha256', signatureKey)
      .update(signedPayload)
      .digest('base64')

    const result = verifySquareWebhook(payload, signatureKey, signature, wrongUrl)
    expect(result.valid).toBe(false)
  })

  it('should handle sha256= prefix in signature', () => {
    const payload = JSON.stringify({ type: 'payment.completed' })
    const notificationUrl = 'https://api.example.com/webhooks/square'
    const signedPayload = notificationUrl + payload
    const hash = crypto
      .createHmac('sha256', signatureKey)
      .update(signedPayload)
      .digest('base64')
    const signature = `sha256=${hash}`

    const result = verifySquareWebhook(payload, signatureKey, signature, notificationUrl)
    expect(result.valid).toBe(true)
  })
})

describe('verifyDailyEventWebhook', () => {
  const secret = 'daily-event-secret'

  it('should verify valid Daily Event webhook', () => {
    const payload = JSON.stringify({ event: 'policy.created' })
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signedPayload = `${timestamp}.${payload}`
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')
    const signatureHeader = `t=${timestamp},v1=${signature}`

    const result = verifyDailyEventWebhook(payload, secret, signatureHeader)
    expect(result.valid).toBe(true)
    expect(result.timestamp).toBe(parseInt(timestamp))
  })

  it('should reject invalid signature header format', () => {
    const payload = JSON.stringify({ event: 'policy.created' })

    const result = verifyDailyEventWebhook(payload, secret, 'invalid-format')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Invalid signature header format')
  })

  it('should reject expired timestamp', () => {
    const payload = JSON.stringify({ event: 'policy.created' })
    const oldTimestamp = (Math.floor(Date.now() / 1000) - 600).toString() // 10 minutes ago
    const signedPayload = `${oldTimestamp}.${payload}`
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')
    const signatureHeader = `t=${oldTimestamp},v1=${signature}`

    const result = verifyDailyEventWebhook(payload, secret, signatureHeader)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('tolerance')
  })

  it('should reject invalid signature', () => {
    const payload = JSON.stringify({ event: 'policy.created' })
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signatureHeader = `t=${timestamp},v1=invalidsignature0000000000000000000000000000000000000000000000000000`

    const result = verifyDailyEventWebhook(payload, secret, signatureHeader)
    expect(result.valid).toBe(false)
  })
})
