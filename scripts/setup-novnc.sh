#!/bin/bash
set -e

# 1. Install Dependencies
echo "Installing Dependencies..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y tightvncserver git net-tools python3-numpy

# 2. Setup VNC for user 'desktop'
echo "Configuring VNC for user 'desktop'..."
su - desktop -c "mkdir -p ~/.vnc"

# Set VNC Password (non-interactive)
su - desktop -c "echo 'Oceanfront3381$' | vncpasswd -f > ~/.vnc/passwd"
su - desktop -c "chmod 600 ~/.vnc/passwd"

# Create Xstartup script to launch XFCE
su - desktop -c "cat > ~/.vnc/xstartup <<EOF
#!/bin/bash
xrdb \$HOME/.Xresources
startxfce4 &
EOF"
su - desktop -c "chmod +x ~/.vnc/xstartup"

# Kill any existing VNC sessions
su - desktop -c "vncserver -kill :1 || true"

# Start VNC Server
echo "Starting VNC Server..."
su - desktop -c "vncserver :1 -geometry 1280x720 -depth 24"

# 3. Install noVNC
echo "Installing noVNC..."
if [ ! -d "/home/desktop/noVNC" ]; then
    su - desktop -c "git clone https://github.com/novnc/noVNC.git /home/desktop/noVNC"
    su - desktop -c "git clone https://github.com/novnc/websockify /home/desktop/noVNC/utils/websockify"
fi

# 4. Create Systemd Service for noVNC
echo "Creating systemd service for noVNC..."
cat > /etc/systemd/system/novnc.service <<EOF
[Unit]
Description=noVNC Service
After=network.target

[Service]
Type=simple
User=desktop
ExecStart=/home/desktop/noVNC/utils/novnc_proxy --vnc localhost:5901 --listen 6080
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 5. Enable and Start noVNC
systemctl daemon-reload
systemctl enable novnc
systemctl restart novnc

echo "noVNC Setup Complete! Access at http://IP:6080/vnc.html"
