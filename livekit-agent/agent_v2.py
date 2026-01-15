"""
Daily Event Insurance Voice Agent v2
Simplified version using latest LiveKit agents patterns
"""

from dotenv import load_dotenv
load_dotenv()

import logging
from livekit import agents
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
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


async def entrypoint(ctx: JobContext):
    """Voice agent entry point"""
    logger.info(f"🎯 Agent starting for room: {ctx.room.name}")

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    logger.info("✅ Connected to LiveKit room")

    # Wait for user to join
    participant = await ctx.wait_for_participant()
    logger.info(f"👤 User joined: {participant.identity}")

    # Create OpenAI Realtime model
    model = openai.realtime.RealtimeModel(
        voice="coral",
        temperature=0.8,
        modalities=["audio", "text"],
    )

    # Create and start the agent
    assistant = agents.voice.VoicePipelineAgent(
        llm=model,
        chat_ctx=agents.llm.ChatContext().append(
            role="system",
            text=SYSTEM_PROMPT,
        ),
    )

    assistant.start(ctx.room, participant)
    logger.info("🎤 Voice agent is now active!")

    # Initial greeting
    await assistant.say(
        "Hey! This is Sarah from Mutual - the official coverage provider for the race. "
        "Quick question - did you see the text to activate your coverage yet?",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    print("=" * 50)
    print("Daily Event Insurance Voice Agent v2")
    print("=" * 50)

    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="daily-event-insurance",
        ),
    )
