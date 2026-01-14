# REST API Reference

Complete API documentation for programmatic integration with Daily Event Insurance.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Rate Limits](#rate-limits)
- [Endpoints](#endpoints)
  - [Quotes](#quotes)
  - [Policies](#policies)
  - [Products](#products)
  - [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [SDKs](#sdks)

---

## Overview

The Daily Event Insurance API is a RESTful API that allows partners to:

- Generate insurance quotes programmatically
- Create and manage policies
- Configure webhooks for real-time notifications
- Retrieve analytics and reporting data

### API Version

Current version: `v1`

All endpoints are versioned and backward compatible within major versions.

---

## Authentication

### API Key Authentication

Include your API key in the `Authorization` header:

```bash
curl -X GET https://api.dailyevent.com/v1/quotes \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Obtaining API Keys

1. Log into your partner dashboard at https://partner.dailyevent.com
2. Navigate to **Settings > API Keys**
3. Click **Generate New Key**
4. Copy and securely store your key (it won't be shown again)

### Key Types

| Type | Permissions | Use Case |
|------|-------------|----------|
| **Production** | Full access | Live integrations |
| **Test** | Sandbox only | Development/testing |
| **Read-only** | GET requests only | Reporting/analytics |

### Security Best Practices

- Never expose API keys in client-side code
- Store keys in environment variables
- Rotate keys every 90 days
- Use IP allowlisting for production keys
- Use test keys for development

---

## Base URL

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.dailyevent.com/v1` |
| Sandbox | `https://sandbox.api.dailyevent.com/v1` |

---

## Rate Limits

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Standard | 100 | 10,000 |
| Professional | 500 | 50,000 |
| Enterprise | 2,000 | Unlimited |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

### Handling Rate Limits

When rate limited, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Retry after 30 seconds.",
  "retry_after": 30
}
```

Implement exponential backoff:

```javascript
async function apiRequest(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    return response;
  }
  throw new Error('Max retries exceeded');
}
```

---

## Endpoints

### Quotes

#### Create Quote

Generate a new insurance quote.

```http
POST /v1/quotes
```

**Request Body:**

```json
{
  "eventType": "fitness_class",
  "eventDate": "2025-03-15",
  "participants": 25,
  "coverageType": "liability",
  "customerEmail": "customer@example.com",
  "customerName": "Jane Smith",
  "eventDetails": {
    "location": "Downtown Fitness Studio",
    "duration": 2,
    "description": "Group yoga session",
    "instructorName": "John Doe"
  },
  "metadata": {
    "bookingId": "BK-12345",
    "source": "website"
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventType` | string | Yes | Type of event (2-100 chars) |
| `eventDate` | string | Yes | Event date (ISO 8601, must be future) |
| `participants` | integer | Yes | Number of participants (1-10,000) |
| `coverageType` | string | Yes | `liability`, `equipment`, or `cancellation` |
| `customerEmail` | string | No | Customer email address |
| `customerName` | string | No | Customer full name |
| `eventDetails` | object | No | Additional event information |
| `metadata` | object | No | Custom key-value pairs |

**Response:**

```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "qt_abc123def456",
      "quoteNumber": "QT-20250315-00042",
      "eventType": "fitness_class",
      "eventDate": "2025-03-15T00:00:00Z",
      "participants": 25,
      "coverageType": "liability",
      "premium": "124.75",
      "currency": "USD",
      "commission": "62.38",
      "status": "pending",
      "expiresAt": "2025-04-14T00:00:00Z",
      "coverageDetails": {
        "limit": "1000000",
        "deductible": "500",
        "description": "General liability coverage for fitness activities"
      },
      "createdAt": "2025-03-01T10:30:00Z"
    }
  },
  "message": "Quote created successfully"
}
```

**cURL Example:**

```bash
curl -X POST https://api.dailyevent.com/v1/quotes \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "fitness_class",
    "eventDate": "2025-03-15",
    "participants": 25,
    "coverageType": "liability",
    "customerEmail": "customer@example.com"
  }'
```

**JavaScript Example:**

```javascript
const response = await fetch('https://api.dailyevent.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.DAILYEVENT_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    eventType: 'fitness_class',
    eventDate: '2025-03-15',
    participants: 25,
    coverageType: 'liability',
    customerEmail: 'customer@example.com',
  }),
});

const { data } = await response.json();
console.log('Quote ID:', data.quote.id);
console.log('Premium:', data.quote.premium);
```

**Python Example:**

```python
import requests
import os

response = requests.post(
    'https://api.dailyevent.com/v1/quotes',
    headers={
        'Authorization': f'Bearer {os.environ["DAILYEVENT_API_KEY"]}',
        'Content-Type': 'application/json',
    },
    json={
        'eventType': 'fitness_class',
        'eventDate': '2025-03-15',
        'participants': 25,
        'coverageType': 'liability',
        'customerEmail': 'customer@example.com',
    }
)

