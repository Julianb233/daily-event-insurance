import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createRateLimiter,
  getClientIP,
  rateLimitResponse,
  authRateLimiter,
  registrationRateLimiter,
  apiRateLimiter,
  strictRateLimiter,
  leadRateLimiter,
  quoteRateLimiter,
} from '@/lib/rate-limit'

describe('Rate Limiter - Sliding Window Algorithm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow requests within the limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    const identifier = 'test-ip-1'

    const result1 = limiter.check(identifier)
    expect(result1.success).toBe(true)
    expect(result1.remaining).toBe(2)

    const result2 = limiter.check(identifier)
    expect(result2.success).toBe(true)
    expect(result2.remaining).toBe(1)

    const result3 = limiter.check(identifier)
    expect(result3.success).toBe(true)
    expect(result3.remaining).toBe(0)
  })

  it('should block requests over the limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    const identifier = 'test-ip-2'

    // Use up the limit
    limiter.check(identifier)
    limiter.check(identifier)
    limiter.check(identifier)

    // Fourth request should be blocked
    const result = limiter.check(identifier)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset after window expires (sliding window)', () => {
    const windowMs = 60000
    const limiter = createRateLimiter({ windowMs, max: 3 })
    const identifier = 'test-ip-3'

    // Use up the limit
    limiter.check(identifier)
    limiter.check(identifier)
    limiter.check(identifier)

    // Should be blocked
    let result = limiter.check(identifier)
    expect(result.success).toBe(false)

    // Advance time past the window
    vi.advanceTimersByTime(windowMs + 1000)

    // Should be allowed again
    result = limiter.check(identifier)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('should track different identifiers separately', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 2 })

    // Use up limit for IP1
    limiter.check('ip1')
    limiter.check('ip1')
    const ip1Result = limiter.check('ip1')
    expect(ip1Result.success).toBe(false)

    // IP2 should still be allowed
    const ip2Result = limiter.check('ip2')
    expect(ip2Result.success).toBe(true)
    expect(ip2Result.remaining).toBe(1)
  })

  it('should provide correct reset time', () => {
    const windowMs = 60000
    const limiter = createRateLimiter({ windowMs, max: 2 })
    const identifier = 'test-ip-4'

    const now = Date.now()
    vi.setSystemTime(now)

    limiter.check(identifier)
    limiter.check(identifier)

    const result = limiter.check(identifier)
    expect(result.success).toBe(false)
    // Reset time should be when the oldest request falls out of the window
    expect(result.resetTime).toBe(now + windowMs)
  })

  it('should support manual reset', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 2 })
    const identifier = 'test-ip-5'

    // Use up the limit
    limiter.check(identifier)
    limiter.check(identifier)

    let result = limiter.check(identifier)
    expect(result.success).toBe(false)

    // Reset the identifier
    limiter.reset(identifier)

    // Should be allowed again
    result = limiter.check(identifier)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(1)
  })

  it('should provide correct stats', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 5 })
    const identifier = 'test-ip-6'

    limiter.check(identifier)
    limiter.check(identifier)
    limiter.check(identifier)

    const stats = limiter.getStats(identifier)
    expect(stats.count).toBe(3)
  })

  it('should return zero count for unknown identifier in getStats', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 5 })
    const stats = limiter.getStats('unknown-identifier')
    expect(stats.count).toBe(0)
  })

  it('should filter out old timestamps in getStats', () => {
    const windowMs = 60000
    const limiter = createRateLimiter({ windowMs, max: 5 })
    const identifier = 'test-ip-stats'

    // Make some requests
    limiter.check(identifier)
    limiter.check(identifier)

    // Advance time past window
    vi.advanceTimersByTime(windowMs + 1000)

    // Stats should show 0 active timestamps
    const stats = limiter.getStats(identifier)
    expect(stats.count).toBe(0)
  })

  it('should reuse existing store for same config', () => {
    const config = { windowMs: 60000, max: 5 }
    const limiter1 = createRateLimiter(config)
    const limiter2 = createRateLimiter(config)

    // Both limiters should share the same store
    limiter1.check('shared-id')
    const result = limiter2.check('shared-id')

    // Second check should show 1 remaining (not 3), proving shared store
    expect(result.remaining).toBe(3)
  })
})

