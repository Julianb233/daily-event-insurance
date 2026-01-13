# BulkActionBar Component

A floating action bar that appears at the bottom of the screen when items are selected in a table or list. Provides bulk operations like export, delete, and status updates with smooth animations and dark mode support.

## Features

- **Floating Design**: Fixed position at bottom center with pill-shaped design
- **Animated Entry/Exit**: Smooth slide-up animation using framer-motion
- **Portal-Specific Colors**: Different color schemes for admin (violet), hiqor (indigo), and sures (emerald)
- **Built-in Actions**: Export, Delete (with confirmation), and Update Status
- **Custom Actions**: Support for additional custom actions with icons
- **Status Dropdown**: Dropdown menu for status updates
- **Delete Confirmation**: Two-click delete with auto-reset after 5 seconds
- **Dark Mode Support**: Fully styled for dark mode
- **Keyboard Accessible**: Proper focus states and ARIA labels

## Installation

The component is already in the shared components directory:

```tsx
import { BulkActionBar } from '@/components/shared/BulkActionBar'
// or
import { BulkActionBar } from '@/components/shared'
```

## Dependencies

Required packages (should already be installed):
- `framer-motion` - For animations
- `lucide-react` - For icons

## Basic Usage

```tsx
"use client"

import { useState } from 'react'
import { BulkActionBar } from '@/components/shared'

export function MyTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <div>
      {/* Your table/list with checkboxes */}

      <BulkActionBar
        selectedCount={selectedItems.length}
        onExport={() => exportSelected()}
        onDelete={() => deleteSelected()}
        onDeselectAll={() => setSelectedItems([])}
      />
    </div>
  )
}
```

## Props API

### BulkActionBarProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedCount` | `number` | Yes | Number of selected items |
| `onExport` | `() => void` | No | Callback for export action |
| `onDelete` | `() => void` | No | Callback for delete action (with confirmation) |
| `onUpdateStatus` | `(status: string) => void` | No | Callback when status is selected |
| `onDeselectAll` | `() => void` | Yes | Callback to clear selection |
| `actions` | `BulkAction[]` | No | Array of custom actions |
| `statusOptions` | `string[]` | No | Array of status options for dropdown |
| `portalType` | `'admin' \| 'hiqor' \| 'sures'` | No | Portal type for color scheme (default: 'admin') |

### BulkAction Interface

```tsx
interface BulkAction {
  label: string              // Action button text
  icon: LucideIcon          // Icon component from lucide-react
  onClick: () => void       // Click handler
  variant?: 'default' | 'danger'  // Visual style
}
```

## Advanced Usage

### With Custom Actions

```tsx
import { Mail, Archive, Send } from 'lucide-react'

<BulkActionBar
  selectedCount={selectedItems.length}
  portalType="admin"
  onExport={() => exportItems()}
  onDelete={() => deleteItems()}
  onDeselectAll={() => setSelectedItems([])}
  actions={[
    {
      label: 'Send Email',
      icon: Mail,
      onClick: () => sendBulkEmail(selectedItems),
    },
    {
      label: 'Archive',
      icon: Archive,
      onClick: () => archiveItems(selectedItems),
    },
    {
      label: 'Publish',
      icon: Send,
      onClick: () => publishItems(selectedItems),
    },
  ]}
/>
```

### With Status Updates

```tsx
<BulkActionBar
  selectedCount={selectedItems.length}
  onUpdateStatus={(status) => {
    updateItemsStatus(selectedItems, status)
    setSelectedItems([])
  }}
  statusOptions={['Active', 'Inactive', 'Pending', 'Archived', 'Published']}
  onDeselectAll={() => setSelectedItems([])}
/>
```

### With Portal Colors

```tsx
// Admin portal - violet colors
<BulkActionBar
  portalType="admin"
  {...props}
/>

// HiQor portal - indigo colors
<BulkActionBar
  portalType="hiqor"
  {...props}
/>

// Sures portal - emerald colors
<BulkActionBar
  portalType="sures"
  {...props}
/>
```

### Complete Integration Example

