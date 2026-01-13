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
from livekit.plugins import openai
from openai.types.realtime import realtime_audio_input_turn_detection

logger = logging.getLogger("voice-agent-realtime")

# System prompt for the insurance assistant
SYSTEM_PROMPT = """You are a friendly and knowledgeable insurance specialist for Daily Event Insurance.
You help partners and potential partners understand our event insurance platform.

Key facts about Daily Event Insurance:
- We provide liability insurance for event operators, gyms, climbing facilities, and adventure businesses
- Partners earn commissions by offering our insurance to their customers
- Commission rates range from 25% to 37.5% based on volume ($10-$15 per participant)
- Our platform offers instant quotes and same-day coverage
- We handle all claims and customer support
- 100% of participants are covered (coverage is required)

Commission tiers:
- 0-999 participants: 25% ($10/participant)
- 1,000-2,499: 27.5% ($11/participant)
- 2,500-4,999: 30% ($12/participant)
- 5,000-9,999: 32.5% ($13/participant)
- 10,000-24,999: 35% ($14/participant)
- 25,000+: 37.5% ($15/participant)

Multi-location bonuses:
- 2-5 locations: +$0.50/participant
- 6-10 locations: +$1.00/participant
- 11-25 locations: +$1.50/participant
- 25+ locations: +$2.00/participant

Communication style:
- Be conversational, warm, and professional
- Keep responses concise (2-3 sentences) since this is a voice conversation
- Ask clarifying questions when needed
- Be helpful and solution-oriented

When the conversation starts, greet the user warmly.
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
        room_input_options=RoomInputOptions(
            noise_cancellation=True,
        ),
    )

    # Start the agent session
    await session.start(
        agent=InsuranceAgent(),
        room=ctx.room,
        participant=participant,
    )

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
