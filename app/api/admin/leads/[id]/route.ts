import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads, leadCommunications, users, partners } from "@/lib/db"
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
  status: z.enum(["new", "contacted", "qualified", "demo_scheduled", "proposal_sent", "converted", "lost", "dnc"]).optional(),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional(),
  nextFollowUpAt: z.string().datetime().nullable().optional(),
  businessName: z.string().max(200).optional(),
  businessType: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
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
  initialValue: "40.00",
  convertedValue: null,
  lastActivityAt: null,
  nextFollowUpAt: null,
  createdAt: "2024-12-20T10:00:00Z",
}

const mockCommunications = [
  { id: "c1", channel: "call", direction: "outbound", disposition: "reached", outcome: "positive", callSummary: "Discussed insurance options", smsContent: null, createdAt: "2024-12-20T14:00:00Z" },
  { id: "c2", channel: "sms", direction: "outbound", disposition: null, outcome: null, callSummary: null, smsContent: "Thanks for your interest!", createdAt: "2024-12-20T15:00:00Z" },
]

interface TimelineEvent {
  type: "status_change" | "communication" | "note"
  description: string
  createdAt: string
}

function buildTimeline(
  lead: typeof mockLead,
  communications: typeof mockCommunications
): TimelineEvent[] {
  const timeline: TimelineEvent[] = []

  timeline.push({
    type: "status_change",
    description: `Lead created with status: ${lead.status}`,
    createdAt: lead.createdAt,
  })

  for (const comm of communications) {
    let description = ""
    if (comm.channel === "call") {
      description = `${comm.direction === "outbound" ? "Outbound" : "Inbound"} call`
      if (comm.disposition) description += ` - ${comm.disposition}`
      if (comm.callSummary) description += `: ${comm.callSummary}`
    } else if (comm.channel === "sms") {
      description = `${comm.direction === "outbound" ? "Outbound" : "Inbound"} SMS`
      if (comm.smsContent) description += `: ${comm.smsContent.substring(0, 100)}${comm.smsContent.length > 100 ? "..." : ""}`
    } else if (comm.channel === "email") {
      description = `${comm.direction === "outbound" ? "Outbound" : "Inbound"} email`
      if (comm.callSummary) description += `: ${comm.callSummary}`
    }

    timeline.push({
      type: "communication",
      description,
      createdAt: comm.createdAt,
    })
  }

  timeline.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return timeline
}

/**
 * GET /api/admin/leads/[id]
 * Returns comprehensive lead details for admin view
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        const timeline = buildTimeline(mockLead, mockCommunications)
        return successResponse({
          lead: { ...mockLead, id },
          communications: mockCommunications.map(c => ({
            id: c.id,
            channel: c.channel,
            direction: c.direction,
            disposition: c.disposition,
            outcome: c.outcome,
            callSummary: c.callSummary,
            smsContent: c.smsContent,
            createdAt: c.createdAt,
          })),
          timeline,
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
        .select({
          id: leadCommunications.id,
          channel: leadCommunications.channel,
          direction: leadCommunications.direction,
          disposition: leadCommunications.disposition,
          outcome: leadCommunications.outcome,
          callSummary: leadCommunications.callSummary,
          smsContent: leadCommunications.smsContent,
          createdAt: leadCommunications.createdAt,
        })
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))
        .orderBy(desc(leadCommunications.createdAt))
        .limit(50)

      const leadData = {
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        businessName: lead.businessName,
        businessType: lead.businessType,
        status: lead.status,
        interestLevel: lead.interestLevel,
        interestScore: lead.interestScore,
        source: lead.source,
        initialValue: lead.initialValue,
        convertedValue: lead.convertedValue,
        lastActivityAt: lead.lastActivityAt?.toISOString() || null,
        nextFollowUpAt: null as string | null,
        createdAt: lead.createdAt.toISOString(),
      }

      const lastCommWithFollowUp = await db!
        .select({ nextFollowUpAt: leadCommunications.nextFollowUpAt })
        .from(leadCommunications)
        .where(eq(leadCommunications.leadId, id))
        .orderBy(desc(leadCommunications.createdAt))
        .limit(1)

      if (lastCommWithFollowUp[0]?.nextFollowUpAt) {
        leadData.nextFollowUpAt = lastCommWithFollowUp[0].nextFollowUpAt.toISOString()
      }

      const commsForTimeline = communications.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      }))

      const timeline = buildTimeline(
        { ...leadData, createdAt: lead.createdAt.toISOString() } as typeof mockLead,
        commsForTimeline as typeof mockCommunications
      )

      return successResponse({
        lead: leadData,
        communications: commsForTimeline,
        timeline,
      })
    } catch (error: any) {
      console.error("[Admin Lead] GET Error:", error)
      return serverError(error.message || "Failed to fetch lead")
    }
  })
}

/**
 * PUT /api/admin/leads/[id]
 * Update lead details and status
 */
export async function PUT(request: NextRequest, context: RouteContext) {
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

      const [existingLead] = await db!
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!existingLead) {
        return notFoundError("Lead")
      }

      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      if (data.status !== undefined) updateData.status = data.status
      if (data.interestLevel !== undefined) updateData.interestLevel = data.interestLevel
      if (data.businessName !== undefined) updateData.businessName = data.businessName
      if (data.businessType !== undefined) updateData.businessType = data.businessType

      if (data.status === "converted") {
        updateData.convertedAt = new Date()
      }

      if (data.interestLevel) {
        updateData.lastActivityAt = new Date()
        if (data.interestLevel === "hot") updateData.interestScore = 80
        else if (data.interestLevel === "warm") updateData.interestScore = 50
        else updateData.interestScore = 20
      }

      const [updated] = await db!
        .update(leads)
        .set(updateData)
        .where(eq(leads.id, id))
        .returning()

      if (data.nextFollowUpAt !== undefined) {
        await db!
          .insert(leadCommunications)
          .values({
            leadId: id,
            channel: "email",
            direction: "outbound",
            callSummary: data.notes || "Follow-up scheduled",
            nextFollowUpAt: data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null,
          })
      } else if (data.notes) {
        await db!
          .insert(leadCommunications)
          .values({
            leadId: id,
            channel: "email",
            direction: "outbound",
            callSummary: data.notes,
          })
      }

      return successResponse(updated, "Lead updated")
    } catch (error: any) {
      console.error("[Admin Lead] PUT Error:", error)
      return serverError(error.message || "Failed to update lead")
    }
  })
}

/**
 * PATCH /api/admin/leads/[id]
 * Update a lead (legacy support)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return PUT(request, context)
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
