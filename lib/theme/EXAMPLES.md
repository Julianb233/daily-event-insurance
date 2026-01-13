# Theme System Examples

Real-world examples of implementing dark mode in Daily Event Insurance admin portals.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Sidebar Integration](#sidebar-integration)
3. [Dashboard Cards](#dashboard-cards)
4. [Data Tables](#data-tables)
5. [Forms](#forms)
6. [Modals](#modals)
7. [Charts](#charts)
8. [Navigation](#navigation)

---

## Basic Setup

### Layout with Theme Provider

```tsx
// app/(admin)/layout.tsx
'use client';

import { ThemeProvider } from "@/lib/theme/theme-provider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dei-admin-theme">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <AdminSidebar />
        <main className="lg:pl-72">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

---

## Sidebar Integration

### Sidebar with Theme Toggle

```tsx
// components/admin/AdminSidebar.tsx
'use client';

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Home, Users, Settings } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="
      fixed inset-y-0 left-0 z-50 w-72
      border-r border-gray-200 dark:border-gray-800
      bg-white dark:bg-gray-900
      transition-colors duration-200
    ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Admin Portal
        </h2>
        <ThemeToggle size="sm" />
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <SidebarLink href="/admin/dashboard" icon={Home}>
          Dashboard
        </SidebarLink>
        <SidebarLink href="/admin/users" icon={Users}>
          Users
        </SidebarLink>
        <SidebarLink href="/admin/settings" icon={Settings}>
          Settings
        </SidebarLink>
      </nav>

      {/* Footer with theme toggle and label */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Theme
          </span>
          <ThemeToggle size="md" showLabel />
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="
        flex items-center gap-3 px-4 py-3 rounded-lg
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        active:bg-gray-200 dark:active:bg-gray-700
        transition-colors duration-150
      "
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </a>
  );
}
```

---

## Dashboard Cards

### Stats Card with Dark Mode

```tsx
// components/admin/StatsCard.tsx
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  return (
    <div className="
      p-6 rounded-xl
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      shadow-sm dark:shadow-gray-900/20
      transition-all duration-200
      hover:shadow-md dark:hover:shadow-gray-900/40
    ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Icon size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>

        {/* Trend indicator */}
        {change && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${change.trend === 'up'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }
          `}>
            <span>{change.trend === 'up' ? '↑' : '↓'}</span>
            <span>{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

Usage:
```tsx
import { Users, DollarSign, TrendingUp } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatsCard
    title="Total Users"
    value="1,234"
    change={{ value: 12, trend: 'up' }}
    icon={Users}
  />
  <StatsCard
    title="Revenue"
    value="$45,678"
    change={{ value: 8, trend: 'up' }}
    icon={DollarSign}
  />
  <StatsCard
    title="Growth"
    value="23%"
    change={{ value: 5, trend: 'down' }}
    icon={TrendingUp}
  />
</div>
```

---

## Data Tables

### Responsive Table with Dark Mode

```tsx
// components/admin/DataTable.tsx
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
}: DataTableProps<T>) {
  return (
    <div className="
      rounded-xl border border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-800
      shadow-sm dark:shadow-gray-900/20
      overflow-hidden
    ">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="
            bg-gray-50 dark:bg-gray-900/50
            border-b border-gray-200 dark:border-gray-700
          ">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="
                    px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                    text-gray-600 dark:text-gray-400
                  "
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item) => (
              <tr
                key={item.id}
                className="
                  hover:bg-gray-50 dark:hover:bg-gray-900/30
                  transition-colors duration-150
                "
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item) => (
          <div key={item.id} className="p-4 space-y-3">
            {columns.map((column) => (
              <div key={String(column.key)} className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {column.label}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

Usage:
```tsx
const partners = [
  { id: 1, name: "Acme Gym", revenue: 1234, status: "active" },
  { id: 2, name: "Beta Climbing", revenue: 5678, status: "pending" },
];

<DataTable
  data={partners}
  columns={[
    { key: "name", label: "Partner Name" },
    {
      key: "revenue",
      label: "Revenue",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${value === 'active'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
          }
        `}>
          {value}
        </span>
      ),
    },
  ]}
/>
```

---

## Forms

### Form with Dark Mode

```tsx
// components/admin/PartnerForm.tsx
'use client';

import { useState } from 'react';

export function PartnerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'gym',
  });

  return (
    <form className="space-y-6">
      {/* Text Input */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Partner Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="
            w-full px-4 py-2 rounded-lg
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-colors duration-150
          "
          placeholder="Enter partner name"
        />
      </div>

      {/* Select Input */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Business Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="
            w-full px-4 py-2 rounded-lg
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-colors duration-150
          "
        >
          <option value="gym">Gym</option>
          <option value="climbing">Climbing Facility</option>
          <option value="rental">Rental Business</option>
        </select>
      </div>

      {/* Textarea */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          className="
            w-full px-4 py-2 rounded-lg
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-colors duration-150
          "
          placeholder="Additional notes..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="
            px-6 py-2 rounded-lg font-medium
            bg-blue-600 dark:bg-blue-500
            text-white
            hover:bg-blue-700 dark:hover:bg-blue-600
            active:bg-blue-800 dark:active:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            transition-colors duration-150
          "
        >
          Save Partner
        </button>
        <button
          type="button"
          className="
            px-6 py-2 rounded-lg font-medium
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-gray-700
            active:bg-gray-100 dark:active:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            transition-colors duration-150
          "
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

---

## Modals

### Modal with Dark Mode

```tsx
// components/shared/Modal.tsx
'use client';

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0 z-50
              bg-black/50 dark:bg-black/70
              backdrop-blur-sm
            "
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              w-full max-w-lg
              rounded-2xl
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-2xl dark:shadow-gray-900/50
              max-h-[90vh] overflow-hidden
            "
          >
            {/* Header */}
            <div className="
              flex items-center justify-between p-6
              border-b border-gray-200 dark:border-gray-700
            ">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="
                  p-2 rounded-lg
                  text-gray-400 dark:text-gray-500
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  hover:text-gray-600 dark:hover:text-gray-300
                  transition-colors duration-150
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Charts

### Chart Container with Dark Mode

```tsx
// components/admin/ChartCard.tsx
import { Line } from 'react-chartjs-2';
import { useTheme } from '@/lib/theme/theme-provider';

export function RevenueChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: isDark ? 'rgb(96, 165, 250)' : 'rgb(37, 99, 235)',
      backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
    }],
  };

  const options = {
    scales: {
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)',
        },
      },
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)',
        },
      },
    },
  };

  return (
    <div className="
      p-6 rounded-xl
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      shadow-sm dark:shadow-gray-900/20
    ">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Revenue Trend
      </h3>
      <Line data={data} options={options} />
    </div>
  );
}
```

---

## Navigation

### Breadcrumbs with Dark Mode

```tsx
// components/shared/Breadcrumbs.tsx
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
          )}
          {item.href ? (
            <a
              href={item.href}
              className="
                text-gray-600 dark:text-gray-400
                hover:text-gray-900 dark:hover:text-white
                transition-colors duration-150
              "
            >
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
```

Usage:
```tsx
<Breadcrumbs
  items={[
    { label: "Admin", href: "/admin" },
    { label: "Partners", href: "/admin/partners" },
    { label: "Edit Partner" },
  ]}
/>
```

---

## Complete Page Example

```tsx
// app/(admin)/admin/partners/page.tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable } from "@/components/admin/DataTable";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Users, DollarSign, TrendingUp } from "lucide-react";

export default function PartnersPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Breadcrumbs
            items={[
              { label: "Admin", href: "/admin" },
              { label: "Partners" },
            ]}
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Partners
          </h1>
        </div>
        <ThemeToggle showLabel />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Partners"
          value="127"
          change={{ value: 12, trend: 'up' }}
          icon={Users}
        />
        <StatsCard
          title="Total Revenue"
          value="$45,678"
          change={{ value: 8, trend: 'up' }}
          icon={DollarSign}
        />
        <StatsCard
          title="Avg Growth"
          value="23%"
          change={{ value: 5, trend: 'down' }}
          icon={TrendingUp}
        />
      </div>

      {/* Table */}
      <DataTable
        data={[
          { id: 1, name: "Acme Gym", revenue: 1234, status: "active" },
          { id: 2, name: "Beta Climbing", revenue: 5678, status: "pending" },
        ]}
        columns={[
          { key: "name", label: "Partner Name" },
          {
            key: "revenue",
            label: "Revenue",
            render: (value) => `$${value.toLocaleString()}`,
          },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${value === 'active'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }
              `}>
                {value}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
```

This creates a fully themed admin page with stats, data tables, and proper dark mode support throughout.
