import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, apiIntegrations } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
  notFound,
  badRequest,
} from "@/lib/api-responses"

// Mock data for development
const mockIntegrations: Record<string, any> = {
  hiqor: {
    id: "int1",
    name: "hiqor",
    displayName: "HIQOR",
    apiKey: "hiqor_live_xxxxxxxxxxxx",
    apiSecret: "hiqor_secret_xxxxxxxxxxxx",
    baseUrl: "https://api.hiqor.com/v1",
    webhookSecret: "whsec_xxxxxxxxxxxx",
    isActive: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lastSyncStatus: "success",
    lastSyncError: null,
    syncInterval: 60,
    autoSync: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  sures: {
    id: "int2",
    name: "sures",
    displayName: "Sures",
    apiKey: "sures_live_xxxxxxxxxxxx",
    apiSecret: "sures_secret_xxxxxxxxxxxx",
    baseUrl: "https://api.sures.io/v1",
    webhookSecret: "whsec_xxxxxxxxxxxx",
    isActive: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastSyncStatus: "success",
    lastSyncError: null,
    syncInterval: 30,
    autoSync: true,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
}

/**
 * GET /api/admin/integrations/[name]
 * Get full integration details including credentials
 */
export async function GET(
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

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const integration = mockIntegrations[name]
        if (!integration) {
          return notFound("Integration")
        }
        return successResponse(integration)
      }

      const [integration] = await db!
        .select()
        .from(apiIntegrations)
        .where(eq(apiIntegrations.name, name))
        .limit(1)

      if (!integration) {
        return notFound("Integration")
      }

      return successResponse(integration)
    } catch (error: any) {
      console.error("[Admin Integrations] GET by name Error:", error)
      return serverError(error.message || "Failed to fetch integration")
    }
  })
}

/**
 * PATCH /api/admin/integrations/[name]
 * Update integration configuration
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()

      const { name } = await params
      const body = await request.json()

      // Validate name
      if (!["hiqor", "sures"].includes(name)) {
        return badRequest("Invalid integration name. Must be 'hiqor' or 'sures'")
      }

      const {
        apiKey,
        apiSecret,
        baseUrl,
        webhookSecret,
        isActive,
        syncInterval,
        autoSync,
      } = body

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const integration = mockIntegrations[name]
        if (!integration) {
          return notFound("Integration")
        }

        const updated = {
          ...integration,
          ...(apiKey !== undefined && { apiKey }),
          ...(apiSecret !== undefined && { apiSecret }),
          ...(baseUrl !== undefined && { baseUrl }),
          ...(webhookSecret !== undefined && { webhookSecret }),
          ...(isActive !== undefined && { isActive }),
          ...(syncInterval !== undefined && { syncInterval }),
          ...(autoSync !== undefined && { autoSync }),
          updatedAt: new Date().toISOString(),
        }

        return successResponse(updated, "Integration updated successfully")
      }

      // Check if integration exists
      const [existing] = await db!
        .select()
        .from(apiIntegrations)
        .where(eq(apiIntegrations.name, name))
        .limit(1)

      if (!existing) {
        // Create new integration if doesn't exist
        const displayName = name === "hiqor" ? "HIQOR" : "Sures"
        const [newIntegration] = await db!
          .insert(apiIntegrations)
          .values({
            name,
            displayName,
            apiKey: apiKey || null,
            apiSecret: apiSecret || null,
            baseUrl: baseUrl || null,
            webhookSecret: webhookSecret || null,
            isActive: isActive ?? false,
            syncInterval: syncInterval ?? 60,
            autoSync: autoSync ?? true,
          })
          .returning()

        return successResponse(newIntegration, "Integration created successfully", 201)
      }

      // Build update object
      const updateData: any = {
        updatedAt: new Date(),
      }

      if (apiKey !== undefined) updateData.apiKey = apiKey
      if (apiSecret !== undefined) updateData.apiSecret = apiSecret
      if (baseUrl !== undefined) updateData.baseUrl = baseUrl
      if (webhookSecret !== undefined) updateData.webhookSecret = webhookSecret
      if (isActive !== undefined) updateData.isActive = isActive
      if (syncInterval !== undefined) updateData.syncInterval = syncInterval
      if (autoSync !== undefined) updateData.autoSync = autoSync

      const [updated] = await db!
        .update(apiIntegrations)
        .set(updateData)
        .where(eq(apiIntegrations.name, name))
        .returning()

      return successResponse(updated, "Integration updated successfully")
    } catch (error: any) {
      console.error("[Admin Integrations] PATCH Error:", error)
      return serverError(error.message || "Failed to update integration")
    }
  })
}
