"use client"

import { useState, use } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import {
    ArrowLeft, ArrowRight, Clock, Tag, Calendar, ThumbsUp, ThumbsDown,
    Copy, Check, BookOpen, MessageSquare, ChevronRight,
    Rocket, Code, Layout, Wrench, Lightbulb, CreditCard
} from "lucide-react"
import Link from "next/link"

// Article type definition
interface ArticleData {
    id: string
    slug: string
    title: string
    content: string
    category: ArticleCategory
    tags: string[]
    lastUpdated: string
    readTime: number
    relatedSlugs: string[]
}

type ArticleCategory =
    | "getting-started"
    | "api-integration"
    | "widget-setup"
    | "troubleshooting"
    | "best-practices"
    | "billing"

interface CategoryInfo {
    id: ArticleCategory
    name: string
    icon: React.ElementType
    color: string
}

// Category definitions
const categories: CategoryInfo[] = [
    { id: "getting-started", name: "Getting Started", icon: Rocket, color: "teal" },
    { id: "api-integration", name: "API Integration", icon: Code, color: "blue" },
    { id: "widget-setup", name: "Widget Setup", icon: Layout, color: "purple" },
    { id: "troubleshooting", name: "Troubleshooting", icon: Wrench, color: "orange" },
    { id: "best-practices", name: "Best Practices", icon: Lightbulb, color: "green" },
    { id: "billing", name: "Billing & Payouts", icon: CreditCard, color: "indigo" }
]

