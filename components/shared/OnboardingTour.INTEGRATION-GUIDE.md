# OnboardingTour - Portal Integration Guide

This guide provides step-by-step instructions for integrating the OnboardingTour component into each portal.

## Table of Contents

1. [Admin Portal Integration](#admin-portal-integration)
2. [HiQor Portal Integration](#hiqor-portal-integration)
3. [Sures Portal Integration](#sures-portal-integration)
4. [Testing](#testing)
5. [Customization](#customization)

---

## Admin Portal Integration

### Step 1: Add Tour to Layout

**File**: `/app/(admin)/layout.tsx` or `/app/(admin)/admin/page.tsx`

```tsx
import { OnboardingTour, adminTourSteps } from '@/components/shared'

export default function AdminLayout({ children }) {
  return (
    <>
      {/* Add OnboardingTour component */}
      <OnboardingTour
        tourId="admin-portal"
        steps={adminTourSteps}
        autoStart={true}
        onComplete={() => {
          console.log('Admin tour completed!')
          // Optional: Track with analytics
        }}
      />
      {children}
    </>
  )
}
```

### Step 2: Add data-tour Attributes

Add these attributes to your admin portal navigation/layout:

#### Dashboard Link
```tsx
<Link href="/admin" data-tour="dashboard">
  <LayoutDashboard className="w-5 h-5" />
  <span>Dashboard</span>
</Link>
```

#### Earnings Section
```tsx
<Link href="/admin/earnings" data-tour="earnings">
  <DollarSign className="w-5 h-5" />
  <span>My Earnings</span>
</Link>
```

#### Microsites Section
```tsx
<Link href="/admin/microsites" data-tour="microsites">
  <Globe className="w-5 h-5" />
  <span>Microsites</span>
</Link>
```

#### Partners Section
```tsx
<Link href="/admin/partners" data-tour="partners">
  <Users className="w-5 h-5" />
  <span>Partners</span>
</Link>
```

#### Leads Section
```tsx
<Link href="/admin/leads" data-tour="leads">
  <TrendingUp className="w-5 h-5" />
  <span>Leads</span>
</Link>
```

#### Command Palette Button
```tsx
<button
  data-tour="command-palette"
  onClick={() => setIsCommandPaletteOpen(true)}
  className="flex items-center gap-2"
>
  <Command className="w-4 h-4" />
  <span>Quick Navigation</span>
  <kbd className="text-xs">⌘K</kbd>
</button>
```

### Step 3: Test

1. Clear localStorage: `localStorage.removeItem('onboarding-tour-admin-portal')`
2. Refresh page
3. Tour should auto-start

---

## HiQor Portal Integration

### Step 1: Add Tour to Layout

**File**: `/app/(hiqor)/layout.tsx`

```tsx
import { OnboardingTour, hiqorTourSteps } from '@/components/shared'

export default function HiqorLayout({ children }) {
  return (
    <>
      <OnboardingTour
        tourId="hiqor-portal"
        steps={hiqorTourSteps}
        autoStart={true}
        onComplete={() => {
          console.log('HiQor tour completed!')
        }}
      />
      {children}
    </>
  )
}
```

### Step 2: Add data-tour Attributes

#### Dashboard
```tsx
<Link href="/hiqor" data-tour="dashboard">
  <LayoutDashboard className="w-5 h-5" />
  <span>Dashboard</span>
</Link>
```

#### Policies
```tsx
<Link href="/hiqor/policies" data-tour="policies">
  <FileText className="w-5 h-5" />
  <span>Policies</span>
</Link>
```

#### Claims
```tsx
<Link href="/hiqor/claims" data-tour="claims">
  <AlertCircle className="w-5 h-5" />
  <span>Claims</span>
</Link>
```

#### Call Center
```tsx
<Link href="/hiqor/call-center" data-tour="call-center">
  <Phone className="w-5 h-5" />
  <span>Call Center</span>
</Link>
```

#### Sync Status
```tsx
<div data-tour="sync" className="flex items-center gap-2">
  <RefreshCw className="w-4 h-4" />
  <span>Sync Status</span>
</div>
```

#### Command Palette
```tsx
<button data-tour="command-palette" onClick={openCommandPalette}>
  <Command className="w-4 h-4" />
  <span>Quick Access (⌘K)</span>
</button>
```

### Step 3: Test

1. Clear localStorage: `localStorage.removeItem('onboarding-tour-hiqor-portal')`
2. Navigate to `/hiqor`
3. Tour should auto-start

---

## Sures Portal Integration

### Step 1: Add Tour to Layout

**File**: `/app/(sures)/layout.tsx`

```tsx
import { OnboardingTour, suresTourSteps } from '@/components/shared'

export default function SuresLayout({ children }) {
  return (
    <>
      <OnboardingTour
        tourId="sures-portal"
        steps={suresTourSteps}
        autoStart={true}
      />
      {children}
    </>
  )
}
```

### Step 2: Add data-tour Attributes

#### Dashboard
```tsx
<Link href="/sures" data-tour="dashboard">
  <LayoutDashboard className="w-5 h-5" />
  <span>Dashboard</span>
</Link>
```

#### Policies
```tsx
<Link href="/sures/policies" data-tour="policies">
  <FileText className="w-5 h-5" />
  <span>Policies</span>
</Link>
```

#### Claims
```tsx
<Link href="/sures/claims" data-tour="claims">
  <AlertCircle className="w-5 h-5" />
  <span>Claims</span>
</Link>
```

#### Reports
```tsx
<Link href="/sures/reports" data-tour="reports">
  <BarChart3 className="w-5 h-5" />
  <span>Reports</span>
</Link>
```

#### Sync
```tsx
<div data-tour="sync" className="flex items-center gap-2">
  <RefreshCw className="w-4 h-4" />
  <span>Data Sync</span>
</div>
```

#### Command Palette
```tsx
<button data-tour="command-palette" onClick={openCommandPalette}>
  <Command className="w-4 h-4" />
  <span>Keyboard Shortcuts (⌘K)</span>
</button>
```

### Step 3: Test

1. Clear localStorage: `localStorage.removeItem('onboarding-tour-sures-portal')`
2. Navigate to `/sures`
3. Tour should auto-start

---

## Testing

### Manual Testing

1. **First Visit**
   - Clear localStorage for the specific tour
   - Navigate to portal
   - Verify tour auto-starts
   - Step through all steps
   - Complete tour
   - Verify completion is saved

2. **Return Visit**
   - Navigate to portal again
   - Verify tour does NOT auto-start
   - Check localStorage has completion flag

3. **Reset and Restart**
   - Go to settings (if implemented)
   - Click "Restart Tour"
   - Verify tour starts from beginning

### Console Testing

```javascript
// Check if tour is completed
localStorage.getItem('onboarding-tour-admin-portal')

// Clear completion (force restart)
localStorage.removeItem('onboarding-tour-admin-portal')

// Clear all tours
Object.keys(localStorage)
  .filter(key => key.startsWith('onboarding-tour-'))
  .forEach(key => localStorage.removeItem(key))

// Check if elements exist
document.querySelectorAll('[data-tour]').forEach(el => {
  console.log(el.getAttribute('data-tour'), el)
})
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to Application tab
3. Look under Local Storage
4. Find keys like `onboarding-tour-admin-portal`
5. Value should be `"true"` after completion

---

## Customization

### Custom Tour Steps

Create your own tour for specific features:

```tsx
import { OnboardingTour, type TourStep } from '@/components/shared'

const customFeatureTour: TourStep[] = [
  {
    element: '[data-tour="new-feature"]',
    title: '🎉 New Feature',
    description: 'Check out this awesome new capability!',
    side: 'bottom',
  },
  {
    element: '[data-tour="settings"]',
    title: '⚙️ Configure It',
    description: 'Customize the feature to your needs.',
    side: 'right',
  },
]

<OnboardingTour
  tourId="new-feature-2024"
  steps={customFeatureTour}
  autoStart={true}
/>
```

### Settings Page Integration

**File**: `/app/(admin)/admin/settings/page.tsx`

```tsx
'use client'

import { useOnboardingTour } from '@/components/shared'

export default function SettingsPage() {
  const { resetTour, startTour, isTourCompleted } = useOnboardingTour('admin-portal')

  const handleRestartTour = () => {
    resetTour()
    setTimeout(() => {
      startTour()
    }, 100)
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Onboarding Tour</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {isTourCompleted()
            ? 'You have completed the onboarding tour.'
            : 'The onboarding tour has not been completed yet.'}
        </p>

        <button
          onClick={handleRestartTour}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          {isTourCompleted() ? 'Restart Tour' : 'Start Tour'}
        </button>
      </div>
    </div>
  )
}
```

### Analytics Integration

Track tour events:

```tsx
import { OnboardingTour, adminTourSteps } from '@/components/shared'

<OnboardingTour
  tourId="admin-portal"
  steps={adminTourSteps}
  autoStart={true}
  onComplete={() => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'onboarding_complete', {
        portal: 'admin',
        timestamp: Date.now(),
      })
    }

    // Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Onboarding Complete', {
        portal: 'admin',
      })
    }

    // Custom API
    fetch('/api/analytics/tour-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourId: 'admin-portal' }),
    })
  }}
  onSkip={() => {
    // Track skip event
    window.gtag?.('event', 'onboarding_skip', { portal: 'admin' })
  }}
