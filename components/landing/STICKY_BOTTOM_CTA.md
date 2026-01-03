# StickyBottomCTA Component

A responsive, animated sticky bottom call-to-action component for landing pages and marketing funnels. Features smooth scroll-triggered animations, loss urgency counters, and full mobile support.

## Overview

The StickyBottomCTA component displays a persistent call-to-action bar at the bottom of the viewport that:
- Automatically hides when users scroll down 200px
- Smoothly re-appears when scrolling back up
- Shows a real-time loss counter for urgency
- Provides a prominent action button
- Allows users to dismiss the bar with a close button
- Supports full mobile responsiveness

## Features

- **Smooth Animations**: Powered by Framer Motion with spring physics
- **Scroll-Triggered**: Intelligently hides/shows based on scroll position
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **TypeScript Support**: Fully typed props and internal state
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Performance**: Optimized scroll listeners with debouncing
- **Dark Theme**: Modern slate/dark gradient background
- **Loss Counter**: Display daily financial losses for urgency

## Props

```typescript
interface StickyBottomCTAProps {
  /** Main text/message displayed on the left */
  text: string;

  /** Text displayed on the CTA button */
  buttonText: string;

  /** Callback function when the button is clicked */
  onClick: () => void;

  /** Daily loss amount for the urgency counter (e.g., 127.50) */
  lossPerDay: number;
}
```

## Usage

### Basic Implementation

```tsx
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export default function LandingPage() {
  const handleCTAClick = () => {
    // Navigate to signup, open modal, etc.
    router.push('/signup');
  };

  return (
    <>
      <StickyBottomCTA
        text="Don't let your events go uninsured."
        buttonText="Get Coverage Now"
        onClick={handleCTAClick}
        lossPerDay={127.50}
      />

      {/* Your page content */}
      <main>
        {/* Content here */}
      </main>
    </>
  );
}
```

### With Router Integration

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';

export function LandingPageWithRouter() {
  const router = useRouter();

  return (
    <StickyBottomCTA
      text="Protect your event with comprehensive insurance coverage"
      buttonText="Start Your Quote"
      onClick={() => router.push('/quote')}
      lossPerDay={350.00}
    />
  );
}
```

### With Analytics Tracking

```tsx
'use client';

import { StickyBottomCTA } from '@/components/landing/sticky-bottom-cta';
import { trackEvent } from '@/lib/analytics';

