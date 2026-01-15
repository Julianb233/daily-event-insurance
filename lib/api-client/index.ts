/**
 * Daily Event Insurance - Partner API Client SDK
 *
 * Complete SDK for integrating with the Daily Event Insurance API.
 */

// Core Client
export { DailyEventClient, default as Client } from './client'

// API Classes
export { QuotesAPI, default as Quotes } from './quotes'
export type {
  QuotePricingBreakdown,
  CoverageModifier,
  RiskModifier,
  PricingDiscount,
  TaxBreakdown,
  FeeBreakdown,
} from './quotes'

export { PoliciesAPI, default as Policies } from './policies'
export type {
  CertificateRequestParams,
  AdditionalInsuredParty,
  EndorsementParams,
  EndorsementType,
  PolicyActivity,
  PolicyActivityAction,
} from './policies'

export { WebhooksAPI, default as Webhooks } from './webhooks'
export type { VerifyOptions } from './webhooks'

// Types - Configuration & Environment
export type {
  Environment,
  ClientConfig,
  Logger,
  HttpMethod,
  RequestOptions,
  ResponseMetadata,
  RateLimitInfo,
} from './types'

// Types - Errors
export {
  APIError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  NetworkError,
} from './types'

export type {
  APIErrorResponse,
  ValidationFieldError,
} from './types'

// Types - Pagination
export type {
  PaginationParams,
  PaginatedResponse,
  PaginationInfo,
} from './types'

// Types - Quotes
export type {
  Quote,
  QuoteStatus,
  CreateQuoteParams,
  QuoteListFilters,
  EventType,
  CoverageType,
  VenueAddress,
  AdditionalCoverageOptions,
  PolicyholderInfo,
  PremiumBreakdown,
} from './types'

// Types - Policies
export type {
  Policy,
  PolicyStatus,
  CreatePolicyParams,
  PolicyListFilters,
  CancelPolicyParams,
  CancellationReason,
  CancellationResult,
  RefundInfo,
  PaymentInfo,
  CoverageDetails,
  CoverageLimits,
  PolicyDocument,
} from './types'

// Types - Webhooks
export type {
  Webhook,
  WebhookEventType,
  WebhookEvent,
  WebhookDelivery,
  CreateWebhookParams,
  UpdateWebhookParams,
  SignatureVerificationResult,
} from './types'

/**
 * Create a fully configured Daily Event client with all API modules
 */
export function createDailyEventSDK(config: import('./types').ClientConfig) {
  const client = new DailyEventClient(config)

  return {
    client,
    quotes: new QuotesAPI(client),
    policies: new PoliciesAPI(client),
    webhooks: new WebhooksAPI(client),
  }
}

// Version
export const VERSION = '1.0.0'
export const API_VERSION = 'v1'

// Re-import for convenience
import { DailyEventClient } from './client'
import { QuotesAPI } from './quotes'
import { PoliciesAPI } from './policies'
import { WebhooksAPI } from './webhooks'
