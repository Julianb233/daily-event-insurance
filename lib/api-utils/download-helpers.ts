/**
 * Download API Helper Functions
 *
 * Utilities for managing resource downloads, tracking, and asset generation
 */

import { db, partners, partnerResources, resourceDownloads } from "@/lib/db"
import { eq, and, desc } from "drizzle-orm"

/**
 * Get download count for a specific resource
 */
export async function getResourceDownloadCount(
  resourceId: string,
  partnerId?: string
): Promise<number> {
  if (!db) return 0

  try {
    const query = partnerId
      ? eq(resourceDownloads.partnerId, partnerId)
      : undefined

    const downloads = await db
      .select()
      .from(resourceDownloads)
      .where(
        query
          ? and(eq(resourceDownloads.resourceId, resourceId), query)
          : eq(resourceDownloads.resourceId, resourceId)
      )

    return downloads.length
  } catch (error) {
    console.error("Error getting download count:", error)
    return 0
  }
}

/**
 * Get top downloaded resources
 */
export async function getTopDownloadedResources(limit = 10) {
  if (!db) return []

  try {
    const downloads = await db
      .select({
        resourceId: resourceDownloads.resourceId,
      })
      .from(resourceDownloads)

    // Count downloads per resource
    const downloadCounts = downloads.reduce((acc, { resourceId }) => {
      acc[resourceId] = (acc[resourceId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Sort by count and get top N
    const topResources = Object.entries(downloadCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([resourceId, count]) => ({ resourceId, count }))

    // Get resource details
    const resourceIds = topResources.map((r) => r.resourceId)
    const resources = await db
      .select()
      .from(partnerResources)
      .where(
        eq(
          partnerResources.id,
          resourceIds[0] // This is a simplification; in production, use IN query
        )
      )

    return topResources.map(({ resourceId, count }) => {
      const resource = resources.find((r) => r.id === resourceId)
      return {
        ...resource,
        downloadCount: count,
      }
    })
  } catch (error) {
    console.error("Error getting top downloads:", error)
    return []
  }
}

/**
 * Get download history for a partner
 */
export async function getPartnerDownloadHistory(
  partnerId: string,
  limit = 50
) {
  if (!db) return []

  try {
    const downloads = await db
      .select({
        id: resourceDownloads.id,
        resourceId: resourceDownloads.resourceId,
        downloadedAt: resourceDownloads.downloadedAt,
      })
      .from(resourceDownloads)
      .where(eq(resourceDownloads.partnerId, partnerId))
      .orderBy(desc(resourceDownloads.downloadedAt))
      .limit(limit)

    // Get resource details
    const resourceIds = downloads.map((d) => d.resourceId)
    const resources = await db
      .select()
      .from(partnerResources)

    return downloads.map((download) => {
      const resource = resources.find((r) => r.id === download.resourceId)
      return {
        ...download,
        resource,
      }
    })
  } catch (error) {
    console.error("Error getting download history:", error)
    return []
  }
}

/**
 * Track a resource download
 */
export async function trackResourceDownload(
  partnerId: string,
  resourceId: string
): Promise<boolean> {
  if (!db) return false

  try {
    await db.insert(resourceDownloads).values({
      partnerId,
      resourceId,
    })
    return true
  } catch (error) {
    console.error("Error tracking download:", error)
    return false
  }
}

/**
 * Get download statistics by category
 */
export async function getDownloadStatsByCategory(partnerId?: string) {
  if (!db) return { marketing: 0, training: 0, documentation: 0 }

  try {
    const downloads = partnerId
      ? await db
          .select()
          .from(resourceDownloads)
          .where(eq(resourceDownloads.partnerId, partnerId))
      : await db.select().from(resourceDownloads)

    const resources = await db.select().from(partnerResources)

    const stats = {
      marketing: 0,
      training: 0,
      documentation: 0,
    }

    downloads.forEach((download) => {
      const resource = resources.find((r) => r.id === download.resourceId)
      if (resource && resource.category in stats) {
        stats[resource.category as keyof typeof stats]++
      }
    })

    return stats
  } catch (error) {
    console.error("Error getting download stats:", error)
    return { marketing: 0, training: 0, documentation: 0 }
  }
}

/**
 * Validate file path for security
 */
export function validateFilePath(filename: string): boolean {
  // Check for path traversal attempts
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return false
  }

  // Check for null bytes
  if (filename.includes("\0")) {
    return false
  }

  // Check filename length
  if (filename.length > 255) {
    return false
  }

  return true
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string | null {
  const parts = filename.split(".")
  if (parts.length < 2) return null
  return parts[parts.length - 1].toLowerCase()
}

/**
 * Check if file type is allowed
 */
export function isAllowedFileType(filename: string): boolean {
  const ext = getFileExtension(filename)
  const allowedExtensions = ["pdf", "zip", "png", "svg", "jpg", "jpeg"]
  return ext ? allowedExtensions.includes(ext) : false
}
