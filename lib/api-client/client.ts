/**
 * Daily Event Insurance - API Client
 *
 * Core client class for making authenticated API requests
 */

import {
  APIError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  NetworkError,
  type ClientConfig,
  type Environment,
  type HttpMethod,
  type RequestOptions,
  type ResponseMetadata,
  type RateLimitInfo,
  type Logger,
} from './types'

const API_URLS: Record<Environment, string> = {
  sandbox: 'https://api.sandbox.dailyevent.com/v1',
  production: 'https://api.dailyevent.com/v1',
}

const DEFAULT_TIMEOUT = 30000
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000

/**
 * Daily Event Insurance API Client
 */
export class DailyEventClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly maxRetries: number
  private readonly retryDelay: number
  private readonly debug: boolean
  private readonly logger: Logger

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl ?? API_URLS[config.environment]
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES
    this.retryDelay = config.retryDelay ?? DEFAULT_RETRY_DELAY
    this.debug = config.debug ?? false
    this.logger = config.logger ?? console
  }

  /**
   * Make a GET request
   */
  async get<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    return this.request<T>('GET', path, undefined, query, options)
  }

  /**
   * Make a POST request
   */
  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    return this.request<T>('POST', path, body, undefined, options)
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    return this.request<T>('PUT', path, body, undefined, options)
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    return this.request<T>('PATCH', path, body, undefined, options)
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    path: string,
    options?: RequestOptions
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    return this.request<T>('DELETE', path, undefined, undefined, options)
  }

  /**
   * Core request method with retry logic
   */
  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    const url = this.buildUrl(path, query)
    const timeout = options?.timeout ?? this.timeout
    const shouldRetry = !options?.noRetry

    let lastError: Error | null = null
    const maxAttempts = shouldRetry ? this.maxRetries : 1

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.executeRequest<T>(url, method, body, options, timeout)
        return result
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on certain errors
        if (
          error instanceof AuthError ||
          error instanceof ForbiddenError ||
          error instanceof NotFoundError ||
          error instanceof ValidationError
        ) {
          throw error
        }

        // Check if we should retry
        if (attempt < maxAttempts && this.shouldRetry(error)) {
          const delay = this.calculateRetryDelay(attempt, error)
          this.log('warn', `Request failed, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`, { error })
          await this.sleep(delay)
          continue
        }

        throw error
      }
    }

    throw lastError ?? new Error('Request failed after all retries')
  }

  /**
   * Execute a single HTTP request
   */
  private async executeRequest<T>(
    url: string,
    method: HttpMethod,
    body?: unknown,
    options?: RequestOptions,
    timeout?: number
  ): Promise<{ data: T; metadata: ResponseMetadata }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout ?? this.timeout)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options?.headers,
      }

      if (options?.idempotencyKey && ['POST', 'PUT', 'PATCH'].includes(method)) {
        headers['Idempotency-Key'] = options.idempotencyKey
      }

      this.log('debug', `${method} ${url}`, { body })

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      const requestId = response.headers.get('x-request-id') ?? ''
      const rateLimit = this.parseRateLimitHeaders(response.headers)

      const metadata: ResponseMetadata = {
        requestId,
        rateLimit,
      }

      if (!response.ok) {
        await this.handleErrorResponse(response, requestId)
      }

      const data = await response.json() as T

      this.log('debug', `Response from ${url}`, { status: response.status, data })

      return { data, metadata }
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError(`Request timeout after ${timeout}ms`)
      }

      throw new NetworkError(
        error instanceof Error ? error.message : 'Network request failed',
        error instanceof Error ? error : undefined
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response, requestId: string): Promise<never> {
    let errorBody: { error?: string; message?: string; details?: Record<string, unknown> }

    try {
      errorBody = await response.json()
    } catch {
      errorBody = { message: response.statusText }
    }

    const message = errorBody.message ?? errorBody.error ?? 'Unknown error'

    switch (response.status) {
      case 400:
        throw new ValidationError(message, [], requestId)
      case 401:
        throw new AuthError(message, requestId)
      case 403:
        throw new ForbiddenError(message, requestId)
      case 404:
        throw new NotFoundError(message, undefined, requestId)
      case 429:
        const retryAfter = parseInt(response.headers.get('retry-after') ?? '60', 10)
        throw new RateLimitError(message, retryAfter, requestId)
      default:
        if (response.status >= 500) {
          throw new ServerError(message, response.status, requestId)
        }
        throw new APIError(message, response.status, 'unknown_error', errorBody.details, requestId)
    }
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path.startsWith('/') ? `${this.baseUrl}${path}` : `${this.baseUrl}/${path}`)

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      }
    }

    return url.toString()
  }

  /**
   * Parse rate limit headers from response
   */
  private parseRateLimitHeaders(headers: Headers): RateLimitInfo {
    return {
      limit: parseInt(headers.get('x-ratelimit-limit') ?? '0', 10),
      remaining: parseInt(headers.get('x-ratelimit-remaining') ?? '0', 10),
      reset: parseInt(headers.get('x-ratelimit-reset') ?? '0', 10),
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: unknown): boolean {
    if (error instanceof RateLimitError) {
      return true
    }
    if (error instanceof ServerError) {
      return true
    }
    if (error instanceof NetworkError) {
      return true
    }
    return false
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number, error: unknown): number {
    if (error instanceof RateLimitError) {
      return error.retryAfter * 1000
    }

    // Exponential backoff with jitter
    const baseDelay = this.retryDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 1000
    return Math.min(baseDelay + jitter, 30000) // Max 30 seconds
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Log message if debug is enabled
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown): void {
    if (this.debug) {
      this.logger[level](`[DailyEventClient] ${message}`, data)
    }
  }
}

export default DailyEventClient
