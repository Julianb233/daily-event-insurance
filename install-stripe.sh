#!/bin/bash
# Install Stripe dependencies for Daily Event Insurance

echo "Installing Stripe packages..."
pnpm add stripe @stripe/stripe-js

if [ $? -eq 0 ]; then
  echo "✓ Stripe packages installed successfully"
else
  echo "✗ Failed to install Stripe packages"
  exit 1
fi

echo "Installation complete!"
