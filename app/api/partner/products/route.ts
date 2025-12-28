import { NextRequest, NextResponse } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partners, partnerProducts } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode, MOCK_PRODUCTS } from "@/lib/mock-data"
import { successResponse, notFoundError, serverError } from "@/lib/api-responses"
import { validateQuery, productsListSchema } from "@/lib/api-validation"

/**
 * GET /api/partner/products
 * Get partner's insurance products
 *
 * Query params:
 * - enabled: boolean (optional) - Filter by enabled status
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      // Validate query parameters
      const query = validateQuery(productsListSchema, request.nextUrl.searchParams)

      // Dev mode - return mock data
      if (isDevMode || !isDbConfigured()) {
        console.log("[DEV MODE] Returning mock products data")
        let products = MOCK_PRODUCTS

        if (query.enabled !== undefined) {
          products = products.filter(p => p.is_enabled === query.enabled)
        }

        return successResponse({
          products,
          summary: {
            total: products.length,
            enabled: products.filter(p => p.is_enabled).length,
            disabled: products.filter(p => !p.is_enabled).length,
          }
        })
      }

      // Get partner
      const partnerResult = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (partnerResult.length === 0) {
        return notFoundError("Partner")
      }

      const partner = partnerResult[0]

      // Get products
      let products = await db!
        .select()
        .from(partnerProducts)
        .where(eq(partnerProducts.partnerId, partner.id))

      // Apply filters
      if (query.enabled !== undefined) {
        products = products.filter(p => p.isEnabled === query.enabled)
      }

      // Calculate summary
      const summary = {
        total: products.length,
        enabled: products.filter(p => p.isEnabled).length,
        disabled: products.filter(p => !p.isEnabled).length,
      }

      return successResponse({
        products,
        summary,
      })
    } catch (error: any) {
      console.error("[Partner Products] Error:", error)

      if (error.name === "ZodError") {
        return NextResponse.json(
          {
            success: false,
            error: "Validation Error",
            message: "Invalid query parameters",
            details: error.errors,
          },
          { status: 400 }
        )
      }

      return serverError(error.message || "Failed to fetch products")
    }
  })
}
