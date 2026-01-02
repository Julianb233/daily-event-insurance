/**
 * Resend Email Integration
 * Core client for sending emails with rate limiting and error handling
 */

import { Resend } from 'resend'

// Lazy-initialize Resend client to prevent build errors when API key is not set
let _resend: Resend | null = null
function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
}

// Simple in-memory rate limiter
class RateLimiter {
  private requests: number[] = []

  isAllowed(): boolean {
    const now = Date.now()
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < RATE_LIMIT.windowMs)

    if (this.requests.length >= RATE_LIMIT.maxRequests) {
      return false
    }

    this.requests.push(now)
    return true
  }

  reset() {
    this.requests = []
  }
}

const rateLimiter = new RateLimiter()

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attempt: number): number {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt)
  return Math.min(delay, RETRY_CONFIG.maxDelay)
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
  tags?: Array<{
    name: string
    value: string
  }>
  headers?: Record<string, string>
}

export interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

/**
 * Send an email with rate limiting and retry logic
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  // Validate API key
  if (!process.env.RESEND_API_KEY) {
    console.error('[Resend] RESEND_API_KEY is not configured')
    return {
      success: false,
      error: 'Email service not configured',
    }
  }

  // Validate required fields
  if (!options.to || !options.subject) {
    return {
      success: false,
      error: 'Missing required fields: to, subject',
    }
  }

  if (!options.html && !options.text) {
    return {
      success: false,
      error: 'Either html or text content is required',
    }
  }

  // Rate limiting check
  if (!rateLimiter.isAllowed()) {
    console.warn('[Resend] Rate limit exceeded, waiting...')
    await sleep(RATE_LIMIT.windowMs)
    if (!rateLimiter.isAllowed()) {
      return {
        success: false,
        error: 'Rate limit exceeded',
      }
    }
  }

  // Retry logic
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      // Build email payload - TypeScript needs explicit non-undefined values
      const emailPayload = {
        from: 'Daily Event Insurance <noreply@dailyeventinsurance.com>',
        to: options.to,
        subject: options.subject,
        ...(options.html && { html: options.html }),
        ...(options.text && { text: options.text }),
        ...(options.replyTo && { replyTo: options.replyTo }),
        ...(options.cc && { cc: options.cc }),
        ...(options.bcc && { bcc: options.bcc }),
        ...(options.attachments && { attachments: options.attachments }),
        ...(options.tags && { tags: options.tags }),
        ...(options.headers && { headers: options.headers }),
      }

      const resend = getResendClient()
      if (!resend) {
        return {
          success: false,
          error: 'Email service not configured',
        }
      }
      const result = await resend.emails.send(emailPayload as Parameters<typeof resend.emails.send>[0])

      if (result.error) {
        throw new Error(result.error.message)
      }

      console.log('[Resend] Email sent successfully:', result.data?.id)
      return {
        success: true,
        id: result.data?.id,
      }
    } catch (error) {
      lastError = error as Error

      // Don't retry on certain errors
      if (
        error instanceof Error &&
        (error.message.includes('invalid email') ||
         error.message.includes('unauthorized') ||
         error.message.includes('validation'))
      ) {
        console.error('[Resend] Non-retryable error:', error.message)
        return {
          success: false,
          error: error.message,
        }
      }

      // Retry with exponential backoff
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = getRetryDelay(attempt)
        console.warn(`[Resend] Retry attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries} after ${delay}ms`)
        await sleep(delay)
      }
    }
  }

  // All retries failed
  console.error('[Resend] All retry attempts failed:', lastError?.message)
  return {
    success: false,
    error: lastError?.message || 'Unknown error',
  }
}

/**
 * Verify domain configuration (for setup/diagnostics)
 */
export async function verifyDomain(domain: string): Promise<{
  verified: boolean
  error?: string
}> {
  try {
    const resend = getResendClient()
    if (!resend) {
      return { verified: false, error: 'Email service not configured' }
    }
    const result = await resend.domains.get(domain)

    if (result.error) {
      return {
        verified: false,
        error: result.error.message,
      }
    }

    return {
      verified: result.data?.status === 'verified',
    }
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get email delivery status (for tracking)
 */
export async function getEmailStatus(emailId: string): Promise<{
  status?: string
  error?: string
}> {
  try {
    const resend = getResendClient()
    if (!resend) {
      return { error: 'Email service not configured' }
    }
    const result = await resend.emails.get(emailId)

    if (result.error) {
      return {
        error: result.error.message,
      }
    }

    return {
      status: result.data?.last_event || 'unknown',
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Export Resend client getter for advanced usage
export { getResendClient }
