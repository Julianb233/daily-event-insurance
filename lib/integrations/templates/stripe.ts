/**
 * Stripe Integration Template
 *
 * Stripe is the leading payment infrastructure for the internet.
 * This integration adds insurance offers during checkout flow.
 */

export const stripeTemplate = {
  name: "Stripe",
  slug: "stripe",
  category: "payments",
  description: "Payment processing infrastructure",
  supportedFeatures: [
    "Checkout Session upsell",
    "Payment Intent metadata",
    "Webhook notifications",
    "Stripe Elements integration",
    "Billing portal insurance add-on"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Get Your Stripe API Keys",
      instructions: `1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy your **Publishable key** (starts with pk_)
4. Copy your **Secret key** (starts with sk_)
5. For production, make sure you're in Live mode`,
      screenshot: "/images/integrations/stripe-api-keys.png"
    },
    {
      step: 2,
      title: "Configure Webhooks",
      instructions: `1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter the webhook URL provided below
4. Select events to listen for:
   - checkout.session.completed
   - payment_intent.succeeded
   - customer.created
5. Copy the **Webhook signing secret** (starts with whsec_)`,
      requiresInput: true,
      inputLabel: "Your webhook URL will be generated after setup"
    },
    {
      step: 3,
      title: "Add Insurance Product to Stripe",
      instructions: `1. Go to **Products** → **Add product**
2. Create a product:
   - Name: Daily Event Insurance
   - Price: $15.00 (one-time)
   - Metadata key: type = "insurance"
3. Copy the **Price ID** (starts with price_)
4. Use this in your checkout integration`
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/stripe/${partnerId}`,

  codeSnippets: {
    checkoutWithInsurance: `// Create Stripe Checkout Session with Insurance Upsell
// Backend: /api/checkout/create-session/route.ts

import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { items, partnerId, customerEmail } = await request.json()

  // Get partner's insurance price ID from database
  const partner = await getPartner(partnerId)
  const insurancePriceId = partner.stripeInsurancePriceId || process.env.STRIPE_INSURANCE_PRICE_ID

  // Create line items including optional insurance
  const lineItems = items.map((item: any) => ({
    price: item.priceId,
    quantity: item.quantity
  }))

  // Add insurance as an optional item (customer can remove)
  lineItems.push({
    price: insurancePriceId,
    quantity: 1,
    adjustable_quantity: {
      enabled: true,
      minimum: 0,
      maximum: 1
    }
  })

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: lineItems,
    success_url: \`\${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_URL}/checkout/cancelled\`,
    metadata: {
      partnerId,
      source: "checkout_with_insurance"
    },
    // Show insurance as upsell
    custom_text: {
      submit: {
        message: "Your order includes event protection coverage."
      }
    }
  })

  return NextResponse.json({ sessionId: session.id, url: session.url })
}`,

    webhookHandler: `// Next.js API Route: /api/webhooks/stripe/[partnerId]/route.ts
import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leads, policies } from "@/lib/db/schema"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  // Get partner's webhook secret
  const partner = await getPartner(params.partnerId)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      partner.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(params.partnerId, session)
      break
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handlePaymentSucceeded(params.partnerId, paymentIntent)
      break
    }
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(partnerId: string, session: Stripe.Checkout.Session) {
  // Expand line items to check for insurance
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

  const hasInsurance = lineItems.data.some(item =>
    item.description?.toLowerCase().includes("insurance") ||
    item.price?.metadata?.type === "insurance"
  )

  // Create lead
  await db.insert(leads).values({
    partnerId,
    name: session.customer_details?.name || "",
    email: session.customer_details?.email || "",
    phone: session.customer_details?.phone || null,
    source: "stripe_checkout",
    status: hasInsurance ? "converted" : "new",
    metadata: {
      sessionId: session.id,
      customerId: session.customer,
      hasInsurance,
      amountTotal: session.amount_total
    }
  })

  if (hasInsurance) {
    // Create policy record
    await createPolicyFromStripeSession(partnerId, session)
  } else {
    // Send follow-up insurance offer
    await sendPostCheckoutInsuranceOffer(
      session.customer_details?.email!,
      partnerId
    )
  }
}`,

    elementsIntegration: `// Stripe Elements with Insurance Checkbox
// Frontend React component

import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useState } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ partnerId }: { partnerId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [addInsurance, setAddInsurance] = useState(true)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    // Create payment intent with insurance if selected
    const response = await fetch("/api/checkout/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId,
        includeInsurance: addInsurance,
        amount: calculateTotal(addInsurance)
      })
    })

    const { clientSecret } = await response.json()

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!
      }
    })

    if (result.error) {
      console.error(result.error)
    } else {
      // Payment successful
      window.location.href = "/checkout/success"
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{
        style: {
          base: { fontSize: "16px", color: "#374151" }
        }
      }} />

      {/* Insurance Upsell */}
      <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={addInsurance}
            onChange={(e) => setAddInsurance(e.target.checked)}
            className="w-5 h-5 text-teal-600"
          />
          <div>
            <span className="font-medium">Add Event Insurance</span>
            <span className="text-gray-600 ml-2">+$15.00</span>
          </div>
        </label>
        <p className="text-sm text-gray-600 mt-2 ml-8">
          Protect your event with comprehensive coverage
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 w-full bg-teal-600 text-white py-3 rounded-lg"
      >
        {processing ? "Processing..." : \`Pay \${formatCurrency(calculateTotal(addInsurance))}\`}
      </button>
    </form>
  )
}

export default function StripeCheckout({ partnerId }: { partnerId: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm partnerId={partnerId} />
    </Elements>
  )
}`,

    paymentLink: `// Create Stripe Payment Link with Insurance
// Useful for email campaigns and QR codes

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createInsurancePaymentLink(partnerId: string) {
  // Create or retrieve the insurance price
  const insurancePrice = await getOrCreateInsurancePrice()

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: insurancePrice.id,
        quantity: 1
      }
    ],
    metadata: {
      partnerId,
      type: "standalone_insurance"
    },
    after_completion: {
      type: "redirect",
      redirect: {
        url: \`https://dailyeventinsurance.com/purchase/success?partner=\${partnerId}\`
      }
    }
  })

  return paymentLink.url
}

async function getOrCreateInsurancePrice(): Promise<Stripe.Price> {
  // Check if product exists
  const products = await stripe.products.list({
    limit: 1,
    query: 'metadata["type"]:"daily_event_insurance"'
  })

  if (products.data.length > 0) {
    const prices = await stripe.prices.list({
      product: products.data[0].id,
      active: true
    })
    return prices.data[0]
  }

  // Create product and price
  const product = await stripe.products.create({
    name: "Daily Event Insurance",
    description: "Comprehensive event coverage protection",
    metadata: { type: "daily_event_insurance" }
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 1500, // $15.00
    currency: "usd"
  })

  return price
}`
  },

  apiReference: {
    baseUrl: "https://api.stripe.com/v1",
    authentication: "Bearer token (Secret Key)",
    documentation: "https://stripe.com/docs/api",
    requiredScopes: ["Full API access with secret key"]
  },

  troubleshooting: [
    {
      issue: "Webhook signature verification failing",
      solution: "Make sure you're using the webhook signing secret (whsec_*), not the API secret key. Also ensure you're passing the raw request body, not parsed JSON."
    },
    {
      issue: "Test payments not appearing",
      solution: "Check that you're using test mode API keys (sk_test_*) and test card numbers. Production payments use live keys (sk_live_*)."
    },
    {
      issue: "Insurance not showing in Checkout",
      solution: "Verify the Price ID is correct and the product is active. Check that adjustable_quantity is configured properly for the insurance line item."
    }
  ]
}

export type StripeTemplate = typeof stripeTemplate
