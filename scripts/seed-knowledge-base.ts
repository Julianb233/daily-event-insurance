/**
 * Knowledge Base Seed Script
 *
 * Populates the integration_docs table with comprehensive documentation
 * for the Daily Event Insurance platform.
 *
 * Usage:
 *   npx tsx scripts/seed-knowledge-base.ts
 *
 * Or via npm script:
 *   npm run db:seed-knowledge
 */

import { createClient } from "@supabase/supabase-js"
import { nanoid } from "nanoid"

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables:")
  console.error("  NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗")
  console.error("  SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓" : "✗")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface KnowledgeDoc {
  title: string
  slug: string
  content: string
  category: string
  pos_system?: string
  framework?: string
  code_examples?: string
  is_published: boolean
}

// ============================================================================
// DOCUMENTATION CONTENT
// ============================================================================

const docs: KnowledgeDoc[] = [
  // -------------------------------------------------------------------------
  // GETTING STARTED
  // -------------------------------------------------------------------------
  {
    title: "Getting Started with Daily Event Insurance",
    slug: "getting-started",
    category: "getting-started",
    is_published: true,
    content: `# Getting Started with Daily Event Insurance

Welcome to Daily Event Insurance! This guide will help you integrate event insurance into your platform quickly and easily.

## Overview

Daily Event Insurance allows your customers to purchase liability coverage for their events directly through your platform. As a partner, you earn commission on every policy sold.

## Prerequisites

Before you begin, ensure you have:
- An approved partner account
- Access to the Partner Dashboard
- Your API credentials (available in Settings > API Keys)

## Integration Options

We offer three integration methods to fit your needs:

### 1. Widget Integration (Recommended)
The fastest way to get started. Drop our pre-built widget into your website with just a few lines of code.

- **Best for**: Quick implementation, standard booking flows
- **Time to integrate**: 30 minutes
- **Technical skill required**: Basic HTML/JavaScript

### 2. API Integration
Full control over the user experience with our REST API.

- **Best for**: Custom checkout flows, mobile apps
- **Time to integrate**: 2-4 hours
- **Technical skill required**: Backend development experience

### 3. POS Integration
Connect directly with your point-of-sale system for automatic insurance offers.

- **Best for**: Gyms, studios, rental businesses
- **Supported POS**: Mindbody, Pike13, Square, ClubReady, Mariana Tek
- **Time to integrate**: 1-2 hours

## Quick Start

### Step 1: Get Your API Keys

1. Log into the [Partner Dashboard](https://partners.dailyeventinsurance.com)
2. Navigate to **Settings > API Keys**
3. Copy your **Widget Key** and **API Key**

### Step 2: Choose Your Integration Method

For most partners, we recommend starting with the Widget integration:

\`\`\`html
<!-- Add to your booking confirmation page -->
<script src="https://cdn.dailyeventinsurance.com/widget/v2/embed.js"></script>
<div
  id="dei-widget"
  data-partner-key="YOUR_WIDGET_KEY"
  data-event-type="fitness_class"
></div>
\`\`\`

### Step 3: Configure Webhooks

Set up webhooks to receive real-time notifications about policy purchases:

1. Go to **Settings > Webhooks**
2. Add your endpoint URL
3. Select the events you want to receive
4. Save and verify the connection

## Next Steps

- [Widget Installation Guide](/docs/widget-installation) - Detailed widget setup
- [API Reference](/docs/api-authentication) - Full API documentation
- [POS Integrations](/docs/pos-overview) - Connect your booking system
- [Testing Guide](/docs/testing-sandbox) - Test your integration

## Support

Need help? We're here for you:
- **Live Chat**: Available in the Partner Dashboard
- **Email**: partners@dailyeventinsurance.com
- **Documentation**: You're already here!

---

*Typical integration time: 30 minutes to 2 hours depending on method chosen.*
`,
  },

  {
    title: "Testing in Sandbox Mode",
    slug: "testing-sandbox",
    category: "getting-started",
    is_published: true,
    content: `# Testing in Sandbox Mode

Before going live, test your integration thoroughly in our sandbox environment.

## Sandbox vs Production

| Feature | Sandbox | Production |
|---------|---------|------------|
| API Endpoint | \`api-sandbox.dailyeventinsurance.com\` | \`api.dailyeventinsurance.com\` |
| Payments | Test cards only | Real payments |
| Policies | Not legally binding | Legally binding |
| Webhooks | Full functionality | Full functionality |

## Enabling Sandbox Mode

### Widget
\`\`\`html
<div
  id="dei-widget"
  data-partner-key="YOUR_WIDGET_KEY"
  data-sandbox="true"
></div>
\`\`\`

### API
\`\`\`javascript
const API_BASE = 'https://api-sandbox.dailyeventinsurance.com/v1';
\`\`\`

## Test Cards

Use these test card numbers in sandbox:

| Card Number | Behavior |
|-------------|----------|
| \`4242 4242 4242 4242\` | Successful payment |
| \`4000 0000 0000 0002\` | Card declined |
| \`4000 0000 0000 9995\` | Insufficient funds |
| \`4000 0027 6000 3184\` | Requires authentication |

All test cards use:
- Any future expiry date
- Any 3-digit CVC
- Any billing ZIP code

## Testing Webhooks

### Using ngrok for Local Development

\`\`\`bash
# Install ngrok
npm install -g ngrok

# Start your local server
npm run dev

# In another terminal, expose your local server
ngrok http 3000
\`\`\`

Add the ngrok URL to your webhook settings in the Partner Dashboard.

### Webhook Test Events

Trigger test events from the Partner Dashboard:
1. Go to **Settings > Webhooks**
2. Click **Send Test Event**
3. Select the event type
4. Verify receipt in your application logs

## Checklist Before Going Live

- [ ] Widget displays correctly on booking pages
- [ ] Quotes are generated with accurate pricing
- [ ] Policy purchase flow completes successfully
- [ ] Webhooks are received and processed
- [ ] Error handling works as expected
- [ ] Mobile experience is responsive
- [ ] Analytics tracking is configured

## Switching to Production

1. Update API endpoint to production URL
2. Replace sandbox API key with production key
3. Remove \`data-sandbox="true"\` from widget
4. Update webhook URLs if needed
5. Verify first real transaction

---

*Test thoroughly! A smooth customer experience builds trust.*
`,
  },

  // -------------------------------------------------------------------------
  // WIDGET INTEGRATION
  // -------------------------------------------------------------------------
  {
    title: "Widget Installation Guide",
    slug: "widget-installation",
    category: "widget",
    is_published: true,
    content: `# Widget Installation Guide

The Daily Event Insurance widget is the fastest way to offer event insurance on your platform. This guide covers all installation methods.

## Installation Methods

### Method 1: Script Tag (Simplest)

Add this code to your booking confirmation or checkout page:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Booking Confirmation</title>
</head>
<body>
  <!-- Your booking content -->
  <h1>Booking Confirmed!</h1>

  <!-- Insurance Widget -->
  <script src="https://cdn.dailyeventinsurance.com/widget/v2/embed.js"></script>
  <div
    id="dei-widget"
    data-partner-key="pk_live_xxxxxxxxxxxx"
    data-event-type="fitness_class"
    data-event-date="2025-03-15"
    data-attendees="25"
  ></div>
</body>
</html>
\`\`\`

### Method 2: NPM Package

\`\`\`bash
npm install @dailyevent/widget
\`\`\`

\`\`\`javascript
import { DailyEventWidget } from '@dailyevent/widget';

// Initialize the widget
DailyEventWidget.init({
  partnerKey: 'pk_live_xxxxxxxxxxxx',
  containerId: 'insurance-widget',
  eventType: 'fitness_class',
  eventDate: '2025-03-15',
  attendees: 25,
  onQuoteReady: (quote) => {
    console.log('Quote generated:', quote);
  },
  onPurchaseComplete: (policy) => {
    console.log('Policy purchased:', policy);
  }
});
\`\`\`

### Method 3: Dynamic Loading

For SPAs or when you need to load the widget after page load:

\`\`\`javascript
function loadInsuranceWidget(bookingData) {
  // Load script dynamically
  const script = document.createElement('script');
  script.src = 'https://cdn.dailyeventinsurance.com/widget/v2/embed.js';
  script.onload = () => {
    window.DailyEventWidget.init({
      partnerKey: 'pk_live_xxxxxxxxxxxx',
      containerId: 'insurance-container',
      ...bookingData
    });
  };
  document.body.appendChild(script);
}

// Call when booking is confirmed
loadInsuranceWidget({
  eventType: 'birthday_party',
  eventDate: '2025-04-20',
  attendees: 30
});
\`\`\`

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| \`partnerKey\` | string | Yes | Your widget API key |
| \`containerId\` | string | Yes | DOM element ID for widget |
| \`eventType\` | string | Yes | Type of event (see Event Types) |
| \`eventDate\` | string | Yes | Event date (YYYY-MM-DD) |
| \`attendees\` | number | Yes | Expected number of attendees |
| \`customerEmail\` | string | No | Pre-fill customer email |
| \`customerName\` | string | No | Pre-fill customer name |
| \`theme\` | string | No | 'light', 'dark', or 'auto' |
| \`primaryColor\` | string | No | Hex color for branding |
| \`language\` | string | No | 'en', 'es', 'fr' |
| \`sandbox\` | boolean | No | Enable sandbox mode |

## Event Types

| Event Type | Description |
|------------|-------------|
| \`fitness_class\` | Yoga, pilates, spin classes |
| \`climbing_session\` | Rock climbing, bouldering |
| \`birthday_party\` | Children's parties, celebrations |
| \`corporate_event\` | Team building, offsites |
| \`sports_league\` | Adult recreational sports |
| \`equipment_rental\` | Gear and equipment rentals |
| \`adventure_activity\` | Zip-lining, kayaking, etc. |

## Callbacks

\`\`\`javascript
DailyEventWidget.init({
  partnerKey: 'pk_live_xxxxxxxxxxxx',
  containerId: 'widget',
  eventType: 'fitness_class',
  eventDate: '2025-03-15',
  attendees: 20,

  // Called when quote is calculated
  onQuoteReady: (quote) => {
    console.log('Premium:', quote.premium);
    console.log('Coverage:', quote.coverageAmount);
  },

  // Called when policy is purchased
  onPurchaseComplete: (policy) => {
    console.log('Policy ID:', policy.id);
    console.log('Policy Number:', policy.policyNumber);
    // Update your booking record
    updateBookingWithInsurance(policy.id);
  },

  // Called if user declines insurance
  onDeclined: () => {
    console.log('Customer declined insurance');
  },

  // Called on errors
  onError: (error) => {
    console.error('Widget error:', error.message);
  }
});
\`\`\`

## Styling

### Custom Theme
\`\`\`javascript
DailyEventWidget.init({
  // ... other options
  theme: 'light',
  primaryColor: '#14B8A6', // Your brand color
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif'
});
\`\`\`

### CSS Customization
\`\`\`css
/* Override widget styles */
#dei-widget {
  --dei-primary: #14B8A6;
  --dei-background: #ffffff;
  --dei-text: #1f2937;
  --dei-border-radius: 8px;
}
\`\`\`

## Troubleshooting

### Widget Not Appearing
1. Check console for JavaScript errors
2. Verify partner key is correct
3. Ensure container element exists in DOM
4. Check if ad blockers are interfering

### Quote Not Loading
1. Verify all required fields are provided
2. Check event date is in the future
3. Ensure attendee count is within limits (1-500)

---

*Need help? Contact partners@dailyeventinsurance.com*
`,
  },

  {
    title: "React Widget Integration",
    slug: "react-integration",
    category: "widget",
    framework: "react",
    is_published: true,
    code_examples: JSON.stringify([
      {
        language: "tsx",
        title: "Basic Usage",
        code: `import { InsuranceWidget } from '@dailyevent/react';

function BookingConfirmation({ booking }) {
  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <InsuranceWidget
        partnerKey="pk_live_xxxxxxxxxxxx"
        eventType={booking.type}
        eventDate={booking.date}
        attendees={booking.participants}
        customerEmail={booking.email}
        onPurchaseComplete={(policy) => {
          // Update your booking with policy ID
          updateBooking(booking.id, { policyId: policy.id });
        }}
      />
    </div>
  );
}`
      },
      {
        language: "tsx",
        title: "With Custom Styling",
        code: `import { InsuranceWidget } from '@dailyevent/react';

function StyledWidget() {
  return (
    <InsuranceWidget
      partnerKey="pk_live_xxxxxxxxxxxx"
      eventType="fitness_class"
      eventDate="2025-03-15"
      attendees={20}
      theme="dark"
      primaryColor="#8B5CF6"
      className="my-custom-widget"
      style={{ maxWidth: '400px', margin: '0 auto' }}
    />
  );
}`
      }
    ]),
    content: `# React Widget Integration

The official React component for Daily Event Insurance provides a seamless integration experience for React applications.

## Installation

\`\`\`bash
npm install @dailyevent/react
# or
yarn add @dailyevent/react
# or
pnpm add @dailyevent/react
\`\`\`

## Basic Usage

\`\`\`tsx
import { InsuranceWidget } from '@dailyevent/react';

function BookingConfirmation({ booking }) {
  return (
    <div>
      <h1>Booking Confirmed!</h1>
      <InsuranceWidget
        partnerKey="pk_live_xxxxxxxxxxxx"
        eventType={booking.type}
        eventDate={booking.date}
        attendees={booking.participants}
        customerEmail={booking.email}
        onPurchaseComplete={(policy) => {
          // Update your booking with policy ID
          updateBooking(booking.id, { policyId: policy.id });
        }}
      />
    </div>
  );
}
\`\`\`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`partnerKey\` | string | Yes | Your widget API key |
| \`eventType\` | string | Yes | Type of event |
| \`eventDate\` | string | Yes | Date in YYYY-MM-DD format |
| \`attendees\` | number | Yes | Number of attendees |
| \`customerEmail\` | string | No | Pre-fill customer email |
| \`customerName\` | string | No | Pre-fill customer name |
| \`theme\` | 'light' \\| 'dark' \\| 'auto' | No | Color theme |
| \`primaryColor\` | string | No | Custom primary color |
| \`sandbox\` | boolean | No | Enable sandbox mode |
| \`onQuoteReady\` | function | No | Called when quote is ready |
| \`onPurchaseComplete\` | function | No | Called after purchase |
| \`onDeclined\` | function | No | Called if user declines |
| \`onError\` | function | No | Called on errors |
| \`className\` | string | No | Custom CSS class |
| \`style\` | CSSProperties | No | Inline styles |

## TypeScript Support

The package includes full TypeScript definitions:

\`\`\`tsx
import { InsuranceWidget, Quote, Policy, InsuranceError } from '@dailyevent/react';

interface BookingProps {
  booking: {
    id: string;
    type: string;
    date: string;
    participants: number;
    email: string;
  };
}

function BookingConfirmation({ booking }: BookingProps) {
  const handleQuoteReady = (quote: Quote) => {
    console.log(\`Premium: $\${quote.premium}\`);
  };

  const handlePurchase = (policy: Policy) => {
    console.log(\`Policy: \${policy.policyNumber}\`);
  };

  const handleError = (error: InsuranceError) => {
    console.error(error.message);
  };

  return (
    <InsuranceWidget
      partnerKey="pk_live_xxxxxxxxxxxx"
      eventType={booking.type}
      eventDate={booking.date}
      attendees={booking.participants}
      onQuoteReady={handleQuoteReady}
      onPurchaseComplete={handlePurchase}
      onError={handleError}
    />
  );
}
\`\`\`

## Conditional Rendering

Only show the widget for eligible bookings:

\`\`\`tsx
function BookingConfirmation({ booking }) {
  const isEligibleForInsurance =
    booking.participants >= 5 &&
    booking.type !== 'private_session';

  return (
    <div>
      <h1>Booking Confirmed!</h1>

      {isEligibleForInsurance && (
        <InsuranceWidget
          partnerKey="pk_live_xxxxxxxxxxxx"
          eventType={booking.type}
          eventDate={booking.date}
          attendees={booking.participants}
        />
      )}
    </div>
  );
}
\`\`\`

## With React Query

\`\`\`tsx
import { useMutation } from '@tanstack/react-query';
import { InsuranceWidget, Policy } from '@dailyevent/react';

function BookingWithInsurance({ booking }) {
  const updateBookingMutation = useMutation({
    mutationFn: (policyId: string) =>
      fetch(\`/api/bookings/\${booking.id}\`, {
        method: 'PATCH',
        body: JSON.stringify({ policyId })
      })
  });

  const handlePurchase = (policy: Policy) => {
    updateBookingMutation.mutate(policy.id);
  };

  return (
    <InsuranceWidget
      partnerKey="pk_live_xxxxxxxxxxxx"
      eventType={booking.type}
      eventDate={booking.date}
      attendees={booking.participants}
      onPurchaseComplete={handlePurchase}
    />
  );
}
\`\`\`

## Server Components (Next.js 13+)

The widget requires client-side rendering. Use the \`'use client'\` directive:

\`\`\`tsx
'use client';

import { InsuranceWidget } from '@dailyevent/react';

export function InsuranceSection({ booking }) {
  return (
    <InsuranceWidget
      partnerKey="pk_live_xxxxxxxxxxxx"
      eventType={booking.type}
      eventDate={booking.date}
      attendees={booking.participants}
    />
  );
}
\`\`\`

---

*Questions? Check our [troubleshooting guide](/docs/widget-troubleshooting)*
`,
  },

  {
    title: "Next.js Integration",
    slug: "nextjs-integration",
    category: "widget",
    framework: "nextjs",
    is_published: true,
    content: `# Next.js Integration

Integrate Daily Event Insurance into your Next.js application with our React component.

## Installation

\`\`\`bash
npm install @dailyevent/react
\`\`\`

## App Router (Next.js 13+)

### Client Component

Create a client component for the widget:

\`\`\`tsx
// components/InsuranceWidget.tsx
'use client';

import { InsuranceWidget as DEIWidget } from '@dailyevent/react';

interface Props {
  eventType: string;
  eventDate: string;
  attendees: number;
  customerEmail?: string;
}

export function InsuranceWidget({ eventType, eventDate, attendees, customerEmail }: Props) {
  return (
    <DEIWidget
      partnerKey={process.env.NEXT_PUBLIC_DEI_PARTNER_KEY!}
      eventType={eventType}
      eventDate={eventDate}
      attendees={attendees}
      customerEmail={customerEmail}
      onPurchaseComplete={(policy) => {
        // Handle purchase - maybe call a server action
        console.log('Policy purchased:', policy.policyNumber);
      }}
    />
  );
}
\`\`\`

### Server Component Page

Use the client component in your server component:

\`\`\`tsx
// app/bookings/[id]/confirmation/page.tsx
import { InsuranceWidget } from '@/components/InsuranceWidget';
import { getBooking } from '@/lib/bookings';

export default async function ConfirmationPage({
  params
}: {
  params: { id: string }
}) {
  const booking = await getBooking(params.id);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p><strong>Event:</strong> {booking.eventName}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Participants:</strong> {booking.participants}</p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Protect Your Event</h2>
        <InsuranceWidget
          eventType={booking.type}
          eventDate={booking.date}
          attendees={booking.participants}
          customerEmail={booking.customerEmail}
        />
      </div>
    </div>
  );
}
\`\`\`

## Environment Variables

Add to your \`.env.local\`:

\`\`\`bash
NEXT_PUBLIC_DEI_PARTNER_KEY=pk_live_xxxxxxxxxxxx
DEI_API_KEY=sk_live_xxxxxxxxxxxx  # For server-side API calls
DEI_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
\`\`\`

## Server Actions for Policy Updates

\`\`\`tsx
// app/actions/insurance.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function linkPolicyToBooking(bookingId: string, policyId: string) {
  await db.booking.update({
    where: { id: bookingId },
    data: { insurancePolicyId: policyId }
  });

  revalidatePath(\`/bookings/\${bookingId}\`);
}
\`\`\`

## Webhook Handler

\`\`\`tsx
// app/api/webhooks/dei/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

const WEBHOOK_SECRET = process.env.DEI_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(\`sha256=\${expected}\`)
  );
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('x-dei-signature');

  if (!signature || !verifySignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(payload);

  switch (event.type) {
    case 'policy.created':
      // Handle new policy
      await db.booking.update({
        where: { id: event.data.metadata.bookingId },
        data: {
          insurancePolicyId: event.data.policyId,
          insuranceStatus: 'active'
        }
      });
      break;

    case 'policy.cancelled':
      // Handle cancellation
      await db.booking.update({
        where: { insurancePolicyId: event.data.policyId },
        data: { insuranceStatus: 'cancelled' }
      });
      break;
  }

  return NextResponse.json({ received: true });
}
\`\`\`

## Middleware for API Routes

\`\`\`tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers for widget iframe
  if (request.nextUrl.pathname.startsWith('/insurance')) {
    const response = NextResponse.next();
    response.headers.set(
      'Content-Security-Policy',
      "frame-ancestors 'self' https://*.dailyeventinsurance.com"
    );
    return response;
  }
}
\`\`\`

---

*See also: [React Integration](/docs/react-integration) | [Webhook Setup](/docs/webhook-setup)*
`,
  },

  {
    title: "Vue.js Widget Integration",
    slug: "vue-integration",
    category: "widget",
    framework: "vue",
    is_published: true,
    content: `# Vue.js Widget Integration

Integrate Daily Event Insurance into your Vue.js application.

## Installation

\`\`\`bash
npm install @dailyevent/vue
\`\`\`

## Vue 3 (Composition API)

\`\`\`vue
<template>
  <div class="booking-confirmation">
    <h1>Booking Confirmed!</h1>

    <InsuranceWidget
      :partner-key="partnerKey"
      :event-type="booking.type"
      :event-date="booking.date"
      :attendees="booking.participants"
      :customer-email="booking.email"
      @quote-ready="onQuoteReady"
      @purchase-complete="onPurchaseComplete"
      @declined="onDeclined"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { InsuranceWidget } from '@dailyevent/vue';
import type { Quote, Policy, InsuranceError } from '@dailyevent/vue';

const props = defineProps<{
  booking: {
    id: string;
    type: string;
    date: string;
    participants: number;
    email: string;
  };
}>();

const partnerKey = import.meta.env.VITE_DEI_PARTNER_KEY;

const onQuoteReady = (quote: Quote) => {
  console.log('Quote ready:', quote.premium);
};

const onPurchaseComplete = async (policy: Policy) => {
  console.log('Policy purchased:', policy.policyNumber);

  // Update your booking
  await fetch(\`/api/bookings/\${props.booking.id}\`, {
    method: 'PATCH',
    body: JSON.stringify({ policyId: policy.id })
  });
};

const onDeclined = () => {
  console.log('Customer declined insurance');
};

const onError = (error: InsuranceError) => {
  console.error('Widget error:', error.message);
};
</script>
\`\`\`

## Vue 3 (Options API)

\`\`\`vue
<template>
  <div class="booking-confirmation">
    <h1>Booking Confirmed!</h1>

    <InsuranceWidget
      :partner-key="partnerKey"
      :event-type="booking.type"
      :event-date="booking.date"
      :attendees="booking.participants"
      @purchase-complete="handlePurchase"
    />
  </div>
</template>

<script>
import { InsuranceWidget } from '@dailyevent/vue';

export default {
  components: { InsuranceWidget },

  props: {
    booking: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      partnerKey: import.meta.env.VITE_DEI_PARTNER_KEY
    };
  },

  methods: {
    async handlePurchase(policy) {
      await this.$api.patch(\`/bookings/\${this.booking.id}\`, {
        policyId: policy.id
      });
      this.$toast.success('Insurance added to your booking!');
    }
  }
};
</script>
\`\`\`

## Nuxt 3

\`\`\`vue
<!-- components/InsuranceWidget.client.vue -->
<template>
  <InsuranceWidget
    :partner-key="config.public.deiPartnerKey"
    :event-type="eventType"
    :event-date="eventDate"
    :attendees="attendees"
    @purchase-complete="$emit('purchased', $event)"
  />
</template>

<script setup lang="ts">
import { InsuranceWidget } from '@dailyevent/vue';

defineProps<{
  eventType: string;
  eventDate: string;
  attendees: number;
}>();

defineEmits<{
  purchased: [policy: { id: string; policyNumber: string }];
}>();

const config = useRuntimeConfig();
</script>
\`\`\`

Add to \`nuxt.config.ts\`:

\`\`\`ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      deiPartnerKey: process.env.NUXT_PUBLIC_DEI_PARTNER_KEY
    }
  }
});
\`\`\`

## With Pinia Store

\`\`\`ts
// stores/insurance.ts
import { defineStore } from 'pinia';

export const useInsuranceStore = defineStore('insurance', {
  state: () => ({
    policies: [] as Policy[],
    isLoading: false
  }),

  actions: {
    async addPolicy(bookingId: string, policy: Policy) {
      this.policies.push(policy);

      await $fetch(\`/api/bookings/\${bookingId}\`, {
        method: 'PATCH',
        body: { policyId: policy.id }
      });
    }
  }
});
\`\`\`

---

*Need help? Contact partners@dailyeventinsurance.com*
`,
  },

  // -------------------------------------------------------------------------
  // API REFERENCE
  // -------------------------------------------------------------------------
  {
    title: "API Authentication",
    slug: "api-authentication",
    category: "api",
    is_published: true,
    content: `# API Authentication

All API requests to Daily Event Insurance require authentication using your API key.

## API Keys

You have two types of API keys:

| Key Type | Prefix | Usage |
|----------|--------|-------|
| **Secret Key** | \`sk_live_\` / \`sk_test_\` | Server-side only, full API access |
| **Publishable Key** | \`pk_live_\` / \`pk_test_\` | Client-side widget integration |

**Important**: Never expose your secret key in client-side code!

## Authentication Header

Include your secret API key in the Authorization header:

\`\`\`
Authorization: Bearer sk_live_xxxxxxxxxxxx
\`\`\`

## Example Requests

### JavaScript/TypeScript

\`\`\`typescript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.DEI_API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'fitness_class',
    eventDate: '2025-03-15',
    attendees: 25
  })
});

const data = await response.json();
\`\`\`

### Python

\`\`\`python
import requests
import os

response = requests.post(
    'https://api.dailyeventinsurance.com/v1/quotes',
    headers={
        'Authorization': f'Bearer {os.environ["DEI_API_KEY"]}',
        'Content-Type': 'application/json'
    },
    json={
        'eventType': 'fitness_class',
        'eventDate': '2025-03-15',
        'attendees': 25
    }
)

data = response.json()
\`\`\`

### cURL

\`\`\`bash
curl -X POST https://api.dailyeventinsurance.com/v1/quotes \\
  -H "Authorization: Bearer sk_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "fitness_class",
    "eventDate": "2025-03-15",
    "attendees": 25
  }'
\`\`\`

## Error Responses

### Invalid API Key

\`\`\`json
{
  "error": {
    "type": "authentication_error",
    "message": "Invalid API key provided",
    "code": "invalid_api_key"
  }
}
\`\`\`

### Missing Authorization

\`\`\`json
{
  "error": {
    "type": "authentication_error",
    "message": "No API key provided. Include your key in the Authorization header.",
    "code": "missing_api_key"
  }
}
\`\`\`

## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Starter | 60 | 10,000 |
| Growth | 300 | 100,000 |
| Enterprise | 1,000 | Unlimited |

Rate limit headers are included in every response:

\`\`\`
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1703980800
\`\`\`

## Security Best Practices

1. **Use Environment Variables**
   \`\`\`bash
   # .env
   DEI_API_KEY=sk_live_xxxxxxxxxxxx
   \`\`\`

2. **Rotate Keys Periodically**
   - Generate new keys in the Partner Dashboard
   - Update your application
   - Revoke old keys

3. **Use Separate Keys for Environments**
   - Use \`sk_test_\` keys for development
   - Use \`sk_live_\` keys for production only

4. **Monitor API Usage**
   - Check the Partner Dashboard for usage analytics
   - Set up alerts for unusual activity

---

*Next: [Creating Quotes](/docs/api-quotes) | [Webhook Setup](/docs/webhook-setup)*
`,
  },

  {
    title: "Quotes API",
    slug: "api-quotes",
    category: "api",
    is_published: true,
    content: `# Quotes API

Generate insurance quotes for your customers programmatically.

## Create a Quote

\`\`\`
POST /v1/quotes
\`\`\`

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| \`eventType\` | string | Yes | Type of event |
| \`eventDate\` | string | Yes | Event date (YYYY-MM-DD) |
| \`attendees\` | number | Yes | Number of attendees (1-500) |
| \`duration\` | number | No | Duration in hours (default: 2) |
| \`location\` | object | No | Event location details |
| \`customerEmail\` | string | No | Customer email for follow-up |
| \`customerName\` | string | No | Customer name |
| \`metadata\` | object | No | Your custom data |

### Example Request

\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_xxxxxxxxxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'fitness_class',
    eventDate: '2025-03-15',
    attendees: 25,
    duration: 1.5,
    location: {
      state: 'CA',
      city: 'Los Angeles',
      venue: 'Downtown Yoga Studio'
    },
    customerEmail: 'jane@example.com',
    customerName: 'Jane Smith',
    metadata: {
      bookingId: 'booking_abc123',
      className: 'Morning Vinyasa Flow'
    }
  })
});

const quote = await response.json();
\`\`\`

### Response

\`\`\`json
{
  "id": "qt_1234567890",
  "object": "quote",
  "eventType": "fitness_class",
  "eventDate": "2025-03-15",
  "attendees": 25,
  "coverage": {
    "type": "general_liability",
    "amount": 1000000,
    "perOccurrence": 1000000,
    "aggregate": 2000000
  },
  "premium": 45.00,
  "partnerCommission": 11.25,
  "status": "pending",
  "expiresAt": "2025-03-14T23:59:59Z",
  "checkoutUrl": "https://checkout.dailyeventinsurance.com/qt_1234567890",
  "metadata": {
    "bookingId": "booking_abc123",
    "className": "Morning Vinyasa Flow"
  },
  "createdAt": "2025-01-15T10:30:00Z"
}
\`\`\`

## Retrieve a Quote

\`\`\`
GET /v1/quotes/{quote_id}
\`\`\`

\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes/qt_1234567890', {
  headers: {
    'Authorization': 'Bearer sk_live_xxxxxxxxxxxx'
  }
});

const quote = await response.json();
\`\`\`

## List Quotes

\`\`\`
GET /v1/quotes
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| \`status\` | string | Filter by status: pending, accepted, expired |
| \`customer_email\` | string | Filter by customer email |
| \`created_after\` | string | ISO date string |
| \`created_before\` | string | ISO date string |
| \`limit\` | number | Results per page (max 100) |
| \`starting_after\` | string | Cursor for pagination |

\`\`\`javascript
const response = await fetch(
  'https://api.dailyeventinsurance.com/v1/quotes?status=pending&limit=10',
  {
    headers: {
      'Authorization': 'Bearer sk_live_xxxxxxxxxxxx'
    }
  }
);

const { data, hasMore } = await response.json();
\`\`\`

## Quote Expiration

- Quotes expire **24 hours** before the event date
- Expired quotes cannot be converted to policies
- Create a new quote if the original expires

## Event Types and Pricing

| Event Type | Base Rate | Risk Factor |
|------------|-----------|-------------|
| \`fitness_class\` | $1.50/person | 1.0x |
| \`yoga_session\` | $1.25/person | 0.8x |
| \`climbing_session\` | $2.50/person | 1.5x |
| \`birthday_party\` | $1.75/person | 1.1x |
| \`corporate_event\` | $2.00/person | 1.2x |
| \`sports_league\` | $2.25/person | 1.3x |
| \`equipment_rental\` | $3.00/item | 1.4x |
| \`adventure_activity\` | $3.50/person | 1.8x |

*Final pricing may vary based on location, duration, and other factors.*

---

*Next: [Policies API](/docs/api-policies) | [Convert Quote to Policy](/docs/api-checkout)*
`,
  },

  {
    title: "Policies API",
    slug: "api-policies",
    category: "api",
    is_published: true,
    content: `# Policies API

Manage insurance policies programmatically.

## Create a Policy (from Quote)

Convert an accepted quote into an active policy:

\`\`\`
POST /v1/policies
\`\`\`

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| \`quoteId\` | string | Yes | ID of the accepted quote |
| \`paymentMethodId\` | string | Yes | Stripe payment method ID |
| \`billingDetails\` | object | No | Billing address if different |

### Example

\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/policies', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_xxxxxxxxxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quoteId: 'qt_1234567890',
    paymentMethodId: 'pm_card_visa_4242'
  })
});

const policy = await response.json();
\`\`\`

### Response

\`\`\`json
{
  "id": "pol_0987654321",
  "object": "policy",
  "policyNumber": "DEI-2025-ABC123",
  "quoteId": "qt_1234567890",
  "status": "active",
  "eventType": "fitness_class",
  "eventDate": "2025-03-15",
  "attendees": 25,
  "coverage": {
    "type": "general_liability",
    "amount": 1000000,
    "perOccurrence": 1000000,
    "aggregate": 2000000,
    "effectiveDate": "2025-03-15T00:00:00Z",
    "expirationDate": "2025-03-15T23:59:59Z"
  },
  "premium": 45.00,
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "documents": {
    "certificate": "https://docs.dailyeventinsurance.com/pol_0987654321/certificate.pdf",
    "policy": "https://docs.dailyeventinsurance.com/pol_0987654321/policy.pdf"
  },
  "metadata": {
    "bookingId": "booking_abc123"
  },
  "createdAt": "2025-01-15T10:35:00Z"
}
\`\`\`

## Retrieve a Policy

\`\`\`
GET /v1/policies/{policy_id}
\`\`\`

\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/policies/pol_0987654321', {
  headers: {
    'Authorization': 'Bearer sk_live_xxxxxxxxxxxx'
  }
});
\`\`\`

## List Policies

\`\`\`
GET /v1/policies
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| \`status\` | string | active, expired, cancelled |
| \`event_date_after\` | string | Filter by event date |
| \`event_date_before\` | string | Filter by event date |
| \`limit\` | number | Results per page |

## Cancel a Policy

\`\`\`
POST /v1/policies/{policy_id}/cancel
\`\`\`

\`\`\`javascript
const response = await fetch(
  'https://api.dailyeventinsurance.com/v1/policies/pol_0987654321/cancel',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk_live_xxxxxxxxxxxx',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reason: 'event_cancelled',
      refundRequested: true
    })
  }
);
\`\`\`

### Cancellation Policies

| When Cancelled | Refund |
|----------------|--------|
| 7+ days before event | 100% refund |
| 3-7 days before event | 50% refund |
| < 3 days before event | No refund |
| After event date | No refund |

## Download Documents

### Certificate of Insurance

\`\`\`
GET /v1/policies/{policy_id}/certificate
\`\`\`

Returns a PDF certificate suitable for venue requirements.

### Full Policy Document

\`\`\`
GET /v1/policies/{policy_id}/document
\`\`\`

Returns the complete policy terms and conditions.

---

*Next: [Claims API](/docs/api-claims) | [Webhook Events](/docs/webhook-setup)*
`,
  },

  {
    title: "Webhook Configuration",
    slug: "webhook-setup",
    category: "webhook",
    is_published: true,
    content: `# Webhook Configuration

Receive real-time notifications about policy events via webhooks.

## Overview

Webhooks allow your application to receive automatic notifications when events occur in your Daily Event Insurance account. This is more efficient than polling the API for updates.

## Setting Up Webhooks

### 1. Add Endpoint in Dashboard

1. Go to Partner Dashboard > Settings > Webhooks
2. Click "Add Endpoint"
3. Enter your HTTPS endpoint URL
4. Select the events you want to receive
5. Save and note your webhook secret

### 2. Endpoint Requirements

- Must be HTTPS (HTTP not accepted)
- Must respond with 2xx status within 30 seconds
- Must be publicly accessible

## Webhook Events

| Event | Description |
|-------|-------------|
| \`quote.created\` | New quote generated |
| \`quote.expired\` | Quote expired without purchase |
| \`policy.created\` | New policy purchased |
| \`policy.updated\` | Policy details changed |
| \`policy.cancelled\` | Policy was cancelled |
| \`claim.submitted\` | New claim filed |
| \`claim.updated\` | Claim status changed |
| \`payout.created\` | Commission payout initiated |

## Webhook Payload

All webhooks have this structure:

\`\`\`json
{
  "id": "evt_1234567890",
  "type": "policy.created",
  "created": "2025-01-15T10:35:00Z",
  "data": {
    "object": {
      "id": "pol_0987654321",
      "policyNumber": "DEI-2025-ABC123",
      "status": "active",
      // ... full object data
    }
  },
  "metadata": {
    "bookingId": "booking_abc123"
  }
}
\`\`\`

## Verifying Signatures

Always verify webhook signatures to ensure authenticity:

\`\`\`javascript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const trusted = Buffer.from(\`sha256=\${expectedSignature}\`, 'ascii');
  const untrusted = Buffer.from(signature, 'ascii');

  return crypto.timingSafeEqual(trusted, untrusted);
}

// In your webhook handler
app.post('/webhooks/dei', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-dei-signature'];

  if (!verifyWebhookSignature(req.body, signature, process.env.DEI_WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body);

  // Process the event
  switch (event.type) {
    case 'policy.created':
      handleNewPolicy(event.data.object);
      break;
    // ... handle other events
  }

  res.json({ received: true });
});
\`\`\`

## Python Example

\`\`\`python
import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = os.environ['DEI_WEBHOOK_SECRET']

def verify_signature(payload, signature):
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f'sha256={expected}', signature)

@app.route('/webhooks/dei', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-DEI-Signature')

    if not verify_signature(request.data, signature):
        return jsonify({'error': 'Invalid signature'}), 401

    event = request.json

    if event['type'] == 'policy.created':
        policy = event['data']['object']
        # Update your database
        db.bookings.update(
            {'_id': policy['metadata']['bookingId']},
            {'$set': {'policyId': policy['id']}}
        )

    return jsonify({'received': True})
\`\`\`

## Retry Policy

If your endpoint fails to respond with a 2xx status:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 5 minutes |
| 3 | 30 minutes |
| 4 | 2 hours |
| 5 | 24 hours |

After 5 failed attempts, the webhook is marked as failed and you'll receive an email notification.

## Testing Webhooks

### Using the Dashboard

1. Go to Settings > Webhooks
2. Click on your endpoint
3. Click "Send Test Event"
4. Select event type and send

### Using ngrok for Local Development

\`\`\`bash
# Start ngrok
ngrok http 3000

# Use the ngrok URL as your webhook endpoint
# https://abc123.ngrok.io/webhooks/dei
\`\`\`

## Best Practices

1. **Respond Quickly**: Return 200 immediately, process async
2. **Handle Duplicates**: Use event ID for idempotency
3. **Log Everything**: Keep records for debugging
4. **Use Queues**: Process webhooks via job queue for reliability

---

*Need help? Contact partners@dailyeventinsurance.com*
`,
  },

  // -------------------------------------------------------------------------
  // POS INTEGRATIONS
  // -------------------------------------------------------------------------
  {
    title: "POS Integration Overview",
    slug: "pos-overview",
    category: "pos",
    is_published: true,
    content: `# POS Integration Overview

Connect Daily Event Insurance directly with your point-of-sale system for automatic insurance offers during the booking process.

## Supported POS Systems

| POS System | Integration Type | Setup Time |
|------------|------------------|------------|
| Mindbody | API + Webhooks | 1-2 hours |
| Pike13 | OAuth + Webhooks | 1-2 hours |
| Square | OAuth + API | 1 hour |
| ClubReady | API | 2 hours |
| Mariana Tek | API + Webhooks | 1-2 hours |

## How It Works

1. **Customer Books**: Customer books a class/event in your POS
2. **Webhook Fires**: Your POS sends booking data to our system
3. **Quote Generated**: We create a personalized insurance quote
4. **Customer Notified**: Customer receives email/SMS with quote
5. **Easy Purchase**: One-click purchase with pre-filled details
6. **Confirmation**: Policy details sync back to your system

## Benefits

- **Automatic**: No manual intervention needed
- **Personalized**: Quotes based on actual booking details
- **High Conversion**: Timely offers at point of booking
- **Seamless**: Integrates with your existing workflow

## Getting Started

### Step 1: Enable API Access

In your POS system, enable API access and generate credentials:
- API Key / Client ID
- API Secret / Client Secret
- Webhook URL capability

### Step 2: Connect in Partner Dashboard

1. Log into Partner Dashboard
2. Go to **Integrations > POS Systems**
3. Select your POS
4. Enter credentials
5. Authorize the connection (OAuth systems)
6. Configure webhook endpoints

### Step 3: Map Event Types

Map your POS class/event types to our insurance categories:

| Your POS Category | Insurance Event Type |
|-------------------|---------------------|
| Yoga, Pilates | \`fitness_class\` |
| Indoor Climbing | \`climbing_session\` |
| Kids Birthday | \`birthday_party\` |
| Equipment Rental | \`equipment_rental\` |

### Step 4: Test the Integration

1. Create a test booking in your POS
2. Verify webhook received in Dashboard
3. Check quote generated correctly
4. Complete a test purchase (sandbox mode)

## Configuration Options

### Automatic Insurance Offers

Choose when to offer insurance:
- All bookings
- Bookings over X participants
- Specific class types only
- First-time customers only

### Communication Preferences

How customers receive quotes:
- Email only
- SMS only
- Both email and SMS
- Widget on confirmation page

### Pricing Display

- Show price per person
- Show total price
- Show savings vs. retail

## Analytics

Track your POS integration performance:
- Bookings with insurance offers
- Quote view rate
- Conversion rate
- Revenue from POS integration

Access analytics at **Dashboard > Analytics > POS Integration**

---

*Select your POS system for detailed setup instructions:*
- [Mindbody Integration](/docs/mindbody-integration)
- [Pike13 Integration](/docs/pike13-integration)
- [Square Integration](/docs/square-integration)
`,
  },

  {
    title: "Mindbody Integration",
    slug: "mindbody-integration",
    category: "pos",
    pos_system: "mindbody",
    is_published: true,
    content: `# Mindbody Integration

Connect Daily Event Insurance with your Mindbody account to automatically offer insurance for class bookings.

## Prerequisites

- Active Mindbody subscription with API access
- Partner account with Daily Event Insurance
- Admin access to Mindbody

## Step 1: Enable Mindbody API Access

1. Log into your Mindbody business portal
2. Navigate to **Settings > API Access**
3. Enable third-party API access
4. Note your **Site ID** (numeric, e.g., \`12345\`)

## Step 2: Generate API Credentials

1. Go to [Mindbody Developer Portal](https://developers.mindbodyonline.com)
2. Create a new application or use existing
3. Request API access for your Site ID
4. Note your **API Key** and **API Secret**

## Step 3: Connect in Partner Dashboard

1. Log into [Partner Dashboard](https://partners.dailyeventinsurance.com)
2. Go to **Integrations > POS Systems > Mindbody**
3. Enter:
   - Site ID
   - API Key
   - API Secret
4. Click **Connect**
5. Authorize the connection when prompted

## Step 4: Configure Webhooks

Set up Mindbody webhooks to notify us of new bookings:

1. In Mindbody, go to **Settings > Webhooks**
2. Add a new webhook endpoint:
   - URL: \`https://api.dailyeventinsurance.com/webhooks/mindbody/{your_partner_id}\`
   - Events: \`Client.ClientAdded\`, \`Client.ClassBooked\`
3. Save and verify the webhook

## Step 5: Map Class Types

In the Partner Dashboard, map your Mindbody class types:

| Mindbody Class | Insurance Category |
|----------------|-------------------|
| Yoga | \`fitness_class\` |
| Spin | \`fitness_class\` |
| Climbing | \`climbing_session\` |
| Kids Party | \`birthday_party\` |

## Configuration

### Offer Timing

Choose when insurance is offered:
- **Immediately**: Right after booking
- **24 hours before**: Reminder before class
- **Both**: Initial offer + reminder

### Eligibility Rules

Set criteria for insurance offers:
\`\`\`json
{
  "minAttendees": 1,
  "maxAttendees": 100,
  "excludedClassTypes": ["private_training"],
  "newCustomersOnly": false
}
\`\`\`

## Testing

1. Create a test booking in Mindbody
2. Check Dashboard > Webhooks for received event
3. Verify quote was generated
4. Test the customer purchase flow

## Troubleshooting

### "Connection Failed"
- Verify Site ID is correct (numeric only)
- Check API credentials are active
- Ensure API access is enabled in Mindbody

### "Webhooks Not Received"
- Confirm webhook URL is correct
- Check Mindbody webhook logs for errors
- Verify your firewall allows Mindbody IPs

### "Classes Not Showing"
- Refresh class type mapping
- Check class is not in excluded list
- Verify class has future schedule

## API Reference

### Mindbody Webhook Payload

\`\`\`json
{
  "eventType": "Client.ClassBooked",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "clientId": "12345",
    "classId": "67890",
    "classDate": "2025-03-15",
    "className": "Morning Vinyasa",
    "locationId": "1",
    "staffId": "42"
  }
}
\`\`\`

### Manual Quote Creation

If webhooks are unavailable, create quotes manually:

\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'fitness_class',
    eventDate: '2025-03-15',
    attendees: 20,
    metadata: {
      source: 'mindbody',
      classId: '67890',
      className: 'Morning Vinyasa'
    }
  })
});
\`\`\`

---

*Need help? Contact partners@dailyeventinsurance.com*
`,
  },

  {
    title: "Pike13 Integration",
    slug: "pike13-integration",
    category: "pos",
    pos_system: "pike13",
    is_published: true,
    content: `# Pike13 Integration

Connect Daily Event Insurance with Pike13 to offer insurance during the booking flow.

## Prerequisites

- Active Pike13 subscription
- API access enabled
- Partner account with Daily Event Insurance

## Step 1: Enable Pike13 API

1. Log into Pike13 Admin
2. Go to **Settings > Integrations > API Access**
3. Enable API access
4. Generate OAuth credentials
5. Note your **Client ID** and **Client Secret**

## Step 2: Connect in Partner Dashboard

1. Log into Partner Dashboard
2. Go to **Integrations > POS Systems > Pike13**
3. Click **Connect with Pike13**
4. Authorize access when prompted
5. Grant required permissions

### Required Permissions

- Read clients
- Read enrollments
- Read events
- Receive webhooks

## Step 3: Configure Webhooks

Pike13 webhooks are configured automatically during OAuth. Verify in Dashboard:

1. Go to **Integrations > Pike13 > Webhooks**
2. Confirm all events are enabled:
   - \`enrollment.created\`
   - \`enrollment.updated\`
   - \`client.created\`

## Step 4: Map Service Categories

Map Pike13 services to insurance types:

\`\`\`javascript
// Example mapping configuration
{
  "serviceMapping": {
    "group_class": "fitness_class",
    "personal_training": null, // Skip insurance offers
    "workshop": "fitness_class",
    "kids_camp": "birthday_party",
    "climbing": "climbing_session"
  }
}
\`\`\`

## Configuration Options

### Automatic Offers

\`\`\`json
{
  "autoOffer": {
    "enabled": true,
    "timing": "immediate",
    "channels": ["email"],
    "excludeServices": ["private_session"]
  }
}
\`\`\`

### Customer Communication

Customize email templates in Dashboard:
- Subject line
- Pre-header text
- Call-to-action button text

## Testing

1. Create a test enrollment in Pike13
2. Check webhook delivery in Dashboard
3. Verify customer received insurance offer
4. Complete test purchase

## Troubleshooting

### OAuth Token Expired

Tokens expire after 30 days. To refresh:
1. Go to **Integrations > Pike13**
2. Click **Reconnect**
3. Re-authorize access

### Missing Enrollments

- Check webhook status in Dashboard
- Verify service is mapped to insurance type
- Confirm enrollment meets eligibility criteria

---

*See also: [POS Overview](/docs/pos-overview) | [Mindbody Integration](/docs/mindbody-integration)*
`,
  },

  {
    title: "Square Integration",
    slug: "square-integration",
    category: "pos",
    pos_system: "square",
    is_published: true,
    content: `# Square Integration

Connect Daily Event Insurance with Square Appointments and Bookings.

## Prerequisites

- Square account with Appointments enabled
- Partner account with Daily Event Insurance

## Step 1: Connect Square

1. Log into Partner Dashboard
2. Go to **Integrations > POS Systems > Square**
3. Click **Connect with Square**
4. Sign in to your Square account
5. Authorize Daily Event Insurance

### Permissions Requested

- Read bookings
- Read customers
- Read business information
- Receive webhooks

## Step 2: Configure Services

After connecting, map your Square services:

1. Go to **Integrations > Square > Service Mapping**
2. For each service, select insurance type:

| Square Service | Insurance Type |
|----------------|----------------|
| Group Fitness | \`fitness_class\` |
| Climbing Session | \`climbing_session\` |
| Birthday Package | \`birthday_party\` |
| Equipment Rental | \`equipment_rental\` |

## Step 3: Set Up Webhooks

Webhooks are configured automatically. Verify at:
**Integrations > Square > Webhooks**

Events monitored:
- \`booking.created\`
- \`booking.updated\`

## Integration Flow

\`\`\`
Customer books via Square
        ↓
Square sends webhook
        ↓
DEI receives booking data
        ↓
Quote generated
        ↓
Customer receives email with quote
        ↓
One-click purchase
        ↓
Policy synced back to Square notes
\`\`\`

## Configuration

### Offer Settings

\`\`\`json
{
  "square": {
    "offerInsurance": true,
    "offerTiming": "immediate",
    "minimumAttendees": 1,
    "addToCustomerNotes": true
  }
}
\`\`\`

### Customer Notes

When a policy is purchased, we add a note to the Square customer:

\`\`\`
Insurance Policy: DEI-2025-ABC123
Coverage: $1,000,000 General Liability
Event Date: March 15, 2025
\`\`\`

## Testing

1. Create a test booking in Square
2. Check webhook in Dashboard
3. Verify email sent to customer
4. Complete test purchase

## API Access

For advanced integrations, use our API with Square data:

\`\`\`javascript
const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventType: 'fitness_class',
    eventDate: '2025-03-15',
    attendees: 15,
    customerEmail: 'customer@example.com',
    metadata: {
      source: 'square',
      squareBookingId: 'booking_abc123',
      squareCustomerId: 'customer_xyz'
    }
  })
});
\`\`\`

---

*See also: [POS Overview](/docs/pos-overview) | [API Reference](/docs/api-authentication)*
`,
  },

  // -------------------------------------------------------------------------
  // TROUBLESHOOTING
  // -------------------------------------------------------------------------
  {
    title: "Widget Troubleshooting",
    slug: "widget-troubleshooting",
    category: "troubleshooting",
    is_published: true,
    content: `# Widget Troubleshooting

Common widget issues and their solutions.

## Widget Not Appearing

### Check Script Loading

Open browser DevTools (F12) and check the Console tab:

\`\`\`javascript
// Run in console to check if widget loaded
if (window.DailyEventWidget) {
  console.log('✓ Widget script loaded');
} else {
  console.log('✗ Widget script not loaded');
}
\`\`\`

### Common Causes

1. **Script Blocked by Ad Blocker**
   - Temporarily disable ad blocker
   - Add exception for dailyeventinsurance.com

2. **Content Security Policy**
   Add to your CSP header:
   \`\`\`
   script-src 'self' https://cdn.dailyeventinsurance.com;
   frame-src 'self' https://*.dailyeventinsurance.com;
   \`\`\`

3. **Invalid Partner Key**
   - Verify key in Partner Dashboard
   - Check for typos or extra spaces
   - Ensure using correct environment key

4. **Container Element Missing**
   \`\`\`html
   <!-- Make sure this element exists -->
   <div id="dei-widget"></div>
   \`\`\`

## Quote Not Loading

### Required Fields

All these fields are required:
- \`partnerKey\`
- \`eventType\`
- \`eventDate\` (YYYY-MM-DD format)
- \`attendees\` (number between 1-500)

### Validation Errors

\`\`\`javascript
// Check for validation issues
DailyEventWidget.init({
  partnerKey: 'pk_live_xxx',
  eventType: 'fitness_class',
  eventDate: '2025-03-15',
  attendees: 25,
  onError: (error) => {
    console.error('Widget error:', error);
    // Common errors:
    // - "Invalid event date" - date is in the past
    // - "Invalid attendees" - must be 1-500
    // - "Unknown event type" - check eventType value
  }
});
\`\`\`

### Event Date Issues

- Date must be in the future
- Format must be YYYY-MM-DD
- Quotes expire 24 hours before event

## Styling Problems

### Widget Inheriting Page Styles

Isolate the widget container:
\`\`\`css
#dei-widget {
  all: initial;
  display: block;
}

#dei-widget * {
  box-sizing: border-box;
}
\`\`\`

### Z-Index Issues

If widget appears behind other elements:
\`\`\`css
#dei-widget {
  position: relative;
  z-index: 1000;
}
\`\`\`

### Mobile Display Issues

Ensure viewport is set:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

## Payment Failures

### Card Declined

Test cards for sandbox:
| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |

### 3D Secure Required

Some cards require authentication. The widget handles this automatically, but ensure:
- Popup blockers are disabled
- Cookies are enabled

## Network Issues

### Check API Connectivity

\`\`\`javascript
fetch('https://api.dailyeventinsurance.com/health')
  .then(r => r.json())
  .then(data => console.log('API status:', data))
  .catch(err => console.error('API unreachable:', err));
\`\`\`

### CORS Errors

If you see CORS errors:
1. Verify your domain is registered in Partner Dashboard
2. Check for HTTP vs HTTPS mismatch
3. Contact support if issues persist

## Debugging Mode

Enable verbose logging:
\`\`\`javascript
DailyEventWidget.init({
  // ... other options
  debug: true  // Enables console logging
});
\`\`\`

## Getting Help

If issues persist:
1. Open DevTools and screenshot Console errors
2. Note your Partner ID and event details
3. Email partners@dailyeventinsurance.com with:
   - Console screenshots
   - Page URL
   - Steps to reproduce

---

*See also: [Widget Installation](/docs/widget-installation) | [Testing Guide](/docs/testing-sandbox)*
`,
  },

  {
    title: "API Error Reference",
    slug: "api-errors",
    category: "troubleshooting",
    is_published: true,
    content: `# API Error Reference

Complete list of API error codes and how to resolve them.

## Error Response Format

All errors return this structure:
\`\`\`json
{
  "error": {
    "type": "invalid_request_error",
    "code": "missing_required_field",
    "message": "The 'eventDate' field is required",
    "param": "eventDate",
    "doc_url": "https://docs.dailyeventinsurance.com/api-errors#missing_required_field"
  }
}
\`\`\`

## HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limited |
| 500 | Server Error - Contact support |

## Error Types

### \`authentication_error\`

**invalid_api_key**
\`\`\`json
{
  "error": {
    "type": "authentication_error",
    "code": "invalid_api_key",
    "message": "Invalid API key provided"
  }
}
\`\`\`
*Solution*: Check your API key in Partner Dashboard. Ensure you're using the correct environment key.

**missing_api_key**
\`\`\`json
{
  "error": {
    "type": "authentication_error",
    "code": "missing_api_key",
    "message": "No API key provided"
  }
}
\`\`\`
*Solution*: Add Authorization header: \`Bearer sk_live_xxx\`

### \`invalid_request_error\`

**missing_required_field**
\`\`\`json
{
  "error": {
    "type": "invalid_request_error",
    "code": "missing_required_field",
    "message": "The 'eventType' field is required",
    "param": "eventType"
  }
}
\`\`\`
*Solution*: Include all required fields in your request.

**invalid_field_value**
\`\`\`json
{
  "error": {
    "type": "invalid_request_error",
    "code": "invalid_field_value",
    "message": "attendees must be between 1 and 500",
    "param": "attendees"
  }
}
\`\`\`
*Solution*: Check field value meets validation requirements.

**invalid_date_format**
\`\`\`json
{
  "error": {
    "type": "invalid_request_error",
    "code": "invalid_date_format",
    "message": "eventDate must be in YYYY-MM-DD format",
    "param": "eventDate"
  }
}
\`\`\`
*Solution*: Use ISO date format: \`2025-03-15\`

### \`resource_error\`

**quote_not_found**
\`\`\`json
{
  "error": {
    "type": "resource_error",
    "code": "quote_not_found",
    "message": "Quote qt_xxx not found"
  }
}
\`\`\`
*Solution*: Verify quote ID is correct and hasn't expired.

**quote_expired**
\`\`\`json
{
  "error": {
    "type": "resource_error",
    "code": "quote_expired",
    "message": "Quote has expired. Create a new quote."
  }
}
\`\`\`
*Solution*: Create a new quote. Quotes expire 24 hours before event.

### \`rate_limit_error\`

**too_many_requests**
\`\`\`json
{
  "error": {
    "type": "rate_limit_error",
    "code": "too_many_requests",
    "message": "Rate limit exceeded. Retry after 60 seconds."
  }
}
\`\`\`
*Solution*: Implement exponential backoff. Check rate limit headers.

## Handling Errors

### JavaScript
\`\`\`javascript
try {
  const response = await fetch('https://api.dailyeventinsurance.com/v1/quotes', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer sk_live_xxx' },
    body: JSON.stringify(quoteData)
  });

  if (!response.ok) {
    const error = await response.json();

    switch (error.error.code) {
      case 'invalid_api_key':
        // Re-authenticate
        break;
      case 'too_many_requests':
        // Retry with backoff
        break;
      default:
        console.error(error.error.message);
    }
  }
} catch (e) {
  // Network error
  console.error('Network error:', e);
}
\`\`\`

### Python
\`\`\`python
import requests
from requests.exceptions import RequestException

try:
    response = requests.post(
        'https://api.dailyeventinsurance.com/v1/quotes',
        headers={'Authorization': 'Bearer sk_live_xxx'},
        json=quote_data
    )
    response.raise_for_status()
except requests.HTTPError as e:
    error = response.json()['error']
    print(f"API Error: {error['code']} - {error['message']}")
except RequestException as e:
    print(f"Network Error: {e}")
\`\`\`

---

*Need help? Contact partners@dailyeventinsurance.com*
`,
  },
]

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedKnowledgeBase() {
  console.log("🌱 Seeding knowledge base...")
  console.log(`   ${docs.length} documents to insert`)

  let inserted = 0
  let skipped = 0
  let errors = 0

  for (const doc of docs) {
    try {
      // Check if document already exists
      const { data: existing } = await supabase
        .from("integration_docs")
        .select("id")
        .eq("slug", doc.slug)
        .single()

      if (existing) {
        console.log(`   ⏭️  Skipping "${doc.title}" (already exists)`)
        skipped++
        continue
      }

      // Insert the document
      const { error } = await supabase.from("integration_docs").insert({
        id: nanoid(),
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        category: doc.category,
        pos_system: doc.pos_system || null,
        framework: doc.framework || null,
        code_examples: doc.code_examples || null,
        is_published: doc.is_published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error(`   ❌ Error inserting "${doc.title}":`, error.message)
        errors++
      } else {
        console.log(`   ✅ Inserted "${doc.title}"`)
        inserted++
      }
    } catch (err) {
      console.error(`   ❌ Exception for "${doc.title}":`, err)
      errors++
    }
  }

  console.log("\n📊 Seed Summary:")
  console.log(`   ✅ Inserted: ${inserted}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📚 Total docs: ${docs.length}`)
}

// Run the seed
seedKnowledgeBase()
  .then(() => {
    console.log("\n✨ Knowledge base seeding complete!")
    process.exit(0)
  })
  .catch((err) => {
    console.error("\n💥 Seeding failed:", err)
    process.exit(1)
  })
