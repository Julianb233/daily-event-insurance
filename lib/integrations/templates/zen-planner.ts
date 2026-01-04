/**
 * Zen Planner Integration Template
 *
 * Zen Planner is a gym management software for fitness businesses,
 * particularly popular with CrossFit gyms and martial arts studios.
 */

export const zenPlannerTemplate = {
  name: "Zen Planner",
  slug: "zen-planner",
  category: "pos",
  description: "Gym management software for fitness businesses",
  supportedFeatures: [
    "Webhook notifications for class reservations",
    "API access for member data",
    "Automated insurance prompts",
    "Integration with class check-ins"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Access Zen Planner API Settings",
      instructions: `1. Log into your Zen Planner account as an admin
2. Go to **Settings** → **Integrations** → **API Access**
3. Click **Generate API Key**
4. Copy the API Key and Secret - you'll need these
5. Note your Gym ID from the URL (e.g., gym12345)`,
      screenshot: "/images/integrations/zen-planner-api.png"
    },
    {
      step: 2,
      title: "Set Up Webhook Notifications",
      instructions: `1. In Zen Planner, navigate to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Enter your webhook URL (provided below)
4. Select events to trigger:
   - Reservation Created
   - Member Check-In
   - Drop-In Purchase
5. Save and test the webhook`,
      requiresInput: true,
      inputLabel: "Your webhook URL will be generated after setup"
    },
    {
      step: 3,
      title: "Configure Insurance Prompt",
      instructions: `1. Optionally add a custom field in member profiles for "Insurance Status"
2. Set up an automation to email new reservations
3. Test by creating a reservation and verifying the insurance offer is sent`
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/zen-planner/${partnerId}`,

  codeSnippets: {
    webhookHandler: `// Next.js API Route: /api/webhooks/zen-planner/[partnerId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

export async function POST(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const body = await request.json()
  const { event, data } = body

  // Handle different event types
  switch (event) {
    case "reservation.created":
      await handleReservation(params.partnerId, data)
      break
    case "checkin.completed":
      await handleCheckin(params.partnerId, data)
      break
    case "dropin.purchased":
      await handleDropIn(params.partnerId, data)
      break
  }

  return NextResponse.json({ success: true })
}

async function handleReservation(partnerId: string, data: any) {
  const { member, class: classInfo, reservation } = data

  // Create lead
  await db.insert(leads).values({
    partnerId,
    name: member.name,
    email: member.email,
    phone: member.phone,
    eventDate: new Date(reservation.date),
    eventType: classInfo.name,
    source: "zen_planner_webhook",
    status: "new",
    metadata: {
      classId: classInfo.id,
      reservationId: reservation.id
    }
  })

  // Send insurance offer
  await sendInsuranceOffer({
    email: member.email,
    name: member.name.split(" ")[0],
    className: classInfo.name,
    classDate: reservation.date,
    partnerId
  })
}`,

    memberLookup: `// Look up member details from Zen Planner API
async function getMemberFromZenPlanner(memberId: string, apiKey: string, gymId: string) {
  const response = await fetch(
    \`https://api.zenplanner.com/v1/gyms/\${gymId}/members/\${memberId}\`,
    {
      headers: {
        "Authorization": \`Bearer \${apiKey}\`,
        "Content-Type": "application/json"
      }
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch member from Zen Planner")
  }

  return response.json()
}`,

    classScheduleSync: `// Sync class schedule for insurance availability
async function syncClassSchedule(apiKey: string, gymId: string, partnerId: string) {
  const response = await fetch(
    \`https://api.zenplanner.com/v1/gyms/\${gymId}/classes?startDate=\${today}&endDate=\${nextWeek}\`,
    {
      headers: {
        "Authorization": \`Bearer \${apiKey}\`
      }
    }
  )

  const classes = await response.json()

  // Store class schedule for insurance pricing
  for (const cls of classes.data) {
    await db.insert(events).values({
      partnerId,
      name: cls.name,
      date: new Date(cls.startTime),
      capacity: cls.maxCapacity,
      enrolled: cls.currentEnrollment,
      source: "zen_planner"
    })
  }
}`
  },

  apiReference: {
    baseUrl: "https://api.zenplanner.com/v1",
    authentication: "Bearer Token",
    documentation: "https://zenplanner.com/api-documentation",
    requiredScopes: ["members:read", "reservations:read", "classes:read"]
  },

  troubleshooting: [
    {
      issue: "API rate limiting errors",
      solution: "Zen Planner has a limit of 100 requests per minute. Implement request queuing for bulk operations."
    },
    {
      issue: "Webhook signature verification failing",
      solution: "Ensure you're using the webhook secret from your Zen Planner settings, not the API key."
    },
    {
      issue: "Missing member contact info",
      solution: "Some members may have incomplete profiles. Consider adding a fallback to prompt for email at check-in."
    }
  ]
}

export type ZenPlannerTemplate = typeof zenPlannerTemplate
