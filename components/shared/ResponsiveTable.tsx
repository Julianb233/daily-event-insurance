'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Table as TableIcon, LayoutGrid } from 'lucide-react'

interface Column<T> {
  id: string
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  width?: string
  hideOnMobile?: boolean
  mobileLabel?: string
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
  emptyState?: React.ReactNode
  loading?: boolean
}

type ViewMode = 'table' | 'cards'

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyState,
  loading = false,
}: ResponsiveTableProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [localSortColumn, setLocalSortColumn] = useState<string | undefined>(sortColumn)
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc'>(sortDirection || 'asc')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Load view preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('table-view-mode') as ViewMode
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
  }, [])

  // Save view preference
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('table-view-mode', mode)
  }

  // Auto-switch to cards on mobile screens
  useEffect(() => {
    const handleResize = () => {
      const savedPreference = localStorage.getItem('table-view-mode')
      if (!savedPreference && window.innerWidth < 768) {
        setViewMode('cards')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle selection
  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (selectedIds.length === data.length) {
        onSelectionChange([])
      } else {
        onSelectionChange(data.map(row => String(row[keyField])))
      }
    }
  }

  const handleSelectRow = (id: string) => {
    if (onSelectionChange) {
      if (selectedIds.includes(id)) {
        onSelectionChange(selectedIds.filter(selectedId => selectedId !== id))
      } else {
        onSelectionChange([...selectedIds, id])
      }
    }
  }

  const isAllSelected = selectable && selectedIds.length === data.length && data.length > 0
  const isSomeSelected = selectable && selectedIds.length > 0 && selectedIds.length < data.length

  // Handle sorting
  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'

    if (localSortColumn === columnId) {
      newDirection = localSortDirection === 'asc' ? 'desc' : 'asc'
    }

    setLocalSortColumn(columnId)
    setLocalSortDirection(newDirection)

    if (onSort) {
      onSort(columnId, newDirection)
    }
  }

  const getSortIcon = (columnId: string) => {
    if (localSortColumn !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }
    return localSortDirection === 'asc'
      ? <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      : <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
  }

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row)
    }
    return row[column.accessor]
  }

  // Toggle card expansion
  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter columns for mobile view
  const mobileColumns = useMemo(() =>
    columns.filter(col => !col.hideOnMobile),
    [columns]
  )

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        {emptyState || (
          <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm mt-1">There are no items to display</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
          <button
            onClick={() => handleViewModeChange('table')}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <TableIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => handleViewModeChange('cards')}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${viewMode === 'cards'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isSomeSelected
                      }}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </th>
                )}
                {columns.map(column => (
                  <th
                    key={column.id}
                    className={`
                      px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider
                      ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                    `}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && getSortIcon(column.id)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map(row => {
                const rowId = String(row[keyField])
                const isSelected = selectedIds.includes(rowId)

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={`
                      transition-colors
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          onClick={e => e.stopPropagation()}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </td>
                    )}
                    {columns.map(column => (
                      <td
                        key={column.id}
                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards view */}
      {viewMode === 'cards' && (
        <div className="space-y-3">
          {data.map(row => {
            const rowId = String(row[keyField])
            const isSelected = selectedIds.includes(rowId)
            const isExpanded = expandedCards.has(rowId)

            return (
              <div
                key={rowId}
                className={`
                  rounded-lg border transition-colors
                  ${isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {/* Card header */}
                <div className="flex items-start gap-3 p-4">
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(rowId)}
                      onClick={e => e.stopPropagation()}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    {/* Primary columns (non-hidden) */}
                    <div className="space-y-2">
                      {mobileColumns.slice(0, 3).map(column => (
                        <div key={column.id}>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {column.mobileLabel || column.header}
                          </div>
                          <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                            {getCellValue(row, column)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expandable section */}
                    {mobileColumns.length > 3 && (
                      <>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            {mobileColumns.slice(3).map(column => (
                              <div key={column.id}>
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {column.mobileLabel || column.header}
                                </div>
                                <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                                  {getCellValue(row, column)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCardExpansion(rowId)
                          }}
                          className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
