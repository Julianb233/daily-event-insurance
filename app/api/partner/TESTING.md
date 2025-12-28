# Partner API Testing Guide

## Prerequisites

1. Ensure the app is running:
   ```bash
   npm run dev
   ```

2. For development mode (mock data), ensure `AUTH_SECRET` is NOT set
3. For production mode, set both `DATABASE_URL` and `AUTH_SECRET`

## Authentication

In development mode, authentication is bypassed. In production, you need a valid session.

### Get Session Cookie (Production)

```bash
# Sign in and capture cookie
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "partner@example.com",
    "password": "your-password"
  }' \
  -c cookies.txt
```

## Test Endpoints

### 1. Test Profile

```bash
# GET profile
curl http://localhost:3000/api/partner/profile \
  -b cookies.txt

# Expected: Partner profile with products
```

### 2. Test Products

```bash
# GET all products
curl http://localhost:3000/api/partner/products \
  -b cookies.txt

# GET enabled products only
curl "http://localhost:3000/api/partner/products?enabled=true" \
  -b cookies.txt

# Expected:
{
  "success": true,
  "data": {
    "products": [...],
    "summary": {
      "total": 3,
      "enabled": 2,
      "disabled": 1
    }
  }
}
```

### 3. Test Create Quote

```bash
# Create a quote
curl -X POST http://localhost:3000/api/partner/quotes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "eventType": "Gym Session",
    "eventDate": "2025-03-15",
    "participants": 50,
    "coverageType": "liability",
    "eventDetails": {
      "location": "Downtown Gym",
      "duration": 2,
      "description": "Group fitness class"
    },
    "customerEmail": "customer@example.com",
    "customerName": "Jane Smith"
  }'

# Expected:
{
  "success": true,
  "data": {
    "quote": {
      "id": "...",
      "quoteNumber": "QT-20250315-XXXXX",
      "premium": "249.50",
      "commission": "124.75",
      "status": "pending",
      ...
    }
  },
  "message": "Quote created successfully"
}
```

### 4. Test List Quotes

```bash
# GET all quotes (page 1)
curl http://localhost:3000/api/partner/quotes \
  -b cookies.txt

# GET with filters
curl "http://localhost:3000/api/partner/quotes?page=1&pageSize=10&status=pending&coverageType=liability" \
  -b cookies.txt

# Expected:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 15,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 5. Test List Policies

```bash
# GET all policies
curl http://localhost:3000/api/partner/policies \
  -b cookies.txt

# GET active policies only
curl "http://localhost:3000/api/partner/policies?status=active&pageSize=50" \
  -b cookies.txt

# GET policies by date range
curl "http://localhost:3000/api/partner/policies?startDate=2025-01-01&endDate=2025-03-31" \
  -b cookies.txt

# Expected: Paginated list of policies
```

### 6. Test Policy Details

```bash
# GET specific policy (replace with actual policy ID)
curl http://localhost:3000/api/partner/policies/550e8400-e29b-41d4-a716-446655440000 \
  -b cookies.txt

# Expected:
{
  "success": true,
  "data": {
    "policy": {
      "id": "...",
      "policyNumber": "POL-20250315-00001",
      "eventDetails": {
        "location": "Downtown Gym",
        "duration": 2
      },
      "metadata": {...},
      ...
    }
  }
}
```

### 7. Test Analytics

```bash
# GET 30-day analytics
curl http://localhost:3000/api/partner/analytics \
  -b cookies.txt

# GET 90-day analytics with specific metrics
curl "http://localhost:3000/api/partner/analytics?period=90d&metrics=quotes&metrics=policies&metrics=revenue" \
  -b cookies.txt

# GET year-to-date analytics
curl "http://localhost:3000/api/partner/analytics?period=ytd" \
  -b cookies.txt

