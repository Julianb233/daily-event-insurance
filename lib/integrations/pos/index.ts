/**
 * POS Integration Services
 *
 * Webhook handlers and sync services for POS system integrations.
 */

// ============= Shared Utilities =============

export {
  WebhookVerifier,
  verifyMindbodyWebhook,
  verifyPike13Webhook,
  verifySquareWebhook,
  verifyDailyEventWebhook,
} from './shared/webhook-verifier'

export type {
  WebhookVerificationResult,
  WebhookVerifierConfig,
} from './shared/webhook-verifier'

export {
  RateLimiter,
  posRateLimiters,
  createRateLimiter,
} from './shared/rate-limiter'

export type {
  RateLimitConfig,
  RateLimitState,
  RetryOptions,
} from './shared/rate-limiter'

// ============= Version =============

export const VERSION = '1.0.0'
