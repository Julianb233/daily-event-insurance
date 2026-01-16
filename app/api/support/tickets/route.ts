import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured, supportTickets, partners, users, NewSupportTicket } from "@/lib/db"
import { eq, desc, and, or, count, ilike } from "drizzle-orm"
import { auth } from "@/lib/auth"
import {
  successResponse,
  paginatedResponse,
  serverError,
  validationError,
  badRequest,
} from "@/lib/api-responses"
import {
  generateTicketNumber,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from "@/lib/support/ticket-types"

/**
 * POST /api/support/tickets
 * Create a new support ticket
 *
 * Body:
 * - name: string (required) - Contact name
 * - email: string (required) - Contact email
 * - subject: string (required) - Ticket subject
 * - message: string (required) - Ticket description
 * - category: string (optional) - billing, technical, integration, general
 * - priority: string (optional) - low, medium, high, urgent
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate required fields
    const { name, email, subject, message, category, priority } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return validationError("Name is required", { name: ["Name is required"] })
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return validationError("Valid email is required", { email: ["Valid email is required"] })
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return validationError("Subject is required", { subject: ["Subject is required"] })
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return validationError("Message must be at least 10 characters", {
        message: ["Message must be at least 10 characters"],
      })
    }

    // Validate category if provided
    const validCategories = Object.values(TicketCategory)
    const ticketCategory = category && validCategories.includes(category)
      ? category as TicketCategory
      : TicketCategory.GENERAL

    // Validate priority if provided
    const validPriorities = Object.values(TicketPriority)
    const ticketPriority = priority && validPriorities.includes(priority)
      ? priority as TicketPriority
      : TicketPriority.MEDIUM

    // Generate unique ticket number
    const ticketNumber = generateTicketNumber()

    // Try to get session for authenticated users
    let userId: string | null = null
    let partnerId: string | null = null

    try {
      const session = await auth()
      if ((session as any)?.user?.id) {
        userId = (session as any).user.id

        // Check if user is a partner
        if (db && isDbConfigured()) {
          const partnerResult = await db
            .select({ id: partners.id })
            .from(partners)
            .where(eq(partners.userId, (session as any).user.id))
            .limit(1)

          if (partnerResult.length > 0) {
            partnerId = partnerResult[0].id
          }
        }
      }
    } catch {
      // Session not available, continue as anonymous
    }

    // Dev mode / no database
    if (!isDbConfigured() || !db) {
      console.log("[DEV MODE] Would create support ticket:", {
        ticketNumber,
        subject,
        category: ticketCategory,
        priority: ticketPriority,
      })

      const mockTicket = {
        id: `ticket_${Date.now()}`,
        ticketNumber,
        subject: subject.trim(),
        description: message.trim(),
        status: TicketStatus.OPEN,
        priority: ticketPriority,
        category: ticketCategory,
        contactName: name.trim(),
        contactEmail: email.trim().toLowerCase(),
        userId,
        partnerId,
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: null,
        closedAt: null,
        metadata: null,
      }

      return successResponse(
        { ticket: mockTicket },
        "Ticket created successfully",
        201
      )
    }

    // Create ticket in database
    const ticketData: NewSupportTicket = {
      ticketNumber,
      subject: subject.trim(),
      description: message.trim(),
      status: TicketStatus.OPEN,
      priority: ticketPriority,
      category: ticketCategory,
      contactName: name.trim(),
      contactEmail: email.trim().toLowerCase(),
      userId,
      partnerId,
    }

    const [ticket] = await db.insert(supportTickets).values(ticketData).returning()

    if (!ticket) {
      return serverError("Failed to create ticket")
    }

    return successResponse(
      { ticket },
      "Ticket created successfully",
      201
    )
  } catch (error: any) {
    console.error("[Support Tickets] POST Error:", error)
    return serverError(error.message || "Failed to create ticket")
  }
}

/**
 * GET /api/support/tickets
 * List support tickets for the current user/email
 *
 * Query params:
 * - email: string (required if not authenticated) - Filter by email
 * - status: string (optional) - Filter by status
 * - page: number (default: 1)
 * - pageSize: number (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const emailParam = searchParams.get("email")
    const statusParam = searchParams.get("status")
    const pageParam = parseInt(searchParams.get("page") || "1", 10)
    const pageSizeParam = Math.min(
      parseInt(searchParams.get("pageSize") || "20", 10),
      100
    )

    // Get session for authenticated users
    let userEmail: string | null = null
    let userId: string | null = null

    try {
      const session = await auth()
      if ((session as any)?.user) {
        userId = (session as any).user.id || null
        userEmail = (session as any).user.email || null
      }
    } catch {
      // Session not available
    }

    // Determine which email to use
    const queryEmail = emailParam?.trim().toLowerCase() || userEmail

    if (!queryEmail && !userId) {
      return badRequest("Email parameter is required for unauthenticated requests")
    }

    // Dev mode / no database
    if (!isDbConfigured() || !db) {
      console.log("[DEV MODE] Returning mock tickets")

      const mockTickets = Array.from({ length: 5 }, (_, i) => ({
        id: `ticket_${i + 1}`,
        ticketNumber: `#DEI-${String(10000 + i).slice(0, 5)}`,
        subject: ["Widget Integration Issue", "Billing Question", "API Documentation", "General Inquiry", "Technical Support"][i],
        description: "Sample ticket description for development mode.",
        status: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.WAITING_CUSTOMER, TicketStatus.RESOLVED, TicketStatus.CLOSED][i],
        priority: [TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.LOW, TicketPriority.URGENT, TicketPriority.MEDIUM][i],
        category: [TicketCategory.INTEGRATION, TicketCategory.BILLING, TicketCategory.TECHNICAL, TicketCategory.GENERAL, TicketCategory.TECHNICAL][i],
        contactName: "Test User",
        contactEmail: queryEmail || "test@example.com",
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000),
      }))

      // Filter by status if provided
      const filteredTickets = statusParam
        ? mockTickets.filter(t => t.status === statusParam)
        : mockTickets

      const start = (pageParam - 1) * pageSizeParam
      const paginatedTickets = filteredTickets.slice(start, start + pageSizeParam)

      return paginatedResponse(paginatedTickets, pageParam, pageSizeParam, filteredTickets.length)
    }

    // Build where conditions
    const conditions = []

    // Filter by email or user ID
    if (userId) {
      // Authenticated user - show tickets by user ID or email
      if (queryEmail) {
        conditions.push(
          or(
            eq(supportTickets.userId, userId),
            eq(supportTickets.contactEmail, queryEmail)
          )
        )
      } else {
        conditions.push(eq(supportTickets.userId, userId))
      }
    } else if (queryEmail) {
      // Unauthenticated - filter by email only
      conditions.push(eq(supportTickets.contactEmail, queryEmail))
    }

    // Filter by status if provided
    if (statusParam) {
      const validStatuses = Object.values(TicketStatus)
      if (validStatuses.includes(statusParam as TicketStatus)) {
        conditions.push(eq(supportTickets.status, statusParam))
      }
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0]

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(supportTickets)
      .where(whereClause)

    // Get paginated tickets
    const offset = (pageParam - 1) * pageSizeParam
    const tickets = await db
      .select()
      .from(supportTickets)
      .where(whereClause)
      .orderBy(desc(supportTickets.createdAt))
      .limit(pageSizeParam)
      .offset(offset)

    return paginatedResponse(tickets, pageParam, pageSizeParam, Number(total))
  } catch (error: any) {
    console.error("[Support Tickets] GET Error:", error)
    return serverError(error.message || "Failed to fetch tickets")
  }
}
