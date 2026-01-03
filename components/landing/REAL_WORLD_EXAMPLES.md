# StickyBottomCTA - Real World Usage Examples

Complete, production-ready examples of how to integrate the StickyBottomCTA component into your daily-event-insurance landing pages.

## 1. Basic Landing Page

```tsx
// app/landing/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { HeroSection } from '@/components/landing/hero';
import { FeaturesSection } from '@/components/landing/features';
import { PricingSection } from '@/components/landing/pricing';

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <StickyBottomCTA
        text="Protect your event from financial loss with comprehensive insurance coverage."
        buttonText="Get Quote Now"
        onClick={() => router.push('/quote')}
        lossPerDay={127.50}
      />

      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
    </>
  );
}
```

## 2. Category-Specific Landing Page

```tsx
// app/landing/wedding/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

const CATEGORY_LOSSES = {
  wedding: 15000,    // Average wedding is ~$33k, daily loss ~$90
  corporate: 50000,  // Corporate event average ~$100k, daily loss ~$273
  music: 75000,      // Festival average ~$500k, daily loss ~$1370
  sports: 100000,    // Sports event average ~$1m, daily loss ~$2740
  wedding_reception: 20000,
};

export default function WeddingLandingPage() {
  const router = useRouter();
  const dailyLoss = CATEGORY_LOSSES.wedding / 365;

  return (
    <>
      <StickyBottomCTA
        text="Your wedding deserves protection. One cancellation could cost $15,000+."
        buttonText="Protect Your Wedding"
        onClick={() => router.push('/quote?category=wedding')}
        lossPerDay={dailyLoss}
      />

      <main>
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-6">Wedding Insurance</h1>
            <p className="text-xl text-gray-600 mb-8">
              Protect your big day from unexpected cancellations and weather.
            </p>

            {/* Content */}
            <div className="space-y-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <section key={i} className="border-b pb-12">
                  <h2 className="text-3xl font-semibold mb-4">
                    Coverage Section {i + 1}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

## 3. With Dynamic Loss Calculation

```tsx
// app/landing/calculator/page.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export default function CalculatorLandingPage() {
  const router = useRouter();
  const [eventBudget, setEventBudget] = useState(50000);

  // Calculate daily loss based on event budget
  const dailyLoss = useMemo(() => {
    // Assume 50% loss if event is cancelled
    const potentialLoss = eventBudget * 0.5;
    return potentialLoss / 365;
  }, [eventBudget]);

  const handleQuoteClick = useCallback(() => {
    router.push(`/quote?budget=${eventBudget}`);
  }, [eventBudget, router]);

  return (
    <>
      <StickyBottomCTA
        text={`Your ${eventBudget.toLocaleString()} event is at risk.`}
        buttonText="Calculate Protection Cost"
        onClick={handleQuoteClick}
        lossPerDay={dailyLoss}
      />

      <main>
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
          <div className="max-w-2xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Event Insurance Calculator
            </h1>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <label className="block mb-4">
                <span className="text-lg font-semibold text-gray-800 block mb-2">
                  Event Budget
                </span>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={eventBudget}
                  onChange={(e) => setEventBudget(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${eventBudget.toLocaleString()}
                  </span>
                  <p className="text-gray-600 mt-2">
                    Daily loss if cancelled: ${dailyLoss.toFixed(2)}
                  </p>
                </div>
              </label>

              {/* More calculator content */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-800">
                  With our coverage, you would be protected against financial loss
                  from cancellation, weather, or venue issues.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

## 4. With Multiple Event Types

```tsx
// app/landing/[eventType]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

const EVENT_CONFIG = {
  wedding: {
    title: 'Wedding Insurance',
    description: 'Protect your special day from unexpected changes.',
    budget: 35000,
    loss: 95.89,
    lossExplanation: 'Average wedding budget',
  },
  corporate: {
    title: 'Corporate Event Insurance',
    description: 'Safeguard your business event investment.',
    budget: 100000,
    loss: 273.97,
    lossExplanation: 'Average corporate event budget',
  },
  concert: {
    title: 'Concert & Festival Insurance',
    description: 'Protect large-scale entertainment events.',
    budget: 250000,
    loss: 684.93,
    lossExplanation: 'Average concert/festival budget',
  },
  sports: {
    title: 'Sports Event Insurance',
    description: 'Coverage for sporting events and competitions.',
    budget: 150000,
    loss: 410.96,
    lossExplanation: 'Average sports event budget',
  },
  conference: {
    title: 'Conference & Expo Insurance',
    description: 'Business conference and expo protection.',
    budget: 200000,
    loss: 547.95,
    lossExplanation: 'Average conference budget',
  },
};

export default function EventTypePage() {
  const params = useParams();
  const router = useRouter();
  const eventType = (params.eventType as string) || 'wedding';
  const config = EVENT_CONFIG[eventType as keyof typeof EVENT_CONFIG];

  if (!config) {
    return <div>Event type not found</div>;
  }

  return (
    <>
      <StickyBottomCTA
        text={`Protect your ${eventType} investment. Don't risk it.`}
        buttonText="Get Coverage"
        onClick={() => router.push(`/quote?type=${eventType}`)}
        lossPerDay={config.loss}
      />

      <main>
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-4">{config.title}</h1>
            <p className="text-xl text-gray-600 mb-12">{config.description}</p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Why You Need Coverage</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>Weather-related cancellations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>Venue issues or closure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>Key participant illness</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>Equipment failure</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">What's Covered</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Refunds and rescheduling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Lost deposits and fees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Additional expenses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Liability protection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Add more sections to increase scroll height */}
            <div className="mt-16 space-y-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <section key={i}>
                  <h3 className="text-2xl font-semibold mb-4">
                    Section {i + 1}: {['Coverage Details', 'Pricing', 'Testimonials'][i]}
                  </h3>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

## 5. With Analytics Integration

```tsx
// app/landing/with-analytics/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { useAnalytics } from '@/lib/analytics';

export default function LandingWithAnalyticsPage() {
  const router = useRouter();
  const { trackEvent } = useAnalytics();

  const handleCTAClick = () => {
    // Track the CTA click
    trackEvent('sticky_cta_clicked', {
      location: 'bottom_bar',
      page: 'landing',
      timestamp: new Date().toISOString(),
    });

    // Track when user navigates
    trackEvent('cta_to_quote', {
      source: 'sticky_cta',
    });

    // Navigate
    router.push('/quote');
  };

  return (
    <>
      <StickyBottomCTA
        text="Ready to protect your event? Get a quote in 2 minutes."
        buttonText="Start Free Quote"
        onClick={handleCTAClick}
        lossPerDay={250.00}
      />

      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

## 6. With Modal Integration

```tsx
// app/landing/with-modal/page.tsx
'use client';

import { useState } from 'react';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { SignupModal } from '@/components/modals/signup-modal';

export default function LandingWithModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('');

  const handleCTAClick = () => {
    setModalSource('sticky_cta');
    setIsModalOpen(true);
  };

  return (
    <>
      <StickyBottomCTA
        text="Join thousands of event organizers who protect their investments."
        buttonText="Sign Up Free"
        onClick={handleCTAClick}
        lossPerDay={175.00}
      />

      <SignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={modalSource}
      />

      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

## 7. Contextual Copy Based on Scroll Position

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export default function ContextualCTAPage() {
  const router = useRouter();
  const [ctaCopy, setCtaCopy] = useState({
    text: "Don't let your events go uninsured.",
    button: 'Get Coverage Now',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      // Change messaging based on scroll position
      if (scrollPercent < 25) {
        setCtaCopy({
          text: "Don't let your events go uninsured.",
          button: 'Get Coverage Now',
        });
      } else if (scrollPercent < 50) {
        setCtaCopy({
          text: 'See how other events are protected.',
          button: 'View Features',
        });
      } else if (scrollPercent < 75) {
        setCtaCopy({
          text: 'Ready to protect your investment?',
          button: 'Get a Quote',
        });
      } else {
        setCtaCopy({
          text: 'Make the final step. Secure your event today.',
          button: 'Complete Quote',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <StickyBottomCTA
        text={ctaCopy.text}
        buttonText={ctaCopy.button}
        onClick={() => router.push('/quote')}
        lossPerDay={127.50}
      />

      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

## 8. With Conditional Rendering Based on User State

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export default function SmartCTAPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleCTAClick = () => {
    if (user) {
      // Logged in users go to complete quote
      router.push('/dashboard/quotes');
    } else {
      // New visitors go to signup
      router.push('/sign-up');
    }
  };

  return (
    <>
      {/* Only show CTA if user is not logged in or hasn't completed quote */}
      {!user?.hasQuote && (
        <StickyBottomCTA
          text={
            user
              ? 'You have an incomplete quote. Complete it now to get coverage.'
              : "Protect your event. Get insured today."
          }
          buttonText={user ? 'Complete Quote' : 'Get Started'}
          onClick={handleCTAClick}
          lossPerDay={127.50}
        />
      )}

      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

## 9. A/B Testing Variants

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { useABTest } from '@/lib/ab-testing';

const CTA_VARIANTS = {
  variant_a: {
    text: 'Protect your event from financial loss.',
    button: 'Get Coverage',
    loss: 127.50,
  },
  variant_b: {
    text: 'Join 5,000+ protected events. You could lose $127/day.',
    button: 'Start Protection',
    loss: 127.50,
  },
  variant_c: {
    text: 'Your event deserves insurance. Get a free quote in 2 minutes.',
    button: 'Get Free Quote',
    loss: 127.50,
  },
};

export default function ABTestLandingPage() {
  const router = useRouter();
  const { variant } = useABTest('landing_cta', Object.keys(CTA_VARIANTS));
  const config = CTA_VARIANTS[variant as keyof typeof CTA_VARIANTS];

  return (
    <>
      <StickyBottomCTA
        text={config.text}
        buttonText={config.button}
        onClick={() => router.push('/quote')}
        lossPerDay={config.loss}
      />

      <main>
        {/* Page content */}
      </main>
    </>
  );
}
```

## 10. Emergency/Urgency Messaging

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { AlertCircle } from 'lucide-react';

export default function UrgencyLandingPage() {
  const router = useRouter();

  return (
    <>
      <StickyBottomCTA
        text="Last minute event? We cover same-day bookings. Limit: 5 remaining today."
        buttonText="Secure Coverage Now"
        onClick={() => router.push('/quote?urgent=true')}
        lossPerDay={500.00}
      />

      <main>
        {/* Page content with urgency messaging */}
      </main>
    </>
  );
}
```

---

## Implementation Checklist

- [ ] Choose the example that matches your use case
- [ ] Copy the code to your landing page
- [ ] Customize the text and button labels
- [ ] Update the loss amount calculation
- [ ] Test scroll behavior with real content
- [ ] Test on mobile devices
- [ ] Connect to analytics if needed
- [ ] Test the onClick callback/navigation
- [ ] A/B test different copy variations
- [ ] Monitor conversion metrics

## Common Customizations

| Use Case | Modification |
|----------|--------------|
| Different event types | Use dynamic CONFIG object |
| Analytics tracking | Add trackEvent in onClick |
| User-specific content | Check user state before rendering |
| Modal signup | setState to open modal |
| Dynamic pricing | Calculate loss from user inputs |
| Multiple variants | Use AB testing framework |
| Conditional display | Use conditional rendering |
| Theme customization | Modify Tailwind classes |

---

**Last Updated**: 2026-01-02
**Version**: 1.0.0
