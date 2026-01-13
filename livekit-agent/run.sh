#!/bin/bash
# Run the voice agent locally

cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Load environment variables
export $(cat .env | xargs)

# Run the agent
python agent_realtime.py dev
