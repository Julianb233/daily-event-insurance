# AnimatedCounter Component

A smooth, performant animated number counter component built with Framer Motion. Perfect for displaying statistics, pricing, or any incrementing numbers on landing pages.

## Features

- Smooth count-up animation from 0 to target number
- Number formatting with comma separators (e.g., 38,400)
- Configurable animation duration
- Optional prefix and suffix support
- Fully typed with TypeScript
- Uses easeOut easing for natural deceleration
- Client-side rendering optimized with requestAnimationFrame
- Minimal bundle impact with Framer Motion integration

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `end` | `number` | Required | Target number to animate to |
| `duration` | `number` | `2000` | Animation duration in milliseconds |
| `prefix` | `string` | `''` | Text to display before the number (e.g., "$", "€") |
| `suffix` | `string` | `''` | Text to display after the number (e.g., "/year", "%", "+") |

## Usage Examples

### Basic Usage
```tsx
import AnimatedCounter from '@/components/landing/animated-counter';

export function PricingSection() {
  return (
    <p className="text-3xl font-bold">
      <AnimatedCounter end={38400} />
    </p>
  );
}
```

### With Prefix and Suffix
```tsx
<AnimatedCounter
  end={38400}
  prefix="$"
  suffix="/year"
  duration={2000}
/>
// Output: $38,400/year
```

### Custom Duration
```tsx
<AnimatedCounter
  end={1500000}
  prefix="$"
  duration={3000}  // 3 seconds
/>
```

### Percentage
```tsx
<AnimatedCounter
  end={99}
  suffix="%"
  duration={1500}
/>
```

### With Container Styling
```tsx
<div className="text-center">
  <p className="text-sm text-gray-600">Total Revenue</p>
  <p className="text-4xl font-bold text-green-600">
    <AnimatedCounter
      end={5000000}
      prefix="$"
      duration={2500}
    />
  </p>
</div>
```

## Technical Details

### Animation Mechanism
- Uses `requestAnimationFrame` for smooth 60fps animation
- Implements `easeOutQuad` easing function for natural deceleration
- Calculations are performed on each frame using elapsed time
- Automatically cleans up animation frame when component unmounts

### Number Formatting
- Uses `Number.prototype.toLocaleString()` with 'en-US' locale
- Automatically adds comma separators: 1234567 → "1,234,567"
- Works with all positive integers

### Performance
- Minimal re-renders using useEffect cleanup
- Framer Motion opacity fade-in for smooth entry
- Inline-block display for proper spacing
- No unnecessary DOM updates after animation completes

## Browser Support

Works in all modern browsers supporting:
- `requestAnimationFrame`
- `Date.now()`
- ES6 features (arrow functions, const/let)

## Customization

### Modifying Animation Easing

To change the easing function, modify the `easeOutQuad` function in the component:

```tsx
// Current: easeOut
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

// Alternative: linear
const easing = (t: number) => t;

// Alternative: easeInOut
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
```

### Styling

The component uses minimal default styling (`inline-block font-semibold`). Customize by wrapping:

```tsx
<div className="text-2xl font-bold text-blue-600">
  <AnimatedCounter end={50000} prefix="$" />
</div>
```

## Related Components

- **sticky-bottom-cta.tsx** - Call-to-action component often paired with counters
- See `animated-counter.example.tsx` for more usage patterns

## Installation

This component is ready to use. Ensure your project has:
- React 19+
- framer-motion 11+
- TypeScript 5+

## Performance Metrics

- Initial load: < 1KB additional JS (gzipped)
- Framer Motion already included in project dependencies
- Animation memory: Minimal (single useState hook)
- No external API calls or data fetching

## Accessibility

The component renders semantic inline text content. Consider adding:
- ARIA labels for context if used standalone
- Semantic heading structure for statistics sections
- High contrast colors for number visibility

```tsx
<div>
  <h3 className="text-sm font-semibold text-gray-600">
    Annual Pricing
  </h3>
  <p className="text-4xl font-bold" aria-label="Pricing: $38,400 per year">
    <AnimatedCounter end={38400} prefix="$" suffix="/year" />
  </p>
</div>
```

## Troubleshooting

### Counter not animating
- Ensure component is rendered in browser (not in static HTML phase)
- Check that `end` prop is a number, not a string
- Verify Framer Motion is installed and imported correctly

### Numbers not formatting with commas
- Verify using current Node.js version with Intl support
- Check browser supports `toLocaleString()` (all modern browsers do)

### Animation timing feels off
- Adjust `duration` prop (in milliseconds)
- Try different duration values (1500-3000ms typical)
- Consider if other animations are running on the page

## License

Part of the Daily Event Insurance project.
