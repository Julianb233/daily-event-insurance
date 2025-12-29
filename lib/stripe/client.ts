/**
 * Stripe Client Initialization
 *
 * Provides server-side Stripe SDK instance with proper error handling
 * and configuration management.
 */

import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in environment variables. " +
    "Please add it to your .env.local file."
  )
}

/**
 * Stripe SDK Instance
 *
 * Configured with:
 * - Latest API version (automatically uses the latest)
 * - TypeScript support enabled
 * - Idempotency key support for safe retries
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
  appInfo: {
    name: "Daily Event Insurance",
    version: "1.0.0",
  },
})

/**
 * Stripe Configuration
 */
export const stripeConfig = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  currency: "usd" as const,

  // Payment settings
  paymentMethodTypes: ["card"] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],

  // Checkout session settings
  checkoutMode: "payment" as const,

  // Success/cancel URLs (will be constructed at runtime)
  getSuccessUrl: (baseUrl: string, sessionId?: string) =>
    `${baseUrl}/checkout/success${sessionId ? `?session_id=${sessionId}` : ""}`,
  getCancelUrl: (baseUrl: string, quoteId?: string) =>
    `${baseUrl}/checkout/cancel${quoteId ? `?quote_id=${quoteId}` : ""}`,
}

/**
 * Validate Stripe configuration
 */
export function validateStripeConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push("STRIPE_SECRET_KEY is not configured")
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured")
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    errors.push("STRIPE_WEBHOOK_SECRET is not configured")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Type guard for Stripe errors
 */
export function isStripeError(error: unknown): error is Stripe.errors.StripeError {
  return error instanceof Stripe.errors.StripeError
}

/**
 * Format Stripe error for user display
 */
export function formatStripeError(error: unknown): string {
  if (isStripeError(error)) {
    switch (error.type) {
      case "StripeCardError":
        return error.message || "Your card was declined. Please try a different payment method."
      case "StripeRateLimitError":
        return "Too many requests. Please try again in a moment."
      case "StripeInvalidRequestError":
        return "Invalid payment information. Please check your details and try again."
      case "StripeAPIError":
        return "Payment processing error. Please try again."
      case "StripeConnectionError":
        return "Network error. Please check your connection and try again."
      case "StripeAuthenticationError":
        return "Authentication error. Please contact support."
      default:
        return error.message || "Payment processing error. Please try again."
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred. Please try again."
}

/**
 * Retry helper for Stripe operations
 */
export async function retryStripeOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (isStripeError(error)) {
        // Don't retry on client errors
        if (
          error.type === "StripeCardError" ||
          error.type === "StripeInvalidRequestError" ||
          error.type === "StripeAuthenticationError"
        ) {
          throw error
        }
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
      }
    }
  }

  throw lastError
}
