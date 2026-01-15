# Daily Event Insurance - AI Call Center

## What This Is

A B2B embedded insurance platform enabling gyms, climbing facilities, and rental businesses to offer same-day coverage to their members. The AI Call Center component transforms $40 leads into $100+ converted customers using LiveKit-powered voice agents, automated outbound calling, SMS communication, and real-time conversion tracking.

## Core Value

**Convert leads to partners through AI-powered voice engagement** — automated calling, personalized scripts, and intelligent follow-ups that achieve 40%+ conversion rates at 80% lower cost than human call centers.

## Requirements

### Validated

- ✓ LiveKit call center UI with voice/chat — existing `/app/call-center/page.tsx`
- ✓ Admin leads list page with filtering — existing `/app/(admin)/admin/leads/page.tsx`
- ✓ Lead management API routes — existing `/api/admin/leads/`
- ✓ Agent scripts API — existing `/api/admin/scripts/`
- ✓ Voice agent Python backend — existing `/livekit-agent/`
- ✓ Database schema for leads, communications, scripts — existing in Drizzle

### Active

- [ ] REQ-01: Admin UI for managing agent scripts (CRUD)
- [ ] REQ-02: Outbound call initiation from lead detail page
- [ ] REQ-03: SMS integration with Twilio for lead communication
- [ ] REQ-04: Scheduled actions processor (cron) for automated follow-ups
- [ ] REQ-05: Conversion analytics dashboard with $40→$100 tracking
- [ ] REQ-06: GHL CRM integration with workflows and pipelines
- [ ] REQ-07: Lead detail page with communication history and call player
- [ ] REQ-08: Partner integration support chat widget
- [ ] REQ-09: Screen recording for onboarding assistance
- [ ] REQ-10: Knowledge base with semantic search for support agents

### Out of Scope

- Human call center features — AI-first approach
- Customer-facing policy support — this is partner/lead focused
- Mobile native apps — web-first for MVP

## Context

**Existing Codebase:**
- Next.js 16 + React 19 + TypeScript
- Supabase PostgreSQL with Drizzle ORM
- LiveKit for WebRTC voice communication
- Stripe for payments
- 72 API routes, 160 components already built

**PRD Documents:**
- `docs/PRD-LIVEKIT-CALL-CENTER.md` — Technical implementation (42 hours)
- `docs/PRD-CALL-CENTER.json` — GHL CRM setup (35 hours)
- `docs/PRD-CUSTOMER-SUPPORT-AGENT.md` — Partner support (48 hours)

**Key Metrics Targets:**
- Lead Value: $40 → $100+ (150% increase)
- Conversion Rate: 40%+ of contacted leads
- Response Time: < 5 minutes for new leads
- Cost Reduction: 80% vs human call center

## Constraints

- **Tech Stack**: Next.js 16, React 19, TypeScript, Supabase, LiveKit — already established
- **Voice Provider**: LiveKit self-hosted + Twilio SIP trunk
- **CRM**: GoHighLevel for workflows and lead management
- **AI Models**: OpenAI GPT-4o for voice agent, embeddings for search
- **Deployment**: Vercel for web, VPS for LiveKit/voice agent

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| LiveKit over Twilio Voice | Self-hosted control, lower costs at scale | — Pending |
| GHL for CRM | User already has GHL, native automation | — Pending |
| AI-first support | 80% cost reduction, 24/7 availability | — Pending |
| Supabase Realtime for chat | Already using Supabase, reduces complexity | — Pending |

---
*Last updated: 2025-01-15 after GSD initialization*
