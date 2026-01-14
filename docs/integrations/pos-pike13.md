# Pike13 Integration Guide

Connect Pike13 to offer insurance coverage automatically when customers book classes, appointments, or purchase packages.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [API Setup](#api-setup)
- [Member ID Mapping](#member-id-mapping)
- [Service Category Configuration](#service-category-configuration)
- [Webhook Events](#webhook-events)
- [Rate Limit Handling](#rate-limit-handling)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Pike13 integration enables:

- **Automatic insurance offers** when clients book services
- **Real-time enrollment sync** for multi-session packages
- **Seamless client matching** between systems
- **Automated certificate delivery** to clients

### Integration Architecture

```
Pike13 → Webhook → Daily Event API → Quote Engine → Client Notification
                                        ↓
                                   Policy Management ← Payment → Certificate
```

---

## Prerequisites

Before starting, ensure you have:

- [ ] Pike13 Business account with API access
- [ ] Owner or Manager role in Pike13
- [ ] Daily Event Insurance Partner account
- [ ] Subdomain of your Pike13 account (e.g., `yourstudio.pike13.com`)

### Required Pike13 Permissions

Your Pike13 account needs:
- API access enabled for your plan
- Permission to create webhooks
- Access to client and enrollment data

---

## API Setup

### Step 1: Generate Pike13 API Token

1. Log into Pike13 at `https://yourstudio.pike13.com`
2. Go to **Settings > Advanced > API Access**
3. Click **Generate New Token**
4. Label it "Daily Event Insurance"
5. Copy the API token (it won't be shown again)

### Step 2: Connect in Daily Event Dashboard

1. Log into your [Partner Dashboard](https://partner.dailyevent.com)
2. Navigate to **Integrations > POS Systems > Pike13**
3. Enter your credentials:

| Field | Value | Example |
|-------|-------|---------|
| Subdomain | Your Pike13 subdomain | `yourstudio` |
| API Token | Token from Step 1 | `pk13_xxxxxxxx...` |
| Business Name | Your business name | "Your Studio Name" |

4. Click **Connect**

### Step 3: Verify Connection

After connecting, verify the integration:

```json
{
  "status": "connected",
  "subdomain": "yourstudio",
  "businessName": "Your Studio Name",
  "plan": "pro",
  "clientCount": 2450,
  "serviceCount": 35,
  "lastSync": "2025-01-13T10:00:00Z"
}
```

---

## Member ID Mapping

### Automatic Client Matching

Daily Event automatically matches Pike13 clients to insurance records using:

1. **Email address** (primary)
2. **Phone number** (secondary)
3. **Name + DOB** (fallback)

### Client Data Synced

| Pike13 Field | Daily Event Field | Notes |
|--------------|-------------------|-------|
| `email` | `customerEmail` | Primary identifier |
| `first_name` | `firstName` | |
| `last_name` | `lastName` | |
| `phone` | `phone` | Normalized format |
| `birthdate` | `dateOfBirth` | Optional, for ID verification |
| `client_id` | `externalId` | Pike13 internal ID |

### Custom Client Mapping

For complex matching requirements, configure custom mapping:

1. Go to **Integrations > Pike13 > Client Mapping**
2. Add mapping rules:

```javascript
{
  "mappingRules": [
    {
      "pike13Field": "email",
      "deiField": "customerEmail",
      "transform": "lowercase"
    },
    {
      "pike13Field": "custom_fields.member_id",
      "deiField": "metadata.memberId"
    },
    {
      "pike13Field": "phone",
      "deiField": "phone",
      "transform": "normalizePhone"
    }
  ]
}
```

### Member Merge Handling

When Pike13 members are merged:

1. Webhook `client.merged` is received
2. Old client ID mapped to new client ID
3. Existing quotes/policies updated
4. Historical data preserved under new ID

---

## Service Category Configuration

### Map Pike13 Services to Coverage

Configure which Pike13 service categories trigger insurance offers:

1. Go to **Integrations > Pike13 > Service Categories**
2. For each Pike13 service type, set:

| Pike13 Category | Coverage Types | Auto-Offer | Priority |
|-----------------|----------------|------------|----------|
| Group Classes | Liability | Yes | Normal |
| Personal Training | Liability | Yes | Normal |
| Equipment Rental | Liability, Equipment | Yes | High |
| Workshops | Liability, Cancellation | Yes | Normal |
| Outdoor Events | Liability, Cancellation | Yes | High |

### Service Mapping Rules

Create advanced rules based on service attributes:

```javascript
{
  "serviceRules": [
    {
      "condition": {
        "category": "group_class",
        "name": {
          "contains": ["advanced", "intense", "extreme"]
        }
      },
      "coverage": ["liability"],
      "premium_multiplier": 1.25,
      "autoOffer": true
    },
    {
      "condition": {
        "duration_minutes": {
          "greaterThan": 120
        }
      },
      "coverage": ["liability", "cancellation"],
      "autoOffer": true
    },
    {
      "condition": {
        "category": "rental"
      },
      "coverage": ["liability", "equipment"],
      "equipment_value": "service.price",
      "autoOffer": true
    }
  ]
}
```

### Exclude Services

Exclude specific services from insurance offers:

```javascript
{
  "exclusions": [
    {
      "type": "category",
      "value": "kids_classes"
    },
    {
      "type": "service_id",
      "value": [12345, 67890]
    },
    {
      "type": "name",
      "pattern": ".*trial.*"
    }
  ]
}
```

---

## Webhook Events

### Supported Events

| Event | Trigger | Data Included |
|-------|---------|---------------|
| `enrollment.created` | Client enrolls in service | Service, client, date details |
| `enrollment.cancelled` | Enrollment cancelled | Cancellation reason, refund status |
| `enrollment.updated` | Enrollment modified | Changed fields |
| `visit.completed` | Client completes visit | Visit details, instructor |
| `client.created` | New client added | Full client profile |
| `client.updated` | Client info changed | Updated fields |
| `client.merged` | Clients merged | Old/new IDs |

### Webhook Payload Example

**enrollment.created:**

```json
{
  "event": "enrollment.created",
  "timestamp": "2025-03-15T09:00:00Z",
  "data": {
    "enrollment": {
      "id": 123456,
      "state": "confirmed",
      "created_at": "2025-03-15T09:00:00Z",
      "starts_at": "2025-03-20T18:00:00Z",
      "ends_at": "2025-03-20T19:00:00Z"
    },
    "service": {
      "id": 7890,
      "name": "Power Yoga",
      "category": "group_class",
      "duration_minutes": 60,
      "price": "25.00"
    },
    "client": {
      "id": 45678,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+15551234567"
    },
    "location": {
      "id": 1,
      "name": "Main Studio"
    },
    "staff": {
      "id": 101,
      "name": "John Instructor"
    }
  }
}
```

### Configure Webhook Endpoint

1. In Pike13, go to **Settings > Integrations > Webhooks**
2. Add webhook:

```
URL: https://api.dailyevent.com/v1/webhooks/pike13
Events: enrollment.created, enrollment.cancelled
Secret: [Generated in Daily Event dashboard]
```

---

## Rate Limit Handling

### Pike13 Rate Limits

Pike13 API has the following limits:

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Read (GET) | 100 | Per minute |
| Write (POST/PUT) | 30 | Per minute |
| Webhooks | 60 | Per minute |

### Rate Limit Headers

Pike13 includes rate limit info in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

### Automatic Retry with Backoff

Daily Event automatically handles rate limits:

```javascript
// Internal retry logic (for reference)
async function makeRequest(url, options, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitTime = Math.max(
        (resetTime - Date.now() / 1000) * 1000,
        Math.pow(2, attempt) * 1000
      );

      console.log(`Rate limited. Waiting ${waitTime}ms before retry`);
      await sleep(waitTime);
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}
```

### High Volume Configuration

For studios with high enrollment volume (500+ enrollments/day):

1. Contact support to request elevated rate limits
2. Enable batch processing mode:

```json
{
  "batchProcessing": {
    "enabled": true,
    "batchSize": 50,
    "intervalSeconds": 60
  }
}
```

3. Configure webhook queuing:

```json
{
  "webhookQueuing": {
    "enabled": true,
    "maxConcurrent": 10,
    "retryAttempts": 5
  }
}
```

---

## Testing

### Test Mode

1. Go to **Integrations > Pike13 > Settings**
2. Enable **Test Mode**
3. All operations use sandbox data

### Create Test Enrollment

1. In Pike13, create a test service
2. Enroll a test client
3. Check Daily Event dashboard for webhook receipt

### Verify Webhook Delivery

```bash
# Check webhook logs
curl -X GET "https://api.dailyevent.com/v1/integrations/pike13/webhooks?limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Expected response:
```json
{
  "webhooks": [
    {
      "id": "wh_123",
      "event": "enrollment.created",
      "status": "processed",
      "receivedAt": "2025-03-15T09:00:05Z",
      "processedAt": "2025-03-15T09:00:07Z"
    }
  ]
}
```

### End-to-End Test

1. Create test enrollment in Pike13
2. Verify webhook in Daily Event logs
3. Confirm quote generated
4. Check notification sent to client
5. Complete test purchase
6. Verify policy created

---

## Troubleshooting

### Issue: OAuth Token Expired

**Symptoms:**
- 401 Unauthorized errors
- "Token expired" messages

**Solutions:**

1. **Regenerate API token:**
   - Go to Pike13 **Settings > API Access**
   - Generate new token
   - Update in Daily Event dashboard

2. **Check token permissions:**
   - Ensure token has read access to enrollments and clients

### Issue: Service Category Mapping Errors

**Symptoms:**
- Enrollments not generating quotes
- "Unknown category" in logs

**Solutions:**

1. **Verify category exists:**
   ```bash
   curl "https://yourstudio.pike13.com/api/v2/desk/service_types" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Update mapping:**
   - Check category names match exactly
   - Category names are case-sensitive

3. **Add missing categories:**
   - Go to **Service Categories**
   - Add unmapped Pike13 categories

### Issue: Duplicate Enrollments

**Symptoms:**
- Multiple quotes for same enrollment
- Duplicate webhooks received

**Solutions:**

1. **Enable deduplication:**
   ```json
   {
     "deduplication": {
       "enabled": true,
       "keyFields": ["enrollment_id", "client_id"],
       "windowMinutes": 5
     }
   }
   ```

2. **Check Pike13 webhook config:**
   - Ensure only one webhook registered
   - Remove duplicate endpoints

### Issue: Client Data Mismatch

**Symptoms:**
- Client not found in Pike13
- Wrong client matched

**Solutions:**

1. **Verify email matching:**
   - Check client email exists in Pike13
   - Ensure emails match exactly (case-insensitive)

2. **Enable fuzzy matching:**
   ```json
   {
     "clientMatching": {
       "fuzzyMatch": true,
       "threshold": 0.8
     }
   }
   ```

3. **Manual client mapping:**
   - Go to **Client Mapping**
   - Create manual Pike13 ID to DEI ID mapping

### Issue: Rate Limit Exceeded

**Symptoms:**
- 429 status codes
- Delays in processing

**Solutions:**

1. **Monitor rate limit usage:**
   - Dashboard > Integrations > Pike13 > API Usage

2. **Enable queuing:**
   - Webhooks are queued automatically
   - Processing spreads across time window

3. **Request limit increase:**
   - Contact support for high-volume needs

### Issue: Webhook Signature Validation Failed

**Symptoms:**
- "Invalid signature" errors
- Webhooks rejected

**Solutions:**

1. **Verify webhook secret:**
   - Go to **Integrations > Pike13 > Webhook Secret**
   - Copy secret to Pike13 webhook configuration

2. **Check payload format:**
   - Ensure Pike13 sends JSON format
   - Content-Type must be `application/json`

---

## Advanced Configuration

### Custom Field Mapping

Map Pike13 custom fields to quote metadata:

```javascript
{
  "customFields": {
    "pike13.custom_fields.emergency_contact": "metadata.emergencyContact",
    "pike13.custom_fields.experience_level": "metadata.experienceLevel",
    "pike13.custom_fields.equipment_serial": "metadata.equipmentSerial"
  }
}
```

### Location-Based Configuration

Different settings per Pike13 location:

```javascript
{
  "locations": {
    "main_studio": {
      "defaultCoverage": ["liability"],
      "premiumMultiplier": 1.0
    },
    "outdoor_pavilion": {
      "defaultCoverage": ["liability", "cancellation"],
      "premiumMultiplier": 1.25
    }
  }
}
```

### Multi-Location Setup

For multi-location businesses:

1. Each location uses same Pike13 account
2. Configure location mapping in Daily Event
3. Set coverage rules per location

---

## Support

Need help with Pike13 integration?

- **Integration Support**: integrations@dailyevent.com
- **Pike13 Support**: https://pike13.com/support
- **Pike13 API Docs**: https://developers.pike13.com
- **Dashboard Chat**: Use the support widget in your dashboard