describe('getClientIP', () => {
  it('extracts IP from x-forwarded-for header (Vercel)', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.100, 10.0.0.1, 172.16.0.1',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.100')
  })

  it('trims whitespace from x-forwarded-for', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '  192.168.1.100  , 10.0.0.1',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.100')
  })

  it('extracts IP from cf-connecting-ip header (Cloudflare)', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'cf-connecting-ip': '203.0.113.50',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('203.0.113.50')
  })

  it('extracts IP from x-real-ip header', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-real-ip': '198.51.100.25',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('198.51.100.25')
  })

  it('returns "unknown" when no IP headers present', () => {
    const request = new Request('http://localhost/api/test')

    const ip = getClientIP(request)
    expect(ip).toBe('unknown')
  })

  it('prioritizes x-forwarded-for over other headers', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'cf-connecting-ip': '192.168.1.2',
        'x-real-ip': '192.168.1.3',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.1')
  })

  it('falls back to cf-connecting-ip when x-forwarded-for missing', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'cf-connecting-ip': '192.168.1.2',
        'x-real-ip': '192.168.1.3',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('192.168.1.2')
  })

  it('handles IPv6 addresses', () => {
    const request = new Request('http://localhost/api/test', {
      headers: {
        'x-forwarded-for': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      },
    })

    const ip = getClientIP(request)
    expect(ip).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
  })
})

describe('rateLimitResponse', () => {
  it('returns 429 status code', () => {
    const response = rateLimitResponse()
    expect(response.status).toBe(429)
  })

  it('includes Retry-After header in seconds', () => {
    const response = rateLimitResponse(120000) // 2 minutes
    expect(response.headers.get('Retry-After')).toBe('120')
  })

  it('includes X-RateLimit-Remaining header set to 0', () => {
    const response = rateLimitResponse()
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
  })

  it('returns correct JSON body', async () => {
    const response = rateLimitResponse(60000)
    const body = await response.json()

    expect(body.error).toBe('Too Many Requests')
    expect(body.message).toBe('Rate limit exceeded. Please try again later.')
    expect(body.retryAfter).toBe(60)
  })

  it('uses default 60 second retry when not specified', async () => {
    const response = rateLimitResponse()
    const body = await response.json()

    expect(body.retryAfter).toBe(60)
    expect(response.headers.get('Retry-After')).toBe('60')
  })

  it('rounds up milliseconds to seconds', async () => {
    const response = rateLimitResponse(61500) // 61.5 seconds
    const body = await response.json()

    expect(body.retryAfter).toBe(62) // Rounded up
  })
})

