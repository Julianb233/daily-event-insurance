#!/bin/bash

# Configuration
UPSTREAM_NAME="agency-advantage"
UPSTREAM_URL="https://github.com/Julianb233/agency-advantage.git"
BRANCH="main"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Syncing from Agency Advantage ($UPSTREAM_URL)...${NC}"

# Ensure we are in the project root
cd "$(dirname "$0")/.."

# Check if remote exists
if ! git remote | grep -q "$UPSTREAM_NAME"; then
    echo -e "${YELLOW}Remote '$UPSTREAM_NAME' not found. Adding it...${NC}"
    git remote add "$UPSTREAM_NAME" "$UPSTREAM_URL"
fi

# Fetch updates
echo -e "${YELLOW}Fetching updates...${NC}"
if git fetch "$UPSTREAM_NAME"; then
    echo -e "${GREEN}Fetch successful.${NC}"
else
    echo -e "${RED}Failed to fetch from upstream.${NC}"
    exit 1
fi

# Check for divergence
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse "$UPSTREAM_NAME/$BRANCH")

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
    echo -e "${GREEN}Your repository is already up to date with Agency Advantage.${NC}"
    exit 0
fi

echo -e "${YELLOW}Updates found. Attempting to merge...${NC}"
echo -e "${YELLOW}NOTE: This will pause if there are merge conflicts you need to resolve.${NC}"

# Merge (allow unrelated histories in case this was a fresh detached fork)
if git merge "$UPSTREAM_NAME/$BRANCH" --allow-unrelated-histories; then
    echo -e "${GREEN}Successfully merged updates from Agency Advantage!${NC}"
else
    echo -e "${RED}Merge conflict detected.${NC}"
    echo -e "${YELLOW}Please resolve conflicts in VS Code, then run 'git commit' to finish the merge.${NC}"
    exit 1
fi
