import { NextRequest, NextResponse } from "next/server"
import { processScheduledActions } from "@/lib/cron/process-scheduled-actions"

/**
 * POST /api/cron/process-actions
 * Vercel Cron endpoint to process scheduled actions
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-actions",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */
export async function POST(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const startTime = Date.now()
    const results = await processScheduledActions()
    const duration = Date.now() - startTime

    console.log(`[CRON] Processed ${results.processed} actions, ${results.failed} failed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        durationMs: duration,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[CRON] Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}

// Also support GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request)
}
