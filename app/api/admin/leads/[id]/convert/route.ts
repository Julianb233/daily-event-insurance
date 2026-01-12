import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads, users, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  notFoundError,
  serverError,
  validationError,
  conflictError,
} from "@/lib/api-responses"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

const convertLeadSchema = z.object({
  businessName: z.string().max(200).optional(),
  businessType: z.string().max(50).optional(),
  integrationType: z.enum(["widget", "api", "manual"]).optional(),
})

/**
 * POST /api/admin/leads/[id]/convert
 * Convert lead to partner
 */
export async function POST(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json().catch(() => ({}))

      const validationResult = convertLeadSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid conversion data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const mockPartnerId = `p${Date.now()}`
        return successResponse({
          partnerId: mockPartnerId,
          userId: `u${Date.now()}`,
          lead: {
            id,
            status: "converted",
            convertedAt: new Date().toISOString(),
          },
        }, "Lead converted to partner")
      }

      const [lead] = await db!
        .select()
        .from(leads)
        .where(eq(leads.id, id))
        .limit(1)

      if (!lead) {
        return notFoundError("Lead")
      }

      if (lead.status === "converted") {
        return conflictError("Lead has already been converted")
      }

      const [existingUser] = await db!
        .select()
        .from(users)
        .where(eq(users.email, lead.email))
        .limit(1)

      if (existingUser) {
        const [existingPartner] = await db!
          .select()
          .from(partners)
          .where(eq(partners.userId, existingUser.id))
          .limit(1)

        if (existingPartner) {
          return conflictError("A partner with this email already exists")
        }
      }

      const businessName = data.businessName || lead.businessName || `${lead.firstName} ${lead.lastName}`
      const businessType = data.businessType || lead.businessType || "other"
      const integrationType = data.integrationType || "widget"

      let userId: string

      if (existingUser) {
        userId = existingUser.id
        await db!
          .update(users)
          .set({
            role: "partner",
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id))
      } else {
        const [newUser] = await db!
          .insert(users)
          .values({
            email: lead.email,
            name: `${lead.firstName} ${lead.lastName}`,
            role: "partner",
          })
          .returning()
        userId = newUser.id
      }

      const [newPartner] = await db!
        .insert(partners)
        .values({
          userId,
          businessName,
          businessType,
          contactName: `${lead.firstName} ${lead.lastName}`,
          contactEmail: lead.email,
          contactPhone: lead.phone,
          integrationType,
          status: "pending",
        })
        .returning()

      await db!
        .update(leads)
        .set({
          status: "converted",
          convertedAt: new Date(),
          convertedValue: "100.00",
          updatedAt: new Date(),
        })
        .where(eq(leads.id, id))

      return successResponse({
        partnerId: newPartner.id,
        userId,
        lead: {
          id,
          status: "converted",
          convertedAt: new Date().toISOString(),
        },
      }, "Lead converted to partner")
    } catch (error: any) {
      console.error("[Admin Lead Convert] POST Error:", error)
      return serverError(error.message || "Failed to convert lead")
    }
  })
}
