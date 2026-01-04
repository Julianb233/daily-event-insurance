/**
 * Mindbody Integration Template
 *
 * Mindbody is a popular POS/booking system for fitness studios, gyms, and wellness centers.
 * This template provides code snippets and instructions for integrating Daily Event Insurance.
 */

export const mindbodyTemplate = {
  name: "Mindbody",
  slug: "mindbody",
  category: "pos",
  description: "Fitness and wellness business management software",
  supportedFeatures: [
    "Webhook notifications for new bookings",
    "API-based customer lookup",
    "Automated insurance upsell at checkout",
    "Post-booking email triggers"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Access Mindbody API Settings",
      instructions: `1. Log into your Mindbody account
2. Go to **Settings** → **Integrations** → **API Credentials**
3. Click **Create New API Key**
4. Name it "Daily Event Insurance"
5. Select the following permissions:
   - Clients: Read
   - Appointments: Read
   - Sales: Read (optional, for revenue tracking)`,
      screenshot: "/images/integrations/mindbody-api-settings.png"
    },
    {
      step: 2,
      title: "Configure Webhook Notifications",
      instructions: `1. In Mindbody, go to **Settings** → **Notifications** → **Webhooks**
2. Click **Add Webhook**
3. Enter the webhook URL provided below
4. Select these events:
   - Class Booking Created
   - Appointment Created
   - Client Created (optional)
5. Save the webhook configuration`,
      requiresInput: true,
      inputLabel: "Your webhook URL will be generated after setup"
    },
    {
      step: 3,
      title: "Test the Integration",
      instructions: `1. Create a test booking in Mindbody
2. Check your Daily Event Insurance dashboard for the new lead
3. Verify the customer received the insurance offer email`
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/mindbody/${partnerId}`,

  codeSnippets: {
    webhookHandler: `// Next.js API Route: /api/webhooks/mindbody/[partnerId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

export async function POST(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const signature = request.headers.get("x-mindbody-signature")
  const body = await request.json()

  // Verify webhook signature
  if (!verifyMindbodySignature(signature, body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const { EventType, Data } = body

  if (EventType === "ClassBookingCreated" || EventType === "AppointmentCreated") {
    const customer = Data.Client
    const booking = Data.Booking || Data.Appointment

    // Create lead for insurance offer
    await db.insert(leads).values({
      partnerId: params.partnerId,
      name: \`\${customer.FirstName} \${customer.LastName}\`,
      email: customer.Email,
      phone: customer.MobilePhone,
      eventDate: new Date(booking.StartDateTime),
      eventType: booking.Name || "Class/Session",
      source: "mindbody_webhook",
      status: "new"
    })

    // Trigger insurance offer email
    await sendInsuranceOfferEmail({
      email: customer.Email,
      name: customer.FirstName,
      eventDate: booking.StartDateTime,
      partnerId: params.partnerId
    })
  }

  return NextResponse.json({ success: true })
}`,

    emailTrigger: `// Email trigger for post-booking insurance offer
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInsuranceOfferEmail({
  email,
  name,
  eventDate,
  partnerId
}: {
  email: string
  name: string
  eventDate: string
  partnerId: string
}) {
  const partner = await getPartner(partnerId)
  const insuranceLink = \`https://\${partner.microsite.subdomain}.dailyeventinsurance.com?ref=\${email}\`

  await resend.emails.send({
    from: "Daily Event Insurance <noreply@dailyeventinsurance.com>",
    to: email,
    subject: \`Protect your upcoming session at \${partner.businessName}\`,
    html: \`
      <h2>Hi \${name}!</h2>
      <p>Your session on \${formatDate(eventDate)} is booked!</p>
      <p>\${partner.businessName} has partnered with Daily Event Insurance to offer
         you coverage protection.</p>
      <p>Get covered for just <strong>$15/day</strong>:</p>
      <a href="\${insuranceLink}" style="...">Get Insurance Coverage</a>
    \`
  })
}`
  },

  apiReference: {
    baseUrl: "https://api.mindbodyonline.com/public/v6",
    authentication: "API Key + Site ID in headers",
    documentation: "https://developers.mindbodyonline.com/",
    requiredScopes: ["Clients.Read", "Appointments.Read"]
  },

  troubleshooting: [
    {
      issue: "Webhook not receiving events",
      solution: "Verify the webhook URL is accessible publicly and your server is running HTTPS. Check Mindbody webhook logs for delivery status."
    },
    {
      issue: "API authentication failing",
      solution: "Ensure your Site ID and API Key are correct. API keys expire after 30 days of inactivity - regenerate if needed."
    },
    {
      issue: "Missing customer email",
      solution: "Mindbody may not include email for all bookings. Enable 'Require email for bookings' in your Mindbody settings."
    }
  ]
}

export type MindbodyTemplate = typeof mindbodyTemplate
