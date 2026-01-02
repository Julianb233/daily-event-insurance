/**
 * Email Cron Job API Route
 * Processes scheduled emails every 5 minutes
 *
 * Setup:
 * 1. Add CRON_SECRET to environment variables
 * 2. Configure in vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/cron/email",
 *        "schedule": "/5 * * * *"
 *      }]
 *    }
 */

import { processScheduledEmails } from '@/lib/email'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[Email Cron] CRON_SECRET not configured')
      return NextResponse.json(
        { error: 'Cron job not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('[Email Cron] Unauthorized request')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Process scheduled emails
    console.log('[Email Cron] Processing scheduled emails...')
    const results = await processScheduledEmails()

    console.log('[Email Cron] Results:', results)

    return NextResponse.json({
      success: true,
      processed: results.processed,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Email Cron] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
