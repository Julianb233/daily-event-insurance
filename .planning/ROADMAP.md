# Roadmap: Daily Event Insurance - AI Call Center

## Overview

Build a complete AI-powered call center system that converts leads to partners through automated voice engagement, SMS, and intelligent follow-ups. The journey starts with infrastructure verification, then builds out the admin UI, integrates GHL CRM, adds partner support features, and culminates in analytics and optimization.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Infrastructure Verification** - Verify existing schema and LiveKit setup ✅
- [x] **Phase 2: Admin Scripts UI** - Build script management interface ✅
- [x] **Phase 3: Lead Management Enhancement** - Lead detail page with calling/SMS ✅
- [ ] **Phase 4: GHL CRM Integration** - Workflows, pipelines, and email templates
- [ ] **Phase 5: Scheduled Actions** - Cron processor for automated follow-ups
- [ ] **Phase 6: Partner Support Agent** - Chat widget and integration assistance
- [ ] **Phase 7: Analytics Dashboard** - Conversion tracking and reporting

## Phase Details

### Phase 1: Infrastructure Verification
**Goal**: Verify existing database schema and LiveKit infrastructure are complete per PRD specs
**Depends on**: Nothing (first phase)
**Requirements**: Foundation for all other phases
**Success Criteria** (what must be TRUE):
  1. All PRD database tables exist (leads, lead_communications, agent_scripts, scheduled_actions, conversion_events)
  2. LiveKit connection working with existing call center page
  3. API routes for leads, scripts, communications all functional
**Research**: Unlikely (verification only)
**Plans**: 2 plans

Plans:
- [x] 01-01: Verify database schema completeness against PRD ✅
- [x] 01-02: Test LiveKit and API endpoints functionality ✅

### Phase 2: Admin Scripts UI
**Goal**: Create admin interface for managing AI agent scripts (CRUD operations)
**Depends on**: Phase 1
**Requirements**: REQ-01
**Success Criteria** (what must be TRUE):
  1. Admin can view list of all agent scripts
  2. Admin can create new scripts with system prompt, opening/closing scripts, objection handlers
  3. Admin can edit and delete existing scripts
  4. Scripts can be targeted by business type, interest level, region
**Research**: Unlikely (standard CRUD UI)
**Plans**: 2 plans

Plans:
- [x] 02-01: Build scripts list page with DataTable ✅
- [x] 02-02: Build script editor with form validation ✅

### Phase 3: Lead Management Enhancement
**Goal**: Enhance lead detail page with communication history, call initiation, and SMS
**Depends on**: Phase 1, Phase 2
**Requirements**: REQ-02, REQ-03, REQ-07
**Success Criteria** (what must be TRUE):
  1. Lead detail page shows full communication history (calls, SMS, emails)
  2. Admin can initiate outbound call to lead from detail page
  3. Admin can send SMS to lead with template selection
  4. Call recordings playable in communication history
  5. Real-time status updates during active calls
**Research**: Likely (Twilio SMS integration)
**Research topics**: Twilio SMS API, webhook handling
**Plans**: 4 plans

Plans:
- [x] 03-01: Build lead detail page with communication timeline ✅
- [x] 03-02: Implement call initiation with LiveKit ✅
- [x] 03-03: Integrate Twilio SMS send/receive ✅
- [x] 03-04: Add call recording player component ✅

### Phase 4: GHL CRM Integration
**Goal**: Connect GoHighLevel CRM with automated workflows and pipelines
**Depends on**: Phase 3
**Requirements**: REQ-06
**Success Criteria** (what must be TRUE):
  1. New leads automatically sync to GHL with proper tags
  2. Call dispositions trigger correct GHL workflow actions
  3. Partner Acquisition pipeline stages update based on lead status
  4. Email templates (Welcome, Onboarding, Outreach) configured and sending
  5. SLA tracking workflows alerting on missed response times
**Research**: Likely (GHL API integration)
**Research topics**: GHL API authentication, webhook setup, workflow triggers
**Plans**: 4 plans

Plans:
- [ ] 04-01: Set up GHL API connection and lead sync
- [ ] 04-02: Configure pipelines and tags
- [ ] 04-03: Build workflow triggers for call dispositions
- [ ] 04-04: Create and test email templates

### Phase 5: Scheduled Actions Processor
**Goal**: Implement cron-based processor for automated follow-ups and reminders
**Depends on**: Phase 3, Phase 4
**Requirements**: REQ-04
**Success Criteria** (what must be TRUE):
  1. Scheduled actions table populated from call outcomes
  2. Cron job processes pending actions (calls, SMS, emails)
  3. Failed actions retry with exponential backoff
  4. Admin can view and manage scheduled actions queue
**Research**: Unlikely (standard cron patterns)
**Plans**: 2 plans

Plans:
- [ ] 05-01: Build scheduled actions processor service
- [ ] 05-02: Create admin queue management UI

### Phase 6: Partner Support Agent
**Goal**: AI-powered chat widget for partner integration assistance
**Depends on**: Phase 1
**Requirements**: REQ-08, REQ-09, REQ-10
**Success Criteria** (what must be TRUE):
  1. Chat widget embeddable in partner portal
  2. AI agent answers integration questions using knowledge base
  3. Screen recording available for onboarding assistance
  4. Escalation to human support when AI cannot resolve
  5. Admin dashboard shows support conversations and metrics
**Research**: Likely (RAG/vector search, screen recording)
**Research topics**: Pinecone/embedding setup, rrweb integration
**Plans**: 4 plans

Plans:
- [ ] 06-01: Build chat infrastructure with Supabase Realtime
- [ ] 06-02: Create AI support agent with tool functions
- [ ] 06-03: Implement screen recording with rrweb
- [ ] 06-04: Build knowledge base with semantic search

### Phase 7: Analytics Dashboard
**Goal**: Conversion tracking and performance analytics for call center operations
**Depends on**: Phase 3, Phase 4, Phase 5
**Requirements**: REQ-05
**Success Criteria** (what must be TRUE):
  1. Dashboard shows $40→$100 conversion funnel
  2. Lead value tracking with attribution
  3. Agent performance metrics (calls, conversions, avg handle time)
  4. Response time and SLA compliance reporting
  5. Exportable reports for stakeholders
**Research**: Unlikely (aggregation queries)
**Plans**: 2 plans

Plans:
- [ ] 07-01: Build conversion funnel and metrics API
- [ ] 07-02: Create analytics dashboard UI with charts

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure Verification | 2/2 | ✅ Complete | 2025-01-15 |
| 2. Admin Scripts UI | 2/2 | ✅ Complete | 2025-01-15 |
| 3. Lead Management Enhancement | 4/4 | ✅ Complete | 2025-01-15 |
| 4. GHL CRM Integration | 0/4 | Not started | - |
| 5. Scheduled Actions Processor | 0/2 | Not started | - |
| 6. Partner Support Agent | 0/4 | Not started | - |
| 7. Analytics Dashboard | 0/2 | Not started | - |

**Total: 7 phases, 20 plans**
