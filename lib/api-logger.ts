import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${crypto.randomBytes(12).toString("hex")}`
}

/**
 * Log API request details
 */
export function logRequest(
  requestId: string,
  method: string,
  path: string,
  userId?: string | null
) {
  const timestamp = new Date().toISOString()
  console.log(
    JSON.stringify({
      type: "api_request",
      request_id: requestId,
      timestamp,
      method,
      path,
      user_id: userId || "anonymous",
    })
  )
}

/**
 * Log API response details
 */
export function logResponse(
  requestId: string,
  status: number,
  durationMs: number,
  error?: string
) {
  const timestamp = new Date().toISOString()
  console.log(
    JSON.stringify({
      type: "api_response",
      request_id: requestId,
      timestamp,
      status,
      duration_ms: durationMs,
      ...(error && { error }),
    })
  )
}

/**
 * Log API error
 */
export function logError(
  requestId: string,
  error: Error | unknown,
  context?: Record<string, any>
) {
  const timestamp = new Date().toISOString()
  const errorMessage =
    error instanceof Error ? error.message : String(error)
  const errorStack =
    error instanceof Error ? error.stack : undefined

  console.error(
    JSON.stringify({
      type: "api_error",
      request_id: requestId,
      timestamp,
      error: errorMessage,
      stack: errorStack,
      ...context,
    })
  )
}

/**
 * Wrap API handler with logging
 */
export function withLogging<T>(
  handler: (request: NextRequest, requestId: string) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now()
    const requestId = generateRequestId()
    const method = request.method
    const path = request.nextUrl.pathname

    // Add request ID to response headers
    const addRequestId = (response: NextResponse): NextResponse => {
      response.headers.set("x-request-id", requestId)
      return response
    }

    try {
      logRequest(requestId, method, path)

      const response = await handler(request, requestId)
      const duration = performance.now() - startTime

      logResponse(requestId, response.status, Math.round(duration))

      return addRequestId(response)
    } catch (error) {
      const duration = performance.now() - startTime

      logError(requestId, error, { method, path })
      logResponse(requestId, 500, Math.round(duration), "Internal server error")

      const errorResponse = NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          request_id: requestId,
        },
        { status: 500 }
      )

      return addRequestId(errorResponse)
    }
  }
}

/**
 * Rate limit tracker (in-memory for development)
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>()

/**
 * Check rate limit for an IP/key
 */
export function checkRateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // Create new window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    }
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Rate limit middleware
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    limit?: number
    windowMs?: number
    keyGenerator?: (request: NextRequest) => string
  } = {}
) {
  const {
    limit = 100,
    windowMs = 60000,
    keyGenerator = (req) =>
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown",
  } = options

  return async (request: NextRequest): Promise<NextResponse> => {
    const key = keyGenerator(request)
    const rateLimit = checkRateLimit(key, limit, windowMs)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          retry_after: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000
            ).toString(),
            "Retry-After": Math.ceil(
              (rateLimit.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      )
    }

    const response = await handler(request)

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", limit.toString())
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimit.remaining.toString()
    )
    response.headers.set(
      "X-RateLimit-Reset",
      Math.ceil(rateLimit.resetTime / 1000).toString()
    )

    return response
  }
}
