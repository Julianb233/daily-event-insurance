/**
 * Vector Search Service
 *
 * Provides semantic search capabilities using embeddings for:
 * - Knowledge base articles
 * - Call transcripts
 * - Partner documentation
 * - FAQ content
 *
 * Supports OpenAI embeddings with optional local fallback.
 */

import { db, isDbConfigured } from "@/lib/db"

// Types
export interface VectorDocument {
  id: string
  content: string
  metadata: {
    type: "knowledge_article" | "transcript" | "faq" | "script" | "partner_doc"
    title?: string
    source?: string
    partnerId?: string
    leadId?: string
    createdAt?: string
    tags?: string[]
    [key: string]: unknown
  }
  embedding?: number[]
}

export interface SearchResult {
  document: VectorDocument
  score: number
  highlights?: string[]
}

export interface SearchOptions {
  limit?: number
  threshold?: number
  filter?: {
    type?: VectorDocument["metadata"]["type"]
    partnerId?: string
    leadId?: string
    tags?: string[]
  }
}

// In-memory vector store for development/fallback
// In production, use pgvector, Pinecone, or similar
const vectorStore: Map<string, VectorDocument> = new Map()

// Cache for embeddings to reduce API calls
const embeddingCache: Map<string, number[]> = new Map()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Generate embedding for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Check cache first
  const cacheKey = text.slice(0, 100) // Use first 100 chars as key
  const cached = embeddingCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.warn("[VectorSearch] No OpenAI API key, using fallback embedding")
    return generateFallbackEmbedding(text)
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.slice(0, 8000), // Limit input length
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const embedding = data.data[0].embedding as number[]

    // Cache the result
    embeddingCache.set(cacheKey, embedding)

    // Cleanup old cache entries periodically
    if (embeddingCache.size > 1000) {
      const keys = Array.from(embeddingCache.keys())
      keys.slice(0, 500).forEach((key) => embeddingCache.delete(key))
    }

    return embedding
  } catch (error) {
    console.error("[VectorSearch] Embedding generation failed:", error)
    return generateFallbackEmbedding(text)
  }
}

/**
 * Simple TF-IDF-like fallback embedding when OpenAI is unavailable
 */
function generateFallbackEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean)
  const wordFreq = new Map<string, number>()

  words.forEach((word) => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })

  // Create a simple 256-dimensional vector based on word hashes
  const embedding = new Array(256).fill(0)

  wordFreq.forEach((freq, word) => {
    const hash = simpleHash(word)
    const idx = Math.abs(hash) % 256
    embedding[idx] += freq / words.length
  })

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude
    }
  }

  return embedding
}

/**
 * Simple hash function for fallback embeddings
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    // Handle dimension mismatch by truncating to smaller length
    const minLen = Math.min(a.length, b.length)
    a = a.slice(0, minLen)
    b = b.slice(0, minLen)
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

/**
 * Index a document for vector search
 */
export async function indexDocument(doc: Omit<VectorDocument, "embedding">): Promise<void> {
  console.log(`[VectorSearch] Indexing document: ${doc.id}`)

  const embedding = await generateEmbedding(doc.content)

  const fullDoc: VectorDocument = {
    ...doc,
    embedding,
  }

  vectorStore.set(doc.id, fullDoc)

  // In production, also store in database with pgvector
  // await db.insert(vectorDocuments).values({
  //   id: doc.id,
  //   content: doc.content,
  //   metadata: doc.metadata,
  //   embedding: embedding,
  // })

  console.log(`[VectorSearch] Document indexed: ${doc.id}`)
}

/**
 * Index multiple documents in batch
 */
export async function indexDocuments(docs: Omit<VectorDocument, "embedding">[]): Promise<void> {
  console.log(`[VectorSearch] Batch indexing ${docs.length} documents`)

  // Process in parallel with rate limiting
  const batchSize = 10
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize)
    await Promise.all(batch.map((doc) => indexDocument(doc)))
  }

  console.log(`[VectorSearch] Batch indexing complete`)
}

/**
 * Search for similar documents
 */
export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { limit = 5, threshold = 0.5, filter } = options

  console.log(`[VectorSearch] Searching: "${query.slice(0, 50)}..."`)

  const queryEmbedding = await generateEmbedding(query)
  const results: SearchResult[] = []

  for (const [id, doc] of vectorStore) {
    // Apply filters
    if (filter) {
      if (filter.type && doc.metadata.type !== filter.type) continue
      if (filter.partnerId && doc.metadata.partnerId !== filter.partnerId) continue
      if (filter.leadId && doc.metadata.leadId !== filter.leadId) continue
      if (filter.tags && !filter.tags.some((tag) => doc.metadata.tags?.includes(tag))) continue
    }

    if (!doc.embedding) continue

    const score = cosineSimilarity(queryEmbedding, doc.embedding)

    if (score >= threshold) {
      results.push({
        document: doc,
        score,
        highlights: extractHighlights(doc.content, query),
      })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, limit)
}

/**
 * Extract relevant highlights from content
 */
function extractHighlights(content: string, query: string): string[] {
  const queryTerms = query.toLowerCase().split(/\W+/).filter(Boolean)
  const sentences = content.split(/[.!?]+/)
  const highlights: string[] = []

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    const matchCount = queryTerms.filter((term) => sentenceLower.includes(term)).length

    if (matchCount > 0) {
      highlights.push(sentence.trim().slice(0, 200))
      if (highlights.length >= 3) break
    }
  }

  return highlights
}

/**
 * Search for similar call transcripts
 */
