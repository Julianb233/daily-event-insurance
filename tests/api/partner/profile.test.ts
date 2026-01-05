import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Mock modules first before any imports
vi.mock('@/lib/api-auth', () => ({
  withAuth: vi.fn((handler: () => Promise<Response>) => handler()),
  requirePartner: vi.fn().mockResolvedValue({ userId: 'user-123' }),
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
  isDbConfigured: vi.fn().mockReturnValue(true),
  partners: { id: 'id', userId: 'userId' },
  partnerProducts: { partnerId: 'partnerId', id: 'id' },
  microsites: { partnerId: 'partnerId' },
}))

vi.mock('@/lib/mock-data', () => ({
  isDevMode: false,
  MOCK_PARTNER: {
    id: 'mock-partner-id',
    businessName: 'Mock Gym',
    contactEmail: 'mock@example.com',
  },
  MOCK_PRODUCTS: [
    { productType: 'liability', isEnabled: true, customerPrice: '4.99' },
  ],
}))

import { GET, PATCH } from '@/app/api/partner/profile/route'
import { requirePartner } from '@/lib/api-auth'
import { db, isDbConfigured } from '@/lib/db'

describe('/api/partner/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(requirePartner).mockResolvedValue({ userId: 'user-123', user: {} })
  })

  describe('GET /api/partner/profile', () => {
    it('should return partner profile when found', async () => {
      const mockPartner = {
        id: 'partner-123',
        userId: 'user-123',
        businessName: 'Test Gym',
        contactEmail: 'test@example.com',
      }
      const mockProducts = [
        { productType: 'liability', isEnabled: true, customerPrice: '4.99' },
      ]
      const mockMicrosite = { id: 'microsite-123', subdomain: 'testgym' }

      // Setup mock chain - products query doesn't use .limit()
      let selectCallCount = 0
      const fromMock = vi.fn().mockImplementation(() => {
        selectCallCount++
        if (selectCallCount === 1) {
          // Partners query (uses .limit())
          return {
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockPartner]),
            }),
          }
        } else if (selectCallCount === 2) {
          // Products query (no .limit())
          return {
            where: vi.fn().mockResolvedValue(mockProducts),
          }
        } else {
          // Microsite query (uses .limit())
          return {
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockMicrosite]),
            }),
          }
        }
      })
      vi.mocked(db!.select).mockReturnValue({ from: fromMock } as any)

      const request = new NextRequest('http://localhost/api/partner/profile')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.partner).toEqual(mockPartner)
      expect(json.products).toEqual(mockProducts)
    })

    it('should return 404 when partner not found', async () => {
      const limitMock = vi.fn().mockResolvedValue([])
      const whereMock = vi.fn().mockReturnValue({ limit: limitMock })
      const fromMock = vi.fn().mockReturnValue({ where: whereMock })
      vi.mocked(db!.select).mockReturnValue({ from: fromMock } as any)

      const request = new NextRequest('http://localhost/api/partner/profile')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json.error).toBe('Partner not found')
    })

    it('should return mock data when db not configured', async () => {
      vi.mocked(isDbConfigured).mockReturnValue(false)

      const request = new NextRequest('http://localhost/api/partner/profile')
      const response = await GET(request)
      const json = await response.json()

      expect(response.status).toBe(200)
      expect(json.partner).toBeDefined()
      expect(json.products).toBeDefined()
    })

    it('should require partner authentication', async () => {
      vi.mocked(isDbConfigured).mockReturnValue(false)

      await GET(new NextRequest('http://localhost/api/partner/profile'))
      expect(requirePartner).toHaveBeenCalled()
    })
  })

  describe('PATCH /api/partner/profile', () => {
    it('should return 404 when partner not found', async () => {
      vi.mocked(isDbConfigured).mockReturnValue(true)

      const limitMock = vi.fn().mockResolvedValue([])
      const whereMock = vi.fn().mockReturnValue({ limit: limitMock })
      const fromMock = vi.fn().mockReturnValue({ where: whereMock })
      vi.mocked(db!.select).mockReturnValue({ from: fromMock } as any)

      const request = new NextRequest('http://localhost/api/partner/profile', {
        method: 'PATCH',
        body: JSON.stringify({ businessName: 'Updated Gym' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PATCH(request)
      const json = await response.json()

      expect(response.status).toBe(404)
      expect(json.error).toBe('Partner not found')
    })

    it('should return 503 when database not configured', async () => {
      vi.mocked(isDbConfigured).mockReturnValue(false)

      const request = new NextRequest('http://localhost/api/partner/profile', {
        method: 'PATCH',
        body: JSON.stringify({ businessName: 'Updated Gym' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PATCH(request)
      const json = await response.json()

      expect(response.status).toBe(503)
      expect(json.error).toBe('Configuration error')
    })

    it('should update partner profile when found', async () => {
      vi.mocked(isDbConfigured).mockReturnValue(true)

      const mockPartner = {
        id: 'partner-123',
        userId: 'user-123',
        businessName: 'Test Gym',
      }
      const updatedPartner = { ...mockPartner, businessName: 'Updated Gym' }

      const limitMock = vi.fn()
        .mockResolvedValueOnce([mockPartner]) // Initial lookup
        .mockResolvedValueOnce([updatedPartner]) // After update
        .mockResolvedValueOnce([]) // Products

      const whereMock = vi.fn().mockReturnValue({ limit: limitMock })
      const fromMock = vi.fn().mockReturnValue({ where: whereMock })
      vi.mocked(db!.select).mockReturnValue({ from: fromMock } as any)

      const setMock = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) })
      vi.mocked(db!.update).mockReturnValue({ set: setMock } as any)

      const request = new NextRequest('http://localhost/api/partner/profile', {
        method: 'PATCH',
        body: JSON.stringify({ businessName: 'Updated Gym' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PATCH(request)
      expect(response.status).toBe(200)
    })

    it('should handle product updates', async () => {
      vi.mocked(isDbConfigured).mockReturnValue(true)

      const mockPartner = { id: 'partner-123', userId: 'user-123' }

      const limitMock = vi.fn()
        .mockResolvedValueOnce([mockPartner]) // Partner lookup
        .mockResolvedValueOnce([]) // Existing product check (none)
        .mockResolvedValueOnce([mockPartner]) // Updated partner
        .mockResolvedValueOnce([]) // Products

      const whereMock = vi.fn().mockReturnValue({ limit: limitMock })
      const fromMock = vi.fn().mockReturnValue({ where: whereMock })
      vi.mocked(db!.select).mockReturnValue({ from: fromMock } as any)

      const valuesMock = vi.fn().mockResolvedValue(undefined)
      vi.mocked(db!.insert).mockReturnValue({ values: valuesMock } as any)

      const request = new NextRequest('http://localhost/api/partner/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          products: [{ productType: 'liability', isEnabled: true }],
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await PATCH(request)
      expect(response.status).toBe(200)
    })
  })
})
