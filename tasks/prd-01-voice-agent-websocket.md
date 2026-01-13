# PRD: Voice Agent with WebSocket Real-Time Communication

## Introduction

The Voice Agent System enables real-time voice and video communication between customers, partners, and insurance agents. Built on LiveKit's WebSocket infrastructure, this feature provides instant voice consultations for insurance quotes, claims support, and partner onboarding. The system includes AI-powered voice assistants for 24/7 automated support and seamless handoff to human agents when needed.

## Goals

- Enable real-time voice/video consultations with < 200ms latency
- Provide 24/7 AI voice assistant for basic inquiries
- Reduce quote-to-purchase time by enabling live consultations
- Support claims video evidence submission
- Enable partner training via video sessions
- Maintain recording and transcription for compliance
- Seamless handoff between AI assistant and human agents

## Target Users

1. **Customers**: Seeking quotes, filing claims, getting support
2. **Partners**: Receiving training, getting onboarding support
3. **Insurance Agents**: Conducting consultations, processing claims
4. **AI Voice Assistant**: Handling initial intake and simple queries
5. **Admins**: Reviewing recordings, monitoring quality

## User Stories

### US-001: Initialize Voice Consultation Room
**Description:** As a customer, I want to start a voice consultation so I can speak with an agent about my insurance needs.

**Acceptance Criteria:**
- [ ] "Talk to Agent" button visible on quote page
- [ ] Click creates LiveKit room via POST /api/livekit/consultation
- [ ] Room name format: consultation_{type}_{timestamp}_{randomId}
- [ ] Returns room token for customer
- [ ] WebSocket connection established with LiveKit server
- [ ] Loading state shown during connection
- [ ] Error handling for failed connections
- [ ] npm run build passes
- [ ] Verify in browser using dev-browser skill

### US-002: Generate Room Access Token
**Description:** As the system, I need to generate secure tokens so participants can join rooms safely.

**Acceptance Criteria:**
- [ ] POST /api/livekit/token endpoint
- [ ] Requires: roomName, identity, participantType (customer/agent/ai)
- [ ] Token includes: room permissions, participant metadata
- [ ] Token expires in 1 hour
- [ ] Validates room exists before issuing token
- [ ] Different permissions for customers vs agents
- [ ] Uses LIVEKIT_API_KEY and LIVEKIT_API_SECRET

### US-003: Voice Consultation UI Component
**Description:** As a customer, I want a user-friendly interface so I can easily communicate during consultations.

**Acceptance Criteria:**
- [ ] Full-screen consultation view with video/audio controls
- [ ] Mute/unmute audio button
- [ ] Enable/disable video button
- [ ] End call button with confirmation
- [ ] Participant list showing who's in the room
- [ ] Connection status indicator (connecting, connected, reconnecting)
- [ ] Screen share capability for agents
- [ ] Mobile responsive design
- [ ] Verify in browser using dev-browser skill

### US-004: AI Voice Assistant - Initial Intake
**Description:** As a customer, I want to speak with an AI assistant for quick questions so I don't have to wait for a human.

**Acceptance Criteria:**
- [ ] AI assistant auto-joins when customer starts consultation
- [ ] Greeting: "Hello! I'm your Daily Event Insurance assistant..."
- [ ] Can answer: coverage types, pricing ranges, process questions
- [ ] Uses speech-to-text for customer input
- [ ] Uses text-to-speech for AI responses
- [ ] Detects when to escalate to human agent
- [ ] Smooth handoff with context transfer

### US-005: Human Agent Handoff
**Description:** As an AI assistant, I need to transfer calls to human agents when I can't help so customers get proper support.

**Acceptance Criteria:**
- [ ] Triggers on: customer request, complex questions, frustration detection
- [ ] Notifies available agents via dashboard
- [ ] Agent accepts/declines notification within 30 seconds
- [ ] If no agent available, offers callback scheduling
- [ ] Transfers context: customer info, conversation summary
- [ ] AI announces: "I'm connecting you with a specialist..."
- [ ] Agent joins room, AI mutes or leaves

### US-006: Agent Dashboard - Incoming Consultations
**Description:** As an agent, I want to see incoming consultation requests so I can help customers promptly.

**Acceptance Criteria:**
- [ ] Dashboard shows queue of waiting consultations
- [ ] Each item shows: customer name, type, wait time, AI summary
- [ ] "Accept" button joins agent to room
- [ ] "Decline" returns to queue for other agents
- [ ] Real-time updates via WebSocket
- [ ] Audio notification for new consultations
- [ ] Status indicator: Available, Busy, Away
- [ ] Verify in browser using dev-browser skill

### US-007: Claims Video Evidence Submission
**Description:** As a customer filing a claim, I want to submit video evidence so my claim can be processed accurately.

**Acceptance Criteria:**
- [ ] "Submit Video Evidence" on claims page
- [ ] Opens camera with recording controls
- [ ] Record button starts/stops recording
- [ ] Preview recorded video before submission
- [ ] Upload to secure storage (S3 or similar)
- [ ] Link video to claim record
- [ ] Maximum recording length: 5 minutes
- [ ] Supports common video formats

### US-008: Consultation Recording
**Description:** As the system, I need to record consultations for compliance and training purposes.

**Acceptance Criteria:**
- [ ] Recordings enabled for all consultations by default
- [ ] Disclosure announced: "This call may be recorded..."
- [ ] Customer consent captured before recording starts
- [ ] Recording saved to secure cloud storage
- [ ] Link stored in video_consultations table
- [ ] Recordings retained for 7 years (compliance)
- [ ] Admin-only access to recordings

