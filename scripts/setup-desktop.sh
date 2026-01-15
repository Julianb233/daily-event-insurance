#!/bin/bash
set -e

# 1. Update System
echo "Updating system..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# 2. Install Desktop Environment (XFCE)
echo "Installing XFCE..."
apt-get install -y xfce4 xfce4-goodies xorg dbus-x11 x11-xserver-utils

# 3. Install xRDP
echo "Installing xRDP..."
apt-get install -y xrdp
adduser xrdp ssl-cert
systemctl enable xrdp

# 4. Install Google Chrome
echo "Installing Google Chrome..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt-get install -y ./google-chrome-stable_current_amd64.deb || apt-get install -f -y
rm google-chrome-stable_current_amd64.deb

# 5. Create 'desktop' user
echo "Creating user 'desktop'..."
if id "desktop" &>/dev/null; then
    echo "User 'desktop' already exists."
else
    useradd -m -s /bin/bash desktop
    echo "desktop:Oceanfront3381$" | chpasswd
    usermod -aG sudo desktop
fi

# 6. Configure Sessions
echo "Configuring Sessions..."
# For Root (if needed)
echo "xfce4-session" > /root/.xsession
# For Desktop User
echo "xfce4-session" > /home/desktop/.xsession
chown desktop:desktop /home/desktop/.xsession

# 7. Restart Services
echo "Restarting xRDP..."
service xrdp restart

echo "Setup Complete!"
