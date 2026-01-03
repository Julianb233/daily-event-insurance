# StickyBottomCTA Implementation Guide

## Quick Start

### 1. Import the Component

```tsx
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
```

### 2. Add to Your Landing Page

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <StickyBottomCTA
        text="Don't let your events go uninsured. Protect your investment today."
        buttonText="Get Coverage Now"
        onClick={() => router.push('/quote')}
        lossPerDay={127.50}
      />

      {/* Your page content */}
      <main>
        <h1>Your Content Here</h1>
        {/* More content to enable scrolling... */}
      </main>
    </>
  );
}
```

## Component Features

### Automatic Scroll Behavior
The component automatically:
- **Slides up from bottom** when page loads with smooth spring animation
- **Hides** when user scrolls down 200px
- **Reappears** when user scrolls back up
- **Closes** when user clicks the X button
- **Maintains state** for the entire page session

### Loss Counter
- Displays daily loss amount with urgency messaging
- Formats large numbers with commas (e.g., "1,234")
- Updates reactively when `lossPerDay` prop changes
- Red color-coded for visual impact

### Mobile Optimized
- Responsive button sizing for touch interfaces
- Adaptive text sizing (sm/base)
- Proper spacing for small screens
- Full-width bar on mobile
- Touch-friendly close button

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `text` | string | Yes | Main message displayed (left side) |
| `buttonText` | string | Yes | Text on the CTA button |
| `onClick` | () => void | Yes | Callback when button is clicked |
| `lossPerDay` | number | Yes | Daily loss amount (e.g., 127.50) |

## Integration Examples

### With Route Navigation

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export function LandingWithNavigation() {
  const router = useRouter();

  return (
    <StickyBottomCTA
      text="Ready to protect your event?"
      buttonText="Start Your Quote"
      onClick={() => router.push('/quote')}
      lossPerDay={350.00}
    />
  );
}
```

### With Modal Dialog

```tsx
'use client';

import { useState } from 'react';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { SignupModal } from '@/components/modals/signup-modal';

export function LandingWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <StickyBottomCTA
        text="Join thousands of protected events"
        buttonText="Sign Up Free"
        onClick={() => setIsModalOpen(true)}
        lossPerDay={500.00}
      />

      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
```

### With Analytics Tracking

```tsx
'use client';

import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { trackEvent } from '@/lib/analytics';

export function LandingWithTracking() {
  const handleCTAClick = () => {
    // Track analytics event
    trackEvent('sticky_cta_clicked', {
      timestamp: new Date().toISOString(),
      page: 'landing',
      loss_per_day: 127.50,
    });

    // Perform action
    window.location.href = '/signup';
  };

  return (
    <StickyBottomCTA
      text="Secure your event insurance today"
      buttonText="Get Started"
      onClick={handleCTAClick}
      lossPerDay={127.50}
    />
  );
}
```

### With External Link

```tsx
'use client';

import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export function LandingWithExternalLink() {
  return (
    <StickyBottomCTA
      text="Learn more about our coverage"
      buttonText="Visit Guide"
      onClick={() => {
        window.open('/coverage-guide', '_blank');
      }}
      lossPerDay={200.00}
    />
  );
}
```

### Dynamic Loss Calculation

```tsx
'use client';

import { useMemo } from 'react';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

interface DynamicCTAProps {
  eventBudget: number;
  riskMultiplier?: number;
}

export function LandingWithDynamicLoss({
  eventBudget,
  riskMultiplier = 0.5,
}: DynamicCTAProps) {
  const dailyLoss = useMemo(() => {
    return (eventBudget * riskMultiplier) / 365;
  }, [eventBudget, riskMultiplier]);

  return (
    <StickyBottomCTA
      text={`Your ${eventBudget.toLocaleString()} event needs protection`}
      buttonText="Protect Now"
      onClick={() => console.log('Getting coverage')}
      lossPerDay={dailyLoss}
    />
  );
}
```

## Styling & Theming

### Current Color Scheme

- **Background**: Dark slate gradient (slate-900)
- **Border**: Subtle slate-700
- **Text**: White (text-white)
- **Button**: Blue gradient (blue-600 to blue-700)
- **Loss Badge**: Red accent (red-500)
- **Accent Bar**: Blue to purple gradient

### Custom Styling

To customize colors, modify the Tailwind classes in the component:

**Example - Change button color to green:**

```tsx
// In sticky-bottom-cta.tsx, line ~101
- bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
+ bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800
```

**Example - Change background to lighter theme:**

