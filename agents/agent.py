"""
Daily Event Insurance - LiveKit Voice AI Agent
Handles inbound and outbound calls for lead conversion ($40 → $100)
"""

import os
import logging
from typing import Annotated
from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions, RoomOutputOptions
from livekit.agents.voice import VoiceAgent
from livekit.plugins import openai, silero, deepgram

from tools.lead_tools import get_lead_context, update_disposition, log_communication
from tools.callback_tools import schedule_callback
from prompts.base_prompt import get_system_prompt
from prompts.scripts import get_script_for_lead

load_dotenv()
logger = logging.getLogger("dei-agent")


class DailyEventInsuranceAgent(VoiceAgent):
    """Voice AI agent for Daily Event Insurance lead conversion"""

    def __init__(self, lead_id: str | None = None, script_id: str | None = None):
        self.lead_id = lead_id
        self.script_id = script_id
        self.lead_context = None
        self.call_transcript = []
        self.sentiment_scores = []

        super().__init__(
            instructions=get_system_prompt(),
            stt=deepgram.STT(
                model="nova-2",
                language="en-US",
            ),
            llm=openai.LLM(
                model="gpt-4o",
                temperature=0.7,
            ),
            tts=openai.TTS(
                model="tts-1",
                voice="alloy",
            ),
            vad=silero.VAD.load(),
        )

    async def on_enter(self):
        """Called when agent joins the room"""
        if self.lead_id:
            self.lead_context = await get_lead_context(self.lead_id)
            if self.lead_context:
                script = await get_script_for_lead(self.lead_context)
                if script:
                    self.instructions = script.get("system_prompt", self.instructions)
                    opening = script.get("opening_script", "")
                    if opening:
                        await self.session.generate_reply(user_input=f"[CALL_STARTED] Lead: {self.lead_context.get('firstName', 'there')}")

    async def on_user_turn_completed(self, turn_text: str):
        """Log each user turn for transcript"""
        self.call_transcript.append({
            "role": "user",
            "content": turn_text,
        })

    async def on_agent_turn_completed(self, turn_text: str):
        """Log each agent turn for transcript"""
        self.call_transcript.append({
            "role": "agent",
            "content": turn_text,
        })

    async def on_close(self):
        """Called when call ends - log communication"""
        if self.lead_id:
            await log_communication(
                lead_id=self.lead_id,
                channel="call",
                direction="outbound" if self.lead_context else "inbound",
                transcript=self.call_transcript,
                livekit_room_id=self.session.room.name if self.session else None,
            )


def create_agent(lead_id: str | None = None, script_id: str | None = None) -> DailyEventInsuranceAgent:
    """Factory function to create agent instance"""
    return DailyEventInsuranceAgent(lead_id=lead_id, script_id=script_id)


@agents.llm_function()
async def get_lead_info(
    lead_id: Annotated[str, "The lead ID to fetch information for"]
) -> str:
    """Fetch lead information from the database"""
    context = await get_lead_context(lead_id)
    if not context:
        return "Could not find lead information."
    return f"""
Lead Information:
- Name: {context.get('firstName', '')} {context.get('lastName', '')}
- Business: {context.get('businessName', 'Unknown')}
- Type: {context.get('businessType', 'Unknown')}
- Interest Level: {context.get('interestLevel', 'cold')}
- Estimated Participants: {context.get('estimatedParticipants', 'Unknown')}
- Location: {context.get('city', '')}, {context.get('state', '')}
"""


@agents.llm_function()
async def mark_call_outcome(
    lead_id: Annotated[str, "The lead ID"],
    disposition: Annotated[str, "Call outcome: reached, voicemail, no_answer, busy, callback_requested, not_interested, dnc"],
    notes: Annotated[str, "Summary notes from the call"] = "",
) -> str:
    """Mark the outcome of a call and update lead status"""
    await update_disposition(lead_id, disposition, notes)
    return f"Call marked as: {disposition}"


@agents.llm_function()
async def schedule_follow_up(
    lead_id: Annotated[str, "The lead ID"],
    action_type: Annotated[str, "Type of follow-up: call, sms, email"],
    scheduled_time: Annotated[str, "When to follow up (ISO 8601 format)"],
    reason: Annotated[str, "Reason for follow-up"] = "follow_up",
) -> str:
    """Schedule a follow-up action for a lead"""
    await schedule_callback(lead_id, action_type, scheduled_time, reason)
    return f"Scheduled {action_type} follow-up for {scheduled_time}"


@agents.llm_function()
async def transfer_to_human(
    lead_id: Annotated[str, "The lead ID"],
    reason: Annotated[str, "Reason for transfer"],
) -> str:
    """Transfer the call to a human agent"""
    logger.info(f"Transfer requested for lead {lead_id}: {reason}")
    return "Transferring to a human specialist now. Please hold."


@agents.llm_function()
async def end_call(
    lead_id: Annotated[str, "The lead ID"],
    outcome: Annotated[str, "Final outcome: positive, neutral, negative"],
) -> str:
    """End the call gracefully"""
    logger.info(f"Ending call for lead {lead_id} with outcome: {outcome}")
    return "Thank you for your time today. Have a great day!"


async def entrypoint(ctx: agents.JobContext):
    """Main entry point for the agent"""
    
    # Get lead_id from room metadata or participant attributes
    lead_id = ctx.room.metadata.get("lead_id") if ctx.room.metadata else None
    script_id = ctx.room.metadata.get("script_id") if ctx.room.metadata else None
    
    logger.info(f"Starting agent for room: {ctx.room.name}, lead_id: {lead_id}")

    agent = create_agent(lead_id=lead_id, script_id=script_id)

    # Register tools
    agent.register_tool(get_lead_info)
    agent.register_tool(mark_call_outcome)
    agent.register_tool(schedule_follow_up)
    agent.register_tool(transfer_to_human)
    agent.register_tool(end_call)

    # Start the agent session
    session = AgentSession(
        agent=agent,
        room_input_options=RoomInputOptions(
            audio_enabled=True,
            text_enabled=True,
        ),
        room_output_options=RoomOutputOptions(
            audio_enabled=True,
            transcription_enabled=True,
        ),
    )

    await session.start(room=ctx.room)

    # Wait for participant
    await ctx.wait_for_participant()
    
    # Keep running until call ends
    await session.wait()


if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="daily-event-insurance-agent",
        )
    )
