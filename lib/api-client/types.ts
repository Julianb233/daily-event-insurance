/**
 * Daily Event Insurance - Partner API Client Types
 *
 * Type definitions for the Partner API SDK including quotes, policies,
 * webhooks, errors, and pagination.
 */

// ============================================================================
// Environment & Configuration Types
// ============================================================================

export type Environment = 'sandbox' | 'production'

export interface ClientConfig {
  apiKey: string
  environment: Environment
  debug?: boolean
  logger?: Logger
  timeout?: number
  maxRetries?: number
  retryDelay?: number
  baseUrl?: string
}

export interface Logger {
  debug(message: string, data?: unknown): void
  info(message: string, data?: unknown): void
  warn(message: string, data?: unknown): void
  error(message: string, data?: unknown): void
}

// ============================================================================
// Error Types
// ============================================================================

export interface APIErrorResponse {
  error: string
  message: string
  code?: string
  details?: Record<string, unknown>
  requestId?: string
}

export class APIError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: Record<string, unknown>
  public readonly requestId?: string

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: Record<string, unknown>,
    requestId?: string
  ) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.requestId = requestId
    Object.setPrototypeOf(this, APIError.prototype)
  }
}

export class AuthError extends APIError {
  constructor(message: string, requestId?: string) {
    super(message, 401, 'unauthorized', undefined, requestId)
    this.name = 'AuthError'
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string, requestId?: string) {
    super(message, 403, 'forbidden', undefined, requestId)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class NotFoundError extends APIError {
  constructor(message: string, resource?: string, requestId?: string) {
    super(message, 404, 'not_found', resource ? { resource } : undefined, requestId)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ValidationError extends APIError {
  public readonly validationErrors: ValidationFieldError[]

  constructor(
    message: string,
    validationErrors: ValidationFieldError[] = [],
    requestId?: string
  ) {
    super(message, 400, 'validation_error', { validationErrors }, requestId)
    this.name = 'ValidationError'
    this.validationErrors = validationErrors
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export interface ValidationFieldError {
  field: string
  message: string
  code?: string
}

export class RateLimitError extends APIError {
  public readonly retryAfter: number

  constructor(message: string, retryAfter: number, requestId?: string) {
    super(message, 429, 'rate_limited', { retryAfter }, requestId)
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

export class ServerError extends APIError {
  constructor(message: string, statusCode: number = 500, requestId?: string) {
    super(message, statusCode, 'server_error', undefined, requestId)
    this.name = 'ServerError'
    Object.setPrototypeOf(this, ServerError.prototype)
  }
}

export class NetworkError extends Error {
  public readonly cause?: Error

  constructor(message: string, cause?: Error) {
    super(message)
    this.name = 'NetworkError'
    this.cause = cause
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  limit?: number
  page?: number
  cursor?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor?: string
  previousCursor?: string
}

// ============================================================================
// Quote Types
// ============================================================================

export type QuoteStatus = 'pending' | 'accepted' | 'expired' | 'converted' | 'cancelled'

export type EventType =
  | 'wedding'
  | 'corporate'
  | 'birthday'
  | 'concert'
  | 'festival'
  | 'sporting'
  | 'conference'
  | 'exhibition'
  | 'private_party'
  | 'charity'
  | 'other'

export type CoverageType =
  | 'cancellation'
  | 'liability'
  | 'property_damage'
  | 'weather'
  | 'vendor_no_show'
  | 'comprehensive'

export interface CreateQuoteParams {
  eventType: EventType
  eventName: string
  eventDate: string
  eventEndDate?: string
  venueAddress: VenueAddress
  attendeeCount: number
  eventValue: number
  coverageTypes: CoverageType[]
  additionalCoverage?: AdditionalCoverageOptions
  policyholder: PolicyholderInfo
  partnerReferenceId?: string
  metadata?: Record<string, string>
}

export interface VenueAddress {
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface AdditionalCoverageOptions {
  alcoholLiability?: boolean
  keyPersonCoverage?: boolean
  terrorismCoverage?: boolean
  extendedWeatherCoverage?: boolean
  equipmentCoverage?: number
}

export interface PolicyholderInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName?: string
}

export interface Quote {
  id: string
  status: QuoteStatus
  eventType: EventType
  eventName: string
  eventDate: string
  eventEndDate?: string
  venueAddress: VenueAddress
  attendeeCount: number
  eventValue: number
  coverageTypes: CoverageType[]
  additionalCoverage?: AdditionalCoverageOptions
  policyholder: PolicyholderInfo
  premium: PremiumBreakdown
  partnerReferenceId?: string
  metadata?: Record<string, string>
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface PremiumBreakdown {
  basePremium: number
  additionalPremiums: Record<string, number>
  discounts: Record<string, number>
  taxes: number
  fees: number
  totalPremium: number
  currency: string
}

export interface QuoteListFilters extends PaginationParams {
  status?: QuoteStatus | QuoteStatus[]
  eventType?: EventType | EventType[]
  eventDateFrom?: string
  eventDateTo?: string
  createdFrom?: string
  createdTo?: string
  partnerReferenceId?: string
  sortBy?: 'createdAt' | 'eventDate' | 'premium'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// Policy Types
// ============================================================================

export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'claimed' | 'pending_payment'

export interface CreatePolicyParams {
  quoteId: string
  paymentMethodId: string
  acceptTerms: boolean
  metadata?: Record<string, string>
}

export interface Policy {
  id: string
  policyNumber: string
  status: PolicyStatus
  quoteId: string
  eventType: EventType
  eventName: string
  eventDate: string
  eventEndDate?: string
  venueAddress: VenueAddress
  attendeeCount: number
  eventValue: number
  coverageTypes: CoverageType[]
  additionalCoverage?: AdditionalCoverageOptions
  policyholder: PolicyholderInfo
  premium: PremiumBreakdown
  payment: PaymentInfo
  coverage: CoverageDetails
  documents: PolicyDocument[]
  partnerReferenceId?: string
  metadata?: Record<string, string>
  effectiveDate: string
  expirationDate: string
  createdAt: string
  updatedAt: string
  cancelledAt?: string
  cancellationReason?: string
}

export interface PaymentInfo {
  paymentId: string
  paymentMethodId: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  paidAt?: string
  refundedAt?: string
  refundAmount?: number
}

export interface CoverageDetails {
  coverageLimit: number
  deductible: number
  coverageBreakdown: Record<CoverageType, CoverageLimits>
}

export interface CoverageLimits {
  limit: number
  deductible: number
  included: boolean
}

export interface PolicyDocument {
  id: string
  type: 'policy' | 'certificate' | 'endorsement' | 'declaration'
  name: string
  url: string
  createdAt: string
}

export interface PolicyListFilters extends PaginationParams {
  status?: PolicyStatus | PolicyStatus[]
  eventType?: EventType | EventType[]
  policyNumber?: string
  eventDateFrom?: string
  eventDateTo?: string
  createdFrom?: string
  createdTo?: string
  partnerReferenceId?: string
  sortBy?: 'createdAt' | 'eventDate' | 'policyNumber'
  sortOrder?: 'asc' | 'desc'
}

export interface CancelPolicyParams {
  reason: CancellationReason
  notes?: string
}

export type CancellationReason =
  | 'event_cancelled'
  | 'duplicate_policy'
  | 'customer_request'
  | 'non_payment'
  | 'underwriting_review'
  | 'fraud'
  | 'other'

export interface CancellationResult {
  policyId: string
  status: 'cancelled'
  cancelledAt: string
  refund?: RefundInfo
}

export interface RefundInfo {
  refundId: string
  amount: number
  currency: string
  status: 'pending' | 'processed' | 'failed'
  processedAt?: string
}

// ============================================================================
// Webhook Types
// ============================================================================

export type WebhookEventType =
  | 'quote.created'
  | 'quote.updated'
  | 'quote.expired'
  | 'policy.created'
  | 'policy.activated'
  | 'policy.cancelled'
  | 'policy.expired'
  | 'policy.renewed'
  | 'claim.submitted'
  | 'claim.approved'
  | 'claim.denied'
  | 'claim.paid'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.refunded'

export interface Webhook {
  id: string
  url: string
  events: WebhookEventType[]
  secret: string
  active: boolean
  createdAt: string
  updatedAt: string
  lastDeliveryAt?: string
  lastDeliveryStatus?: 'success' | 'failed'
}

export interface CreateWebhookParams {
  url: string
  events: WebhookEventType[]
  description?: string
}

export interface UpdateWebhookParams {
  url?: string
  events?: WebhookEventType[]
  active?: boolean
  description?: string
}

export interface WebhookEvent<T = unknown> {
  id: string
  type: WebhookEventType
  apiVersion: string
  created: string
  data: T
  livemode: boolean
}

export interface WebhookDelivery {
  id: string
  webhookId: string
  eventId: string
  eventType: WebhookEventType
  status: 'pending' | 'success' | 'failed'
  httpStatus?: number
  responseBody?: string
  attemptNumber: number
  nextRetryAt?: string
  createdAt: string
  completedAt?: string
}

export interface SignatureVerificationResult {
  valid: boolean
  timestamp?: number
  error?: string
}

// ============================================================================
// Request/Response Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  timeout?: number
  noRetry?: boolean
  headers?: Record<string, string>
  idempotencyKey?: string
}

export interface ResponseMetadata {
  requestId: string
  rateLimit: RateLimitInfo
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
}