describe('Pre-configured Rate Limiters', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('authRateLimiter', () => {
    it('allows 5 attempts per 15 minutes', () => {
      const identifier = 'auth-test-user'

      // 5 attempts should succeed
      for (let i = 0; i < 5; i++) {
        const result = authRateLimiter.check(identifier)
        expect(result.success).toBe(true)
      }

      // 6th attempt should fail
      const result = authRateLimiter.check(identifier)
      expect(result.success).toBe(false)
    })

    it('resets after 15 minutes', () => {
      const identifier = 'auth-test-reset'

      // Use up the limit
      for (let i = 0; i < 5; i++) {
        authRateLimiter.check(identifier)
      }

      expect(authRateLimiter.check(identifier).success).toBe(false)

      // Advance 15 minutes + 1 second
      vi.advanceTimersByTime(15 * 60 * 1000 + 1000)

      expect(authRateLimiter.check(identifier).success).toBe(true)
    })
  })

  describe('registrationRateLimiter', () => {
    it('allows 3 registrations per hour', () => {
      const identifier = 'reg-test-ip'

      for (let i = 0; i < 3; i++) {
        const result = registrationRateLimiter.check(identifier)
        expect(result.success).toBe(true)
      }

      const result = registrationRateLimiter.check(identifier)
      expect(result.success).toBe(false)
    })
  })

  describe('apiRateLimiter', () => {
    it('allows 60 requests per minute', () => {
      const identifier = 'api-test-user'

      for (let i = 0; i < 60; i++) {
        const result = apiRateLimiter.check(identifier)
        expect(result.success).toBe(true)
      }

      const result = apiRateLimiter.check(identifier)
      expect(result.success).toBe(false)
    })
  })

  describe('strictRateLimiter', () => {
    it('allows 3 requests per minute', () => {
      const identifier = 'strict-test-user'

      for (let i = 0; i < 3; i++) {
        const result = strictRateLimiter.check(identifier)
        expect(result.success).toBe(true)
      }

      const result = strictRateLimiter.check(identifier)
      expect(result.success).toBe(false)
    })
  })

  describe('leadRateLimiter', () => {
    it('allows 5 submissions per 5 minutes', () => {
      const identifier = 'lead-test-ip'

      for (let i = 0; i < 5; i++) {
        const result = leadRateLimiter.check(identifier)
        expect(result.success).toBe(true)
      }

      const result = leadRateLimiter.check(identifier)
      expect(result.success).toBe(false)
    })
  })

  describe('quoteRateLimiter', () => {
    it('allows 10 quotes per minute', () => {
      const identifier = 'quote-test-user'

      for (let i = 0; i < 10; i++) {
        const result = quoteRateLimiter.check(identifier)
        expect(result.success).toBe(true)
      }

      const result = quoteRateLimiter.check(identifier)
      expect(result.success).toBe(false)
    })
  })
})

describe('Rate Limiter Edge Cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('handles empty identifier', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 5 })
    const result = limiter.check('')
    expect(result.success).toBe(true)
  })

  it('handles special characters in identifier', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 5 })
    const result = limiter.check('user@example.com:special/chars?query=1')
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('handles very large max limit', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 10000 })
    const result = limiter.check('high-limit-user')
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(9999)
  })

  it('handles max limit of 1', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 1 })
    const identifier = 'single-request'

    const first = limiter.check(identifier)
    expect(first.success).toBe(true)
    expect(first.remaining).toBe(0)

    const second = limiter.check(identifier)
    expect(second.success).toBe(false)
  })

  it('handles very short window', () => {
    const limiter = createRateLimiter({ windowMs: 100, max: 2 }) // 100ms window
    const identifier = 'short-window'

    limiter.check(identifier)
    limiter.check(identifier)
    expect(limiter.check(identifier).success).toBe(false)

    vi.advanceTimersByTime(150)
    expect(limiter.check(identifier).success).toBe(true)
  })

  it('handles concurrent requests at exact limit boundary', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 3 })
    const identifier = 'boundary-test'

    // Simulate 3 concurrent requests
    const results = [
      limiter.check(identifier),
      limiter.check(identifier),
      limiter.check(identifier),
    ]

    expect(results[0].success).toBe(true)
    expect(results[1].success).toBe(true)
    expect(results[2].success).toBe(true)
    expect(results[2].remaining).toBe(0)

    // Next request should fail
    expect(limiter.check(identifier).success).toBe(false)
  })

  it('sliding window allows new requests as old ones expire', () => {
    const windowMs = 60000
    const limiter = createRateLimiter({ windowMs, max: 3 })
    const identifier = 'sliding-test'

    // Time 0: Make first request
    vi.setSystemTime(0)
    limiter.check(identifier)

    // Time 20s: Make second request
    vi.setSystemTime(20000)
    limiter.check(identifier)

    // Time 40s: Make third request
    vi.setSystemTime(40000)
    limiter.check(identifier)

    // Time 50s: Should be blocked (all 3 still in window)
    vi.setSystemTime(50000)
    expect(limiter.check(identifier).success).toBe(false)

    // Time 61s: First request expired, should allow new one
    vi.setSystemTime(61000)
    expect(limiter.check(identifier).success).toBe(true)
  })
})
