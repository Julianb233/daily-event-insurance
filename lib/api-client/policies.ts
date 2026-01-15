/**
 * Daily Event Insurance - Policies API
 *
 * API methods for creating and managing insurance policies
 */

import type { DailyEventClient } from './client'
import type {
  Policy,
  CreatePolicyParams,
  PolicyListFilters,
  CancelPolicyParams,
  CancellationResult,
  PolicyDocument,
  PaginatedResponse,
  ResponseMetadata,
  RequestOptions,
} from './types'

/**
 * Certificate request parameters
 */
export interface CertificateRequestParams {
  /** Additional insured parties */
  additionalInsured?: AdditionalInsuredParty[]
  /** Certificate holder information */
  certificateHolder?: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
  }
  /** Special instructions or requirements */
  specialInstructions?: string
}

export interface AdditionalInsuredParty {
  name: string
  relationship: 'venue' | 'sponsor' | 'contractor' | 'other'
  address?: string
}

/**
 * Policy endorsement parameters
 */
export interface EndorsementParams {
  type: EndorsementType
  details: Record<string, unknown>
  effectiveDate?: string
}

export type EndorsementType =
  | 'additional_insured'
  | 'venue_change'
  | 'date_change'
  | 'coverage_increase'
  | 'coverage_decrease'
  | 'name_change'

/**
 * Policy activity log entry
 */
export interface PolicyActivity {
  id: string
  policyId: string
  action: PolicyActivityAction
  performedBy: string
  performedAt: string
  details?: Record<string, unknown>
}

export type PolicyActivityAction =
  | 'created'
  | 'activated'
  | 'modified'
  | 'endorsed'
  | 'cancelled'
  | 'renewed'
  | 'claim_submitted'
  | 'certificate_issued'

/**
 * Policies API
 */
export class PoliciesAPI {
  constructor(private readonly client: DailyEventClient) {}

  /**
   * Create a policy from a quote
   */
  async create(
    params: CreatePolicyParams,
    options?: RequestOptions
  ): Promise<{ data: Policy; metadata: ResponseMetadata }> {
    return this.client.post<Policy>('/policies', params, options)
  }

  /**
   * Get a policy by ID
   */
  async get(
    policyId: string,
    options?: RequestOptions
  ): Promise<{ data: Policy; metadata: ResponseMetadata }> {
    return this.client.get<Policy>(`/policies/${policyId}`, undefined, options)
  }

  /**
   * Get a policy by policy number
   */
  async getByNumber(
    policyNumber: string,
    options?: RequestOptions
  ): Promise<{ data: Policy; metadata: ResponseMetadata }> {
    return this.client.get<Policy>(`/policies/by-number/${policyNumber}`, undefined, options)
  }

  /**
   * List policies with optional filters
   */
  async list(
    filters?: PolicyListFilters,
    options?: RequestOptions
  ): Promise<{ data: PaginatedResponse<Policy>; metadata: ResponseMetadata }> {
    const query = this.buildFilterQuery(filters)
    return this.client.get<PaginatedResponse<Policy>>('/policies', query, options)
  }

  /**
   * Cancel a policy
   */
  async cancel(
    policyId: string,
    params: CancelPolicyParams,
    options?: RequestOptions
  ): Promise<{ data: CancellationResult; metadata: ResponseMetadata }> {
    return this.client.post<CancellationResult>(`/policies/${policyId}/cancel`, params, options)
  }

  /**
   * Get policy documents
   */
  async getDocuments(
    policyId: string,
    options?: RequestOptions
  ): Promise<{ data: PolicyDocument[]; metadata: ResponseMetadata }> {
    return this.client.get<PolicyDocument[]>(`/policies/${policyId}/documents`, undefined, options)
  }

  /**
   * Get specific document
   */
  async getDocument(
    policyId: string,
    documentId: string,
    options?: RequestOptions
  ): Promise<{ data: PolicyDocument; metadata: ResponseMetadata }> {
    return this.client.get<PolicyDocument>(`/policies/${policyId}/documents/${documentId}`, undefined, options)
  }

  /**
   * Request a certificate of insurance
   */
  async requestCertificate(
    policyId: string,
    params?: CertificateRequestParams,
    options?: RequestOptions
  ): Promise<{ data: PolicyDocument; metadata: ResponseMetadata }> {
    return this.client.post<PolicyDocument>(`/policies/${policyId}/certificates`, params, options)
  }

  /**
   * Add an endorsement to a policy
   */
  async addEndorsement(
    policyId: string,
    params: EndorsementParams,
    options?: RequestOptions
  ): Promise<{ data: Policy; metadata: ResponseMetadata }> {
    return this.client.post<Policy>(`/policies/${policyId}/endorsements`, params, options)
  }

  /**
   * Get policy activity log
   */
  async getActivity(
    policyId: string,
    options?: RequestOptions
  ): Promise<{ data: PolicyActivity[]; metadata: ResponseMetadata }> {
    return this.client.get<PolicyActivity[]>(`/policies/${policyId}/activity`, undefined, options)
  }

  /**
   * Update policy metadata
   */
  async updateMetadata(
    policyId: string,
    metadata: Record<string, string>,
    options?: RequestOptions
  ): Promise<{ data: Policy; metadata: ResponseMetadata }> {
    return this.client.patch<Policy>(`/policies/${policyId}`, { metadata }, options)
  }

  /**
   * Renew a policy (creates new quote for renewal)
   */
  async renew(
    policyId: string,
    options?: RequestOptions
  ): Promise<{ data: { quoteId: string; quote: unknown }; metadata: ResponseMetadata }> {
    return this.client.post<{ quoteId: string; quote: unknown }>(`/policies/${policyId}/renew`, undefined, options)
  }

  /**
   * Build query parameters from filters
   */
  private buildFilterQuery(
    filters?: PolicyListFilters
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

    if (filters.policyNumber) query.policy_number = filters.policyNumber
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

export default PoliciesAPI
