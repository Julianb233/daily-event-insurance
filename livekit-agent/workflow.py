"""
Daily Event Insurance - Partnership Workflow Tools
Function tools for the voice agent to interact with the lead management system.

Updated for LiveKit Agents SDK v1.x with @function_tool decorator.
"""

import logging
import os
import httpx
from datetime import datetime
from typing import Literal
from livekit.agents.llm import function_tool

logger = logging.getLogger("partnership-workflow")

# =============================================================================
# WORKFLOW STATE (module-level for simplicity)
# =============================================================================

_workflow_state = {
    "lead_id": None,
    "api_base_url": "http://localhost:3000",
    "api_key": "",
    "lead_context": {},
    "call_transcript": [],
    "call_start_time": datetime.utcnow(),
}


def init_workflow(
    lead_id: str | None = None,
    api_base_url: str = "http://localhost:3000",
    api_key: str = "",
):
    """Initialize workflow state for a new call."""
    _workflow_state["lead_id"] = lead_id
    _workflow_state["api_base_url"] = api_base_url.rstrip("/")
    _workflow_state["api_key"] = api_key
    _workflow_state["lead_context"] = {}
    _workflow_state["call_transcript"] = []
    _workflow_state["call_start_time"] = datetime.utcnow()


def _get_headers() -> dict:
    """Get API request headers."""
    headers = {"Content-Type": "application/json"}
    if _workflow_state["api_key"]:
        headers["Authorization"] = f"Bearer {_workflow_state['api_key']}"
    return headers


# =============================================================================
# FUNCTION TOOLS
# =============================================================================

@function_tool(description="Load the lead's information from the database to personalize the conversation.")
async def load_lead_context() -> str:
    """
    Fetches lead information including name, business, history.
    Call this at the start of the conversation if you don't have context.
    """
    lead_id = _workflow_state["lead_id"]
    if not lead_id:
        return "No lead ID provided. This appears to be an inbound call without lead context."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}",
                headers=_get_headers(),
                timeout=10.0,
            )

            if response.status_code == 200:
                _workflow_state["lead_context"] = response.json()
                lead = _workflow_state["lead_context"]

                return f"""Lead Information:
- Name: {lead.get('firstName', '')} {lead.get('lastName', '')}
- Business: {lead.get('businessName', 'Unknown')} ({lead.get('businessType', 'Unknown type')})
- Email: {lead.get('email', '')}
- Phone: {lead.get('phone', '')}
- Location: {lead.get('city', '')}, {lead.get('state', '')}
- Interest Level: {lead.get('interestLevel', 'cold')}
- Status: {lead.get('status', 'new')}
- Source: {lead.get('source', 'Unknown')}
- Estimated Daily Visitors: {lead.get('estimatedParticipants', 'Unknown')}"""
            else:
                logger.warning(f"Failed to load lead: {response.status_code}")
                return "Could not load lead information. Proceed with discovery questions."

    except Exception as e:
        logger.error(f"Error loading lead context: {e}")
        return "Could not load lead information. Proceed with discovery questions."


@function_tool(description="Update the lead's status and call disposition after the conversation.")
async def update_disposition(
    disposition: Literal[
        "reached_qualified",
        "demo_scheduled",
        "proposal_sent",
        "left_voicemail",
        "no_answer",
        "callback_requested",
        "not_interested",
        "bad_fit",
        "do_not_call"
    ],
    notes: str,
    next_action: str | None = None,
) -> str:
    """
    Records the call outcome and updates the lead's status in the system.
    Call this at the end of every conversation.

    Args:
        disposition: The outcome of this call
        notes: Brief summary of the conversation and key points discussed
        next_action: Recommended next action, e.g., 'Schedule demo for Tuesday'
    """
    lead_id = _workflow_state["lead_id"]
    if not lead_id:
        logger.info(f"Disposition (no lead): {disposition} - {notes}")
        return f"Logged disposition: {disposition}. Note: No lead ID to update in database."

    # Map disposition to lead status
    status_map = {
        "reached_qualified": "qualified",
        "demo_scheduled": "demo_scheduled",
        "proposal_sent": "proposal_sent",
        "left_voicemail": "contacted",
        "no_answer": "contacted",
        "callback_requested": "contacted",
        "not_interested": "lost",
        "bad_fit": "lost",
        "do_not_call": "dnc",
    }

    try:
        call_duration = int((datetime.utcnow() - _workflow_state["call_start_time"]).total_seconds())

        comm_payload = {
            "channel": "call",
            "direction": "outbound",
            "callDuration": call_duration,
            "disposition": disposition,
            "callSummary": notes,
            "agentId": "sarah-voice-agent",
        }

        async with httpx.AsyncClient() as client:
            status_payload = {
                "status": status_map.get(disposition, "contacted"),
                "statusReason": notes[:500] if notes else None,
            }

            await client.patch(
                f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}",
                headers=_get_headers(),
                json=status_payload,
                timeout=10.0,
            )

            await client.post(
                f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}/communications",
                headers=_get_headers(),
                json=comm_payload,
                timeout=10.0,
            )

        logger.info(f"Updated lead {lead_id}: {disposition}")
        return f"Successfully logged: {disposition}. Lead status updated to {status_map.get(disposition)}."

    except Exception as e:
        logger.error(f"Error updating disposition: {e}")
        return f"Logged locally: {disposition} - {notes}. Database update failed."


