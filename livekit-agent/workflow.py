import logging
import os
from typing import Annotated, Literal
from livekit.agents import llm

logger = logging.getLogger("sales-workflow")

# Placeholder trigger link as requested
TRIGGER_LINK_PLACEHOLDER = "https://mutual.insurance/activate/trigger?ref=voice_agent"

class SalesWorkflow(llm.FunctionContext):
    """
    Workflow/Decision tools for the Mutual Sales Agent.
    Handles data lookup, action triggering (links), and feedback logging.
    """

    def __init__(self):
        super().__init__()
        self._user_context = {}

    @llm.ai_callable(description="Check if the user has activated their mandatory race coverage.")
    def check_user_activation(
        self, 
        phone_number: Annotated[str, llm.TypeInfo(description="The user's phone number")]
    ) -> str:
        logger.info(f"Checking activation for {phone_number}")
        # MOCK: Simulate "Not Activated" to force the script flow
        return "Status: NOT ACTIVATED. Activation is required."

    @llm.ai_callable(description="Send the specific interaction trigger link to the user.")
    def send_trigger_link(
        self,
        phone_number: Annotated[str, llm.TypeInfo(description="The user's phone number")],
        action_type: Annotated[Literal["activation", "upsell"], llm.TypeInfo(description="The type of link to send")]
    ) -> str:
        """
        Sends a placeholder trigger link as an action to get them to sign up.
        """
        link = f"{TRIGGER_LINK_PLACEHOLDER}&action={action_type}&phone={phone_number}"
        logger.info(f"ACTION: Sending Trigger Link to {phone_number} -> {link}")
        
        # In a real scenario, this would call the SMS API
        return f"Trigger link sent successfully: {link}"

    @llm.ai_callable(description="Log the call outcome and qualification stats to the database (Feedback Loop).")
    def log_call_outcome(
        self,
        outcome: Annotated[Literal['activated', 'qualified_upsell', 'follow_up_needed', 'rejected'], llm.TypeInfo(description="Result of the call")],
        races_per_year: Annotated[int, llm.TypeInfo(description="Races per year (from user)")],
        workouts_per_week: Annotated[int, llm.TypeInfo(description="Workouts per week (from user)")],
        notes: Annotated[str, llm.TypeInfo(description="Brief summary of user sentiment")]
    ) -> str:
        """
        Tracks metrics and stats for the dashboard feedback loop.
        """
        logger.info(f"FEEDBACK LOOP: Outcome={outcome}, Races={races_per_year}, Workouts={workouts_per_week}, Notes={notes}")
        
        # TODO: Implement actual DB insert using supabase-py or REST API
        # connection = os.getenv("DATABASE_URL")
        # For now, we log to system stdout which is captured by journalctl
        
        is_qualified = races_per_year >= 2 and workouts_per_week >= 2
        return f"Call metrics logged. Qualified for Upsell: {is_qualified}. Outcome recorded."