export async function searchTranscripts(
  query: string,
  options: { leadId?: string; limit?: number } = {}
): Promise<SearchResult[]> {
  return search(query, {
    limit: options.limit || 5,
    threshold: 0.4, // Lower threshold for transcripts
    filter: {
      type: "transcript",
      leadId: options.leadId,
    },
  })
}

/**
 * Search knowledge base articles
 */
export async function searchKnowledgeBase(
  query: string,
  options: { limit?: number } = {}
): Promise<SearchResult[]> {
  return search(query, {
    limit: options.limit || 5,
    threshold: 0.5,
    filter: {
      type: "knowledge_article",
    },
  })
}

/**
 * Search call scripts
 */
export async function searchScripts(
  query: string,
  options: { limit?: number } = {}
): Promise<SearchResult[]> {
  return search(query, {
    limit: options.limit || 3,
    threshold: 0.5,
    filter: {
      type: "script",
    },
  })
}

/**
 * Find similar calls based on transcript
 */
export async function findSimilarCalls(
  transcriptId: string,
  options: { limit?: number } = {}
): Promise<SearchResult[]> {
  const doc = vectorStore.get(transcriptId)
  if (!doc) {
    console.warn(`[VectorSearch] Transcript not found: ${transcriptId}`)
    return []
  }

  // Use the transcript content as the query
  return search(doc.content, {
    limit: options.limit || 5,
    threshold: 0.6,
    filter: {
      type: "transcript",
    },
  })
}

/**
 * Get context for RAG (Retrieval Augmented Generation)
 */
export async function getRAGContext(
  query: string,
  options: {
    maxTokens?: number
    includeTypes?: VectorDocument["metadata"]["type"][]
  } = {}
): Promise<string> {
  const { maxTokens = 2000, includeTypes = ["knowledge_article", "faq", "script"] } = options

  // Search across multiple types
  const results: SearchResult[] = []

  for (const type of includeTypes) {
    const typeResults = await search(query, {
      limit: 3,
      threshold: 0.4,
      filter: { type },
    })
    results.push(...typeResults)
  }

  // Sort all results by score
  results.sort((a, b) => b.score - a.score)

  // Build context string within token limit
  let context = ""
  const estimatedTokensPerChar = 0.25 // Rough estimate

  for (const result of results) {
    const docContext = `
### ${result.document.metadata.title || result.document.metadata.type}
${result.document.content.slice(0, 500)}
---
`
    const estimatedTokens = docContext.length * estimatedTokensPerChar

    if ((context.length * estimatedTokensPerChar) + estimatedTokens > maxTokens) {
      break
    }

    context += docContext
  }

  return context.trim()
}

/**
 * Delete a document from the index
 */
export async function deleteDocument(id: string): Promise<void> {
  vectorStore.delete(id)
  console.log(`[VectorSearch] Document deleted: ${id}`)
}

/**
 * Get statistics about the vector store
 */
export function getStats(): {
  documentCount: number
  byType: Record<string, number>
  embeddingsCached: number
} {
  const byType: Record<string, number> = {}

  for (const doc of vectorStore.values()) {
    const type = doc.metadata.type
    byType[type] = (byType[type] || 0) + 1
  }

  return {
    documentCount: vectorStore.size,
    byType,
    embeddingsCached: embeddingCache.size,
  }
}

/**
 * Initialize the vector store with default knowledge base content
 */
export async function initializeKnowledgeBase(): Promise<void> {
  console.log("[VectorSearch] Initializing knowledge base...")

  // Import knowledge base articles
  const { KNOWLEDGE_BASE_ARTICLES } = await import("./vector-search-data")

  for (const article of KNOWLEDGE_BASE_ARTICLES) {
    await indexDocument({
      id: `kb-${article.id}`,
      content: `${article.title}\n\n${article.content}`,
      metadata: {
        type: "knowledge_article",
        title: article.title,
        tags: article.tags,
        createdAt: new Date().toISOString(),
      },
    })
  }

  console.log(`[VectorSearch] Knowledge base initialized with ${KNOWLEDGE_BASE_ARTICLES.length} articles`)
}

/**
 * Index a call transcript for future retrieval
 */
export async function indexTranscript(
  callId: string,
  transcript: string,
  metadata: {
    leadId?: string
    partnerId?: string
    disposition?: string
    sentiment?: string
  }
): Promise<void> {
  await indexDocument({
    id: `transcript-${callId}`,
    content: transcript,
    metadata: {
      type: "transcript",
      leadId: metadata.leadId,
      partnerId: metadata.partnerId,
      createdAt: new Date().toISOString(),
      tags: [
        metadata.disposition,
        metadata.sentiment,
      ].filter(Boolean) as string[],
    },
  })
}

/**
 * Index a call script for agent use
 */
export async function indexScript(
  scriptId: string,
  name: string,
  content: string,
  metadata: {
    businessType?: string
    interestLevel?: string
    tags?: string[]
  }
): Promise<void> {
  await indexDocument({
    id: `script-${scriptId}`,
    content: `${name}\n\n${content}`,
    metadata: {
      type: "script",
      title: name,
      tags: [
        metadata.businessType,
        metadata.interestLevel,
        ...(metadata.tags || []),
      ].filter(Boolean) as string[],
      createdAt: new Date().toISOString(),
    },
  })
}

/**
 * Clear all documents from the vector store
 */
export function clearVectorStore(): void {
  vectorStore.clear()
  embeddingCache.clear()
  console.log("[VectorSearch] Vector store cleared")
}
