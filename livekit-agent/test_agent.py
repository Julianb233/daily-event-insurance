#!/usr/bin/env python3
"""
Minimal test agent to debug connection issues
"""

import os
import sys
from dotenv import load_dotenv

# Load environment
load_dotenv()

def check_env():
    """Check all required environment variables"""
    print("=" * 50)
    print("ENVIRONMENT CHECK")
    print("=" * 50)

    required = {
        'LIVEKIT_URL': os.getenv('LIVEKIT_URL'),
        'LIVEKIT_API_KEY': os.getenv('LIVEKIT_API_KEY'),
        'LIVEKIT_API_SECRET': os.getenv('LIVEKIT_API_SECRET'),
        'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
    }

    all_ok = True
    for key, value in required.items():
        if value:
            # Mask sensitive values
            display = value[:8] + '...' if len(value) > 8 else value
            print(f"  ✅ {key}: {display}")
        else:
            print(f"  ❌ {key}: NOT SET")
            all_ok = False

    return all_ok

def check_imports():
    """Check all required imports"""
    print("\n" + "=" * 50)
    print("IMPORT CHECK")
    print("=" * 50)

    imports = [
        ('livekit.agents', 'livekit-agents'),
        ('livekit.plugins.openai', 'livekit-plugins-openai'),
    ]

    all_ok = True
    for module, package in imports:
        try:
            __import__(module)
            print(f"  ✅ {module}")
        except ImportError as e:
            print(f"  ❌ {module}: {e}")
            print(f"     Install with: pip install {package}")
            all_ok = False

    return all_ok

def check_openai():
    """Test OpenAI API connection"""
    print("\n" + "=" * 50)
    print("OPENAI API CHECK")
    print("=" * 50)

    try:
        import openai
        client = openai.OpenAI()
        # Simple test call
        response = client.models.list()
        print(f"  ✅ OpenAI API connected")
        print(f"  Models available: {len(list(response.data))}")
        return True
    except Exception as e:
        print(f"  ❌ OpenAI API error: {e}")
        return False

def run_agent():
    """Try to start the agent"""
    print("\n" + "=" * 50)
    print("STARTING AGENT")
    print("=" * 50)

    try:
        from livekit.agents import cli, WorkerOptions, JobContext, AutoSubscribe
        from livekit.plugins import openai as lk_openai
        import logging

        logging.basicConfig(level=logging.INFO)

        async def entrypoint(ctx: JobContext):
            print(f"  🎯 Job received for room: {ctx.room.name}")
            await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
            print(f"  ✅ Connected to room")

            participant = await ctx.wait_for_participant()
            print(f"  👤 Participant joined: {participant.identity}")

        print("  Starting worker...")
        cli.run_app(
            WorkerOptions(
                entrypoint_fnc=entrypoint,
                agent_name="daily-event-insurance",
            ),
        )
    except Exception as e:
        print(f"  ❌ Agent error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("\n🔍 Daily Event Insurance Voice Agent Diagnostic\n")

    env_ok = check_env()
    if not env_ok:
        print("\n⚠️  Fix environment variables first!")
        sys.exit(1)

    imports_ok = check_imports()
    if not imports_ok:
        print("\n⚠️  Install missing packages first!")
        sys.exit(1)

    openai_ok = check_openai()
    if not openai_ok:
        print("\n⚠️  Fix OpenAI API connection first!")
        sys.exit(1)

    print("\n✅ All checks passed! Starting agent...\n")
    run_agent()
