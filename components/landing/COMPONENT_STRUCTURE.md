# StickyBottomCTA - Component Structure

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                           VIEWPORT                              │
│                                                                 │
│                                                                 │
│                      PAGE CONTENT                               │
│                                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  STICKY BOTTOM CTA (fixed, z-40)                               │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │  "Don't let your events..." │  [Get Coverage] [X]        │  │
│ │  Losing $127/day           │                             │  │
│ └───────────────────────────────────────────────────────────┘  │
│ └─────────────────────────────────────────────────────────────┘  │
│  (Animated gradient accent bar)                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component DOM Structure

```
<motion.div> (AnimatePresence wrapper)
  initial={{ y: '100%', opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: '100%', opacity: 0 }}

  ├── className="fixed bottom-0 left-0 right-0 z-40 w-full"
  ├── className="bg-gradient-to-t from-slate-900..."
  ├── className="border-t border-slate-700/50 shadow-2xl"
  │
  └── <div> (Content container, max-w-7xl mx-auto)
      │
      ├── <div> (Flex main container)
      │   │
      │   ├── <div> (Left section: text + counter)
      │   │   ├── <p> Main text
      │   │   └── <span> (badge with loss counter)
      │   │       "Losing $127/day"
      │   │
      │   └── <div> (Right section: button + close)
      │       ├── <button> (Primary CTA)
      │       │   ├── Blue gradient background
      │       │   ├── Hover effects
      │       │   ├── Active scale animation
      │       │   └── Animated pulse dot
      │       │
      │       └── <button> (Close button)
      │           ├── Lucide X icon
      │           ├── Hover effect
      │           └── aria-label="Close notification"
      │
      └── <motion.div> (Animated accent bar)
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-1 bg-gradient-to-r from-blue-500..."
```

## State Management

```
┌─────────────────────────────────────┐
│   StickyBottomCTA Component State   │
├─────────────────────────────────────┤
│                                     │
│  isVisible: boolean                 │
│  ├─ true: Component rendered        │
│  └─ false: Component hidden         │
│    (User clicked close button)      │
│                                     │
│  isHidden: boolean                  │
│  ├─ false: Component visible        │
│  │  (Scroll < 200px)                │
│  └─ true: Component hidden          │
│    (Scroll > 200px)                 │
│                                     │
│  scrollTimeoutRef: ref<Timeout>     │
│  ├─ Debounces scroll events         │
│  └─ Cleaned up on unmount           │
│                                     │
│  scrollThreshold: constant = 200    │
│  └─ Pixels to scroll before hide    │
│                                     │
└─────────────────────────────────────┘
```

## Event Flow

```
User Page Load
     │
     ├──> Component Mounts
     │       ├─> Register scroll listener (passive)
     │       ├─> Set isHidden = false
     │       └─> Set isVisible = true
     │
     └──> Entrance Animation
             ├─> y: 100% → 0
             ├─> opacity: 0 → 1
             └─> Accent bar scales in


User Scrolls Down 300px
     │
     ├──> Scroll Event (passive)
     │       └─> Debounce 100ms
     │
     └──> Timeout Fires
             ├─> window.scrollY > 200
             ├─> setIsHidden(true)
             └─> Exit Animation
                   ├─> y: 0 → 100%
                   ├─> opacity: 1 → 0
                   └─> Component unmounts (AnimatePresence)


User Scrolls Back Up 100px
     │
     ├──> Scroll Event (passive)
     │       └─> Debounce 100ms
     │
     └──> Timeout Fires
             ├─> window.scrollY < 200
             ├─> setIsHidden(false)
             └─> Entrance Animation
                   ├─> y: 100% → 0
                   ├─> opacity: 0 → 1
                   └─> Component remounts


User Clicks CTA Button
     │
     ├──> onClick callback fired
     │
     └──> User's custom handler
             ├─> Navigate to /quote
             ├─> Open modal
             ├─> Track analytics
             └─> External link, etc.


User Clicks Close Button
     │
     ├──> handleClose() called
     │
     ├─> setIsVisible(false)
     │
     └──> Cleanup
             ├─> Component unmounts
             ├─> Scroll listener removed
             └─> Timeouts cleared
```

