"""
Script selection tools for the voice agent
Selects appropriate script based on lead context
"""

import os
import httpx
import logging
from typing import Any

logger = logging.getLogger("dei-agent.tools.script")

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
API_KEY = os.getenv("AGENT_API_KEY", "")


async def select_script(
    business_type: str | None = None,
    interest_level: str = "cold",
    state: str | None = None,
) -> dict[str, Any] | None:
    """Select the best script based on lead attributes"""
    try:
        async with httpx.AsyncClient() as client:
            params = {
                "businessType": business_type,
                "interestLevel": interest_level,
                "geographicRegion": state,
                "activeOnly": "true",
            }
            # Filter out None values
            params = {k: v for k, v in params.items() if v is not None}
            
            response = await client.get(
                f"{API_BASE_URL}/api/admin/scripts",
                headers={"Authorization": f"Bearer {API_KEY}"},
                params=params,
                timeout=10.0,
            )
            if response.status_code == 200:
                data = response.json()
                scripts = data.get("data", [])
                if scripts:
                    # Return highest priority script
                    return max(scripts, key=lambda s: s.get("priority", 0))
            return None
    except Exception as e:
        logger.error(f"Error selecting script: {e}")
        return None


async def get_script_by_id(script_id: str) -> dict[str, Any] | None:
    """Fetch a specific script by ID"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{API_BASE_URL}/api/admin/scripts/{script_id}",
                headers={"Authorization": f"Bearer {API_KEY}"},
                timeout=10.0,
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("data")
            return None
    except Exception as e:
        logger.error(f"Error fetching script: {e}")
        return None
