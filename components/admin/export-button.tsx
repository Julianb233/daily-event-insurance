"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, Loader2 } from "lucide-react"

type ExportType = "partners" | "policies" | "payouts" | "sales" | "summary"
type Period = "7d" | "30d" | "90d" | "1y" | "all"

interface ExportButtonProps {
  defaultType?: ExportType
  period?: Period
  status?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

const exportLabels: Record<ExportType, string> = {
  partners: "Partners",
  policies: "Policies",
  payouts: "Payouts",
  sales: "Sales & Quotes",
  summary: "Summary Report",
}

export function ExportButton({
  defaultType,
  period = "30d",
  status,
  variant = "outline",
  size = "default",
  showLabel = true,
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<ExportType | null>(null)

  const handleExport = async (type: ExportType) => {
    setIsLoading(true)
    setLoadingType(type)

    try {
      const params = new URLSearchParams({
        type,
        period,
      })
      if (status) {
        params.append("status", status)
      }

      const response = await fetch(`/api/admin/export?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition")
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch?.[1] || `export-${type}-${Date.now()}.csv`

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  // If a default type is specified, render a simple button
  if (defaultType) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport(defaultType)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {showLabel && (
          <span className="ml-2">
            Export {exportLabels[defaultType]}
          </span>
        )}
      </Button>
    )
  }

  // Otherwise render a dropdown with all export options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {showLabel && <span className="ml-2">Export</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Data</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleExport("summary")}
          disabled={loadingType === "summary"}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Summary Report
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("partners")}
          disabled={loadingType === "partners"}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Partners
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("policies")}
          disabled={loadingType === "policies"}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Policies
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("payouts")}
          disabled={loadingType === "payouts"}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Payouts
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("sales")}
          disabled={loadingType === "sales"}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Sales & Quotes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
