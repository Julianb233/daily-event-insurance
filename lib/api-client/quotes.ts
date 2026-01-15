/**
 * Daily Event Insurance - Quotes API
 *
 * API methods for creating and managing insurance quotes
 */

import type { DailyEventClient } from './client'
import type {
  Quote,
  CreateQuoteParams,
  QuoteListFilters,
  PaginatedResponse,
  ResponseMetadata,
  RequestOptions,
} from './types'

/**
 * Pricing breakdown in quote response
 */
export interface QuotePricingBreakdown {
  basePremium: number
  coverageModifiers: CoverageModifier[]
  riskModifiers: RiskModifier[]
  discounts: PricingDiscount[]
  subtotal: number
  taxes: TaxBreakdown[]
  fees: FeeBreakdown[]
  totalPremium: number
  currency: string
}

export interface CoverageModifier {
  coverageType: string
  amount: number
  description: string
}

export interface RiskModifier {
  factor: string
  multiplier: number
  description: string
}

export interface PricingDiscount {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  amount: number
  description: string
}

export interface TaxBreakdown {
  name: string
  rate: number
  amount: number
}

export interface FeeBreakdown {
  name: string
  amount: number
  description: string
}

/**
 * Quotes API
 */
export class QuotesAPI {
  constructor(private readonly client: DailyEventClient) {}

  /**
   * Create a new insurance quote
   */
  async create(
    params: CreateQuoteParams,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.post<Quote>('/quotes', params, options)
  }

  /**
   * Get a quote by ID
   */
  async get(
    quoteId: string,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.get<Quote>(`/quotes/${quoteId}`, undefined, options)
  }

  /**
   * List quotes with optional filters
   */
  async list(
    filters?: QuoteListFilters,
    options?: RequestOptions
  ): Promise<{ data: PaginatedResponse<Quote>; metadata: ResponseMetadata }> {
    const query = this.buildFilterQuery(filters)
    return this.client.get<PaginatedResponse<Quote>>('/quotes', query, options)
  }

  /**
   * Get detailed pricing breakdown for a quote
   */
  async getPricing(
    quoteId: string,
    options?: RequestOptions
  ): Promise<{ data: QuotePricingBreakdown; metadata: ResponseMetadata }> {
    return this.client.get<QuotePricingBreakdown>(`/quotes/${quoteId}/pricing`, undefined, options)
  }

  /**
   * Refresh an expired quote (creates a new quote with updated pricing)
   */
  async refresh(
    quoteId: string,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.post<Quote>(`/quotes/${quoteId}/refresh`, undefined, options)
  }

  /**
   * Cancel a pending quote
   */
  async cancel(
    quoteId: string,
    reason?: string,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.post<Quote>(`/quotes/${quoteId}/cancel`, { reason }, options)
  }

  /**
   * Apply a discount code to a quote
   */
  async applyDiscount(
    quoteId: string,
    discountCode: string,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.post<Quote>(`/quotes/${quoteId}/discounts`, { code: discountCode }, options)
  }

  /**
   * Remove a discount from a quote
   */
  async removeDiscount(
    quoteId: string,
    discountCode: string,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.delete<Quote>(`/quotes/${quoteId}/discounts/${discountCode}`, options)
  }

  /**
   * Update quote metadata
   */
  async updateMetadata(
    quoteId: string,
    metadata: Record<string, string>,
    options?: RequestOptions
  ): Promise<{ data: Quote; metadata: ResponseMetadata }> {
    return this.client.patch<Quote>(`/quotes/${quoteId}`, { metadata }, options)
  }

  /**
   * Build query parameters from filters
   */
  private buildFilterQuery(
    filters?: QuoteListFilters
  ): Record<string, string | number | boolean | undefined> | undefined {
    if (!filters) return undefined

    const query: Record<string, string | number | boolean | undefined> = {}

    if (filters.limit) query.limit = filters.limit
    if (filters.page) query.page = filters.page
    if (filters.cursor) query.cursor = filters.cursor

    if (filters.status) {
      query.status = Array.isArray(filters.status) ? filters.status.join(',') : filters.status
    }
    if (filters.eventType) {
      query.event_type = Array.isArray(filters.eventType) ? filters.eventType.join(',') : filters.eventType
    }

    if (filters.eventDateFrom) query.event_date_from = filters.eventDateFrom
    if (filters.eventDateTo) query.event_date_to = filters.eventDateTo
    if (filters.createdFrom) query.created_from = filters.createdFrom
    if (filters.createdTo) query.created_to = filters.createdTo
    if (filters.partnerReferenceId) query.partner_reference_id = filters.partnerReferenceId
    if (filters.sortBy) query.sort_by = filters.sortBy
    if (filters.sortOrder) query.sort_order = filters.sortOrder

    return query
  }
}

export default QuotesAPI
