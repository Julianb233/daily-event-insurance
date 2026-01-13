# Quick Start Guide - 5 Minutes to Dark Mode

Get dark mode working in your admin portal in just 5 minutes.

## Step 1: Update Admin Layout (2 minutes)

Open `/root/github-repos/daily-event-insurance/app/(admin)/layout.tsx` and add:

```tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ThemeProvider } from "@/lib/theme/theme-provider"  // 👈 ADD THIS

const isDevMode = !process.env.AUTH_SECRET

export const metadata = {
  title: "Admin Dashboard | Daily Event Insurance",
  description: "Manage partners, commissions, and system settings.",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isDevMode) {
    const session = await auth()
    if (!session?.user?.id) {
      redirect("/sign-in?callbackUrl=/admin/dashboard")
    }
    const userRole = session.user.role
    if (userRole !== "admin") {
      redirect("/partner/dashboard")
    }
  } else {
    console.log("[DEV MODE] Admin layout - auth checks bypassed")
  }

  return (
    <ThemeProvider storageKey="dei-admin-theme">  {/* 👈 ADD THIS */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">  {/* 👈 UPDATE THIS */}
        <AdminSidebar />
        <main className="lg:pl-72">
          <div className="lg:hidden h-14" />
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>  {/* 👈 ADD THIS */}
  )
}
```

**Changes:**
1. Import `ThemeProvider`
2. Wrap return statement with `<ThemeProvider>`
3. Add `dark:bg-slate-900` to background

---

## Step 2: Add Toggle to Sidebar (3 minutes)

Open `/root/github-repos/daily-event-insurance/components/admin/AdminSidebar.tsx` and find where you want to add the toggle (usually at the bottom or top of the sidebar).

Add this import at the top:
```tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";
```

Then add the toggle component where you want it:

**Option A: In the header/top area**
```tsx
<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
    Admin Portal
  </h2>
  <ThemeToggle size="sm" />  {/* 👈 ADD THIS */}
</div>
```

**Option B: In the footer/bottom area**
```tsx
<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
    <ThemeToggle size="md" showLabel />  {/* 👈 ADD THIS */}
  </div>
</div>
```

**Option C: As a simple button**
```tsx
<div className="p-4">
  <ThemeToggle size="md" showLabel />  {/* 👈 ADD THIS */}
</div>
```

---

## Step 3: Test It! (30 seconds)

1. Start your dev server: `npm run dev`
2. Navigate to the admin portal
3. Click the theme toggle button
4. Watch it cycle through: ☀️ Light → 🌙 Dark → 💻 System

**It should:**
- ✅ Change theme instantly
- ✅ Persist on page reload
- ✅ Show smooth animation
- ✅ Have no flash of wrong theme

---

## That's It!

You now have dark mode in your admin portal.

### Next Steps:

**Make more components dark-mode friendly:**

```tsx
// Before
<div className="bg-white text-gray-900 border-gray-200">
  <p className="text-gray-600">Content</p>
</div>

// After - just add dark: variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
  <p className="text-gray-600 dark:text-gray-400">Content</p>
</div>
```

**Common patterns:**

| Element | Light | Dark |
|---------|-------|------|
| Page background | `bg-slate-50` | `dark:bg-slate-900` |
| Card background | `bg-white` | `dark:bg-gray-800` |
| Primary text | `text-gray-900` | `dark:text-white` |
| Secondary text | `text-gray-600` | `dark:text-gray-400` |
| Border | `border-gray-200` | `dark:border-gray-700` |
| Hover | `hover:bg-gray-50` | `dark:hover:bg-gray-700` |

---

## Repeat for Other Portals

### HIQOR Portal

Update `/root/github-repos/daily-event-insurance/app/(hiqor)/layout.tsx`:

```tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "@/lib/theme/theme-provider"  // 👈 ADD
import { HiqorSidebar } from '@/components/hiqor/HiqorSidebar'

export default function HiqorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider storageKey="dei-hiqor-theme">  {/* 👈 ADD */}
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">  {/* 👈 UPDATE */}
          <HiqorSidebar />
          <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
        </div>
      </ThemeProvider>  {/* 👈 ADD */}
    </SessionProvider>
  )
}
```

Then add `<ThemeToggle />` to HiqorSidebar.

### Sures Portal

Update `/root/github-repos/daily-event-insurance/app/(sures)/layout.tsx`:

```tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "@/lib/theme/theme-provider"  // 👈 ADD
import { SuresSidebar } from '@/components/sures/SuresSidebar'

export default function SuresLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider storageKey="dei-sures-theme">  {/* 👈 ADD */}
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">  {/* 👈 UPDATE */}
          <SuresSidebar />
          <main className="lg:ml-72 pt-14 lg:pt-0">{children}</main>
        </div>
      </ThemeProvider>  {/* 👈 ADD */}
    </SessionProvider>
  )
}
```

Then add `<ThemeToggle />` to SuresSidebar.

---

## Need More Examples?

See [EXAMPLES.md](/lib/theme/EXAMPLES.md) for:
- Dashboard cards
- Data tables
- Forms
- Modals
- Charts
- And more!

---

## Troubleshooting

### Theme toggle not showing?
- Check the import path is correct
- Make sure the file is in `/components/shared/ThemeToggle.tsx`

### Dark mode not working?
- Verify `ThemeProvider` wraps your layout
- Check Tailwind config has dark mode enabled (it should already)
- Clear browser cache and reload

### Flash of wrong theme?
- This should NOT happen with our provider
- If it does, check that `'use client'` is at the top of ThemeProvider

---

**Time to implement:** 5 minutes per portal
**Result:** Professional dark mode with zero FOUC
**Bonus:** Automatic system theme detection