# Expected:
{
  "success": true,
  "data": {
    "period": "30d",
    "summary": {
      "totalQuotes": 150,
      "totalPolicies": 98,
      "totalRevenue": "12245.50",
      "conversionRate": "65.33",
      ...
    },
    "byProduct": {...},
    "topMetrics": {...}
  }
}
```

### 8. Test Earnings (Existing Endpoint)

```bash
# GET earnings
curl http://localhost:3000/api/partner/earnings \
  -b cookies.txt

# GET earnings for specific year
curl "http://localhost:3000/api/partner/earnings?year=2024" \
  -b cookies.txt
```

### 9. Test Resources (Existing Endpoint)

```bash
# GET all resources
curl http://localhost:3000/api/partner/resources \
  -b cookies.txt

# GET resources by category
curl "http://localhost:3000/api/partner/resources?category=marketing" \
  -b cookies.txt
```

## Error Testing

### Test Validation Errors

```bash
# Invalid quote - missing required fields
curl -X POST http://localhost:3000/api/partner/quotes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "eventType": "Gym Session"
  }'

# Expected: 400 with validation errors
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid quote data",
  "details": {
    "eventDate": ["Required"],
    "participants": ["Required"],
    "coverageType": ["Required"]
  }
}
```

### Test Not Found

```bash
# Invalid policy ID
curl http://localhost:3000/api/partner/policies/00000000-0000-0000-0000-000000000000 \
  -b cookies.txt

# Expected: 404
{
  "success": false,
  "error": "Not Found",
  "message": "Policy not found",
  "code": "NOT_FOUND"
}
```

### Test Invalid Parameters

```bash
# Invalid page size
curl "http://localhost:3000/api/partner/quotes?pageSize=500" \
  -b cookies.txt

# Expected: 400 validation error
```

## Postman Collection

Import this collection into Postman for easier testing:

```json
{
  "info": {
    "name": "Daily Event Insurance - Partner API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/partner/profile"
      }
    },
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/partner/products"
      }
    },
    {
      "name": "Create Quote",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "{{baseUrl}}/api/partner/quotes",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"eventType\": \"Gym Session\",\n  \"eventDate\": \"2025-03-15\",\n  \"participants\": 50,\n  \"coverageType\": \"liability\",\n  \"customerEmail\": \"test@example.com\"\n}"
        }
      }
    },
    {
      "name": "List Quotes",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/partner/quotes?page=1&pageSize=20",
          "query": [
            {"key": "page", "value": "1"},
            {"key": "pageSize", "value": "20"}
          ]
        }
      }
    },
    {
      "name": "List Policies",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/partner/policies"
      }
    },
    {
      "name": "Get Policy Details",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/partner/policies/{{policyId}}"
      }
    },
    {
      "name": "Get Analytics",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/partner/analytics?period=30d",
          "query": [{"key": "period", "value": "30d"}]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

## Development Mode Testing

In development mode (no `AUTH_SECRET`), all endpoints return mock data. This is perfect for:

1. Frontend development without database setup
2. Testing API contract before backend is ready
3. Demo/presentation environments
4. CI/CD pipeline testing

## Production Testing Checklist

- [ ] All endpoints return correct status codes
- [ ] Pagination works correctly
- [ ] Filters apply properly
- [ ] Validation catches all invalid inputs
- [ ] Error messages are helpful
- [ ] Authentication is enforced
- [ ] Only partner's data is accessible
- [ ] Date ranges work correctly
- [ ] JSON parsing works for nested fields
- [ ] Performance is acceptable (< 500ms for most requests)

## Load Testing

Use Apache Bench or similar:

```bash
# Test quote creation endpoint
ab -n 100 -c 10 -p quote.json -T application/json \
  http://localhost:3000/api/partner/quotes

# Test list endpoint
ab -n 1000 -c 50 \
  http://localhost:3000/api/partner/policies
```

## Next Steps

1. Set up proper database with migrations
2. Add rate limiting
3. Add request logging
4. Set up monitoring/alerting
5. Add integration tests
6. Document webhook endpoints
7. Add API versioning if needed
