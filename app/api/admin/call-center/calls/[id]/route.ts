import { NextRequest } from "next/server"
import { requireAdmin, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, leadCommunications } from "@/lib/db"
import { eq } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import { successResponse, notFoundError, serverError } from "@/lib/api-responses"

type RouteContext = {
  params: Promise<{ id: string }>
}

// Mock call detail for development mode
const mockCallDetails: Record<string, any> = {
  "call-1": {
    id: "call-1",
    leadId: "l1",
    callerName: "Michael Torres",
    callerPhone: "(555) 123-4567",
    callerEmail: "michael@fitlifegym.com",
    businessType: "gym",
    businessName: "FitLife Gym",
    duration: 525,
    durationFormatted: "8:45",
    status: "completed",
    disposition: "reached",
    direction: "inbound",
    sentiment: "positive",
    sentimentScore: 0.85,
    outcome: "positive",
    location: "Austin, TX",
    agentId: "ai_sarah",
    agentScriptUsed: "gym-hot-lead",
    agentConfidenceScore: 0.92,
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    recordingUrl: "https://storage.example.com/recordings/call-1.mp3",
    transcript: [
      { speaker: "agent", text: "Hello! This is Sarah from Daily Event Insurance. How can I help you today?", timestamp: 0 },
      { speaker: "user", text: "Hi Sarah, I'm calling about getting liability coverage for my gym. We host fitness events weekly.", timestamp: 5 },
      { speaker: "agent", text: "That's great! We specialize in same-day coverage for fitness facilities. How many participants typically attend your events?", timestamp: 12 },
      { speaker: "user", text: "Usually around 30 to 50 people per event. We do group fitness classes and occasional competitions.", timestamp: 20 },
      { speaker: "agent", text: "Perfect. For events of that size, our standard liability coverage would be ideal. It covers participant injuries during activities.", timestamp: 28 },
      { speaker: "user", text: "What does the pricing look like?", timestamp: 38 },
      { speaker: "agent", text: "For 30-50 participants, you're looking at about $4.99 per participant. So roughly $150-$250 per event. And as a partner, you'd earn commission on each policy.", timestamp: 42 },
      { speaker: "user", text: "That sounds reasonable. How quickly can we get set up?", timestamp: 55 },
      { speaker: "agent", text: "We can have you up and running within 24 hours. I'll send over the partnership agreement right now. Any other questions?", timestamp: 60 },
      { speaker: "user", text: "No, that covers everything. Thanks for the help!", timestamp: 70 },
      { speaker: "agent", text: "My pleasure! You'll receive an email shortly with next steps. Welcome to Daily Event Insurance!", timestamp: 75 },
    ],
    summary: "Successful call with gym owner interested in liability coverage for fitness events. Discussed pricing ($4.99/participant) and partnership benefits. Caller agreed to proceed with onboarding.",
    analysisNotes: [
      "High engagement throughout call",
      "Clear interest in partnership model",
      "No objections raised",
      "Ready to proceed with onboarding",
    ],
    nextSteps: "Partnership agreement sent. Follow up in 24 hours if not signed.",
    leadInfo: {
      id: "l1",
      status: "qualified",
      interestLevel: "hot",
      interestScore: 90,
      source: "website_quote",
      createdAt: "2024-12-15T10:00:00Z",
      totalCommunications: 3,
    },
  },
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/**
 * GET /api/admin/call-center/calls/[id]
 * Get detailed information about a specific call
 */
export async function GET(request: NextRequest, context: RouteContext) {
  return withAuth(async () => {
    try {
      await requireAdmin()
      const { id } = await context.params

      // Return mock data in dev mode
      if (isDevMode || !isDbConfigured()) {
        const mockCall = mockCallDetails[id]
        if (!mockCall) {
          // Return a generic mock call if specific ID not found
          return successResponse({
            id,
            leadId: null,
            callerName: "Test Caller",
            callerPhone: "(555) 000-0000",
            callerEmail: "test@example.com",
            businessType: "gym",
            businessName: "Test Business",
            duration: 180,
            durationFormatted: "3:00",
            status: "completed",
            disposition: "reached",
            direction: "inbound",
            sentiment: "neutral",
            sentimentScore: 0,
            outcome: "neutral",
            location: "Unknown",
            agentId: "ai_sarah",
            timestamp: new Date().toISOString(),
            recordingUrl: null,
            transcript: [],
            summary: "No summary available",
            analysisNotes: [],
            nextSteps: null,
            leadInfo: null,
          })
        }
        return successResponse(mockCall)
      }

      // Get call data (without leads JOIN due to schema mismatch)
      const [callData] = await db!
        .select({
          id: leadCommunications.id,
          leadId: leadCommunications.leadId,
          channel: leadCommunications.channel,
          direction: leadCommunications.direction,
          callDuration: leadCommunications.callDuration,
          callRecordingUrl: leadCommunications.callRecordingUrl,
          callTranscript: leadCommunications.callTranscript,
          callSummary: leadCommunications.callSummary,
          disposition: leadCommunications.disposition,
          sentimentScore: leadCommunications.sentimentScore,
          outcome: leadCommunications.outcome,
          agentId: leadCommunications.agentId,
          agentScriptUsed: leadCommunications.agentScriptUsed,
          agentConfidenceScore: leadCommunications.agentConfidenceScore,
          livekitRoomId: leadCommunications.livekitRoomId,
          livekitSessionId: leadCommunications.livekitSessionId,
          createdAt: leadCommunications.createdAt,
        })
        .from(leadCommunications)
        .where(eq(leadCommunications.id, id))
        .limit(1)

      if (!callData) {
        return notFoundError("Call")
      }

      const duration = callData.callDuration || 0
      const sentimentScore = callData.sentimentScore
        ? parseFloat(callData.sentimentScore)
        : 0
      const confidenceScore = callData.agentConfidenceScore
        ? parseFloat(callData.agentConfidenceScore)
        : null

      // Parse transcript if available
      let transcript: any[] = []
      if (callData.callTranscript) {
        try {
          transcript = JSON.parse(callData.callTranscript)
        } catch {
          // If not valid JSON, treat as plain text
          transcript = [{ speaker: "unknown", text: callData.callTranscript, timestamp: 0 }]
        }
      }

      const callDetail = {
        id: callData.id,
        leadId: callData.leadId,
        callerName: "Unknown Caller", // Lead info not available due to schema mismatch
        callerPhone: "Unknown",
        callerEmail: null,
        businessType: null,
        businessName: null,
        duration,
        durationFormatted: formatDuration(duration),
        status: callData.outcome === "escalate"
          ? "escalated"
          : callData.disposition === "reached"
          ? "completed"
          : callData.disposition === "voicemail"
          ? "voicemail"
          : "missed",
        disposition: callData.disposition,
        direction: callData.direction,
        sentiment: sentimentScore > 0.3
          ? "positive"
          : sentimentScore < -0.3
          ? "negative"
          : "neutral",
        sentimentScore,
        outcome: callData.outcome,
        location: "Unknown",
        agentId: callData.agentId,
        agentScriptUsed: callData.agentScriptUsed,
        agentConfidenceScore: confidenceScore,
        timestamp: callData.createdAt?.toISOString() || new Date().toISOString(),
        recordingUrl: callData.callRecordingUrl,
        transcript,
        summary: callData.callSummary || "No summary available",
        analysisNotes: [],
        nextSteps: null,
        livekitRoomId: callData.livekitRoomId,
        livekitSessionId: callData.livekitSessionId,
        leadInfo: null, // Lead info not available due to schema mismatch
      }

      return successResponse(callDetail)
    } catch (error: any) {
      console.error("[Call Center Call Detail] GET Error:", error)
      return serverError(error.message || "Failed to fetch call detail")
    }
  })
}
