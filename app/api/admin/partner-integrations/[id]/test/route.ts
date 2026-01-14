import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, partnerIntegrations } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, serverError, notFound } from "@/lib/api-responses"

/**
 * POST /api/admin/partner-integrations/[id]/test
 * Test a specific partner integration
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await params

      // Dev mode mock response
      if (isDevMode || !isDbConfigured()) {
        // Simulate test delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Random success/failure for demo
        const success = Math.random() > 0.3

        return successResponse({
          id,
          testResult: success ? "success" : "error",
          testErrors: success ? null : '["Connection timeout","API endpoint unreachable"]',
          lastTestedAt: new Date().toISOString(),
          message: success ? "Integration test passed" : "Integration test failed",
        })
      }

      // Get the integration
      const [integration] = await db!
        .select()
        .from(partnerIntegrations)
        .where(eq(partnerIntegrations.id, id))
        .limit(1)

      if (!integration) {
        return notFound("Partner integration")
      }

      // Perform integration test based on type
      let testResult: "success" | "error" | "pending" = "pending"
      let testErrors: string[] = []

      try {
        switch (integration.integrationType) {
          case "widget":
            // Test widget configuration
            const config = integration.configuration
              ? JSON.parse(integration.configuration)
              : {}

            // Check required widget settings
            if (!config.partnerId && !integration.partnerId) {
              testErrors.push("Widget partner ID not configured")
            }

            testResult = testErrors.length === 0 ? "success" : "error"
            break

          case "api":
            // Test API connectivity
            if (!integration.apiKeyGenerated) {
              testErrors.push("API key not generated")
            }
            if (!integration.webhookConfigured) {
              testErrors.push("Webhook not configured")
            }

            testResult = testErrors.length === 0 ? "success" : "error"
            break

          case "pos":
            // Test POS integration
            if (!integration.posSystem) {
              testErrors.push("POS system not specified")
            }
            if (!integration.configuration) {
              testErrors.push("POS configuration not set")
            }

            // Here we would make actual API calls to the POS system
            // For now, just validate configuration exists
            testResult = testErrors.length === 0 ? "success" : "error"
            break

          default:
            testErrors.push(`Unknown integration type: ${integration.integrationType}`)
            testResult = "error"
        }
      } catch (error) {
        testErrors.push(`Test execution error: ${error instanceof Error ? error.message : "Unknown error"}`)
        testResult = "error"
      }

      // Update the integration with test results
      const [updated] = await db!
        .update(partnerIntegrations)
        .set({
          lastTestedAt: new Date(),
          testResult,
          testErrors: testErrors.length > 0 ? JSON.stringify(testErrors) : null,
          updatedAt: new Date(),
        })
        .where(eq(partnerIntegrations.id, id))
        .returning()

      return successResponse({
        id: updated.id,
        testResult: updated.testResult,
        testErrors: updated.testErrors,
        lastTestedAt: updated.lastTestedAt?.toISOString(),
        message: testResult === "success"
          ? "Integration test passed"
          : "Integration test failed",
      })
    } catch (error: unknown) {
      console.error("[Admin Partner Integration Test] POST Error:", error)
      const message = error instanceof Error ? error.message : "Failed to test integration"
      return serverError(message)
    }
  })
}
