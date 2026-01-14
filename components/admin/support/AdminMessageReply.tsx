"use client"

import { useState, useEffect } from "react"
import { Send, Code, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminMessageReplyProps {
  conversationId: string
  onMessageSent?: () => void
  disabled?: boolean
  initialContent?: string
  initialCodeSnippet?: string
  initialCodeLanguage?: string
  onContentChange?: (content: string) => void
  onCodeChange?: (code: string, language: string) => void
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "jsx", label: "JSX" },
  { value: "python", label: "Python" },
  { value: "php", label: "PHP" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "curl", label: "cURL" },
  { value: "vue", label: "Vue" },
]

export function AdminMessageReply({
  conversationId,
  onMessageSent,
  disabled,
  initialContent = "",
  initialCodeSnippet = "",
  initialCodeLanguage = "typescript",
  onContentChange,
  onCodeChange,
}: AdminMessageReplyProps) {
  const [message, setMessage] = useState(initialContent)
  const [showCodeEditor, setShowCodeEditor] = useState(!!initialCodeSnippet)
  const [codeSnippet, setCodeSnippet] = useState(initialCodeSnippet)
  const [codeLanguage, setCodeLanguage] = useState(initialCodeLanguage)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync with external state changes (from AI suggestions or canned responses)
  useEffect(() => {
    if (initialContent !== message) {
      setMessage(initialContent)
    }
  }, [initialContent])

  useEffect(() => {
    if (initialCodeSnippet !== codeSnippet) {
      setCodeSnippet(initialCodeSnippet)
      if (initialCodeSnippet) {
        setShowCodeEditor(true)
      }
    }
  }, [initialCodeSnippet])

  useEffect(() => {
    if (initialCodeLanguage !== codeLanguage) {
      setCodeLanguage(initialCodeLanguage)
    }
  }, [initialCodeLanguage])

  // Notify parent of changes
  const handleMessageChange = (value: string) => {
    setMessage(value)
    onContentChange?.(value)
  }

  const handleCodeChange = (value: string) => {
    setCodeSnippet(value)
    onCodeChange?.(value, codeLanguage)
  }

  const handleLanguageChange = (value: string) => {
    setCodeLanguage(value)
    onCodeChange?.(codeSnippet, value)
  }

  const handleSend = async () => {
    if (!message.trim() && !codeSnippet.trim()) return
    if (isSending) return

    setIsSending(true)
    setError(null)

    try {
      const payload: Record<string, any> = {
        content: message.trim() || "Here's a code snippet that might help:",
        contentType: codeSnippet.trim() ? "code" : "text",
      }

      if (codeSnippet.trim()) {
        payload.codeSnippet = codeSnippet.trim()
        payload.codeLanguage = codeLanguage
      }

      const response = await fetch(`/api/admin/support/conversations/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to send message")
      }

      // Clear form on success
      setMessage("")
      setCodeSnippet("")
      setShowCodeEditor(false)
      onMessageSent?.()
    } catch (err: any) {
      console.error("Send message error:", err)
      setError(err.message || "Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !showCodeEditor) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="p-4">
        {error && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your reply..."
              rows={3}
              disabled={disabled || isSending}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {showCodeEditor && (
              <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                  <select
                    value={codeLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="text-xs font-medium text-slate-600 bg-transparent border-none focus:outline-none cursor-pointer"
                  >
                    {languageOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setShowCodeEditor(false)
                      handleCodeChange("")
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close code editor"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="Paste or type your code here..."
                  rows={6}
                  disabled={disabled || isSending}
                  className="w-full px-4 py-3 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
        <button
          onClick={() => setShowCodeEditor(!showCodeEditor)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
            showCodeEditor
              ? "bg-violet-100 text-violet-700"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Code className="w-4 h-4" />
          {showCodeEditor ? "Hide Code" : "Add Code"}
        </button>

        <button
          onClick={handleSend}
          disabled={disabled || isSending || (!message.trim() && !codeSnippet.trim())}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Reply
            </>
          )}
        </button>
      </div>
    </div>
  )
}
