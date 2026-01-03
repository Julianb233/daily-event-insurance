# AnimatedCounter Integration Guide

Complete guide for implementing AnimatedCounter in your landing pages and applications.

## Quick Start

### Basic Implementation (30 seconds)

```tsx
import AnimatedCounter from '@/components/landing/animated-counter';

export function PricingSection() {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold">
        <AnimatedCounter
          end={38400}
          prefix="$"
          suffix="/year"
        />
      </p>
    </div>
  );
}
```

## Component API Reference

### Props

```typescript
interface AnimatedCounterProps {
  end: number;           // REQUIRED: Target number to animate to
  duration?: number;     // Animation duration in ms (default: 2000)
  prefix?: string;       // Text before number (e.g., "$")
  suffix?: string;       // Text after number (e.g., "/year")
}
```

### Return Value

Returns a React component that renders an inline span with the animated number.

## Usage Patterns

### 1. Pricing Display

```tsx
<div className="bg-white rounded-lg border p-8">
  <h3 className="text-sm font-medium text-gray-600">Professional Plan</h3>
  <p className="mt-4 text-5xl font-bold">
    <AnimatedCounter
      end={99}
      prefix="$"
      duration={2000}
    />
    <span className="text-2xl text-gray-600 ml-2">/month</span>
  </p>
</div>
```

### 2. Statistics Grid

```tsx
<div className="grid grid-cols-3 gap-8">
  <div className="text-center">
    <p className="text-5xl font-bold text-green-600">
      <AnimatedCounter end={99} suffix="%" duration={1500} />
    </p>
    <p className="mt-2 text-gray-600">Success Rate</p>
  </div>

  <div className="text-center">
    <p className="text-5xl font-bold">
      <AnimatedCounter end={50000} suffix="+" duration={2000} />
    </p>
    <p className="mt-2 text-gray-600">Happy Customers</p>
  </div>

  <div className="text-center">
    <p className="text-5xl font-bold">
      <AnimatedCounter end={12} duration={1200} />
    </p>
    <p className="mt-2 text-gray-600">Years in Business</p>
  </div>
</div>
```

### 3. Progress/Goal Display

```tsx
<div className="space-y-3">
  <div className="flex justify-between">
    <span className="font-medium">Funds Raised</span>
    <span className="text-gray-600">
      <AnimatedCounter end={750000} prefix="$" duration={2500} />
      / $1,000,000
    </span>
  </div>
  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full bg-blue-600" style={{ width: '75%' }} />
  </div>
</div>
```

### 4. Before/After Comparison

```tsx
<div className="grid grid-cols-2 gap-8">
  <div className="text-center">
    <p className="text-sm text-gray-600 mb-2">Before</p>
    <p className="text-4xl font-bold text-gray-400 line-through">
      <AnimatedCounter end={5000} prefix="$" duration={1500} />
    </p>
  </div>

  <div className="text-center">
    <p className="text-sm text-green-600 font-semibold mb-2">After</p>
    <p className="text-4xl font-bold text-green-600">
      <AnimatedCounter end={2500} prefix="$" duration={1500} />
    </p>
  </div>
</div>
```

## Advanced Patterns

### Viewport-based Animation (See Advanced File)

Only animate when the counter comes into view:

```tsx
import { VisibleAnimatedCounter } from '@/components/landing/animated-counter.advanced';

<VisibleAnimatedCounter
  end={50000}
  suffix="+"
  duration={2500}
/>
```

### Controlled Animation

```tsx
import { ControlledAnimatedCounter } from '@/components/landing/animated-counter.advanced';

<ControlledAnimatedCounter
  end={38400}
  prefix="$"
  suffix="/year"
/>
```

### Stat Cards with Icons

```tsx
import { StatCard } from '@/components/landing/animated-counter.advanced';
import { Users, TrendingUp, Zap } from 'lucide-react';

<div className="grid grid-cols-3 gap-6">
  <StatCard
    icon={Users}
    label="Active Users"
    end={15000}
    suffix="+"
    color="blue"
  />

  <StatCard
    icon={TrendingUp}
    label="Growth"
    end={240}
    suffix="%"
    color="green"
  />

  <StatCard
    icon={Zap}
    label="Performance"
    end={99}
    suffix=".9%"
    color="orange"
  />
</div>
```

## Styling & Customization

### Default Styles

The component applies:
- `inline-block` - Allows width control
- `font-semibold` - Medium font weight
- Framer Motion opacity fade-in (0.5s duration)

### Custom Styling

Wrap the component to customize:

```tsx
<div className="text-center">
  <p className="text-5xl font-bold text-blue-600">
    <AnimatedCounter end={38400} prefix="$" />
  </p>
</div>
```

### Tailwind Classes

Apply Tailwind classes on wrapper elements:

```tsx
<p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
  <AnimatedCounter end={50000} suffix="+" />
</p>
```

### CSS-in-JS

Works with emotion, styled-components, etc.:

```tsx
import styled from 'styled-components';

const Counter = styled.p`
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
`;

<Counter>
  <AnimatedCounter end={38400} prefix="$" />
</Counter>
```

## Duration Recommendations

| Type | Recommended | Range |
|------|-------------|-------|
| Small numbers (< 100) | 1200ms | 800-1500ms |
| Medium numbers (100-10k) | 1800ms | 1500-2500ms |
| Large numbers (> 10k) | 2500ms | 2000-3000ms |
| Very large (> 1M) | 3000ms | 2500-3500ms |

