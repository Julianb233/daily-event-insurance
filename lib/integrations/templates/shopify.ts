/**
 * Shopify Integration Template
 *
 * Shopify is the leading e-commerce platform. This integration allows
 * stores to offer event insurance as an add-on during checkout.
 */

export const shopifyTemplate = {
  name: "Shopify",
  slug: "shopify",
  category: "ecommerce",
  description: "E-commerce platform for online stores",
  supportedFeatures: [
    "Checkout upsell widget",
    "Post-purchase insurance offer",
    "Cart add-on integration",
    "Order webhook notifications",
    "Shopify App Block support"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Create a Custom App in Shopify",
      instructions: `1. Log into your Shopify admin panel
2. Go to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app**
4. Name it "Daily Event Insurance"
5. Click **Configure Admin API scopes** and select:
   - read_orders
   - read_products
   - read_customers
6. Click **Install app** and copy the Admin API access token`,
      screenshot: "/images/integrations/shopify-app-setup.png"
    },
    {
      step: 2,
      title: "Add the Insurance Widget to Your Theme",
      instructions: `1. In Shopify admin, go to **Online Store** → **Themes**
2. Click **Customize** on your active theme
3. Navigate to your product page or cart page
4. Add a **Custom Liquid** section
5. Paste the widget code provided below
6. Save your changes`,
      requiresInput: false
    },
    {
      step: 3,
      title: "Configure Webhook for Order Notifications",
      instructions: `1. Go to **Settings** → **Notifications** → **Webhooks**
2. Click **Create webhook**
3. Select event: **Order creation**
4. Enter your webhook URL (provided below)
5. Select format: JSON
6. Save the webhook`,
      requiresInput: true,
      inputLabel: "Your webhook URL will be generated after setup"
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/shopify/${partnerId}`,

  codeSnippets: {
    widgetEmbed: `<!-- Daily Event Insurance Widget for Shopify -->
<!-- Add this to your product page or cart page via Theme Customizer > Custom Liquid -->

<div id="dei-insurance-widget"
     data-partner-id="{{ shop.metafields.dei.partner_id }}"
     data-product-price="{{ product.price | money_without_currency }}"
     data-product-name="{{ product.title | escape }}"
     style="margin: 20px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">

  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    <span style="font-weight: 600; color: #111827;">Protect Your Purchase</span>
  </div>

  <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
    Get coverage for your event for just <strong style="color: #14B8A6;">$15/day</strong>
  </p>

  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
    <input type="checkbox" id="dei-add-insurance" name="properties[Insurance]" value="Daily Event Insurance - $15">
    <span style="font-size: 14px;">Add Event Insurance (+$15.00)</span>
  </label>
</div>

<script>
(function() {
  const widget = document.getElementById('dei-insurance-widget');
  const checkbox = document.getElementById('dei-add-insurance');
  const partnerId = widget.dataset.partnerId;

  // Track insurance selection
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      // Add insurance as line item property
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attributes: { 'Insurance': 'Daily Event Insurance - $15' }
        })
      });

      // Track conversion
      fetch('https://dailyeventinsurance.com/api/track/shopify-select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, selected: true })
      });
    }
  });
})();
</script>`,

    webhookHandler: `// Next.js API Route: /api/webhooks/shopify/[partnerId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { leads, policies } from "@/lib/db/schema"

export async function POST(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const body = await request.text()
  const hmac = request.headers.get("x-shopify-hmac-sha256")

  // Verify Shopify webhook signature
  const partner = await getPartner(params.partnerId)
  const hash = crypto
    .createHmac("sha256", partner.shopifyWebhookSecret)
    .update(body, "utf8")
    .digest("base64")

  if (hash !== hmac) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const order = JSON.parse(body)

  // Check if insurance was added to order
  const hasInsurance = order.note_attributes?.some(
    (attr: any) => attr.name === "Insurance"
  ) || order.line_items?.some(
    (item: any) => item.title.includes("Event Insurance")
  )

  // Create lead from order
  await db.insert(leads).values({
    partnerId: params.partnerId,
    name: \`\${order.customer.first_name} \${order.customer.last_name}\`,
    email: order.customer.email,
    phone: order.customer.phone,
    source: "shopify_order",
    status: hasInsurance ? "converted" : "new",
    metadata: {
      orderId: order.id,
      orderNumber: order.order_number,
      totalPrice: order.total_price,
      hasInsurance
    }
  })

  // If insurance was purchased, create policy
  if (hasInsurance) {
    await createPolicyFromShopifyOrder(params.partnerId, order)
  } else {
    // Send follow-up email offering insurance
    await sendPostPurchaseInsuranceOffer(order.customer.email, params.partnerId)
  }

  return NextResponse.json({ success: true })
}`,

    appBlock: `// Shopify App Block for Theme Editor 2.0
// File: blocks/insurance-upsell.liquid

{% schema %}
{
  "name": "Event Insurance",
  "target": "section",
  "settings": [
    {
      "type": "text",
      "id": "partner_id",
      "label": "Partner ID",
      "default": ""
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Protect Your Purchase"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "Get coverage for your event for just $15/day"
    },
    {
      "type": "color",
      "id": "accent_color",
      "label": "Accent Color",
      "default": "#14B8A6"
    }
  ]
}
{% endschema %}

<div class="dei-insurance-block" style="--accent: {{ block.settings.accent_color }}">
  <h3>{{ block.settings.heading }}</h3>
  <p>{{ block.settings.description }}</p>
  <button onclick="addInsurance('{{ block.settings.partner_id }}')">
    Add Insurance - $15
  </button>
</div>`
  },

  apiReference: {
    baseUrl: "https://{shop}.myshopify.com/admin/api/2024-01",
    authentication: "X-Shopify-Access-Token header",
    documentation: "https://shopify.dev/docs/api/admin-rest",
    requiredScopes: ["read_orders", "read_products", "read_customers"]
  },

  troubleshooting: [
    {
      issue: "Widget not appearing on product page",
      solution: "Ensure you've added the Custom Liquid section in the correct location in your theme. Some themes require you to edit the product.liquid template directly."
    },
    {
      issue: "Webhook not receiving order data",
      solution: "Check that your webhook URL is publicly accessible and returns a 200 status. Shopify will disable webhooks that fail repeatedly."
    },
    {
      issue: "Insurance not being added to cart",
      solution: "The widget uses cart attributes. Make sure your theme's cart template displays custom attributes, or use a line item approach instead."
    }
  ]
}

export type ShopifyTemplate = typeof shopifyTemplate
