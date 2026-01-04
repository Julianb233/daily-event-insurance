/**
 * Square Integration Template
 *
 * Square is a popular POS and payment processing platform.
 * This integration adds insurance offers at point of sale.
 */

export const squareTemplate = {
  name: "Square",
  slug: "square",
  category: "pos",
  description: "Payment processing and point of sale system",
  supportedFeatures: [
    "Payment webhook notifications",
    "Customer directory sync",
    "Square Online checkout integration",
    "Square Terminal displays",
    "Loyalty program integration"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Create a Square Application",
      instructions: `1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Click **Create Application**
3. Name it "Daily Event Insurance"
4. Select **Production** environment when ready
5. Copy your **Application ID** and **Access Token**`,
      screenshot: "/images/integrations/square-app-setup.png"
    },
    {
      step: 2,
      title: "Configure Webhooks",
      instructions: `1. In your Square app dashboard, go to **Webhooks**
2. Click **Add Webhook**
3. Enter the webhook URL provided below
4. Select events to subscribe:
   - payment.completed
   - customer.created
   - booking.created (if using Square Appointments)
5. Save and note the **Webhook Signature Key**`,
      requiresInput: true,
      inputLabel: "Your webhook URL will be generated after setup"
    },
    {
      step: 3,
      title: "Enable Customer Sync (Optional)",
      instructions: `1. Go to **OAuth** in your Square app
2. Add redirect URL: https://dailyeventinsurance.com/api/auth/square/callback
3. Request permissions:
   - CUSTOMERS_READ
   - PAYMENTS_READ
   - ORDERS_READ
4. This allows automatic customer sync for targeted insurance offers`
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/square/${partnerId}`,

  codeSnippets: {
    webhookHandler: `// Next.js API Route: /api/webhooks/square/[partnerId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

export async function POST(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const body = await request.text()
  const signature = request.headers.get("x-square-hmacsha256-signature")

  // Verify Square webhook signature
  const partner = await getPartner(params.partnerId)
  const expectedSignature = crypto
    .createHmac("sha256", partner.squareWebhookSignatureKey)
    .update(
      request.headers.get("x-square-notification-url") + body
    )
    .digest("base64")

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  switch (event.type) {
    case "payment.completed":
      await handlePaymentCompleted(params.partnerId, event.data.object.payment)
      break
    case "customer.created":
      await handleCustomerCreated(params.partnerId, event.data.object.customer)
      break
    case "booking.created":
      await handleBookingCreated(params.partnerId, event.data.object.booking)
      break
  }

  return NextResponse.json({ success: true })
}

async function handlePaymentCompleted(partnerId: string, payment: any) {
  // Get customer details from Square
  const customer = await getSquareCustomer(payment.customer_id, partnerId)

  if (!customer) {
    console.log("Payment without customer - skipping lead creation")
    return
  }

  // Create lead
  await db.insert(leads).values({
    partnerId,
    name: \`\${customer.given_name || ""} \${customer.family_name || ""}\`.trim(),
    email: customer.email_address,
    phone: customer.phone_number,
    source: "square_payment",
    status: "new",
    metadata: {
      paymentId: payment.id,
      amount: payment.amount_money.amount / 100,
      currency: payment.amount_money.currency
    }
  })

  // Send insurance offer email
  if (customer.email_address) {
    await sendInsuranceOfferEmail({
      email: customer.email_address,
      name: customer.given_name || "there",
      partnerId,
      context: "post_payment"
    })
  }
}`,

    squareOnlineWidget: `<!-- Square Online Insurance Widget -->
<!-- Add to your Square Online site via Code Injection -->

<script>
(function() {
  // Wait for Square Online to load
  document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.querySelector('.checkout-form, [data-section="checkout"]');

    if (checkoutForm) {
      const insuranceWidget = document.createElement('div');
      insuranceWidget.innerHTML = \`
        <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
                    border: 2px solid #14b8a6; border-radius: 12px;
                    padding: 20px; margin: 20px 0;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f766e" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <strong style="color: #0f766e;">Protect Your Event</strong>
          </div>
          <p style="color: #374151; margin-bottom: 12px; font-size: 14px;">
            Add event insurance coverage for just $15
          </p>
          <a href="https://PARTNER_SUBDOMAIN.dailyeventinsurance.com"
             target="_blank"
             style="display: inline-block; background: #14b8a6; color: white;
                    padding: 10px 20px; border-radius: 8px; text-decoration: none;
                    font-weight: 500;">
            Get Insurance Coverage →
          </a>
        </div>
      \`;

      checkoutForm.parentNode.insertBefore(insuranceWidget, checkoutForm);
    }
  });
})();
</script>`,

    terminalDisplay: `// Square Terminal Insurance Prompt (for businesses with physical terminals)
// This creates a custom display message after payment

import { Client, Environment } from "square"

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
})

export async function showInsurancePromptOnTerminal(
  deviceId: string,
  customerEmail: string,
  partnerSubdomain: string
) {
  try {
    // Create a terminal action to display insurance offer
    await squareClient.terminalApi.createTerminalAction({
      idempotencyKey: crypto.randomUUID(),
      action: {
        deviceId,
        type: "QR_CODE",
        qrCodeOptions: {
          title: "Protect Your Event",
          body: "Scan to get event insurance coverage",
          barcodeContents: \`https://\${partnerSubdomain}.dailyeventinsurance.com?email=\${encodeURIComponent(customerEmail)}\`
        }
      }
    })

    console.log("Insurance QR displayed on terminal")
  } catch (error) {
    console.error("Failed to display on terminal:", error)
  }
}`,

    customerSync: `// Sync Square customers for targeted insurance campaigns
import { Client, Environment } from "square"

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
})

export async function syncSquareCustomers(partnerId: string) {
  let cursor: string | undefined

  do {
    const response = await squareClient.customersApi.listCustomers({
      cursor,
      limit: 100
    })

    for (const customer of response.result.customers || []) {
      // Check if customer already exists as lead
      const existingLead = await db.query.leads.findFirst({
        where: and(
          eq(leads.partnerId, partnerId),
          eq(leads.email, customer.emailAddress)
        )
      })

      if (!existingLead && customer.emailAddress) {
        await db.insert(leads).values({
          partnerId,
          name: \`\${customer.givenName || ""} \${customer.familyName || ""}\`.trim(),
          email: customer.emailAddress,
          phone: customer.phoneNumber,
          source: "square_sync",
          status: "new"
        })
      }
    }

    cursor = response.result.cursor
  } while (cursor)

  console.log("Square customer sync complete")
}`
  },

  apiReference: {
    baseUrl: "https://connect.squareup.com/v2",
    authentication: "Bearer token in Authorization header",
    documentation: "https://developer.squareup.com/docs",
    requiredScopes: ["CUSTOMERS_READ", "PAYMENTS_READ", "ORDERS_READ"]
  },

  troubleshooting: [
    {
      issue: "Webhook signature validation failing",
      solution: "Make sure you're using the Webhook Signature Key, not the Access Token. The signature includes both the notification URL and request body."
    },
    {
      issue: "Customer data missing from payment events",
      solution: "Payments made without customer accounts won't have customer_id. Consider using Square's Customers API to create customers at checkout."
    },
    {
      issue: "Terminal display not showing",
      solution: "Ensure your Square Terminal is online and registered to your account. Terminal actions require the device to be actively connected."
    }
  ]
}

export type SquareTemplate = typeof squareTemplate
