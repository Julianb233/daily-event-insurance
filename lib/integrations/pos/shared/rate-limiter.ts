/**
 * Rate Limiter with Exponential Backoff
 * Generic rate limiting for POS API integrations
 */

export interface RateLimitConfig {
  /** Maximum requests per window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum retry attempts */
  maxRetries?: number
  /** Initial retry delay in milliseconds */
  initialRetryDelay?: number
  /** Maximum retry delay in milliseconds */
  maxRetryDelay?: number
}

export interface RateLimitState {
  requests: number
  windowStart: number
  isLimited: boolean
  resetAt?: number
}

export interface RetryOptions<T> {
  /** Check if error is a rate limit error */
  isRateLimited: (error: unknown) => boolean
  /** Extract rate limit headers from error */
  getHeaders?: (error: unknown) => { limit?: number; remaining?: number; resetTimestamp?: number }
  /** Callback on retry */
  onRetry?: (attempt: number, waitMs: number) => void
  /** Transform result */
  transform?: (result: T) => T
}

/**
 * Rate Limiter Class
 */
export class RateLimiter {
  private config: Required<RateLimitConfig>
  private states: Map<string, RateLimitState> = new Map()

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      maxRetries: config.maxRetries ?? 3,
      initialRetryDelay: config.initialRetryDelay ?? 1000,
      maxRetryDelay: config.maxRetryDelay ?? 30000,
    }
  }

  /**
   * Execute a function with rate limiting and retry logic
   */
  async executeWithRetry<T>(
    key: string,
    fn: () => Promise<T>,
    options: RetryOptions<T>
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      // Check rate limit before executing
      const canProceed = await this.checkAndWait(key)
      if (!canProceed) {
        throw new Error('Rate limit exceeded and retry timeout reached')
      }

      try {
        const result = await fn()
        this.recordRequest(key)
        return options.transform ? options.transform(result) : result
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (!options.isRateLimited(error)) {
          throw error
        }

        // Extract rate limit info
        const headers = options.getHeaders?.(error)
        const waitMs = this.calculateWaitTime(attempt, headers)

        // Mark as limited
        this.markLimited(key, waitMs)

        if (attempt < this.config.maxRetries) {
          options.onRetry?.(attempt, waitMs)
          await this.sleep(waitMs)
        }
      }
    }

    throw lastError ?? new Error('Max retries exceeded')
  }

  /**
   * Check if request can proceed, wait if near limit
   */
  private async checkAndWait(key: string): Promise<boolean> {
    const state = this.getOrCreateState(key)
    const now = Date.now()

    // Reset window if expired
    if (now - state.windowStart >= this.config.windowMs) {
      state.requests = 0
      state.windowStart = now
      state.isLimited = false
    }

    // If limited, check if we can proceed
    if (state.isLimited && state.resetAt) {
      if (now < state.resetAt) {
        const waitTime = state.resetAt - now
        if (waitTime > this.config.maxRetryDelay) {
          return false
        }
        await this.sleep(waitTime)
        state.isLimited = false
      }
    }

    // Check if near limit
    if (state.requests >= this.config.maxRequests * 0.9) {
      // Wait until window resets
      const windowRemaining = this.config.windowMs - (now - state.windowStart)
      if (windowRemaining > 0 && windowRemaining < this.config.maxRetryDelay) {
        await this.sleep(windowRemaining)
        state.requests = 0
        state.windowStart = Date.now()
      }
    }

    return true
  }

  /**
   * Record a successful request
   */
  private recordRequest(key: string): void {
    const state = this.getOrCreateState(key)
    state.requests++
  }

  /**
   * Mark key as rate limited
   */
  private markLimited(key: string, waitMs: number): void {
    const state = this.getOrCreateState(key)
    state.isLimited = true
    state.resetAt = Date.now() + waitMs
  }

  /**
   * Calculate wait time with exponential backoff
   */
  private calculateWaitTime(
    attempt: number,
    headers?: { limit?: number; remaining?: number; resetTimestamp?: number }
  ): number {
    // Use reset timestamp if provided
    if (headers?.resetTimestamp) {
      const now = Math.floor(Date.now() / 1000)
      const waitSeconds = Math.max(headers.resetTimestamp - now, 1)
      return Math.min(waitSeconds * 1000, this.config.maxRetryDelay)
    }

    // Exponential backoff with jitter
    const baseDelay = this.config.initialRetryDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 1000
    return Math.min(baseDelay + jitter, this.config.maxRetryDelay)
  }

  /**
   * Get or create state for key
   */
  private getOrCreateState(key: string): RateLimitState {
    let state = this.states.get(key)
    if (!state) {
      state = {
        requests: 0,
        windowStart: Date.now(),
        isLimited: false,
      }
      this.states.set(key, state)
    }
    return state
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get current state for key
   */
  getState(key: string): RateLimitState | undefined {
    return this.states.get(key)
  }

  /**
   * Reset state for key
   */
  resetState(key: string): void {
    this.states.delete(key)
  }

  /**
   * Reset all states
   */
  resetAll(): void {
    this.states.clear()
  }
}

/**
 * Pre-configured rate limiters for POS systems
 */
export const posRateLimiters = {
  // Mindbody: 100 requests per minute for read, 30 for write
  mindbody: new RateLimiter({
    maxRequests: 100,
    windowMs: 60000,
    maxRetries: 3,
    initialRetryDelay: 2000,
  }),
  mindbodyWrite: new RateLimiter({
    maxRequests: 30,
    windowMs: 60000,
    maxRetries: 3,
    initialRetryDelay: 2000,
  }),

  // Pike13: 100 requests per minute for read, 30 for write
  pike13: new RateLimiter({
    maxRequests: 100,
    windowMs: 60000,
    maxRetries: 5,
    initialRetryDelay: 1000,
  }),
  pike13Write: new RateLimiter({
    maxRequests: 30,
    windowMs: 60000,
    maxRetries: 5,
    initialRetryDelay: 1000,
  }),

  // Square: More generous limits
  square: new RateLimiter({
    maxRequests: 300,
    windowMs: 60000,
    maxRetries: 3,
    initialRetryDelay: 1000,
  }),
}

/**
 * Create a custom rate limiter
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config)
}
