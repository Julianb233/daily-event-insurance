"""
Daily Event Insurance Voice Agent (Hybrid Realtime + TTS Version)
Uses OpenAI Realtime API for speech comprehension with separate TTS for output.

Benefits:
- Realtime model understands emotional context and verbal cues
- Separate TTS gives you control over voice output
- Supports scripted speech via say() method
- Best of both worlds approach
"""

import logging
from livekit.agents import (
    Agent,
    AgentSession,
    AutoSubscribe,
    JobContext,
    RoomInputOptions,
    WorkerOptions,
    cli,
)
from livekit.plugins import openai
from openai.types.realtime import realtime_audio_input_turn_detection

logger = logging.getLogger("voice-agent-hybrid")

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
"""


class InsuranceAgent(Agent):
    """Daily Event Insurance voice agent with hybrid realtime + TTS"""

    def __init__(self):
        super().__init__(
            instructions=SYSTEM_PROMPT,
        )

    async def on_enter(self):
        """Called when the agent session starts - use say() for scripted greeting"""
        await self.session.say(
            "Hello! Welcome to Daily Event Insurance. "
            "I'm your insurance specialist. How can I help you today?",
            allow_interruptions=True,
        )


async def entrypoint(ctx: JobContext):
    """Main entry point for the hybrid voice agent"""
    logger.info(f"Connecting to room: {ctx.room.name}")

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for a participant
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Create the realtime model with text-only output modality
    # This lets us use the realtime model for understanding speech
    # while using a separate TTS for output
    realtime_model = openai.realtime.RealtimeModel(
        model="gpt-4o-realtime-preview",
        modalities=["text"],  # Text output only - TTS handles speech
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

    # Create agent session with realtime model + separate TTS
    # Using OpenAI TTS for consistent high-quality voice
    session = AgentSession(
        llm=realtime_model,
        tts=openai.TTS(voice="nova"),
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

    logger.info("Hybrid realtime voice agent started successfully")


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        ),
    )
