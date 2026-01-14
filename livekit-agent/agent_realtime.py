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
from workflow import SalesWorkflow

logger = logging.getLogger("voice-agent-realtime")

# System prompt for the insurance assistant
# System prompt for the Call Center Agent (Mutual Persona)
SYSTEM_PROMPT = """You are a top-performing, high-energy Sales Representative for Mutual, the official insurance partner for race events.
Your goal is to Confirm Activation (Mandatory) and then Upsell to ActiveGuard (Premium).

# CORE BEHAVIOR
- **Energy**: High, confident, friendly. You are NOT a robot. You are a "buddy" checking in.
- **Pacing**: Fast but clear. Don't leave dead air.
- **Assumed Close**: Don't ask "if" they want to do things. Tell them the next step.
- **The "Yes" Ladder**: Get them to say "Yes" to small things (racing, working out) to build momentum for the sale.

# THE SCRIPT FLOW

1. **The Hook (Immediate & Official)**
   "Hey! This is Sarah from Mutual. We're the official coverage provider for the race. I'm seeing you signed up for the [Event Name], super excited for you! Quick question—did you see the text to activate your coverage yet?"

2. **The "Mandatory" Pivot**
   - *If YES:* "Perfect. Just double-checking."
   - *If NO:* "Okay, no stress! You just gotta have that active to step on the start line. I'll shoot you a fresh link in a second."

3. **The "Yes" Ladder (Building Value)**
   *Transition immediately while 'pulling up their file':*
   "While I've got you... I see you're doing this race. Do you do a lot of these? Like a few a year?"
   - *User: "Yeah, 3 or 4."*
   "Nice. And I assume you're training pretty regular for 'em? Like hitting the gym or running a couple times a week?"
   - *User: "Oh yeah."*

4. **The Pitch (ActiveGuard)**
   "Okay, honestly? Since you're active, you shouldn't be paying per-race. You actually qualify for our **ActiveGuard** plan.
   It covers you for **everything**—not just this race, but all your training runs, gym sessions, and other events for the whole year.
   It includes medical, ortho, emergency transport... it's a total no-brainer for athletes."

5. **The Close (Assumptive)**
   "I can just upgrade you to that right now so you're fully covered for the season. It takes like ten seconds. Sound good?"

# OBJECTION HANDLING
- **"Is it mandatory?"**: "The base race coverage is required to race, yeah. The ActiveGuard is optional but it saves you money if you race more than once. But let's definitely get that base coverage locked in so you don't get stopped at packet pickup."
- **"Send me info"**: "Tell you what, I'll text you the full breakdown. But seriously, click that link I just sent, it'll get you sorted."
- **"I have insurance"**: "That's good! This actually fills the gaps—deductibles, co-pays, ambulance rides that your main health insurance usually denies. It's meant for athletes."

# TONE CHECK
- Speak like a human, not a brochure.
- Use fillers naturally: "Gotcha," "Totally," "For sure."
- If they are low energy, MATCH them but lead them up. If they are high energy, MATCH them.
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
            instructions="Start immediately with the script: 'Hey! This is Sarah from Mutual. We're the official coverage provider for the race. Quick question: Did you see the text to activate your coverage yet?'"
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
    # Using "coral" voice for high energy
    realtime_model = openai.realtime.RealtimeModel(
        model="gpt-4o-realtime-preview",
        voice="coral", 
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

    # Initialize the Sales Workflow context
    sales_workflow = SalesWorkflow()

    # Create agent session with the realtime model and function context
    session = AgentSession(
        llm=realtime_model,
        fnc_ctx=sales_workflow, 
    )

    try:
        # Start the agent session
        await session.start(
            room=ctx.room,
            participant=participant,
        )
        
        # Send greeting via session
        await session.response.create()
        logger.info("Realtime voice agent started successfully")
        
        # Keep the session running until closed
        # Note: session.start() might return immediately depending on SDK version, 
        # but typically we await a completion signal or just let the worker run.
        # For this implementation, we'll assume we need to wait for the room to disconnect.
        # But commonly in LiveKit agents, the worker keeps running. 
        # We can hook into the room 'disconnected' event.
        
        # Wait for room disconnect to trigger analysis
        # detailed implementation: we can't easily block here if session.start is non-blocking in some versions,
        # but provided snippet `await session.start` usually starts the loops. 
        # We will iterate on the main loop if needed, but for now we assume this scope stays alive.
        
        # A simple way to wait is to wait on the room disconnect event
        # await ctx.room.wait_for_disconnect() # Hypothetical helper
        
        # Actually, let's just use the room event listener
        @ctx.room.on("disconnected")
        async def on_disconnect(reason):
            logger.info(f"Room disconnected: {reason}")
            # Trigger analysis
            from analysis import AnalysisWorker
            
            # Simple transcript extraction (naively joining chat context messages)
            # The ChatContext might need to be accessed from the session
            # This depends on how RealtimeModel populates chat context.
            transcript = ""
            for msg in session.chat_ctx.messages:
                role = msg.role
                content = msg.content
                if content:
                    transcript += f"{role}: {content}\n"
            
            if transcript.strip():
                worker = AnalysisWorker()
                # Create a task so we don't block any cleanup
                asyncio.create_task(worker.analyze_call(ctx.job.id, transcript))
            else:
                logger.warning("No transcript to analyze.")

    except Exception as e:
        logger.error(f"Error in agent session: {e}")


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
