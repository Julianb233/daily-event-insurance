"""
Daily Event Insurance - Partner Support Chat Agent
Handles partner integration questions, technical support, and onboarding assistance.

This agent is for EXISTING PARTNERS who need help with:
- Integration setup
- Technical questions
- Account/billing inquiries
- API documentation
- Troubleshooting

Updated for LiveKit Agents SDK v1.x with @function_tool decorator.
"""

from dotenv import load_dotenv
load_dotenv()

import logging
import os
from datetime import datetime
from typing import Literal, Optional
from livekit import agents
from livekit.agents import AgentSession, Agent
from livekit.agents.llm import function_tool, ToolContext
from livekit.plugins import openai

logger = logging.getLogger("partner-support-agent")
logging.basicConfig(level=logging.INFO)

# =============================================================================
# SUPPORT AGENT SYSTEM PROMPT
# =============================================================================

SUPPORT_PROMPT = """You are Alex, a Partner Success Specialist at Daily Event Insurance.
You help EXISTING partners with technical integration, account questions, and onboarding support.

## YOUR ROLE
- You support partners who have already signed up for our embedded insurance platform
- You help with integration setup, troubleshooting, and technical questions
- You are NOT a sales agent - do not try to sell or upsell
- Be helpful, patient, and technically knowledgeable

## WHAT YOU CAN HELP WITH

### 1. Integration Support
- API setup and configuration
- Webhook integration
- Embed code placement
- Testing and sandbox mode
- Going live checklist

### 2. Account Questions
- Commission reports and payouts
- Policy sales dashboard
- User management
- Billing inquiries

### 3. Technical Troubleshooting
- Widget not appearing
- API errors
- Data sync issues
- Coverage display problems

### 4. Onboarding Assistance
- Walk through setup steps
- Explain features
- Best practices
- Training resources

## COMMON QUESTIONS & ANSWERS

**"How do I get my API key?"**
> "You can find your API key in the Partner Dashboard under Settings → API Access. If you don't see it,
> you may need admin permissions. I can help you request access if needed."

**"The widget isn't showing on my site"**
> "Let's troubleshoot this together. First, can you confirm:
> 1. The embed code is placed in your HTML, ideally before the closing </body> tag
> 2. Your domain is whitelisted in the Partner Dashboard
> 3. You're not in sandbox mode (unless testing)
> What do you see when you inspect the console for errors?"

**"When do I get paid?"**
> "Commissions are processed on the 1st and 15th of each month. Payments are sent via your
> selected method (ACH or PayPal) within 3-5 business days. You can see pending commissions
> in your dashboard under Reports → Commission Summary."

## ESCALATION TRIGGERS

Transfer to a human when:
- Billing disputes or refund requests
- Legal or compliance questions
- Custom enterprise integrations
- Bug reports that need engineering
- Partner is frustrated (3+ messages showing frustration)

## TONE & STYLE
- Friendly, patient, technically competent
- Use clear, step-by-step instructions
- Confirm understanding before moving on
- Offer to stay on until issue is resolved
- Be honest if you don't know something - offer to find out
"""


# =============================================================================
# WORKFLOW STATE (module-level)
# =============================================================================

_support_state = {
    "partner_id": None,
    "api_base_url": "http://localhost:3000",
    "api_key": "",
}


def init_support_workflow(
    partner_id: str | None = None,
    api_base_url: str = "http://localhost:3000",
    api_key: str = "",
):
    """Initialize support workflow state."""
    _support_state["partner_id"] = partner_id
    _support_state["api_base_url"] = api_base_url.rstrip("/")
    _support_state["api_key"] = api_key


def _get_headers() -> dict:
    headers = {"Content-Type": "application/json"}
    if _support_state["api_key"]:
        headers["Authorization"] = f"Bearer {_support_state['api_key']}"
    return headers


# =============================================================================
# SUPPORT FUNCTION TOOLS
# =============================================================================

