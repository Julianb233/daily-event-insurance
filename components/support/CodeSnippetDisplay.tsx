"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeSnippetDisplayProps {
  code: string
  language: string
  title?: string
  className?: string
}

const languageLabels: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  python: "Python",
  php: "PHP",
  curl: "cURL",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  vue: "Vue",
  bash: "Bash",
  shell: "Shell",
}

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-500",
  typescript: "bg-blue-500",
  tsx: "bg-blue-500",
  jsx: "bg-yellow-500",
  python: "bg-green-500",
  php: "bg-purple-500",
  curl: "bg-orange-500",
  html: "bg-red-500",
  css: "bg-pink-500",
  json: "bg-gray-500",
  vue: "bg-emerald-500",
  bash: "bg-gray-600",
  shell: "bg-gray-600",
}

export function CodeSnippetDisplay({
  code,
  language,
  title,
  className,
}: CodeSnippetDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const label = languageLabels[language] || language.toUpperCase()
  const colorClass = languageColors[language] || "bg-zinc-500"

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-900",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", colorClass)} />
          <span className="text-xs font-medium text-zinc-400">
            {title || label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-3 text-sm text-zinc-100 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