// Full article data with content
const articlesData: ArticleData[] = [
    {
        id: "1",
        slug: "partner-account-setup",
        title: "Creating Your Partner Account",
        category: "getting-started",
        tags: ["account", "setup", "onboarding"],
        lastUpdated: "2024-01-10",
        readTime: 3,
        relatedSlugs: ["platform-overview", "first-integration-guide"],
        content: `
# Creating Your Partner Account

Welcome to Daily Event Insurance! This guide will walk you through creating your partner account and getting started with our platform.

## Prerequisites

Before you begin, make sure you have:
- A valid business email address
- Your company's legal business name
- Tax identification number (EIN or SSN)

## Step 1: Register Your Account

1. Visit [dailyeventinsurance.com/sign-up](/sign-up)
2. Enter your business email and create a secure password
3. Verify your email address via the confirmation link

## Step 2: Complete Your Business Profile

After email verification, you'll be prompted to complete your business profile:

- **Business Name**: Your legal entity name
- **Business Type**: Select from Race Director, Gym/Fitness Center, Climbing Facility, etc.
- **Contact Information**: Primary contact details for account communications
- **Tax Information**: Required for commission payouts

## Step 3: Review Partnership Agreement

Read and accept our partnership agreement, which outlines:
- Commission structure (20-40% based on volume)
- Payment terms (NET 15)
- Platform usage policies

## Step 4: Access Your Dashboard

Once approved (typically within 24 hours), you'll have full access to:
- Partner Dashboard
- API credentials
- Integration tools
- Reporting and analytics

## Next Steps

After account setup, we recommend:
1. Exploring the platform overview
2. Setting up your first integration
3. Configuring your widget

Need help? Contact our partner support team at partners@dailyeventinsurance.com or call (555) 123-4567.
        `
    },
    {
        id: "2",
        slug: "platform-overview",
        title: "Platform Overview & Features",
        category: "getting-started",
        tags: ["overview", "features", "dashboard"],
        lastUpdated: "2024-01-08",
        readTime: 5,
        relatedSlugs: ["partner-account-setup", "dashboard-navigation"],
        content: `
# Platform Overview & Features

Get familiar with the Daily Event Insurance partner platform and all its capabilities.

## Dashboard Overview

Your partner dashboard is the central hub for managing your insurance offerings:

### Key Sections

1. **Home Dashboard**
   - Real-time policy sales
   - Revenue tracking
   - Quick action buttons

2. **Policies**
   - View all policies sold
   - Filter by status, date, or event
   - Download certificates

3. **Reports**
   - Commission reports
   - Enrollment analytics
   - Custom date ranges

4. **Settings**
   - Profile management
   - API keys
   - Notification preferences

## Core Features

### Instant Coverage
Participants receive coverage immediately upon purchase - no waiting periods, no paperwork.

### Digital Certificates
Automatic digital proof of coverage via email with downloadable PDF certificates.

### Multi-Event Support
Manage multiple events, locations, or facilities from a single account.

### Real-Time Reporting
Track sales, commissions, and enrollment rates with live analytics.

## Integration Options

We support multiple integration methods:

- **Embedded Widget**: Drop-in JavaScript widget
- **REST API**: Full programmatic control
- **Platform Integrations**: RunSignup, BikeReg, MindBody, Zen Planner

## Mobile Accessibility

Our platform is fully responsive, allowing you to:
- Check sales on the go
- View reports from any device
- Receive push notifications for new policies

## Security Features

- SOC 2 Type II certified
- 256-bit SSL encryption
- PCI DSS compliant payment processing
- Regular security audits
        `
    },
    {
        id: "3",
        slug: "first-integration-guide",
        title: "Your First Integration: Step-by-Step",
        category: "getting-started",
        tags: ["integration", "setup", "tutorial"],
        lastUpdated: "2024-01-12",
        readTime: 8,
        relatedSlugs: ["partner-account-setup", "api-authentication"],
        content: `
# Your First Integration: Step-by-Step

This comprehensive guide walks you through your first integration with Daily Event Insurance.

## Choosing Your Integration Method

We offer three main integration approaches:

### 1. Embedded Widget (Recommended for Most)
- Fastest setup (< 30 minutes)
- No coding required
- Automatic updates
- Full customization options

### 2. REST API
- Complete control over the experience
- Requires development resources
- Best for custom workflows

### 3. Platform Plugins
- Pre-built integrations
- One-click installation
- Platform-specific features

## Widget Integration (Quick Start)

### Step 1: Get Your Widget Code

Navigate to Settings > Integration > Widget in your dashboard and copy your unique embed code:

\`\`\`html
<script
  src="https://widget.dailyeventinsurance.com/v2/embed.js"
  data-partner-id="YOUR_PARTNER_ID"
  data-theme="light"
></script>
<div id="dei-insurance-widget"></div>
\`\`\`

### Step 2: Add to Your Page

Paste the code where you want the insurance option to appear - typically on your:
- Registration confirmation page
- Checkout flow
- Member dashboard

### Step 3: Configure Options

Customize the widget through your dashboard:
- Color scheme matching
- Default coverage options
- Event type configuration
- Language settings

### Step 4: Test Your Integration

Use our test mode to verify everything works:
1. Enable test mode in Settings
2. Complete a test purchase (no charges)
3. Verify the policy appears in your dashboard
4. Check confirmation emails

## Verification Checklist

Before going live, verify:
- Widget loads correctly
- Branding matches your site
- Test policy created successfully
- Commission tracking works
- Confirmation emails received

## Going Live

When ready:
1. Disable test mode
2. Announce to your participants
3. Monitor your first real sales
4. Review reports after 24 hours
        `
    },
    {
        id: "6",
        slug: "api-authentication",
        title: "API Authentication & Security",
        category: "api-integration",
        tags: ["api", "authentication", "security", "oauth"],
        lastUpdated: "2024-01-11",
        readTime: 6,
        relatedSlugs: ["api-endpoints-reference", "webhook-configuration"],
        content: `
# API Authentication & Security

Learn how to securely authenticate with the Daily Event Insurance API.

## Authentication Methods

We support two authentication methods:

### 1. API Key Authentication
Best for server-to-server communication.

\`\`\`bash
curl -X GET https://api.dailyeventinsurance.com/v2/policies \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"
\`\`\`

### 2. OAuth 2.0
Best for applications acting on behalf of users.

## Getting Your API Keys

1. Log in to your partner dashboard
2. Navigate to Settings > API
3. Click "Generate New Key"
4. Copy and securely store your keys

**Important**: API keys should never be exposed in client-side code.

## API Key Types

| Key Type | Use Case | Permissions |
|----------|----------|-------------|
| Production | Live environment | Full access |
| Sandbox | Testing | Test data only |
| Read-Only | Reporting | GET requests only |

## Security Best Practices

### Store Keys Securely
- Use environment variables
- Never commit to source control
- Rotate keys regularly

### Use HTTPS
All API requests must use HTTPS. HTTP requests will be rejected.

### Implement Rate Limiting
- 1000 requests per minute
- 429 response when exceeded
- Exponential backoff recommended

### IP Whitelisting (Optional)
For enhanced security, whitelist your server IPs in dashboard settings.

## Request Headers

Required headers for all API requests:

\`\`\`
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-API-Version: 2024-01
\`\`\`

## Error Handling

Authentication errors return:

\`\`\`json
{
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid or expired API key",
    "status": 401
  }
}
\`\`\`

## Testing Authentication

Verify your setup with a simple test:

\`\`\`bash
curl -X GET https://api.dailyeventinsurance.com/v2/auth/verify \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`
        `
    },
    {
        id: "7",
        slug: "api-endpoints-reference",
        title: "API Endpoints Reference",
        category: "api-integration",
        tags: ["api", "endpoints", "reference", "rest"],
        lastUpdated: "2024-01-13",
        readTime: 10,
        relatedSlugs: ["api-authentication", "api-code-samples"],
        content: `
# API Endpoints Reference

Complete reference for all Daily Event Insurance API endpoints.

## Base URL

\`\`\`
Production: https://api.dailyeventinsurance.com/v2
Sandbox:    https://sandbox.dailyeventinsurance.com/v2
\`\`\`

## Policies

### List Policies
\`\`\`
GET /policies
\`\`\`

Query Parameters:
- \`status\`: active, expired, cancelled
- \`from_date\`: YYYY-MM-DD
- \`to_date\`: YYYY-MM-DD
- \`limit\`: 1-100 (default: 50)
- \`offset\`: pagination offset

### Get Policy
\`\`\`
GET /policies/{policy_id}
\`\`\`

### Create Policy
\`\`\`
POST /policies
\`\`\`

Request Body:
\`\`\`json
{
  "participant": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "date_of_birth": "1990-01-15"
  },
  "event": {
    "id": "evt_123",
    "date": "2024-03-15"
  },
  "coverage": {
    "type": "standard",
    "add_ons": ["emergency_transport"]
  }
}
\`\`\`

### Cancel Policy
\`\`\`
POST /policies/{policy_id}/cancel
\`\`\`

## Quotes

### Create Quote
\`\`\`
POST /quotes
\`\`\`

### Get Quote
\`\`\`
GET /quotes/{quote_id}
\`\`\`

### Convert Quote to Policy
\`\`\`
POST /quotes/{quote_id}/convert
\`\`\`

## Events

### List Events
\`\`\`
GET /events
\`\`\`

### Create Event
\`\`\`
POST /events
\`\`\`

### Update Event
\`\`\`
PATCH /events/{event_id}
\`\`\`

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |
        `
    },
    {
        id: "8",
        slug: "webhook-configuration",
        title: "Webhook Configuration Guide",
        category: "api-integration",
        tags: ["webhooks", "events", "notifications", "api"],
        lastUpdated: "2024-01-09",
        readTime: 7,
        relatedSlugs: ["api-authentication", "api-endpoints-reference"],
        content: `
# Webhook Configuration Guide

Configure webhooks to receive real-time notifications about policy events.

## Overview

Webhooks allow your application to receive automatic notifications when events occur, such as:
- New policy purchases
- Policy cancellations
- Claim submissions
- Payout confirmations

## Setting Up Webhooks

### Via Dashboard

1. Navigate to Settings > Webhooks
2. Click "Add Webhook Endpoint"
3. Enter your endpoint URL
4. Select events to subscribe to
5. Save configuration

### Via API

\`\`\`bash
curl -X POST https://api.dailyeventinsurance.com/v2/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-domain.com/webhooks/dei",
    "events": ["policy.created", "policy.cancelled", "claim.submitted"]
  }'
\`\`\`

## Available Events

| Event | Description |
|-------|-------------|
| policy.created | New policy purchased |
| policy.activated | Policy coverage started |
| policy.cancelled | Policy was cancelled |
| policy.expired | Policy coverage ended |
| claim.submitted | New claim filed |
| claim.approved | Claim was approved |
| claim.denied | Claim was denied |
| payout.sent | Commission payout sent |

## Webhook Payload

All webhooks include a standard payload structure:

\`\`\`json
{
  "id": "wh_evt_123abc",
  "type": "policy.created",
  "created_at": "2024-01-15T10:30:00Z",
  "data": {
    "policy_id": "pol_abc123",
    "participant": {
      "email": "participant@example.com"
    },
    "premium": 1499,
    "commission": 449
  }
}
\`\`\`

## Best Practices

1. **Respond Quickly**: Return 200 within 10 seconds
2. **Process Async**: Queue events for background processing
3. **Handle Duplicates**: Events may be delivered more than once
4. **Verify Signatures**: Always validate webhook authenticity
        `
    },
    {
        id: "10",
        slug: "widget-customization",
        title: "Widget Customization Options",
        category: "widget-setup",
        tags: ["widget", "customization", "branding", "css"],
        lastUpdated: "2024-01-10",
        readTime: 6,
        relatedSlugs: ["widget-embedding", "widget-events"],
        content: `
# Widget Customization Options

Customize the insurance widget to match your brand and user experience.

## Theme Configuration

### Via Dashboard

Navigate to Settings > Widget > Appearance to configure:
- Primary color
- Button styles
- Font family
- Border radius
- Shadow intensity

### Via JavaScript

\`\`\`javascript
DEIWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  theme: {
    primaryColor: '#14B8A6',
    secondaryColor: '#0F766E',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
    buttonStyle: 'filled' // or 'outlined'
  }
});
\`\`\`

## Layout Options

### Inline Mode
Widget appears within your page flow:
\`\`\`javascript
DEIWidget.init({
  mode: 'inline',
  container: '#insurance-widget'
});
\`\`\`

### Modal Mode
Widget opens in a centered overlay:
\`\`\`javascript
DEIWidget.init({
  mode: 'modal',
  trigger: '#get-insurance-btn'
});
\`\`\`

### Sidebar Mode
Widget slides in from the side:
\`\`\`javascript
DEIWidget.init({
  mode: 'sidebar',
  position: 'right' // or 'left'
});
\`\`\`

## Content Customization

### Custom Headlines
\`\`\`javascript
DEIWidget.init({
  content: {
    headline: 'Protect Your Adventure',
    subheadline: 'Coverage starts at just $4.99',
    ctaButton: 'Get Protected Now'
  }
});
\`\`\`

### Language Support
\`\`\`javascript
DEIWidget.init({
  locale: 'es' // Spanish
  // Supported: en, es, fr, de, pt
});
\`\`\`

## Responsive Behavior

The widget automatically adapts to screen sizes:
- **Desktop**: Full-width with side-by-side layout
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single column, touch-friendly buttons
        `
    },
    {
        id: "11",
        slug: "widget-embedding",
        title: "Embedding the Widget on Your Site",
        category: "widget-setup",
        tags: ["widget", "embed", "javascript", "installation"],
        lastUpdated: "2024-01-07",
        readTime: 4,
        relatedSlugs: ["widget-customization", "first-integration-guide"],
        content: `
# Embedding the Widget on Your Site

Learn how to add the Daily Event Insurance widget to your website or application.

## Quick Installation

Add this code to your HTML:

\`\`\`html
<!-- Add before closing </body> tag -->
<script src="https://widget.dailyeventinsurance.com/v2/embed.js"></script>
<script>
  DEIWidget.init({
    partnerId: 'YOUR_PARTNER_ID'
  });
</script>
\`\`\`

## Installation Methods

### Method 1: Script Tag (Simplest)
\`\`\`html
<script
  src="https://widget.dailyeventinsurance.com/v2/embed.js"
  data-partner-id="YOUR_PARTNER_ID"
  async
></script>
\`\`\`

### Method 2: NPM Package
\`\`\`bash
npm install @dailyeventinsurance/widget
\`\`\`

\`\`\`javascript
import { DEIWidget } from '@dailyeventinsurance/widget';

DEIWidget.init({
  partnerId: 'YOUR_PARTNER_ID'
});
\`\`\`

### Method 3: React Component
\`\`\`jsx
import { InsuranceWidget } from '@dailyeventinsurance/react';

function Checkout() {
  return (
    <InsuranceWidget
      partnerId="YOUR_PARTNER_ID"
      eventId="evt_123"
      onPurchase={(policy) => console.log('Purchased:', policy)}
    />
  );
}
\`\`\`

## Placement Recommendations

### Best Locations
1. **Registration confirmation page** - Highest conversion
2. **Checkout summary** - Natural add-on point
3. **Email confirmation** - Second-chance opportunity
4. **Member dashboard** - For recurring coverage

## Performance

The widget is optimized for performance:
- **Size**: < 50KB gzipped
- **Load time**: < 200ms
- **No blocking**: Async loading
- **CDN delivery**: Global edge network
        `
    },
    {
        id: "13",
        slug: "common-integration-errors",
        title: "Common Integration Errors & Fixes",
        category: "troubleshooting",
        tags: ["errors", "troubleshooting", "debugging"],
        lastUpdated: "2024-01-11",
        readTime: 7,
        relatedSlugs: ["api-authentication", "widget-embedding"],
        content: `
# Common Integration Errors & Fixes

Solutions to the most common issues partners encounter during integration.

## Authentication Errors

### Error: INVALID_API_KEY
**Message**: "The provided API key is invalid or has been revoked"

**Causes**:
- Using sandbox key in production
- Key was regenerated
- Key contains extra whitespace

**Solution**:
1. Verify you're using the correct environment key
2. Regenerate your API key in the dashboard
3. Check for copy/paste issues

### Error: AUTHENTICATION_REQUIRED
**Message**: "No authorization header provided"

**Solution**:
\`\`\`bash
# Correct format
-H "Authorization: Bearer YOUR_API_KEY"

# Common mistakes
-H "Authorization: YOUR_API_KEY"  # Missing "Bearer"
-H "Bearer YOUR_API_KEY"          # Missing "Authorization:"
\`\`\`

## Widget Errors

### Widget Not Loading
**Symptoms**: Empty container, no errors in console

**Checklist**:
1. Partner ID is correct
2. Script loaded before initialization
3. Container element exists in DOM
4. No ad blockers interfering

### Styling Issues
**Symptoms**: Widget looks broken or unstyled

**Solution**:
\`\`\`javascript
// Enable style isolation
DEIWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  styleIsolation: true
});
\`\`\`

## API Errors

### Error: RATE_LIMIT_EXCEEDED
**Message**: "Too many requests"

**Solution**:
- Implement exponential backoff
- Cache responses where possible
- Reduce request frequency

## Getting Help

If you can't resolve an issue:
1. Check our status page
2. Search this knowledge base
3. Contact support with:
   - Error message and code
   - Request/response logs
   - Timestamp of occurrence
        `
    },
    {
        id: "14",
        slug: "testing-sandbox-mode",
        title: "Using Test/Sandbox Mode",
        category: "troubleshooting",
        tags: ["testing", "sandbox", "development"],
        lastUpdated: "2024-01-08",
        readTime: 4,
        relatedSlugs: ["common-integration-errors", "first-integration-guide"],
        content: `
# Using Test/Sandbox Mode

Learn how to use our sandbox environment for safe testing.

## Sandbox Overview

The sandbox environment allows you to:
- Test integrations without real charges
- Simulate various scenarios
- Debug issues safely
- Train your team

## Accessing Sandbox

### API
Use the sandbox base URL:
\`\`\`
https://sandbox.dailyeventinsurance.com/v2
\`\`\`

### Widget
Enable test mode:
\`\`\`javascript
DEIWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  testMode: true
});
\`\`\`

### Dashboard
Toggle "Test Mode" in the top navigation bar.

## Test Cards

Use these card numbers for testing:

| Number | Result |
|--------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0000 0000 3220 | 3D Secure required |

All test cards use:
- Any future expiration date
- Any 3-digit CVC
- Any postal code

## Going to Production

Checklist before going live:
- Update to production API URL
- Use production API keys
- Disable widget test mode
- Update webhook URLs
- Test one real transaction
        `
    },
    {
        id: "16",
        slug: "maximizing-enrollment",
        title: "Maximizing Insurance Enrollment Rates",
        category: "best-practices",
        tags: ["enrollment", "conversion", "marketing"],
        lastUpdated: "2024-01-12",
        readTime: 8,
        relatedSlugs: ["marketing-insurance-participants", "widget-customization"],
        content: `
# Maximizing Insurance Enrollment Rates

Strategies proven to increase insurance opt-in rates among your participants.

## Industry Benchmarks

Average enrollment rates by sector:
- **Running Events**: 15-25%
- **Cycling Events**: 20-30%
- **Gym Memberships**: 8-15%
- **Climbing Facilities**: 25-35%
- **Ski/Adventure**: 30-45%

Top performers achieve **40%+ enrollment**.

## Placement Strategy

### 1. Timing is Everything
Present insurance at the right moment:
- During registration (not after)
- Before payment confirmation
- When they're committed but haven't paid

### 2. Above the Fold
Place the widget where users see it without scrolling.

### 3. Pre-Select Standard Coverage
Opt-out converts better than opt-in:
\`\`\`javascript
DEIWidget.init({
  defaultSelection: 'standard' // Pre-checked
});
\`\`\`

## Messaging That Converts

### Emphasize Relevance
- "Coverage designed for runners"
- "Climbing-specific protection"
- "Built for athletes like you"

### Highlight Speed
- "Instant coverage - no waiting period"
- "Digital certificate in seconds"

### Show Value
- "Starting at just $4.99"
- "Less than a coffee protects your race"

## Social Proof

Display enrollment rates:
\`\`\`javascript
DEIWidget.init({
  showSocialProof: true,
  socialProofMessage: "42% of participants add coverage"
});
\`\`\`

## Mobile Optimization

60%+ of registrations are mobile:
- Use large touch targets
- Simplify coverage options
- One-tap selection
- Mobile-optimized widget mode
        `
    },
    {
        id: "19",
        slug: "commission-structure",
        title: "Understanding Your Commission Structure",
        category: "billing",
        tags: ["commission", "earnings", "revenue"],
        lastUpdated: "2024-01-11",
        readTime: 5,
        relatedSlugs: ["payout-schedule", "tax-documentation"],
        content: `
# Understanding Your Commission Structure

Learn how commissions are calculated and how to maximize your earnings.

## Commission Tiers

Your commission rate is based on monthly policy volume:

| Monthly Policies | Commission Rate |
|-----------------|-----------------|
| 0 - 99 | 20% |
| 100 - 499 | 25% |
| 500 - 999 | 30% |
| 1,000 - 4,999 | 35% |
| 5,000+ | 40% |

**Volume is calculated on rolling 30-day periods.**

## How It Works

### Example Calculation
- Standard policy premium: $14.99
- Your tier: 25% (100-499 monthly)
- Your commission: $3.75 per policy

### Volume Bonuses
Reach higher tiers to unlock:
- Higher commission rates
- Priority support
- Marketing co-op funds
- Featured placement opportunities

## Earning More

### Increase Enrollment
More conversions = higher tier = higher rate per policy

### Premium Coverage
Higher premium options earn more:
- Basic ($7.99) - $2.00 @ 25%
- Standard ($14.99) - $3.75 @ 25%
- Premium ($24.99) - $6.25 @ 25%

## Commission Tracking

Track your earnings in real-time:
1. Dashboard > Reports > Commission
2. Filter by date range
3. Export to CSV/Excel

## Questions?

Contact partner-finance@dailyeventinsurance.com for commission questions.
        `
    },
    {
        id: "20",
        slug: "payout-schedule",
        title: "Payout Schedule & Methods",
        category: "billing",
        tags: ["payouts", "payments", "banking"],
        lastUpdated: "2024-01-10",
        readTime: 4,
        relatedSlugs: ["commission-structure", "tax-documentation"],
        content: `
# Payout Schedule & Methods

Everything you need to know about receiving your commission payments.

## Payout Schedule

### Standard Schedule: NET 15
- Commissions earned by the 15th - paid on the 30th
- Commissions earned by the 30th - paid on the 15th

### Example Timeline
| Earning Period | Payout Date |
|---------------|-------------|
| Jan 1-15 | Jan 30 |
| Jan 16-31 | Feb 15 |
| Feb 1-15 | Feb 28 |

## Payment Methods

### ACH Bank Transfer (Recommended)
- No fees
- 2-3 business days
- Available in US

### PayPal
- 2.9% + $0.30 fee
- Instant availability
- International supported

### Wire Transfer
- $25 fee per transfer
- Required for amounts > $10,000
- International supported

## Minimum Payout

- **ACH/PayPal**: $25 minimum
- **Wire**: $500 minimum
- **Check**: $100 minimum

Below minimum? Balance rolls to next period.

## Setting Up Payments

1. Go to Dashboard > Settings > Payments
2. Select payment method
3. Enter account details
4. Verify small deposit (ACH only)
5. Confirm setup
        `
    },
    {
        id: "21",
        slug: "tax-documentation",
        title: "Tax Documentation & 1099s",
        category: "billing",
        tags: ["taxes", "1099", "documentation"],
        lastUpdated: "2024-01-05",
        readTime: 3,
        relatedSlugs: ["commission-structure", "payout-schedule"],
        content: `
# Tax Documentation & 1099s

Information about tax reporting for your commission earnings.

## Tax Forms

### 1099-NEC
If you earn $600+ in a calendar year, you'll receive Form 1099-NEC.

**Timeline**:
- January 31: 1099s mailed/emailed
- Available in dashboard by January 15

### W-9 Requirement
All US partners must submit W-9 before first payout:
1. Dashboard > Settings > Tax Info
2. Complete W-9 online or upload PDF
3. Submit for verification

## Accessing Tax Documents

### Dashboard
1. Go to Settings > Tax Documents
2. Select tax year
3. Download PDF or view online

### Email
1099s are emailed to your registered address on January 31.

## International Partners

US tax forms apply to US partners only.

International partners:
- May need to provide W-8BEN
- Should consult local tax advisor
- No US tax withholding by default

## Support

For 1099 delivery issues or corrections:
- Email: tax-support@dailyeventinsurance.com
- Response time: 1-2 business days
        `
    }
]

