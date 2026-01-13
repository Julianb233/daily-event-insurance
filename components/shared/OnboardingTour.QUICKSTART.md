# OnboardingTour - Quick Start Guide

## 5-Minute Integration

### 1. Import Component

```tsx
import { OnboardingTour, adminTourSteps } from '@/components/shared/OnboardingTour'
```

### 2. Add to Layout

```tsx
export default function Layout({ children }) {
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

### 3. Add Attributes

```tsx
<div data-tour="dashboard">Dashboard</div>
<div data-tour="earnings">Earnings</div>
<div data-tour="microsites">Microsites</div>
```

### Done! 🎉

Tour will auto-start on first visit and remember completion.

---

## Pre-Built Tours

### Admin Portal
```tsx
import { adminTourSteps } from '@/components/shared/OnboardingTour'
tourId="admin-portal"
```

Requires: `dashboard`, `earnings`, `microsites`, `partners`, `leads`, `command-palette`

### HiQor Portal
```tsx
import { hiqorTourSteps } from '@/components/shared/OnboardingTour'
tourId="hiqor-portal"
```

Requires: `dashboard`, `policies`, `claims`, `call-center`, `sync`, `command-palette`

### Sures Portal
```tsx
import { suresTourSteps } from '@/components/shared/OnboardingTour'
tourId="sures-portal"
```

Requires: `dashboard`, `policies`, `claims`, `reports`, `sync`, `command-palette`

---

## Programmatic Control

```tsx
import { useOnboardingTour } from '@/components/shared/OnboardingTour'

const { startTour, skipTour, resetTour, isTourCompleted } = useOnboardingTour('admin-portal')

<button onClick={startTour}>Start Tour</button>
```

---

## Custom Tour

```tsx
const customSteps = [
  {
    element: '[data-tour="feature"]',
    title: 'New Feature',
    description: 'Try it out!',
    side: 'bottom',
  },
]

<OnboardingTour tourId="feature-v1" steps={customSteps} autoStart />
```

---

## Common Patterns

### Settings Page Reset
```tsx
function Settings() {
  const { resetTour, startTour } = useOnboardingTour('admin-portal')

  return (
    <button onClick={() => { resetTour(); setTimeout(() => startTour(), 100) }}>
      Restart Tour
    </button>
  )
}
```

### With Analytics
```tsx
<OnboardingTour
  tourId="admin-portal"
  steps={adminTourSteps}
  autoStart
  onComplete={() => {
    gtag('event', 'onboarding_complete', { portal: 'admin' })
  }}
/>
```

### Conditional Display
```tsx
const { isTourCompleted } = useOnboardingTour('admin-portal')

{!isTourCompleted() && (
  <OnboardingTour tourId="admin-portal" steps={adminTourSteps} autoStart />
)}
```

---

## Testing

Visit: `/admin/tour-demo`

---

## Troubleshooting

**Tour doesn't start?**
- Check elements exist in DOM
- Verify `data-tour` attributes are correct
- Open console for errors

**Dark mode broken?**
- Check CSS import in `app/globals.css`:
  ```css
  @import "../styles/driver-theme.css";
  ```

**Completion not saved?**
- Check localStorage is enabled
- Try different browser

---

## Full Docs

See: `/components/shared/OnboardingTour.README.md`

---

## Props Quick Reference

| Prop | Type | Required | Default |
|------|------|----------|---------|
| `tourId` | string | ✅ | - |
| `steps` | TourStep[] | ✅ | - |
| `autoStart` | boolean | ❌ | false |
| `onComplete` | () => void | ❌ | - |
| `onSkip` | () => void | ❌ | - |

---

## Hook Methods

| Method | Description |
|--------|-------------|
| `startTour()` | Start tour manually |
| `skipTour()` | Skip and mark complete |
| `resetTour()` | Clear completion |
| `isTourCompleted()` | Check if done |

---

**Need Help?** Check examples: `/components/shared/OnboardingTour.example.tsx`