**Rule of thumb:** 1 second per 20,000 units

## Performance Optimization

### Lazy Loading

Use with Intersection Observer for viewport-based loading:

```tsx
import { VisibleAnimatedCounter } from '@/components/landing/animated-counter.advanced';

// Only animates when user scrolls to component
<VisibleAnimatedCounter end={50000} suffix="+" />
```

### Multiple Counters

For many counters on one page:

1. Stagger animations using `setTimeout`:
```tsx
{[38400, 50000, 12].map((value, idx) => (
  <AnimatedCounter
    key={idx}
    end={value}
    duration={2000}
    // Add stagger delay if needed
  />
))}
```

2. Use viewport animation to avoid animating off-screen counters

### Bundle Impact

- Component JS: ~1KB (minified)
- Framer Motion: ~50KB (already in project)
- Additional overhead: Minimal

## Browser Support

Works in all modern browsers:
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- iOS Safari: 14+

Requires:
- ES6+ support
- `requestAnimationFrame` API
- `Date.now()` API
- `toLocaleString()` method

## Accessibility

### Best Practices

1. Add semantic context with headings:
```tsx
<div>
  <h3 className="text-sm font-semibold text-gray-600">Active Users</h3>
  <p className="text-4xl font-bold" aria-label="50,000 active users">
    <AnimatedCounter end={50000} suffix="+" />
  </p>
</div>
```

2. Maintain heading hierarchy:
```tsx
<section>
  <h2>Our Impact</h2>
  <h3>Active Users</h3>
  <p><AnimatedCounter end={50000} suffix="+" /></p>
</section>
```

3. Ensure sufficient color contrast:
```tsx
<p className="text-4xl font-bold text-gray-900">
  <AnimatedCounter end={38400} prefix="$" />
</p>
```

4. Don't rely solely on animation for information:
```tsx
<p>
  <span aria-label="Total Customers: 15,000">
    <AnimatedCounter end={15000} suffix="+" />
  </span>
</p>
```

## Testing

### Unit Testing Example (Jest + React Testing Library)

```tsx
import { render, screen } from '@testing-library/react';
import AnimatedCounter from '@/components/landing/animated-counter';

test('renders with prefix and suffix', () => {
  render(
    <AnimatedCounter
      end={100}
      prefix="$"
      suffix="/year"
    />
  );

  // Check that component renders
  const element = screen.getByText(/\$.*\/year/);
  expect(element).toBeInTheDocument();
});

test('animates from 0 to end value', async () => {
  const { container } = render(
    <AnimatedCounter end={100} duration={100} />
  );

  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 150));

  // Value should be at or near 100
  expect(container.textContent).toMatch(/100/);
});
```

### Visual Testing

Use Storybook to test across different states:

```tsx
// animated-counter.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import AnimatedCounter from './animated-counter';

const meta: Meta<typeof AnimatedCounter> = {
  component: AnimatedCounter,
};

export const Default: StoryObj = {
  args: { end: 50000 },
};

export const WithAffixes: StoryObj = {
  args: {
    end: 38400,
    prefix: '$',
    suffix: '/year',
  },
};

export const LargeNumber: StoryObj = {
  args: {
    end: 5000000,
    prefix: '$',
    duration: 3000,
  },
};

export default meta;
```

## Troubleshooting

### Animation Doesn't Start

**Problem:** Number stays at 0
**Solutions:**
1. Check component is mounted in DOM (check React DevTools)
2. Verify `end` prop is a number, not string
3. Ensure Framer Motion is installed: `npm list framer-motion`
4. Check browser console for errors

### Numbers Not Formatting

**Problem:** "1234567" instead of "1,234,567"
**Solutions:**
1. Browser issue - unlikely, all modern browsers support `toLocaleString()`
2. Check `end` prop type - must be number, not string
3. Verify locale setting in `toLocaleString('en-US')`

### Animation Timing Is Off

**Problem:** Animation finishes too fast or too slow
**Solutions:**
1. Adjust `duration` prop (milliseconds)
2. Check for other animations conflicting on page
3. Monitor browser performance - throttle CPU in DevTools
4. Test on different devices

### Performance Issues

**Problem:** Page feels sluggish with multiple counters
**Solutions:**
1. Use `VisibleAnimatedCounter` to lazy-load off-screen
2. Increase animation duration to reduce re-render frequency
3. Reduce number of simultaneous animations
4. Profile with React DevTools Profiler

## Real-World Examples

See the example files for complete implementations:

- **animated-counter.example.tsx** - Basic usage patterns
- **stats-section.example.tsx** - Full page section
- **animated-counter.advanced.tsx** - Advanced patterns

## FAQ

**Q: Can I animate the counter value changing?**
A: Yes, the component re-animates when the `end` prop changes.

**Q: Can I pause or restart the animation?**
A: Use `ControlledAnimatedCounter` from advanced patterns.

**Q: Does it work with Next.js static generation?**
A: Yes - it's marked as 'use client' and animates on mount.

**Q: Can I use it with CSS-in-JS?**
A: Yes, wrap the component in styled components.

**Q: What's the maximum supported number?**
A: JavaScript's `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991)

**Q: Does it work on mobile?**
A: Yes, fully responsive and touch-friendly.

## Resources

- Framer Motion docs: https://www.framer.com/motion/
- React Hooks: https://react.dev/reference/react/hooks
- requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
- toLocaleString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review example files
3. Check component source code in `animated-counter.tsx`
4. Test in isolation before integration
