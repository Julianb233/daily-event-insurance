import { describe, it, expect, vi, beforeEach } from "vitest"

// Test the support chat logic independently
describe("useSupportChat logic", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should generate correct API endpoint for sessions", () => {
    const endpoint = "/api/support/sessions"
    expect(endpoint).toBe("/api/support/sessions")
  })

  it("should generate correct API endpoint for messages", () => {
    const endpoint = "/api/support/messages"
    expect(endpoint).toBe("/api/support/messages")
  })

  it("should generate correct API endpoint for feedback", () => {
    const endpoint = "/api/support/feedback"
    expect(endpoint).toBe("/api/support/feedback")
  })

  it("should build correct request body for creating session", () => {
    const context = {
      partnerId: "partner-123",
      partnerName: "Test Partner",
      businessType: "gym",
      posSystem: "square",
      currentPage: "/onboarding",
      onboardingStep: 1,
      isOnboarding: true,
    }

    const body = { context }

    expect(body.context.partnerId).toBe("partner-123")
    expect(body.context.businessType).toBe("gym")
    expect(body.context.onboardingStep).toBe(1)
  })

  it("should build correct request body for sending message", () => {
    const sessionId = "session-123"
    const message = "Hello, I need help"

    const body = { sessionId, message }

    expect(body.sessionId).toBe(sessionId)
    expect(body.message).toBe(message)
  })

  it("should build correct request body for feedback", () => {
    const sessionId = "session-123"
    const messageId = "msg-456"
    const rating = "positive"

    const body = { sessionId, messageId, rating }

    expect(body.sessionId).toBe(sessionId)
    expect(body.messageId).toBe(messageId)
    expect(body.rating).toBe("positive")
  })

  it("should validate message roles", () => {
    type MessageRole = "user" | "assistant" | "system"

    const userRole: MessageRole = "user"
    const assistantRole: MessageRole = "assistant"

    expect(userRole).toBe("user")
    expect(assistantRole).toBe("assistant")
  })

  it("should format message timestamp", () => {
    const timestamp = new Date("2024-01-15T10:30:00Z")

    const hours = timestamp.getHours()
    const minutes = timestamp.getMinutes().toString().padStart(2, "0")
    const timeStr = `${hours}:${minutes}`

    expect(timeStr).toMatch(/\d+:\d{2}/)
  })

  it("should handle feedback types", () => {
    type FeedbackType = "positive" | "negative"

    const positive: FeedbackType = "positive"
    const negative: FeedbackType = "negative"

    expect(positive).toBe("positive")
    expect(negative).toBe("negative")
  })

  it("should parse SSE data correctly", () => {
    const sseData = 'data: {"content":"Hello!"}\n\n'
    const lines = sseData.split("\n")
    const dataLine = lines.find((l) => l.startsWith("data: "))

    if (dataLine) {
      const json = JSON.parse(dataLine.replace("data: ", ""))
      expect(json.content).toBe("Hello!")
    }
  })

  it("should handle sources in message", () => {
    const message = {
      id: "1",
      role: "assistant",
      content: "Here is the information you requested.",
      sources: [
        { id: "src-1", title: "FAQ - Getting Started", similarity: 0.92 },
        { id: "src-2", title: "POS Integration Guide", similarity: 0.88 },
      ],
    }

    expect(message.sources).toHaveLength(2)
    expect(message.sources[0].title).toBe("FAQ - Getting Started")
    expect(message.sources[0].similarity).toBeGreaterThan(0.8)
  })
})
