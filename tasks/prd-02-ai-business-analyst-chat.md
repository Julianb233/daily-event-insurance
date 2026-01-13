# PRD: AI Business Analyst Chat (Sahara-Style Coaching Interface)

## Introduction

The AI Business Analyst is an embedded ChatGPT-style interface that provides strategic guidance and judgment amplification for partners and founders. Unlike automation agents, this system focuses on **improving decision-making** — helping users identify constraints, sequence priorities correctly, and avoid scaling the wrong things. It's "Sahara for Insurance" — a mentor in a chat box that asks the right questions before prescribing solutions.

**Core Philosophy:** Sahara doesn't execute tasks — it sharpens judgment so everything users execute actually works.

## Goals

- Provide 24/7 strategic coaching for partners via conversational AI
- Help partners identify growth constraints before prescribing solutions
- Reduce partner support burden by handling strategic questions
- Improve partner decision-making quality (not just speed)
- Maintain conversation history for continuity
- Integrate partner-specific data for contextual advice
- Create ChatGPT-like UX within the app (not a redirect)

## Core Principles (Sahara Philosophy)

1. **Judgment over delegation**: We improve decisions, not automate tasks
2. **Diagnosis before prescription**: Ask "what's the constraint?" before "here's the solution"
3. **Founder/partner accountability preserved**: Users stay in control of decisions
4. **Context is king**: Advice must be grounded in partner's actual data
5. **Prevent wrong decisions made well**: Better to do nothing than scale noise

## Target Users

1. **Partners**: Gym owners, facility operators seeking business guidance
2. **Prospective Partners**: Evaluating whether to join, need clarity
3. **Internal Team**: Using the assistant for partner support
4. **Founders (if multi-product)**: Strategic coaching for their business

## User Stories

### US-001: Chat Interface Component
**Description:** As a partner, I want a ChatGPT-style chat interface so I can have natural conversations with the AI advisor.

**Acceptance Criteria:**
- [ ] Full-page chat interface at /partner/advisor or /dashboard/chat
- [ ] Message input at bottom with send button
- [ ] Chat history displays with user/AI message bubbles
- [ ] AI messages stream in real-time (typing effect)
- [ ] Markdown rendering for formatted responses
- [ ] Code blocks rendered with syntax highlighting if needed
- [ ] Mobile responsive (works on phone/tablet)
- [ ] Dark/light mode support
- [ ] npm run build passes
- [ ] Verify in browser using dev-browser skill

### US-002: Conversation Persistence
**Description:** As a partner, I want my conversations saved so I can continue where I left off.

**Acceptance Criteria:**
- [ ] Conversations stored in database per user
- [ ] Conversation list sidebar showing past chats
- [ ] Each conversation has auto-generated title (first user message)
- [ ] Can rename conversations
- [ ] Can delete conversations
- [ ] New conversation button starts fresh thread
- [ ] Last active conversation loads by default

### US-003: Streaming AI Responses
**Description:** As a partner, I want to see the AI response appear word-by-word so it feels responsive.

**Acceptance Criteria:**
- [ ] Uses streaming API (SSE or WebSocket)
- [ ] Response appears incrementally as generated
- [ ] Typing indicator while waiting for first token
- [ ] Cancel/stop generation button during streaming
- [ ] Error handling if stream interrupted
- [ ] Retry button on failure

### US-004: Context-Aware Responses
**Description:** As the system, I need to include partner context so advice is specific, not generic.

**Acceptance Criteria:**
- [ ] System prompt includes: partner business type, size, tenure
- [ ] Includes: recent earnings, quote volume, conversion rates
- [ ] Includes: current tier, products enabled
- [ ] Context refreshed at conversation start
- [ ] Partner can ask "what do you know about my business?"
- [ ] AI references actual data in responses

### US-005: Diagnostic Conversation Flow
**Description:** As an AI advisor, I need to diagnose before prescribing so I give relevant advice.

**Acceptance Criteria:**
- [ ] AI asks clarifying questions before giving advice
- [ ] Probes for: "What's constraining growth?" not "How do I grow?"
- [ ] Identifies: PMF issues, distribution problems, scaling noise
- [ ] Uses board-style questioning (not brainstorming)
- [ ] Offers frameworks for thinking, not just answers
- [ ] Can push back on vague goals ("scale more" → "what specifically?")

