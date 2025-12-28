import { NextRequest, NextResponse } from "next/server"
import { batchUpdateExpiredQuotes } from "@/lib/pricing/quote-expiration"
import { successResponse, serverError } from "@/lib/api-responses"

/**
 * Cron endpoint to process expired quotes
 *
 * This should be called periodically (e.g., hourly via Vercel Cron or external scheduler)
 *
 * Example Vercel cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-quotes",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 *
 * For security, you can add authorization header check:
 * - Set CRON_SECRET in environment variables
 * - Pass as Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("[Cron] Starting quote expiration processing...")

    const result = await batchUpdateExpiredQuotes()

    console.log(
      `[Cron] Quote expiration complete: ${result.expired} expired, ${result.errors} errors`
    )

    return successResponse(
      {
        ...result,
        timestamp: new Date().toISOString(),
      },
      "Quote expiration processing completed"
    )
  } catch (error: any) {
    console.error("[Cron] Quote expiration error:", error)
    return serverError(error.message || "Failed to process expired quotes")
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
