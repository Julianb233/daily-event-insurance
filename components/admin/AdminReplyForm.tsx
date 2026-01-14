"use client"

import { useState, useRef } from "react"
import { Send, Code, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { sendAdminReply } from "@/lib/actions/admin-support"
import { cn } from "@/lib/utils"

interface AdminReplyFormProps {
  conversationId: string
  onMessageSent?: () => void
  disabled?: boolean
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "python", label: "Python" },
  { value: "php", label: "PHP" },
  { value: "curl", label: "cURL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
]

export function AdminReplyForm({ conversationId, onMessageSent, disabled }: AdminReplyFormProps) {
  const [message, setMessage] = useState("")
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [codeSnippet, setCodeSnippet] = useState("")
  const [codeLanguage, setCodeLanguage] = useState("javascript")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending || disabled) return

    setIsSending(true)
    setError(null)

    try {
      const result = await sendAdminReply(
        conversationId,
        message.trim(),
        showCodeEditor && codeSnippet.trim() ? codeSnippet.trim() : undefined,
        showCodeEditor && codeSnippet.trim() ? codeLanguage : undefined
      )

      if (result.success) {
        setMessage("")
        setCodeSnippet("")
        setShowCodeEditor(false)
        onMessageSent?.()
      } else {
        setError(result.error || "Failed to send message")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Message Input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply... (Cmd/Ctrl + Enter to send)"
          disabled={isSending || disabled}
          className={cn(
            "w-full px-4 py-3 pr-24 rounded-xl border resize-none",
            "bg-white dark:bg-slate-800",
            "border-slate-200 dark:border-slate-700",
            "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
            "text-slate-900 dark:text-slate-100",
            "placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[100px]"
          )}
          rows={3}
        />

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCodeEditor(!showCodeEditor)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showCodeEditor
                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
            title="Add code snippet"
          >
            <Code className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!message.trim() || isSending || disabled}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "bg-violet-600 hover:bg-violet-700 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Send message"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Panel */}
      {showCodeEditor && (
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-slate-400" />
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="text-sm bg-slate-700 text-slate-200 rounded px-2 py-1 border-none focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowCodeEditor(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste or type your code here..."
            className="w-full px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none min-h-[150px]"
            rows={6}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Press Cmd/Ctrl + Enter to send. Your reply will appear as a system message.
      </p>
    </form>
  )
}
