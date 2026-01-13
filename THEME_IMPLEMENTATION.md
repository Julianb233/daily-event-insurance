# Dark Mode Theme System Implementation

Complete dark mode system for Daily Event Insurance admin portals.

## 🎉 What Was Created

### Core Theme System
1. **`/lib/theme/theme-provider.tsx`** - Theme context provider with:
   - Light, dark, and system theme modes
   - localStorage persistence
   - Zero flash of unstyled content (FOUC)
   - Automatic system theme detection
   - Proper SSR/hydration handling

2. **`/components/shared/ThemeToggle.tsx`** - Theme toggle button with:
   - Three sizes (sm, md, lg)
   - Optional label display
   - Animated icon transitions
   - Tooltip on hover
   - Cycles through: light → dark → system
   - Icons: Sun (light), Moon (dark), Monitor (system)

3. **`/styles/globals.css`** - Already configured! ✅
   - Tailwind v4 dark mode variant: `@custom-variant dark (&:is(.dark *))`
   - Complete set of CSS variables for both themes
   - Semantic color system

### Documentation
4. **`/lib/theme/README.md`** - Comprehensive documentation including:
   - API reference
   - Setup guide
   - Troubleshooting
   - Best practices
   - Browser support
   - Accessibility features

5. **`/lib/theme/EXAMPLES.md`** - Real-world examples:
   - Sidebar integration
   - Dashboard cards
   - Data tables
   - Forms
   - Modals
   - Charts
   - Navigation components
   - Complete page example

## 🚀 Quick Start

### 1. Import Theme Provider

For each portal, wrap the layout with `ThemeProvider`:

```tsx
// app/(admin)/layout.tsx
import { ThemeProvider } from "@/lib/theme/theme-provider";

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider storageKey="dei-admin-theme">
      {children}
    </ThemeProvider>
  );
}
```

### 2. Add Theme Toggle

Add the toggle button to your sidebar or header:

```tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";

<ThemeToggle size="md" showLabel />
```

### 3. Update Component Styles

Add dark mode variants to your Tailwind classes:

```tsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
</div>
```

## 📋 Implementation Checklist

### Admin Portal
- [ ] Wrap layout with `<ThemeProvider storageKey="dei-admin-theme">`
- [ ] Add `<ThemeToggle>` to AdminSidebar
- [ ] Update bg colors: `bg-slate-50 dark:bg-slate-900`
- [ ] Update text colors: `text-gray-900 dark:text-white`
- [ ] Update borders: `border-gray-200 dark:border-gray-700`
- [ ] Update cards/sections with dark variants
- [ ] Test all pages in both modes

### HIQOR Portal
- [ ] Wrap layout with `<ThemeProvider storageKey="dei-hiqor-theme">`
- [ ] Add `<ThemeToggle>` to HiqorSidebar
- [ ] Update color classes throughout
- [ ] Test all pages in both modes

### Sures Portal
- [ ] Wrap layout with `<ThemeProvider storageKey="dei-sures-theme">`
- [ ] Add `<ThemeToggle>` to SuresSidebar
- [ ] Update color classes throughout
- [ ] Test all pages in both modes

## 🎨 Color Guidelines

### Background Colors
```tsx
// Page backgrounds
bg-slate-50 dark:bg-slate-900

// Card/component backgrounds
bg-white dark:bg-gray-800

// Hover states
hover:bg-gray-50 dark:hover:bg-gray-700
```

### Text Colors
```tsx
// Primary text
text-gray-900 dark:text-white

// Secondary text
text-gray-600 dark:text-gray-400

// Muted text
text-gray-500 dark:text-gray-500
```

### Borders
```tsx
// Standard borders
border-gray-200 dark:border-gray-700

// Subtle borders
border-gray-100 dark:border-gray-800
```

### Interactive Elements
```tsx
// Buttons (primary)
bg-blue-600 dark:bg-blue-500
hover:bg-blue-700 dark:hover:bg-blue-600

// Buttons (secondary)
bg-white dark:bg-gray-800
border-gray-300 dark:border-gray-600
hover:bg-gray-50 dark:hover:bg-gray-700

// Focus rings
focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
focus:ring-offset-2 dark:focus:ring-offset-gray-900
```