data = response.json()
print(f"Quote ID: {data['data']['quote']['id']}")
print(f"Premium: {data['data']['quote']['premium']}")
```

---

#### Get Quote

Retrieve a specific quote by ID.

```http
GET /v1/quotes/{quote_id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "qt_abc123def456",
      "quoteNumber": "QT-20250315-00042",
      "eventType": "fitness_class",
      "eventDate": "2025-03-15T00:00:00Z",
      "participants": 25,
      "coverageType": "liability",
      "premium": "124.75",
      "currency": "USD",
      "status": "pending",
      "expiresAt": "2025-04-14T00:00:00Z",
      "customerEmail": "customer@example.com",
      "customerName": "Jane Smith",
      "coverageDetails": {
        "limit": "1000000",
        "deductible": "500"
      },
      "createdAt": "2025-03-01T10:30:00Z"
    }
  }
}
```

---

#### List Quotes

Retrieve all quotes with pagination and filtering.

```http
GET /v1/quotes
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `pageSize` | integer | 20 | Items per page (max 100) |
| `status` | string | - | Filter by status |
| `coverageType` | string | - | Filter by coverage type |
| `startDate` | string | - | Filter events after date |
| `endDate` | string | - | Filter events before date |
| `sort` | string | `-createdAt` | Sort field (prefix `-` for desc) |

**Example:**

```bash
curl "https://api.dailyevent.com/v1/quotes?status=pending&pageSize=50" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 245,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Policies

#### Create Policy

Convert a quote to an active policy with payment.

```http
POST /v1/policies
```

**Request Body:**

```json
{
  "quoteId": "qt_abc123def456",
  "paymentMethodId": "pm_card_xxx",
  "customerDetails": {
    "email": "customer@example.com",
    "name": "Jane Smith",
    "phone": "+15551234567",
    "address": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "policy": {
      "id": "pol_xyz789abc",
      "policyNumber": "POL-20250315-00018",
      "quoteId": "qt_abc123def456",
      "status": "active",
      "premium": "124.75",
      "effectiveDate": "2025-03-15T00:00:00Z",
      "expirationDate": "2025-03-16T00:00:00Z",
      "certificateUrl": "https://cdn.dailyevent.com/certificates/POL-20250315-00018.pdf",
      "createdAt": "2025-03-01T10:35:00Z"
    }
  },
  "message": "Policy created successfully"
}
```

---

#### Get Policy

Retrieve policy details.

```http
GET /v1/policies/{policy_id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "policy": {
      "id": "pol_xyz789abc",
      "policyNumber": "POL-20250315-00018",
      "eventType": "fitness_class",
      "eventDate": "2025-03-15T00:00:00Z",
      "participants": 25,
      "coverageType": "liability",
      "premium": "124.75",
      "status": "active",
      "effectiveDate": "2025-03-15T00:00:00Z",
      "expirationDate": "2025-03-16T00:00:00Z",
      "customerName": "Jane Smith",
      "customerEmail": "customer@example.com",
      "eventDetails": {
        "location": "Downtown Fitness Studio",
        "duration": 2
      },
      "coverageDetails": {
        "limit": "1000000",
        "deductible": "500"
      },
      "certificateUrl": "https://cdn.dailyevent.com/certificates/POL-20250315-00018.pdf",
      "certificateIssued": true,
      "createdAt": "2025-03-01T10:35:00Z"
    }
  }
}
```

---

#### List Policies

```http
GET /v1/policies
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number |
| `pageSize` | integer | Items per page (max 100) |
| `status` | string | `active`, `expired`, `cancelled`, `pending` |
| `startDate` | string | Events after this date |
| `endDate` | string | Events before this date |

---

#### Download Certificate

```http
GET /v1/policies/{policy_id}/certificate
```

Returns a redirect to the PDF certificate URL.

---

### Products

#### List Products

Get available insurance products for your partner account.

```http
GET /v1/products
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_liability",
        "type": "liability",
        "name": "General Liability",
        "description": "Coverage for third-party bodily injury and property damage",
        "basePrice": "4.99",
        "pricePerParticipant": true,
        "minParticipants": 1,
        "maxParticipants": 10000,
        "coverageLimits": {
          "minimum": "100000",
          "maximum": "5000000",
          "default": "1000000"
        },
        "isEnabled": true
      },
      {
        "id": "prod_equipment",
        "type": "equipment",
        "name": "Equipment Protection",
        "description": "Coverage for rental and owned equipment",
        "basePrice": "9.99",
        "pricePerParticipant": true,
        "isEnabled": true
      },
      {
        "id": "prod_cancellation",
        "type": "cancellation",
        "name": "Event Cancellation",
        "description": "Coverage for event cancellation and postponement",
        "basePrice": "14.99",
        "pricePerParticipant": true,
        "isEnabled": true
      }
    ]
  }
}
```

---

### Webhooks

#### Create Webhook

Register a webhook endpoint to receive real-time notifications.

