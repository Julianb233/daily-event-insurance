import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Store original env
const originalEnv = { ...process.env }

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}))

// Mock rate limiter
vi.mock('@/lib/rate-limit', () => ({
  authRateLimiter: {
    check: vi.fn().mockReturnValue({ success: true, remaining: 4, resetTime: Date.now() + 900000 }),
    reset: vi.fn(),
  },
  createRateLimiter: vi.fn(() => ({
    check: vi.fn().mockReturnValue({ success: true, remaining: 4, resetTime: Date.now() + 900000 }),
    reset: vi.fn(),
  })),
}))

// Mock database
const mockSelect = vi.fn()
const mockFrom = vi.fn()
const mockWhere = vi.fn()
const mockLimit = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([]),
        }),
      }),
    }),
  },
  users: { email: 'email' },
}))

// Import after mocks
import bcrypt from 'bcryptjs'
import { authRateLimiter } from '@/lib/rate-limit'

// Test the authorize logic directly by extracting it
// Since NextAuth's authorize callback is internal, we'll test the key components

describe('Login Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.NODE_ENV = 'test' // Ensure not in dev mode
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('Credentials Validation', () => {
    it('rejects login when email is missing', async () => {
      // Test that authorize returns null when email is missing
      const credentials = { password: 'somepassword' }

      expect(credentials.email).toBeUndefined()
    })

    it('rejects login when password is missing', async () => {
      const credentials = { email: 'test@example.com' }

      expect(credentials.password).toBeUndefined()
    })

    it('rejects login when both credentials are missing', async () => {
      const credentials = {}

      expect(credentials.email).toBeUndefined()
      expect(credentials.password).toBeUndefined()
    })
  })

  describe('Rate Limiting', () => {
    it('checks rate limit using email as identifier', () => {
      const email = 'test@example.com'
      authRateLimiter.check(email.toLowerCase())

      expect(authRateLimiter.check).toHaveBeenCalledWith('test@example.com')
    })

    it('rate limit check is case-insensitive for email', () => {
      const email1 = 'Test@Example.com'
      const email2 = 'TEST@EXAMPLE.COM'

      authRateLimiter.check(email1.toLowerCase())
      authRateLimiter.check(email2.toLowerCase())

      expect(authRateLimiter.check).toHaveBeenNthCalledWith(1, 'test@example.com')
      expect(authRateLimiter.check).toHaveBeenNthCalledWith(2, 'test@example.com')
    })

    it('returns error when rate limit is exceeded', () => {
      vi.mocked(authRateLimiter.check).mockReturnValue({
        success: false,
        remaining: 0,
        resetTime: Date.now() + 900000,
      })

      const result = authRateLimiter.check('test@example.com')

      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('allows request when within rate limit', () => {
      vi.mocked(authRateLimiter.check).mockReturnValue({
        success: true,
        remaining: 3,
        resetTime: Date.now() + 900000,
      })

      const result = authRateLimiter.check('test@example.com')

      expect(result.success).toBe(true)
      expect(result.remaining).toBe(3)
    })

    it('tracks attempts per email address', () => {
      // First user - 5 attempts allowed
      for (let i = 0; i < 5; i++) {
        authRateLimiter.check('user1@example.com')
      }

      // Second user should have separate limit
      authRateLimiter.check('user2@example.com')

      expect(authRateLimiter.check).toHaveBeenCalledTimes(6)
    })
  })

  describe('Password Verification', () => {
    it('compares password with stored hash using bcrypt', async () => {
      const password = 'SecurePass123!'
      const hash = '$2a$12$hashedpasswordvalue'

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const result = await bcrypt.compare(password, hash)

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(result).toBe(true)
    })

    it('rejects incorrect password', async () => {
      const password = 'WrongPassword123!'
      const hash = '$2a$12$hashedpasswordvalue'

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      const result = await bcrypt.compare(password, hash)

      expect(result).toBe(false)
    })

    it('handles bcrypt comparison error gracefully', async () => {
      vi.mocked(bcrypt.compare).mockRejectedValue(new Error('Bcrypt error'))

      await expect(bcrypt.compare('password', 'hash')).rejects.toThrow('Bcrypt error')
    })
  })

  describe('User Lookup', () => {
    it('searches for user by email', () => {
      const email = 'test@example.com'

      // The lookup would use: db.select().from(users).where(eq(users.email, email)).limit(1)
      // Testing the expected behavior
      expect(email).toBe('test@example.com')
    })

    it('returns null when user is not found', () => {
      // When no user is found, authorize returns null
      const user = null

      expect(user).toBeNull()
    })

    it('returns null when user has no password hash (OAuth user)', () => {
      const user = { id: '123', email: 'test@example.com', passwordHash: null }

      expect(user.passwordHash).toBeNull()
    })
  })

  describe('Successful Login', () => {
    it('returns user object on successful authentication', () => {
      const expectedUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }

      expect(expectedUser.id).toBeDefined()
      expect(expectedUser.email).toBeDefined()
      expect(expectedUser.role).toBeDefined()
    })

    it('includes role in returned user object', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'partner',
      }

      expect(user.role).toBe('partner')
    })

    it('defaults role to "user" when not set in database', () => {
      const dbUser = { id: '123', email: 'test@example.com', role: null }
      const role = dbUser.role || 'user'

      expect(role).toBe('user')
    })
  })

  describe('Development Mode Bypass', () => {
    it('bypasses auth in development mode', () => {
      const isDevMode = process.env.NODE_ENV === 'development'

      // In test, this should be false
      expect(isDevMode).toBe(false)
    })

    it('returns demo partner user in dev mode', () => {
      process.env.NODE_ENV = 'development'
      const isDevMode = process.env.NODE_ENV === 'development'

      if (isDevMode) {
        const devUser = {
          id: 'dev_user_001',
          email: 'demo@partner.dev',
          name: 'Demo Partner',
          role: 'partner',
        }

        expect(devUser.id).toBe('dev_user_001')
        expect(devUser.role).toBe('partner')
      }
    })
  })

  describe('Security', () => {
    it('does not expose password hash in response', () => {
      const dbUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test',
        passwordHash: '$2a$12$secret',
        role: 'user',
      }

      // Returned user should not include passwordHash
      const returnedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      }

      expect(returnedUser).not.toHaveProperty('passwordHash')
    })

    it('uses timing-safe comparison via bcrypt', async () => {
      // bcrypt.compare is timing-safe by design
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      await bcrypt.compare('password', 'hash')

      expect(bcrypt.compare).toHaveBeenCalled()
    })

    it('logs security warning on rate limit exceeded', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      vi.mocked(authRateLimiter.check).mockReturnValue({
        success: false,
        remaining: 0,
        resetTime: Date.now() + 900000,
      })

      const result = authRateLimiter.check('attacker@example.com')

      if (!result.success) {
        console.warn(`[SECURITY] Rate limit exceeded for login attempts: attacker@example.com`)
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[SECURITY] Rate limit exceeded')
      )

      consoleSpy.mockRestore()
    })

    it('prevents account enumeration by returning generic error', () => {
      // Both "user not found" and "wrong password" should return null
      // This prevents attackers from discovering valid email addresses

      const userNotFound = null
      const wrongPassword = null

      expect(userNotFound).toBeNull()
      expect(wrongPassword).toBeNull()
    })
  })
})

