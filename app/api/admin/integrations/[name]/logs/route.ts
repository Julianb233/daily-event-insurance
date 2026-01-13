import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, apiIntegrations, apiSyncLogs } from "@/lib/db"
import { eq, desc, and, count, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  paginatedResponse,
  serverError,
  notFound,
  badRequest,
} from "@/lib/api-responses"

// Mock sync logs for development
function generateMockLogs(integrationName: string, page: number, pageSize: number) {
  const integrationId = integrationName === "hiqor" ? "int1" : "int2"
  const logs = []

  // Generate 50 mock logs
  for (let i = 0; i < 50; i++) {
    const startedAt = new Date(Date.now() - i * 1000 * 60 * 60) // 1 hour apart
    const duration = Math.floor(Math.random() * 5000) + 500
    const success = Math.random() > 0.15 // 85% success rate

    logs.push({
      id: `log_${integrationName}_${i}`,
      integrationId,
      syncType: i % 10 === 0 ? "manual" : "scheduled",
      status: success ? "success" : "error",
      recordsProcessed: success ? Math.floor(Math.random() * 100) + 10 : 0,
      errorMessage: success ? null : ["Connection timeout", "Rate limit exceeded", "Invalid response"][Math.floor(Math.random() * 3)],
      startedAt: startedAt.toISOString(),
      completedAt: new Date(startedAt.getTime() + duration).toISOString(),
      duration,
    })
  }

  // Paginate
  const start = (page - 1) * pageSize
  const paginatedLogs = logs.slice(start, start + pageSize)

  return { logs: paginatedLogs, total: logs.length }
}

/**
 * GET /api/admin/integrations/[name]/logs
 * Get sync history/logs for an integration
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { name } = await params
      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get("page") || "1")
      const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20"), 100)
      const status = searchParams.get("status") || "" // 'started' | 'success' | 'error' | ''

      // Validate name
      if (!["hiqor", "sures"].includes(name)) {
        return badRequest("Invalid integration name. Must be 'hiqor' or 'sures'")
      }

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        let { logs, total } = generateMockLogs(name, page, pageSize)

        // Apply status filter
        if (status) {
          logs = logs.filter(l => l.status === status)
          total = logs.length
        }

        return paginatedResponse(logs, page, pageSize, total)
      }

      // Get integration
      const [integration] = await db!
        .select()
        .from(apiIntegrations)
        .where(eq(apiIntegrations.name, name))
        .limit(1)

      if (!integration) {
        return notFound("Integration")
      }

      // Build where conditions
      const conditions = [eq(apiSyncLogs.integrationId, integration.id)]
      if (status) {
        conditions.push(eq(apiSyncLogs.status, status))
      }

      const whereClause = and(...conditions)

      // Get total count
      const [{ total }] = await db!
        .select({ total: count() })
        .from(apiSyncLogs)
        .where(whereClause)

      // Get logs with pagination
      const offset = (page - 1) * pageSize

      const logs = await db!
        .select({
          id: apiSyncLogs.id,
          integrationId: apiSyncLogs.integrationId,
          syncType: apiSyncLogs.syncType,
          status: apiSyncLogs.status,
          recordsProcessed: apiSyncLogs.recordsProcessed,
          errorMessage: apiSyncLogs.errorMessage,
          startedAt: apiSyncLogs.startedAt,
          completedAt: apiSyncLogs.completedAt,
          duration: sql<number>`EXTRACT(EPOCH FROM (${apiSyncLogs.completedAt} - ${apiSyncLogs.startedAt})) * 1000`,
        })
        .from(apiSyncLogs)
        .where(whereClause)
        .orderBy(desc(apiSyncLogs.startedAt))
        .limit(pageSize)
        .offset(offset)

      return paginatedResponse(logs, page, pageSize, Number(total))
    } catch (error: any) {
      console.error("[Admin Integrations Logs] GET Error:", error)
      return serverError(error.message || "Failed to fetch sync logs")
    }
  })
}
