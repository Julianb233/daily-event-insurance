import { NextResponse } from "next/server"

/**
 * In-memory rate limiter using sliding window algorithm
 * For production with multiple instances, consider @upstash/ratelimit with Redis
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60000, max: 5 })
 *
 *   export async function POST(request: Request) {
 *     const ip = getClientIP(request)
 *     const { success, remaining } = limiter.check(ip)
 *     if (!success) {
 *       return rateLimitResponse(remaining)
 *     }
 *     // ... handle request
 *   }
 */

interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  max: number       // Max requests per window
}

interface SlidingWindowEntry {
  timestamps: number[]  // Timestamps of requests within the window
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

// In-memory store using sliding window (cleared on server restart)
// For production, use Redis or Upstash
const slidingStores = new Map<string, Map<string, SlidingWindowEntry>>()

/**
 * Creates a rate limiter using sliding window algorithm
 * This provides smoother rate limiting than fixed windows by considering
 * requests across a rolling time period
 */
export function createRateLimiter(config: RateLimitConfig) {
  const storeId = `sliding-${config.windowMs}-${config.max}`

  if (!slidingStores.has(storeId)) {
    slidingStores.set(storeId, new Map())
  }

  const store = slidingStores.get(storeId)!

  // Cleanup old entries periodically (every window period)
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    const windowStart = now - config.windowMs
    for (const [key, entry] of store.entries()) {
      // Remove timestamps outside the window
      entry.timestamps = entry.timestamps.filter(ts => ts > windowStart)
      // Remove entry if no timestamps remain
      if (entry.timestamps.length === 0) {
        store.delete(key)
      }
    }
  }, config.windowMs)

  // Prevent interval from keeping process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref()
  }

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now()
      const windowStart = now - config.windowMs

      let entry = store.get(identifier)

      if (!entry) {
        entry = { timestamps: [] }
        store.set(identifier, entry)
      }

      // Remove timestamps outside the sliding window
      entry.timestamps = entry.timestamps.filter(ts => ts > windowStart)

      // Check if over limit
      if (entry.timestamps.length >= config.max) {
        // Find the oldest timestamp in window to calculate reset time
        const oldestTimestamp = Math.min(...entry.timestamps)
        const resetTime = oldestTimestamp + config.windowMs
        return { success: false, remaining: 0, resetTime }
      }

      // Add current request timestamp
      entry.timestamps.push(now)

      const remaining = config.max - entry.timestamps.length
      const resetTime = now + config.windowMs

      return { success: true, remaining, resetTime }
    },

    reset(identifier: string): void {
      store.delete(identifier)
    },

    getStats(identifier: string): { count: number; windowStart: number } {
      const now = Date.now()
      const windowStart = now - config.windowMs
      const entry = store.get(identifier)

      if (!entry) {
        return { count: 0, windowStart }
      }

      const activeTimestamps = entry.timestamps.filter(ts => ts > windowStart)
      return { count: activeTimestamps.length, windowStart }
    }
  }
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
export function getClientIP(request: Request): string {
  const headers = request.headers

  // Vercel
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  // Cloudflare
  const cfConnectingIP = headers.get("cf-connecting-ip")
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Real IP header
  const realIP = headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }

  // Fallback
  return "unknown"
}

/**
 * Standard rate limit exceeded response
 */
export function rateLimitResponse(retryAfterMs: number = 60000): NextResponse {
  const retryAfterSec = Math.ceil(retryAfterMs / 1000)

  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: retryAfterSec
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Remaining": "0"
      }
    }
  )
}

// Pre-configured rate limiters for common use cases

/** Auth limiter: 5 attempts per 15 minutes (login, password reset) */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per 15 minutes
})

/** Registration limiter: 3 registrations per hour per IP */
export const registrationRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3 // 3 registrations per hour per IP
})

/** API limiter: 60 requests per minute (general API usage) */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60 // 60 requests per minute
})

/** Strict limiter: 3 requests per minute (sensitive operations like quote creation) */
export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 3 // 3 requests per minute
})

/** Lead submission limiter: 5 lead submissions per 5 minutes per IP */
export const leadRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5 // 5 submissions per 5 minutes
})

/** Quote creation limiter: 10 quotes per minute per user */
export const quoteRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 quotes per minute
})
