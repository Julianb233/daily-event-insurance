# Voice Agent Troubleshooting Guide

## Overview

The voice agent uses LiveKit for real-time voice communication. When a user clicks "Let's Talk", the system:

1. Fetches a token from `/api/voice/realtime`
2. Creates a LiveKit room
3. Dispatches a Python agent named "daily-event-insurance" to join the room
4. Connects the user to the room for voice chat

## Common Issues & Solutions

### 1. Voice Agent Doesn't Talk

**Symptoms:**
- Button clicks but nothing happens
- Loading spinner stays indefinitely
- "Waiting for agent to join..." message persists

**Possible Causes:**
- Python agent service is not running
- Agent dispatch fails
- LiveKit configuration issues

**Solutions:**

#### Check Python Agent Service
The Python agent needs to be deployed and running. Check:
```bash
# If using a dedicated agent service, verify it's running
# The agent should be listening for dispatch requests
```

#### Verify LiveKit Configuration
Check `.env.local` has:
```bash
NEXT_PUBLIC_LIVEKIT_URL=wss://daily-event-insurance-5ne2cmh8.livekit.cloud
LIVEKIT_API_KEY=APIhaSCMQKEq8fA
LIVEKIT_API_SECRET=TOFveKvMk4ofvmoAr0ck1XBeXUbXfYxhQGkB5bOjAY5B
```

#### Test LiveKit Connection
```bash
# View API logs
npm run dev

# Open browser console when clicking "Let's Talk"
# Look for errors like:
# - [Voice API] Room creation failed
# - [Voice API] Agent dispatch error
# - [Voice Agent] Connection timeout
```

### 2. Connection Timeout

**Symptoms:**
- "Connection is taking too long" message
- Shows fallback support options

**Cause:**
- LiveKit service is unreachable
- Network connectivity issues
- API credentials are invalid

**Solutions:**
1. Verify LiveKit Cloud service is active at https://cloud.livekit.io
2. Check network connectivity
3. Regenerate API credentials if needed

### 3. Agent Dispatch Fails

**Symptoms:**
- Warning: "Voice agent may not be available"
- Room connects but no voice response

**Cause:**
- Python agent service is not deployed or not running
- Agent name mismatch (should be "daily-event-insurance")

**Solutions:**

#### Deploy Python Agent
The agent needs to be deployed to a service that can:
1. Connect to LiveKit Cloud
2. Listen for agent dispatch requests
3. Join rooms and handle voice interactions

Typical agent code structure:
```python
from livekit import agents, rtc
from livekit.agents import JobContext, WorkerOptions, cli

async def entrypoint(ctx: JobContext):
    # Initialize voice assistant
    # Connect to room
    # Handle voice interactions
    pass

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="daily-event-insurance"  # Must match dispatch name
        )
    )
```

### 4. Configuration Missing

**Symptoms:**
- Immediate error: "Voice service temporarily unavailable"
- Error code: CONFIG_MISSING

**Cause:**
- Missing environment variables

**Solution:**
Ensure `.env.local` has all required variables:
```bash
NEXT_PUBLIC_LIVEKIT_URL=wss://...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
```

## Error Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| CONFIG_MISSING | Environment variables not set | Add missing variables to `.env.local` |
| TIMEOUT | Connection took too long | Check LiveKit service status |
| AUTH_ERROR | Invalid credentials | Verify API key and secret |
| NETWORK_ERROR | Network connectivity issue | Check internet connection |
| CONNECTION_ERROR | General connection failure | Check logs for details |

## Debugging Tools

### Browser Console
Look for log messages prefixed with:
- `[Voice API]` - Server-side API logs
- `[Voice Agent]` - Client-side component logs
- `[Talk Page]` - Talk page specific logs

### Network Tab
Check the `/api/voice/realtime` request:
- Status should be 200 for success
- Response should include `token`, `roomName`, `agentDispatched`
- Status 503 indicates service unavailable

### LiveKit Console
Visit https://cloud.livekit.io to:
- View active rooms
- Check agent connections
- Monitor usage and errors

## Fallback Support

When the voice agent is unavailable, users see:

1. **Fallback Support Card** with:
   - Email support link
   - Phone support number
   - Help center link

2. **Graceful Degradation**:
   - Connection timeout after 15 seconds
   - Automatic fallback display
   - Clear error messages

## Testing

### Test Connection Flow
```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Click "Let's Talk" button
# Check console for logs

# Expected success flow:
# 1. [Voice Agent] Connecting to Sarah...
# 2. [Voice API] Creating room: voice-support-...
# 3. [Voice API] Created room successfully
# 4. [Voice API] Dispatched agent daily-event-insurance
# 5. [Voice Agent] Connected
```

### Test Error Handling
```bash
# Temporarily break configuration
# Remove LIVEKIT_API_KEY from .env.local
# Click "Let's Talk"
# Should show: "Voice service temporarily unavailable"
# Should display fallback support options
```

## Production Deployment Checklist

- [ ] LiveKit Cloud account active
- [ ] Environment variables set in Vercel
- [ ] Python agent service deployed
- [ ] Agent name matches "daily-event-insurance"
- [ ] Test voice connection end-to-end
- [ ] Verify fallback support links are correct
- [ ] Monitor LiveKit usage and billing
- [ ] Set up error tracking (Sentry, etc.)

## Next Steps for Full Implementation

1. **Deploy Python Agent**
   - Choose hosting (Railway, Fly.io, AWS Lambda)
   - Configure to connect to LiveKit Cloud
   - Deploy with proper credentials
   - Set up health checks and monitoring

2. **Test Agent Functionality**
   - Verify agent joins rooms
   - Test voice recognition
   - Test voice synthesis
   - Verify context-aware responses

3. **Monitor Performance**
   - Track connection success rate
   - Monitor average connection time
   - Log agent errors
   - Set up alerts for failures

4. **Enhance User Experience**
   - Add transcript display
   - Show suggested questions
   - Implement feedback collection
   - Track satisfaction metrics

## Support Contacts

For LiveKit issues:
- Documentation: https://docs.livekit.io
- Support: https://livekit.io/support

For agent development:
- LiveKit Agents: https://docs.livekit.io/agents/overview/
