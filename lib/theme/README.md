# Theme System Documentation

A comprehensive dark mode system for Daily Event Insurance admin portals built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Overview

This theme system provides:
- 🌓 Light, dark, and system theme modes
- 💾 Persistent theme preference in localStorage
- 🚀 Zero flash of unstyled content (FOUC)
- ⚡ Automatic system theme detection
- 🎨 Smooth theme transitions
- ♿ Accessible theme toggle with keyboard support
- 📱 Responsive design

## Files

- `/lib/theme/theme-provider.tsx` - Theme context provider and hook
- `/components/shared/ThemeToggle.tsx` - Theme toggle button component
- `/styles/globals.css` - Tailwind dark mode CSS variables (already configured)

## Quick Start

### 1. Wrap Your App with ThemeProvider

Add the `ThemeProvider` to your layout:

```tsx
// app/(admin)/layout.tsx
import { ThemeProvider } from "@/lib/theme/theme-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dei-admin-theme">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Your layout content */}
        {children}
      </div>
    </ThemeProvider>
  );
}
```

### 2. Add Theme Toggle to Your UI

```tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Admin Dashboard</h1>
      <ThemeToggle size="md" showLabel={false} />
    </header>
  );
}
```

## API Reference

### ThemeProvider

Provider component that manages theme state and applies it to the DOM.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme when no preference is stored |
| `storageKey` | `string` | `'dei-theme'` | localStorage key for persistence |

**Example:**

```tsx
<ThemeProvider
  defaultTheme="dark"
  storageKey="dei-admin-theme"
>
  {children}
</ThemeProvider>
```

### useTheme Hook

Hook to access and control theme state.

**Returns:**

```typescript
{
  theme: 'light' | 'dark' | 'system';        // Current theme setting
  setTheme: (theme: Theme) => void;           // Function to change theme
  resolvedTheme: 'light' | 'dark';            // Actual theme after system resolution
}
```

**Example:**

```tsx
'use client';

import { useTheme } from "@/lib/theme/theme-provider";

export function CustomThemeControl() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <p>Current setting: {theme}</p>
      <p>Resolved to: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### ThemeToggle Component

Pre-built button component for cycling through themes.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `showLabel` | `boolean` | `false` | Show text label next to icon |
| `className` | `string` | `''` | Additional CSS classes |

**Sizes:**

- `sm` - 32px (8 × 8), 16px icon
- `md` - 40px (10 × 10), 20px icon
- `lg` - 48px (12 × 12), 24px icon

**Examples:**

```tsx
// Small toggle without label
<ThemeToggle size="sm" />

// Medium toggle with label
<ThemeToggle size="md" showLabel />

// Large toggle with custom styling
<ThemeToggle
  size="lg"
  className="fixed top-4 right-4"
/>
```

## Styling with Dark Mode

The theme system uses Tailwind CSS v4's custom variant system. Dark mode styles are already configured in `/styles/globals.css`.

### Using Dark Mode Classes

```tsx
// Basic dark mode styling
<div className="bg-white dark:bg-slate-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>

// Hover states
<button className="
  bg-blue-500 dark:bg-blue-600
  hover:bg-blue-600 dark:hover:bg-blue-700
  text-white
">
  Click me
</button>

// Borders and rings
<input className="
  border border-gray-300 dark:border-gray-700
  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
" />
```

### CSS Variables

The theme system defines semantic color variables:

```css
/* Light mode */
--background: oklch(1 0 0);              /* White */
--foreground: oklch(0.145 0 0);          /* Near black */
--primary: oklch(0.205 0 0);             /* Dark gray */

/* Dark mode */
.dark {
  --background: oklch(0.145 0 0);        /* Dark gray */
  --foreground: oklch(0.985 0 0);        /* Near white */
  --primary: oklch(0.985 0 0);           /* Light gray */
}
```

Use in Tailwind:

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Button
  </button>
</div>
```

## Advanced Usage

### Conditional Rendering Based on Theme

```tsx
'use client';

import { useTheme } from "@/lib/theme/theme-provider";

export function ThemedLogo() {
  const { resolvedTheme } = useTheme();

  return (
    <img
      src={resolvedTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
    />
  );
}
```

