import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, quotes, policies, NewPolicy } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
  forbiddenError,
} from "@/lib/api-responses"
import { validateQuoteForPolicy } from "@/lib/pricing"

/**
 * Generate unique policy number
 * Format: POL-YYYYMMDD-XXXXX
 */
function generatePolicyNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0")
  return `POL-${dateStr}-${random}`
}

/**
 * GET /api/partner/quotes/[quoteId]
 * Get a specific quote by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()
      const { quoteId } = await params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Would fetch quote:", quoteId)
        const mockQuote = {
          id: quoteId,
          quote_number: `QT-20250101-00001`,
          event_type: "Gym Session",
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          participants: 25,
          coverage_type: "liability",
          premium: 124.75,
          commission: 62.38,
          status: "pending",
          customer_email: "customer@example.com",
          customer_name: "John Doe",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          created_at: new Date(),
        }
        return successResponse({ quote: mockQuote })
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Get quote - ensure it belongs to this partner
      const quoteResult = await db!
        .select()
        .from(quotes)
        .where(
          and(
            eq(quotes.id, quoteId),
            eq(quotes.partnerId, partner.id)
          )
        )
        .limit(1)

      if (quoteResult.length === 0) {
        return notFoundError("Quote")
      }

      return successResponse({ quote: quoteResult[0] })
    } catch (error: any) {
      console.error("[Partner Quote] GET Error:", error)
      return serverError(error.message || "Failed to fetch quote")
    }
  })
}

/**
 * PATCH /api/partner/quotes/[quoteId]
 * Update quote status (accept, decline, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()
      const { quoteId } = await params
      const body = await request.json()

      const { action, customerEmail, customerName, customerPhone } = body

      // Validate action
      const validActions = ["accept", "decline", "update-customer"]
      if (!action || !validActions.includes(action)) {
        // SECURITY: Don't expose valid action values in production
        const isProduction = process.env.NODE_ENV === "production"
        return validationError("Invalid action", {
          action: [isProduction ? "Invalid action provided" : `Must be one of: ${validActions.join(", ")}`]
        })
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Would update quote:", quoteId, "action:", action)

        if (action === "accept") {
          const mockPolicy = {
            id: `policy_${Date.now()}`,
            policy_number: generatePolicyNumber(),
            event_type: "Gym Session",
            event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            participants: 25,
            coverage_type: "liability",
            premium: 124.75,
            commission: 62.38,
            status: "active",
            effective_date: new Date(),
            expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            customer_email: customerEmail || "customer@example.com",
            customer_name: customerName || "John Doe",
            customer_phone: customerPhone || null,
            created_at: new Date(),
          }

          return successResponse(
            { policy: mockPolicy, message: "Quote converted to policy" },
            "Policy created successfully",
            201
          )
        }

        return successResponse(
          { message: `Quote ${action} successful` },
          `Quote ${action} successfully`
        )
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Get quote
      const quoteResult = await db!
        .select()
        .from(quotes)
        .where(
          and(
            eq(quotes.id, quoteId),
            eq(quotes.partnerId, partner.id)
          )
        )
        .limit(1)

      if (quoteResult.length === 0) {
        return notFoundError("Quote")
      }

      const quote = quoteResult[0]

      // Handle different actions
      if (action === "accept") {
        return await acceptQuote(quote, customerEmail, customerName, customerPhone)
      }

      if (action === "decline") {
        return await declineQuote(quote)
      }

      if (action === "update-customer") {
        return await updateQuoteCustomer(quote, customerEmail, customerName)
      }

      return serverError("Invalid action")
    } catch (error: any) {
      console.error("[Partner Quote] PATCH Error:", error)
      return serverError(error.message || "Failed to update quote")
    }
  })
}

/**
 * Accept quote and convert to policy
 */
