# Mindbody Integration Guide

Connect your Mindbody account to automatically offer insurance coverage when customers book classes or appointments.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [OAuth Setup](#oauth-setup)
- [Webhook Configuration](#webhook-configuration)
- [Class Booking Sync](#class-booking-sync)
- [Event Mapping](#event-mapping)
- [Testing](#testing)
- [Common Issues & Solutions](#common-issues--solutions)

---

## Overview

The Mindbody integration enables:

- **Automatic insurance offers** when customers book classes
- **Real-time sync** of booking data to trigger insurance quotes
- **Seamless checkout** with insurance added to the booking flow
- **Certificate delivery** directly to customers via Mindbody notifications

### Integration Flow

```
1. Customer books class in Mindbody
2. Mindbody sends webhook to Daily Event Insurance
3. Insurance quote generated automatically
4. Customer receives insurance offer via email/SMS
5. If purchased, certificate syncs back to Mindbody
```

---

## Prerequisites

Before starting, ensure you have:

- [ ] Mindbody Business subscription (API access required)
- [ ] Mindbody Staff user with API permissions
- [ ] Daily Event Insurance Partner account
- [ ] Access to your Mindbody Developer Portal

### Required Mindbody API Permissions

Your API credentials need these scopes:
- `Bookings` - Read access to class bookings
- `Classes` - Read access to class information
- `Clients` - Read access to client information
- `Appointments` - Read access to appointments (if applicable)
- `Webhooks` - Create and manage webhooks

---

## OAuth Setup

### Step 1: Create API Credentials in Mindbody

1. Log into [Mindbody Business](https://business.mindbodyonline.com)
2. Navigate to **Settings > Integrations > API**
3. Click **Add Application**
4. Fill in the application details:
   - **Name**: Daily Event Insurance
   - **Description**: Insurance coverage for class bookings
   - **Redirect URI**: `https://partner.dailyevent.com/integrations/mindbody/callback`
5. Note your **API Key** and **Client Secret**

### Step 2: Connect in Daily Event Dashboard

1. Log into your [Partner Dashboard](https://partner.dailyevent.com)
2. Go to **Integrations > POS Systems > Mindbody**
3. Click **Connect Mindbody**
4. Enter your credentials:
   - **Site ID**: Your Mindbody Site ID (numeric)
   - **API Key**: From Step 1
   - **Source Name**: Your application source name
5. Click **Authorize**
6. You'll be redirected to Mindbody to approve access
7. After approval, you'll return to the dashboard with "Connected" status

### Step 3: Verify Connection

Test the connection by clicking **Test Connection** in the integration settings. You should see:

```json
{
  "status": "connected",
  "siteId": "123456",
  "siteName": "Your Studio Name",
  "lastSync": "2025-01-13T10:30:00Z",
  "permissions": ["bookings", "classes", "clients", "webhooks"]
}
```

---

## Webhook Configuration

### Automatic Webhook Setup

The Daily Event integration automatically configures webhooks when you connect. Webhooks are created for:

| Event Type | Description |
|------------|-------------|
| `classBooking.created` | New class booking |
| `classBooking.cancelled` | Booking cancellation |
| `clientClassBooking.created` | Client enrolled in class |
| `appointmentBooking.created` | Appointment booked |

### Manual Webhook Setup

If automatic setup fails, configure webhooks manually:

1. In Mindbody Business, go to **Settings > Integrations > Webhooks**
2. Click **Add Webhook**
3. Configure each webhook:

**Class Booking Created:**
```
URL: https://api.dailyevent.com/v1/webhooks/mindbody
Event: classBooking.created
Format: JSON
```

**Booking Cancelled:**
```
URL: https://api.dailyevent.com/v1/webhooks/mindbody
Event: classBooking.cancelled
Format: JSON
```

### Webhook Authentication

Add the webhook secret to your headers for verification:

1. In Daily Event dashboard, go to **Integrations > Mindbody > Webhook Settings**
2. Copy the **Webhook Secret**
3. In Mindbody webhook settings, add custom header:
   - **Header Name**: `X-DEI-Webhook-Secret`
   - **Value**: Your webhook secret

---

## Class Booking Sync

### How Sync Works

When a customer books a class:

1. Mindbody sends booking data to Daily Event
2. System extracts:
   - Class type and description
   - Class date and time
   - Customer email and name
   - Number of participants
3. Insurance quote is generated based on class type
4. Customer is notified of insurance option

### Booking Data Received

```json
{
  "eventType": "classBooking.created",
  "timestamp": "2025-03-15T09:30:00Z",
  "data": {
    "id": 123456,
    "classId": 7890,
    "className": "Power Yoga",
    "classDescription": "Intermediate level power yoga class",
    "classDate": "2025-03-15T18:00:00Z",
    "duration": 60,
    "location": {
      "id": 1,
      "name": "Main Studio"
    },
    "client": {
      "id": "CL12345",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "+15551234567"
    },
    "instructor": {
      "id": "INS123",
      "name": "John Smith"
    },
    "isCancelled": false,
    "isPaid": true
  }
}
```

### Sync Status

Monitor sync status in the dashboard:

| Status | Description |
|--------|-------------|
| `synced` | Successfully processed |
| `pending` | Awaiting processing |
| `failed` | Processing failed (see error) |
| `skipped` | Class type not configured for insurance |

---

## Event Mapping

### Configure Class-to-Coverage Mapping

Map your Mindbody class types to insurance coverage:

1. Go to **Integrations > Mindbody > Event Mapping**
2. Click **Add Mapping**
3. Configure:

| Mindbody Class | Coverage Type | Auto-Offer |
|----------------|---------------|------------|
| Yoga | Liability | Yes |
| Spin Class | Liability | Yes |
| Personal Training | Liability | Yes |
| Equipment Rental | Equipment + Liability | Yes |
| Outdoor Bootcamp | Liability + Cancellation | Yes |

### Mapping Rules

Create rules based on class attributes:

```javascript
{
  "rules": [
    {
      "condition": {
        "field": "className",
        "operator": "contains",
        "value": "outdoor"
      },
      "coverageTypes": ["liability", "cancellation"],
      "autoOffer": true
    },
    {
      "condition": {
        "field": "classDescription",
        "operator": "contains",
        "value": "equipment provided"
      },
      "coverageTypes": ["liability", "equipment"],
      "autoOffer": true
    },
    {
      "condition": {
        "field": "duration",
        "operator": ">=",
        "value": 120
      },
      "coverageTypes": ["liability", "cancellation"],
      "autoOffer": true,
      "priority": "high"
    }
  ]
}
```

### Exclude Classes

Exclude specific classes from insurance offers:

1. Go to **Event Mapping > Exclusions**
2. Add class names or IDs to exclude
3. Or add exclusion rules:

```javascript
{
  "excludeRules": [
    {
      "field": "className",
      "operator": "contains",
      "value": "kids"
    },
    {
      "field": "classId",
      "operator": "in",
      "value": [1234, 5678, 9012]
    }
  ]
}
```

---

## Testing

### Test Mode

Enable test mode to verify integration without affecting live data:

1. Go to **Integrations > Mindbody > Settings**
2. Toggle **Test Mode** on
3. All quotes will be marked as test and won't charge customers

### Test Webhook Delivery

1. Click **Send Test Webhook** in the integration dashboard
2. Select event type (e.g., `classBooking.created`)
3. Review the test payload and response

### Verify End-to-End

1. Create a test booking in Mindbody
2. Check the **Webhook Logs** in Daily Event dashboard
3. Verify quote was generated
4. Confirm customer received notification

### Test Booking Example

Create a test class booking in Mindbody with:
- Customer email: `test@yourdomain.com`
- Class: Any configured class type
- Date: Tomorrow or later

Expected results:
- Webhook received within 30 seconds
- Quote appears in dashboard
- Test email sent to customer

---

## Common Issues & Solutions

### Issue: Webhooks Not Received

**Symptoms:**
- No webhook logs in dashboard
- Bookings not triggering quotes

**Solutions:**

1. **Verify webhook URL is correct:**
   ```
   https://api.dailyevent.com/v1/webhooks/mindbody
   ```

2. **Check Mindbody webhook status:**
   - Go to Mindbody **Settings > Webhooks**
   - Ensure webhook is "Active"
   - Check delivery attempts

3. **Verify API credentials:**
   - Reconnect integration
   - Re-authorize OAuth access

4. **Check firewall/network:**
   - Mindbody IPs must be allowed
   - Whitelist: `52.26.0.0/16`, `54.148.0.0/16`

### Issue: Incorrect Site ID Format

**Symptoms:**
- Authentication fails
- "Invalid Site ID" error

**Solutions:**

The Site ID must be numeric only (no dashes or letters):
- Correct: `123456`
- Incorrect: `MB-123456` or `site-123456`

Find your Site ID:
1. Log into Mindbody Business
2. Go to **Settings > Account**
3. Site ID is displayed at the top

### Issue: API Key Without Required Permissions

**Symptoms:**
- Partial data sync
- "Forbidden" or "Unauthorized" errors

**Solutions:**

1. Verify API key has required scopes:
   - `Bookings` (read)
   - `Classes` (read)
   - `Clients` (read)
   - `Webhooks` (manage)

2. If missing permissions:
   - Delete the API key in Mindbody
   - Create a new key with all required scopes
   - Reconnect integration in Daily Event

### Issue: Firewall Blocking Webhook Callbacks

**Symptoms:**
- Webhooks showing as "failed" in Mindbody
- Timeout errors

**Solutions:**

1. **Whitelist Daily Event IPs:**
   ```
   52.27.180.0/24
   54.200.150.0/24
   35.167.200.0/24
   ```

2. **Check SSL/TLS:**
   - Ensure TLS 1.2+ is enabled
   - Valid SSL certificate required

3. **Verify endpoint accessibility:**
   ```bash
   curl -X POST https://api.dailyevent.com/v1/webhooks/mindbody \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### Issue: Duplicate Bookings

**Symptoms:**
- Multiple quotes for same booking
- Duplicate webhook deliveries

**Solutions:**

1. **Enable deduplication:**
   - Go to **Integrations > Mindbody > Advanced**
   - Enable **Deduplicate Events**

2. **Check idempotency:**
   - Each booking has unique ID
   - Dashboard filters duplicates automatically

### Issue: Customer Not Receiving Notifications

**Symptoms:**
- Quote generated but no email/SMS sent
- Customer complaints

**Solutions:**

1. **Verify customer email in Mindbody:**
   - Check client profile has valid email
   - Email must be marked as "preferred contact"

2. **Check notification settings:**
   - Go to **Settings > Notifications**
   - Ensure "Insurance Offers" is enabled

3. **Review spam filters:**
   - Add `@dailyevent.com` to safe senders
   - Check spam/junk folders

4. **Verify notification logs:**
   - Dashboard > Quotes > Select quote
   - View "Notifications" tab

### Issue: Class Types Not Mapping

**Symptoms:**
- Bookings processed but no quotes
- "Skipped" status in logs

**Solutions:**

1. **Add class to mapping:**
   - Go to **Event Mapping**
   - Add the Mindbody class type
   - Select coverage types

2. **Check rule conditions:**
   - Review mapping rules
   - Ensure class matches at least one rule

3. **Enable fallback coverage:**
   - Go to **Event Mapping > Defaults**
   - Set default coverage for unmapped classes

---

## Advanced Configuration

### Custom Field Mapping

Map Mindbody custom fields to quote metadata:

```javascript
{
  "customFieldMapping": {
    "mboField": "Custom.InsurancePreference",
    "deiField": "metadata.preferred_coverage"
  }
}
```

### Rate Limiting

If you have high booking volume, contact support for increased rate limits:

| Tier | Webhooks/Minute | Bookings/Day |
|------|-----------------|--------------|
| Standard | 60 | 5,000 |
| Professional | 300 | 25,000 |
| Enterprise | 1,000 | Unlimited |

### Multiple Location Support

For multi-location studios:

1. Each location needs separate Site ID
2. Configure each in **Integrations > Mindbody > Locations**
3. Map coverage types per location

---

## Support

Need help with your Mindbody integration?

- **Integration Chat**: Click the support widget in your dashboard
- **Email**: integrations@dailyevent.com
- **Mindbody Support**: https://support.mindbodyonline.com
- **API Documentation**: https://developers.mindbodyonline.com
