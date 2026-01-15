"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = "javascript", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="
      relative overflow-hidden
      bg-slate-900/95 backdrop-blur-xl
      border border-slate-700/50
      rounded-2xl
      shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
    ">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          {filename && (
            <span className="ml-4 text-sm text-slate-400">{filename}</span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="
            flex items-center gap-2 px-3 py-1.5
            text-sm text-slate-300
            hover:text-white
            bg-slate-700/50 hover:bg-slate-600/50
            rounded-lg
            transition-colors duration-200
          "
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code */}
      <div className="p-6 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-slate-100 font-mono">
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}