/>
```

---

## Common Issues

### Issue: Tour doesn't start

**Possible causes:**
1. Elements with `data-tour` attributes don't exist in DOM
2. Tour already completed (check localStorage)
3. Elements not rendered yet (500ms delay should handle this)

**Solutions:**
```javascript
// Check if elements exist
document.querySelectorAll('[data-tour]')

// Clear completion
localStorage.removeItem('onboarding-tour-admin-portal')

// Check console for errors
```

### Issue: Elements not highlighted correctly

**Possible causes:**
1. Z-index conflict (driver.js uses 10000)
2. CSS selector is incorrect

**Solutions:**
- Ensure no elements have z-index > 10000
- Use specific selectors: `[data-tour="dashboard"]` instead of class names

### Issue: Dark mode styling broken

**Possible causes:**
1. CSS not imported
2. Theme detection not working

**Solutions:**
- Verify import in `app/globals.css`:
  ```css
  @import "../styles/driver-theme.css";
  ```
- Check dark mode class is applied to `<html>` or `<body>`

---

## Checklist

### Admin Portal
- [ ] Add `<OnboardingTour />` to layout
- [ ] Add `data-tour="dashboard"` attribute
- [ ] Add `data-tour="earnings"` attribute
- [ ] Add `data-tour="microsites"` attribute
- [ ] Add `data-tour="partners"` attribute
- [ ] Add `data-tour="leads"` attribute
- [ ] Add `data-tour="command-palette"` attribute
- [ ] Test tour start
- [ ] Test tour completion
- [ ] Test settings reset (optional)
- [ ] Add analytics tracking (optional)

### HiQor Portal
- [ ] Add `<OnboardingTour />` to layout
- [ ] Add `data-tour="dashboard"` attribute
- [ ] Add `data-tour="policies"` attribute
- [ ] Add `data-tour="claims"` attribute
- [ ] Add `data-tour="call-center"` attribute
- [ ] Add `data-tour="sync"` attribute
- [ ] Add `data-tour="command-palette"` attribute
- [ ] Test tour
- [ ] Add analytics (optional)

### Sures Portal
- [ ] Add `<OnboardingTour />` to layout
- [ ] Add `data-tour="dashboard"` attribute
- [ ] Add `data-tour="policies"` attribute
- [ ] Add `data-tour="claims"` attribute
- [ ] Add `data-tour="reports"` attribute
- [ ] Add `data-tour="sync"` attribute
- [ ] Add `data-tour="command-palette"` attribute
- [ ] Test tour
- [ ] Add analytics (optional)

---

## Resources

- **Demo Page**: `/admin/tour-demo`
- **Full Documentation**: `/components/shared/OnboardingTour.README.md`
- **Examples**: `/components/shared/OnboardingTour.example.tsx`
- **Quick Start**: `/components/shared/OnboardingTour.QUICKSTART.md`
- **Types**: `/components/shared/OnboardingTour.types.ts`

---

## Support

For questions or issues:
1. Check the demo page at `/admin/tour-demo`
2. Review examples in `OnboardingTour.example.tsx`
3. Check browser console for errors
4. Verify all `data-tour` attributes exist in DOM

---

**Last Updated**: January 2026
**Version**: 1.0.0
