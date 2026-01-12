# LiveKit AI Call Center - Implementation Status

**Last Updated:** 2025-01-12  
**PR:** https://github.com/Julianb233/daily-event-insurance/pull/13  
**Branch:** `feature/livekit-call-center`

---

## Overview

AI-powered call center for converting $40 leads to $100+ customers using self-hosted LiveKit.

## Implementation Status

### ✅ Phase 1: Infrastructure & Schema (COMPLETE)

| Task | Status | Files |
|------|--------|-------|
| Leads table | ✅ Done | `lib/db/schema.ts` |
| Lead communications table | ✅ Done | `lib/db/schema.ts` |
| Agent scripts table | ✅ Done | `lib/db/schema.ts` |
| Scheduled actions table | ✅ Done | `lib/db/schema.ts` |
| Conversion events table | ✅ Done | `lib/db/schema.ts` |
| Drizzle migration generated | ✅ Done | `drizzle/0001_shocking_korath.sql` |
| LiveKit Docker setup | ✅ Done | `livekit/docker-compose.yml` |
| LiveKit config | ✅ Done | `livekit/livekit.yaml` |
| Environment template | ✅ Done | `livekit/.env.example` |

### ✅ Phase 2: Voice Agent (COMPLETE)

| Task | Status | Files |
|------|--------|-------|
| Agent entry point | ✅ Done | `agents/agent.py` |
| Lead context tools | ✅ Done | `agents/tools/lead_tools.py` |
| Callback scheduling tools | ✅ Done | `agents/tools/callback_tools.py` |
| Script selection tools | ✅ Done | `agents/tools/script_tools.py` |
| Base system prompt | ✅ Done | `agents/prompts/base_prompt.py` |
| Sample scripts (cold/warm/hot/geo) | ✅ Done | `agents/prompts/scripts.py` |
| Dockerfile | ✅ Done | `agents/Dockerfile` |
| Requirements | ✅ Done | `agents/requirements.txt` |

### ✅ Phase 3: API Routes (COMPLETE)

| Task | Status | Files |
|------|--------|-------|
| List/Create leads | ✅ Done | `app/api/admin/leads/route.ts` |
| Get/Update/Delete lead | ✅ Done | `app/api/admin/leads/[id]/route.ts` |
| Communications endpoint | ✅ Done | `app/api/admin/leads/[id]/communications/route.ts` |
| Initiate call endpoint | ✅ Done | `app/api/admin/leads/[id]/call/route.ts` |
| Send SMS endpoint | ✅ Done | `app/api/admin/leads/[id]/sms/route.ts` |
| Scripts CRUD | ✅ Done | `app/api/admin/scripts/route.ts`, `[id]/route.ts` |

### 🔲 Phase 4: Admin UI (TODO)

| Task | Status | Files |
|------|--------|-------|
| Leads list page | 🔲 Pending | `app/(admin)/admin/leads/page.tsx` |
| Lead detail page | 🔲 Pending | `app/(admin)/admin/leads/[id]/page.tsx` |
| New lead form | 🔲 Pending | `app/(admin)/admin/leads/new/page.tsx` |
| Scripts management | 🔲 Pending | `app/(admin)/admin/scripts/page.tsx` |
| Sidebar updates | 🔲 Pending | `components/admin/AdminSidebar.tsx` |

### 🔲 Phase 5: Scheduling & Cron (TODO)

| Task | Status | Files |
|------|--------|-------|
| Scheduled actions processor | 🔲 Pending | `lib/cron/process-scheduled-actions.ts` |
| Vercel cron config | 🔲 Pending | `vercel.json` |
| Follow-up automation | 🔲 Pending | - |

### 🔲 Phase 6: Analytics (TODO)

| Task | Status | Files |
|------|--------|-------|
| Conversion event logger | 🔲 Pending | `lib/analytics/conversion.ts` |
| Lead value calculator | 🔲 Pending | - |
| Analytics dashboard | 🔲 Pending | `app/(admin)/admin/call-center/analytics/page.tsx` |

---

## Quick Start

### 1. Apply Database Migrations
```bash
cd /root/daily-event-insurance
npx drizzle-kit push
```

### 2. Start LiveKit Infrastructure
```bash
cd livekit
cp .env.example .env
# Edit .env with your API keys
docker-compose up -d
```

### 3. Run Voice Agent
```bash
cd agents
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python agent.py dev
```

### 4. Test API Endpoints
```bash
# Create a lead
curl -X POST http://localhost:3000/api/admin/leads \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@gym.com","phone":"555-1234","source":"website_quote","businessType":"gym"}'

# List leads
curl http://localhost:3000/api/admin/leads
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│  (Next.js 16 + React 19 + Tailwind CSS 4)                   │
├─────────────────────────────────────────────────────────────┤
│                       API Routes                             │
│  /api/admin/leads  /api/admin/scripts  /api/webhooks        │
├─────────────────────────────────────────────────────────────┤
│                    Neon PostgreSQL                           │
│  leads | lead_communications | agent_scripts | etc.          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   LiveKit (Self-Hosted)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Server  │  │   SIP    │  │  Agent   │  │  Redis   │    │
│  │  :7880   │  │  :5060   │  │ (Python) │  │  :6379   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               Twilio/Telnyx SIP Trunk                        │
│            (Inbound & Outbound Calls)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Cost Estimates

| Component | Monthly Cost |
|-----------|-------------|
| LiveKit (self-hosted) | ~$50 (VPS) |
| OpenAI API (GPT-4o + TTS) | ~$100/1000 calls |
| Deepgram STT | ~$50/1000 calls |
| Twilio SIP | ~$0.015/min |
| **Total** | ~$200-500/month |

vs. Human call center: ~$2000+/month

---

## Next Steps

1. **Merge PR #13** after review
2. **Complete Admin UI** (Phase 4)
3. **Set up Cron Jobs** (Phase 5)
4. **Build Analytics Dashboard** (Phase 6)
5. **Production Deployment** - Configure Vercel + LiveKit VPS
