import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock auth module before imports
vi.mock('@/lib/api-auth', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ userId: 'admin-123', user: { role: 'admin' } }),
  withAuth: vi.fn((handler) => handler()),
}))

vi.mock('@/lib/email/sequences-outbound', () => ({
  startOutboundSequence: vi.fn().mockResolvedValue({ success: true, sequenceId: 'seq-123' }),
  stopOutboundSequence: vi.fn().mockResolvedValue({ success: true }),
  getOutboundSequenceStatus: vi.fn().mockResolvedValue({
    sequence: { id: 'seq-123', status: 'active' },
    scheduledEmails: [],
  }),
}))

vi.mock('@/lib/api-utils', () => ({
  successResponse: vi.fn((data, message, status = 200) =>
    new Response(JSON.stringify({ success: true, data, message }), { status })
  ),
  serverError: vi.fn((message) =>
    new Response(JSON.stringify({ success: false, error: message }), { status: 500 })
  ),
  validationError: vi.fn((errors) =>
    new Response(JSON.stringify({ success: false, errors }), { status: 400 })
  ),
}))

// Import after mocks
import { POST, DELETE, GET } from '@/app/api/campaigns/outbound/route'
import * as authModule from '@/lib/api-auth'
import * as emailModule from '@/lib/email/sequences-outbound'
import { NextRequest } from 'next/server'

describe('/api/campaigns/outbound', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: admin authenticated
    vi.mocked(authModule.requireAdmin).mockResolvedValue({
      userId: 'admin-123',
      user: { role: 'admin', email: 'admin@test.com' }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Authentication', () => {
    it('POST requires admin authentication', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'lead-123',
          vertical: 'gym',
          email: 'prospect@example.com',
          contactName: 'John Doe',
          companyName: 'Test Gym',
          estimatedRevenue: 50000,
        }),
      })

      await POST(request)

      expect(authModule.requireAdmin).toHaveBeenCalled()
    })

    it('DELETE requires admin authentication', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: 'lead-123' }),
      })

      await DELETE(request)

      expect(authModule.requireAdmin).toHaveBeenCalled()
    })

    it('GET requires admin authentication', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound?leadId=lead-123', {
        method: 'GET',
      })

      await GET(request)

      expect(authModule.requireAdmin).toHaveBeenCalled()
    })

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authModule.withAuth).mockImplementation(() => {
        throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      })

      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'lead-123',
          vertical: 'gym',
          email: 'prospect@example.com',
          contactName: 'John Doe',
          companyName: 'Test Gym',
          estimatedRevenue: 50000,
        }),
      })

      try {
        await POST(request)
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        if (error instanceof Response) {
          expect(error.status).toBe(401)
        }
      }
    })

    it('returns 403 when user is not admin', async () => {
      vi.mocked(authModule.requireAdmin).mockImplementation(() => {
        throw new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
      })
      vi.mocked(authModule.withAuth).mockImplementation(async (handler) => {
        try {
          return await handler()
        } catch (error) {
          if (error instanceof Response) return error
          throw error
        }
      })

      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'lead-123',
          vertical: 'gym',
          email: 'prospect@example.com',
          contactName: 'John Doe',
          companyName: 'Test Gym',
          estimatedRevenue: 50000,
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(403)
    })
  })

  describe('POST /api/campaigns/outbound', () => {
    const validPayload = {
      leadId: 'lead-123',
      vertical: 'gym',
      email: 'prospect@example.com',
      contactName: 'John Doe',
      companyName: 'Test Gym',
      estimatedRevenue: 50000,
    }

    it('returns 400 when leadId is missing', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPayload,
          leadId: undefined,
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid vertical', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPayload,
          vertical: 'invalid-vertical',
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid email format', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPayload,
          email: 'not-an-email',
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('returns 400 when estimatedRevenue is negative', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPayload,
          estimatedRevenue: -1000,
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('starts campaign successfully with valid data', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(emailModule.startOutboundSequence).toHaveBeenCalledWith(validPayload)
    })

    it('accepts all valid verticals', async () => {
      const validVerticals = ['gym', 'wellness', 'ski-resort', 'fitness']

      for (const vertical of validVerticals) {
        vi.clearAllMocks()
        vi.mocked(authModule.requireAdmin).mockResolvedValue({
          userId: 'admin-123',
          user: { role: 'admin' }
        })

        const request = new NextRequest('http://localhost/api/campaigns/outbound', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...validPayload, vertical }),
        })

        const response = await POST(request)

        expect(response.status).toBe(201)
      }
    })

    it('returns 500 when email service fails', async () => {
      vi.mocked(emailModule.startOutboundSequence).mockResolvedValue({
        success: false,
        error: 'Email service unavailable',
      })

      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })

  describe('DELETE /api/campaigns/outbound', () => {
    it('returns 400 when leadId is missing', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const response = await DELETE(request)

      expect(response.status).toBe(400)
    })

    it('stops campaign successfully', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: 'lead-123' }),
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(emailModule.stopOutboundSequence).toHaveBeenCalledWith('lead-123')
    })

    it('returns 500 when stop fails', async () => {
      vi.mocked(emailModule.stopOutboundSequence).mockResolvedValue({
        success: false,
        error: 'Campaign not found',
      })

      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: 'lead-123' }),
      })

      const response = await DELETE(request)

      expect(response.status).toBe(500)
    })
  })

  describe('GET /api/campaigns/outbound', () => {
    it('returns 400 when leadId query param is missing', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound', {
        method: 'GET',
      })

      const response = await GET(request)

      expect(response.status).toBe(400)
    })

    it('returns campaign status successfully', async () => {
      const request = new NextRequest('http://localhost/api/campaigns/outbound?leadId=lead-123', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('returns 500 when status fetch fails', async () => {
      vi.mocked(emailModule.getOutboundSequenceStatus).mockResolvedValue({
        error: 'Sequence not found',
      })

      const request = new NextRequest('http://localhost/api/campaigns/outbound?leadId=lead-123', {
        method: 'GET',
      })

      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })
})
