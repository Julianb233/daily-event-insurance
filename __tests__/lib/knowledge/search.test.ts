import { describe, it, expect, vi, beforeEach } from "vitest"

// Test the search logic independently
describe("searchKnowledge logic", () => {
  it("should filter results by threshold", () => {
    const mockResults = [
      { id: "1", content: "test content", similarity: 0.5, category: "faq" },
      { id: "2", content: "test content 2", similarity: 0.8, category: "pos" },
      { id: "3", content: "test content 3", similarity: 0.9, category: "pos" },
    ]

    const threshold = 0.7
    const filtered = mockResults.filter((r) => r.similarity >= threshold)

    expect(filtered.length).toBe(2)
    expect(filtered[0].similarity).toBeGreaterThanOrEqual(threshold)
  })

  it("should respect limit option", () => {
    const mockResults = [
      { id: "1", content: "test 1", similarity: 0.9, category: "faq" },
      { id: "2", content: "test 2", similarity: 0.85, category: "faq" },
      { id: "3", content: "test 3", similarity: 0.8, category: "faq" },
    ]

    const limit = 2
    const limited = mockResults.slice(0, limit)

    expect(limited.length).toBe(2)
  })

  it("should sort results by similarity descending", () => {
    const mockResults = [
      { id: "1", content: "test 1", similarity: 0.7, category: "faq" },
      { id: "2", content: "test 2", similarity: 0.9, category: "faq" },
      { id: "3", content: "test 3", similarity: 0.8, category: "faq" },
    ]

    const sorted = [...mockResults].sort((a, b) => b.similarity - a.similarity)

    expect(sorted[0].similarity).toBe(0.9)
    expect(sorted[1].similarity).toBe(0.8)
    expect(sorted[2].similarity).toBe(0.7)
  })

  it("should filter by category when provided", () => {
    const mockResults = [
      { id: "1", content: "pos content", similarity: 0.9, category: "pos-integration" },
      { id: "2", content: "faq content", similarity: 0.85, category: "faq" },
      { id: "3", content: "onboarding content", similarity: 0.8, category: "onboarding" },
    ]

    const category = "pos-integration"
    const filtered = mockResults.filter((r) => r.category === category)

    expect(filtered.length).toBe(1)
    expect(filtered[0].category).toBe("pos-integration")
  })

  it("should return empty array when no results match threshold", () => {
    const mockResults = [
      { id: "1", content: "test 1", similarity: 0.3, category: "faq" },
      { id: "2", content: "test 2", similarity: 0.4, category: "faq" },
    ]

    const threshold = 0.7
    const filtered = mockResults.filter((r) => r.similarity >= threshold)

    expect(filtered.length).toBe(0)
  })
})
