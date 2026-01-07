import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { rateLimits } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

/**
 * Rate Limiting System (Postgres-backed)
 * 
 * Replaces in-memory storage with persistent Postgres storage.
 * This ensures rate limits work across multiple server instances (serverless/clusters).
 * 
 * Strategy: Fixed Window with automated expiry via reset_at
 */

interface RateLimitConfig {
  windowMs: number
  max: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function createRateLimiter(config: RateLimitConfig) {
  return {
    async check(identifier: string): Promise<RateLimitResult> {
      const now = new Date()
      const windowEnd = new Date(now.getTime() + config.windowMs)
      const resetTimeEpoch = windowEnd.getTime()

      if (!db) {
        // Fallback for when DB isn't configured (e.g. build time or minimal dev env)
        console.warn("[RateLimit] DB not configured, allowing request")
        return { success: true, remaining: config.max, resetTime: resetTimeEpoch }
      }

      try {
        // Atomic Upsert (Insert or Update)
        // If entry exists and hasn't expired, increment count
        // If entry exists but expired, reset count to 1 and update reset time
        // If entry doesn't exist, insert new
        
        // Note: Drizzle's onConflictDoUpdate is perfect here
        const [record] = await db
          .insert(rateLimits)
          .values({
            key: identifier,
            count: 1,
            resetAt: windowEnd
          })
          .onConflictDoUpdate({
            target: rateLimits.key,
            set: {
              count: sql`
                CASE 
                  WHEN ${rateLimits.resetAt} > ${now} THEN ${rateLimits.count} + 1
                  ELSE 1
                END
              `,
              resetAt: sql`
                CASE 
                  WHEN ${rateLimits.resetAt} > ${now} THEN ${rateLimits.resetAt}
                  ELSE ${windowEnd}
                END
              `
            }
          })
          .returning()

        const remaining = Math.max(0, config.max - record.count)
        const success = record.count <= config.max

        return {
          success,
          remaining,
          resetTime: record.resetAt.getTime()
        }

      } catch (error) {
        console.error("[RateLimit] DB Error:", error)
        // Fail open to avoid blocking legitimate traffic on system errors
        return { success: true, remaining: 1, resetTime: resetTimeEpoch }
      }
    },

    async reset(identifier: string): Promise<void> {
      if (!db) return
      await db.delete(rateLimits).where(eq(rateLimits.key, identifier))
    },

    // Get stats (mostly for debugging/admin)
    async getStats(identifier: string): Promise<{ count: number; resetAt: number }> {
      if (!db) return { count: 0, resetAt: Date.now() }
      
      const record = await db.query.rateLimits.findFirst({
        where: eq(rateLimits.key, identifier)
      })

      if (!record) return { count: 0, resetAt: Date.now() }

      return {
        count: record.count,
        resetAt: record.resetAt.getTime()
      }
    }
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const headers = request.headers
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  const realIP = headers.get("x-real-ip")
  if (realIP) return realIP
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

// Pre-configured limiters
export const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 })
export const registrationRateLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 3 })
export const apiRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 60 })
export const strictRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 3 })
export const leadRateLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 5 })
export const quoteRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 10 })
export const webhookRateLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10 })
export const scrapeRateLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 10 })