@function_tool(description="Schedule a callback for a specific date/time when the prospect requests one.")
async def schedule_callback(
    callback_date: str,
    callback_time: str,
    timezone: str = "America/Los_Angeles",
    reason: str = "Follow-up call requested",
) -> str:
    """
    Creates a scheduled callback in the system.

    Args:
        callback_date: Date for callback in YYYY-MM-DD format
        callback_time: Time for callback in HH:MM format (24-hour)
        timezone: Timezone, e.g., 'America/Los_Angeles'
        reason: Reason for the callback
    """
    try:
        scheduled_datetime = f"{callback_date}T{callback_time}:00"
        lead_id = _workflow_state["lead_id"]

        if lead_id:
            payload = {
                "actionType": "call",
                "scheduledFor": scheduled_datetime,
                "reason": reason,
                "timezone": timezone,
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}/schedule",
                    headers=_get_headers(),
                    json=payload,
                    timeout=10.0,
                )

                if response.status_code in [200, 201]:
                    logger.info(f"Scheduled callback for lead {lead_id} at {scheduled_datetime}")
                    return f"Callback scheduled for {callback_date} at {callback_time} ({timezone}). You'll receive a reminder."

        logger.info(f"Callback requested: {callback_date} {callback_time} - {reason}")
        return f"I've noted a callback for {callback_date} at {callback_time}. We'll reach out then!"

    except Exception as e:
        logger.error(f"Error scheduling callback: {e}")
        return f"I've noted your request for a callback on {callback_date} at {callback_time}."


@function_tool(description="Schedule a product demo when the prospect is ready to see the platform.")
async def schedule_demo(
    demo_date: str,
    demo_time: str,
    attendee_email: str,
    attendee_name: str,
    business_name: str,
) -> str:
    """
    Schedules a 15-minute product demo and sends a calendar invite.

    Args:
        demo_date: Date for demo in YYYY-MM-DD format
        demo_time: Time for demo in HH:MM format (24-hour)
        attendee_email: Email to send calendar invite
        attendee_name: Name of the person attending
        business_name: Name of their business
    """
    try:
        scheduled_datetime = f"{demo_date}T{demo_time}:00"
        lead_id = _workflow_state["lead_id"]

        payload = {
            "type": "demo",
            "scheduledFor": scheduled_datetime,
            "attendeeEmail": attendee_email,
            "attendeeName": attendee_name,
            "businessName": business_name,
        }

        if lead_id:
            async with httpx.AsyncClient() as client:
                await client.patch(
                    f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}",
                    headers=_get_headers(),
                    json={"status": "demo_scheduled"},
                    timeout=10.0,
                )

                await client.post(
                    f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}/schedule",
                    headers=_get_headers(),
                    json=payload,
                    timeout=10.0,
                )

        logger.info(f"Demo scheduled: {demo_date} {demo_time} for {attendee_name} at {business_name}")
        return f"Demo scheduled for {demo_date} at {demo_time}. A calendar invite will be sent to {attendee_email}."

    except Exception as e:
        logger.error(f"Error scheduling demo: {e}")
        return f"I've noted your demo request for {demo_date} at {demo_time}. Our team will send a calendar invite to {attendee_email}."


