/**
 * Daily Event Insurance - Webhooks API
 *
 * API methods for managing webhooks and verifying signatures
 */

import crypto from 'crypto'
import type { DailyEventClient } from './client'
import type {
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookDelivery,
  SignatureVerificationResult,
  PaginatedResponse,
  ResponseMetadata,
  RequestOptions,
  WebhookEvent,
} from './types'

/**
 * Options for signature verification
 */
export interface VerifyOptions {
  /** Timestamp tolerance in seconds (default: 300 = 5 minutes) */
  tolerance?: number
}

/**
 * Webhooks API
 */
export class WebhooksAPI {
  constructor(private readonly client: DailyEventClient) {}

  /**
   * Create a new webhook
   */
  async create(
    params: CreateWebhookParams,
    options?: RequestOptions
  ): Promise<{ data: Webhook; metadata: ResponseMetadata }> {
    return this.client.post<Webhook>('/webhooks', params, options)
  }

  /**
   * Get a webhook by ID
   */
  async get(
    webhookId: string,
    options?: RequestOptions
  ): Promise<{ data: Webhook; metadata: ResponseMetadata }> {
    return this.client.get<Webhook>(`/webhooks/${webhookId}`, undefined, options)
  }

  /**
   * List all webhooks
   */
  async list(
    options?: RequestOptions
  ): Promise<{ data: Webhook[]; metadata: ResponseMetadata }> {
    return this.client.get<Webhook[]>('/webhooks', undefined, options)
  }

  /**
   * Update a webhook
   */
  async update(
    webhookId: string,
    params: UpdateWebhookParams,
    options?: RequestOptions
  ): Promise<{ data: Webhook; metadata: ResponseMetadata }> {
    return this.client.patch<Webhook>(`/webhooks/${webhookId}`, params, options)
  }

  /**
   * Delete a webhook
   */
  async delete(
    webhookId: string,
    options?: RequestOptions
  ): Promise<{ data: { deleted: boolean }; metadata: ResponseMetadata }> {
    return this.client.delete<{ deleted: boolean }>(`/webhooks/${webhookId}`, options)
  }

  /**
   * Rotate webhook secret
   */
  async rotateSecret(
    webhookId: string,
    options?: RequestOptions
  ): Promise<{ data: Webhook; metadata: ResponseMetadata }> {
    return this.client.post<Webhook>(`/webhooks/${webhookId}/rotate-secret`, undefined, options)
  }

  /**
   * Get webhook delivery history
   */
  async getDeliveries(
    webhookId: string,
    filters?: { limit?: number; page?: number; status?: 'success' | 'failed' | 'pending' },
    options?: RequestOptions
  ): Promise<{ data: PaginatedResponse<WebhookDelivery>; metadata: ResponseMetadata }> {
    const query: Record<string, string | number | undefined> = {}
    if (filters?.limit) query.limit = filters.limit
    if (filters?.page) query.page = filters.page
    if (filters?.status) query.status = filters.status

    return this.client.get<PaginatedResponse<WebhookDelivery>>(
      `/webhooks/${webhookId}/deliveries`,
      query,
      options
    )
  }

  /**
   * Retry a failed webhook delivery
   */
  async retryDelivery(
    webhookId: string,
    deliveryId: string,
    options?: RequestOptions
  ): Promise<{ data: WebhookDelivery; metadata: ResponseMetadata }> {
    return this.client.post<WebhookDelivery>(
      `/webhooks/${webhookId}/deliveries/${deliveryId}/retry`,
      undefined,
      options
    )
  }

  /**
   * Test a webhook endpoint
   */
  async test(
    webhookId: string,
    eventType?: string,
    options?: RequestOptions
  ): Promise<{ data: WebhookDelivery; metadata: ResponseMetadata }> {
    return this.client.post<WebhookDelivery>(
      `/webhooks/${webhookId}/test`,
      eventType ? { eventType } : undefined,
      options
    )
  }

  /**
   * Verify webhook signature
   *
   * @param payload - Raw request body as string
   * @param signature - Signature header value (x-dei-signature)
   * @param secret - Webhook secret
   * @param options - Verification options
   */
  verify(
    payload: string,
    signature: string,
    secret: string,
    options?: VerifyOptions
  ): SignatureVerificationResult {
    const tolerance = options?.tolerance ?? 300 // 5 minutes default

    try {
      // Parse signature header: t={timestamp},v1={signature}
      const parts = signature.split(',')
      const timestampPart = parts.find(p => p.startsWith('t='))
      const signaturePart = parts.find(p => p.startsWith('v1='))

      if (!timestampPart || !signaturePart) {
        return {
          valid: false,
          error: 'Invalid signature format',
        }
      }

      const timestamp = parseInt(timestampPart.slice(2), 10)
      const expectedSig = signaturePart.slice(3)

      // Check timestamp tolerance
      const now = Math.floor(Date.now() / 1000)
      if (Math.abs(now - timestamp) > tolerance) {
        return {
          valid: false,
          timestamp,
          error: 'Timestamp outside tolerance window',
        }
      }

      // Calculate expected signature
      const signedPayload = `${timestamp}.${payload}`
      const computedSig = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex')

      // Timing-safe comparison
      const expectedBuffer = Buffer.from(expectedSig, 'hex')
      const computedBuffer = Buffer.from(computedSig, 'hex')
      const valid = crypto.timingSafeEqual(
        new Uint8Array(expectedBuffer.buffer, expectedBuffer.byteOffset, expectedBuffer.byteLength),
        new Uint8Array(computedBuffer.buffer, computedBuffer.byteOffset, computedBuffer.byteLength)
      )

      return {
        valid,
        timestamp,
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      }
    }
  }

  /**
   * Parse and verify a webhook event
   *
   * @param payload - Raw request body
   * @param signature - Signature header value
   * @param secret - Webhook secret
   * @param options - Verification options
   */
  constructEvent<T = unknown>(
    payload: string,
    signature: string,
    secret: string,
    options?: VerifyOptions
  ): WebhookEvent<T> {
    const result = this.verify(payload, signature, secret, options)

    if (!result.valid) {
      throw new Error(result.error ?? 'Invalid webhook signature')
    }

    try {
      return JSON.parse(payload) as WebhookEvent<T>
    } catch {
      throw new Error('Invalid webhook payload')
    }
  }
}

export default WebhooksAPI
