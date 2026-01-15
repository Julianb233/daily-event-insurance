import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  RateLimiter,
  posRateLimiters,
  createRateLimiter,
} from '../shared/rate-limiter'

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('constructor', () => {
    it('should create rate limiter with required config', () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
      })
      expect(limiter).toBeDefined()
    })

    it('should create rate limiter with all options', () => {
      const limiter = new RateLimiter({
        maxRequests: 100,
        windowMs: 60000,
        maxRetries: 5,
        initialRetryDelay: 2000,
        maxRetryDelay: 60000,
      })
      expect(limiter).toBeDefined()
    })
  })

  describe('executeWithRetry', () => {
    it('should execute function successfully on first try', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
      })

      const fn = vi.fn().mockResolvedValue({ data: 'success' })
      const result = await limiter.executeWithRetry('test', fn, {
        isRateLimited: () => false,
      })

      expect(fn).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ data: 'success' })
    })

    it('should retry on rate limit error', async () => {
      vi.useRealTimers() // Use real timers for async retry

      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 3,
        initialRetryDelay: 10, // Short delay for testing
      })

      const rateLimitError = new Error('Rate limited')
      const fn = vi.fn()
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce({ data: 'success' })

      const result = await limiter.executeWithRetry('test', fn, {
        isRateLimited: (error) => error === rateLimitError,
      })

      expect(fn).toHaveBeenCalledTimes(2)
      expect(result).toEqual({ data: 'success' })
    })

    it('should throw non-rate-limit errors immediately', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
      })

      const regularError = new Error('Regular error')
      const fn = vi.fn().mockRejectedValue(regularError)

      await expect(
        limiter.executeWithRetry('test', fn, {
          isRateLimited: () => false,
        })
      ).rejects.toThrow('Regular error')

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should call onRetry callback', async () => {
      vi.useRealTimers()

      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 3,
        initialRetryDelay: 10,
      })

      const onRetry = vi.fn()
      const rateLimitError = new Error('Rate limited')
      const fn = vi.fn()
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValueOnce({ data: 'success' })

      await limiter.executeWithRetry('test', fn, {
        isRateLimited: (error) => error === rateLimitError,
        onRetry,
      })

      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Number))
    })

    it('should transform result when transform option provided', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
      })

      const fn = vi.fn().mockResolvedValue({ value: 5 })
      const result = await limiter.executeWithRetry('test', fn, {
        isRateLimited: () => false,
        transform: (r) => ({ ...r, doubled: r.value * 2 }),
      })

      expect(result).toEqual({ value: 5, doubled: 10 })
    })

    it('should throw after max retries exceeded', async () => {
      vi.useRealTimers()

      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 2,
        initialRetryDelay: 10,
      })

      const rateLimitError = new Error('Rate limited')
      const fn = vi.fn().mockRejectedValue(rateLimitError)

      await expect(
        limiter.executeWithRetry('test', fn, {
          isRateLimited: () => true,
        })
      ).rejects.toThrow()

      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})

describe('posRateLimiters', () => {
  it('should have pre-configured Mindbody limiter', () => {
    expect(posRateLimiters.mindbody).toBeDefined()
    expect(posRateLimiters.mindbody).toBeInstanceOf(RateLimiter)
  })

  it('should have pre-configured Pike13 limiter', () => {
    expect(posRateLimiters.pike13).toBeDefined()
    expect(posRateLimiters.pike13).toBeInstanceOf(RateLimiter)
  })

  it('should have pre-configured Square limiter', () => {
    expect(posRateLimiters.square).toBeDefined()
    expect(posRateLimiters.square).toBeInstanceOf(RateLimiter)
  })
})

describe('createRateLimiter', () => {
  it('should create custom rate limiter', () => {
    const limiter = createRateLimiter({
      maxRequests: 50,
      windowMs: 30000,
    })

    expect(limiter).toBeInstanceOf(RateLimiter)
  })
})
