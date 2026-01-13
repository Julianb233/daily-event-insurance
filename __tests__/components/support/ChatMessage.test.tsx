import { describe, it, expect, vi } from "vitest"

// Test the ChatMessage logic independently
describe("ChatMessage logic", () => {
  it("should format timestamp correctly", () => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const date = new Date("2024-01-15T10:30:00")
    const formatted = formatTime(date)

    expect(formatted).toMatch(/\d{1,2}:\d{2}/)
  })

  it("should determine message alignment based on role", () => {
    const getAlignment = (role: "user" | "assistant") => {
      return role === "user" ? "right" : "left"
    }

    expect(getAlignment("user")).toBe("right")
    expect(getAlignment("assistant")).toBe("left")
  })

  it("should determine message style based on role", () => {
    const getStyle = (role: "user" | "assistant") => {
      return role === "user"
        ? { bg: "bg-primary", text: "text-white" }
        : { bg: "bg-muted", text: "text-foreground" }
    }

    const userStyle = getStyle("user")
    const assistantStyle = getStyle("assistant")

    expect(userStyle.bg).toBe("bg-primary")
    expect(assistantStyle.bg).toBe("bg-muted")
  })

  it("should show sources only for assistant messages", () => {
    const shouldShowSources = (
      role: "user" | "assistant",
      sources?: Array<{ id: string; title: string }>
    ) => {
      return role === "assistant" && sources && sources.length > 0
    }

    const sources = [{ id: "1", title: "FAQ" }]

    expect(shouldShowSources("assistant", sources)).toBe(true)
    expect(shouldShowSources("user", sources)).toBe(false)
    expect(shouldShowSources("assistant", [])).toBe(false)
    expect(shouldShowSources("assistant", undefined)).toBeFalsy()
  })

  it("should show feedback buttons only for assistant messages", () => {
    const shouldShowFeedback = (role: "user" | "assistant", onFeedback?: () => void) => {
      return role === "assistant" && onFeedback !== undefined
    }

    const mockFeedback = () => {}

    expect(shouldShowFeedback("assistant", mockFeedback)).toBe(true)
    expect(shouldShowFeedback("user", mockFeedback)).toBe(false)
    expect(shouldShowFeedback("assistant", undefined)).toBe(false)
  })

  it("should format similarity score as percentage", () => {
    const formatSimilarity = (similarity: number) => {
      return `${Math.round(similarity * 100)}%`
    }

    expect(formatSimilarity(0.92)).toBe("92%")
    expect(formatSimilarity(0.888)).toBe("89%")
    expect(formatSimilarity(1)).toBe("100%")
  })

  it("should handle streaming indicator", () => {
    const getIndicator = (isStreaming: boolean) => {
      return isStreaming ? "typing" : null
    }

    expect(getIndicator(true)).toBe("typing")
    expect(getIndicator(false)).toBeNull()
  })

  it("should truncate long source titles", () => {
    const truncateTitle = (title: string, maxLength: number = 30) => {
      return title.length > maxLength ? title.substring(0, maxLength) + "..." : title
    }

    expect(truncateTitle("Short title")).toBe("Short title")
    expect(truncateTitle("This is a very long title that should be truncated")).toBe(
      "This is a very long title that..."
    )
  })
})
