# Voice Agent - Quick Reference Card

## Current Status
✅ API error handling enhanced
✅ Fallback UI implemented
✅ Timeout protection added
✅ Build passing
⚠️ Python agent service not deployed (voice won't work until deployed)

## What Works Now
- Graceful error handling when service unavailable
- 15-second connection timeout
- Automatic fallback to alternative support options
- Clear error messages and codes
- Professional user experience even when voice fails

## What Happens When User Clicks "Let's Talk"

### If Voice Service is Available (After Agent Deployed)
```
1. "Connecting to Sarah..." (spinner)
2. Room created in LiveKit
3. Agent joins room
4. Voice chat active
5. Visual feedback for speaking/listening
```

### If Voice Service is Unavailable (Current State)
```
1. "Connecting to Sarah..." (spinner)
2. API returns error or timeout after 15s
3. Fallback support card displays
4. Shows email, phone, help center options
5. User can get help via alternative methods
```

## Error Codes

| Code | Meaning | What To Do |
|------|---------|------------|
| CONFIG_MISSING | Env vars not set | Check .env.local |
| TIMEOUT | Connection too slow | Check LiveKit service |
| AUTH_ERROR | Bad credentials | Regenerate API keys |
| NETWORK_ERROR | Can't reach service | Check connectivity |
| CONNECTION_ERROR | General failure | Check logs |

## Quick Debug Commands

```bash
# Check if env vars are set
grep LIVEKIT .env.local

# Start dev and watch logs
npm run dev

# Test connection in browser console
# Click "Let's Talk" and look for:
[Voice API] Creating room: voice-support-...
[Voice Agent] Connected

# Or for errors:
[Voice API] Missing LiveKit configuration
[Voice Agent] Connection timeout
```

## Support Contact Info (Shown in Fallback)
- **Email**: support@dailyeventinsurance.com
- **Phone**: 1-800-555-1234
- **Help Center**: /support-hub

## Files to Know

| File | Purpose |
|------|---------|
| `/app/api/voice/realtime/route.ts` | Token generation, room creation |
| `/components/voice/VoiceAgentGlobal.tsx` | Global floating button |
| `/components/voice/FallbackSupportCard.tsx` | Fallback support UI |
| `/app/talk/page.tsx` | Dedicated talk page |
| `VOICE_AGENT_TROUBLESHOOTING.md` | Full troubleshooting guide |

## Next Steps to Make Voice Work

1. **Deploy Python Agent Service**
   - Use Railway, Fly.io, or AWS Lambda
   - Agent must connect to LiveKit Cloud
   - Agent name must be "daily-event-insurance"

2. **Test Agent Connection**
   ```python
   # agent.py
   from livekit import agents

   async def entrypoint(ctx):
       # Your agent logic here
       pass

   if __name__ == "__main__":
       cli.run_app(WorkerOptions(
           entrypoint_fnc=entrypoint,
           agent_name="daily-event-insurance"
       ))
   ```

3. **Verify End-to-End**
   - Click "Let's Talk"
   - Should connect in < 5 seconds
   - Agent should join and respond to voice
   - Verify bidirectional audio works

## Testing Checklist

- [ ] Build passes (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] "Let's Talk" button visible
- [ ] Click shows connecting state
- [ ] Fallback displays after timeout
- [ ] Email link works
- [ ] Phone link works
- [ ] Help center link works
- [ ] No console errors (except expected timeout)
- [ ] Professional error messages shown

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_LIVEKIT_URL=wss://daily-event-insurance-5ne2cmh8.livekit.cloud
LIVEKIT_API_KEY=APIhaSCMQKEq8fA
LIVEKIT_API_SECRET=TOFveKvMk4ofvmoAr0ck1XBeXUbXfYxhQGkB5bOjAY5B
```

## Monitoring What to Watch

1. **Success Rate**: % of connections that work
2. **Connection Time**: Average time to connect
3. **Error Codes**: Most common error types
4. **Fallback Usage**: How often users need fallback
5. **Agent Availability**: Is agent joining rooms?

## Common Questions

**Q: Why doesn't voice work?**
A: Python agent service not deployed yet. Fallback shows alternative support.

**Q: How do I test it?**
A: Click "Let's Talk" - you'll see fallback since agent isn't deployed.

**Q: What if LiveKit is down?**
A: Fallback shows automatically after 15s timeout.

**Q: Can users still get help?**
A: Yes! Email, phone, and help center always available.

**Q: Is this production ready?**
A: Yes for the fallback flow. Voice needs agent deployment.

## Getting Help

- **LiveKit Docs**: https://docs.livekit.io
- **Agent Framework**: https://docs.livekit.io/agents/
- **Internal Docs**: See VOICE_AGENT_TROUBLESHOOTING.md
