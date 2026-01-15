"""
Daily Event Insurance Voice Agent
Using LiveKit Agents SDK v1.x with OpenAI Realtime API
"""

from dotenv import load_dotenv
load_dotenv()

import logging
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import openai

logger = logging.getLogger("voice-agent")
logging.basicConfig(level=logging.INFO)

SYSTEM_PROMPT = """You are Sarah, a high-energy sales representative for Mutual, the official insurance partner for race events.

Your approach:
- Be confident, friendly, and assumptive
- Don't ask "if" - tell them the next step
- Get them saying "yes" to build momentum
- Keep responses SHORT (1-2 sentences max)

Your script flow:
1. Greet: "Hey! This is Sarah from Mutual - we're the official coverage provider for the race. Did you see the text to activate your coverage?"
2. If they haven't: "No stress! I'll shoot you a fresh link. You need that active before race day."
3. Build rapport: "Do you race a few times a year? Work out regularly?"
4. Pitch: "Since you're active, you qualify for ActiveGuard - covers ALL your training and races for the year. Want me to upgrade you real quick?"
5. Close: "Perfect, takes like 10 seconds. What's your email?"

Be natural - use "gotcha", "totally", "for sure". Match their energy.
"""


async def entrypoint(ctx: agents.JobContext):
    """Voice agent entry point"""
    logger.info(f"Agent starting for room: {ctx.room.name}")

    # Connect to the room
    await ctx.connect()
    logger.info("Connected to LiveKit room")

    # Create the agent session with OpenAI Realtime
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(
            voice="coral",
            temperature=0.8,
        )
    )

    # Start the session with our agent
    await session.start(
        room=ctx.room,
        agent=Agent(instructions=SYSTEM_PROMPT),
    )

    logger.info("Voice agent session started")

    # Generate initial greeting
    await session.generate_reply(
        instructions="Greet the user with your opening line about being Sarah from Mutual and ask if they saw the text to activate their coverage."
    )


if __name__ == "__main__":
    print("=" * 50)
    print("Daily Event Insurance Voice Agent")
    print("=" * 50)

    agents.cli.run_app(
        agents.WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="daily-event-insurance",
        ),
    )
