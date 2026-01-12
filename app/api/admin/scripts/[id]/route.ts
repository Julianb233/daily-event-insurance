import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, agentScripts } from "@/lib/db"
import { eq } from "drizzle-orm"
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

const updateScriptSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  businessType: z.string().max(50).optional().nullable(),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional().nullable(),
  geographicRegion: z.string().max(100).optional().nullable(),
  systemPrompt: z.string().min(1).optional(),
  openingScript: z.string().min(1).optional(),
  keyPoints: z.string().optional().nullable(),
  objectionHandlers: z.string().optional().nullable(),
  closingScript: z.string().optional().nullable(),
  maxCallDuration: z.number().int().min(60).max(3600).optional(),
  voiceId: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  priority: z.number().int().min(0).max(100).optional(),
})

const mockScript = {
  id: "s1",
  name: "Cold Outreach - Gym",
  description: "Initial outreach script for gym prospects",
  businessType: "gym",
  interestLevel: "cold",
  geographicRegion: null,
  systemPrompt: "You are an AI sales agent for Daily Event Insurance...",
  openingScript: "Hi, this is Alex from Daily Event Insurance...",
  keyPoints: JSON.stringify(["Low cost per participant", "$4.99 coverage", "No paperwork"]),
  objectionHandlers: JSON.stringify({ "too expensive": "Our coverage is just $4.99 per participant..." }),
  closingScript: "Would you like to schedule a quick demo?",
  maxCallDuration: 300,
  voiceId: "alloy",
  isActive: true,
  priority: 10,
  createdAt: "2024-12-15T00:00:00Z",
  updatedAt: "2024-12-20T00:00:00Z",
}

/**
 * GET /api/admin/scripts/[id]
 * Get a single agent script
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({ ...mockScript, id })
      }

      const [script] = await db!
        .select()
        .from(agentScripts)
        .where(eq(agentScripts.id, id))
        .limit(1)

      if (!script) {
        return notFoundError("Script")
      }

      return successResponse(script)
    } catch (error: any) {
      console.error("[Admin Script] GET Error:", error)
      return serverError(error.message || "Failed to fetch script")
    }
  })
}

/**
 * PATCH /api/admin/scripts/[id]
 * Update an agent script
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params
      const body = await request.json()

      const validationResult = updateScriptSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid script data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        return successResponse({
          ...mockScript,
          id,
          ...data,
          updatedAt: new Date().toISOString(),
        }, "Script updated")
      }

      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      }

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value
        }
      })

      const [updated] = await db!
        .update(agentScripts)
        .set(updateData)
        .where(eq(agentScripts.id, id))
        .returning()

      if (!updated) {
        return notFoundError("Script")
      }

      return successResponse(updated, "Script updated")
    } catch (error: any) {
      console.error("[Admin Script] PATCH Error:", error)
      return serverError(error.message || "Failed to update script")
    }
  })
}

/**
 * DELETE /api/admin/scripts/[id]
 * Delete an agent script (soft delete by deactivating)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      if (isDevMode || !isDbConfigured()) {
        return successResponse({ id }, "Script deleted")
      }

      const [deleted] = await db!
        .update(agentScripts)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(agentScripts.id, id))
        .returning()

      if (!deleted) {
        return notFoundError("Script")
      }

      return successResponse({ id }, "Script deleted")
    } catch (error: any) {
      console.error("[Admin Script] DELETE Error:", error)
      return serverError(error.message || "Failed to delete script")
    }
  })
}
