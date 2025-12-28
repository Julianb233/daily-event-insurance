/**
 * Quote Expiration Management
 *
 * Handles automatic quote expiration and status updates
 */

import { db, isDbConfigured, quotes } from "@/lib/db"
import { eq, and, lt } from "drizzle-orm"

export interface ExpirationResult {
  processed: number
  expired: number
  errors: number
}

/**
 * Process expired quotes and update their status
 * This should be run periodically (e.g., via cron job or scheduled task)
 */
export async function processExpiredQuotes(): Promise<ExpirationResult> {
  if (!db || !isDbConfigured()) {
    console.warn("[Quote Expiration] Database not configured, skipping expiration processing")
    return { processed: 0, expired: 0, errors: 0 }
  }

  const result: ExpirationResult = {
    processed: 0,
    expired: 0,
    errors: 0,
  }

  try {
    const now = new Date()

    // Find quotes that are pending and expired
    const expiredQuotes = await db
      .select()
      .from(quotes)
      .where(
        and(
          eq(quotes.status, "pending"),
          lt(quotes.expiresAt, now)
        )
      )

    result.processed = expiredQuotes.length

    if (expiredQuotes.length === 0) {
      console.log("[Quote Expiration] No expired quotes found")
      return result
    }

    console.log(`[Quote Expiration] Processing ${expiredQuotes.length} expired quotes`)

    // Update each expired quote
    for (const quote of expiredQuotes) {
      try {
        await db
          .update(quotes)
          .set({
            status: "expired",
            updatedAt: new Date(),
          })
          .where(eq(quotes.id, quote.id))

        result.expired++
      } catch (error) {
        console.error(`[Quote Expiration] Error updating quote ${quote.id}:`, error)
        result.errors++
      }
    }

    console.log(
      `[Quote Expiration] Complete: ${result.expired} expired, ${result.errors} errors`
    )

    return result
  } catch (error) {
    console.error("[Quote Expiration] Fatal error:", error)
    throw error
  }
}

/**
 * Check if a quote is expired
 */
export function isQuoteExpired(expiresAt: Date): boolean {
  return expiresAt < new Date()
}

/**
 * Get quote expiration status
 */
export function getQuoteExpirationStatus(expiresAt: Date): {
  isExpired: boolean
  isExpiringSoon: boolean // Within 24 hours
  hoursRemaining: number
  daysRemaining: number
} {
  const now = new Date()
  const millisecondsRemaining = expiresAt.getTime() - now.getTime()
  const hoursRemaining = millisecondsRemaining / (1000 * 60 * 60)
  const daysRemaining = millisecondsRemaining / (1000 * 60 * 60 * 24)

  return {
    isExpired: millisecondsRemaining <= 0,
    isExpiringSoon: hoursRemaining > 0 && hoursRemaining <= 24,
    hoursRemaining: Math.max(0, hoursRemaining),
    daysRemaining: Math.max(0, daysRemaining),
  }
}

/**
 * Calculate quote expiration date
 * Default: 30 days from creation
 */
export function calculateExpirationDate(
  createdAt: Date = new Date(),
  daysValid: number = 30
): Date {
  const expirationDate = new Date(createdAt)
  expirationDate.setDate(expirationDate.getDate() + daysValid)
  return expirationDate
}

/**
 * Extend quote expiration
 * Useful for giving customers more time to accept
 */
export async function extendQuoteExpiration(
  quoteId: string,
  additionalDays: number
): Promise<{ success: boolean; newExpiresAt?: Date; error?: string }> {
  if (!db || !isDbConfigured()) {
    return { success: false, error: "Database not configured" }
  }

  try {
    // Get current quote
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1)

    if (!quote) {
      return { success: false, error: "Quote not found" }
    }

    // Only extend pending quotes
    if (quote.status !== "pending") {
      return { success: false, error: "Only pending quotes can be extended" }
    }

    // Check if quote has expiration date
    if (!quote.expiresAt) {
      return { success: false, error: "Quote has no expiration date set" }
    }

    // Calculate new expiration date
    const newExpiresAt = new Date(quote.expiresAt)
    newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays)

    // Don't allow extending more than 90 days total from creation
    const maxExpiresAt = new Date(quote.createdAt)
    maxExpiresAt.setDate(maxExpiresAt.getDate() + 90)

    if (newExpiresAt > maxExpiresAt) {
      return { success: false, error: "Cannot extend beyond 90 days from creation" }
    }

    // Update quote
    await db
      .update(quotes)
      .set({
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(quotes.id, quoteId))

    return { success: true, newExpiresAt }
  } catch (error: any) {
    console.error("[Quote Expiration] Error extending quote:", error)
    return { success: false, error: error.message || "Failed to extend quote" }
  }
}

/**
 * Get expiring quotes for notification
 * Returns quotes expiring within the specified hours
 */
export async function getExpiringQuotes(
  withinHours: number = 24
): Promise<any[]> {
  if (!db || !isDbConfigured()) {
    return []
  }

  try {
    const now = new Date()
    const futureDate = new Date(now.getTime() + withinHours * 60 * 60 * 1000)

    const expiringQuotes = await db
      .select()
      .from(quotes)
      .where(
        and(
          eq(quotes.status, "pending"),
          lt(quotes.expiresAt, futureDate)
        )
      )

    return expiringQuotes.filter(quote => quote.expiresAt && quote.expiresAt > now)
  } catch (error) {
    console.error("[Quote Expiration] Error fetching expiring quotes:", error)
    return []
  }
}

/**
 * Format expiration message for display
 */
export function formatExpirationMessage(expiresAt: Date): string {
  const status = getQuoteExpirationStatus(expiresAt)

  if (status.isExpired) {
    return "Quote has expired"
  }

  if (status.isExpiringSoon) {
    const hours = Math.floor(status.hoursRemaining)
    const minutes = Math.floor((status.hoursRemaining - hours) * 60)
    return `Expires in ${hours}h ${minutes}m`
  }

  if (status.daysRemaining < 7) {
    const days = Math.floor(status.daysRemaining)
    return `Expires in ${days} day${days !== 1 ? "s" : ""}`
  }

  const weeks = Math.floor(status.daysRemaining / 7)
  return `Expires in ${weeks} week${weeks !== 1 ? "s" : ""}`
}

/**
 * Batch update expired quotes
 * More efficient for large numbers of quotes
 */
export async function batchUpdateExpiredQuotes(): Promise<ExpirationResult> {
  if (!db || !isDbConfigured()) {
    return { processed: 0, expired: 0, errors: 0 }
  }

  try {
    const now = new Date()

    // Single query to update all expired quotes
    const result = await db
      .update(quotes)
      .set({
        status: "expired",
        updatedAt: now,
      })
      .where(
        and(
          eq(quotes.status, "pending"),
          lt(quotes.expiresAt, now)
        )
      )
      .returning({ id: quotes.id })

    const expired = result.length

    console.log(`[Quote Expiration] Batch updated ${expired} expired quotes`)

    return {
      processed: expired,
      expired,
      errors: 0,
    }
  } catch (error: any) {
    console.error("[Quote Expiration] Batch update error:", error)
    return {
      processed: 0,
      expired: 0,
      errors: 1,
    }
  }
}
