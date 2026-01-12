import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leads } from "@/lib/db"
import { eq, and, ilike, or, desc, asc, count } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  paginatedResponse,
  serverError,
  validationError,
} from "@/lib/api-responses"
import { z } from "zod"

const mockLeads = [
  { id: "l1", firstName: "John", lastName: "Doe", email: "john@gym.com", phone: "(555) 111-2222", businessType: "gym", businessName: "FitLife Gym", source: "website_quote", status: "new", interestLevel: "hot", interestScore: 85, createdAt: "2024-12-20T10:00:00Z" },
  { id: "l2", firstName: "Sarah", lastName: "Smith", email: "sarah@climbing.com", phone: "(555) 333-4444", businessType: "climbing", businessName: "Peak Climbers", source: "ad_campaign", status: "contacted", interestLevel: "warm", interestScore: 60, createdAt: "2024-12-19T14:00:00Z" },
  { id: "l3", firstName: "Mike", lastName: "Johnson", email: "mike@adventure.io", phone: "(555) 555-6666", businessType: "adventure", businessName: "Wild Adventures", source: "partner_referral", status: "qualified", interestLevel: "hot", interestScore: 90, createdAt: "2024-12-18T09:00:00Z" },
]

const createLeadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  source: z.enum(["website_quote", "partner_referral", "cold_list", "ad_campaign"]),
  sourceDetails: z.string().optional(),
  businessType: z.string().max(50).optional(),
  businessName: z.string().max(200).optional(),
  estimatedParticipants: z.number().int().positive().optional(),
  interestLevel: z.enum(["cold", "warm", "hot"]).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
})

/**
 * GET /api/admin/leads
 * List leads with filtering and pagination
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const search = searchParams.get("search") || ""
      const status = searchParams.get("status") || ""
      const source = searchParams.get("source") || ""
      const interestLevel = searchParams.get("interestLevel") || ""
      const businessType = searchParams.get("businessType") || ""
      const sortBy = searchParams.get("sortBy") || "createdAt"
      const sortOrder = searchParams.get("sortOrder") || "desc"

      if (isDevMode || !isDbConfigured()) {
        let filtered = [...mockLeads]

        if (search) {
          const searchLower = search.toLowerCase()
          filtered = filtered.filter(l =>
            l.firstName.toLowerCase().includes(searchLower) ||
            l.lastName.toLowerCase().includes(searchLower) ||
            l.email.toLowerCase().includes(searchLower) ||
            l.businessName?.toLowerCase().includes(searchLower)
          )
        }

        if (status) filtered = filtered.filter(l => l.status === status)
        if (source) filtered = filtered.filter(l => l.source === source)
        if (interestLevel) filtered = filtered.filter(l => l.interestLevel === interestLevel)
        if (businessType) filtered = filtered.filter(l => l.businessType === businessType)

        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof typeof a] ?? ""
          const bVal = b[sortBy as keyof typeof b] ?? ""
          return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
        })

        const start = (page - 1) * pageSize
        return paginatedResponse(filtered.slice(start, start + pageSize), page, pageSize, filtered.length)
      }

      const conditions = []

      if (search) {
        conditions.push(
          or(
            ilike(leads.firstName, `%${search}%`),
            ilike(leads.lastName, `%${search}%`),
            ilike(leads.email, `%${search}%`),
            ilike(leads.businessName, `%${search}%`)
          )
        )
      }

      if (status) conditions.push(eq(leads.status, status))
      if (source) conditions.push(eq(leads.source, source))
      if (interestLevel) conditions.push(eq(leads.interestLevel, interestLevel))
      if (businessType) conditions.push(eq(leads.businessType, businessType))

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const [{ total }] = await db!
        .select({ total: count() })
        .from(leads)
        .where(whereClause)

      const offset = (page - 1) * pageSize
      const leadsData = await db!
        .select()
        .from(leads)
        .where(whereClause)
        .orderBy(sortOrder === "desc" ? desc(leads.createdAt) : asc(leads.createdAt))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(leadsData, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Leads] GET Error:", error)
      return serverError(error.message || "Failed to fetch leads")
    }
  })
}

/**
 * POST /api/admin/leads
 * Create a new lead
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const body = await request.json()

      const validationResult = createLeadSchema.safeParse(body)
      if (!validationResult.success) {
        return validationError(
          "Invalid lead data",
          validationResult.error.flatten().fieldErrors
        )
      }

      const data = validationResult.data

      if (isDevMode || !isDbConfigured()) {
        const newLead = {
          id: `l${Date.now()}`,
          ...data,
          status: "new",
          interestLevel: data.interestLevel || "cold",
          interestScore: data.interestLevel === "hot" ? 80 : data.interestLevel === "warm" ? 50 : 20,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        return successResponse(newLead, "Lead created", 201)
      }

      const [newLead] = await db!
        .insert(leads)
        .values({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          source: data.source,
          sourceDetails: data.sourceDetails,
          businessType: data.businessType,
          businessName: data.businessName,
          estimatedParticipants: data.estimatedParticipants,
          interestLevel: data.interestLevel || "cold",
          interestScore: data.interestLevel === "hot" ? 80 : data.interestLevel === "warm" ? 50 : 20,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          timezone: data.timezone || "America/Los_Angeles",
        })
        .returning()

      return successResponse(newLead, "Lead created", 201)
    } catch (error: any) {
      console.error("[Admin Leads] POST Error:", error)
      return serverError(error.message || "Failed to create lead")
    }
  })
}