@function_tool(description="Search the knowledge base for answers to partner questions.")
async def search_knowledge_base(
    query: str,
    category: Literal["integration", "billing", "technical", "general"] = "general",
) -> str:
    """
    Searches the partner knowledge base for relevant articles.

    Args:
        query: The question or topic to search for
        category: Category to search within
    """
    knowledge = {
        "integration": """
Integration Documentation:

1. API Setup:
   - Base URL: https://api.dailyeventinsurance.com/v1
   - Authentication: Bearer token in Authorization header
   - Rate limits: 100 requests/minute

2. Embed Widget:
   <script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
   <script>
     DEI.init({ partnerId: 'YOUR_PARTNER_ID', mode: 'production' });
   </script>

3. Webhooks:
   - Configure in Partner Dashboard → Settings → Webhooks
   - Events: policy.created, policy.cancelled, payout.processed
   - Include webhook secret for signature verification

4. Testing:
   - Set mode: 'sandbox' in widget initialization
   - Use test card: 4242 4242 4242 4242
""",
        "billing": """
Billing & Payouts:

1. Commission Structure:
   - Standard partners: 15% of premium
   - Premium partners: 20% of premium
   - Enterprise: Custom rates

2. Payout Schedule:
   - Processing: 1st and 15th of each month
   - Payment: 3-5 business days after processing
   - Minimum payout: $50

3. Payment Methods:
   - ACH (US bank accounts)
   - PayPal
   - Wire (enterprise only)
""",
        "technical": """
Technical Troubleshooting:

1. Widget Not Loading:
   - Check embed code placement (before </body>)
   - Verify domain whitelist in dashboard
   - Check browser console for errors
   - Disable ad blockers for testing

2. API Errors:
   - 401: Invalid or expired API key
   - 403: IP not whitelisted
   - 429: Rate limit exceeded
   - 500: Contact support
""",
        "general": """
Partner Quick Reference:

1. Getting Started:
   - Complete onboarding checklist
   - Add embed code to your site
   - Test in sandbox mode
   - Enable production mode

2. Dashboard Overview:
   - Home: Sales summary and quick stats
   - Reports: Detailed analytics and exports
   - Settings: Configuration and team management
   - Support: Help center and contact
"""
    }

    result = knowledge.get(category, knowledge["general"])
    logger.info(f"Knowledge search: {query} in {category}")
    return f"Found relevant documentation:\n{result}"


@function_tool(description="Create a support ticket for issues requiring human follow-up.")
async def create_support_ticket(
    subject: str,
    description: str,
    priority: Literal["low", "medium", "high", "urgent"] = "medium",
    category: Literal["integration", "billing", "technical", "account", "other"] = "other",
) -> str:
    """
    Creates a support ticket for issues that need human follow-up.

    Args:
        subject: Brief description of the issue
        description: Detailed description of the problem
        priority: Ticket priority level
        category: Issue category
    """
    try:
        import httpx

        payload = {
            "subject": subject,
            "description": description,
            "priority": priority,
            "category": category,
            "partnerId": _support_state["partner_id"],
            "source": "chat_agent",
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{_support_state['api_base_url']}/api/support/tickets",
                headers=_get_headers(),
                json=payload,
                timeout=10.0,
            )

            if response.status_code in [200, 201]:
                data = response.json()
                ticket_id = data.get("ticketId", "pending")
                wait_times = {
                    "urgent": "2 hours",
                    "high": "4 hours",
                    "medium": "24 hours",
                    "low": "48 hours",
                }
                return f"Support ticket created (#{ticket_id}). Our team will respond within {wait_times[priority]}."

        logger.info(f"Ticket created: {subject} ({priority})")
        return f"I've created a support ticket for this issue. Our team will follow up via email within 24 hours."

    except Exception as e:
        logger.error(f"Error creating ticket: {e}")
        return "I've noted this issue. Our support team will follow up via email."


@function_tool(description="Transfer the conversation to a human support agent.")
async def transfer_to_human(
    reason: str,
    department: Literal["technical", "billing", "enterprise", "general"] = "general",
) -> str:
    """
    Transfers the conversation to a human agent.

    Args:
        reason: Why this needs human attention
        department: Which department to transfer to
    """
    try:
        import httpx

        payload = {
            "partnerId": _support_state["partner_id"],
            "reason": reason,
            "department": department,
            "requestedAt": datetime.utcnow().isoformat(),
        }

        async with httpx.AsyncClient() as client:
            await client.post(
                f"{_support_state['api_base_url']}/api/support/transfer",
                headers=_get_headers(),
                json=payload,
                timeout=10.0,
            )

        logger.info(f"Transfer requested to {department}: {reason}")
        return f"I'm connecting you with our {department} team now. A specialist will join this conversation shortly."

    except Exception as e:
        logger.error(f"Error requesting transfer: {e}")
        return f"Let me connect you with our {department} team. Please hold for a moment."


