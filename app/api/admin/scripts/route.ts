import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, agentScripts } from "@/lib/db"
import { eq, and, desc, asc, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

const mockScripts = [
  {
    id: "s1",
    name: "Cold Outreach - Gym",
    description: "Initial outreach script for gym prospects",
    businessType: "gym",
    interestLevel: "cold",
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
  },
  {
    id: "s2",
    name: "Warm Lead Follow-up",
    description: "Follow-up script for warm leads who showed interest",
    businessType: null,
    interestLevel: "warm",
    systemPrompt: "You are following up with a prospect who expressed interest...",
    openingScript: "Hi, I'm following up on your inquiry about event insurance...",
    keyPoints: JSON.stringify(["Answer questions", "Address concerns", "Schedule demo"]),
    objectionHandlers: JSON.stringify({}),
    closingScript: "What questions can I answer for you?",
    maxCallDuration: 600,
    voiceId: "nova",
    isActive: true,
    priority: 20,
    createdAt: "2024-12-18T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
]

const createScriptSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  businessType: z.string().max(50).optional().nullable(),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional().nullable(),
  geographicRegion: z.string().max(100).optional().nullable(),
  systemPrompt: z.string().min(1),
  openingScript: z.string().min(1),
  keyPoints: z.string().optional(),
  objectionHandlers: z.string().optional(),
  closingScript: z.string().optional(),
  maxCallDuration: z.number().int().min(60).max(3600).optional(),
  voiceId: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  priority: z.number().int().min(0).max(100).optional(),
})

/**
 * GET /api/admin/scripts
 * List agent scripts
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const businessType = searchParams.get("businessType") || ""
      const interestLevel = searchParams.get("interestLevel") || ""
      const activeOnly = searchParams.get("activeOnly") === "true"
      const sortBy = searchParams.get("sortBy") || "priority"
      const sortOrder = searchParams.get("sortOrder") || "desc"

      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockScripts]

        if (businessType) filtered = filtered.filter(s => s.businessType === businessType)
        if (interestLevel) filtered = filtered.filter(s => s.interestLevel === interestLevel)
        if (activeOnly) filtered = filtered.filter(s => s.isActive)

        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof typeof a] ?? 0
          const bVal = b[sortBy as keyof typeof b] ?? 0
          return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
        })

        const start = (page - 1) * pageSize
        return paginatedResponse(filtered.slice(start, start + pageSize), page, pageSize, filtered.length)
      }

      const conditions = []

      if (businessType) conditions.push(eq(agentScripts.businessType, businessType))
      if (interestLevel) conditions.push(eq(agentScripts.interestLevel, interestLevel))
      if (activeOnly) conditions.push(eq(agentScripts.isActive, true))

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const [{ total }] = await db!
        .select({ total: count() })
        .from(agentScripts)
        .where(whereClause)

      const offset = (page - 1) * pageSize
      const scripts = await db!
        .select()
        .from(agentScripts)
        .where(whereClause)
        .orderBy(sortOrder === "desc" ? desc(agentScripts.priority) : asc(agentScripts.priority))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(scripts, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Scripts] GET Error:", error)
      return serverError(error.message || "Failed to fetch scripts")
    }
  })
}

/**
 * POST /api/admin/scripts
 * Create a new agent script
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const body = await request.json()

      const validationResult = createScriptSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid script data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const newScript = {
          id: `s${Date.now()}`,
          ...data,
          isActive: data.isActive ?? true,
          priority: data.priority ?? 0,
          maxCallDuration: data.maxCallDuration ?? 300,
          voiceId: data.voiceId ?? "alloy",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        return successResponse(newScript, "Script created", 201)
      }

      const [newScript] = await db!
        .insert(agentScripts)
        .values({
          name: data.name,
          description: data.description,
          businessType: data.businessType,
          interestLevel: data.interestLevel,
          geographicRegion: data.geographicRegion,
          systemPrompt: data.systemPrompt,
          openingScript: data.openingScript,
          keyPoints: data.keyPoints,
          objectionHandlers: data.objectionHandlers,
          closingScript: data.closingScript,
          maxCallDuration: data.maxCallDuration ?? 300,
          voiceId: data.voiceId ?? "alloy",
          isActive: data.isActive ?? true,
          priority: data.priority ?? 0,
        })
        .returning()

      return successResponse(newScript, "Script created", 201)
    } catch (error: any) {
      console.error("[Admin Scripts] POST Error:", error)
      return serverError(error.message || "Failed to create script")
    }
  })
}
