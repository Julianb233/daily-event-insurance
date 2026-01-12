import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads, leadCommunications } from "@/lib/db"
import { eq, desc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

const updateLeadSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(20).optional(),
  businessType: z.string().max(50).optional(),
  businessName: z.string().max(200).optional(),
  estimatedParticipants: z.number().int().positive().optional(),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional(),
  interestScore: z.number().int().min(0).max(100).optional(),
  status: z.enum(["new", "contacted", "qualified", "demo_scheduled", "proposal_sent", "converted", "lost", "dnc"]).optional(),
  statusReason: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
  assignedAgentId: z.string().optional(),
})

const mockLead = {
  id: "l1",
  firstName: "John",
  lastName: "Doe",
  email: "john@gym.com",
  phone: "(555) 111-2222",
  businessType: "gym",
  businessName: "FitLife Gym",
  source: "website_quote",
  status: "new",
  interestLevel: "hot",
  interestScore: 85,
  city: "Los Angeles",
  state: "CA",
  zipCode: "90210",
  timezone: "America/Los_Angeles",
  createdAt: "2024-12-20T10:00:00Z",
  updatedAt: "2024-12-20T10:00:00Z",
}

const mockCommunications = [
  { id: "c1", channel: "call", direction: "outbound", callDuration: 180, disposition: "reached", outcome: "positive", createdAt: "2024-12-20T14:00:00Z" },
  { id: "c2", channel: "sms", direction: "outbound", smsContent: "Thanks for your interest!", smsStatus: "delivered", createdAt: "2024-12-20T15:00:00Z" },
]

/**
 * GET /api/admin/leads/[id]
 * Get a single lead with communications history
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          ...mockLead,
          id,
          communications: mockCommunications,
        })
      }

      const [lead] = await db!
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      const communications = await db!
        .select()
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))
        .orderBy(desc(leadCommunications.createdAt))
        .limit(50)

      return successResponse({
        ...lead,
        communications,
      })
    } catch (error: any) {
      console.error("[Admin Lead] GET Error:", error)
      return serverError(error.message || "Failed to fetch lead")
    }
  })
}

/**
 * PATCH /api/admin/leads/[id]
 * Update a lead
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const validationResult = updateLeadSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid lead data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          ...mockLead,
          id,
          ...data,
          updatedAt: new Date().toISOString(),
        }, "Lead updated")
      }

      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value
        }
      })

      if (data.status === "converted") {
        updateData.convertedAt = new Date()
      }

      if (data.interestLevel || data.interestScore !== undefined) {
        updateData.lastActivityAt = new Date()
      }

      const [updated] = await db!
        .update(leads)
        .set(updateData)
        .where(eq(leads.id, id))
        .returning()

      if (!updated) {
        return notFoundError("Lead")
      }

      return successResponse(updated, "Lead updated")
    } catch (error: any) {
      console.error("[Admin Lead] PATCH Error:", error)
      return serverError(error.message || "Failed to update lead")
    }
  })
}

/**
 * DELETE /api/admin/leads/[id]
 * Delete a lead (soft delete by setting status to 'dnc')
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({ id }, "Lead deleted")
      }

      const [deleted] = await db!
        .update(leads)
        .set({
          status: "dnc",
          statusReason: "Deleted by admin",
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))
        .returning()

      if (!deleted) {
        return notFoundError("Lead")
      }

      return successResponse({ id }, "Lead deleted")
    } catch (error: any) {
      console.error("[Admin Lead] DELETE Error:", error)
      return serverError(error.message || "Failed to delete lead")
    }
  })
}
