"use client"

/**
 * BulkActionBar Demo Page
 * Quick visual test for all component states and variations
 */

import { useState } from "react"
import { BulkActionBar } from "./BulkActionBar"
import { Mail, Archive, Send, Zap } from "lucide-react"

export function BulkActionBarDemo() {
  const [selectedCount1, setSelectedCount1] = useState(0)
  const [selectedCount2, setSelectedCount2] = useState(0)
  const [selectedCount3, setSelectedCount3] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            BulkActionBar Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test all variations and portal types
          </p>
        </div>

        {/* Demo 1: Admin Portal - Basic Actions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Admin Portal (Violet)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Basic export and delete actions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedCount1(selectedCount1 + 1)}
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
                >
                  Select +1
                </button>
                <button
                  onClick={() => setSelectedCount1(Math.max(0, selectedCount1 - 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Deselect -1
                </button>
                <button
                  onClick={() => setSelectedCount1(5)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Select 5
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Currently selected: {selectedCount1} items
              </p>
            </div>

            <BulkActionBar
              selectedCount={selectedCount1}
              portalType="admin"
              onExport={() => console.log('Export clicked')}
              onDelete={() => {
                console.log('Delete clicked')
                setSelectedCount1(0)
              }}
              onDeselectAll={() => setSelectedCount1(0)}
            />
          </div>
        </section>

        {/* Demo 2: HiQor Portal - With Status Updates */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              HiQor Portal (Indigo)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              With status dropdown and custom actions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedCount2(selectedCount2 + 1)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Select +1
                </button>
                <button
                  onClick={() => setSelectedCount2(Math.max(0, selectedCount2 - 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Deselect -1
                </button>
                <button
                  onClick={() => setSelectedCount2(10)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Select 10
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Currently selected: {selectedCount2} items
              </p>
            </div>

            <BulkActionBar
              selectedCount={selectedCount2}
              portalType="hiqor"
              onExport={() => console.log('Export clicked')}
              onDelete={() => {
                console.log('Delete clicked')
                setSelectedCount2(0)
              }}
              onUpdateStatus={(status) => {
                console.log('Status updated to:', status)
                setSelectedCount2(0)
              }}
              onDeselectAll={() => setSelectedCount2(0)}
              statusOptions={['Active', 'Inactive', 'Pending', 'Archived']}
              actions={[
                {
                  label: 'Send Email',
                  icon: Mail,
                  onClick: () => console.log('Send email clicked'),
                },
              ]}
            />
          </div>
        </section>

        {/* Demo 3: Sures Portal - All Features */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Sures Portal (Emerald)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All features including custom actions
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedCount3(selectedCount3 + 1)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Select +1
                </button>
                <button
                  onClick={() => setSelectedCount3(Math.max(0, selectedCount3 - 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Deselect -1
                </button>
                <button
                  onClick={() => setSelectedCount3(15)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Select 15
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Currently selected: {selectedCount3} items
              </p>
            </div>

            <BulkActionBar
              selectedCount={selectedCount3}
              portalType="sures"
              onExport={() => console.log('Export clicked')}
              onDelete={() => {
                console.log('Delete clicked')
                setSelectedCount3(0)
              }}
              onUpdateStatus={(status) => {
                console.log('Status updated to:', status)
                setSelectedCount3(0)
              }}
              onDeselectAll={() => setSelectedCount3(0)}
              statusOptions={['Draft', 'Published', 'Archived', 'Scheduled']}
              actions={[
                {
                  label: 'Email',
                  icon: Mail,
                  onClick: () => console.log('Email clicked'),
                },
                {
                  label: 'Archive',
                  icon: Archive,
                  onClick: () => console.log('Archive clicked'),
                },
                {
                  label: 'Publish',
                  icon: Send,
                  onClick: () => console.log('Publish clicked'),
                },
                {
                  label: 'Quick Action',
                  icon: Zap,
                  onClick: () => console.log('Quick action clicked'),
                },
              ]}
            />
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Testing Instructions
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Click "Select +1" to see the bar slide up from the bottom</li>
            <li>• Try the different portal types to see color variations</li>
            <li>• Test the delete confirmation (click Delete twice)</li>
            <li>• Test the status dropdown (appears above the bar)</li>
            <li>• Try custom actions in the Sures demo</li>
            <li>• Test dark mode toggle</li>
            <li>• Check responsive behavior on mobile</li>
            <li>• Verify animations are smooth</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

/**
 * To use this demo:
 *
 * Create a page at app/demo/bulk-action-bar/page.tsx:
 *
 * import { BulkActionBarDemo } from '@/components/shared/BulkActionBar.demo'
 *
 * export default function DemoPage() {
 *   return <BulkActionBarDemo />
 * }
 */
