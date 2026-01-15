#!/bin/bash
# Update script for VPS voice agent
# Run this on the VPS to update to the latest version

set -e

echo "=============================================="
echo "Updating Daily Event Insurance Voice Agent"
echo "=============================================="

# Navigate to agent directory
cd /opt/voice-agent

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Navigate to livekit-agent directory
cd livekit-agent

# Update dependencies
echo "Updating dependencies..."
pip install -r requirements.txt --upgrade

# Restart the service
echo "Restarting voice agent service..."
sudo systemctl restart voice-agent

# Check status
echo "Checking service status..."
sleep 2
sudo systemctl status voice-agent --no-pager

echo ""
echo "=============================================="
echo "Update complete!"
echo "Check logs with: sudo journalctl -u voice-agent -f"
echo "=============================================="
