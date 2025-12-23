# Industries Navigation - Visual Guide

## Desktop Navigation Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Daily Event Insurance                                    Get Demo  │
│                                                                       │
│  How It Works  │  Who We Serve  │  Benefits  │  Pricing  │ Industries▼│
└─────────────────────────────────────────────────────────────────────┘
                                                             │
                                                             ▼
                                    ┌──────────────────────────────────┐
                                    │  Race Directors                  │
                                    │  Insurance solutions for race... │
                                    ├──────────────────────────────────┤
                                    │  Cycling Events                  │
                                    │  Comprehensive coverage for...   │
                                    ├──────────────────────────────────┤
                                    │  Triathlons                      │
                                    │  Multi-sport event insurance...  │
                                    ├──────────────────────────────────┤
                                    │  Obstacle Courses                │
                                    │  Protection for challenging...   │
                                    ├──────────────────────────────────┤
                                    │  Marathons & Fun Runs            │
                                    │  Coverage for running events...  │
                                    ├──────────────────────────────────┤
                                    │  Corporate Wellness              │
                                    │  Employee wellness event...      │
                                    ├──────────────────────────────────┤
                                    │  Schools & Universities          │
                                    │  Educational institution event...│
                                    └──────────────────────────────────┘
```

## Mobile Navigation Layout

```
┌─────────────────────────────┐
│  Daily Event Insurance   ≡  │
└─────────────────────────────┘
        │
        ▼ (When menu open)
┌─────────────────────────────┐
│                             │
│  How It Works               │
│  Who We Serve               │
│  Benefits                   │
│  Pricing                    │
│  Industries            ▼    │ ◄── Click to expand
│                             │
└─────────────────────────────┘
        │
        ▼ (When expanded)
┌─────────────────────────────┐
│                             │
│  How It Works               │
│  Who We Serve               │
│  Benefits                   │
│  Pricing                    │
│  Industries            ▲    │ ◄── Click to collapse
│    Race Directors           │
│    Cycling Events           │
│    Triathlons               │
│    Obstacle Courses         │
│    Marathons & Fun Runs     │
│    Corporate Wellness       │
│    Schools & Universities   │
│                             │
│  ┌─────────────────────┐   │
│  │     Get Demo        │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

## Footer Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ Daily Event     │  │ Quick Links     │  │ Industries We   │    │
│  │ Insurance       │  │                 │  │ Serve           │    │
│  │                 │  │ • How It Works  │  │                 │    │
│  │ A HiQOR Company │  │ • Who We Serve  │  │ • Race Directors│    │
│  │                 │  │ • Benefits      │  │ • Cycling Events│    │
│  │ Empowering...   │  │ • Pricing       │  │ • Triathlons    │    │
│  │                 │  │                 │  │ • Obstacle...   │    │
│  │  [LinkedIn]     │  │                 │  │ • Marathons...  │    │
│  │                 │  │                 │  │ • Corporate...  │    │
│  │                 │  │                 │  │ • Schools...    │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Interaction States

### Desktop Dropdown

**Closed State:**
```
Industries▼    (slate-600 text, hover: slate-900)
```

**Open State:**
```
Industries▲    (chevron rotated 180°)
  └─ Dropdown Panel (shadow-xl, smooth fade-in)
```

**Hover on Item:**
```
Race Directors                     ◄── text turns teal (#14B8A6)
Insurance solutions for race...    ◄── background: teal/5
```

### Mobile Accordion

**Collapsed State:**
```
Industries                    ▼
```

**Expanded State:**
```
Industries                    ▲
  Race Directors
  Cycling Events
  Triathlons
  Obstacle Courses
  Marathons & Fun Runs
  Corporate Wellness
  Schools & Universities
```

## Animation Sequence

### Desktop Dropdown Open
```
Frame 0ms:    opacity: 0, y: -10px
Frame 200ms:  opacity: 1, y: 0px

Item 1: Delay 0ms
Item 2: Delay 50ms
Item 3: Delay 100ms
Item 4: Delay 150ms
Item 5: Delay 200ms
Item 6: Delay 250ms
Item 7: Delay 300ms
```

### Mobile Accordion Expand
```
Frame 0ms:    height: 0, opacity: 0
Frame 300ms:  height: auto, opacity: 1
```

## Color Palette

```
Primary Brand: #14B8A6 (Teal)
Hover State:   #0F9F90 (Darker Teal)
Light Accent:  #14B8A6/5 (5% opacity teal)
Text Primary:  #1E293B (Slate 900)
Text Secondary:#64748B (Slate 500)
Border:        #E2E8F0 (Gray 200)
Background:    #FFFFFF (White)
```

## Responsive Breakpoints

```
Mobile:   < 1024px (lg breakpoint)
Desktop:  ≥ 1024px

Desktop Features:
- Dropdown menu
- Hover states
- Click outside to close
- Descriptions visible

Mobile Features:
- Accordion menu
- Full-width items
- Touch-optimized tap targets
- No descriptions (space saving)
```

## Z-Index Hierarchy

```
Header:          z-50
Mobile Menu:     z-40
Dropdown Panel:  (inherits from header z-50)
```

## Spacing & Sizing

```
Desktop Dropdown:
- Width: 288px (w-72)
- Padding: 8px vertical (py-2)
- Item padding: 16px horizontal, 12px vertical (px-4 py-3)
- Gap from trigger: 8px (mt-2)

Mobile Accordion:
- Full width
- Item padding: 16px horizontal, 10px vertical (px-4 py-2.5)
- Indent: 16px (pl-4)

Header Height: 64px (h-16)
```

## Typography

```
Desktop Dropdown:
- Trigger: 15px, font-medium
- Item Title: 14px (text-sm), font-medium
- Item Description: 12px (text-xs)

Mobile Menu:
- Trigger: 16px (text-base), font-medium
- Item: 14px (text-sm), font-medium

Footer:
- Section Title: 12px (text-sm), uppercase, font-bold
- Links: 14px (text-sm), font-medium
```

## Performance Metrics

```
Animation Duration:
- Dropdown open/close: 200ms
- Accordion expand/collapse: 300ms
- Chevron rotation: 200ms
- Item stagger delay: 50ms per item

Total Animation Time:
- Desktop: ~550ms (200ms + 7 items × 50ms)
- Mobile: 300ms (accordion only)
```