## Animation State Machine

```
           ┌──────────────────┐
           │   INITIAL STATE  │
           │  (Page Load)     │
           └────────┬─────────┘
                    │
                    │ Mount
                    ▼
           ┌──────────────────┐
           │  ENTERING        │
           │  y: 100%→0       │
           │  opacity: 0→1    │
           └────────┬─────────┘
                    │
                    │ Animation Complete
                    ▼
           ┌──────────────────┐
           │  VISIBLE         │
           │  (Default State) │
           └────┬──────────┬──┘
                │          │
       Scroll>200px    Click Close
                │          │
                ▼          ▼
           ┌────────┐  ┌─────────┐
           │EXITING │  │DISMISSED│
           │y:0→100%│  │(Unmount)│
           │Opc:1→0 │  └─────────┘
           └────┬───┘
                │
                │ Animation Complete
                ▼
           ┌──────────────────┐
           │ UNMOUNTED        │
           │ (Hidden)         │
           └────────┬─────────┘
                    │
         Scroll<200px|
                    ▼
           ┌──────────────────┐
           │  REMOUNTING      │
           │  (Reenter)       │
           └────────┬─────────┘
                    │
                    │ Animation Complete
                    ▼
           ┌──────────────────┐
           │  VISIBLE         │
           └──────────────────┘
```

## Styling Layers

```
┌─────────────────────────────────────────────┐
│ Layer 1: Container                          │
│ ├─ Position: fixed                          │
│ ├─ Z-Index: 40                              │
│ ├─ Background: Dark slate gradient          │
│ ├─ Border: Top border slate-700/50          │
│ └─ Shadow: shadow-2xl                       │
├─────────────────────────────────────────────┤
│ Layer 2: Content (Max Width Container)      │
│ ├─ Max Width: 7xl                           │
│ ├─ Padding: px-4 sm:px-6 lg:px-8            │
│ └─ Padding: py-4 sm:py-5                    │
├─────────────────────────────────────────────┤
│ Layer 3: Flex Layout                        │
│ ├─ Display: flex                            │
│ ├─ Align Items: center                      │
│ ├─ Justify: space-between                   │
│ └─ Gap: gap-4 sm:gap-6                      │
├─────────────────────────────────────────────┤
│ Layer 4: Left Section (Text)                │
│ ├─ Flex: 1 (grow)                           │
│ ├─ Min Width: 0 (prevent overflow)          │
│ ├─ Text Color: white                        │
│ └─ Font: medium (sm/base)                   │
├─────────────────────────────────────────────┤
│ Layer 5: Button Section                     │
│ ├─ Flex: shrink-0                           │
│ ├─ Gap: gap-2 sm:gap-3                      │
│ ├─ Display: flex items-center               │
│ └─ Width: max-content                       │
├─────────────────────────────────────────────┤
│ Layer 6: CTA Button                         │
│ ├─ Background: Blue gradient                │
│ ├─ Padding: px-5 sm:px-7 py-2.5 sm:py-3    │
│ ├─ Text: Font bold, white                   │
│ ├─ Rounded: lg                              │
│ ├─ Hover: Blue darker + shadow              │
│ ├─ Active: Scale 95%                        │
│ └─ Touch Target: 44x44px minimum            │
├─────────────────────────────────────────────┤
│ Layer 7: Close Button                       │
│ ├─ Background: hover:bg-slate-800/50        │
│ ├─ Padding: p-2                             │
│ ├─ Icon: 20x20px                            │
│ ├─ Color: slate-400 hover:slate-200         │
│ └─ Rounded: lg                              │
├─────────────────────────────────────────────┤
│ Layer 8: Accent Bar                         │
│ ├─ Position: bottom                         │
│ ├─ Height: 4px (h-1)                        │
│ ├─ Gradient: Blue to purple                 │
│ ├─ Scale Origin: left                       │
│ └─ Animation: 0.2s delay                    │
└─────────────────────────────────────────────┘
```

## Responsive Breakpoints

