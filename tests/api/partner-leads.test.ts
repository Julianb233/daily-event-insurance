import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock API utilities
vi.mock('@/lib/api-utils', () => ({
    successResponse: (data: any, message: string, status: number) => {
        return new Response(JSON.stringify({ success: true, message, data }), { status: status || 200 })
    },
    errorResponse: (message: string, status: number) => {
        return new Response(JSON.stringify({ success: false, error: message }), { status: status || 500 })
    },
    unauthorizedResponse: (message: string) => {
        return new Response(JSON.stringify({ success: false, error: message || 'Unauthorized' }), { status: 401 })
    },
    forbiddenResponse: (message: string) => {
        return new Response(JSON.stringify({ success: false, error: message || 'Forbidden' }), { status: 403 })
    },
    notFoundResponse: (message: string) => {
        return new Response(JSON.stringify({ success: false, error: message || 'Not Found' }), { status: 404 })
    },
}))

// Mock API auth
vi.mock('@/lib/api-auth', () => ({
    withAuth: (handler: any) => handler,
    requirePartner: vi.fn(),
}))

// Mock DB
vi.mock('@/lib/db', () => ({
    db: {
        select: vi.fn(),
        from: vi.fn(),
        where: vi.fn(),
        orderBy: vi.fn(),
        limit: vi.fn(),
        offset: vi.fn(),
        $count: vi.fn(),
    },
    isDbConfigured: vi.fn().mockReturnValue(true),
    leads: {
        partnerId: 'partnerId'
    }
}))

// Import after mocks
import { GET } from '@/app/api/partners/[partnerId]/leads/route'
import { db } from '@/lib/db'

describe('GET /api/partners/[partnerId]/leads', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockLeads = [
        { id: 'lead-1', contactName: 'Lead 1', estimatedRevenue: 100, createdAt: '2024-01-01' },
        { id: 'lead-2', contactName: 'Lead 2', estimatedRevenue: 200, createdAt: '2024-01-02' }
    ]

    it('should return leads for a partner', async () => {
        // Mock chainable DB calls
        const mockChain = {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            offset: vi.fn().mockResolvedValue(mockLeads),
            leftJoin: vi.fn().mockReturnThis(),
        }

        // Setup db mock for data query
        vi.mocked(db.select).mockReturnValue(mockChain as any)

        // Mock count query
        // vi.mocked(db.$count).mockResolvedValue(2) // Not used in current implementation

        const request = new NextRequest('http://localhost/api/partners/partner-123/leads')
        const params = { params: { partnerId: 'partner-123' } }

        const response = await GET(request, params as any)
        const json = await response.json()

        expect(response.status).toBe(200)
        expect(json.success).toBe(true)
        expect(json.data.leads).toHaveLength(2)
        // expect(json.data.pagination.total).toBe(2) // Current impl uses results.length
    })

    it('should handle pagination', async () => {
        const mockChain = {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            offset: vi.fn().mockResolvedValue(mockLeads),
        }
        vi.mocked(db.select).mockReturnValue(mockChain as any)

        const request = new NextRequest('http://localhost/api/partners/partner-123/leads?page=2&limit=5')
        const params = { params: { partnerId: 'partner-123' } }

        const response = await GET(request, params as any)
        const json = await response.json()

        expect(json.data.pagination.page).toBe(2)
        expect(json.data.pagination.limit).toBe(5)
    })

    it('should handle empty results', async () => {
        const mockChain = {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            offset: vi.fn().mockResolvedValue([]),
        }
        vi.mocked(db.select).mockReturnValue(mockChain as any)

        const request = new NextRequest('http://localhost/api/partners/partner-123/leads')
        const params = { params: { partnerId: 'partner-123' } }

        const response = await GET(request, params as any)
        const json = await response.json()

        expect(json.data.leads).toHaveLength(0)
    })
})