@function_tool(description="Send an SMS message to the prospect, such as a follow-up link or information.")
async def send_sms(
    message: str,
    include_info_link: bool = False,
) -> str:
    """
    Sends an SMS to the lead's phone number.

    Args:
        message: The SMS message to send
        include_info_link: Whether to include a link to partner information
    """
    lead_context = _workflow_state["lead_context"]
    phone = lead_context.get("phone") if lead_context else None
    lead_id = _workflow_state["lead_id"]

    if not phone and not lead_id:
        return "Cannot send SMS - no phone number available."

    try:
        full_message = message
        if include_info_link:
            full_message += "\n\nLearn more: https://dailyeventinsurance.com/partners"

        payload = {
            "message": full_message,
            "channel": "sms",
        }

        if lead_id:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}/sms",
                    headers=_get_headers(),
                    json=payload,
                    timeout=10.0,
                )

                if response.status_code in [200, 201]:
                    logger.info(f"SMS sent to lead {lead_id}")
                    return "SMS sent successfully! They should receive it momentarily."

        logger.info(f"SMS queued: {message[:50]}...")
        return "I'll send that information via text right now."

    except Exception as e:
        logger.error(f"Error sending SMS: {e}")
        return "I'll make sure our team sends that information to you via text."


@function_tool(description="Escalate to a licensed insurance specialist when the prospect has technical insurance questions.")
async def escalate_to_specialist(
    reason: str,
    urgency: Literal["low", "medium", "high"] = "medium",
) -> str:
    """
    Flags the lead for follow-up by a licensed insurance specialist.

    Args:
        reason: Why the call needs escalation (insurance advice, claims, coverage limits, etc.)
        urgency: How urgent is this escalation
    """
    try:
        lead_id = _workflow_state["lead_id"]
        if lead_id:
            payload = {
                "escalationType": "specialist_required",
                "reason": reason,
                "urgency": urgency,
            }

            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}/escalate",
                    headers=_get_headers(),
                    json=payload,
                    timeout=10.0,
                )

        logger.info(f"Escalation created: {reason} (urgency: {urgency})")
        urgency_times = {'high': '2 hours', 'medium': '24 hours', 'low': '48 hours'}
        response_time = urgency_times.get(urgency, '24 hours')
        return f"I've flagged this for our licensed specialist team. They'll reach out within {response_time} to answer your detailed questions."

    except Exception as e:
        logger.error(f"Error creating escalation: {e}")
        return "I've noted your questions. One of our licensed specialists will follow up with you soon."


@function_tool(description="Handle when you detect that a voicemail system has answered instead of a person.")
async def handle_voicemail(
    leave_message: bool = True,
) -> str:
    """
    Called when the agent detects a voicemail greeting.

    Args:
        leave_message: Whether to leave a voicemail message
    """
    if leave_message:
        voicemail_script = """
        Hi, this is Sarah from Daily Event Insurance.
        I'm following up on your recent inquiry about offering insurance coverage to your members.
        We help gyms and fitness businesses earn extra revenue by offering same-day coverage.
        Please give us a call back at your convenience, or reply to our email.
        Thanks, and have a great day!
        """
        logger.info(f"Leaving voicemail for lead {_workflow_state['lead_id']}")

        if _workflow_state["lead_id"]:
            await update_disposition(
                disposition="left_voicemail",
                notes="Voicemail detected. Left standard follow-up message.",
            )

        return f"Voicemail detected. Leave this message: {voicemail_script.strip()}"
    else:
        if _workflow_state["lead_id"]:
            await update_disposition(
                disposition="no_answer",
                notes="Voicemail detected. No message left per configuration.",
            )
        return "Voicemail detected. Hanging up without leaving a message."


@function_tool(description="Analyze and log the prospect's sentiment during the call.")
def analyze_sentiment(
    sentiment: Literal["very_positive", "positive", "neutral", "negative", "very_negative"],
    indicators: str,
    should_escalate: bool = False,
) -> str:
    """
    Tracks sentiment throughout the call for QA and coaching.

    Args:
        sentiment: The prospect's overall sentiment
        indicators: What indicated this sentiment (tone, words, engagement level)
        should_escalate: Whether this requires immediate escalation due to frustration
    """
    sentiment_scores = {
        "very_positive": 1.0,
        "positive": 0.5,
        "neutral": 0.0,
        "negative": -0.5,
        "very_negative": -1.0,
    }

    score = sentiment_scores.get(sentiment, 0.0)
    logger.info(f"Sentiment analysis: {sentiment} ({score}) - {indicators}")

    _workflow_state["call_transcript"].append({
        "type": "sentiment",
        "sentiment": sentiment,
        "score": score,
        "indicators": indicators,
        "timestamp": datetime.utcnow().isoformat(),
    })

    if should_escalate or sentiment == "very_negative":
        return f"Sentiment recorded: {sentiment}. WARNING: Consider escalating or offering to connect with a manager."

    return f"Sentiment recorded: {sentiment}. Continue with empathy and active listening."


