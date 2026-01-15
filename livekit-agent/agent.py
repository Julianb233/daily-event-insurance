"""
Daily Event Insurance Voice Agent
B2B Partnership Sales Agent using LiveKit + OpenAI Realtime API

Sarah - Partnership Development Specialist
Helps gyms, climbing facilities, and rental businesses offer same-day insurance coverage.
"""

from dotenv import load_dotenv
load_dotenv()

import logging
import os
import asyncio
from datetime import datetime
from typing import Optional

from livekit.agents import (
    Agent,
    AgentSession,
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.plugins import openai
from openai.types.realtime import realtime_audio_input_turn_detection

from workflow import init_workflow, ALL_TOOLS
from livekit.agents.llm import ToolContext

logger = logging.getLogger("daily-event-insurance-agent")
logging.basicConfig(level=logging.INFO)

# =============================================================================
# SYSTEM PROMPT - Daily Event Insurance B2B Partnership Sales
# =============================================================================

SYSTEM_PROMPT = """You are Sarah, a Partnership Development Specialist at Daily Event Insurance.
You help gyms, climbing facilities, rental businesses, and adventure companies offer same-day
liability insurance coverage to their members - creating a new revenue stream with zero overhead.

## YOUR ROLE
- You're calling leads who inquired about our B2B embedded insurance platform
- Your goal: Qualify the lead, understand their business, and schedule a demo or send a proposal
- You are NOT selling insurance to consumers - you're selling a PARTNERSHIP to business owners

## COMPANY VALUE PROPOSITION
Daily Event Insurance is an embedded insurance platform that lets businesses:
- Offer same-day liability coverage to members/visitors ($5-15/day)
- Earn 15-25% commission on every policy sold
- Zero implementation cost - we handle everything
- Setup takes only 2-3 hours, then it's fully automated
- Reduces claims against their existing liability policy

## BUSINESS TYPES WE SERVE
| Type | Key Value |
|------|-----------|
| Gyms | Day-pass and drop-in coverage for non-members |
| Climbing Gyms | First-timer and visitor accident protection |
| Equipment Rental | Equipment damage + injury coverage bundled |
| Adventure/Outdoor | High-risk activity coverage on demand |

## YOUR SCRIPT FLOW

### 1. Opening (Warm, Professional)
"Hi [NAME], this is Sarah calling from Daily Event Insurance. You recently submitted an inquiry
about offering insurance coverage at [BUSINESS NAME]. Do you have a quick moment?"

### 2. Discovery (Get These 4 Items)
- Business name and type (gym, climbing, rental, etc.)
- Number of locations / estimated daily visitors
- Current insurance situation (existing coverage? gaps?)
- Timeline / urgency

### 3. Qualification & Value
"Based on what you've shared, our embedded coverage solution could be a great fit.
Partners like yours typically see [benefit for their business type]."

### 4. Next Step
- If Qualified & Ready: "Let me schedule a quick 15-minute demo to show you exactly how this works..."
- If Interested, Not Ready: "I'll send you our partner overview with pricing. When would be a good time for a follow-up call?"
- If Not a Fit: "I appreciate you reaching out. Based on [reason], we may not be the best fit right now."

### 5. Close
"You'll receive a confirmation email shortly. Is there anything else I can help you with today?"

## OBJECTION HANDLING

**"We already have insurance"**
> "That's great - liability coverage is essential. What we offer is different. This is participant
> accident coverage that your members purchase themselves. It actually protects YOUR insurance by
> reducing claims against your policy. Many partners see it as an additional revenue stream."

**"Our members won't pay for it"**
> "I understand that concern. When coverage is optional and affordable - $5-15 per session - members
> who want extra protection are happy to pay. It's especially popular with first-timers and visitors."

**"We don't have time to implement"**
> "That's exactly why we built this to be hands-off. Setup takes about 2-3 hours with our team
> handling most of the technical work. After that, it runs automatically with no daily work."

**"What does it cost?"**
> "There's no cost to your business - we handle all the insurance and administration. You actually
> earn a commission on each policy sold. For members, coverage starts at around $5 per day."

**"Send me some information"**
> "Happy to! Before I do, what specific information would be most helpful? Also, when would be
> a good time for a quick follow-up call to answer any questions?"

## COMPLIANCE RULES
- You are NOT a licensed insurance agent - do not provide insurance advice
- If asked about specific coverage limits, exclusions, or claims, say:
  "That's a great question. Let me have one of our licensed specialists follow up with you."
- Never disparage competitors
- Honor Do Not Call requests immediately

## TONE & STYLE
- Warm, professional, confident (not pushy)
- Keep responses SHORT (1-2 sentences when possible)
- Use natural language: "gotcha", "totally", "for sure"
- Match the prospect's energy level
- Be helpful, not salesy
"""


# =============================================================================
# AGENT CLASS
# =============================================================================

class DailyEventInsuranceAgent(Agent):
    """
    Daily Event Insurance B2B Partnership Sales Voice Agent.
    Uses OpenAI Realtime API for natural conversation flow.
    """

    def __init__(
        self,
        lead_id: Optional[str] = None,
        lead_name: Optional[str] = None,
        business_name: Optional[str] = None,
        call_direction: str = "outbound",
    ):
        super().__init__(instructions=SYSTEM_PROMPT)

        self.lead_id = lead_id
        self.lead_name = lead_name or "there"
        self.business_name = business_name or "your business"
        self.call_direction = call_direction
        self.call_start_time = datetime.utcnow()

        logger.info(
            f"Agent initialized: lead_id={lead_id}, lead_name={lead_name}, "
            f"business={business_name}, direction={call_direction}"
        )

    async def on_enter(self):
        """Called when the agent session starts - generate appropriate greeting."""

        if self.call_direction == "outbound" and self.lead_name != "there":
            # Outbound call with lead context - personalized greeting
            greeting_instruction = (
                f"Greet {self.lead_name} warmly. Say: 'Hi {self.lead_name}, this is Sarah "
                f"calling from Daily Event Insurance. You recently submitted an inquiry about "
                f"offering insurance coverage at {self.business_name}. Do you have a quick moment?'"
            )
        elif self.call_direction == "outbound":
            # Outbound call without full context
            greeting_instruction = (
                "Introduce yourself warmly. Say: 'Hi, this is Sarah calling from Daily Event "
                "Insurance. We help gyms, climbing facilities, and rental businesses offer "
                "same-day insurance to their members. I'm following up on an inquiry we received. "
                "Do you have a quick moment?'"
            )
        else:
            # Inbound call - they're calling us
            greeting_instruction = (
                "Greet the caller warmly. Say: 'Thank you for calling Daily Event Insurance! "
                "This is Sarah. How can I help you today?'"
            )

        logger.info(f"Generating greeting for {self.call_direction} call")
        self.session.generate_reply(instructions=greeting_instruction)


# =============================================================================
# ENTRY POINT
# =============================================================================

async def entrypoint(ctx: JobContext):
    """Main entry point for the voice agent."""

    logger.info(f"Agent starting for room: {ctx.room.name}")

    # Connect to the room with audio subscription
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Extract metadata from job context
    room_metadata = ctx.job.metadata if ctx.job.metadata else {}
    lead_id = room_metadata.get("lead_id")
    lead_name = room_metadata.get("lead_name", "there")
    business_name = room_metadata.get("business_name", "your business")
    call_direction = room_metadata.get("direction", "outbound")

    logger.info(
        f"Lead context: id={lead_id}, name={lead_name}, "
        f"business={business_name}, direction={call_direction}"
    )

    # Wait for participant to join
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Initialize the workflow state with lead context
    init_workflow(
        lead_id=lead_id,
        api_base_url=os.getenv("API_BASE_URL", "http://localhost:3000"),
        api_key=os.getenv("AGENT_API_KEY", ""),
    )

    # Create tool context with all workflow tools
    tool_ctx = ToolContext(ALL_TOOLS)

    # Create the OpenAI Realtime model for lowest-latency voice interaction
    realtime_model = openai.realtime.RealtimeModel(
        model="gpt-4o-realtime-preview",
        voice="coral",  # Warm, professional female voice
        modalities=["audio", "text"],
        input_audio_transcription=openai.realtime.AudioTranscription(
            model="gpt-4o-transcribe",
        ),
        turn_detection=realtime_audio_input_turn_detection.SemanticVad(
            type="semantic_vad",
            eagerness="auto",
            create_response=True,
            interrupt_response=True,
        ),
    )

    # Create the agent instance with lead context
    agent = DailyEventInsuranceAgent(
        lead_id=lead_id,
        lead_name=lead_name,
        business_name=business_name,
        call_direction=call_direction,
    )

    # Create and start the agent session
    session = AgentSession(
        llm=realtime_model,
        fnc_ctx=tool_ctx,  # Attach workflow tools
    )

    logger.info("Starting voice agent session...")

    await session.start(
        room=ctx.room,
        agent=agent,
        participant=participant,
    )

    logger.info("Voice agent session started successfully")


async def request_fnc(ctx: JobContext) -> None:
    """Accept job requests for the agent."""
    logger.info(f"Received job request for room: {ctx.room.name}")
    await ctx.accept()


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("  Daily Event Insurance Voice Agent")
    print("  B2B Partnership Sales - Sarah")
    print("=" * 60)

    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            request_fnc=request_fnc,
            agent_name="daily-event-insurance",
        ),
    )
