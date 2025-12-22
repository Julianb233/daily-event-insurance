# Syncing Agent Data from Notion

This guide explains how to fetch AI agent/solution details from Notion and update the service subpages.

## Overview

The agent pages (`/app/agents/[id]/page.tsx`) have been enhanced with:
- **problemSolved**: Describes the business problem the AI solution addresses
- **howItWorks**: Explains how the AI solution works
- **loomVideoUrl**: Optional Loom video embed URL
- New "Problem Solved" and "How It Works" sections on each agent page
- Loom video embed at the top of the hero section (when URL is provided)

## Method 1: Using the Notion MCP Tool (Preferred)

If you have the Notion MCP tool available, you can query the database directly:

```bash
echo '{"database_id": "247c283b-4ad9-80bf-b038-ec5f067aff88"}' | mcp__notion__API-post-database-query
```

## Method 2: Using the Node.js Script

### Prerequisites

1. Install the Notion SDK:
```bash
cd /root/github-repos/v0-the-wizard-of-ai-
npm install @notionhq/client
```

2. Get your Notion API key:
   - Go to https://www.notion.so/my-integrations
   - Create a new integration or use existing
   - Copy the Internal Integration Token

3. Give the integration access to the database:
   - Open the database in Notion
   - Click "..." menu → "Add connections"
   - Select your integration

### Run the Script

```bash
export NOTION_API_KEY="your-notion-api-key-here"
node scripts/fetch-notion-agents.js
```

The script will output:
1. All agent properties in readable format
2. JSON data ready to copy into `agentData`

## Method 3: Manual Update from Notion

1. Open the Notion database: https://notion.so/247c283b4ad980bfb038ec5f067aff88
2. For each AI solution, copy the following fields:
   - **Name/Title** → `name`
   - **Tagline** → `tagline`
   - **Description** → `description`
   - **Problem Solved** → `problemSolved`
   - **How It Works** → `howItWorks`
   - **Loom Video URL** → `loomVideoUrl`

3. Update the corresponding agent in `/app/agents/[id]/page.tsx`

## Updating Agent Data

Once you have the data from Notion, update the `agentData` object in `/app/agents/[id]/page.tsx`:

```typescript
"lead-gen": {
  name: "Lead Gen Machine",
  tagline: "Never run out of qualified prospects again",
  description: "Our AI-powered Lead Gen Machine works 24/7...",
  problemSolved: "[Copy from Notion 'Problem Solved' field]",
  howItWorks: "[Copy from Notion 'How It Works' field]",
  loomVideoUrl: "https://www.loom.com/embed/YOUR-VIDEO-ID", // Optional
  imageUrl: "/ai-lead-generation-sales-futuristic.jpg",
  benefits: [...],
  features: [...],
  testimonial: {...},
  pricing: "Starting at $997/month",
},
```

## Loom Video Embed Format

If you have a Loom video URL from Notion, convert it to embed format:

- **Share URL**: `https://www.loom.com/share/abc123`
- **Embed URL**: `https://www.loom.com/embed/abc123`

The embed URL should be used in the `loomVideoUrl` field.

## Field Mapping Guide

| Notion Field | agentData Field | Required |
|--------------|-----------------|----------|
| Name/Title | name | Yes |
| Tagline | tagline | Yes |
| Description | description | Yes |
| Problem Solved | problemSolved | Yes |
| How It Works | howItWorks | Yes |
| Loom Video | loomVideoUrl | No |
| Benefits | benefits | Yes |
| Features | features | Yes |

## Example Complete Agent Entry

```typescript
"support-bot": {
  name: "24-Hour Support Bot",
  tagline: "Never miss another customer inquiry",
  description: "Your customers expect instant answers. Our 24-Hour Support Bot handles inquiries, troubleshoots issues, and escalates complex problems - all without human intervention.",
  problemSolved: "Customers expect 24/7 support, but hiring a full support team is expensive and unsustainable for most businesses. Support tickets pile up during off-hours, response times are slow, and customers get frustrated waiting for basic answers.",
  howItWorks: "The 24-Hour Support Bot uses natural language processing to understand customer inquiries across multiple channels. It pulls answers from your knowledge base, FAQs, and documentation to provide instant, accurate responses. When it encounters a complex issue, it seamlessly escalates to a human agent with full conversation context.",
  loomVideoUrl: "https://www.loom.com/embed/abc123def456",
  imageUrl: "/ai-customer-service-chatbot-futuristic.jpg",
  benefits: [
    "Reduce support costs by up to 60%",
    "Instant responses 24/7/365",
    "Handle unlimited concurrent conversations",
  ],
  features: [
    {
      title: "Natural Language Understanding",
      description: "Understands context, intent, and sentiment - not just keywords.",
    },
  ],
  testimonial: {
    quote: "Our customer satisfaction scores went up 40%...",
    author: "Marcus Johnson",
    company: "E-Commerce Plus",
  },
  pricing: "Starting at $497/month",
},
```

## Current Status

The following agents need Notion data (currently using placeholder content):
- ✓ lead-gen (enhanced with placeholder)
- ✓ support-bot (enhanced with placeholder)
- ✓ appointment-setter (enhanced with placeholder)
- ✓ accountant (enhanced with placeholder)

Replace `undefined` in `loomVideoUrl` with actual Loom URLs when available.

## New Page Sections

The enhanced agent pages now include:

1. **Loom Video Embed** (top of hero, only if `loomVideoUrl` is provided)
2. **Hero Section** (existing, with CTA buttons)
3. **Unlock the Power Section** (with Golden Ticket card)
4. **Problem Solved Section** (NEW - displays `problemSolved`)
5. **How It Works Section** (NEW - displays `howItWorks`)
6. **Benefits Section** (existing)
7. **Features Section** (existing)
8. **Testimonial Section** (existing)
9. **CTA Section** (existing)

## Testing

After updating the data, test each agent page:
- http://localhost:3000/agents/lead-gen
- http://localhost:3000/agents/support-bot
- http://localhost:3000/agents/appointment-setter
- http://localhost:3000/agents/accountant

Verify:
- [ ] Problem Solved section displays correctly
- [ ] How It Works section displays correctly
- [ ] Loom video embeds properly (if URL provided)
- [ ] All animations work smoothly
- [ ] Responsive design on mobile
