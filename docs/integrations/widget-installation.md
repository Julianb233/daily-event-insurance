# Widget Installation Guide

The Daily Event Insurance widget provides a seamless insurance enrollment experience for your customers. This guide covers installation for all major frameworks.

## Table of Contents

- [Overview](#overview)
- [Vanilla JavaScript](#vanilla-javascript)
- [React](#react)
- [Vue](#vue)
- [Angular](#angular)
- [Configuration Options](#configuration-options)
- [Customization](#customization)
- [Events and Callbacks](#events-and-callbacks)
- [Advanced Usage](#advanced-usage)

---

## Overview

The insurance widget can be embedded in three ways:
1. **Floating Button** - A chat-style button in the corner of your site
2. **Inline Embed** - Embedded directly into your page layout
3. **Modal Trigger** - Opens as a modal when triggered by your own button

### Requirements

- HTTPS-enabled website (required for production)
- Partner ID from your Daily Event Insurance dashboard
- API key for server-side operations (optional)

---

## Vanilla JavaScript

The simplest integration method, works with any website.

### Quick Start

Add the following script tag to your HTML, just before the closing `</body>` tag:

```html
<!-- Daily Event Insurance Widget -->
<script src="https://widget.dailyevent.com/v1/embed.js"></script>
<script>
  DailyEventWidget.init({
    partnerId: 'YOUR_PARTNER_ID',
    primaryColor: '#14B8A6',
    position: 'bottom-right',
    autoOpen: false,
    onQuoteComplete: function(quote) {
      console.log('Quote generated:', quote);
    },
    onPolicyPurchased: function(policy) {
      console.log('Policy purchased:', policy);
    }
  });
</script>
```

### Inline Embed

To embed the widget inline within your page:

```html
<div id="insurance-widget-container"></div>

<script src="https://widget.dailyevent.com/v1/embed.js"></script>
<script>
  DailyEventWidget.init({
    partnerId: 'YOUR_PARTNER_ID',
    container: '#insurance-widget-container',
    mode: 'inline',
    primaryColor: '#14B8A6',
    products: ['liability', 'equipment'],
  });
</script>
```

### Programmatic Control

```javascript
// Open the widget programmatically
DailyEventWidget.open();

// Close the widget
DailyEventWidget.close();

// Toggle visibility
DailyEventWidget.toggle();

// Pre-fill customer data
DailyEventWidget.setCustomer({
  email: 'customer@example.com',
  name: 'John Doe',
  phone: '+15551234567'
});

// Pre-select event details
DailyEventWidget.setEventDetails({
  eventType: 'yoga_class',
  eventDate: '2025-03-15',
  participants: 25
});

// Destroy the widget (cleanup)
DailyEventWidget.destroy();
```

---

## React

### Installation

```bash
npm install @dailyevent/widget-react
# or
yarn add @dailyevent/widget-react
# or
pnpm add @dailyevent/widget-react
```

### Basic Usage

```tsx
import { InsuranceWidget } from '@dailyevent/widget-react'

export default function App() {
  return (
    <div>
      <h1>Book Your Class</h1>

      <InsuranceWidget
        partnerId="YOUR_PARTNER_ID"
        primaryColor="#14B8A6"
        position="bottom-right"
        autoOpen={false}
        onQuoteComplete={(quote) => console.log('Quote:', quote)}
        onPolicyPurchased={(policy) => console.log('Policy:', policy)}
      />
    </div>
  )
}
```

### With Customer Context

```tsx
import { InsuranceWidget, useInsuranceWidget } from '@dailyevent/widget-react'
import { useUser } from '@/hooks/useUser'

export default function BookingPage() {
  const { user } = useUser()
  const widget = useInsuranceWidget()

  const handleBookingComplete = (booking) => {
    // Open widget with pre-filled data after booking
    widget.open({
      customer: {
        email: user.email,
        name: user.name,
      },
      event: {
        eventType: booking.classType,
        eventDate: booking.date,
        participants: 1
      }
    })
  }

  return (
    <div>
      <BookingForm onComplete={handleBookingComplete} />

      <InsuranceWidget
        partnerId="YOUR_PARTNER_ID"
        customer={{
          email: user?.email,
          name: user?.name,
        }}
      />
    </div>
  )
}
```

### Inline Mode

```tsx
import { InlineInsuranceWidget } from '@dailyevent/widget-react'

export default function CheckoutPage() {
  return (
    <div className="checkout-container">
      <h2>Add Event Insurance</h2>

      <InlineInsuranceWidget
        partnerId="YOUR_PARTNER_ID"
        products={['liability', 'cancellation']}
        eventType="fitness_class"
        primaryColor="#14B8A6"
        onQuoteComplete={(quote) => {
          // Add quote to cart
          addToCart({
            type: 'insurance',
            quoteId: quote.id,
            premium: quote.premium
          })
        }}
      />
    </div>
  )
}
```

### Next.js Integration

For Next.js 13+ with App Router:

```tsx
// components/InsuranceWidgetWrapper.tsx
'use client'

import dynamic from 'next/dynamic'

const InsuranceWidget = dynamic(
  () => import('@dailyevent/widget-react').then((mod) => mod.InsuranceWidget),
  { ssr: false }
)

export function InsuranceWidgetWrapper(props) {
  return <InsuranceWidget {...props} />
}
```

```tsx
// app/layout.tsx
import { InsuranceWidgetWrapper } from '@/components/InsuranceWidgetWrapper'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <InsuranceWidgetWrapper
          partnerId={process.env.NEXT_PUBLIC_PARTNER_ID}
          primaryColor="#14B8A6"
        />
      </body>
    </html>
  )
}
```

---

## Vue

### Installation

```bash
npm install @dailyevent/widget-vue
# or
yarn add @dailyevent/widget-vue
# or
pnpm add @dailyevent/widget-vue
```

### Vue 3 Composition API

```vue
<template>
  <div>
    <h1>Book Your Session</h1>

    <InsuranceWidget
      :partner-id="partnerId"
      primary-color="#14B8A6"
      position="bottom-right"
      :auto-open="false"
      @quote-complete="onQuoteComplete"
      @policy-purchased="onPolicyPurchased"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { InsuranceWidget } from '@dailyevent/widget-vue'

const partnerId = ref('YOUR_PARTNER_ID')

const onQuoteComplete = (quote) => {
  console.log('Quote generated:', quote)
}

const onPolicyPurchased = (policy) => {
  console.log('Policy purchased:', policy)
}
</script>
```

### Vue 3 with Composable

```vue
<template>
  <div>
    <button @click="openWithEvent">Get Insurance Quote</button>

    <InsuranceWidget
      ref="widgetRef"
      :partner-id="partnerId"
      primary-color="#14B8A6"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { InsuranceWidget, useInsuranceWidget } from '@dailyevent/widget-vue'

const partnerId = 'YOUR_PARTNER_ID'
const widgetRef = ref(null)
const { open, setEventDetails } = useInsuranceWidget(widgetRef)

const openWithEvent = () => {
  setEventDetails({
    eventType: 'climbing_session',
    eventDate: '2025-03-20',
    participants: 15
  })
  open()
}
</script>
```

### Vue 2 Options API

```vue
<template>
  <div>
    <insurance-widget
      :partner-id="partnerId"
      primary-color="#14B8A6"
      position="bottom-right"
      @quote-complete="onQuoteComplete"
      @policy-purchased="onPolicyPurchased"
    />
  </div>
</template>

<script>
import { InsuranceWidget } from '@dailyevent/widget-vue2'

export default {
  components: {
    InsuranceWidget
  },
  data() {
    return {
      partnerId: 'YOUR_PARTNER_ID'
    }
  },
  methods: {
    onQuoteComplete(quote) {
      console.log('Quote generated:', quote)
    },
    onPolicyPurchased(policy) {
      console.log('Policy purchased:', policy)
    }
  }
}
</script>
```

---

## Angular

### Installation

```bash
npm install @dailyevent/widget-angular
```

### Module Setup

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InsuranceWidgetModule } from '@dailyevent/widget-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    InsuranceWidgetModule.forRoot({
      partnerId: 'YOUR_PARTNER_ID',
      primaryColor: '#14B8A6'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Component Usage

```typescript
// booking.component.ts
import { Component } from '@angular/core';
import { InsuranceWidgetService, Quote, Policy } from '@dailyevent/widget-angular';

@Component({
  selector: 'app-booking',
  template: `
    <div class="booking-page">
      <h1>Book Your Session</h1>

      <button (click)="openInsuranceWidget()">Add Insurance</button>

      <dei-insurance-widget
        [position]="'bottom-right'"
        [autoOpen]="false"
        (quoteComplete)="onQuoteComplete($event)"
        (policyPurchased)="onPolicyPurchased($event)"
      ></dei-insurance-widget>
    </div>
  `
})
export class BookingComponent {
  constructor(private insuranceWidget: InsuranceWidgetService) {}

  openInsuranceWidget(): void {
    this.insuranceWidget.open({
      eventType: 'fitness_class',
      eventDate: '2025-03-15',
      participants: 20
    });
  }

  onQuoteComplete(quote: Quote): void {
    console.log('Quote generated:', quote);
  }

  onPolicyPurchased(policy: Policy): void {
    console.log('Policy purchased:', policy);
  }
}
```

### Standalone Component (Angular 14+)

```typescript
// booking.component.ts
import { Component } from '@angular/core';
import { InsuranceWidgetComponent, InsuranceWidgetService } from '@dailyevent/widget-angular';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [InsuranceWidgetComponent],
  template: `
    <dei-insurance-widget
      partnerId="YOUR_PARTNER_ID"
      primaryColor="#14B8A6"
      position="bottom-right"
      (quoteComplete)="onQuoteComplete($event)"
    ></dei-insurance-widget>
  `
})
export class BookingComponent {
  onQuoteComplete(quote: Quote): void {
    console.log('Quote:', quote);
  }
}
```

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `partnerId` | `string` | Required | Your unique partner identifier |
| `primaryColor` | `string` | `#14B8A6` | Brand color for the widget |
| `position` | `string` | `bottom-right` | Widget position: `bottom-right`, `bottom-left` |
| `mode` | `string` | `floating` | Display mode: `floating`, `inline`, `modal` |
| `autoOpen` | `boolean` | `false` | Automatically open widget on page load |
| `container` | `string` | `null` | CSS selector for inline mode container |
| `products` | `string[]` | `['liability']` | Enabled product types |
| `locale` | `string` | `en-US` | Widget language/locale |
| `testMode` | `boolean` | `false` | Enable test mode (no real charges) |
| `zIndex` | `number` | `9999` | CSS z-index for the widget |

### Products Configuration

Available product types:
- `liability` - General liability coverage
- `equipment` - Equipment protection
- `cancellation` - Event cancellation coverage

```javascript
DailyEventWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  products: ['liability', 'equipment', 'cancellation'],
  // Show specific products for specific event types
  productRules: {
    'yoga_class': ['liability'],
    'equipment_rental': ['liability', 'equipment'],
    'outdoor_event': ['liability', 'cancellation']
  }
});
```

---

## Customization

### Color Theming

```javascript
DailyEventWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  theme: {
    primaryColor: '#14B8A6',      // Main brand color
    primaryHover: '#0D9488',      // Hover state
    textColor: '#1F2937',         // Primary text
    secondaryText: '#6B7280',     // Secondary text
    backgroundColor: '#FFFFFF',   // Widget background
    borderColor: '#E5E7EB',       // Border color
    successColor: '#10B981',      // Success states
    errorColor: '#EF4444',        // Error states
    borderRadius: '12px',         // Corner rounding
    fontFamily: 'Inter, system-ui, sans-serif'
  }
});
```

### Custom CSS

You can override widget styles using CSS custom properties:

```css
:root {
  --dei-primary: #14B8A6;
  --dei-primary-hover: #0D9488;
  --dei-text: #1F2937;
  --dei-background: #FFFFFF;
  --dei-border-radius: 12px;
  --dei-font-family: 'Inter', sans-serif;
}

/* Override specific elements */
.dei-widget-button {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dei-widget-header {
  padding: 1.5rem;
}
```

### Custom Button

Replace the default floating button with your own:

```javascript
DailyEventWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  customButton: true // Hides default button
});

// Attach to your own button
document.getElementById('my-insurance-button').addEventListener('click', () => {
  DailyEventWidget.open();
});
```

---

## Events and Callbacks

### Available Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onReady` | `{ widgetId }` | Widget initialized and ready |
| `onOpen` | `{}` | Widget opened |
| `onClose` | `{}` | Widget closed |
| `onQuoteStart` | `{ eventDetails }` | Quote generation started |
| `onQuoteComplete` | `{ quote }` | Quote generated successfully |
| `onQuoteError` | `{ error }` | Quote generation failed |
| `onPaymentStart` | `{ quoteId }` | Payment process started |
| `onPolicyPurchased` | `{ policy }` | Policy purchased successfully |
| `onPaymentError` | `{ error }` | Payment failed |
| `onError` | `{ error }` | General widget error |

### Callback Examples

```javascript
DailyEventWidget.init({
  partnerId: 'YOUR_PARTNER_ID',

  onReady: function(data) {
    console.log('Widget ready:', data.widgetId);
  },

  onQuoteComplete: function(quote) {
    // Track quote in analytics
    analytics.track('Insurance Quote Generated', {
      quoteId: quote.id,
      premium: quote.premium,
      coverageType: quote.coverageType
    });
  },

  onPolicyPurchased: function(policy) {
    // Store policy reference
    localStorage.setItem('lastPolicyId', policy.id);

    // Track conversion
    analytics.track('Insurance Purchased', {
      policyId: policy.id,
      premium: policy.premium,
      coverageType: policy.coverageType
    });

    // Show confirmation
    showNotification('Insurance coverage confirmed!');
  },

  onError: function(error) {
    console.error('Widget error:', error);
    // Report to error tracking
    Sentry.captureException(error);
  }
});
```

### Quote Object Structure

```typescript
interface Quote {
  id: string;                    // Unique quote ID
  quoteNumber: string;           // Human-readable quote number
  eventType: string;             // Type of event
  eventDate: string;             // ISO date string
  participants: number;          // Number of participants
  coverageType: string;          // 'liability' | 'equipment' | 'cancellation'
  premium: string;               // Premium amount (decimal string)
  currency: string;              // Currency code (e.g., 'USD')
  expiresAt: string;             // Quote expiration timestamp
  coverageDetails: {
    limit: string;               // Coverage limit
    deductible: string;          // Deductible amount
    description: string;         // Coverage description
  };
}
```

### Policy Object Structure

```typescript
interface Policy {
  id: string;                    // Unique policy ID
  policyNumber: string;          // Policy number for reference
  quoteId: string;               // Original quote ID
  eventType: string;             // Type of event
  eventDate: string;             // Event date
  effectiveDate: string;         // Coverage start date
  expirationDate: string;        // Coverage end date
  coverageType: string;          // Coverage type
  premium: string;               // Premium paid
  status: string;                // 'active' | 'pending'
  certificateUrl: string;        // URL to download certificate
  customerEmail: string;         // Customer email
}
```

---

## Advanced Usage

### Server-Side Verification

Always verify quotes and policies server-side before fulfilling orders:

```javascript
// Server-side (Node.js example)
const response = await fetch('https://api.dailyevent.com/v1/quotes/' + quoteId, {
  headers: {
    'Authorization': `Bearer ${process.env.DAILYEVENT_API_KEY}`
  }
});

const quote = await response.json();

if (quote.status === 'valid' && quote.expiresAt > new Date().toISOString()) {
  // Quote is valid, proceed with booking
}
```

### Pre-Population from Booking System

```javascript
// After user completes a booking
function onBookingComplete(booking) {
  DailyEventWidget.setEventDetails({
    eventType: mapBookingToEventType(booking.classType),
    eventDate: booking.date,
    participants: booking.attendees || 1,
    metadata: {
      bookingId: booking.id,
      className: booking.className,
      instructorId: booking.instructorId
    }
  });

  DailyEventWidget.setCustomer({
    email: booking.customerEmail,
    name: booking.customerName,
    phone: booking.customerPhone
  });

  // Optionally auto-open the widget
  DailyEventWidget.open();
}
```

### Multi-Event Support

For booking multiple classes/events:

```javascript
const events = [
  { type: 'yoga_class', date: '2025-03-15', participants: 1 },
  { type: 'yoga_class', date: '2025-03-17', participants: 1 },
  { type: 'yoga_class', date: '2025-03-19', participants: 1 }
];

DailyEventWidget.setBulkEvents(events);
DailyEventWidget.open();
```

### Test Mode

For development and testing:

```javascript
DailyEventWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  testMode: true,  // No real charges
  testCards: true  // Show test card numbers
});
```

Test card numbers:
- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Declined card
- `4000 0000 0000 9995` - Insufficient funds

---

## Support

Need help with widget integration?

- **Documentation**: https://docs.dailyevent.com/widget
- **API Reference**: https://docs.dailyevent.com/api
- **Email Support**: integration@dailyevent.com
- **In-App Support**: Use the integration chat in your partner dashboard