```
┌──────────────────────────────────────────────┐
│ Mobile (< 640px)                             │
├──────────────────────────────────────────────┤
│ Padding: py-4 (less vertical space)          │
│ Text Size: text-sm                           │
│ Button Size: px-5 py-2.5                     │
│ Gap: gap-4                                   │
│ Layout: Stacks better on small screens       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Tablet (640px - 1024px)                      │
├──────────────────────────────────────────────┤
│ Padding: py-5 (medium vertical)              │
│ Text Size: text-base                         │
│ Button Size: px-6 py-3                       │
│ Gap: gap-5                                   │
│ Layout: More breathing room                  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Desktop (> 1024px)                           │
├──────────────────────────────────────────────┤
│ Padding: py-5 (same as tablet)               │
│ Text Size: text-base                         │
│ Button Size: px-7 py-3                       │
│ Gap: gap-6                                   │
│ Layout: Full breathing room                  │
└──────────────────────────────────────────────┘
```

## Props Data Flow

```
Parent Component
      │
      ├─ text: "Don't let your events..."
      │   ├─ Displayed in left section
      │   └─ Updates reactively
      │
      ├─ buttonText: "Get Coverage Now"
      │   ├─ Displayed on button
      │   └─ Updates reactively
      │
      ├─ onClick: () => router.push('/quote')
      │   ├─ Called on button click
      │   ├─ Not called on close
      │   └─ Can perform any action
      │
      └─ lossPerDay: 127.50
          ├─ Formatted: "$127/day"
          ├─ Displayed in red badge
          └─ Updates reactively
               │
               ▼
         StickyBottomCTA Component
              │
              ├─> Renders UI
              ├─> Manages scroll behavior
              ├─> Handles animations
              └─> Triggers callbacks
```

## Performance Optimization Points

```
┌─────────────────────────────────────────┐
│ 1. Scroll Debouncing (100ms)            │
│    └─ Prevents excessive state updates   │
├─────────────────────────────────────────┤
│ 2. Passive Event Listener               │
│    └─ Doesn't block scroll performance   │
├─────────────────────────────────────────┤
│ 3. useCallback for Close Handler        │
│    └─ Prevents unnecessary re-renders    │
├─────────────────────────────────────────┤
│ 4. AnimatePresence Conditional Render   │
│    └─ Only renders when visible         │
├─────────────────────────────────────────┤
│ 5. useRef for Timeout Tracking          │
│    └─ Cleanup on unmount                │
├─────────────────────────────────────────┤
│ 6. Framer Motion GPU Acceleration       │
│    └─ Hardware-accelerated animations    │
└─────────────────────────────────────────┘
```

## Integration Points

```
Landing Page Layout
     │
     ├─── StickyBottomCTA Component
     │    ├─ Manages own state
     │    ├─ Listens to scroll
     │    └─ Calls onClick callback
     │
     ├─ Page Content
     │  ├─ Text/Images
     │  ├─ Forms
     │  └─ Other components
     │
     └─ Footer
         └─ Other footer content
```

## Files Generated

```
components/landing/
├── sticky-bottom-cta.tsx              (140 lines)
│   ├─ Component logic
│   ├─ State management
│   ├─ Animation setup
│   └─ Event listeners
│
├── sticky-bottom-cta.example.tsx      (100+ lines)
│   ├─ Basic usage example
│   ├─ Page layout demo
│   └─ Multiple variants
│
├── sticky-bottom-cta.test.tsx         (300+ lines)
│   ├─ Unit tests
│   ├─ Integration tests
│   └─ Accessibility tests
│
├── STICKY_BOTTOM_CTA.md               (500+ lines)
│   ├─ Full documentation
│   ├─ API reference
│   ├─ Usage examples
│   └─ Troubleshooting
│
└── IMPLEMENTATION_GUIDE.md            (400+ lines)
    ├─ Quick start
    ├─ Integration examples
    ├─ Customization
    └─ Testing strategies
```

---

**Total Component Size**: ~2.5kb minified
**Total Documentation**: ~1,500 lines
**Test Coverage**: 25+ test cases
**Ready for Production**: Yes
