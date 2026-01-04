import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock modules before imports
vi.mock('@/lib/db', () => ({
  db: null,
  users: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
  },
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password_123'),
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  registrationRateLimiter: {
    check: vi.fn().mockReturnValue({ success: true, remaining: 2, resetTime: Date.now() + 3600000 }),
    reset: vi.fn(),
  },
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  rateLimitResponse: vi.fn().mockReturnValue(
    new Response(JSON.stringify({ error: 'Too Many Requests' }), { status: 429 })
  ),
}))

// Import after mocks
import { POST } from '@/app/api/auth/register/route'
import * as dbModule from '@/lib/db'
import * as rateLimitModule from '@/lib/rate-limit'

// Valid password that meets all requirements (12+ chars, upper, lower, number, special)
const VALID_PASSWORD = 'SecurePass123!'

describe('/api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset rate limiter to allow requests
    vi.mocked(rateLimitModule.registrationRateLimiter.check).mockReturnValue({
      success: true,
      remaining: 2,
      resetTime: Date.now() + 3600000,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Input Validation', () => {
    it('returns 400 when email is missing', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' })
        ])
      )
    })

    it('returns 400 when password is missing', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Missing password is a general validation error, not a password strength issue
      expect(data.error).toBe('Validation failed')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      )
    })

    it('returns 400 when both email and password are missing', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details.length).toBeGreaterThanOrEqual(2)
    })

    it('returns 400 for invalid email format', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('email')
          })
        ])
      )
    })

    it('returns 400 for email without domain', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('normalizes email to lowercase', async () => {
      const mockNewUser = {
        id: 'new-user-123',
        email: 'test@example.com',
        name: null,
        role: 'user',
      }

      const mockInsertValues = vi.fn()
      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockReturnThis()
      const mockValues = vi.fn().mockImplementation((data) => {
        mockInsertValues(data)
        return { returning: vi.fn().mockResolvedValue([mockNewUser]) }
      })

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })
      mockInsert.mockReturnValue({ values: mockValues })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'TEST@EXAMPLE.COM',
          password: VALID_PASSWORD,
        }),
      })

      await POST(request)

      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' })
      )
    })
  })

  describe('Password Validation', () => {
    it('returns 400 when password is less than 12 characters', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Short1!',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('12 characters')
          })
        ])
      )
    })

    it('returns 400 when password lacks uppercase letter', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'lowercaseonly123!',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Password-only errors return password-specific message
      expect(data.error).toContain('Password does not meet')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      )
    })

    it('returns 400 when password lacks lowercase letter', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'UPPERCASEONLY123!',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Password-only errors return password-specific message
      expect(data.error).toContain('Password does not meet')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      )
    })

    it('returns 400 when password lacks number', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'NoNumbersHere!!',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Password-only errors return password-specific message
      expect(data.error).toContain('Password does not meet')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      )
    })

    it('returns 400 when password lacks special character', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'NoSpecialChar123',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Password-only errors return password-specific message
      expect(data.error).toContain('Password does not meet')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' })
        ])
      )
    })

    it('includes password requirements in error response', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'weak',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.requirements).toBeDefined()
      expect(Array.isArray(data.requirements)).toBe(true)
    })
  })

  describe('Rate Limiting', () => {
    it('returns 429 when rate limit is exceeded', async () => {
      vi.mocked(rateLimitModule.registrationRateLimiter.check).mockReturnValue({
        success: false,
        remaining: 0,
        resetTime: Date.now() + 3600000,
      })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(429)
    })

    it('extracts client IP from request headers', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      await POST(request)

      expect(rateLimitModule.getClientIP).toHaveBeenCalled()
    })
  })

  describe('Duplicate Email Handling', () => {
    it('returns generic error for duplicate email (prevents enumeration)', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([
        { id: 'existing-user', email: 'test@example.com' },
      ])

      vi.mocked(dbModule).db = {
        select: mockSelect,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      // Should NOT reveal that email already exists
      expect(data.error).not.toContain('already exists')
      expect(data.error).not.toContain('duplicate')
      expect(data.error).toContain('Unable to create account')
    })
  })

  describe('Database Configuration', () => {
    it('returns 500 when database is not configured', async () => {
      vi.mocked(dbModule).db = null as any

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toContain('Database not configured')
    })
  })

  describe('Successful Registration', () => {
    it('creates user with valid credentials', async () => {
      const mockNewUser = {
        id: 'new-user-123',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'user',
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockReturnThis()
      const mockValues = vi.fn().mockReturnThis()
      const mockReturning = vi.fn().mockResolvedValue([mockNewUser])

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })
      mockInsert.mockReturnValue({ values: mockValues })
      mockValues.mockReturnValue({ returning: mockReturning })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New User',
          email: 'newuser@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toHaveProperty('id')
      expect(data.user).toHaveProperty('email')
      expect(data.user.email).toBe('newuser@example.com')
    })

    it('creates user without name (optional field)', async () => {
      const mockNewUser = {
        id: 'new-user-456',
        email: 'noname@example.com',
        name: null,
        role: 'user',
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockReturnThis()
      const mockValues = vi.fn().mockReturnThis()
      const mockReturning = vi.fn().mockResolvedValue([mockNewUser])

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })
      mockInsert.mockReturnValue({ values: mockValues })
      mockValues.mockReturnValue({ returning: mockReturning })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'noname@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('does not return password hash in response', async () => {
      const mockNewUser = {
        id: 'new-user-789',
        email: 'secure@example.com',
        name: 'Secure User',
        role: 'user',
        passwordHash: 'should_not_be_returned',
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockReturnThis()
      const mockValues = vi.fn().mockReturnThis()
      const mockReturning = vi.fn().mockResolvedValue([mockNewUser])

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })
      mockInsert.mockReturnValue({ values: mockValues })
      mockValues.mockReturnValue({ returning: mockReturning })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Secure User',
          email: 'secure@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.user).not.toHaveProperty('passwordHash')
      expect(data.user).not.toHaveProperty('password')
    })

    it('assigns default role of "user" to new registrations', async () => {
      const mockInsertValues = vi.fn()
      const mockNewUser = {
        id: 'new-user',
        email: 'test@example.com',
        name: 'Test',
        role: 'user',
      }

      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockReturnThis()
      const mockValues = vi.fn().mockImplementation((data) => {
        mockInsertValues(data)
        return { returning: vi.fn().mockResolvedValue([mockNewUser]) }
      })

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })
      mockInsert.mockReturnValue({ values: mockValues })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      await POST(request)

      expect(mockInsertValues).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'user' })
      )
    })
  })

  describe('Error Handling', () => {
    it('returns 500 on database error during user lookup', async () => {
      const mockSelect = vi.fn().mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      vi.mocked(dbModule).db = {
        select: mockSelect,
      } as any

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toContain('Failed to register user')
    })

    it('returns 500 on database error during insert', async () => {
      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockImplementation(() => {
        throw new Error('Insert failed')
      })

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toContain('Failed to register user')
    })

    it('returns 400 for malformed JSON', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json {{{',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid JSON')
    })

    it('returns 400 for empty request body', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('Security', () => {
    it('uses bcrypt for password hashing with cost factor 12', async () => {
      const bcrypt = await import('bcryptjs')

      const mockSelect = vi.fn().mockReturnThis()
      const mockFrom = vi.fn().mockReturnThis()
      const mockWhere = vi.fn().mockReturnThis()
      const mockLimit = vi.fn().mockResolvedValue([])
      const mockInsert = vi.fn().mockReturnThis()
      const mockValues = vi.fn().mockReturnThis()
      const mockReturning = vi.fn().mockResolvedValue([{ id: '1', email: 'test@example.com', name: null }])

      vi.mocked(dbModule).db = {
        select: mockSelect,
        insert: mockInsert,
      } as any

      mockSelect.mockReturnValue({ from: mockFrom })
      mockFrom.mockReturnValue({ where: mockWhere })
      mockWhere.mockReturnValue({ limit: mockLimit })
      mockInsert.mockReturnValue({ values: mockValues })
      mockValues.mockReturnValue({ returning: mockReturning })

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: VALID_PASSWORD,
        }),
      })

      await POST(request)

      // bcrypt.hash should be called with password and cost factor 12
      expect(bcrypt.default.hash).toHaveBeenCalledWith(VALID_PASSWORD, 12)
    })

    it('rejects common weak passwords', async () => {
      vi.mocked(dbModule).db = {} as any // Not null but won't be used

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Password123!', // Common pattern
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      // Should fail due to password strength validation
      expect(response.status).toBe(400)
    })
  })
})
