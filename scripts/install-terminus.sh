#!/bin/bash
set -e

echo "Installing Terminus terminal emulator..."

# Update package lists
export DEBIAN_FRONTEND=noninteractive
apt-get update

# Install dependencies
apt-get install -y wget gnupg2 software-properties-common

# Download and install Terminus
TERMINUS_VERSION="1.0.215"
TERMINUS_DEB="terminus-${TERMINUS_VERSION}-linux-x64.deb"

echo "Downloading Terminus v${TERMINUS_VERSION}..."
cd /tmp
wget "https://github.com/Eugeny/tabby/releases/download/v${TERMINUS_VERSION}/tabby-${TERMINUS_VERSION}-linux-x64.deb" -O "${TERMINUS_DEB}"

echo "Installing Terminus..."
dpkg -i "${TERMINUS_DEB}" || apt-get install -f -y

echo "Cleaning up..."
rm -f "${TERMINUS_DEB}"

echo "=== Terminus Installation Complete ==="
echo "You can launch it from the Applications menu in your desktop environment"
