# Cron Jobs Documentation

This document describes the scheduled cron jobs configured for the Daily Event Insurance application.

## Overview

The application uses Vercel Cron Jobs to execute scheduled tasks. All cron jobs are configured in `vercel.json` and require proper authentication.

## Security

### CRON_SECRET Environment Variable

All cron endpoints are protected by the `CRON_SECRET` environment variable. This prevents unauthorized access to the cron endpoints.

**Setup:**
1. Generate a secure random string (minimum 32 characters recommended)
2. Add `CRON_SECRET` to your Vercel environment variables
3. Vercel automatically includes the secret in the `Authorization` header when calling cron endpoints

**Local Testing:**
```bash
# Test cron endpoint locally
curl -X GET http://localhost:3000/api/cron/process-actions \
  -H "Authorization: Bearer your-cron-secret-here"
```

## Configured Cron Jobs

### 1. Process Scheduled Actions

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/cron/process-actions` |
| **Schedule** | `*/5 * * * *` (every 5 minutes) |
| **Source File** | `app/api/cron/process-actions/route.ts` |

**Purpose:**
Processes pending scheduled actions for lead follow-ups including:
- Outbound calls (LiveKit integration - pending)
- SMS messages (Twilio integration - pending)
- Email communications (email service integration - pending)

**Behavior:**
- Queries `scheduled_actions` table for pending actions where `scheduledFor <= now`
- Processes up to 100 actions per execution to avoid timeouts
- Implements exponential backoff for failed actions:
  - Base delay: 5 minutes
  - Maximum delay: 2 hours
  - 10% jitter to prevent thundering herd
- Default maximum retry attempts: 3

**Response Example:**
```json
{
  "success": true,
  "message": "Scheduled actions processing completed",
  "data": {
    "totalProcessed": 15,
    "completed": 12,
    "failed": 1,
    "retryScheduled": 2,
    "timestamp": "2024-01-15T00:05:00.000Z",
    "durationMs": 1523
  }
}
```

### 2. Expire Quotes

| Property | Value |
|----------|-------|
| **Endpoint** | `/api/cron/expire-quotes` |
| **Schedule** | `0 0 * * *` (daily at midnight UTC) |
| **Source File** | `app/api/cron/expire-quotes/route.ts` |

**Purpose:**
Automatically expires old insurance quotes that have passed their expiration date.

**Behavior:**
- Batch updates quotes where `expiresAt < now` and status is still active
- Updates quote status to "expired"
- Logs processing statistics

**Response Example:**
```json
{
  "success": true,
  "message": "Quote expiration processing completed",
  "data": {
    "expired": 45,
    "errors": 0,
    "timestamp": "2024-01-15T00:00:00.000Z"
  }
}
```

## Cron Schedule Reference

| Expression | Description |
|------------|-------------|
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour at minute 0 |
| `0 0 * * *` | Daily at midnight UTC |
| `0 2 * * *` | Daily at 2:00 AM UTC |
| `0 0 * * 0` | Weekly on Sunday at midnight UTC |
| `0 0 1 * *` | Monthly on the 1st at midnight UTC |

## Vercel Cron Limits

Vercel has the following limits for cron jobs:

| Plan | Max Cron Jobs | Minimum Interval |
|------|---------------|------------------|
| Hobby | 2 | 1 day |
| Pro | 40 | 1 minute |
| Enterprise | Custom | Custom |

**Note:** The current configuration requires a Pro plan or higher due to the 5-minute interval on process-actions.

## Manual Triggering

Both endpoints support POST requests for manual triggering:

```bash
# Trigger process-actions manually
curl -X POST https://your-domain.vercel.app/api/cron/process-actions \
  -H "Authorization: Bearer $CRON_SECRET"

# Trigger expire-quotes manually
curl -X POST https://your-domain.vercel.app/api/cron/expire-quotes \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Monitoring

### Logs
All cron jobs log their execution to Vercel's logging system with the following prefixes:
- `[ProcessActions]` - For scheduled actions processing
- `[Cron]` - For quote expiration processing

### Recommended Monitoring Setup
1. Enable Vercel Log Drains to forward logs to your monitoring system
2. Set up alerts for:
   - High failure rates in process-actions
   - Cron job execution failures
   - Unusual processing durations

## Troubleshooting

### Common Issues

**1. "Unauthorized" responses**
- Verify `CRON_SECRET` is set in Vercel environment variables
- Ensure the secret matches between environment and request header

**2. Database connection errors**
- Check `DATABASE_URL` environment variable is configured
- Verify database is accessible from Vercel's servers

**3. Timeout errors**
- process-actions limits to 100 actions per execution
- Consider reducing batch size if timeouts persist
- Check for slow database queries

**4. Actions stuck in "processing" status**
- May indicate a previous execution crashed
- Manually reset to "pending" status if needed:
```sql
UPDATE scheduled_actions
SET status = 'pending'
WHERE status = 'processing'
AND updated_at < NOW() - INTERVAL '1 hour';
```

## Future Enhancements

- [ ] Add health check endpoint for monitoring
- [ ] Implement dead letter queue for permanently failed actions
- [ ] Add metrics collection for processing statistics
- [ ] Configure alerting for consecutive failures