```tsx
"use client"

import { useState } from 'react'
import { BulkActionBar } from '@/components/shared'
import { DataTable } from '@/components/admin/DataTable'
import { showSuccess, showError } from '@/components/shared'
import { Mail } from 'lucide-react'

interface Item {
  id: string
  name: string
  status: string
}

export function ItemsTable() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [items, setItems] = useState<Item[]>([...])

  const handleExport = () => {
    const selectedData = items.filter(i => selectedItems.includes(i.id))
    // Export logic
    showSuccess(`Exported ${selectedData.length} items`)
  }

  const handleDelete = () => {
    const remaining = items.filter(i => !selectedItems.includes(i.id))
    setItems(remaining)
    setSelectedItems([])
    showSuccess('Items deleted successfully')
  }

  const handleUpdateStatus = (status: string) => {
    setItems(items.map(item =>
      selectedItems.includes(item.id)
        ? { ...item, status }
        : item
    ))
    setSelectedItems([])
    showSuccess(`Updated ${selectedItems.length} items to ${status}`)
  }

  const handleSendEmail = () => {
    // Email logic
    showSuccess(`Sent emails to ${selectedItems.length} recipients`)
  }

  return (
    <div>
      <DataTable
        columns={[
          {
            key: 'select',
            label: '',
            render: (_, row) => (
              <input
                type="checkbox"
                checked={selectedItems.includes(row.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, row.id])
                  } else {
                    setSelectedItems(selectedItems.filter(id => id !== row.id))
                  }
                }}
              />
            ),
          },
          // ... other columns
        ]}
        data={items}
        idKey="id"
      />

      <BulkActionBar
        selectedCount={selectedItems.length}
        portalType="admin"
        onExport={handleExport}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
        onDeselectAll={() => setSelectedItems([])}
        statusOptions={['Active', 'Inactive', 'Pending', 'Archived']}
        actions={[
          {
            label: 'Send Email',
            icon: Mail,
            onClick: handleSendEmail,
          },
        ]}
      />
    </div>
  )
}
```

## Behavior Details

### Delete Confirmation
- First click shows "Confirm Delete?" button in red
- Second click within 5 seconds executes the delete
- Auto-resets to "Delete" after 5 seconds
- Prevents accidental deletions

### Status Dropdown
- Only appears if `onUpdateStatus` and `statusOptions` are provided
- Dropdown appears above the bar to avoid being cut off
- Auto-closes when an option is selected
- Animated entrance/exit

### Selection Management
- Shows count of selected items
- "Deselect All" button with X icon
- Automatically hides when count reaches 0

### Animations
- Slides up from bottom when items are selected
- Slides down when all items are deselected
- Spring-based animation for natural feel
- Status dropdown has fade + scale animation

## Styling Customization

The component uses Tailwind CSS classes and can be customized by modifying the portal color configuration:

```tsx
const portalColors = {
  admin: {
    bg: 'from-violet-500 to-violet-600',
    hover: 'hover:bg-violet-700/90',
    focus: 'focus:ring-violet-500',
    text: 'text-white',
  },
  // Add custom portal types here
}
```

## Accessibility

- Proper ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus visible states on all interactive elements
- Screen reader friendly
- Sufficient color contrast in all themes

## Best Practices

1. **Always provide onDeselectAll**: Required for user to clear selection
2. **Use appropriate portal type**: Matches your portal's color scheme
3. **Combine with table selection**: Works best with DataTable component
4. **Show toast notifications**: Use Toast helpers to confirm actions
5. **Clear selection after actions**: Reset selectedItems after successful operations
6. **Use danger variant sparingly**: Only for destructive actions like delete
7. **Provide meaningful action labels**: Keep them short but descriptive

## Performance

- Component only renders when selectedCount > 0
- Uses AnimatePresence for efficient animation mounting/unmounting
- No unnecessary re-renders with proper state management
- Lightweight dependencies (framer-motion + lucide-react)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid and Flexbox support
- Backdrop blur may have limited support in older browsers

## Related Components

- `DataTable` - Table component with built-in selection support
- `Toast` - Toast notifications for user feedback
- `EmptyState` - Show when no items are available

## Examples

See `BulkActionBar.example.tsx` for a complete working example with DataTable integration.

## Changelog

### Version 1.0.0
- Initial release
- Support for export, delete, and status update actions
- Custom actions support
- Portal-specific color schemes
- Dark mode support
- Delete confirmation
- Animated status dropdown
