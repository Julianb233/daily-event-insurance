# OnboardingTour Component

A fully-featured onboarding tour component built with [driver.js](https://driverjs.com/) for guiding first-time users through your application.

## Features

- ✅ **Step-by-step walkthroughs** with spotlight effect on elements
- ✅ **Progress indicators** with animated dots
- ✅ **Persistent completion tracking** via localStorage
- ✅ **Auto-start capability** for first-time users
- ✅ **Fully themed** to match HiQor B2B design (teal/sky accents)
- ✅ **Dark mode support** automatic
- ✅ **Responsive design** works on mobile and desktop
- ✅ **Keyboard accessible** (ESC to close, arrows to navigate)
- ✅ **Pre-built tours** for Admin, HiQor, and Sures portals
- ✅ **Programmatic control** via hooks
- ✅ **TypeScript typed** with full IntelliSense

## Installation

Already installed! The component uses:
- `driver.js` - Tour library (v1.4.0)
- Custom CSS theme in `/styles/driver-theme.css`
- Imported into `app/globals.css`

## Quick Start

### 1. Add Tour to Your Layout

```tsx
import { OnboardingTour, adminTourSteps } from '@/components/shared/OnboardingTour'

export default function AdminLayout({ children }) {
  return (
    <>
      <OnboardingTour
        tourId="admin-portal"
        steps={adminTourSteps}
        autoStart={true}
      />
      {children}
    </>
  )
}
```

### 2. Add `data-tour` Attributes

Mark elements you want to highlight:

```tsx
<nav>
  <div data-tour="dashboard">Dashboard</div>
  <div data-tour="earnings">My Earnings</div>
  <div data-tour="microsites">Microsites</div>
</nav>

<button data-tour="command-palette">
  Quick Navigation (⌘K)
</button>
```

### 3. Done!

The tour will auto-start on first visit and remember completion.

## Props

### `OnboardingTourProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tourId` | `string` | ✅ Yes | - | Unique identifier for localStorage key |
| `steps` | `TourStep[]` | ✅ Yes | - | Array of tour step definitions |
| `autoStart` | `boolean` | No | `false` | Auto-start tour if not completed |
| `onComplete` | `() => void` | No | - | Callback when tour completes |
| `onSkip` | `() => void` | No | - | Callback when tour is skipped |

### `TourStep` Interface

```typescript
interface TourStep {
  element: string              // CSS selector (e.g., '[data-tour="dashboard"]')
  title: string                // Step title
  description: string          // Step description
  side?: 'top' | 'bottom' | 'left' | 'right'  // Popover position
}
```

## Pre-Built Tours

### Admin Portal Tour

```tsx
import { OnboardingTour, adminTourSteps } from '@/components/shared/OnboardingTour'

<OnboardingTour tourId="admin-portal" steps={adminTourSteps} autoStart />
```

**Required `data-tour` attributes:**
- `dashboard` - Dashboard overview
- `earnings` - Earnings section
- `microsites` - Microsites management
- `partners` - Partner management
- `leads` - Lead pipeline
- `command-palette` - Quick navigation

### HiQor Portal Tour

```tsx
import { OnboardingTour, hiqorTourSteps } from '@/components/shared/OnboardingTour'

<OnboardingTour tourId="hiqor-portal" steps={hiqorTourSteps} autoStart />
```

**Required `data-tour` attributes:**
- `dashboard` - Dashboard
- `policies` - Policy management
- `claims` - Claims processing
- `call-center` - AI call center
- `sync` - Sync status
- `command-palette` - Quick access

### Sures Portal Tour

```tsx
import { OnboardingTour, suresTourSteps } from '@/components/shared/OnboardingTour'

<OnboardingTour tourId="sures-portal" steps={suresTourSteps} autoStart />
```

**Required `data-tour` attributes:**
- `dashboard` - Dashboard
- `policies` - Policy management
- `claims` - Claims processing
- `reports` - Reports & analytics
- `sync` - Data sync
- `command-palette` - Keyboard shortcuts

## Custom Tours

Create your own tour for specific features:

```tsx
const customSteps: TourStep[] = [
  {
    element: '[data-tour="feature-1"]',
    title: '🎉 New Feature',
    description: 'Check out our latest addition!',
    side: 'bottom',
  },
  {
    element: '[data-tour="feature-2"]',
    title: '⚡ Power Tip',
    description: 'Use shortcuts for faster workflow.',
    side: 'right',
  },
]

<OnboardingTour
  tourId="custom-feature-v1"
  steps={customSteps}
  autoStart={true}
  onComplete={() => console.log('Done!')}
/>
```

## Programmatic Control

Use the `useOnboardingTour` hook for manual control:

```tsx
import { useOnboardingTour } from '@/components/shared/OnboardingTour'

function MyComponent() {
  const { startTour, skipTour, resetTour, isTourCompleted } = useOnboardingTour('admin-portal')

  return (
    <div>
      <button onClick={startTour}>Start Tour</button>
      <button onClick={skipTour}>Skip Tour</button>
      <button onClick={resetTour}>Reset Tour</button>
      <span>Status: {isTourCompleted() ? 'Done' : 'Not Started'}</span>
    </div>
  )
}
```

### Hook Methods

| Method | Description |
|--------|-------------|
| `startTour()` | Manually start the tour |
| `skipTour()` | Skip and mark as completed |
| `resetTour()` | Clear completion status |
| `isTourCompleted()` | Check if tour is completed |

## Settings Integration

Add a tour reset button in settings:

```tsx
'use client'
import { useOnboardingTour } from '@/components/shared/OnboardingTour'

export default function SettingsPage() {
  const { resetTour, startTour, isTourCompleted } = useOnboardingTour('admin-portal')

  const handleRestart = () => {
    resetTour()
    setTimeout(() => startTour(), 100)
  }

  return (
    <div className="p-6">
      <h2>Onboarding Tour</h2>
      <p>Status: {isTourCompleted() ? 'Completed' : 'Not Started'}</p>
      <button onClick={handleRestart}>Restart Tour</button>
    </div>
  )
}
```

## Styling

The tour uses a custom theme in `/styles/driver-theme.css` that matches the HiQor B2B design:

- **Primary accent**: Teal gradient (`#14B8A6` → `#0EA5E9`)
- **Success state**: Teal (`#14B8A6` → `#0D9488`)
- **Dark mode**: Automatic support
- **Animations**: Smooth fade-in, hover effects
- **Accessibility**: High contrast mode, reduced motion support

### Customizing Colors

Edit `/styles/driver-theme.css` to change colors:

```css
/* Next Button */
.driver-popover-next-btn {
  background: linear-gradient(to right, rgb(20, 184, 166), rgb(14, 165, 233));
}

/* Highlighted Element */
.driver-active-element {
  outline: 2px solid rgb(20, 184, 166) !important;
}
```

## Analytics Integration

Track tour completion:

```tsx
<OnboardingTour
  tourId="admin-portal"
  steps={adminTourSteps}
  autoStart
  onComplete={() => {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'onboarding_complete', {
        portal: 'admin',
      })
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Onboarding Complete', {
        portal: 'admin',
      })
    }
  }}
/>
```

## Best Practices

### 1. **Element Selection**

Use `data-tour` attributes instead of class names:

```tsx
✅ Good: <div data-tour="dashboard">Dashboard</div>
❌ Bad:  <div className="dashboard-link">Dashboard</div>
```

### 2. **Tour Timing**

Wait for elements to be in DOM (component handles this):

```tsx
// Built-in 500ms delay ensures elements are rendered
<OnboardingTour tourId="my-tour" steps={steps} autoStart />
```

### 3. **Unique Tour IDs**

Use unique IDs for different tours:

```tsx
tourId="admin-portal"       // Admin portal
tourId="hiqor-portal"       // HiQor portal
tourId="feature-v1"         // Feature-specific tour
tourId="new-ui-2024"        // Version-specific tour
```

### 4. **Mobile Considerations**

Tours are responsive, but consider reducing step count on mobile:

```tsx
const isMobile = window.innerWidth < 768
const steps = isMobile ? mobileSteps : desktopSteps

<OnboardingTour tourId="admin-portal" steps={steps} />
```

### 5. **Multi-Page Tours**

For tours spanning multiple pages, break into separate tours:

```tsx
// Dashboard tour
<OnboardingTour tourId="admin-dashboard" steps={dashboardSteps} />

// Settings tour
<OnboardingTour tourId="admin-settings" steps={settingsSteps} />
```

## Troubleshooting

### Tour doesn't start

**Problem**: Elements not found in DOM

**Solution**: Ensure `data-tour` attributes exist and elements are rendered:

```tsx
// Check in browser console
document.querySelector('[data-tour="dashboard"]') // Should not be null
```

### Tour appears under other elements

**Problem**: Z-index conflict

**Solution**: Driver.js uses `z-index: 10000`. Ensure no elements exceed this.

### Tour doesn't remember completion

**Problem**: localStorage not working

**Solution**: Check browser privacy settings and ensure localStorage is enabled.

### Dark mode not working

**Problem**: CSS not imported

**Solution**: Verify `/styles/driver-theme.css` is imported in `app/globals.css`:

```css
@import "../styles/driver-theme.css";
```

## API Reference

### Components

#### `<OnboardingTour />`

Main tour component. Renders nothing (driver.js handles UI).

```tsx
<OnboardingTour
  tourId="unique-id"
  steps={[...]}
  autoStart={true}
  onComplete={() => {}}
  onSkip={() => {}}
/>
```

### Hooks

#### `useOnboardingTour(tourId: string)`

Hook for programmatic tour control.

```tsx
const { startTour, skipTour, resetTour, isTourCompleted } = useOnboardingTour('admin-portal')
```

### Pre-Built Tours

#### `adminTourSteps: TourStep[]`

Admin portal tour (6 steps)

#### `hiqorTourSteps: TourStep[]`

HiQor portal tour (6 steps)

#### `suresTourSteps: TourStep[]`

Sures portal tour (6 steps)

## Examples

See `/components/shared/OnboardingTour.example.tsx` for:
- Layout integration
- Programmatic control
- Settings page integration
- Custom tours
- Conditional rendering
- Multi-portal detection
- Analytics integration

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS 13+)
- ✅ Chrome Mobile (Android)

## Accessibility

- ✅ **Keyboard navigation**: ESC to close, arrows to navigate
- ✅ **Screen readers**: ARIA labels on all controls
- ✅ **Focus management**: Automatic focus on active step
- ✅ **High contrast**: Supports `prefers-contrast: high`
- ✅ **Reduced motion**: Respects `prefers-reduced-motion`

## Performance

- **Initial load**: ~15KB (driver.js + custom CSS)
- **Runtime**: Minimal (renders nothing, driver.js handles UI)
- **localStorage**: <1KB per tour (just completion flag)

## License

Part of Daily Event Insurance application. Uses driver.js (MIT License).

## Support

For issues or questions:
1. Check `/components/shared/OnboardingTour.example.tsx` for examples
2. Review this README for common patterns
3. Check browser console for element selection errors
4. Verify `data-tour` attributes exist in DOM

---

**File Locations:**
- Component: `/components/shared/OnboardingTour.tsx`
- CSS Theme: `/styles/driver-theme.css`
- Examples: `/components/shared/OnboardingTour.example.tsx`
- Documentation: `/components/shared/OnboardingTour.README.md` (this file)
