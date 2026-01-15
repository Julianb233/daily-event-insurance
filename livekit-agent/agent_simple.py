"""
Simple Daily Event Insurance Voice Agent
Uses OpenAI Realtime API with minimal dependencies
"""

from dotenv import load_dotenv
load_dotenv()

import logging
import os
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import openai

logger = logging.getLogger("voice-agent")
logger.setLevel(logging.INFO)

SYSTEM_PROMPT = """You are Sarah, a high-energy sales representative for Mutual, the official insurance partner for race events.

Your approach:
- Be confident, friendly, and assumptive
- Don't ask "if" - tell them the next step
- Get them saying "yes" to build momentum

Script:
1. "Hey! This is Sarah from Mutual. We're the official coverage provider for the race. Did you see the text to activate your coverage yet?"
2. If no: "No stress! You need that active to race. I'll send you a fresh link."
3. "Quick question - do you race a few times a year? Do you work out regularly?"
4. "Since you're active, you qualify for our ActiveGuard plan - covers all your training, gym, and races for the whole year. I can upgrade you right now - takes 10 seconds. Sound good?"

Keep responses short (1-2 sentences) since this is voice.
"""


async def entrypoint(ctx: JobContext):
    """Main entry point for the voice agent"""
    logger.info(f"Agent connecting to room: {ctx.room.name}")

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    logger.info("Connected to room, waiting for participant...")

    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Create the agent with OpenAI Realtime
    agent = Agent(
        instructions=SYSTEM_PROMPT,
        voice="coral",  # High-energy voice
    )

    session = AgentSession()

    # Start the session
    await session.start(
        room=ctx.room,
        participant=participant,
        agent=agent,
        room_input_options=openai.realtime.RealtimeModel(
            voice="coral",
            temperature=0.8,
        ),
    )

    logger.info("Voice agent session started")

    # Say hello
    await session.say("Hey! This is Sarah from Mutual. We're the official coverage provider for the race. Quick question - did you see the text to activate your coverage yet?")


if __name__ == "__main__":
    logger.info("Starting Daily Event Insurance Voice Agent...")
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="daily-event-insurance",
        ),
    )
