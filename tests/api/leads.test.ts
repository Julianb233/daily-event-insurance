import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock rate limiter
vi.mock('@/lib/rate-limit', () => ({
  leadRateLimiter: {
    check: vi.fn().mockReturnValue({ success: true, remaining: 4, resetTime: Date.now() + 300000 }),
  },
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  rateLimitResponse: vi.fn().mockImplementation((retryAfter: number) =>
    new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfter / 1000)) },
    })
  ),
}))

// Mock database
vi.mock('@/lib/db', () => ({
  db: null,
  isDbConfigured: vi.fn().mockReturnValue(false),
  leads: {},
}))

// Mock lead scoring
vi.mock('@/lib/lead-scoring', () => ({
  calculateLeadScore: vi.fn().mockReturnValue({
    score: 65,
    tier: 'hot',
    factors: { revenue: 30, completeness: 15, engagement: 10, fit: 10 },
  }),
}))

// Mock notifications
vi.mock('@/lib/notifications', () => ({
  notifySalesTeam: vi.fn().mockResolvedValue(undefined),
}))

// Mock API utilities
vi.mock('@/lib/api-utils', () => ({
  successResponse: (data: any, message: string, status: number) => {
    return new Response(JSON.stringify({ success: true, message, data }), { status })
  },
  serverError: (message: string) => {
    return new Response(JSON.stringify({ success: false, error: message }), { status: 500 })
  },
  validationError: (errors: any[]) => {
    return new Response(JSON.stringify({ success: false, errors }), { status: 400 })
  },
}))

// Mock API auth
vi.mock('@/lib/api-auth', () => ({
  withAuth: (handler: () => Promise<Response>) => handler(),
  requireAdmin: vi.fn().mockResolvedValue({ userId: 'admin-123' }),
}))

import { POST, GET } from '@/app/api/leads/route'
import { leadRateLimiter } from '@/lib/rate-limit'
import { calculateLeadScore } from '@/lib/lead-scoring'

describe('/api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/leads', () => {
    const validLeadData = {
      vertical: 'gym',
      source: 'gym-quote-form',
      email: 'test@example.com',
      contactName: 'John Doe',
      organizationName: 'Test Gym',
      monthlyGuests: '1000',
    }

    it('should create a lead with valid data', async () => {
      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(validLeadData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const json = await response.json()

      expect(response.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data.id).toBeDefined()
      expect(json.data.estimatedRevenue).toBeDefined()
      expect(json.data.leadScore).toBeDefined()
    })

    it('should calculate lead score for submission', async () => {
      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(validLeadData),
        headers: { 'Content-Type': 'application/json' },
      })

      await POST(request)

      expect(calculateLeadScore).toHaveBeenCalledWith(
        expect.objectContaining({
          vertical: 'gym',
          email: 'test@example.com',
        })
      )
    })

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        vertical: 'gym',
        // missing email, contactName, source
      }

      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should return 400 for invalid email', async () => {
      const invalidData = {
        ...validLeadData,
        email: 'not-an-email',
      }

      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should return 400 for invalid vertical', async () => {
      const invalidData = {
        ...validLeadData,
        vertical: 'invalid-vertical',
      }

      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('should accept all valid verticals', async () => {
      const verticals = ['gym', 'wellness', 'ski-resort', 'fitness', 'race', 'other']

      for (const vertical of verticals) {
        const request = new NextRequest('http://localhost/api/leads', {
          method: 'POST',
          body: JSON.stringify({ ...validLeadData, vertical }),
          headers: { 'Content-Type': 'application/json' },
        })

        const response = await POST(request)
        expect(response.status).toBe(201)
      }
    })

    it('should handle optional UTM tracking', async () => {
      const dataWithUTM = {
        ...validLeadData,
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'summer-promo',
      }

      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(dataWithUTM),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it('should handle partner attribution', async () => {
      const dataWithPartner = {
        ...validLeadData,
        partnerId: '123e4567-e89b-12d3-a456-426614174000',
        referralCode: 'PARTNER123',
      }

      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(dataWithPartner),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it('should return 429 when rate limited', async () => {
      vi.mocked(leadRateLimiter.check).mockReturnValueOnce({
        success: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
      })

      const request = new NextRequest('http://localhost/api/leads', {
        method: 'POST',
        body: JSON.stringify(validLeadData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(429)
    })
  })

  describe('GET /api/leads (Admin)', () => {
    it('should return leads list for admin', async () => {
      const request = new NextRequest('http://localhost/api/leads')

      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.success).toBe(true)
      expect(json.data).toBeDefined()
      expect(Array.isArray(json.data)).toBe(true)
    })

    it('should support pagination', async () => {
      const request = new NextRequest('http://localhost/api/leads?page=1&limit=10')

      const response = await GET(request)
      const json = await response.json()

      expect(json.pagination).toBeDefined()
      expect(json.pagination.page).toBe(1)
      expect(json.pagination.limit).toBe(10)
    })

    it('should support filtering by vertical', async () => {
      const request = new NextRequest('http://localhost/api/leads?vertical=gym')

      const response = await GET(request)
      const json = await response.json()

      expect(json.success).toBe(true)
      // All returned leads should be gym vertical (in dev mode)
      json.data.forEach((lead: any) => {
        expect(lead.vertical).toBe('gym')
      })
    })

    it('should support filtering by status', async () => {
      const request = new NextRequest('http://localhost/api/leads?status=new')

      const response = await GET(request)
      const json = await response.json()

      expect(json.success).toBe(true)
    })
  })
})

describe('Lead Revenue Calculation', () => {
  it('should calculate gym revenue correctly', async () => {
    const gymData = {
      vertical: 'gym',
      source: 'test',
      email: 'test@example.com',
      contactName: 'Test',
      monthlyGuests: '1000', // 1000 * 0.65 * 14 * 12 = 109,200
    }

    const request = new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify(gymData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const json = await response.json()

    // 1000 monthly * 0.65 opt-in * $14 * 12 months
    const expectedRevenue = Math.round(1000 * 0.65 * 14 * 12)
    expect(json.data.estimatedRevenue).toBe(expectedRevenue)
  })

  it('should calculate wellness revenue correctly', async () => {
    const wellnessData = {
      vertical: 'wellness',
      source: 'test',
      email: 'test@example.com',
      contactName: 'Test',
      monthlyClients: '500', // 500 * 0.65 * 14 * 12 = 54,600
    }

    const request = new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify(wellnessData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const json = await response.json()

    const expectedRevenue = Math.round(500 * 0.65 * 14 * 12)
    expect(json.data.estimatedRevenue).toBe(expectedRevenue)
  })

  it('should calculate ski-resort revenue correctly', async () => {
    const skiData = {
      vertical: 'ski-resort',
      source: 'test',
      email: 'test@example.com',
      contactName: 'Test',
      dailyVisitors: '1000',
      seasonLength: '120', // 1000 * 120 * 0.65 * 14 = 1,092,000
    }

    const request = new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify(skiData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const json = await response.json()

    const expectedRevenue = Math.round(1000 * 120 * 0.65 * 14)
    expect(json.data.estimatedRevenue).toBe(expectedRevenue)
  })

  it('should calculate fitness event revenue correctly', async () => {
    const fitnessData = {
      vertical: 'fitness',
      source: 'test',
      email: 'test@example.com',
      contactName: 'Test',
      expectedParticipants: '500',
      eventsPerYear: '12', // 500 * 12 * 0.65 * 14 = 54,600
    }

    const request = new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify(fitnessData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const json = await response.json()

    const expectedRevenue = Math.round(500 * 12 * 0.65 * 14)
    expect(json.data.estimatedRevenue).toBe(expectedRevenue)
  })

  it('should return 0 revenue for other verticals without volume', async () => {
    const otherData = {
      vertical: 'other',
      source: 'test',
      email: 'test@example.com',
      contactName: 'Test',
    }

    const request = new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify(otherData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const json = await response.json()

    expect(json.data.estimatedRevenue).toBe(0)
  })
})
