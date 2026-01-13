# Daily Event Insurance - LiveKit Voice Agent

This is the server-side voice agent that handles AI conversations for the Daily Event Insurance platform.

## Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   cd livekit-agent
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the agent:**
   ```bash
   python agent.py dev
   ```

## Deploy to LiveKit Cloud

### Option 1: Using LiveKit CLI (Recommended)

1. **Authenticate with LiveKit Cloud:**
   ```bash
   lk cloud auth
   ```

2. **Create and deploy the agent:**
   ```bash
   lk agent create --name "daily-insurance-agent"
   lk agent deploy
   ```

### Option 2: Deploy via GitHub Integration

1. Push this directory to a GitHub repository
2. Go to https://cloud.livekit.io
3. Connect your GitHub repository
4. LiveKit Cloud will automatically deploy on push

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | Your LiveKit Cloud WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `OPENAI_API_KEY` | OpenAI API key (for GPT-4 and TTS) |
| `DEEPGRAM_API_KEY` | Deepgram API key (for speech-to-text) |

## How It Works

1. User clicks "Talk to Specialist" on the website
2. Frontend requests a LiveKit token from `/api/voice/realtime`
3. Frontend connects to LiveKit room
4. This agent automatically joins the same room
5. Agent listens to user speech → converts to text → processes with AI → speaks response

## Customization

Edit `agent.py` to modify:
- `SYSTEM_PROMPT` - The AI's personality and knowledge
- `openai.TTS(voice="nova")` - Voice selection (alloy, echo, fable, onyx, nova, shimmer)
- `openai.LLM(model="gpt-4o-mini")` - AI model selection