// Helper functions
function getArticleBySlug(slug: string): ArticleData | undefined {
    return articlesData.find(article => article.slug === slug)
}

function getRelatedArticles(relatedSlugs: string[]): ArticleData[] {
    return relatedSlugs
        .map(slug => getArticleBySlug(slug))
        .filter((article): article is ArticleData => article !== undefined)
}

function getCategoryInfo(categoryId: ArticleCategory): CategoryInfo | undefined {
    return categories.find(cat => cat.id === categoryId)
}

function getCategoryColor(color: string): string {
    const colorMap: Record<string, string> = {
        teal: "bg-teal-50 text-teal-600 border-teal-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        green: "bg-green-50 text-green-600 border-green-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
    }
    return colorMap[color] || colorMap.teal
}

// Simple markdown renderer for article content
function renderMarkdown(content: string): React.ReactNode {
    const lines = content.trim().split("\n")
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let codeBlockLang = ""
    let inList = false
    let listItems: string[] = []
    let inTable = false
    let tableRows: string[][] = []
    let key = 0

    const processLine = (line: string): React.ReactNode | null => {
        // Headers
        if (line.startsWith("# ")) {
            return <h1 key={key++} className="text-3xl font-bold text-slate-900 mb-6 mt-8 first:mt-0">{line.slice(2)}</h1>
        }
        if (line.startsWith("## ")) {
            return <h2 key={key++} className="text-2xl font-bold text-slate-900 mb-4 mt-8">{line.slice(3)}</h2>
        }
        if (line.startsWith("### ")) {
            return <h3 key={key++} className="text-xl font-bold text-slate-900 mb-3 mt-6">{line.slice(4)}</h3>
        }

        // Bold and inline code
        let processedLine = line
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-sm font-mono">$1</code>')

        // Links
        processedLine = processedLine.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="text-teal-600 hover:text-teal-700 underline">$1</a>'
        )

        // Empty line
        if (line.trim() === "") {
            return null
        }

        // Regular paragraph
        return (
            <p
                key={key++}
                className="text-slate-700 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: processedLine }}
            />
        )
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Code blocks
        if (line.startsWith("```")) {
            if (!inCodeBlock) {
                inCodeBlock = true
                codeBlockLang = line.slice(3)
                codeBlockContent = []
            } else {
                elements.push(
                    <CodeBlock key={key++} code={codeBlockContent.join("\n")} language={codeBlockLang} />
                )
                inCodeBlock = false
                codeBlockContent = []
                codeBlockLang = ""
            }
            continue
        }

        if (inCodeBlock) {
            codeBlockContent.push(line)
            continue
        }

        // Tables
        if (line.startsWith("|") && line.endsWith("|")) {
            if (!inTable) {
                inTable = true
                tableRows = []
            }
            // Skip separator row
            if (!line.includes("---")) {
                const cells = line.split("|").slice(1, -1).map(cell => cell.trim())
                tableRows.push(cells)
            }
            // Check if next line is not a table
            if (i + 1 >= lines.length || !lines[i + 1].startsWith("|")) {
                elements.push(
                    <div key={key++} className="overflow-x-auto mb-6">
                        <table className="min-w-full border border-slate-200 rounded-lg">
                            <thead className="bg-slate-50">
                                <tr>
                                    {tableRows[0]?.map((cell, j) => (
                                        <th key={j} className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b border-slate-200">
                                            {cell}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.slice(1).map((row, j) => (
                                    <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                        {row.map((cell, k) => (
                                            <td key={k} className="px-4 py-3 text-sm text-slate-700 border-b border-slate-100">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                inTable = false
                tableRows = []
            }
            continue
        }

        // Lists
        if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
            if (!inList) {
                inList = true
                listItems = []
            }
            listItems.push(line.replace(/^[-*]\s/, "").replace(/^\d+\.\s/, ""))
            // Check if next line is not a list item
            if (i + 1 >= lines.length || (!lines[i + 1].match(/^[-*]\s/) && !lines[i + 1].match(/^\d+\.\s/))) {
                const isOrdered = line.match(/^\d+\.\s/)
                const ListTag = isOrdered ? "ol" : "ul"
                elements.push(
                    <ListTag key={key++} className={`mb-6 space-y-2 ${isOrdered ? "list-decimal" : "list-disc"} list-inside`}>
                        {listItems.map((item, j) => (
                            <li key={j} className="text-slate-700" dangerouslySetInnerHTML={{
                                __html: item
                                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
                                    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-sm font-mono">$1</code>')
                            }} />
                        ))}
                    </ListTag>
                )
                inList = false
                listItems = []
            }
            continue
        }

        const element = processLine(line)
        if (element) {
            elements.push(element)
        }
    }

    return <>{elements}</>
}

// Code block component with copy functionality
function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group mb-6">
            <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 rounded-t-lg text-sm">
                <span>{language || "code"}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-lg overflow-x-auto">
                <code className="text-sm font-mono">{code}</code>
            </pre>
        </div>
    )
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)

    const article = getArticleBySlug(slug)

    if (!article) {
        return (
            <main className="min-h-screen bg-slate-50">
                <Header />
                <div className="pt-32 pb-20 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                    <p className="text-slate-600 mb-8">The article you are looking for does not exist.</p>
                    <Link
                        href="/support/knowledge-base"
                        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Knowledge Base
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    const category = getCategoryInfo(article.category)
    const relatedArticles = getRelatedArticles(article.relatedSlugs)
    const CategoryIcon = category?.icon || BookOpen

    return (
        <main className="min-h-screen bg-slate-50">
            <Header />

            {/* Breadcrumb */}
            <section className="bg-white border-b border-slate-100 pt-24 pb-4">
                <div className="container mx-auto px-4 max-w-6xl">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/support" className="text-slate-500 hover:text-teal-600 transition-colors">
                            Support
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <Link href="/support/knowledge-base" className="text-slate-500 hover:text-teal-600 transition-colors">
                            Knowledge Base
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 font-medium">{article.title}</span>
                    </nav>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-6xl py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <article className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Article Header */}
                            <div className="mb-8 pb-8 border-b border-slate-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category?.color || "teal")}`}>
                                        <CategoryIcon className="w-4 h-4" />
                                        {category?.name}
                                    </span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                    {article.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {article.readTime} min read
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Updated {new Date(article.lastUpdated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-slate max-w-none">
                                {renderMarkdown(article.content)}
                            </div>

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-slate-100">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Tag className="w-4 h-4 text-slate-400" />
                                    {article.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Section */}
                            <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Was this article helpful?</h3>
                                {feedback ? (
                                    <p className="text-slate-600">
                                        Thank you for your feedback! {feedback === "helpful"
                                            ? "We are glad this article was helpful."
                                            : "We will work to improve this article."}
                                    </p>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setFeedback("helpful")}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-colors"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            Yes, helpful
                                        </button>
                                        <button
                                            onClick={() => setFeedback("not-helpful")}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            Not helpful
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:w-80">
                        <div className="sticky top-24 space-y-6">
                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-white rounded-xl border border-slate-200 p-6"
                                >
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Articles</h3>
                                    <div className="space-y-4">
                                        {relatedArticles.map((related) => {
                                            const relatedCategory = getCategoryInfo(related.category)
                                            return (
                                                <Link
                                                    key={related.id}
                                                    href={`/support/knowledge-base/${related.slug}`}
                                                    className="block group"
                                                >
                                                    <span className={`text-xs font-medium ${getCategoryColor(relatedCategory?.color || "teal")} px-2 py-0.5 rounded`}>
                                                        {relatedCategory?.name}
                                                    </span>
                                                    <h4 className="text-slate-900 font-medium mt-1 group-hover:text-teal-600 transition-colors">
                                                        {related.title}
                                                    </h4>
                                                    <span className="text-sm text-slate-500">{related.readTime} min read</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Contact Support CTA */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white"
                            >
                                <MessageSquare className="w-8 h-8 text-teal-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
                                <p className="text-slate-300 text-sm mb-4">
                                    Our support team is here to assist you with any questions.
                                </p>
                                <Link
                                    href="/support/contact"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors text-sm font-medium"
                                >
                                    Contact Support
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>

                            {/* Back to Knowledge Base */}
                            <Link
                                href="/support/knowledge-base"
                                className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Knowledge Base
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </main>
    )
}
