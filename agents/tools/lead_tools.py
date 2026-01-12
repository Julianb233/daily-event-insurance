"""
Lead management tools for the voice agent
Communicates with the Next.js API backend
"""

import os
import httpx
import logging
from typing import Any

logger = logging.getLogger("dei-agent.tools.lead")

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
API_KEY = os.getenv("AGENT_API_KEY", "")


async def get_lead_context(lead_id: str) -> dict[str, Any] | None:
    """Fetch lead information from the API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{API_BASE_URL}/api/admin/leads/{lead_id}",
                headers={"Authorization": f"Bearer {API_KEY}"},
                timeout=10.0,
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("data")
            else:
                logger.error(f"Failed to fetch lead {lead_id}: {response.status_code}")
                return None
    except Exception as e:
        logger.error(f"Error fetching lead context: {e}")
        return None


async def update_disposition(
    lead_id: str, 
    disposition: str, 
    notes: str = ""
) -> bool:
    """Update lead disposition after call"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{API_BASE_URL}/api/admin/leads/{lead_id}",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "status": _disposition_to_status(disposition),
                    "statusReason": notes,
                },
                timeout=10.0,
            )
            return response.status_code == 200
    except Exception as e:
        logger.error(f"Error updating disposition: {e}")
        return False


async def log_communication(
    lead_id: str,
    channel: str,
    direction: str,
    transcript: list[dict] | None = None,
    livekit_room_id: str | None = None,
    disposition: str | None = None,
    call_duration: int | None = None,
) -> bool:
    """Log a communication event"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{API_BASE_URL}/api/admin/leads/{lead_id}/communications",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "channel": channel,
                    "direction": direction,
                    "callTranscript": transcript,
                    "livekitRoomId": livekit_room_id,
                    "disposition": disposition,
                    "callDuration": call_duration,
                },
                timeout=10.0,
            )
            return response.status_code in (200, 201)
    except Exception as e:
        logger.error(f"Error logging communication: {e}")
        return False


def _disposition_to_status(disposition: str) -> str:
    """Map call disposition to lead status"""
    mapping = {
        "reached": "contacted",
        "voicemail": "contacted",
        "no_answer": "new",
        "busy": "new",
        "callback_requested": "contacted",
        "not_interested": "lost",
        "dnc": "dnc",
        "qualified": "qualified",
        "demo_scheduled": "demo_scheduled",
    }
    return mapping.get(disposition, "contacted")