### US-006: System Prompt & Persona
**Description:** As the system, I need a carefully crafted prompt so the AI behaves as a strategic advisor.

**Acceptance Criteria:**
- [ ] Persona: "You are a strategic advisor, not a task executor"
- [ ] Tone: Direct, board-level, not sycophantic
- [ ] Avoids: "Great question!" and empty validation
- [ ] Behavior: Ask before answer, diagnose before prescribe
- [ ] Knowledge: Insurance industry, B2B partnerships, growth strategy
- [ ] Constraints: Won't give legal/compliance advice
- [ ] Always grounds advice in partner's context

### US-007: Pre-Built Prompts/Starters
**Description:** As a partner, I want suggested conversation starters so I know what to ask.

**Acceptance Criteria:**
- [ ] "Diagnose my growth constraints"
- [ ] "Review my conversion rates"
- [ ] "Help me think through expansion"
- [ ] "What should I focus on this month?"
- [ ] "Am I ready for the next commission tier?"
- [ ] Starters shown when starting new conversation
- [ ] One-click to start conversation with that prompt

### US-008: API Endpoint for Chat
**Description:** As a developer, I need a chat API so the frontend can communicate with the AI.

**Acceptance Criteria:**
- [ ] POST /api/ai/chat endpoint
- [ ] Input: { conversationId?, message, partnerId }
- [ ] Output: Streaming response (text/event-stream)
- [ ] Creates new conversation if conversationId not provided
- [ ] Appends to existing conversation history
- [ ] Rate limited: 50 messages/hour per partner
- [ ] Uses configured LLM provider (OpenAI/Anthropic/Gemini)

### US-009: Conversation History API
**Description:** As a developer, I need APIs to manage conversations.

**Acceptance Criteria:**
- [ ] GET /api/ai/conversations - List partner's conversations
- [ ] GET /api/ai/conversations/[id] - Get single conversation with messages
- [ ] DELETE /api/ai/conversations/[id] - Delete conversation
- [ ] PATCH /api/ai/conversations/[id] - Rename conversation
- [ ] All endpoints scoped to authenticated partner

### US-010: Database Schema for Conversations
**Description:** As the system, I need to store conversations persistently.

**Acceptance Criteria:**
- [ ] ai_conversations table: id, partnerId, title, createdAt, updatedAt
- [ ] ai_messages table: id, conversationId, role, content, createdAt
- [ ] role values: 'user', 'assistant', 'system'
- [ ] Indexes on partnerId, conversationId
- [ ] Soft delete support (archivedAt)

### US-011: Judgment Anchors (Not Just Answers)
**Description:** As an AI advisor, I should provide frameworks and mental models, not just answers.

**Acceptance Criteria:**
- [ ] Offers frameworks: "The three constraints are usually..."
- [ ] Uses analogies: "Think of it like..."
- [ ] Provides decision criteria: "You should do X if Y, but Z if W"
- [ ] Asks "What would have to be true for this to work?"
- [ ] Helps user think, not just tells user what to do
- [ ] Summarizes key tradeoffs explicitly

### US-012: Objection Handling Patterns
**Description:** As an AI advisor, I need to handle common objections gracefully.

**Acceptance Criteria:**
- [ ] "Just tell me what to do" → "I could, but let me understand your constraints first"
- [ ] "Why don't you just do it for me?" → "I help with the harder part — preventing wrong decisions"
- [ ] "Give me a step-by-step plan" → Provides plan only after diagnosis
- [ ] Never defensive, always redirects to user's actual goal
- [ ] Can explain its own methodology if asked

### US-013: Partner Data Integration
**Description:** As the system, I need to fetch partner metrics so the AI can reference them.

**Acceptance Criteria:**
- [ ] Function to fetch partner dashboard data
- [ ] Includes: earnings, quotes, policies, conversion rate
- [ ] Includes: tier, products, business type
- [ ] Formatted as structured context for LLM
- [ ] Refreshed at start of each conversation
- [ ] AI can quote specific numbers in responses

