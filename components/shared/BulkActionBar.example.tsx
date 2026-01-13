"use client"

/**
 * Example implementation of BulkActionBar with DataTable
 * This shows how to integrate multi-select functionality with the bulk action bar
 */

import { useState } from "react"
import { BulkActionBar } from "./BulkActionBar"
import { DataTable, Column } from "../admin/DataTable"
import { Mail, Archive } from "lucide-react"
import { showSuccess, showError, showWarning } from "./Toast"

// Example data type
interface Partner {
  id: string
  name: string
  status: 'Active' | 'Inactive' | 'Pending'
  email: string
  revenue: number
}

export function BulkActionBarExample() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Example data
  const partners: Partner[] = [
    { id: '1', name: 'Acme Corp', status: 'Active', email: 'contact@acme.com', revenue: 50000 },
    { id: '2', name: 'Tech Inc', status: 'Pending', email: 'info@tech.com', revenue: 25000 },
    { id: '3', name: 'Global LLC', status: 'Active', email: 'hello@global.com', revenue: 75000 },
  ]

  // Table columns with checkbox selection
  const columns: Column<Partner>[] = [
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
          className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
        />
      ),
      className: 'w-12',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${value === 'Active' ? 'bg-green-100 text-green-800' : ''}
          ${value === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${value === 'Inactive' ? 'bg-gray-100 text-gray-800' : ''}
        `}>
          {value}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (value) => `$${value.toLocaleString()}`,
    },
  ]

  // Bulk actions
  const handleExport = () => {
    const selectedData = partners.filter(p => selectedItems.includes(p.id))
    console.log('Exporting:', selectedData)
    showSuccess(`Exported ${selectedData.length} items`)
  }

  const handleDelete = () => {
    console.log('Deleting:', selectedItems)
    showWarning(`Deleted ${selectedItems.length} items`)
    setSelectedItems([])
  }

  const handleUpdateStatus = (status: string) => {
    console.log('Updating status to:', status, 'for items:', selectedItems)
    showSuccess(`Updated ${selectedItems.length} items to ${status}`)
    setSelectedItems([])
  }

  const handleSendEmail = () => {
    const emails = partners
      .filter(p => selectedItems.includes(p.id))
      .map(p => p.email)
    console.log('Sending email to:', emails)
    showSuccess(`Sent emails to ${emails.length} partners`)
  }

  const handleArchive = () => {
    console.log('Archiving:', selectedItems)
    showSuccess(`Archived ${selectedItems.length} items`)
    setSelectedItems([])
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partners</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select items to perform bulk actions
          </p>
        </div>

        {/* Select All Header */}
        {partners.length > 0 && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              checked={selectedItems.length === partners.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems(partners.map(p => p.id))
                } else {
                  setSelectedItems([])
                }
              }}
              className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Select all {partners.length} items
            </span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={partners}
          idKey="id"
          onExport={handleExport}
        />

        {/* Bulk Action Bar */}
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
            {
              label: 'Archive',
              icon: Archive,
              onClick: handleArchive,
            },
          ]}
        />
      </div>
    </div>
  )
}

/**
 * Integration Steps:
 *
 * 1. Add state for selected items:
 *    const [selectedItems, setSelectedItems] = useState<string[]>([])
 *
 * 2. Add checkbox column to your DataTable:
 *    {
 *      key: 'select',
 *      label: '',
 *      render: (_, row) => (
 *        <input
 *          type="checkbox"
 *          checked={selectedItems.includes(row.id)}
 *          onChange={(e) => toggleSelection(row.id, e.target.checked)}
 *        />
 *      ),
 *    }
 *
 * 3. Add BulkActionBar at the bottom of your page:
 *    <BulkActionBar
 *      selectedCount={selectedItems.length}
 *      portalType="admin" // or 'hiqor' or 'sures'
 *      onExport={() => exportSelected(selectedItems)}
 *      onDelete={() => deleteSelected(selectedItems)}
 *      onDeselectAll={() => setSelectedItems([])}
 *    />
 *
 * 4. Handle the bulk actions in your component
 */