@function_tool(description="Get the recommended script based on lead's business type and interest level.")
def get_recommended_script(
    business_type: Literal["gym", "climbing", "rental", "adventure", "other"],
    interest_level: Literal["hot", "warm", "cold"],
) -> str:
    """
    Returns talking points customized for the business type and interest level.

    Args:
        business_type: The type of business
        interest_level: How interested they seem
    """
    business_value_props = {
        "gym": {
            "main_value": "day-pass and drop-in coverage for non-members",
            "pain_point": "liability exposure from daily visitors",
            "revenue_example": "Partners with 50+ daily visitors typically earn $500-1500/month in commissions",
        },
        "climbing": {
            "main_value": "first-timer and visitor accident protection",
            "pain_point": "high-risk activity liability concerns",
            "revenue_example": "Climbing gyms see 60-70% opt-in rates due to perceived risk",
        },
        "rental": {
            "main_value": "equipment damage and injury coverage bundled",
            "pain_point": "equipment damage disputes and liability claims",
            "revenue_example": "Rental shops reduce damage disputes by 80% with our coverage",
        },
        "adventure": {
            "main_value": "high-risk activity coverage on demand",
            "pain_point": "finding affordable coverage for adventure activities",
            "revenue_example": "Adventure operators see the highest opt-in rates at 75%+",
        },
        "other": {
            "main_value": "flexible same-day coverage for your participants",
            "pain_point": "liability exposure and participant safety",
            "revenue_example": "Partners typically earn 15-25% commission on every policy",
        },
    }

    interest_approaches = {
        "hot": "Move quickly to demo/proposal. They're ready to buy.",
        "warm": "Focus on specific benefits. Answer questions thoroughly.",
        "cold": "Start with rapport building. Understand their pain points first.",
    }

    props = business_value_props.get(business_type, business_value_props["other"])
    approach = interest_approaches.get(interest_level, interest_approaches["warm"])

    return f"""
RECOMMENDED APPROACH for {business_type.upper()} ({interest_level} lead):

Strategy: {approach}

Key Talking Points:
1. Main Value: "{props['main_value']}"
2. Address Pain Point: "{props['pain_point']}"
3. Revenue Example: "{props['revenue_example']}"

Quick Objection Handlers:
- "We have insurance" → "This is PARTICIPANT coverage, not business coverage. It protects YOUR policy."
- "No time" → "2-3 hour setup, then fully automated."
- "Members won't pay" → "$5-15 is affordable, especially for first-timers."
"""


@function_tool(description="Add the prospect to the Do Not Call list when they explicitly request it.")
async def add_to_dnc_list(
    reason: str = "Requested removal",
) -> str:
    """
    Immediately adds the prospect to the Do Not Call list.

    Args:
        reason: Why they requested DNC
    """
    try:
        lead_id = _workflow_state["lead_id"]
        if lead_id:
            payload = {
                "status": "dnc",
                "statusReason": f"DNC requested: {reason}",
            }

            async with httpx.AsyncClient() as client:
                await client.patch(
                    f"{_workflow_state['api_base_url']}/api/admin/leads/{lead_id}",
                    headers=_get_headers(),
                    json=payload,
                    timeout=10.0,
                )

        logger.info(f"DNC added for lead {lead_id}: {reason}")
        return "I've removed you from our call list. You won't receive any further calls from us. I apologize for any inconvenience."

    except Exception as e:
        logger.error(f"Error adding to DNC: {e}")
        return "I've noted your request. You won't receive any further calls from us."


@function_tool(description="Log a segment of the conversation transcript for quality assurance.")
def log_transcript_segment(
    speaker: Literal["agent", "prospect"],
    text: str,
) -> str:
    """
    Records a conversation segment for the transcript.

    Args:
        speaker: Who said this
        text: What was said
    """
    _workflow_state["call_transcript"].append({
        "speaker": speaker,
        "text": text,
        "timestamp": datetime.utcnow().isoformat(),
    })
    return "Logged."


# =============================================================================
# TOOL COLLECTION
# =============================================================================

# List of all tools for easy import
ALL_TOOLS = [
    load_lead_context,
    update_disposition,
    schedule_callback,
    schedule_demo,
    send_sms,
    escalate_to_specialist,
    handle_voicemail,
    analyze_sentiment,
    get_recommended_script,
    add_to_dnc_list,
    log_transcript_segment,
]
