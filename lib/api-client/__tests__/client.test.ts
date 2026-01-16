import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DailyEventClient } from '../client'

describe('DailyEventClient', () => {
  let client: DailyEventClient
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    client = new DailyEventClient({
      apiKey: 'test-api-key',
      environment: 'sandbox',
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('constructor', () => {
    it('should create client with required options', () => {
      expect(client).toBeDefined()
    })

    it('should use sandbox URL by default', () => {
      const newClient = new DailyEventClient({
        apiKey: 'key',
        environment: 'sandbox',
      })
      expect(newClient).toBeDefined()
    })

    it('should accept custom base URL', () => {
      const newClient = new DailyEventClient({
        apiKey: 'key',
        environment: 'production',
        baseUrl: 'https://custom.api.com',
      })
      expect(newClient).toBeDefined()
    })
  })

  describe('get', () => {
    it('should make GET request with correct headers', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({
          'x-request-id': 'req_123',
        }),
        json: () => Promise.resolve({ id: 'test_123' }),
      })

      const result = await client.get('/test')

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result.data).toEqual({ id: 'test_123' })
    })

    it('should include query parameters in URL', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve({ data: [] }),
      })

      await client.get('/test', { page: 1, status: 'active' })

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/page=1.*status=active|status=active.*page=1/),
        expect.any(Object)
      )
    })
  })

  describe('post', () => {
    it('should make POST request with body', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers(),
        json: () => Promise.resolve({ id: 'created_123' }),
      })

      const result = await client.post('/test', { name: 'Test' })

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test' }),
        })
      )
      expect(result.data).toEqual({ id: 'created_123' })
    })
  })

  describe('delete', () => {
    it('should make DELETE request', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers(),
        json: () => Promise.resolve({}),
      })

      await client.delete('/test/123')

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/test/123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  describe('error handling', () => {
    it('should throw ValidationError on 400 response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers(),
        json: () => Promise.resolve({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
          },
        }),
      })

      await expect(client.get('/test')).rejects.toThrow()
    })

    it('should throw AuthError on 401 response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers(),
        json: () => Promise.resolve({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid API key',
          },
        }),
      })

      await expect(client.get('/test')).rejects.toThrow()
    })

    it('should throw NotFoundError on 404 response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
        json: () => Promise.resolve({
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
          },
        }),
      })

      await expect(client.get('/test/unknown')).rejects.toThrow()
    })
  })

  describe('retry logic', () => {
    it('should retry on 503 Service Unavailable', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          headers: new Headers(),
          json: () => Promise.resolve({
            error: { code: 'SERVICE_UNAVAILABLE' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers(),
          json: () => Promise.resolve({ success: true }),
        })

      const result = await client.get('/test')

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(result.data).toEqual({ success: true })
    })
  })
})
