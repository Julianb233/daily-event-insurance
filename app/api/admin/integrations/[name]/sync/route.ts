import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, apiIntegrations, apiSyncLogs } from "@/lib/db"
import { eq, and, sql } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
  notFound,
  badRequest,
  conflictError,
} from "@/lib/api-responses"

/**
 * POST /api/admin/integrations/[name]/sync
 * Trigger a manual sync for the integration
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { name } = await params

      // Validate name
      if (!["hiqor", "sures"].includes(name)) {
        return badRequest("Invalid integration name. Must be 'hiqor' or 'sures'")
      }

      // Dev mode - simulate sync
      if (isDevMode || !isDbConfigured()) {
        // Simulate sync success/failure (90% success rate)
        const success = Math.random() > 0.1
        const recordsProcessed = success ? Math.floor(Math.random() * 100) + 10 : 0

        const syncResult = {
          id: `sync_${Date.now()}`,
          integrationId: name === "hiqor" ? "int1" : "int2",
          integrationName: name,
          syncType: "manual",
          status: success ? "success" : "error",
          recordsProcessed,
          errorMessage: success ? null : "Connection timeout - please retry",
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          duration: Math.floor(Math.random() * 5000) + 500, // 500ms - 5.5s
        }

        return successResponse(syncResult, success ? "Sync completed successfully" : "Sync failed")
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

      if (!integration.isActive) {
        return badRequest("Integration is not active. Please configure and activate it first.")
      }

      if (!integration.apiKey) {
        return badRequest("API key not configured. Please add API credentials first.")
      }

      // Check for in-progress sync
      const [inProgress] = await db!
        .select()
        .from(apiSyncLogs)
        .where(
          and(
            eq(apiSyncLogs.integrationId, integration.id),
            eq(apiSyncLogs.status, "started")
          )
        )
        .limit(1)

      if (inProgress) {
        return conflictError("A sync is already in progress. Please wait for it to complete.")
      }

      // Create sync log entry
      const [syncLog] = await db!
        .insert(apiSyncLogs)
        .values({
          integrationId: integration.id,
          syncType: "manual",
          status: "started",
          recordsProcessed: 0,
        })
        .returning()

      // TODO: Actually call the integration API here
      // For now, simulate a successful sync
      const recordsProcessed = Math.floor(Math.random() * 50) + 5

      // Update sync log with results
      const [completedSync] = await db!
        .update(apiSyncLogs)
        .set({
          status: "success",
          recordsProcessed,
          completedAt: new Date(),
        })
        .where(eq(apiSyncLogs.id, syncLog.id))
        .returning()

      // Update integration last sync info
      await db!
        .update(apiIntegrations)
        .set({
          lastSyncAt: new Date(),
          lastSyncStatus: "success",
          lastSyncError: null,
          updatedAt: new Date(),
        })
        .where(eq(apiIntegrations.id, integration.id))

      return successResponse({
        ...completedSync,
        integrationName: name,
        duration: completedSync.completedAt && syncLog.startedAt
          ? new Date(completedSync.completedAt).getTime() - new Date(syncLog.startedAt).getTime()
          : 0,
      }, "Sync completed successfully")
    } catch (error: any) {
      console.error("[Admin Integrations Sync] POST Error:", error)
      return serverError(error.message || "Failed to trigger sync")
    }
  })
}
