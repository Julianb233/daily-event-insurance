# Partner API Documentation

Production-ready REST API endpoints for partner integrations with daily-event-insurance.

## Base URL

```
https://your-domain.com/api/partner
```

## Authentication

All endpoints require authentication using NextAuth session cookies. Partners must have the `partner` or `admin` role.

### Headers

```http
Cookie: next-auth.session-token=<session-token>
Content-Type: application/json
```

## Response Format

All endpoints follow a consistent response format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Endpoints

### 1. Profile Management

#### GET /api/partner/profile

Get current partner's profile with products.

**Response:**

```json
{
  "partner": {
    "id": "uuid",
    "businessName": "My Gym",
    "businessType": "gym",
    "contactName": "John Doe",
    "contactEmail": "john@mygym.com",
    "status": "active",
    "...": "..."
  },
  "products": [
    {
      "id": "uuid",
      "productType": "liability",
      "isEnabled": true,
      "customerPrice": "4.99"
    }
  ]
}
```

#### PUT /api/partner/profile

Update partner profile (existing endpoint - uses PATCH).

---

### 2. Products

#### GET /api/partner/products

Get partner's insurance products.

**Query Parameters:**

- `enabled` (boolean, optional) - Filter by enabled status

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "productType": "liability",
        "isEnabled": true,
        "customerPrice": "4.99",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "summary": {
      "total": 3,
      "enabled": 2,
      "disabled": 1
    }
  }
}
```

---

### 3. Quotes

#### POST /api/partner/quotes

Create a new insurance quote.

**Request Body:**

```json
{
  "eventType": "Gym Session",
  "eventDate": "2025-02-15",
  "participants": 50,
  "coverageType": "liability",
  "eventDetails": {
    "location": "Downtown Gym",
    "duration": 2,
    "description": "Group fitness class"
  },
  "customerEmail": "customer@example.com",
  "customerName": "Jane Smith",
  "metadata": {
    "source": "api",
    "referrer": "website"
  }
}
```

**Validation:**

- `eventType`: string, 2-100 characters (required)
- `eventDate`: future date (required)
- `participants`: integer, 1-10,000 (required)
- `coverageType`: "liability" | "equipment" | "cancellation" (required)
- `eventDetails`: object (optional)
  - `location`: string, 2-200 characters
  - `duration`: number (hours)
  - `description`: string, max 1000 characters
- `customerEmail`: valid email (optional)
- `customerName`: string, 2-100 characters (optional)
- `metadata`: object (optional)

**Response:**

```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "uuid",
      "quoteNumber": "QT-20250215-00001",
      "eventType": "Gym Session",
      "eventDate": "2025-02-15T00:00:00Z",
      "participants": 50,
      "coverageType": "liability",
      "premium": "249.50",
      "commission": "124.75",
      "status": "pending",
      "expiresAt": "2025-03-17T00:00:00Z",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  },
  "message": "Quote created successfully"
}
```

#### GET /api/partner/quotes

List partner's quotes with pagination and filters.

**Query Parameters:**

- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `status` (string, optional) - "pending" | "accepted" | "declined" | "expired"
- `coverageType` (string, optional) - "liability" | "equipment" | "cancellation"
- `startDate` (date, optional) - Filter by event date >= startDate
- `endDate` (date, optional) - Filter by event date <= endDate

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "quoteNumber": "QT-20250215-00001",
      "eventType": "Gym Session",
      "participants": 50,
      "coverageType": "liability",
      "premium": "249.50",
      "commission": "124.75",
      "status": "pending",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 4. Policies

#### GET /api/partner/policies

List partner's active policies with pagination and filters.

**Query Parameters:**

- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `status` (string, optional) - "active" | "expired" | "cancelled" | "pending"
- `coverageType` (string, optional) - "liability" | "equipment" | "cancellation"
- `startDate` (date, optional) - Filter by event date >= startDate
- `endDate` (date, optional) - Filter by event date <= endDate

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "policyNumber": "POL-20250215-00001",
      "eventType": "Gym Session",
      "participants": 50,
      "coverageType": "liability",
      "premium": "249.50",
      "commission": "124.75",
      "status": "active",
      "effectiveDate": "2025-02-15T00:00:00Z",
      "expirationDate": "2025-03-17T00:00:00Z",
      "customerName": "Jane Smith",
      "customerEmail": "jane@example.com",
      "certificateIssued": true,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 120,
    "totalPages": 6,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/partner/policies/[policyId]

Get detailed information about a specific policy.

**Response:**

```json
{
  "success": true,
  "data": {
    "policy": {
      "id": "uuid",
      "policyNumber": "POL-20250215-00001",
      "eventType": "Gym Session",
      "eventDate": "2025-02-15T00:00:00Z",
      "participants": 50,
      "coverageType": "liability",
      "premium": "249.50",
      "commission": "124.75",
      "status": "active",
      "effectiveDate": "2025-02-15T00:00:00Z",
      "expirationDate": "2025-03-17T00:00:00Z",
      "customerName": "Jane Smith",
      "customerEmail": "jane@example.com",
      "customerPhone": "+15551234567",
      "eventDetails": {
        "location": "Downtown Gym",
        "duration": 2,
        "description": "Group fitness class"
      },
      "policyDocument": "https://example.com/policies/POL-20250215-00001.pdf",
      "certificateIssued": true,
      "metadata": {
        "source": "api",
        "referrer": "website"
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  }
}
```

---

### 5. Analytics

#### GET /api/partner/analytics

Get partner analytics and metrics.

**Query Parameters:**

- `period` (string, default: "30d") - "7d" | "30d" | "90d" | "12m" | "ytd" | "all"
- `groupBy` (string, default: "day") - "day" | "week" | "month"
- `metrics` (array, default: ["quotes", "policies", "revenue"]) - Metrics to include

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "30d",
    "dateRange": {
      "startDate": "2024-12-29T00:00:00Z",
      "endDate": "2025-01-28T00:00:00Z"
    },
    "summary": {
      "totalQuotes": 150,
      "totalPolicies": 98,
      "totalRevenue": "12245.50",
      "totalParticipants": 4850,
      "conversionRate": "65.33",
      "averageQuoteValue": "125.00",
      "optInRate": "65.00"
    },
    "byProduct": {
      "liability": {
        "quotes": 90,
        "policies": 60,
        "revenue": "7500.00"
      },
      "equipment": {
        "quotes": 38,
        "policies": 25,
        "revenue": "3122.50"
      },
      "cancellation": {
        "quotes": 22,
        "policies": 13,
        "revenue": "1623.00"
      }
    },
    "topMetrics": {
      "mostPopularCoverage": "liability",
      "averageParticipantsPerEvent": 49,
      "peakDay": "2025-01-15"
    }
  }
}
```

---

### 6. Earnings

#### GET /api/partner/earnings

Get partner earnings summary (existing endpoint).

#### POST /api/partner/earnings

Report monthly participant numbers (existing endpoint).

---

### 7. Resources

#### GET /api/partner/resources

Get partner resources library (existing endpoint).

#### POST /api/partner/resources

Track resource download (existing endpoint).

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## Rate Limiting

Currently no rate limiting is enforced. This may change in production.

## Pricing Calculation

Premium and commission are calculated as follows:

```javascript
const basePrices = {
  liability: 4.99,
  equipment: 9.99,
  cancellation: 14.99
}

premium = basePrices[coverageType] * participants
commission = premium * 0.5  // 50% commission
```

## Quote Expiration

Quotes expire 30 days after creation by default. The `expiresAt` field indicates when the quote will expire.

## Development Mode

When `AUTH_SECRET` is not configured, the API runs in development mode with mock data. Set `DATABASE_URL` and `AUTH_SECRET` environment variables for production use.

## Migration Guide

To migrate from existing endpoints to the new standardized format:

1. **Profile endpoints** - No changes needed, fully backward compatible
2. **New endpoints** - Add `/products`, `/quotes`, `/policies`, `/analytics` to your integration
3. **Response format** - Update to handle new `{ success: true, data: ... }` format
4. **Pagination** - Use new pagination object for list endpoints
5. **Error handling** - Update to handle standardized error codes

## Examples

### Create a Quote

```bash
curl -X POST https://your-domain.com/api/partner/quotes \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<token>" \
  -d '{
    "eventType": "Rock Climbing Session",
    "eventDate": "2025-03-01",
    "participants": 25,
    "coverageType": "liability",
    "customerEmail": "climber@example.com",
    "customerName": "Alex Johnson"
  }'
```

### Get Analytics

```bash
curl https://your-domain.com/api/partner/analytics?period=90d&metrics=quotes&metrics=revenue \
  -H "Cookie: next-auth.session-token=<token>"
```

### List Policies

```bash
curl "https://your-domain.com/api/partner/policies?page=1&pageSize=50&status=active" \
  -H "Cookie: next-auth.session-token=<token>"
```

## Support

For API support, contact: julian@aiacrobatics.com
