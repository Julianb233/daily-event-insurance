import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerResources, resourceDownloads } from "@/lib/db"
import { eq } from "drizzle-orm"
import { promises as fs } from "fs"
import path from "path"
import { isDevMode } from "@/lib/mock-data"

// Valid categories from partner-resources-data.ts
const VALID_CATEGORIES = ["marketing", "training", "documentation"] as const
type ValidCategory = typeof VALID_CATEGORIES[number]

// Valid file extensions
const VALID_FILE_TYPES = {
  pdf: "application/pdf",
  zip: "application/zip",
  png: "image/png",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
} as const

// Helper to validate category
function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory)
}

// Helper to get content type from file extension
function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase()
  if (!ext || !(ext in VALID_FILE_TYPES)) {
    return "application/octet-stream"
  }
  return VALID_FILE_TYPES[ext as keyof typeof VALID_FILE_TYPES]
}

/**
 * GET /api/downloads/[category]/[asset]
 * Download a partner resource asset
 *
 * @param category - marketing, training, or documentation
 * @param asset - filename to download
 *
 * Features:
 * - Validates category and file type
 * - Serves files from public/resources/[category]/
 * - Tracks downloads in database
 * - Optional: requires partner authentication for premium assets
 * - Sets proper Content-Type and Content-Disposition headers
 * - Returns 404 if file doesn't exist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; asset: string }> }
) {
  return withAuth(async () => {
    const { userId } = await requirePartner()
    const { category, asset } = await params

    // Validate category
    if (!isValidCategory(category)) {
      // SECURITY: Don't expose valid categories in production
      const isProduction = process.env.NODE_ENV === "production"
      return NextResponse.json(
        {
          error: "Invalid category",
          message: isProduction
            ? "Invalid category provided"
            : `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Validate asset filename (prevent path traversal)
    if (asset.includes("..") || asset.includes("/") || asset.includes("\\")) {
      return NextResponse.json(
        { error: "Invalid asset name", message: "Asset name contains invalid characters" },
        { status: 400 }
      )
    }

    // Validate file extension
    const ext = asset.split(".").pop()?.toLowerCase()
    if (!ext || !(ext in VALID_FILE_TYPES)) {
      // SECURITY: Don't expose valid file types in production
      const isProduction = process.env.NODE_ENV === "production"
      return NextResponse.json(
        {
          error: "Invalid file type",
          message: isProduction
            ? "Invalid file type"
            : `File type must be one of: ${Object.keys(VALID_FILE_TYPES).join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Construct file path
    const filePath = path.join(process.cwd(), "public", "resources", category, asset)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch (error) {
      console.error(`[DOWNLOAD] File not found: ${filePath}`)
      return NextResponse.json(
        { error: "File not found", message: "The requested resource does not exist" },
        { status: 404 }
      )
    }

    // Track download in database (skip in dev mode if DB not configured)
    if (!isDevMode && isDbConfigured()) {
      try {
        // Get partner ID
        const partnerResult = await db!
          .select()
          .from(partners)
          .where(eq(partners.userId, userId))
          .limit(1)

        if (partnerResult.length > 0) {
          const partner = partnerResult[0]

          // Find resource by file URL pattern
          const resourceResult = await db!
            .select()
            .from(partnerResources)
            .where(eq(partnerResources.category, category))

          // Find matching resource by filename
          const resource = resourceResult.find((r) =>
            r.fileUrl?.includes(asset)
          )

          if (resource) {
            // Record download
            await db!.insert(resourceDownloads).values({
              partnerId: partner.id,
              resourceId: resource.id,
            })

            console.log(`[DOWNLOAD] Tracked download: ${asset} for partner ${partner.id}`)
          } else {
            console.warn(`[DOWNLOAD] Resource not found in DB for: ${asset}`)
          }
        }
      } catch (dbError) {
        // Don't fail the download if tracking fails
        console.error("[DOWNLOAD] Error tracking download:", dbError)
      }
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath)

    // Determine content type
    const contentType = getContentType(asset)

    // Escape filename for Content-Disposition header (prevent header injection)
    const safeFilename = asset.replace(/"/g, '\\"').replace(/[\r\n]/g, '')

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "private, max-age=3600", // 1 hour, private (requires auth)
        "X-Content-Type-Options": "nosniff", // Prevent MIME sniffing
        "X-Frame-Options": "DENY", // Prevent framing
      },
    })
  })
}

/**
 * HEAD /api/downloads/[category]/[asset]
 * Check if a resource exists without downloading it
 */
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; asset: string }> }
) {
  const { category, asset } = await params

  // Validate category
  if (!isValidCategory(category)) {
    return new NextResponse(null, { status: 400 })
  }

  // Validate asset filename
  if (asset.includes("..") || asset.includes("/") || asset.includes("\\")) {
    return new NextResponse(null, { status: 400 })
  }

  // Construct file path
  const filePath = path.join(process.cwd(), "public", "resources", category, asset)

  // Check if file exists
  try {
    const stats = await fs.stat(filePath)
    const contentType = getContentType(asset)

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
      },
    })
  } catch (error) {
    return new NextResponse(null, { status: 404 })
  }
}
