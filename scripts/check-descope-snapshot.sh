
#!/bin/bash

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

PROJECT_ID=${NEXT_PUBLIC_DESCOPE_PROJECT_ID}
MANAGEMENT_KEY=${DESCOPE_MANAGEMENT_KEY}

if [ -z "$MANAGEMENT_KEY" ]; then
  echo "Error: DESCOPE_MANAGEMENT_KEY is not set."
  exit 1
fi

echo "Fetching snapshot for Project ID: $PROJECT_ID"

# Export Snapshot
RESPONSE=$(curl -s -X POST "https://api.descope.com/v1/mgmt/project/snapshot/export" \
  -H "Authorization: Bearer $MANAGEMENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{}')

# Save to file for inspection
echo "$RESPONSE" > descope_snapshot.json

# Check for Google Provider Configuration
echo "---------------------------------------------------"
echo "Searching for Google Provider in Snapshot..."
echo "---------------------------------------------------"

# We look for "google" in the providers list or OAuth configuration
# Using grep to find context
grep -C 5 "google" descope_snapshot.json

echo "---------------------------------------------------"
echo "Checking for Client ID..."
echo "---------------------------------------------------"
grep -o '"clientId": *"[^"]*"' descope_snapshot.json | head -n 5

echo "---------------------------------------------------"
echo "Done. Full snapshot saved to descope_snapshot.json"
