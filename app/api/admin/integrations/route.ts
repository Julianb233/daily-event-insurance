import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, apiIntegrations } from "@/lib/db"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
} from "@/lib/api-responses"

// Mock data for development
const mockIntegrations = [
  {
    id: "int1",
    name: "hiqor",
    displayName: "HIQOR",
    isActive: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    lastSyncStatus: "success",
    lastSyncError: null,
    syncInterval: 60,
    autoSync: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "int2",
    name: "sures",
    displayName: "Sures",
    isActive: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    lastSyncStatus: "success",
    lastSyncError: null,
    syncInterval: 30,
    autoSync: true,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
]

/**
 * GET /api/admin/integrations
 * List all API integrations with their status (excludes sensitive credentials)
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        return successResponse(mockIntegrations)
      }

      // Get all integrations (exclude sensitive fields)
      const integrations = await db!
        .select({
          id: apiIntegrations.id,
          name: apiIntegrations.name,
          displayName: apiIntegrations.displayName,
          isActive: apiIntegrations.isActive,
          lastSyncAt: apiIntegrations.lastSyncAt,
          lastSyncStatus: apiIntegrations.lastSyncStatus,
          lastSyncError: apiIntegrations.lastSyncError,
          syncInterval: apiIntegrations.syncInterval,
          autoSync: apiIntegrations.autoSync,
          createdAt: apiIntegrations.createdAt,
          updatedAt: apiIntegrations.updatedAt,
        })
        .from(apiIntegrations)

      return successResponse(integrations)
    } catch (error: any) {
      console.error("[Admin Integrations] GET Error:", error)
      return serverError(error.message || "Failed to fetch integrations")
    }
  })
}
