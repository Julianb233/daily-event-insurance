/**
 * WooCommerce Integration Template
 *
 * WooCommerce is the most popular WordPress e-commerce plugin.
 * This integration adds event insurance as a checkout upsell.
 */

export const woocommerceTemplate = {
  name: "WooCommerce",
  slug: "woocommerce",
  category: "ecommerce",
  description: "WordPress e-commerce plugin",
  supportedFeatures: [
    "Checkout page insurance upsell",
    "Cart add-on widget",
    "Order webhook notifications",
    "WooCommerce Blocks support",
    "PHP plugin integration"
  ],

  setupSteps: [
    {
      step: 1,
      title: "Install the Daily Event Insurance Plugin",
      instructions: `**Option A: Manual Installation**
1. Download the plugin ZIP from your partner dashboard
2. In WordPress admin, go to **Plugins** → **Add New** → **Upload Plugin**
3. Upload the ZIP file and click **Install Now**
4. Activate the plugin

**Option B: Code Snippet (No Plugin)**
1. Go to **Appearance** → **Theme File Editor**
2. Open your theme's functions.php file
3. Add the code snippet provided below
4. Save changes`,
      screenshot: "/images/integrations/woocommerce-plugin.png"
    },
    {
      step: 2,
      title: "Configure Plugin Settings",
      instructions: `1. Go to **WooCommerce** → **Settings** → **Daily Event Insurance**
2. Enter your Partner ID (provided below)
3. Configure display options:
   - Show on cart page: Yes
   - Show on checkout page: Yes
   - Insurance price: $15.00
4. Save settings`,
      requiresInput: true,
      inputLabel: "Enter your Partner ID in the plugin settings"
    },
    {
      step: 3,
      title: "Set Up Webhook (Optional)",
      instructions: `1. Go to **WooCommerce** → **Settings** → **Advanced** → **Webhooks**
2. Click **Add webhook**
3. Configure:
   - Name: Daily Event Insurance
   - Status: Active
   - Topic: Order created
   - Delivery URL: (provided below)
   - Secret: (copy from your dashboard)
4. Save webhook`
    }
  ],

  webhookEndpoint: (partnerId: string) =>
    `https://dailyeventinsurance.com/api/webhooks/woocommerce/${partnerId}`,

  codeSnippets: {
    phpPlugin: `<?php
/**
 * Plugin Name: Daily Event Insurance for WooCommerce
 * Description: Add event insurance upsell to WooCommerce checkout
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

class DailyEventInsurance_WooCommerce {
    private $partner_id;
    private $insurance_price = 15.00;

    public function __construct() {
        $this->partner_id = get_option('dei_partner_id', '');

        add_action('woocommerce_before_checkout_form', [$this, 'display_insurance_option']);
        add_action('woocommerce_checkout_update_order_meta', [$this, 'save_insurance_selection']);
        add_action('woocommerce_cart_calculate_fees', [$this, 'add_insurance_fee']);
        add_action('woocommerce_thankyou', [$this, 'track_conversion']);
    }

    public function display_insurance_option() {
        ?>
        <div id="dei-insurance-upsell" style="background: #f0fdfa; border: 2px solid #14b8a6; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #0f766e; margin-top: 0;">
                <span style="margin-right: 8px;">🛡️</span>
                Protect Your Event
            </h3>
            <p style="color: #374151;">Get coverage for your event with Daily Event Insurance.</p>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="checkbox" name="dei_add_insurance" value="1" id="dei_insurance_checkbox">
                <span>Add Event Insurance (+$<?php echo number_format($this->insurance_price, 2); ?>)</span>
            </label>
        </div>
        <script>
        jQuery('#dei_insurance_checkbox').on('change', function() {
            jQuery.ajax({
                url: wc_checkout_params.ajax_url,
                type: 'POST',
                data: {
                    action: 'dei_update_insurance',
                    insurance: this.checked ? 1 : 0
                },
                success: function() {
                    jQuery('body').trigger('update_checkout');
                }
            });
        });
        </script>
        <?php
    }

    public function add_insurance_fee($cart) {
        if (WC()->session->get('dei_insurance_selected')) {
            $cart->add_fee('Event Insurance', $this->insurance_price, false);
        }
    }

    public function save_insurance_selection($order_id) {
        if (WC()->session->get('dei_insurance_selected')) {
            update_post_meta($order_id, '_dei_insurance', 'yes');

            // Notify Daily Event Insurance
            $this->send_to_dei($order_id);
        }
    }

    private function send_to_dei($order_id) {
        $order = wc_get_order($order_id);

        wp_remote_post("https://dailyeventinsurance.com/api/webhooks/woocommerce/{$this->partner_id}", [
            'body' => json_encode([
                'order_id' => $order_id,
                'customer_email' => $order->get_billing_email(),
                'customer_name' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                'customer_phone' => $order->get_billing_phone(),
                'total' => $order->get_total(),
                'has_insurance' => true
            ]),
            'headers' => ['Content-Type' => 'application/json']
        ]);
    }
}

new DailyEventInsurance_WooCommerce();`,

    webhookHandler: `// Next.js API Route: /api/webhooks/woocommerce/[partnerId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

export async function POST(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const body = await request.json()
  const signature = request.headers.get("x-wc-webhook-signature")

  // Verify WooCommerce webhook signature
  const partner = await getPartner(params.partnerId)
  const expectedSignature = crypto
    .createHmac("sha256", partner.woocommerceWebhookSecret)
    .update(JSON.stringify(body))
    .digest("base64")

  if (signature !== expectedSignature) {
    console.warn("Invalid WooCommerce webhook signature")
    // WooCommerce sends test pings without signatures
  }

  const { customer_email, customer_name, customer_phone, order_id, has_insurance } = body

  // Create lead
  await db.insert(leads).values({
    partnerId: params.partnerId,
    name: customer_name,
    email: customer_email,
    phone: customer_phone,
    source: "woocommerce_order",
    status: has_insurance ? "converted" : "new",
    metadata: {
      orderId: order_id,
      hasInsurance: has_insurance
    }
  })

  if (!has_insurance) {
    // Send follow-up insurance offer
    await sendInsuranceFollowUp(customer_email, params.partnerId)
  }

  return NextResponse.json({ success: true })
}`,

    shortcode: `// WordPress shortcode for manual placement
// Add to functions.php

add_shortcode('dei_insurance', function($atts) {
    $atts = shortcode_atts([
        'partner_id' => get_option('dei_partner_id'),
        'button_text' => 'Get Event Insurance',
        'price' => '15'
    ], $atts);

    return sprintf(
        '<div class="dei-insurance-widget">
            <a href="https://dailyeventinsurance.com/p/%s" target="_blank" class="dei-button">
                %s - $%s
            </a>
        </div>',
        esc_attr($atts['partner_id']),
        esc_html($atts['button_text']),
        esc_html($atts['price'])
    );
});

// Usage: [dei_insurance partner_id="abc123" button_text="Protect Your Event"]`
  },

  apiReference: {
    baseUrl: "https://your-store.com/wp-json/wc/v3",
    authentication: "Consumer Key + Consumer Secret",
    documentation: "https://woocommerce.github.io/woocommerce-rest-api-docs/",
    requiredScopes: ["read_orders", "write_orders"]
  },

  troubleshooting: [
    {
      issue: "Insurance option not showing on checkout",
      solution: "Check that the plugin is activated and your theme supports WooCommerce hooks. Try switching to a default theme temporarily to test."
    },
    {
      issue: "Fee not updating when checkbox is clicked",
      solution: "Make sure AJAX is working on your site. Check browser console for JavaScript errors. Some caching plugins may interfere."
    },
    {
      issue: "Webhook not triggering",
      solution: "WooCommerce webhooks require a publicly accessible HTTPS URL. Localhost won't work. Use a service like ngrok for local testing."
    }
  ]
}

export type WooCommerceTemplate = typeof woocommerceTemplate