```http
POST /v1/webhooks
```

**Request Body:**

```json
{
  "url": "https://yoursite.com/webhooks/insurance",
  "events": [
    "quote.created",
    "quote.expired",
    "policy.created",
    "policy.cancelled",
    "payment.succeeded",
    "payment.failed"
  ],
  "secret": "your_webhook_secret"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "webhook": {
      "id": "wh_abc123",
      "url": "https://yoursite.com/webhooks/insurance",
      "events": ["quote.created", "policy.created", ...],
      "status": "active",
      "secret": "whsec_...",
      "createdAt": "2025-03-01T10:00:00Z"
    }
  }
}
```

---

#### Webhook Events

| Event | Description |
|-------|-------------|
| `quote.created` | New quote generated |
| `quote.expired` | Quote has expired |
| `policy.created` | New policy created |
| `policy.activated` | Policy became active |
| `policy.expired` | Policy has expired |
| `policy.cancelled` | Policy was cancelled |
| `payment.succeeded` | Payment completed |
| `payment.failed` | Payment failed |
| `certificate.generated` | Certificate PDF ready |

---

#### Webhook Payload

```json
{
  "id": "evt_abc123",
  "type": "policy.created",
  "created": "2025-03-01T10:35:00Z",
  "data": {
    "object": {
      "id": "pol_xyz789",
      "policyNumber": "POL-20250315-00018",
      "status": "active",
      ...
    }
  }
}
```

---

#### Verifying Webhook Signatures

All webhooks include an `X-DEI-Signature` header for verification.

**Signature Format:**

```
X-DEI-Signature: t=1704067200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

**Verification (Node.js):**

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).slice(2);
  const receivedSig = parts.find(p => p.startsWith('v1=')).slice(3);

  // Check timestamp (5-minute tolerance)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return false;
  }

  // Verify signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  );
}

// Express middleware
app.post('/webhooks/insurance', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-dei-signature'];

  if (!verifyWebhookSignature(req.body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);

  switch (event.type) {
    case 'policy.created':
      handlePolicyCreated(event.data.object);
      break;
    case 'payment.failed':
      handlePaymentFailed(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

**Verification (Python):**

```python
import hmac
import hashlib
import time

def verify_webhook_signature(payload, signature, secret):
    parts = dict(p.split('=') for p in signature.split(','))
    timestamp = parts.get('t')
    received_sig = parts.get('v1')

    # Check timestamp (5-minute tolerance)
    if abs(time.time() - int(timestamp)) > 300:
        return False

    # Verify signature
    signed_payload = f"{timestamp}.{payload}"
    expected_sig = hmac.new(
        secret.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(received_sig, expected_sig)
```

---

#### List Webhooks

```http
GET /v1/webhooks
```

---

#### Delete Webhook

```http
DELETE /v1/webhooks/{webhook_id}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "validation_error",
  "message": "Event date must be in the future",
  "code": "INVALID_EVENT_DATE",
  "details": {
    "field": "eventDate",
    "value": "2024-01-01",
    "constraint": "future_date"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_EVENT_DATE` | 400 | Event date is invalid or in past |
| `INVALID_PARTICIPANTS` | 400 | Participant count out of range |
| `INVALID_COVERAGE_TYPE` | 400 | Unknown coverage type |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `QUOTE_EXPIRED` | 410 | Quote has expired |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## SDKs

Official SDKs are available for common languages:

### Node.js / TypeScript

```bash
npm install @dailyevent/sdk
```

```typescript
import { DailyEventClient } from '@dailyevent/sdk';

const client = new DailyEventClient({
  apiKey: process.env.DAILYEVENT_API_KEY,
});

const quote = await client.quotes.create({
  eventType: 'fitness_class',
  eventDate: '2025-03-15',
  participants: 25,
  coverageType: 'liability',
});

console.log('Quote:', quote.id);
```

### Python

```bash
pip install dailyevent
```

```python
from dailyevent import DailyEventClient

client = DailyEventClient(api_key=os.environ['DAILYEVENT_API_KEY'])

quote = client.quotes.create(
    event_type='fitness_class',
    event_date='2025-03-15',
    participants=25,
    coverage_type='liability'
)

print(f"Quote: {quote.id}")
```

### PHP

```bash
composer require dailyevent/sdk
```

```php
use DailyEvent\Client;

$client = new Client(getenv('DAILYEVENT_API_KEY'));

$quote = $client->quotes->create([
    'eventType' => 'fitness_class',
    'eventDate' => '2025-03-15',
    'participants' => 25,
    'coverageType' => 'liability',
]);

echo "Quote: " . $quote->id;
```

---

## Support

- **API Status**: https://status.dailyevent.com
- **Documentation**: https://docs.dailyevent.com
- **Email**: api-support@dailyevent.com
- **Postman Collection**: [Download](https://docs.dailyevent.com/postman)
- **OpenAPI Spec**: https://api.dailyevent.com/v1/openapi.json
