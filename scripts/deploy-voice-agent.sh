#!/bin/bash
# Deploy Voice Agent to new server (167.172.197.94)

SERVER_IP="167.172.197.94"
USER="root"

echo "=== Deploying Voice Agent to $SERVER_IP ==="

ssh -o StrictHostKeyChecking=no $USER@$SERVER_IP << 'EOF'
    set -e
    
    echo "[Remote] Connected to $HOSTNAME."
    
    # 1. Update Repo
    if [ -d "/root/daily-event-insurance" ]; then
        cd /root/daily-event-insurance
        echo "[Remote] Pulling latest changes..."
        git pull
    else
        echo "[Remote] Error: Repo not found at /root/daily-event-insurance"
        exit 1
    fi

    # 2. Prepare Agent Directory
    echo "[Remote] Preparing livekit-agent directory..."
    cd livekit-agent
    
    # 3. Ensure .env exists (copy from root if available)
    if [ -f "../.env" ]; then
        echo "[Remote] Copying .env from repository root..."
        cp ../.env .env
    else
        echo "[Remote] Warning: ../.env not found. Ensure /opt/voice-agent/.env is populated."
    fi

    # 4. Run Setup
    echo "[Remote] Running setup-vps.sh..."
    chmod +x setup-vps.sh
    ./setup-vps.sh

    # 5. Verify Service
    echo "[Remote] Verifying service status..."
    systemctl status voice-agent --no-pager
    
    echo "[Remote] Deployment Complete."
EOF
