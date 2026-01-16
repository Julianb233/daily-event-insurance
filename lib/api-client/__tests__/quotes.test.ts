import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QuotesAPI } from '../quotes'
import type { DailyEventClient } from '../client'
import type { Quote, CreateQuoteParams } from '../types'

describe('QuotesAPI', () => {
  let quotesApi: QuotesAPI
  let mockClient: {
    get: ReturnType<typeof vi.fn>
    post: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    }
    quotesApi = new QuotesAPI(mockClient as unknown as DailyEventClient)
  })

  describe('create', () => {
    it('should create a quote with required fields', async () => {
      const mockQuote: Quote = {
        id: 'quote_123',
        status: 'draft',
        eventDetails: {
          name: 'Test Event',
          date: '2024-06-15',
          type: 'fitness_class',
          location: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
          },
          expectedAttendees: 20,
        },
        coverage: {
          generalLiability: {
            enabled: true,
            limit: 1000000,
          },
        },
        pricing: {
          basePremium: 50,
          totalPremium: 58,
          currency: 'USD',
        },
        expiresAt: '2024-06-01T00:00:00Z',
        createdAt: '2024-05-15T00:00:00Z',
        updatedAt: '2024-05-15T00:00:00Z',
      }

      mockClient.post.mockResolvedValueOnce({
        data: mockQuote,
        metadata: { requestId: 'req_123' },
      })

      const params: CreateQuoteParams = {
        eventDetails: {
          name: 'Test Event',
          date: '2024-06-15',
          type: 'fitness_class',
          location: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
          },
          expectedAttendees: 20,
        },
        coverage: {
          generalLiability: {
            enabled: true,
            limit: 1000000,
          },
        },
      }

      const result = await quotesApi.create(params)

      expect(mockClient.post).toHaveBeenCalledWith('/quotes', params, undefined)
      expect(result.data).toEqual(mockQuote)
    })
  })

  describe('get', () => {
    it('should get a quote by ID', async () => {
      const mockQuote = { id: 'quote_123', status: 'draft' }
      mockClient.get.mockResolvedValueOnce({
        data: mockQuote,
        metadata: { requestId: 'req_123' },
      })

      const result = await quotesApi.get('quote_123')

      expect(mockClient.get).toHaveBeenCalledWith('/quotes/quote_123', undefined, undefined)
      expect(result.data).toEqual(mockQuote)
    })
  })

  describe('list', () => {
    it('should list quotes with pagination', async () => {
      const mockResponse = {
        data: [{ id: 'quote_1' }, { id: 'quote_2' }],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
        metadata: { requestId: 'req_123' },
      }
      mockClient.get.mockResolvedValueOnce(mockResponse)

      const result = await quotesApi.list({ page: 1, limit: 20 })

      expect(mockClient.get).toHaveBeenCalledWith(
        '/quotes',
        expect.objectContaining({ page: 1, limit: 20 }),
        undefined
      )
      expect(result.data).toEqual(mockResponse.data)
    })

    it('should filter quotes by status', async () => {
      mockClient.get.mockResolvedValueOnce({
        data: [],
        pagination: {},
        metadata: { requestId: 'req_123' },
      })

      await quotesApi.list({ status: 'accepted' })

      expect(mockClient.get).toHaveBeenCalledWith(
        '/quotes',
        expect.objectContaining({ status: 'accepted' }),
        undefined
      )
    })
  })

  describe('refresh', () => {
    it('should refresh an expired quote', async () => {
      const mockQuote = { id: 'quote_123', status: 'draft' }
      mockClient.post.mockResolvedValueOnce({
        data: mockQuote,
        metadata: { requestId: 'req_123' },
      })

      const result = await quotesApi.refresh('quote_123')

      expect(mockClient.post).toHaveBeenCalledWith(
        '/quotes/quote_123/refresh',
        undefined,
        undefined
      )
      expect(result.data).toEqual(mockQuote)
    })
  })

  describe('cancel', () => {
    it('should cancel a quote', async () => {
      const mockQuote = { id: 'quote_123', status: 'cancelled' }
      mockClient.post.mockResolvedValueOnce({
        data: mockQuote,
        metadata: { requestId: 'req_123' },
      })

      const result = await quotesApi.cancel('quote_123', 'No longer needed')

      expect(mockClient.post).toHaveBeenCalledWith(
        '/quotes/quote_123/cancel',
        { reason: 'No longer needed' },
        undefined
      )
      expect(result.data).toEqual(mockQuote)
    })
  })
})
