#!/bin/bash
# Ralph - Autonomous agent for Daily Event Insurance
# Usage: ./ralph.sh [max_iterations]

set -e

MAX_ITERATIONS=${1:-10}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROMPT_FILE="$SCRIPT_DIR/prompt.md"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"

cd "$PROJECT_DIR"

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  cat > "$PROGRESS_FILE" << 'EOF'
# Ralph Progress Log
Project: Daily Event Insurance (Sierra Fred Carey)
Started: $(date)

## Codebase Patterns
- Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- Framer Motion for animations
- Drizzle ORM with PostgreSQL (Neon)
- Stripe for payments
- NextAuth for authentication
- GoHighLevel CRM integration
- Supabase integration
---
EOF
fi

echo "Starting Ralph - Max iterations: $MAX_ITERATIONS"
echo "Working directory: $PROJECT_DIR"
echo ""

for i in $(seq 1 $MAX_ITERATIONS); do
  echo "═══════════════════════════════════════════════════════"
  echo "  Ralph Iteration $i of $MAX_ITERATIONS - $(date)"
  echo "═══════════════════════════════════════════════════════"
  
  # Run amp in execute mode with the prompt
  OUTPUT=$(cat "$PROMPT_FILE" | amp -x --dangerously-allow-all 2>&1) || true
  
  echo "$OUTPUT"
  
  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "🎉 Ralph completed ALL tasks at iteration $i!"
    exit 0
  fi
  
  echo ""
  echo "Iteration $i complete. Continuing..."
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS)."
echo "Check $PROGRESS_FILE for status."