async function acceptQuote(
  quote: any,
  customerEmail?: string,
  customerName?: string,
  customerPhone?: string
) {
  // Validate quote can be converted
  const validation = validateQuoteForPolicy({
    status: quote.status,
    expiresAt: quote.expiresAt,
    customerEmail: customerEmail || quote.customerEmail,
    customerName: customerName || quote.customerName,
  })

  if (!validation.valid) {
    return validationError(
      "Cannot convert quote to policy",
      validation.errors.reduce((acc, err) => {
        acc[err.field] = [err.message]
        return acc
      }, {} as Record<string, string[]>)
    )
  }

  // Create policy from quote
  const policyData: NewPolicy = {
    partnerId: quote.partnerId,
    quoteId: quote.id,
    policyNumber: generatePolicyNumber(),
    eventType: quote.eventType,
    eventDate: quote.eventDate,
    participants: quote.participants,
    coverageType: quote.coverageType,
    premium: quote.premium,
    commission: quote.commission,
    status: "active",
    effectiveDate: new Date(), // Policy starts immediately
    expirationDate: quote.eventDate, // Policy expires at event date
    customerEmail: customerEmail || quote.customerEmail,
    customerName: customerName || quote.customerName,
    customerPhone: customerPhone || null,
    eventDetails: quote.eventDetails,
    certificateIssued: false,
    metadata: quote.metadata,
  }

  const [policy] = await db!.insert(policies).values(policyData).returning()

  if (!policy) {
    return serverError("Failed to create policy")
  }

  // Update quote status
  await db!
    .update(quotes)
    .set({
      status: "accepted",
      acceptedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(quotes.id, quote.id))

  return successResponse(
    {
      policy,
      quote: {
        ...quote,
        status: "accepted",
        acceptedAt: new Date(),
      },
      message: "Quote converted to policy successfully",
    },
    "Policy created successfully",
    201
  )
}

/**
 * Decline quote
 */
async function declineQuote(quote: any) {
  // Check if quote can be declined
  if (quote.status !== "pending") {
    return validationError("Invalid operation", {
      status: ["Only pending quotes can be declined"]
    })
  }

  // Update quote status
  const [updatedQuote] = await db!
    .update(quotes)
    .set({
      status: "declined",
      declinedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(quotes.id, quote.id))
    .returning()

  return successResponse(
    { quote: updatedQuote },
    "Quote declined successfully"
  )
}

/**
 * Update quote customer information
 */
async function updateQuoteCustomer(
  quote: any,
  customerEmail?: string,
  customerName?: string
) {
  // Check if quote can be updated
  if (quote.status !== "pending") {
    return validationError("Invalid operation", {
      status: ["Only pending quotes can be updated"]
    })
  }

  if (!customerEmail && !customerName) {
    return validationError("Missing data", {
      body: ["At least one of customerEmail or customerName is required"]
    })
  }

  // Update quote
  const updateData: any = {
    updatedAt: new Date(),
  }

  if (customerEmail) {
    updateData.customerEmail = customerEmail
  }

  if (customerName) {
    updateData.customerName = customerName
  }

  const [updatedQuote] = await db!
    .update(quotes)
    .set(updateData)
    .where(eq(quotes.id, quote.id))
    .returning()

  return successResponse(
    { quote: updatedQuote },
    "Quote updated successfully"
  )
}

/**
 * DELETE /api/partner/quotes/[quoteId]
 * Cancel/delete a quote (soft delete by setting status to cancelled)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()
      const { quoteId } = await params

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Would delete quote:", quoteId)
        return successResponse(
          { message: "Quote deleted successfully" },
          "Quote deleted"
        )
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Get quote
      const quoteResult = await db!
        .select()
        .from(quotes)
        .where(
          and(
            eq(quotes.id, quoteId),
            eq(quotes.partnerId, partner.id)
          )
        )
        .limit(1)

      if (quoteResult.length === 0) {
        return notFoundError("Quote")
      }

      const quote = quoteResult[0]

      // Only allow deletion of pending/declined quotes
      if (!quote.status || !["pending", "declined"].includes(quote.status)) {
        return forbiddenError("Cannot delete accepted quotes")
      }

      // Soft delete by updating status
      await db!
        .update(quotes)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(quotes.id, quoteId))

      return successResponse(
        { message: "Quote cancelled successfully" },
        "Quote cancelled"
      )
    } catch (error: any) {
      console.error("[Partner Quote] DELETE Error:", error)
      return serverError(error.message || "Failed to delete quote")
    }
  })
}
