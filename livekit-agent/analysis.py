
import os
import json
import logging
import asyncio
from typing import Dict, Any, List
from supabase import create_client, Client

# Set up logging
logger = logging.getLogger("analysis-worker")
logger.setLevel(logging.INFO)

class AnalysisWorker:
    """
    Worker that analyzes voice call transcripts using an LLM (OpenAI)
    and updates the Supabase record with sentiment and feedback.
    """
    
    def __init__(self):
        self.url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        self.key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        
        if not self.url or not self.key:
            logger.warning("Supabase credentials not found. Analysis will not be saved.")
            self.supabase = None
        else:
            self.supabase: Client = create_client(self.url, self.key)

    async def analyze_call(self, call_id: str, transcript: str):
        """
        Analyzes the call transcript and updates the database.
        This is designed to be fire-and-forget or run in background.
        """
        if not self.supabase or not transcript:
            logger.warning("Skipping analysis: No Supabase client or empty transcript.")
            return

        logger.info(f"Starting analysis for call {call_id}...")

        try:
            # 1. Perform LLM Analysis
            analysis_result = await self._query_llm_for_analysis(transcript)
            
            # 2. Update Supabase
            data = {
                "sentiment_score": analysis_result.get("sentiment_score"),
                "sentiment_label": analysis_result.get("sentiment_label"),
                "call_summary": analysis_result.get("call_summary"),
                "transcript_summary": analysis_result.get("transcript_summary"),
                "improvement_items": analysis_result.get("improvement_items", []),
            }
            
            # Using table 'voice_call_logs'
            self.supabase.table("voice_call_logs").update(data).eq("id", call_id).execute()
            
            logger.info(f"Analysis complete for call {call_id}. Data saved.")

        except Exception as e:
            logger.error(f"Error analyzing call {call_id}: {e}")

    async def _query_llm_for_analysis(self, transcript: str) -> Dict[str, Any]:
        """
        Mockable LLM query function. In production, this uses OpenAI/Gemini.
        Using OpenAI here since we already have the SDK for the agent.
        """
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI() # Uses OPENAI_API_KEY from env
        
        system_prompt = """You are a QA Specialist for an Insurance Sales Call Center.
Analyze the following call transcript. 
Return a JSON object with:
- sentiment_score (1-10, 10 is best)
- sentiment_label ('positive', 'neutral', 'negative')
- call_summary (1-2 sentences)
- transcript_summary (Brief bullet points of flow)
- improvement_items (Array of specific things the agent could improve, e.g. "Missed objection", "Too pushy")
"""

        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"TRANSCRIPT:\n{transcript}"}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            logger.error(f"LLM API Error: {e}")
            # Fallback for error cases
            return {
                "sentiment_score": 0,
                "sentiment_label": "neutral",
                "call_summary": "Analysis failed.",
                "improvement_items": ["System Error"]
            }