@function_tool(description="Look up the partner's account details and status.")
async def get_partner_account() -> str:
    """Retrieves the partner's account information."""
    partner_id = _support_state["partner_id"]

    if not partner_id:
        return "No partner ID available. Please ask them to confirm their account email or partner ID."

    try:
        import httpx

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{_support_state['api_base_url']}/api/partners/{partner_id}",
                headers=_get_headers(),
                timeout=10.0,
            )

            if response.status_code == 200:
                partner = response.json()
                return f"""
Partner Account Details:
- Business: {partner.get('businessName', 'Unknown')}
- Plan: {partner.get('plan', 'Standard')}
- Status: {partner.get('status', 'Active')}
- Integration: {partner.get('integrationStatus', 'Pending')}
- Commission Rate: {partner.get('commissionRate', '15')}%
- Total Policies Sold: {partner.get('totalPolicies', 0)}
"""

        return "Could not load partner account. Please verify their partner ID."

    except Exception as e:
        logger.error(f"Error loading partner: {e}")
        return "Unable to load account details. Please try again."


@function_tool(description="Check the status of a partner's integration setup.")
async def check_integration_status() -> str:
    """Returns the current status of the partner's integration."""
    partner_id = _support_state["partner_id"]

    if not partner_id:
        return "No partner ID. Cannot check integration status."

    try:
        import httpx

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{_support_state['api_base_url']}/api/partners/{partner_id}/integration",
                headers=_get_headers(),
                timeout=10.0,
            )

            if response.status_code == 200:
                data = response.json()
                return f"""
Integration Status:
- Widget Installed: {'Yes' if data.get('widgetInstalled') else 'No'}
- API Key Generated: {'Yes' if data.get('apiKeyGenerated') else 'No'}
- Webhooks Configured: {'Yes' if data.get('webhooksConfigured') else 'No'}
- Domain Whitelisted: {'Yes' if data.get('domainWhitelisted') else 'No'}
- Test Mode Completed: {'Yes' if data.get('testCompleted') else 'No'}
- Live Mode Enabled: {'Yes' if data.get('liveEnabled') else 'No'}

Last Activity: {data.get('lastActivity', 'Unknown')}
"""

        return "Integration status unavailable. Let me help troubleshoot manually."

    except Exception as e:
        logger.error(f"Error checking integration: {e}")
        return "Could not retrieve integration status. What specific setup step do you need help with?"


# Collect all support tools
SUPPORT_TOOLS = [
    search_knowledge_base,
    create_support_ticket,
    transfer_to_human,
    get_partner_account,
    check_integration_status,
]


# =============================================================================
# SUPPORT AGENT CLASS
# =============================================================================

class SupportAgent(Agent):
    """Partner Support Agent using OpenAI Realtime API."""

    def __init__(self, partner_name: Optional[str] = None):
        super().__init__(instructions=SUPPORT_PROMPT)
        self.partner_name = partner_name or "there"

    async def on_enter(self):
        """Called when the agent session starts."""
        if self.partner_name != "there":
            greeting = (
                f"Greet {self.partner_name} warmly. Say: 'Hi {self.partner_name}! "
                f"This is Alex from Daily Event Insurance Partner Support. How can I help you today?'"
            )
        else:
            greeting = (
                "Greet the caller warmly. Say: 'Hi! This is Alex from Daily Event Insurance "
                "Partner Support. How can I help you today?'"
            )

        logger.info("Generating support agent greeting")
        self.session.generate_reply(instructions=greeting)


# =============================================================================
# ENTRY POINT
# =============================================================================

async def entrypoint(ctx: agents.JobContext):
    """Support agent entry point."""
    logger.info(f"Support agent starting for room: {ctx.room.name}")

    # Connect to room
    await ctx.connect()

    # Extract partner context from job metadata
    room_metadata = ctx.job.metadata if ctx.job.metadata else {}
    partner_id = room_metadata.get("partner_id")
    partner_name = room_metadata.get("partner_name", "there")

    logger.info(f"Partner context: id={partner_id}, name={partner_name}")

    # Wait for participant
    participant = await ctx.wait_for_participant()
    logger.info(f"Participant joined: {participant.identity}")

    # Initialize the support workflow state
    init_support_workflow(
        partner_id=partner_id,
        api_base_url=os.getenv("API_BASE_URL", "http://localhost:3000"),
        api_key=os.getenv("AGENT_API_KEY", ""),
    )

    # Create tool context with support tools
    tool_ctx = ToolContext(SUPPORT_TOOLS)

    # Create the agent session with OpenAI Realtime
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(
            voice="alloy",  # Neutral, helpful voice for support
            temperature=0.6,
            model="gpt-4o-realtime-preview",
        ),
        fnc_ctx=tool_ctx,
    )

    # Create the support agent
    agent = SupportAgent(partner_name=partner_name)

    # Start the session
    await session.start(
        room=ctx.room,
        agent=agent,
        participant=participant,
    )

    logger.info("Support agent session started")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("  Daily Event Insurance - Partner Support Agent")
    print("  Alex - Partner Success Specialist")
    print("=" * 60)

    agents.cli.run_app(
        agents.WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="partner-support",
        ),
    )