## 🔧 API Reference

### ThemeProvider Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Child components |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial theme |
| `storageKey` | `string` | `'dei-theme'` | localStorage key |

### useTheme Hook
```typescript
const { theme, setTheme, resolvedTheme } = useTheme();

// theme: 'light' | 'dark' | 'system'
// resolvedTheme: 'light' | 'dark' (after system resolution)
// setTheme: (theme: Theme) => void
```

### ThemeToggle Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `showLabel` | `boolean` | `false` | Show text label |
| `className` | `string` | `''` | Additional classes |

## 📁 File Locations

```
/root/github-repos/daily-event-insurance/
├── lib/theme/
│   ├── theme-provider.tsx      # Theme context & provider
│   ├── README.md                # Full documentation
│   └── EXAMPLES.md              # Real-world examples
├── components/shared/
│   └── ThemeToggle.tsx          # Toggle button component
├── styles/
│   └── globals.css              # CSS variables (already configured)
└── THEME_IMPLEMENTATION.md      # This file
```

## 🧪 Testing

Test these scenarios in each portal:

1. **Initial Load**
   - System theme is detected correctly
   - No flash of wrong theme
   - Saved preference is restored

2. **Theme Switching**
   - Light mode displays correctly
   - Dark mode displays correctly
   - System mode follows OS preference
   - Smooth transition between themes

3. **Persistence**
   - Theme choice persists on reload
   - Each portal has independent theme
   - Works in private/incognito mode

4. **Components**
   - All text is readable
   - Contrast ratios meet WCAG AA
   - Borders are visible
   - Interactive states work (hover, focus, active)
   - Forms are usable
   - Tables are readable

5. **Browser Compatibility**
   - Chrome/Edge
   - Firefox
   - Safari
   - Mobile browsers

## 🐛 Troubleshooting

### Flash of unstyled content (FOUC)
**Solution:** ThemeProvider prevents this by not rendering until mounted. If you still see it:
- Ensure ThemeProvider wraps your entire layout
- Check that `'use client'` directive is present
- Verify localStorage is accessible

### Theme not persisting
**Check:**
- localStorage is enabled
- Correct `storageKey` is used
- No console errors
- Not in private/incognito mode

### Dark mode styles not applying
**Ensure:**
- Using Tailwind v4: `@tailwindcss/postcss`
- `globals.css` has: `@custom-variant dark (&:is(.dark *))`
- Using `dark:` prefix correctly
- No conflicting global styles

### System theme not detected
**Verify:**
- Theme is set to `'system'`
- Browser supports `matchMedia`
- OS has theme preference set

## 🎯 Next Steps

1. **Pick a portal** (Admin, HIQOR, or Sures)
2. **Update layout** with ThemeProvider
3. **Add toggle** to sidebar
4. **Update one component** with dark mode classes
5. **Test and iterate**
6. **Repeat** for other portals

## 📚 Resources

- [README.md](/lib/theme/README.md) - Full documentation
- [EXAMPLES.md](/lib/theme/EXAMPLES.md) - Real-world examples
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode) - Official docs
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) - Layout patterns

## ✅ Features Included

- ✅ Light, dark, and system themes
- ✅ localStorage persistence
- ✅ Zero FOUC
- ✅ Animated transitions
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ Respects `prefers-color-scheme`
- ✅ Independent themes per portal
- ✅ SSR/hydration safe
- ✅ TypeScript types
- ✅ Framer Motion animations
- ✅ Responsive design
- ✅ Production ready

## 💡 Tips

1. **Use semantic colors** - Prefer `bg-background` over `bg-white`
2. **Test both themes** - Always verify components in both modes
3. **Consider contrast** - Ensure WCAG AA compliance
4. **Animate transitions** - Add `transition-colors duration-200`
5. **Respect preferences** - Default to `'system'` theme
6. **Independent storage** - Use different keys per portal

---

**Ready to implement?** Start with the admin portal and follow the checklist above.

Need help? Check the [README.md](/lib/theme/README.md) for detailed API docs or [EXAMPLES.md](/lib/theme/EXAMPLES.md) for copy-paste examples.