### Programmatic Theme Control

```tsx
'use client';

import { useEffect } from 'react';
import { useTheme } from "@/lib/theme/theme-provider";

export function AutoDarkMode() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const hour = new Date().getHours();

    // Auto dark mode from 8 PM to 6 AM
    if (hour >= 20 || hour < 6) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  return null;
}
```

### Custom Theme Toggle

```tsx
'use client';

import { useTheme } from "@/lib/theme/theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";

export function CustomToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="flex gap-2">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            px-3 py-2 rounded-lg transition-colors
            ${theme === value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
            }
          `}
        >
          <Icon size={20} />
          <span className="ml-2">{label}</span>
        </button>
      ))}
    </div>
  );
}
```

## Implementation Across Portals

### Admin Portal

```tsx
// app/(admin)/layout.tsx
import { ThemeProvider } from "@/lib/theme/theme-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="dei-admin-theme">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {children}
      </div>
    </ThemeProvider>
  );
}
```

Add to sidebar:
```tsx
// components/admin/AdminSidebar.tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function AdminSidebar() {
  return (
    <aside>
      {/* ...other sidebar content */}
      <div className="p-4">
        <ThemeToggle showLabel />
      </div>
    </aside>
  );
}
```

### HIQOR Portal

```tsx
// app/(hiqor)/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { HiqorSidebar } from '@/components/hiqor/HiqorSidebar';

export default function HiqorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider storageKey="dei-hiqor-theme">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <HiqorSidebar />
          <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
```

### Sures Portal

```tsx
// app/(sures)/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { SuresSidebar } from '@/components/sures/SuresSidebar';

export default function SuresLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider storageKey="dei-sures-theme">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <SuresSidebar />
          <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
```

## Troubleshooting

### Flash of Unstyled Content (FOUC)

The ThemeProvider prevents FOUC by:
1. Not rendering until mounted (hydration safe)
2. Applying theme immediately on mount
3. Using inline styles for instant application

If you still see flashing:
- Ensure ThemeProvider wraps your entire layout
- Check that `'use client'` directive is present
- Verify localStorage is accessible

### Theme Not Persisting

Check:
1. localStorage is enabled in browser
2. Correct `storageKey` is used
3. No errors in browser console
4. Private/incognito mode may restrict storage

### System Theme Not Detected

Verify:
1. `theme` is set to `'system'`
2. Browser supports `matchMedia`
3. Check browser's system preference setting

### Dark Mode Styles Not Applying

Ensure:
1. Tailwind v4 is installed: `@tailwindcss/postcss`
2. `globals.css` has dark mode variant: `@custom-variant dark (&:is(.dark *));`
3. Using `dark:` prefix in Tailwind classes
4. No conflicting global styles

## Best Practices

1. **Use semantic colors**: Prefer CSS variables (`bg-background`) over specific colors (`bg-white`)
2. **Consistent storage keys**: Use different keys for different portals
3. **Test both themes**: Always test UI components in both light and dark mode
4. **Consider contrast**: Ensure WCAG contrast ratios in both themes
5. **Animate transitions**: Add smooth transitions for better UX
6. **Respect user preference**: Default to `'system'` theme

## Browser Support

- ✅ Chrome 76+
- ✅ Firefox 67+
- ✅ Safari 12.1+
- ✅ Edge 79+
- ⚠️ IE 11 (requires polyfills)

## Performance

- Zero runtime overhead when theme doesn't change
- Minimal re-renders (only when theme changes)
- localStorage read only on mount
- No flash of unstyled content
- Tree-shakeable exports

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels on buttons
- ✅ Focus visible indicators
- ✅ Screen reader friendly
- ✅ Respects `prefers-color-scheme`
- ✅ No motion for `prefers-reduced-motion`

## Migration Guide

### From Other Theme Libraries

If migrating from `next-themes`:

```diff
- import { ThemeProvider, useTheme } from 'next-themes'
+ import { ThemeProvider, useTheme } from '@/lib/theme/theme-provider'

- <ThemeProvider attribute="class">
+ <ThemeProvider>
```

The API is similar but optimized for this project.

## License

Part of Daily Event Insurance codebase.
