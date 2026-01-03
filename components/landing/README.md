# Landing Components

This directory contains reusable components specifically designed for landing page sections.

## Components

### AnimatedCounter
Smooth, animated number counter that counts from 0 to a target value.

**File:** `animated-counter.tsx`
**Documentation:** `ANIMATED-COUNTER.md`

**Key Features:**
- Smooth count-up animation with easeOut easing
- Number formatting with comma separators
- Configurable duration and affixes (prefix/suffix)
- TypeScript support with full type safety
- Minimal performance impact using requestAnimationFrame

**Example Usage:**
```tsx
import AnimatedCounter from '@/components/landing/animated-counter';

<AnimatedCounter end={38400} prefix="$" suffix="/year" duration={2000} />
```

### Other Components
- `sticky-bottom-cta.tsx` - Call-to-action button that sticks to bottom of viewport

## Example Files

These files demonstrate how to use the components:

- `animated-counter.example.tsx` - Various AnimatedCounter implementations
- `stats-section.example.tsx` - Full page section with multiple counters
- Additional examples showing real-world integration patterns

## Best Practices

1. **Wrap in containers** for styling and alignment
2. **Use semantic HTML** headings and labels for context
3. **Consider accessibility** with proper heading hierarchy
4. **Customize styling** with Tailwind classes on wrapper elements
5. **Monitor animation timing** - 1500-3000ms typically feels best

## Performance Considerations

- AnimatedCounter uses `requestAnimationFrame` for smooth 60fps animation
- No expensive re-renders after animation completes
- Framer Motion is already installed in the project
- Minimal additional bundle size

## File Structure

```
landing/
├── animated-counter.tsx              # Main component
├── animated-counter.example.tsx      # Usage examples
├── animated-counter.md               # Detailed documentation
├── stats-section.example.tsx         # Full page section example
├── sticky-bottom-cta.tsx            # CTA component
├── sticky-bottom-cta.example.tsx    # CTA examples
└── README.md                         # This file
```

## Integration Guide

### Step 1: Import the component
```tsx
import AnimatedCounter from '@/components/landing/animated-counter';
```

### Step 2: Use in your page
```tsx
<section className="py-20">
  <h2>Statistics</h2>
  <div className="grid grid-cols-3 gap-8">
    <div>
      <p className="text-4xl font-bold">
        <AnimatedCounter end={50000} suffix="+" />
      </p>
      <p className="text-gray-600">Active Users</p>
    </div>
  </div>
</section>
```

## Troubleshooting

**Animation not starting?**
- Ensure the component is mounted in the DOM
- Check that `end` prop is a number
- Verify Framer Motion is installed

**Numbers not formatting correctly?**
- Check browser supports `toLocaleString()` (all modern browsers do)
- Verify `end` prop is passed as a number, not string

**Performance issues?**
- Monitor page FCP (First Contentful Paint)
- Ensure animations don't conflict with other page animations
- Consider reducing animation duration or disabling on slower devices

## Related Documentation

- TypeScript configuration: `/tsconfig.json`
- Tailwind setup: `/tailwind.config.ts`
- Framer Motion docs: https://www.framer.com/motion/
- Next.js App Router: https://nextjs.org/docs/app
