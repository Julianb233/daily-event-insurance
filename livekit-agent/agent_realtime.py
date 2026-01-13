"""
Daily Event Insurance Voice Agent (Realtime Model Version)
Uses OpenAI Realtime API for direct speech-to-speech processing.

Benefits over traditional pipeline:
- Lower latency (no STT → LLM → TTS hops)
- Better emotional context understanding
- More natural, expressive speech output
"""

from dotenv import load_dotenv
load_dotenv()

import logging
from livekit.agents import (
    Agent,
    AgentSession,
    AutoSubscribe,
    JobContext,
    RoomInputOptions,
    WorkerOptions,
    cli,
    llm,
)
from openai.types.realtime import realtime_audio_input_turn_detection

logger = logging.getLogger("voice-agent-realtime")

# System prompt for the insurance assistant
SYSTEM_PROMPT = """You are a friendly and knowledgeable insurance specialist for Daily Event Insurance.
You help partners and potential partners understand our event insurance platform.

# KEY KNOWLEDGE BASE

## GENERAL PLATFORM
- **Value Proposition:** Instant participant insurance, new revenue stream for organizers, reduced liability.
- **Integration:** Works with RunSignup, BikeReg, MindBody, Zen Planner, and generic API. Live in 24-48 hours.
- **Cost:** No setup fees or minimums. Participants pay for coverage (optional add-on).
- **Commission:** Partners earn 20-40% commission on every policy sold.
- **Coverage:** Medical expenses, emergency transport, trip cancellation, and activity-related injuries. Same-day activation.

## SECTOR SPECIFIC DETAILS

### 1. RUNNING EVENTS (Race Directors)
- **Events:** 5Ks, Marathons, Trail Runs.
- **Benefits:** Participant Protection, Revenue Per Registration, Reduced Liability.
- **Stats:** Avg Commission $620/race, 38% Take Rate.
- **FAQs:** Covers all distances. Complementary to event liability.

### 2. CYCLING EVENTS
- **Events:** Road races, Gran Fondos, Gravel, Criteriums.
- **Benefits:** Multi-discipline coverage (medical + equipment options), Sponsor Confidence.
- **Stats:** Avg Revenue $480/event, 42% Take Rate.
- **FAQs:** Covers international riders (US events). Start-to-finish protection.

### 3. TRIATHLONS
- **Events:** Sprint, Olympic, Ironman (70.3/Full), Duathlons.
- **Benefits:** Covers open water swims (critical), higher policy values ($15 avg).
- **Stats:** Avg Revenue $1,150/event, 48% Take Rate.
- **FAQs:** Includes transitions. Compatible with USAT sanctioning. 

### 4. OBSTACLE COURSES (OCR)
- **Events:** Spartan-style, Mud Runs, 24-hour challenges.
- **Benefits:** High-risk coverage (walls, fire, electricity) that standard policies exclude.
- **Stats:** Avg Revenue $1,640/event, 53% Take Rate (High!).
- **Pricing:** Higher premiums ($14 avg) due to risk = higher commission.

### 5. GYMS & FITNESS CENTERS
- **Events:** Transformation challenges, CrossFit competitions, Powerlifting meets.
- **Benefits:** Protects members during intense training. Covers entire challenge duration (e.g., 6 weeks).
- **Stats:** Avg Revenue $225/challenge.
- **FAQs:** Complementary to facility liability.

### 6. SKI RESORTS
- **Events:** Ski races, Snowboard comps, Terrain park jams.
- **Benefits:** Helicopter evacuation coverage ($3k-$10k value). Ski patrol response interpretation.
- **Stats:** Cumulative seasonal revenue (e.g., $8,000/season).

## COMMISSION TIERS (Standard)
- 0-999 participants: 25%
- 1,000-2,499: 27.5%
- 2,500-4,999: 30%
- 5,000-9,999: 32.5%
- 10,000+: 35%+

## COMMUNICATION GUIDELINES
- Be conversational, warm, and professional.
- Keep responses concise (2-3 sentences) for voice.
- If asked about a specific sector (e.g., "I run a gym"), pivot to those specific benefits/stats.
- If you don't know an exact policy limit, say "Coverage limits depend on the specific event risk profile, but I can get you a quote instantly on our website."
- Greet the user warmly at the start.
"""


class InsuranceAgent(Agent):
    """Daily Event Insurance voice agent using OpenAI Realtime API"""

    def __init__(self):
        super().__init__(
            instructions=SYSTEM_PROMPT,
        )

    async def on_enter(self):
        """Called when the agent session starts"""
        # Generate a warm greeting when the session begins
        self.session.generate_reply(
            instructions="Greet the user warmly. Say hello and introduce yourself as a Daily Event Insurance specialist ready to help."
        )


async def entrypoint(ctx: JobContext):
    """Main entry point for the realtime voice agent"""
    logger.info(f"Connecting to room: {ctx.room.name}")

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for a participant
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Create the realtime model with semantic VAD for lowest latency
    # Using "ash" voice for natural conversational tone
    realtime_model = openai.realtime.RealtimeModel(
        model="gpt-4o-realtime-preview",
        voice="ash",  # Options: alloy, ash, ballad, coral, echo, sage, shimmer, verse
        modalities=["audio", "text"],
        input_audio_transcription=openai.realtime.AudioTranscription(
            model="gpt-4o-transcribe",
        ),
        turn_detection=realtime_audio_input_turn_detection.SemanticVad(
            type="semantic_vad",
            eagerness="auto",  # Options: auto, low, medium, high
            create_response=True,
            interrupt_response=True,
        ),
    )

    # Create agent session with the realtime model
    session = AgentSession(
        llm=realtime_model,
    )

    # Start the agent session
    await session.start(
        room=ctx.room,
        participant=participant,
    )
    
    # Send greeting via session
    await session.response.create()

    logger.info("Realtime voice agent started successfully")


async def request_fnc(ctx: JobContext) -> None:
    """Accept all job requests"""
    logger.info(f"Received job request for room: {ctx.room.name}")
    await ctx.accept()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            request_fnc=request_fnc,
            agent_name="daily-event-insurance",
        ),
    )
