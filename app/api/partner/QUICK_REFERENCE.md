# Partner API Quick Reference

## Endpoints at a Glance

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/partner/profile` | GET | Get partner profile | ✅ Existing |
| `/api/partner/profile` | PATCH | Update profile | ✅ Existing |
| `/api/partner/products` | GET | List products | ✨ New |
| `/api/partner/quotes` | POST | Create quote | ✨ New |
| `/api/partner/quotes` | GET | List quotes | ✨ New |
| `/api/partner/policies` | GET | List policies | ✨ New |
| `/api/partner/policies/:id` | GET | Get policy details | ✨ New |
| `/api/partner/analytics` | GET | Get analytics | ✨ New |
| `/api/partner/earnings` | GET | Get earnings | ✅ Existing |
| `/api/partner/earnings` | POST | Report earnings | ✅ Existing |
| `/api/partner/resources` | GET | List resources | ✅ Existing |

## Common Request Patterns

### Create a Quote (Most Common)

```bash
POST /api/partner/quotes
Content-Type: application/json

{
  "eventType": "Gym Session",
  "eventDate": "2025-03-15",
  "participants": 50,
  "coverageType": "liability",
  "customerEmail": "customer@example.com"
}
```

### List Policies with Filters

```bash
GET /api/partner/policies?status=active&pageSize=50
```

### Get Analytics for Last 90 Days

```bash
GET /api/partner/analytics?period=90d
```

## Quick Validation Rules

| Field | Type | Validation | Example |
|-------|------|------------|---------|
| eventType | string | 2-100 chars | "Gym Session" |
| eventDate | date | Future date | "2025-03-15" |
| participants | number | 1-10,000 | 50 |
| coverageType | enum | liability/equipment/cancellation | "liability" |
| page | number | >= 1 | 1 |
| pageSize | number | 1-100 | 20 |

## Coverage Types & Pricing

| Type | Base Price | Common Use |
|------|-----------|-----------|
| liability | $4.99/person | General events |
| equipment | $9.99/person | Equipment rental |
| cancellation | $14.99/person | Event cancellation |

**Formula**: `premium = basePrice * participants`
**Commission**: 50% of premium

## Status Values

### Quote Status
- `pending` - Awaiting customer decision
- `accepted` - Customer accepted quote
- `declined` - Customer declined quote
- `expired` - Quote passed expiration date

### Policy Status
- `active` - Policy is active
- `expired` - Policy has expired
- `cancelled` - Policy was cancelled
- `pending` - Policy pending activation

## Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 201 | Created | Resource created successfully |
| 400 | Validation Error | Check request body |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Check resource ID |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Contact support |
| 503 | Service Unavailable | Database not configured |

## Error Response Format

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid quote data",
  "code": "VALIDATION_ERROR",
  "details": {
    "eventDate": ["Required"],
    "participants": ["Must be at least 1"]
  }
}
```

## Pagination Pattern

All list endpoints support pagination:

```bash
?page=1&pageSize=20
```

Response includes:

```json
{
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

## Date Filtering

Most list endpoints support date filtering:

```bash
?startDate=2025-01-01&endDate=2025-03-31
```

## Development Mode

When `AUTH_SECRET` is not set:
- Authentication bypassed
- Mock data returned
- Perfect for frontend dev
- No database required

## Environment Variables

```bash
DATABASE_URL=postgresql://...     # Required for production
AUTH_SECRET=random-secret         # Required for production
```

## Common Errors & Solutions

### "Partner not found"
- **Cause**: User not linked to partner profile
- **Solution**: Create partner profile via onboarding

### "Database not configured"
- **Cause**: DATABASE_URL not set
- **Solution**: Set DATABASE_URL environment variable

### "Validation error"
- **Cause**: Invalid request data
- **Solution**: Check error.details for specific field errors

### "Unauthorized"
- **Cause**: Not authenticated or session expired
- **Solution**: Login again

### "Forbidden"
- **Cause**: Not a partner user
- **Solution**: Ensure user has partner or admin role

## Testing Commands

```bash
# Get products
curl http://localhost:3000/api/partner/products

# Create quote
curl -X POST http://localhost:3000/api/partner/quotes \
  -H "Content-Type: application/json" \
  -d '{"eventType":"Test","eventDate":"2025-03-01","participants":10,"coverageType":"liability"}'

# List policies
curl http://localhost:3000/api/partner/policies?page=1

# Get analytics
curl http://localhost:3000/api/partner/analytics?period=30d
```

## Rate Limits

Currently: **No rate limiting** (coming soon)
Recommended: Max 100 requests/minute per partner

## Support

- **Documentation**: `/app/api/partner/README.md`
- **Testing Guide**: `/app/api/partner/TESTING.md`
- **Contact**: julian@aiacrobatics.com

## Version

**Current Version**: 1.0.0
**Last Updated**: 2025-01-28