### US-014: Admin View of Conversations
**Description:** As an admin, I want to see partner conversations so I can improve the system.

**Acceptance Criteria:**
- [ ] Admin dashboard shows conversation list (all partners)
- [ ] Can filter by partner, date range
- [ ] Can view full conversation thread
- [ ] Cannot edit (read-only for audit)
- [ ] Export conversations for training data
- [ ] Flag system for problematic responses

## Functional Requirements

- FR-1: ChatGPT-style chat interface embedded in partner dashboard
- FR-2: Streaming responses with real-time token display
- FR-3: Conversation persistence with history sidebar
- FR-4: Context injection with partner-specific data
- FR-5: Diagnostic-first conversation pattern (ask before answer)
- FR-6: Strategic advisor persona (not task executor)
- FR-7: Pre-built conversation starters
- FR-8: Rate limiting to prevent abuse
- FR-9: Admin visibility for quality assurance
- FR-10: Mobile-responsive design
- FR-11: Markdown and formatting support in responses
- FR-12: Multi-provider LLM support (OpenAI, Anthropic, Gemini)

## Non-Goals (Out of Scope)

- Task execution/automation (Sahara philosophy: judgment, not delegation)
- Integration with external tools (Slack, email, etc.)
- Multi-user conversations (1:1 only for v1)
- Voice input/output (text only for v1)
- File uploads or image analysis
- Real-time data queries during conversation (context fetched at start)
- Custom personas per partner

## Technical Considerations

### LLM Provider Options
```typescript
// Support multiple providers
type LLMProvider = 'openai' | 'anthropic' | 'gemini';

// Environment variables
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
AI_PROVIDER=anthropic // default provider
```

### Database Schema
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  title TEXT,
  context_snapshot TEXT, -- JSON of partner data at conversation start
  message_count INTEGER DEFAULT 0,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_conversations_partner ON ai_conversations(partner_id);
CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id);
```

### System Prompt Template
```markdown
You are a strategic business advisor for Daily Event Insurance partners.

## Your Role
- You improve judgment, you don't execute tasks
- You diagnose before prescribing
- You ask clarifying questions before giving advice
- You are direct, not sycophantic
- You keep the partner accountable for their decisions

## Partner Context
Business: {{businessName}}
Type: {{businessType}}
Monthly Participants: {{participants}}
Conversion Rate: {{conversionRate}}%
Current Tier: {{tier}} ({{commissionRate}}%)
Tenure: {{tenure}} months

## Guidelines
- When the partner says "I want to scale," ask "What's constraining growth right now?"
- Offer frameworks and mental models, not just answers
- Reference their actual data when relevant
- Push back on vague goals
- Never give legal or compliance advice

## What You Don't Do
- Execute tasks or automations
- Make decisions for the partner
- Give empty validation ("Great question!")
- Prescribe before diagnosing
```

### API Response Format
```typescript
// Streaming response using Server-Sent Events
interface ChatStreamEvent {
  type: 'token' | 'done' | 'error';
  content?: string;
  conversationId?: string;
  messageId?: string;
  error?: string;
}
```

## UI Components Needed

1. **ChatContainer** - Full-page chat layout
2. **MessageList** - Scrollable message history
3. **MessageBubble** - User/AI message display with markdown
4. **ChatInput** - Text area with send button
5. **ConversationSidebar** - List of past conversations
6. **StarterPrompts** - Suggested conversation starters
7. **StreamingText** - Component that displays tokens as they arrive

## Success Metrics

- Partner engagement: 40% of active partners use chat monthly
- Conversation length: Average 8+ messages per conversation
- Repeat usage: 60% of users return within 7 days
- Quality: <5% of conversations flagged as unhelpful
- Performance: First token latency < 500ms
- Satisfaction: NPS > 50 for chat feature

## Open Questions

- Should we allow partners to share conversations with support?
- Should the AI be able to take actions (e.g., create a quote) if explicitly asked?
- How do we handle conversations that reveal partner is struggling badly?
- Should there be different advisors for different topics (growth, ops, claims)?
- Voice interface: should we integrate this with the LiveKit voice agent?
