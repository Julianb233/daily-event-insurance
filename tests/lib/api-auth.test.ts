import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

// Mock createClient from supabase/server
const mockGetUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: () => mockGetUser(),
    },
  }),
}))

// Import after mocks
import {
  requireAuth,
  requireAdmin,
  requirePartner,
  getAuthenticatedUser,
  hasRole,
  withAuth,
} from '@/lib/api-auth'

describe('API Authentication Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('requireAuth', () => {
    it('should return userId when session exists', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      const result = await requireAuth()
      expect(result.userId).toBe('user-123')
    })

    it('should throw 401 when no session exists', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      try {
        await requireAuth()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse)
        const json = await (error as NextResponse).json()
        expect(json.error).toBe('Unauthorized')
      }
    })

    it('should throw 401 when auth error occurs', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error'),
      })

      try {
        await requireAuth()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse)
        const json = await (error as NextResponse).json()
        expect(json.error).toBe('Unauthorized')
      }
    })
  })

  describe('requireAdmin', () => {
    it('should return user data for admin role', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'admin-123',
            email: 'admin@test.com',
            user_metadata: { role: 'admin' },
          },
        },
        error: null,
      })

      const result = await requireAdmin()
      expect(result.userId).toBe('admin-123')
      expect(result.user.id).toBe('admin-123')
    })

    it('should throw 403 for non-admin users', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'user@test.com',
            user_metadata: { role: 'user' },
          },
        },
        error: null,
      })

      try {
        await requireAdmin()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse)
        const response = error as NextResponse
        expect(response.status).toBe(403)
        const json = await response.json()
        expect(json.error).toBe('Forbidden')
        expect(json.message).toBe('Admin access required')
      }
    })

    it('should throw 403 for partner users', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'partner-123',
            email: 'partner@test.com',
            user_metadata: { role: 'partner' },
          },
        },
        error: null,
      })

      try {
        await requireAdmin()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse)
        const response = error as NextResponse
        expect(response.status).toBe(403)
      }
    })

    it('should throw 401 when not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      try {
        await requireAdmin()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse)
        const response = error as NextResponse
        expect(response.status).toBe(401)
      }
    })
  })

  describe('requirePartner', () => {
    it('should return user data for partner role', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'partner-123',
            email: 'partner@test.com',
            user_metadata: { role: 'partner' },
          },
        },
        error: null,
      })

      const result = await requirePartner()
      expect(result.userId).toBe('partner-123')
    })

    it('should allow admin users as partners', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'admin-123',
            email: 'admin@test.com',
            user_metadata: { role: 'admin' },
          },
        },
        error: null,
      })

      const result = await requirePartner()
      expect(result.userId).toBe('admin-123')
    })

    it('should throw 403 for regular users', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'user@test.com',
            user_metadata: { role: 'user' },
          },
        },
        error: null,
      })

      try {
        await requirePartner()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse)
        const response = error as NextResponse
        expect(response.status).toBe(403)
        const json = await response.json()
        expect(json.error).toBe('Forbidden')
        expect(json.message).toBe('Partner access required')
      }
    })
  })

  describe('getAuthenticatedUser', () => {
    it('should return user when authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { role: 'user', name: 'Test User' },
          },
        },
        error: null,
      })

      const result = await getAuthenticatedUser()
      expect(result).not.toBeNull()
      expect(result?.userId).toBe('user-123')
      expect(result?.user.email).toBe('test@example.com')
    })

    it('should return null when not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await getAuthenticatedUser()
      expect(result).toBeNull()
    })

    it('should return null on auth error', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error'),
      })

      const result = await getAuthenticatedUser()
      expect(result).toBeNull()
    })
  })

  describe('hasRole', () => {
    it('should return true when user has the role', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { role: 'admin' },
          },
        },
        error: null,
      })

      const result = await hasRole('admin')
      expect(result).toBe(true)
    })

    it('should return false when user does not have the role', async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: { role: 'user' },
          },
        },
        error: null,
      })

      const result = await hasRole('admin')
      expect(result).toBe(false)
    })

    it('should return false when not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await hasRole('admin')
      expect(result).toBe(false)
    })
  })

  describe('withAuth', () => {
    it('should return handler result on success', async () => {
      const successResponse = NextResponse.json({ data: 'success' })
      const handler = vi.fn().mockResolvedValue(successResponse)

      const result = await withAuth(handler)

      expect(handler).toHaveBeenCalled()
      expect(result).toBe(successResponse)
    })

    it('should return NextResponse errors directly', async () => {
      const errorResponse = NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
      const handler = vi.fn().mockRejectedValue(errorResponse)

      const result = await withAuth(handler)

      expect(result).toBeInstanceOf(NextResponse)
      expect(result.status).toBe(401)
    })

    it('should return 500 for non-NextResponse errors', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Database error'))

      const result = await withAuth(handler)

      expect(result.status).toBe(500)
      const json = await result.json()
      expect(json.error).toBe('Internal Server Error')
    })

    it('should include error message in 500 response', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Custom error message'))

      const result = await withAuth(handler)

      const json = await result.json()
      expect(json.message).toBe('Custom error message')
    })
  })
})

describe('API Auth - Role Hierarchy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('admin should have access to admin routes', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'admin-123',
          user_metadata: { role: 'admin' },
        },
      },
      error: null,
    })

    const result = await requireAdmin()
    expect(result.userId).toBe('admin-123')
  })

  it('partner should have access to partner routes', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'partner-123',
          user_metadata: { role: 'partner' },
        },
      },
      error: null,
    })

    const result = await requirePartner()
    expect(result.userId).toBe('partner-123')
  })

  it('user should NOT have access to partner routes', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          user_metadata: { role: 'user' },
        },
      },
      error: null,
    })

    try {
      await requirePartner()
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(NextResponse)
      expect((error as NextResponse).status).toBe(403)
    }
  })
})
