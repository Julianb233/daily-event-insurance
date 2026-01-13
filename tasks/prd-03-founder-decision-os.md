# PRD: Founder Decision OS (Fred Cary Coaching System)

## Introduction

The Founder Decision OS is an AI-powered coaching system that guides founders from idea to traction using Fred Cary's methodology. Unlike generic startup advice, this system diagnoses silently, introduces frameworks selectively, and never optimizes downstream artifacts before upstream truth is established.

**Core Philosophy**: Never optimize decks, patents, hiring, or fundraising before establishing feasibility, demand, economics, and distribution clarity.

## Goals

- Guide founders through a 9-step gating process from idea to traction
- Silently diagnose positioning clarity and investor readiness
- Introduce the right framework at the right moment (not founder choice)
- Provide rigorous evaluation using Investor Lens and Positioning Framework
- Prevent premature scaling, fundraising, and wasted capital
- Maintain mentor authority while making founders feel guided, not evaluated

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FOUNDER DECISION OS                       │
├─────────────────────────────────────────────────────────────┤
│  PHASE 1: Universal Entry                                    │
│  - What are you building?                                    │
│  - Who is it for?                                            │
│  - What are you trying to accomplish right now?              │
├─────────────────────────────────────────────────────────────┤
│  PHASE 2: Silent Diagnosis (Internal)                        │
│  ┌─────────────────┐    ┌──────────────────────┐            │
│  │ Positioning     │    │ Investor Readiness   │            │
│  │ Signals         │    │ Signals              │            │
│  │ - ICP vague     │    │ - Mentions fundraise │            │
│  │ - "Everyone"    │    │ - Uploads deck       │            │
│  │ - Weak traction │    │ - Asks about raising │            │
│  └────────┬────────┘    └──────────┬───────────┘            │
│           │                        │                         │
│           ▼                        ▼                         │
├─────────────────────────────────────────────────────────────┤
│  PHASE 3: Selective Framework Introduction                   │
│  ┌─────────────────┐    ┌──────────────────────┐            │
│  │ POSITIONING     │    │ INVESTOR LENS        │            │
│  │ FRAMEWORK       │    │ (VC Evaluation)      │            │
│  │ Grade: A-F      │    │ Verdict: Yes/No/NYet │            │
│  └─────────────────┘    └──────────────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  DEFAULT MODE: Fred Cary Startup Process (9 Steps)          │
│  Step 1 → Step 2 → ... → Step 9 (Gating at each step)       │
└─────────────────────────────────────────────────────────────┘
```

## Target Users

1. **Pre-Seed Founders**: Validating ideas, finding PMF
2. **Seed Founders**: Building traction, preparing for scale
3. **Series A Founders**: Proving repeatability, raising capital
4. **Internal Coaches**: Using the system to support founders

## Modules

### Module 1: Startup Process Engine (9-Step Gating)
### Module 2: Silent Diagnostic System
### Module 3: Positioning Readiness Framework
### Module 4: Investor Lens (VC Evaluation)

---

# MODULE 1: STARTUP PROCESS ENGINE

## User Stories

### US-001: Step Tracking System
**Description:** As a founder, I want the system to track which step I'm on so I get relevant guidance.

**Acceptance Criteria:**
- [ ] System tracks current step (1-9) per founder
- [ ] Step stored in founder's conversation context
- [ ] Cannot advance until current step validated
- [ ] Step history visible to founder on request
- [ ] pnpm build passes

### US-002: Step 1 - Define the Real Problem
**Description:** As a founder, I need help articulating the problem separate from any solution.

**Acceptance Criteria:**
- [ ] Asks: Who experiences this? How often? Why spend money?
- [ ] Requires one-sentence problem statement in customer language
- [ ] Blocks if problem is vague, abstract, or sounds like a feature
- [ ] Provides examples of good vs bad problem statements
- [ ] pnpm build passes

### US-003: Step 2 - Identify Buyer and Environment
**Description:** As a founder, I need to clarify who buys vs who uses.

**Acceptance Criteria:**
- [ ] Asks: Who is economic buyer? Who is user? What environment?
- [ ] Blocks if "everyone" is the target
- [ ] Blocks if buyer is unclear or hypothetical
- [ ] Requires clear buyer vs user definition
- [ ] pnpm build passes

### US-004: Step 3 - Establish Founder Edge
**Description:** As a founder, I need to articulate why I'm credible to solve this.

**Acceptance Criteria:**
- [ ] Asks: What lived experience? What insight? What unfair advantage?
- [ ] Requires concise founder-market fit statement
- [ ] Blocks if no credible path to insight, access, or learning velocity
- [ ] pnpm build passes

### US-005: Step 4 - Define Simplest Viable Solution
**Description:** As a founder, I need to articulate the smallest solution that delivers value.

**Acceptance Criteria:**
- [ ] Asks: What is simplest version? What is NOT included yet?
- [ ] Requires plain-English solution description
- [ ] Blocks if solution is overbuilt or unfocused
- [ ] Blocks if solving multiple problems at once
- [ ] pnpm build passes

### US-006: Step 5 - Validate Before Building
**Description:** As a founder, I need to test demand before heavy build-out.

**Acceptance Criteria:**
- [ ] Asks: Fastest way to test? What signal proves problem is real?
- [ ] Requires evidence of demand (conversations, LOIs, pilots, pre-orders)
- [ ] Blocks if validation is theoretical only
- [ ] Blocks if no real user/buyer interaction occurred
- [ ] pnpm build passes

### US-007: Step 6 - Define First GTM Motion
**Description:** As a founder, I need to identify how first customers will be reached.

**Acceptance Criteria:**
- [ ] Asks: How reach buyers in practice? What channel works now?
- [ ] Requires one clear initial distribution path
- [ ] Blocks if distribution is hand-waved
- [ ] Blocks if GTM depends on future scale, brand, or capital
- [ ] pnpm build passes

### US-008: Step 7 - Install Execution Discipline
**Description:** As a founder, I need focus and momentum through simple cadence.

**Acceptance Criteria:**
- [ ] Asks: What matters this week? What decision cannot be avoided?
- [ ] Outputs weekly priorities with clear ownership
- [ ] Blocks if work is reactive or scattered
- [ ] pnpm build passes

### US-009: Step 8 - Run Contained Pilot
**Description:** As a founder, I need to operate a small real-world test.

**Acceptance Criteria:**
- [ ] Asks: What does pilot success look like? What will we measure?
- [ ] Requires pilot results with qualitative and quantitative feedback
- [ ] Blocks if results are inconclusive or ignored
- [ ] pnpm build passes

### US-010: Step 9 - Decide What Earns Right to Scale
**Description:** As a founder, I need to decide whether to double down, iterate, or stop.

**Acceptance Criteria:**
- [ ] Asks: What worked? What didn't? What must be true before scaling?
- [ ] Requires clear decision: proceed, adjust, or stop
- [ ] Blocks if decisions based on hope instead of evidence
- [ ] pnpm build passes

---

# MODULE 2: SILENT DIAGNOSTIC SYSTEM

## User Stories

### US-011: Universal Entry Questions
**Description:** As the system, I must start every conversation with open context gathering.

**Acceptance Criteria:**
- [ ] First message asks: What are you building? Who is it for? What are you trying to accomplish right now?
- [ ] Does NOT mention investor readiness, positioning frameworks, or scores
- [ ] Treats all founders the same at first interaction
- [ ] pnpm build passes

### US-012: Silent Positioning Evaluation
**Description:** As the system, I must continuously evaluate positioning clarity without showing scores.

**Acceptance Criteria:**
- [ ] Tracks signals: ICP vague, "everyone" as target, buzzword messaging, high effort but low traction
- [ ] Evaluates as: low / medium / high positioning clarity
- [ ] Evaluation stored internally, not shown to founder
- [ ] Updates with each message
- [ ] pnpm build passes

### US-013: Silent Investor Readiness Evaluation
**Description:** As the system, I must detect when founder is thinking about fundraising.

**Acceptance Criteria:**
- [ ] Tracks signals: mentions fundraising/valuation/decks, uploads deck, asks "are we ready to raise?"
- [ ] Evaluates as: low / medium / high investor readiness signal
- [ ] Does NOT encourage fundraising by default
- [ ] pnpm build passes

### US-014: Framework Introduction Logic
**Description:** As the system, I must introduce the right framework at the right moment.

**Acceptance Criteria:**
- [ ] Introduces POSITIONING when: ICP unclear, can't explain value crisply, weak traction despite activity
- [ ] Introduces INVESTOR LENS only when: founder explicitly discusses fundraising, uploads deck, asks about raising
- [ ] Introduces only ONE framework at a time
- [ ] Uses prescribed language from Diagnostic Introduction Flow
- [ ] pnpm build passes

### US-015: Default Mode Behavior
**Description:** As the system, I must remain in Founder Decision OS mode when no strong signals detected.

**Acceptance Criteria:**
- [ ] If neither positioning nor investor signals strong, continue with 9-step process
- [ ] Does not offer assessments unprompted
- [ ] Maintains mentor authority
- [ ] pnpm build passes

---

# MODULE 3: POSITIONING READINESS FRAMEWORK

## User Stories

### US-016: Positioning Grade Calculation
**Description:** As the system, I must evaluate positioning using weighted criteria.

**Acceptance Criteria:**
- [ ] Clarity (30%): Can explain in one sentence without jargon, customer POV, solution maps to problem
- [ ] Differentiation (25%): Why this vs alternatives, competitor awareness, credible "why you"
- [ ] Market Understanding (20%): Landscape understanding, validated problem, current solutions known
- [ ] Narrative Strength (25%): Coherent story, clear "why now", creates urgency
- [ ] Outputs grade A-F
- [ ] pnpm build passes

### US-017: Clarity Scoring (30%)
**Description:** As the system, I must evaluate clarity using specific criteria.

**Acceptance Criteria:**
- [ ] Asks: Can founder explain in one sentence without jargon?
- [ ] Asks: Is problem described from customer's POV?
- [ ] Asks: Does solution map to problem?
- [ ] Asks: Is target customer specific enough to identify in real world?
- [ ] A = Instantly understandable, specific, obvious fit
- [ ] C = Understandable with effort, some vagueness
- [ ] F = Confusing, abstract, or feature-driven
- [ ] pnpm build passes

### US-018: Differentiation Scoring (25%)
**Description:** As the system, I must evaluate differentiation credibly.

**Acceptance Criteria:**
- [ ] Asks: Why this solution vs alternatives?
- [ ] Asks: Awareness of direct and indirect competitors?
- [ ] Asks: Is "why you" articulated credibly?
- [ ] A = Clear differentiation rooted in insight/advantage
- [ ] C = Some differentiation, mostly surface-level
- [ ] F = Undifferentiated or dismissive of competition
- [ ] pnpm build passes

### US-019: Market Understanding Scoring (20%)
**Description:** As the system, I must evaluate market understanding.

**Acceptance Criteria:**
- [ ] Asks: Does founder understand the landscape?
- [ ] Asks: Is problem validated through real customer interaction?
- [ ] Asks: How do customers currently solve this?
- [ ] A = Deep understanding, validated problem
- [ ] C = Partial understanding, limited validation
- [ ] F = Assumptions without evidence
- [ ] pnpm build passes

### US-020: Narrative Strength Scoring (25%)
**Description:** As the system, I must evaluate narrative coherence.

**Acceptance Criteria:**
- [ ] Asks: Does story feel coherent and compelling?
- [ ] Asks: Is there a clear "why now"?
- [ ] Asks: Would this create curiosity/urgency in buyer?
- [ ] A = Tight, urgent, coherent narrative
- [ ] C = Understandable but lacks urgency
- [ ] F = Meandering or unfocused story
- [ ] pnpm build passes

### US-021: Narrative Tightness Score
**Description:** As the system, I must score narrative tightness 1-10.

**Acceptance Criteria:**
- [ ] Evaluates: How efficiently founder communicates core idea
- [ ] Evaluates: How little explanation needed to understand value
- [ ] 10 = immediately clear, no filler
- [ ] 1 = confusing, rambling, contradictory
- [ ] pnpm build passes

### US-022: Positioning Output Format
**Description:** As the system, I must return structured positioning results.

**Acceptance Criteria:**
- [ ] Returns: Positioning Grade (A-F)
- [ ] Returns: Narrative Tightness Score (1-10)
- [ ] Returns: 3-5 specific gaps
- [ ] Returns: Next 3 actions to improve positioning clarity
- [ ] Does NOT rewrite marketing copy unless requested
- [ ] Does NOT suggest channels, ads, or branding
- [ ] pnpm build passes

---

# MODULE 4: INVESTOR LENS (VC EVALUATION)

## User Stories

### US-023: Core VC Evaluation Axes
**Description:** As the system, I must evaluate companies on standard VC criteria.

**Acceptance Criteria:**
- [ ] Evaluates: Team (founder-market fit, learning velocity, ability to recruit)
- [ ] Evaluates: Market (size, urgency, timing inflection)
- [ ] Evaluates: Problem (painful, frequent, expensive, clear buyer)
- [ ] Evaluates: Solution & Differentiation (why this, why now)
- [ ] Evaluates: Go-To-Market (credible path, early repeatability)
- [ ] Evaluates: Traction Quality (retention, usage, revenue - not vanity)
- [ ] Evaluates: Business Model (pricing, margins, scalability)
- [ ] Evaluates: Fund Fit (why this investor, why this round, why now)
- [ ] pnpm build passes

### US-024: Hidden VC Filter Detection
**Description:** As the system, I must identify unspoken pass reasons.

**Acceptance Criteria:**
- [ ] Detects: Outcome Size Mismatch (too small to move fund)
- [ ] Detects: Weak Internal Sponsor (no partner conviction)
- [ ] Detects: Pattern-Matching Bias (looks unfamiliar or wrong-familiar)
- [ ] Detects: Momentum Gap (no social proof)
- [ ] Detects: Complexity Cost (too much work to reach conviction)
- [ ] Translates vague feedback into explicit pass reasons
- [ ] pnpm build passes

### US-025: Pre-Seed Evaluation
**Description:** As the system, I must evaluate pre-seed companies appropriately.

**Acceptance Criteria:**
- [ ] Primary question: Can this team find and earn PMF?
- [ ] Looks for: Narrow ICP, single wedge, founder-led discovery, feasibility, why-now
- [ ] Detects kill signals: Broad market no wedge, patents before validation, no clear buyer
- [ ] Outputs: First-meeting verdict (Yes/No/Not yet), Top 3 kill-risks, Next 3 proof actions (≤30 days)
- [ ] pnpm build passes

### US-026: Seed Evaluation
**Description:** As the system, I must evaluate seed companies appropriately.

**Acceptance Criteria:**
- [ ] Primary question: Is repeatability beginning to emerge?
- [ ] Looks for: Progress toward ~$1M ARR, retention evidence, one GTM motion, Series A milestone logic
- [ ] Detects kill signals: Vanity metrics, hiring sales before demand, GTM only in slides
- [ ] Outputs: Scores for traction quality, repeatability, Series A clarity
- [ ] Outputs: 6-12 month Series A milestone map
- [ ] pnpm build passes

### US-027: Series A Evaluation
**Description:** As the system, I must evaluate Series A companies appropriately.

**Acceptance Criteria:**
- [ ] Primary question: Is PMF proven and growth repeatable?
- [ ] Looks for: Strong PMF evidence, repeatable acquisition channel, improving unit economics, operating rigor
- [ ] Detects kill signals: Growth spikes without repeatability, weak retention masked by spend, no operating cadence
- [ ] Outputs: 10+ likely investor objections with best responses
- [ ] Outputs: 90-day Series A readiness plan with metric targets
- [ ] pnpm build passes

### US-028: Investor Verdict Output
**Description:** As the system, I must return structured investor evaluation.

**Acceptance Criteria:**
- [ ] Returns: IC Verdict (Yes / No / Not yet) with reasoning
- [ ] Returns: Top 5 Pass Reasons (stage-adjusted)
- [ ] Returns: What Evidence Flips Each Reason into yes
- [ ] Returns: Next 3 De-Risking Actions
- [ ] pnpm build passes

### US-029: Deck Request Protocol
**Description:** As the system, I must never ask for deck by default.

**Acceptance Criteria:**
- [ ] Issues provisional verdict BEFORE requesting deck
- [ ] Requests deck only if: near the line, missing structural info, or founder explicitly asks
- [ ] Uses stage-specific language from Investor Lens doc
- [ ] Pre-seed: Recommends 1-2 page summary instead of deck
- [ ] Says plainly when deck is premature
- [ ] pnpm build passes

### US-030: Bias Translation
**Description:** As the system, I must translate vague investor feedback into explicit pass reasons.

**Acceptance Criteria:**
- [ ] When founder reports "not a fit" or "too early", map to specific filters
- [ ] Prescribe smallest set of proofs that would change verdict
- [ ] Never sell hope
- [ ] pnpm build passes

---

# INTEGRATION USER STORIES

### US-031: Conversation State Management
**Description:** As the system, I must maintain state across conversations.

**Acceptance Criteria:**
- [ ] Stores: current step (1-9), positioning signals, investor signals
- [ ] Stores: positioning grade history, investor verdicts
- [ ] Persists across sessions
- [ ] Founder can ask "where am I?" and get current state
- [ ] pnpm build passes

### US-032: Framework Language Enforcement
**Description:** As the system, I must use prescribed language when introducing frameworks.

**Acceptance Criteria:**
- [ ] Positioning intro: "Before we talk about scaling or investors, we need to get clear on how this is positioned..."
- [ ] Investor intro: "We can evaluate this the way investors actually will. That includes a clear verdict..."
- [ ] Formal assessment offer: "If it's helpful, we can formally pressure-test this..."
- [ ] Does NOT frame positioning as marketing/branding
- [ ] Does NOT soften investor verdicts
- [ ] pnpm build passes

### US-033: Guardrails Enforcement
**Description:** As the system, I must maintain non-negotiable behaviors.

**Acceptance Criteria:**
- [ ] Never encourage fundraising by default
- [ ] Say plainly when something is not venture-backable
- [ ] Offer alternatives when VC is wrong for the business
- [ ] Never optimize narrative over fundamentals
- [ ] Capital is a tool, not the goal
- [ ] pnpm build passes

---

## Functional Requirements

- FR-1: 9-step gating process with blocking criteria at each step
- FR-2: Silent diagnostic evaluation running continuously
- FR-3: Framework introduction only when signals justify it
- FR-4: Positioning evaluation with A-F grade and 1-10 tightness score
- FR-5: Investor evaluation with stage-specific criteria (Pre-Seed/Seed/Series A)
- FR-6: Deck request protocol (never by default)
- FR-7: Bias translation for vague investor feedback
- FR-8: Conversation state persistence across sessions
- FR-9: Prescribed language for framework introductions
- FR-10: Non-negotiable guardrails enforced

## Non-Goals (Out of Scope)

- Writing pitch decks or marketing copy
- Fundraising outreach or investor introductions
- Cap table management
- Legal or tax advice
- Hiring recommendations
- Product roadmap creation

## Technical Considerations

### Conversation State Schema
```typescript
interface FounderState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  stepCompletions: Record<number, { completed: boolean; date?: string }>;
  positioningSignals: 'low' | 'medium' | 'high';
  investorSignals: 'low' | 'medium' | 'high';
  activeFramework: 'none' | 'positioning' | 'investor';
  positioningGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
  narrativeTightness?: number; // 1-10
  investorVerdict?: 'yes' | 'no' | 'not_yet';
  stage?: 'pre_seed' | 'seed' | 'series_a';
}
```

### Prompt Structure
```
[System Prompt: Fred Cary Founder Decision OS]
├── Core Philosophy
├── 9-Step Process Logic
├── Silent Diagnostic Signals
├── Framework Introduction Rules
├── Positioning Framework (when activated)
├── Investor Lens (when activated)
└── Guardrails

[Founder Context]
├── Current Step
├── Conversation History
├── Diagnostic Signals
└── Active Framework State
```

## Success Metrics

- 80% of founders complete Step 1-5 before asking about investors
- Positioning framework introduced only when warranted (not on first message)
- Investor lens introduced only when founder raises topic
- 90% of founders report feeling "guided, not evaluated"
- Zero premature fundraising encouragement
- Average 6+ messages before any framework introduction

## Open Questions

- Should completed assessments be exportable as PDF?
- Should there be a dashboard showing founder's journey progress?
- How do we handle founders who insist on skipping steps?
- Should coaching sessions be time-limited or unlimited?
