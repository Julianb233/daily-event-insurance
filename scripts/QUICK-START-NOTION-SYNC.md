# Quick Start: Syncing Notion Data to Agent Pages

## Current Status

✅ **Complete** - Enhanced agent page structure with new fields
✅ **Complete** - Added Problem Solved and How It Works sections
✅ **Complete** - Added Loom video embed support
✅ **Complete** - Created helper scripts and documentation
⏳ **Pending** - Replace placeholder content with actual Notion data

## What's Ready

All 4 agent pages have been enhanced with:
- `problemSolved` field (currently has rich placeholder content)
- `howItWorks` field (currently has rich placeholder content)
- `loomVideoUrl` field (currently set to `undefined`)
- New UI sections to display this content
- Conditional Loom video embed

## Next Steps to Complete

### Option A: Using Notion MCP (Fastest)

If you have Notion MCP tools available in your environment:

```bash
# Query the database
echo '{"database_id": "247c283b-4ad9-80bf-b038-ec5f067aff88"}' | mcp__notion__API-post-database-query

# This will output all agent entries from Notion
# Copy the relevant fields to update the agentData object
```

### Option B: Using the Node.js Script

```bash
# 1. Install dependencies
cd /root/github-repos/v0-the-wizard-of-ai-
npm install @notionhq/client

# 2. Get your Notion API key from your environment
# Check if it's already set:
echo $NOTION_API_KEY

# If not set, search Notion for it:
# Use mcp__notion__API-post-search to find "Notion API key"

# 3. Run the script
export NOTION_API_KEY="your-key-here"
node scripts/fetch-notion-agents.js

# This will output JSON data ready to copy
```

### Option C: Manual Copy from Notion

1. Open database: https://notion.so/247c283b4ad980bfb038ec5f067aff88
2. For each agent, copy these fields to the corresponding entry in `/app/agents/[id]/page.tsx`:
   - Problem Solved → `problemSolved`
   - How It Works → `howItWorks`
   - Loom Video URL → `loomVideoUrl`

## What to Update

Open `/app/agents/[id]/page.tsx` and update:

### For "lead-gen":
```typescript
problemSolved: "[Copy from Notion]",
howItWorks: "[Copy from Notion]",
loomVideoUrl: "https://www.loom.com/embed/YOUR-VIDEO-ID", // or undefined
```

### For "support-bot":
```typescript
problemSolved: "[Copy from Notion]",
howItWorks: "[Copy from Notion]",
loomVideoUrl: "https://www.loom.com/embed/YOUR-VIDEO-ID", // or undefined
```

### For "appointment-setter":
```typescript
problemSolved: "[Copy from Notion]",
howItWorks: "[Copy from Notion]",
loomVideoUrl: "https://www.loom.com/embed/YOUR-VIDEO-ID", // or undefined
```

### For "accountant":
```typescript
problemSolved: "[Copy from Notion]",
howItWorks: "[Copy from Notion]",
loomVideoUrl: "https://www.loom.com/embed/YOUR-VIDEO-ID", // or undefined
```

## Loom Video URL Format

If you have Loom videos in Notion:

**Convert from share URL to embed URL:**
- Share: `https://www.loom.com/share/abc123def456`
- Embed: `https://www.loom.com/embed/abc123def456`

Use the **embed** format in the `loomVideoUrl` field.

## Testing After Update

```bash
# Start the dev server
npm run dev

# Test each page:
# http://localhost:3000/agents/lead-gen
# http://localhost:3000/agents/support-bot
# http://localhost:3000/agents/appointment-setter
# http://localhost:3000/agents/accountant
```

## What to Check

For each agent page, verify:

✅ Problem Solved section displays the Notion content
✅ How It Works section displays the Notion content
✅ Loom video embeds properly (if URL was added)
✅ All sections animate smoothly
✅ Page is responsive on mobile
✅ No console errors

## Current Placeholder Content

The placeholder content is professional and ready to use if Notion data isn't available yet. It covers:

- **Lead Gen**: Cold leads, manual research, poor qualification
- **Support Bot**: 24/7 support costs, slow responses, ticket overload
- **Appointment Setter**: Phone tag, no-shows, time zone issues
- **AI Accountant**: Manual bookkeeping, poor cash flow visibility

These can be replaced with actual Notion content when ready, or kept if they accurately describe the solutions.

## File Structure

```
/root/github-repos/v0-the-wizard-of-ai-/
├── app/
│   └── agents/
│       └── [id]/
│           └── page.tsx              # Main file to update
├── scripts/
│   ├── fetch-notion-agents.js        # Node.js helper script
│   ├── README-NOTION-SYNC.md         # Detailed guide
│   └── QUICK-START-NOTION-SYNC.md    # This file
└── AGENT-PAGES-ENHANCEMENT.md        # Complete summary
```

## Need Help?

See the detailed guide: `/scripts/README-NOTION-SYNC.md`

## Summary of Changes Made

1. ✅ Added 3 new fields to agentData type
2. ✅ Enhanced all 4 agents with rich placeholder content
3. ✅ Created Problem Solved section with animations
4. ✅ Created How It Works section with animations
5. ✅ Added Loom video embed support (conditional rendering)
6. ✅ Improved GoldenTicketCard with 3D effects and shimmer
7. ✅ Created helper scripts for Notion sync
8. ✅ Created comprehensive documentation

## Database Information

- **Database ID**: `247c283b-4ad9-80bf-b038-ec5f067aff88`
- **Expected Fields** in Notion:
  - Name/Title
  - Tagline
  - Description
  - Problem Solved
  - How It Works
  - Loom Video URL
  - Benefits (optional - can enhance existing)
  - Features (optional - can enhance existing)

## Quick Command Reference

```bash
# Search Notion for API credentials
echo '{"query": "Notion API key"}' | mcp__notion__API-post-search

# Query the agents database
echo '{"database_id": "247c283b-4ad9-80bf-b038-ec5f067aff88"}' | mcp__notion__API-post-database-query

# Run the Node.js helper script
node scripts/fetch-notion-agents.js

# Start dev server
npm run dev
```

That's it! The structure is ready - just add the Notion content when available.
