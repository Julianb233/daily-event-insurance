#!/bin/bash
# LiveKit Voice Agent - VPS Setup Script
# Run this on your VPS to install the agent permanently

set -e

echo "=== Daily Event Insurance Voice Agent Setup ==="

# Install Python 3.11 if not present
if ! command -v python3.11 &> /dev/null; then
    echo "Installing Python 3.11..."
    sudo apt update
    sudo apt install -y python3.11 python3.11-venv python3.11-dev
fi

# Create app directory
APP_DIR="/opt/voice-agent"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy agent files
echo "Setting up agent files..."
cp agent_realtime.py $APP_DIR/
cp requirements.txt $APP_DIR/
cp .env $APP_DIR/

# Create virtual environment
cd $APP_DIR
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service
echo "Creating systemd service..."
sudo tee /etc/systemd/system/voice-agent.service > /dev/null << 'EOF'
[Unit]
Description=Daily Event Insurance Voice Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/voice-agent
EnvironmentFile=/opt/voice-agent/.env
ExecStart=/opt/voice-agent/venv/bin/python /opt/voice-agent/agent_realtime.py start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable voice-agent
sudo systemctl start voice-agent

echo ""
echo "=== Setup Complete! ==="
echo "Voice agent is now running as a systemd service."
echo ""
echo "Useful commands:"
echo "  sudo systemctl status voice-agent   # Check status"
echo "  sudo journalctl -u voice-agent -f   # View logs"
echo "  sudo systemctl restart voice-agent  # Restart agent"