### US-009: Real-Time Transcription
**Description:** As the system, I need to transcribe consultations so they're searchable and reviewable.

**Acceptance Criteria:**
- [ ] Real-time speech-to-text during consultation
- [ ] Transcript displayed as closed captions (optional)
- [ ] Speaker identification (customer vs agent)
- [ ] Transcript saved to database when call ends
- [ ] Searchable transcript archive for admins
- [ ] Supports English (other languages future)

### US-010: Consultation Database Record
**Description:** As the system, I need to store consultation metadata so we have complete records.

**Acceptance Criteria:**
- [ ] video_consultations table with schema per LIVEKIT_SETUP.md
- [ ] Records: customer_id, agent_id, room_name, type
- [ ] Links to: quote_id, claim_id as applicable
- [ ] Timestamps: started_at, ended_at
- [ ] Calculated: duration_seconds
- [ ] Stores: recording_url, transcript, notes
- [ ] Soft delete (archived flag)

### US-011: WebSocket Connection Management
**Description:** As the system, I need to handle connection issues gracefully so users don't lose their sessions.

**Acceptance Criteria:**
- [ ] Automatic reconnection on temporary disconnects
- [ ] Up to 5 reconnection attempts with exponential backoff
- [ ] User notification during reconnection attempts
- [ ] Session recovery if reconnection successful
- [ ] Clean session termination if reconnection fails
- [ ] Bandwidth adaptation for poor connections
- [ ] Fallback to audio-only on very poor connections

### US-012: LiveKit Webhook Handler
**Description:** As the system, I need to process LiveKit events so our records stay synchronized.

**Acceptance Criteria:**
- [ ] POST /api/livekit/webhook endpoint
- [ ] Signature verification using LIVEKIT_WEBHOOK_SECRET
- [ ] Handles: room_started, room_finished, participant_joined, participant_left
- [ ] Handles: egress_started, egress_ended (recordings)
- [ ] Updates video_consultations record on room_finished
- [ ] Triggers recording processing on egress_ended
- [ ] Logs all events for debugging

### US-013: Partner Training Sessions
**Description:** As an admin, I want to conduct video training for new partners so they understand our system.

**Acceptance Criteria:**
- [ ] Admin can create scheduled training room
- [ ] Invite link generated for partner
- [ ] Screen sharing for presentations
- [ ] Multiple partners can join same session
- [ ] Training sessions recorded automatically
- [ ] Training materials can be shared in-call
- [ ] Training attendance logged

## Functional Requirements

- FR-1: LiveKit integration with WebSocket real-time communication
- FR-2: Room creation API generates unique rooms with proper metadata
- FR-3: Token generation with role-based permissions (customer/agent/admin)
- FR-4: React components using @livekit/components-react
- FR-5: AI voice assistant for 24/7 initial intake
- FR-6: Human agent handoff with context preservation
- FR-7: Agent dashboard shows consultation queue in real-time
- FR-8: Video evidence recording and secure upload for claims
- FR-9: Automatic recording with consent capture
- FR-10: Real-time transcription with speaker identification
- FR-11: Database records for all consultations
- FR-12: Webhook processing for LiveKit events
- FR-13: Connection resilience with auto-reconnection

## Non-Goals (Out of Scope)

- Multi-language support (English only for v1)
- Group video calls with >10 participants
- Virtual backgrounds
- AI sentiment analysis during calls
- Integration with external call center software
- SMS/phone fallback if WebSocket fails
- HIPAA compliance (not medical insurance)

## Technical Considerations

### Dependencies
```json
{
  "@livekit/components-react": "^2.9.17",
  "@livekit/components-styles": "^1.2.0",
  "livekit-server-sdk": "^2.15.0"
}
```

### Environment Variables
```bash
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://fred-carey.livekit.cloud
LIVEKIT_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://fred-carey.livekit.cloud
```

### Database Schema
```sql
CREATE TABLE video_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES users(id),
  partner_id UUID REFERENCES partners(id),
  room_name TEXT UNIQUE NOT NULL,
  consultation_type TEXT NOT NULL, -- 'quote', 'claims', 'support', 'training'
  quote_id UUID REFERENCES quotes(id),
  claim_id UUID REFERENCES claims(id),
  ai_handled BOOLEAN DEFAULT true,
  escalated_to_human BOOLEAN DEFAULT false,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds INTEGER,
  recording_url TEXT,
  transcript TEXT,
  ai_summary TEXT,
  agent_notes TEXT,
  customer_rating INTEGER, -- 1-5
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Architecture
```
Customer Browser <-> LiveKit Cloud <-> Agent Browser
         |                  |                |
         v                  v                v
    WebSocket          Recording         WebSocket
         |            (Egress)               |
         v                  |                v
    Token API              S3            Token API
         |                  |                |
         +------------ Next.js API ----------+
                            |
                       PostgreSQL
```

## Success Metrics

- Consultation start time < 5 seconds from button click
- Audio/video latency < 200ms
- Connection success rate > 99%
- AI handles 60% of consultations without human escalation
- Customer satisfaction rating > 4.5/5
- Recording availability within 5 minutes of call end

## Open Questions

- Should we integrate with existing phone systems for PSTN fallback?
- What's the escalation path if no agents are available after hours?
- Should AI assistant have access to customer's existing quotes/policies?
- How long should recordings be retained (compliance requirements)?
