import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRateLimiter } from '@/lib/rate-limit'

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
})
