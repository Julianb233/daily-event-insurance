/**
 * CSV Export Utility
 *
 * Generates CSV files from data arrays for admin exports
 */

export interface CsvColumn<T> {
  header: string
  accessor: keyof T | ((row: T) => string | number | null | undefined)
  format?: (value: any) => string
}

/**
 * Format a value for CSV (handle commas, quotes, newlines)
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return ""
  }

  const stringValue = String(value)

  // If the value contains commas, quotes, or newlines, wrap in quotes and escape internal quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Generate CSV content from data array
 */
export function generateCSV<T extends Record<string, any>>(
  data: T[],
  columns: CsvColumn<T>[]
): string {
  // Header row
  const headers = columns.map((col) => escapeCSV(col.header)).join(",")

  // Data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let value: any

        if (typeof col.accessor === "function") {
          value = col.accessor(row)
        } else {
          value = row[col.accessor]
        }

        if (col.format) {
          value = col.format(value)
        }

        return escapeCSV(value)
      })
      .join(",")
  })

  return [headers, ...rows].join("\n")
}

/**
 * Format currency for export
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "$0.00"
  const num = typeof value === "string" ? parseFloat(value) : value
  return `$${num.toFixed(2)}`
}

/**
 * Format date for export
 */
export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return ""
  const date = typeof value === "string" ? new Date(value) : value
  return date.toISOString().split("T")[0]
}

/**
 * Format datetime for export
 */
export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return ""
  const date = typeof value === "string" ? new Date(value) : value
  return date.toISOString().replace("T", " ").split(".")[0]
}

/**
 * Format percentage for export
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0%"
  return `${value.toFixed(2)}%`
}
