"""
Daily Event Insurance Voice Agent
A LiveKit Agent that handles voice conversations for insurance support.
"""

import asyncio
import logging
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.voice_assistant import VoiceAssistant
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
- Start by greeting the user warmly"""


def prewarm(proc: JobProcess):
    """Preload models for faster response time"""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Main entry point for the voice agent"""
    logger.info(f"Connecting to room: {ctx.room.name}")

    # Wait for a participant to connect
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Wait for a participant
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Initialize the voice assistant with OpenAI
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=SYSTEM_PROMPT,
    )

    assistant = VoiceAssistant(
        vad=ctx.proc.userdata["vad"],
        stt=openai.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=openai.TTS(voice="nova"),
        chat_ctx=initial_ctx,
    )

    # Start the assistant
    assistant.start(ctx.room, participant)

    # Greet the user
    await assistant.say(
        "Hello! Welcome to Daily Event Insurance. "
        "I'm your insurance specialist. How can I help you today?",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )
