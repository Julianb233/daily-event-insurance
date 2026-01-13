"""
Daily Event Insurance Voice Agent - Realtime API Version
Uses OpenAI Realtime API for natural voice conversations.
"""

import logging
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    RoomInputOptions,
)
from livekit.plugins import openai, silero

logger = logging.getLogger("voice-agent")

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
- Greet the user warmly when they first connect"""


def prewarm(proc: JobProcess):
    """Preload VAD model for faster response time"""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Main entry point for the voice agent"""
    logger.info(f"Connecting to room: {ctx.room.name}")

    # Connect to the room
    await ctx.connect()

    # Wait for a participant to join
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Create an agent session with OpenAI Realtime API
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(
            voice="nova",
            temperature=0.7,
            instructions=SYSTEM_PROMPT,
        ),
        vad=ctx.proc.userdata["vad"],
    )

    # Start the session with the participant
    await session.start(
        room=ctx.room,
        participant=participant,
        room_input_options=RoomInputOptions(
            noise_cancellation=True,
        ),
    )

    # Generate initial greeting
    await session.generate_reply(
        instructions="Greet the user warmly and ask how you can help them today with their insurance questions."
    )

    logger.info("Agent session started, waiting for conversation...")


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