export function LandingPageWithTracking() {
  const handleCTAClick = () => {
    trackEvent('sticky_cta_clicked', {
      timestamp: new Date(),
      source: 'landing_page',
    });

    // Navigate or perform action
    window.location.href = '/signup';
  };

  return (
    <StickyBottomCTA
      text="Secure your event today"
      buttonText="Get Insured"
      onClick={handleCTAClick}
      lossPerDay={500.00}
    />
  );
}
```

## Styling & Customization

The component uses Tailwind CSS and is fully customizable through the existing theme. Key styling features:

- **Colors**: Dark slate background with blue accent gradients
- **Typography**: Responsive text sizing (sm/base text scales)
- **Spacing**: Mobile-friendly padding with responsive gaps
- **Animations**: Spring physics for smooth, natural motion
- **Shadows**: Elevated shadow effects for depth

### Overriding Styles

To customize the component styling, modify the Tailwind classes directly in the component file. Key sections:

1. **Container**: Main wrapper classes (line ~77)
2. **Text Section**: Left-side text and counter (line ~89)
3. **Button**: Primary CTA button (line ~101)
4. **Close Button**: Dismiss button styling (line ~116)
5. **Accent Bar**: Bottom animated bar (line ~127)

## Animation Details

### Initial Animation
- **Type**: Spring animation
- **Damping**: 25 (smooth deceleration)
- **Stiffness**: 400 (responsive feel)
- **Mass**: 0.8 (lighter weight)

The component slides up from the bottom with a fade-in effect when the page loads.

### Scroll Animation
The component smoothly transitions between hidden and visible states with:
- Scroll debouncing (100ms) for performance
- Threshold detection at 200px scroll distance
- Smooth opacity and position changes

### Bottom Accent Bar
The gradient bar at the bottom animates in with a scale-x origin-left effect, creating a drawing effect.

## Mobile Optimization

The component is fully responsive with:
- **Padding**: `py-4 sm:py-5` (adaptive vertical spacing)
- **Text Sizes**: `text-sm sm:text-base` (scales with viewport)
- **Gap Spacing**: `gap-4 sm:gap-6` (responsive button/text spacing)
- **Button Padding**: `px-5 sm:px-7 py-2.5 sm:py-3` (touch-friendly sizes)
- **Layout**: Flexbox with proper flex-wrap for small screens

## Accessibility

- Semantic HTML structure
- Proper ARIA labels on interactive elements
- Sufficient color contrast
- Keyboard navigation support
- Focus states on buttons
- Screen reader friendly close button

## Performance Considerations

1. **Scroll Debouncing**: 100ms debounce prevents excessive state updates
2. **Passive Event Listeners**: Scroll listener uses `{ passive: true }` flag
3. **AnimatePresence**: Only renders when visible, reducing DOM overhead
4. **useCallback**: Close handler is memoized to prevent unnecessary renders
5. **useRef**: Timeout reference prevents memory leaks

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Loss Counter Behavior

The loss counter displays formatted daily loss amounts:
- Formats with comma separators (e.g., "1,234")
- Rounds to nearest dollar
- Updates reactively when `lossPerDay` prop changes
- Color-coded in red for urgency with subtle background

## Z-Index

The component uses `z-40` to sit above most content but below critical modals (which typically use z-50+). Adjust if needed for your specific layout.

## Common Issues & Solutions

### Component Not Appearing
- Ensure component is rendered within the page layout
- Check z-index conflicts with other fixed elements
- Verify `isVisible` state isn't immediately set to false

### Scroll Animation Not Working
- Confirm page has sufficient height to scroll past threshold
- Check for event listener conflicts
- Verify scroll events aren't being prevented elsewhere

### Mobile Button Cutoff
- Component uses responsive padding and sizing
- Ensure viewport meta tag is set in HTML head
- Test with actual mobile devices/browser DevTools

### Animation Stuttering
- Disable other heavy animations/transitions
- Check for high CPU usage from other processes
- Consider reducing animation complexity on lower-end devices

## Future Enhancement Ideas

1. **Multiple CTAs**: Support showing different messages based on user behavior
2. **Analytics Integration**: Built-in event tracking for clicks and dismissals
3. **A/B Testing**: Easy prop variants for testing different copy
4. **Persistence**: Option to remember dismissal state in localStorage
5. **Dynamic Loss Calculation**: Calculate loss from user inputs in real-time
6. **Custom Animations**: Expose animation config through props
7. **Notification Stacking**: Support multiple notifications at once

## Testing

### Unit Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StickyBottomCTA } from './sticky-bottom-cta';

describe('StickyBottomCTA', () => {
  it('renders with provided props', () => {
    render(
      <StickyBottomCTA
        text="Test text"
        buttonText="Test button"
        onClick={jest.fn()}
        lossPerDay={100}
      />
    );
    expect(screen.getByText('Test text')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = jest.fn();
    render(
      <StickyBottomCTA
        text="Test"
        buttonText="Click me"
        onClick={onClick}
        lossPerDay={100}
      />
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });

  it('hides when close button is clicked', () => {
    render(
      <StickyBottomCTA
        text="Test"
        buttonText="Action"
        onClick={jest.fn()}
        lossPerDay={100}
      />
    );
    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('sticky bottom cta scrolls out of view', async ({ page }) => {
  await page.goto('/landing');
  const cta = page.locator('button:has-text("Get Coverage Now")');

  // Initially visible
  await expect(cta).toBeVisible();

  // Scroll down past threshold
  await page.evaluate(() => window.scrollBy(0, 300));
  await expect(cta).not.toBeVisible();

  // Scroll back up
  await page.evaluate(() => window.scrollBy(0, -300));
  await expect(cta).toBeVisible();
});
```

## Files

- **Component**: `/components/landing/sticky-bottom-cta.tsx`
- **Examples**: `/components/landing/sticky-bottom-cta.example.tsx`
- **Documentation**: `/components/landing/STICKY_BOTTOM_CTA.md`

## Credits

Built with:
- React 19+
- Framer Motion 11.x
- Tailwind CSS 4.x
- TypeScript 5.x
- Lucide Icons
