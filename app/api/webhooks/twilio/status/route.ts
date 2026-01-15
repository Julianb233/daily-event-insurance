/**
 * Twilio SMS Status Webhook
 * Receives delivery status updates for outbound SMS messages
 */

import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured, leadCommunications } from "@/lib/db"
import { sql, eq, like } from "drizzle-orm"
import { verifyWebhookSignature, parseDeliveryStatus } from "@/lib/twilio"

/**
 * POST /api/webhooks/twilio/status
 * Handle SMS delivery status updates from Twilio
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio
    const formData = await request.formData()
    const body: Record<string, string> = {}
    formData.forEach((value, key) => {
      body[key] = value.toString()
    })

    // Verify webhook signature in production
    if (process.env.NODE_ENV === "production") {
      const signature = request.headers.get("x-twilio-signature") || ""
      const url = request.url

      if (!verifyWebhookSignature(signature, url, body)) {
        console.error("[Twilio Status] Invalid signature")
        return new NextResponse("Forbidden", { status: 403 })
      }
    }

    // Parse the status update
    const status = parseDeliveryStatus(body)
    console.log(`[Twilio Status] Message ${status.messageSid}: ${status.status}`)

    if (!isDbConfigured()) {
      console.warn("[Twilio Status] Database not configured, skipping update")
      return new NextResponse("OK", { status: 200 })
    }

    // Find the communication record by Twilio message SID
    // We stored it in callSummary field as "Twilio SID: SMxxxx"
    const [communication] = await db!
      .select()
      .from(leadCommunications)
      .where(like(leadCommunications.callSummary, `%${status.messageSid}%`))
      .limit(1)

    if (communication) {
      // Map Twilio status to our status values
      let newStatus = status.status
      if (status.status === "delivered") {
        newStatus = "delivered"
      } else if (status.status === "failed" || status.status === "undelivered") {
        newStatus = "failed"
      } else if (status.status === "sent") {
        newStatus = "sent"
      }

      // Update the communication record
      await db!
        .update(leadCommunications)
        .set({
          smsStatus: newStatus,
          // Store error info if failed
          callSummary: status.errorCode
            ? `Twilio SID: ${status.messageSid} | Error: ${status.errorCode} - ${status.errorMessage}`
            : communication.callSummary,
        })
        .where(eq(leadCommunications.id, communication.id))

      console.log(`[Twilio Status] Updated communication ${communication.id} to ${newStatus}`)
    } else {
      console.log(`[Twilio Status] No communication found for message ${status.messageSid}`)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error: any) {
    console.error("[Twilio Status] Error:", error)
    // Return 200 to prevent Twilio from retrying
    return new NextResponse("OK", { status: 200 })
  }
}
