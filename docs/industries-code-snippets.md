# Industries Navigation - Code Snippets

## Key Implementation Details

### 1. Industries Data Structure

```typescript
interface IndustryLink {
  label: string
  href: string
  description: string
}

const industries: IndustryLink[] = [
  { label: "Race Directors", href: "/industries/race-directors", description: "Insurance solutions for race organizers" },
  { label: "Cycling Events", href: "/industries/cycling-events", description: "Comprehensive coverage for cycling competitions" },
  { label: "Triathlons", href: "/industries/triathlons", description: "Multi-sport event insurance coverage" },
  { label: "Obstacle Courses", href: "/industries/obstacle-courses", description: "Protection for challenging events" },
  { label: "Marathons & Fun Runs", href: "/industries/marathons", description: "Coverage for running events of all sizes" },
  { label: "Corporate Wellness", href: "/industries/corporate-wellness", description: "Employee wellness event insurance" },
  { label: "Schools & Universities", href: "/industries/schools-universities", description: "Educational institution event coverage" },
]
```

### 2. State Management

```typescript
const [industriesOpen, setIndustriesOpen] = useState(false) // Desktop dropdown
const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false) // Mobile accordion
```

### 3. Click Outside Handler

```typescript
// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = () => {
    setIndustriesOpen(false)
  }

  if (industriesOpen) {
    document.addEventListener("click", handleClickOutside)
  }

  return () => {
    document.removeEventListener("click", handleClickOutside)
  }
}, [industriesOpen])
```

### 4. Desktop Dropdown Component

```tsx
{/* Industries Dropdown */}
<div className="relative" onClick={(e) => e.stopPropagation()}>
  <motion.button
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    onClick={() => setIndustriesOpen(!industriesOpen)}
    className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
    aria-expanded={industriesOpen}
    aria-haspopup="true"
  >
    Industries
    <ChevronDown
      className={`w-4 h-4 transition-transform duration-200 ${
        industriesOpen ? "rotate-180" : ""
      }`}
    />
  </motion.button>

  <AnimatePresence>
    {industriesOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      >
        <div className="py-2">
          {industries.map((industry, idx) => (
            <motion.a
              key={industry.href}
              href={industry.href}
              onClick={(e) => handleNavClick(e, industry.href)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="block px-4 py-3 hover:bg-[#14B8A6]/5 transition-colors group"
            >
              <div className="font-medium text-slate-900 text-sm group-hover:text-[#14B8A6] transition-colors">
                {industry.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {industry.description}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### 5. Mobile Accordion Component

```tsx
{/* Mobile Industries Accordion */}
<motion.li
  variants={{
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  }}
>
  <button
    onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
    aria-expanded={mobileIndustriesOpen}
  >
    Industries
    <ChevronDown
      className={`w-5 h-5 transition-transform duration-200 ${
        mobileIndustriesOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  <AnimatePresence>
    {mobileIndustriesOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pl-4 py-2 space-y-1">
          {industries.map((industry) => (
            <a
              key={industry.href}
              href={industry.href}
              onClick={(e) => handleNavClick(e, industry.href)}
              className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 rounded-md transition-colors"
            >
              {industry.label}
            </a>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.li>
```

### 6. Footer Industries Section

```tsx
{/* Industries We Serve */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  viewport={{ once: true }}
>
  <h4 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">
    Industries We Serve
  </h4>
  <ul className="space-y-3">
    {[
      { name: "Race Directors", href: "/industries/race-directors" },
      { name: "Cycling Events", href: "/industries/cycling-events" },
      { name: "Triathlons", href: "/industries/triathlons" },
      { name: "Obstacle Courses", href: "/industries/obstacle-courses" },
      { name: "Marathons & Fun Runs", href: "/industries/marathons" },
      { name: "Corporate Wellness", href: "/industries/corporate-wellness" },
      { name: "Schools & Universities", href: "/industries/schools-universities" },
    ].map((link) => (
      <li key={link.name}>
        <Link
          href={link.href}
          className="text-[#64748B] hover:text-[#14B8A6] transition-colors text-sm font-medium"
        >
          {link.name}
        </Link>
      </li>
    ))}
  </ul>
</motion.div>
```

## Animation Variants

### Stagger Children
Used for sequential animation of menu items:

```typescript
variants={{
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15
    }
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
}}
```

### Individual Item Animation
Each dropdown item fades and slides in:

```typescript
initial={{ opacity: 0, x: -10 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: idx * 0.05 }}
```

## Styling Classes

### Dropdown Panel
```
className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
```

### Hover States
```
className="block px-4 py-3 hover:bg-[#14B8A6]/5 transition-colors group"
```

### Chevron Rotation
```
className={`w-4 h-4 transition-transform duration-200 ${
  industriesOpen ? "rotate-180" : ""
}`}
```

## Accessibility Features

1. **ARIA Labels**
   - `aria-expanded={industriesOpen}` - Indicates dropdown state
   - `aria-haspopup="true"` - Indicates popup menu presence

2. **Semantic HTML**
   - `<button>` for interactive triggers
   - `<nav>` for navigation containers
   - `<ul>` and `<li>` for menu lists

3. **Keyboard Navigation**
   - Tab through items naturally
   - Enter/Space to activate buttons
   - Focus management on open/close

4. **Screen Reader Support**
   - Descriptive labels for all interactive elements
   - Proper hierarchy with headings
   - Clear focus indicators