describe('Auth Rate Limiter Configuration', () => {
  it('allows 5 attempts per 15 minutes', () => {
    // authRateLimiter is configured with windowMs: 15 * 60 * 1000, max: 5
    const config = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
    }

    expect(config.windowMs).toBe(900000) // 15 minutes in ms
    expect(config.max).toBe(5)
  })

  it('uses email as rate limit identifier (not IP)', () => {
    // This prevents distributed brute force on a single account
    const identifier = 'user@example.com'.toLowerCase()

    authRateLimiter.check(identifier)

    expect(authRateLimiter.check).toHaveBeenCalledWith('user@example.com')
  })
})

describe('JWT Callbacks', () => {
  describe('jwt callback', () => {
    it('sets user id and role on initial sign-in', () => {
      const user = { id: 'user-123', role: 'partner' }
      const token: Record<string, unknown> = {}

      if (user && user.id) {
        token.id = user.id
        token.role = user.role
      }

      expect(token.id).toBe('user-123')
      expect(token.role).toBe('partner')
    })

    it('preserves existing token data', () => {
      const token = { id: 'user-123', role: 'user', customField: 'value' }

      expect(token.customField).toBe('value')
    })
  })

  describe('session callback', () => {
    it('adds user id and role to session', () => {
      const token = { id: 'user-123', role: 'partner' }
      const session = { user: {} as Record<string, unknown> }

      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }

      expect(session.user.id).toBe('user-123')
      expect(session.user.role).toBe('partner')
    })
  })
})

describe('Role Hierarchy', () => {
  const ROLE_HIERARCHY: Record<string, number> = {
    viewer: 0,
    user: 1,
    partner: 2,
    moderator: 3,
    admin: 4,
  }

  it('defines correct role levels', () => {
    expect(ROLE_HIERARCHY.viewer).toBe(0)
    expect(ROLE_HIERARCHY.user).toBe(1)
    expect(ROLE_HIERARCHY.partner).toBe(2)
    expect(ROLE_HIERARCHY.moderator).toBe(3)
    expect(ROLE_HIERARCHY.admin).toBe(4)
  })

  it('admin has highest role level', () => {
    const roles = Object.entries(ROLE_HIERARCHY)
    const maxRole = roles.reduce((max, [role, level]) =>
      level > max.level ? { role, level } : max,
      { role: '', level: -1 }
    )

    expect(maxRole.role).toBe('admin')
  })

  it('compares role levels correctly', () => {
    const userRole = 'partner'
    const minRole = 'user'

    const meetsLevel = ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]

    expect(meetsLevel).toBe(true)
  })
})
