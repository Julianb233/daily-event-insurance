"""
Callback and scheduling tools for the voice agent
"""

import os
import httpx
import logging
from datetime import datetime

logger = logging.getLogger("dei-agent.tools.callback")

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
API_KEY = os.getenv("AGENT_API_KEY", "")


async def schedule_callback(
    lead_id: str,
    action_type: str,  # call, sms, email
    scheduled_time: str,  # ISO 8601
    reason: str = "follow_up",
    custom_message: str | None = None,
) -> bool:
    """Schedule a follow-up action for a lead"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{API_BASE_URL}/api/admin/scheduled-actions",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "leadId": lead_id,
                    "actionType": action_type,
                    "scheduledFor": scheduled_time,
                    "reason": reason,
                    "customMessage": custom_message,
                },
                timeout=10.0,
            )
            if response.status_code in (200, 201):
                logger.info(f"Scheduled {action_type} for lead {lead_id} at {scheduled_time}")
                return True
            else:
                logger.error(f"Failed to schedule callback: {response.status_code}")
                return False
    except Exception as e:
        logger.error(f"Error scheduling callback: {e}")
        return False


async def cancel_scheduled_action(action_id: str) -> bool:
    """Cancel a scheduled action"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{API_BASE_URL}/api/admin/scheduled-actions/{action_id}",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={"status": "cancelled"},
                timeout=10.0,
            )
            return response.status_code == 200
    except Exception as e:
        logger.error(f"Error cancelling action: {e}")
        return False
