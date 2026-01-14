# Square Integration Guide

Connect Square to offer insurance coverage with bookings, appointments, and item purchases.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Location ID Setup](#location-id-setup)
- [Item Catalog Sync](#item-catalog-sync)
- [Payment Flow](#payment-flow)
- [Booking Integration](#booking-integration)
- [Webhook Configuration](#webhook-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Square integration enables:

- **Insurance at checkout** - Offer coverage during Square payment flow
- **Booking protection** - Auto-offer insurance for Square Appointments
- **Equipment coverage** - Tie insurance to catalog items
- **Combined payment** - Process insurance premium with main transaction

### Supported Square Products

| Product | Integration Type | Status |
|---------|------------------|--------|
| Square Point of Sale | Checkout API | Supported |
| Square Appointments | Bookings API | Supported |
| Square Online | eCommerce | Supported |
| Square Invoices | Invoices API | Coming Soon |
| Square for Retail | Inventory sync | Supported |

---

## Prerequisites

Before starting, ensure you have:

- [ ] Square Business account
- [ ] Square Developer account (for API access)
- [ ] Daily Event Insurance Partner account
- [ ] At least one active Square Location

### Required Square Permissions

Your Square application needs these OAuth scopes:

```
MERCHANT_PROFILE_READ
CUSTOMERS_READ
ITEMS_READ
ORDERS_READ
ORDERS_WRITE
BOOKINGS_READ
PAYMENTS_READ
```

---

## Location ID Setup

### Step 1: Create Square Developer Application

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Click **Create Application**
3. Name it "Daily Event Insurance"
4. Note your **Application ID** and **Access Token**

### Step 2: Find Your Location IDs

List your Square locations:

```bash
curl https://connect.squareup.com/v2/locations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "locations": [
    {
      "id": "LOCATION_ID_1",
      "name": "Main Studio",
      "address": {
        "address_line_1": "123 Main St",
        "locality": "San Francisco",
        "administrative_district_level_1": "CA",
        "postal_code": "94102"
      },
      "status": "ACTIVE"
    },
    {
      "id": "LOCATION_ID_2",
      "name": "Downtown Location",
      "status": "ACTIVE"
    }
  ]
}
```

### Step 3: Connect in Daily Event Dashboard

1. Log into your [Partner Dashboard](https://partner.dailyevent.com)
2. Go to **Integrations > POS Systems > Square**
3. Click **Connect with Square**
4. Authorize the OAuth connection
5. Select which locations to enable

### Step 4: Configure Location Settings

For each location, configure:

| Setting | Description | Default |
|---------|-------------|---------|
| Auto-offer insurance | Show insurance at checkout | Yes |
| Default coverage | Coverage type for this location | Liability |
| Premium display | Show premium before checkout | Yes |
| Combine payment | Add insurance to Square payment | Yes |

---

## Item Catalog Sync

### How Catalog Sync Works

Daily Event syncs with your Square Item Catalog to:

1. Identify items eligible for insurance
2. Map item categories to coverage types
3. Calculate equipment values for coverage
4. Track inventory for rental insurance

### Enable Catalog Sync

1. Go to **Integrations > Square > Catalog Settings**
2. Toggle **Enable Catalog Sync**
3. Set sync frequency (default: every 6 hours)

### Category Mapping

Map Square item categories to coverage types:

```javascript
{
  "categoryMapping": [
    {
      "squareCategory": "Equipment Rental",
      "coverageTypes": ["liability", "equipment"],
      "useItemPriceForCoverage": true
    },
    {
      "squareCategory": "Group Classes",
      "coverageTypes": ["liability"]
    },
    {
      "squareCategory": "Personal Training",
      "coverageTypes": ["liability"]
    },
    {
      "squareCategory": "Workshops",
      "coverageTypes": ["liability", "cancellation"]
    }
  ]
}
```

### Equipment Value Mapping

For equipment rental items:

```javascript
{
  "equipmentValueMapping": {
    "useItemPrice": true,  // Use Square item price
    "minimumValue": 50,    // Minimum coverage value
    "maximumValue": 10000, // Maximum coverage value
    "valueMultiplier": 1.0 // Multiply item price by this
  }
}
```

### Manual Item Mapping

Map specific items to coverage:

1. Go to **Catalog Settings > Item Mapping**
2. Search for Square items
3. Assign coverage type and value

| Square Item | Coverage | Value | Auto-Offer |
|-------------|----------|-------|------------|
| Kayak Rental | Equipment + Liability | $500 | Yes |
| Bike Rental | Equipment + Liability | $800 | Yes |
| Climbing Gear | Equipment | $200 | Yes |

---

## Payment Flow

### Combined Payment (Recommended)

Process insurance premium in the same Square transaction:

```
Customer checks out
       ↓
Insurance offer displayed
       ↓
Customer adds insurance
       ↓
Single Square payment (items + insurance)
       ↓
Order confirmed + Policy created
```

### Implementation

**Checkout with Insurance (Square Web Payments SDK):**

```javascript
import { payments } from '@square/web-sdk';

// Initialize Square
const squarePayments = await payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
const card = await squarePayments.card();
await card.attach('#card-container');

// Add insurance to order
async function addInsuranceToOrder(orderId, quoteId) {
  const response = await fetch('/api/orders/add-insurance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      squareOrderId: orderId,
      insuranceQuoteId: quoteId
    })
  });
  return response.json();
}

// Process combined payment
async function processPayment(orderId) {
  const tokenResult = await card.tokenize();

  if (tokenResult.status === 'OK') {
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceId: tokenResult.token,
        orderId: orderId,
        locationId: SQUARE_LOCATION_ID
      })
    });

    const result = await response.json();

    if (result.success) {
      // Payment successful - policy is automatically created
      console.log('Policy ID:', result.policyId);
    }
  }
}
```

**Backend Handler (Node.js):**

```javascript
const { Client, Environment } = require('square');

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

// Add insurance line item to Square order
async function addInsuranceToOrder(orderId, quoteId) {
  // Get quote details from Daily Event
  const quote = await dailyEvent.quotes.get(quoteId);

  // Update Square order with insurance
  const response = await squareClient.ordersApi.updateOrder(orderId, {
    order: {
      locationId: LOCATION_ID,
      lineItems: [
        {
          name: `Event Insurance - ${quote.coverageType}`,
          quantity: '1',
          basePriceMoney: {
            amount: Math.round(parseFloat(quote.premium) * 100),
            currency: 'USD'
          },
          note: `Quote ID: ${quoteId}`,
          metadata: {
            'dei_quote_id': quoteId,
            'coverage_type': quote.coverageType
          }
        }
      ]
    },
    idempotencyKey: `insurance-${orderId}-${quoteId}`
  });

  return response.result.order;
}
```

### Separate Payment Flow

Process insurance payment separately from Square:

```
Customer checks out in Square
         ↓
Insurance offer email sent
         ↓
Customer purchases insurance separately
         ↓
Policy linked to Square order
```

Enable in settings:
```json
{
  "paymentFlow": "separate",
  "offerTiming": "post-purchase",
  "offerDelay": "1_hour"
}
```

---

## Booking Integration

### Square Appointments Integration

Automatically offer insurance for Square Appointments bookings:

1. Go to **Integrations > Square > Appointments**
2. Enable **Auto-offer for Bookings**
3. Configure service mapping

### Service Type Mapping

Map Square Appointments services to coverage:

```javascript
{
  "appointmentServices": [
    {
      "squareServiceId": "SVC_xxx",
      "serviceName": "Personal Training",
      "coverageTypes": ["liability"],
      "autoOffer": true
    },
    {
      "squareServiceId": "SVC_yyy",
      "serviceName": "Equipment Rental + Training",
      "coverageTypes": ["liability", "equipment"],
      "autoOffer": true
    }
  ]
}
```

### Booking Webhook Handler

```javascript
// Handle Square booking webhook
app.post('/webhooks/square/booking', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'booking.created') {
    const booking = data.object.booking;

    // Generate insurance quote
    const quote = await dailyEvent.quotes.create({
      eventType: booking.appointment_segments[0].service_variation.name,
      eventDate: booking.start_at,
      participants: 1,
      coverageType: 'liability',
      customerEmail: booking.customer_email_address,
      metadata: {
        squareBookingId: booking.id,
        squareLocationId: booking.location_id
      }
    });

    // Send insurance offer
    await dailyEvent.notifications.sendQuoteOffer(quote.id);
  }

  res.json({ received: true });
});
```

---

## Webhook Configuration

### Supported Webhook Events

| Event | Trigger | Use Case |
|-------|---------|----------|
| `booking.created` | New appointment booked | Generate quote |
| `booking.updated` | Appointment modified | Update quote if needed |
| `booking.cancelled` | Appointment cancelled | Cancel pending quote |
| `order.created` | New order placed | Add insurance offer |
| `order.updated` | Order modified | Sync changes |
| `payment.completed` | Payment successful | Create policy |
| `payment.refunded` | Payment refunded | Handle cancellation |

### Register Webhooks

**Via Square Dashboard:**

1. Go to [Square Developer Dashboard](https://developer.squareup.com)
2. Select your application
3. Go to **Webhooks > Add Endpoint**
4. URL: `https://api.dailyevent.com/v1/webhooks/square`
5. Select events: `booking.*`, `order.*`, `payment.*`

**Via API:**

```bash
curl -X POST https://connect.squareup.com/v2/webhooks/subscriptions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idempotency_key": "unique-key-123",
    "subscription": {
      "name": "Daily Event Insurance",
      "event_types": [
        "booking.created",
        "booking.updated",
        "order.created",
        "payment.completed"
      ],
      "notification_url": "https://api.dailyevent.com/v1/webhooks/square"
    }
  }'
```

### Webhook Signature Verification

Verify Square webhook signatures:

```javascript
const crypto = require('crypto');

function verifySquareWebhook(body, signature, signatureKey) {
  const hmac = crypto.createHmac('sha256', signatureKey);
  hmac.update(body);
  const expectedSignature = 'sha256=' + hmac.digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/square', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-square-hmacsha256-signature'];

  if (!verifySquareWebhook(req.body, signature, SQUARE_SIGNATURE_KEY)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);
  // Process event...

  res.json({ received: true });
});
```

---

## Testing

### Sandbox Environment

1. Use Square Sandbox credentials for testing
2. Set Daily Event to **Test Mode**
3. Test card numbers work in sandbox

### Test Cards

| Card Number | Result |
|-------------|--------|
| `4111 1111 1111 1111` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0077` | Processing error |

### Test Booking Flow

1. Create test appointment in Square
2. Check Daily Event for webhook receipt
3. Verify quote generated
4. Complete test payment
5. Confirm policy created

### Test Checkout Flow

1. Add items to Square cart
2. Trigger checkout with insurance
3. Use test card
4. Verify combined payment
5. Check policy creation

---

## Troubleshooting

### Issue: OAuth Connection Failed

**Symptoms:**
- "Authorization failed" error
- Redirect loop during connection

**Solutions:**

1. **Verify OAuth scopes:**
   - Check app has required permissions
   - Re-authorize if scopes changed

2. **Check redirect URI:**
   - Must match exactly in Square app settings
   - Production: `https://partner.dailyevent.com/integrations/square/callback`

3. **Verify app status:**
   - App must be in "Production" mode for live data

### Issue: Location ID Not Found

**Symptoms:**
- "Invalid location" errors
- Location dropdown empty

**Solutions:**

1. **Check location status:**
   ```bash
   curl https://connect.squareup.com/v2/locations \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Verify location is ACTIVE:**
   - Inactive locations won't appear
   - Enable in Square Dashboard

3. **Confirm authorization includes location:**
   - Re-authorize OAuth to include new locations

### Issue: Catalog Sync Not Working

**Symptoms:**
- Items not appearing
- Category mapping fails

**Solutions:**

1. **Check API permissions:**
   - `ITEMS_READ` scope required

2. **Trigger manual sync:**
   - Dashboard > Square > Catalog > **Sync Now**

3. **Verify item visibility:**
   - Items must be visible in Square
   - Check "All Locations" vs specific location

### Issue: Payment Not Processing

**Symptoms:**
- Insurance not added to order
- Payment fails for combined checkout

**Solutions:**

1. **Check order state:**
   - Order must be in "OPEN" state
   - Cannot modify completed orders

2. **Verify location payment settings:**
   - Location must accept card payments
   - Check Square payment settings

3. **Review API response:**
   ```javascript
   const result = await squareClient.ordersApi.updateOrder(...);
   console.log(result.errors); // Check for errors
   ```

### Issue: Webhooks Not Received

**Symptoms:**
- No webhook logs
- Events not triggering quotes

**Solutions:**

1. **Verify webhook subscription:**
   ```bash
   curl https://connect.squareup.com/v2/webhooks/subscriptions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Check endpoint URL:**
   - Must be HTTPS
   - Must be publicly accessible

3. **Review webhook logs in Square:**
   - Developer Dashboard > Webhooks > Logs

4. **Verify signature key:**
   - Must match between Square and Daily Event

---

## Advanced Configuration

### Multi-Location Setup

Configure different settings per location:

```javascript
{
  "locations": {
    "LOCATION_ID_1": {
      "name": "Main Studio",
      "defaultCoverage": ["liability"],
      "autoOffer": true,
      "combinePayment": true
    },
    "LOCATION_ID_2": {
      "name": "Rental Center",
      "defaultCoverage": ["liability", "equipment"],
      "autoOffer": true,
      "combinePayment": true,
      "equipmentValueSource": "itemPrice"
    }
  }
}
```

### Custom Checkout UI

Customize insurance display at checkout:

```javascript
{
  "checkoutUI": {
    "position": "before-payment",
    "style": "card",
    "showDetails": true,
    "expandedByDefault": false,
    "customCSS": ".dei-insurance-card { border-radius: 8px; }"
  }
}
```

### Reporting Integration

Sync insurance data back to Square for reporting:

```javascript
{
  "reporting": {
    "syncToSquare": true,
    "customAttribute": "insurance_policy_id",
    "tagOrders": true
  }
}
```

---

## Support

Need help with Square integration?

- **Integration Support**: integrations@dailyevent.com
- **Square Developer Support**: https://developer.squareup.com/us/en/support
- **Square API Reference**: https://developer.squareup.com/reference/square
- **Dashboard Chat**: Use the support widget in your partner dashboard