```tsx
// In sticky-bottom-cta.tsx, line ~77
- bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/90
+ bg-gradient-to-t from-white via-white/95 to-white/90
+ text-slate-900
```

## Scroll Threshold Customization

The component hides after scrolling 200px. To change this:

**In sticky-bottom-cta.tsx, line 22:**

```tsx
const scrollThreshold = 200; // Change this value (in pixels)
```

Common thresholds:
- `100` - Very aggressive hiding
- `200` - Default (balanced)
- `300` - More forgiving
- `500` - Only hide on significant scroll

## Animation Customization

The component uses Framer Motion with configurable spring physics. To adjust:

**Main entrance animation (line ~74):**

```tsx
transition={{
  type: 'spring',
  damping: 25,      // Lower = bouncier
  stiffness: 400,   // Higher = faster
  mass: 0.8,        // Lower = lighter
}}
```

**Accent bar animation (line ~129):**

```tsx
transition={{
  type: 'spring',
  damping: 20,      // Adjust bounce
  stiffness: 300,   // Adjust speed
  delay: 0.2,       // Delay before animation
}}
```

Preset configurations:
- **Bouncy**: damping: 15, stiffness: 500
- **Smooth**: damping: 30, stiffness: 300
- **Quick**: damping: 20, stiffness: 600

## Performance Tips

1. **Memoize callbacks** when passing new functions:
   ```tsx
   const handleClick = useCallback(() => {
     // action
   }, []);
   ```

2. **Keep loss calculation** outside component when dynamic:
   ```tsx
   const loss = useMemo(() => calculateLoss(), [deps]);
   ```

3. **Debounced scroll** is already implemented (100ms)

4. **Component unmounts** clean up event listeners automatically

## Accessibility Checklist

- [x] Close button has aria-label
- [x] Keyboard navigation supported
- [x] Color contrast meets WCAG AA
- [x] Semantic HTML structure
- [x] Responsive text sizing
- [x] Touch-friendly button sizes (min 44x44px)

## Testing

### Unit Test Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StickyBottomCTA } from './sticky-bottom-cta';

it('should call onClick when button is clicked', () => {
  const onClick = jest.fn();
  render(
    <StickyBottomCTA
      text="Test"
      buttonText="Click"
      onClick={onClick}
      lossPerDay={100}
    />
  );
  fireEvent.click(screen.getByText('Click'));
  expect(onClick).toHaveBeenCalled();
});
```

### E2E Test Example

```tsx
import { test, expect } from '@playwright/test';

test('sticky cta hides on scroll', async ({ page }) => {
  await page.goto('/landing');
  const cta = page.locator('button:has-text("Get Coverage")');

  await expect(cta).toBeVisible();

  await page.evaluate(() => window.scrollBy(0, 300));

  await expect(cta).not.toBeVisible();
});
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Chrome/Firefox
- iOS Safari 14+

## Troubleshooting

### Component Not Showing
1. Ensure it's inside a `'use client'` component
2. Check that `isVisible` state isn't being overridden
3. Verify z-index (z-40) doesn't conflict with other elements

### Scroll Animation Not Working
1. Page must have scrollable height (content below viewport)
2. Check for JavaScript errors in console
3. Verify scroll events aren't being prevented

### Button Not Responding
1. Ensure `onClick` callback is properly passed
2. Check browser console for errors
3. Verify button isn't wrapped in parent preventing clicks

### Animation Stuttering
1. Disable other animations on page temporarily
2. Check device/browser performance
3. Consider reducing animation complexity

## Dependencies

The component requires:
- `react` 18+ (19+ recommended)
- `framer-motion` 11.x+
- `lucide-react` (for close icon)
- `tailwind-css` 3.x+

All are already installed in your project.

## Files Created

- `/components/landing/sticky-bottom-cta.tsx` - Main component (140 lines)
- `/components/landing/sticky-bottom-cta.example.tsx` - Usage examples
- `/components/landing/sticky-bottom-cta.test.tsx` - Test suite
- `/components/landing/STICKY_BOTTOM_CTA.md` - Full documentation
- `/components/landing/IMPLEMENTATION_GUIDE.md` - This file

## Next Steps

1. **Import and use** in your landing page
2. **Customize text** for your use case
3. **Test scroll behavior** with your content
4. **Adjust styling** to match your design
5. **Track analytics** with your analytics provider
6. **A/B test** different copy and loss amounts

## Support

For issues or questions:
1. Check the component's JSDoc comments
2. Review the test file for usage patterns
3. Refer to Framer Motion docs for animation tweaks
4. Check Tailwind CSS docs for styling customization

---

Last Updated: 2026-01-02
Component Version: 1.0.0
