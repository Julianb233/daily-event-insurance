import { describe, it, expect, vi, beforeEach } from 'vitest'
import { encrypt, decrypt, encryptDeterministic } from '@/lib/encryption'
import { createRateLimiter } from '@/lib/rate-limit'

// Mock DB for rate limit tests
vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    onConflictDoUpdate: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ count: 1, resetAt: new Date(Date.now() + 60000) }])
    }),
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    query: {
      rateLimits: {
        findFirst: vi.fn().mockResolvedValue({ count: 5, resetAt: new Date() })
      }
    }
  }
}))

// Mock schema to avoid import issues
vi.mock('@/lib/db/schema', () => ({
  rateLimits: {
    key: 'key',
    count: 'count',
    resetAt: 'resetAt'
  }
}))

describe('Security: Field Level Encryption', () => {
  const SENSITIVE_DATA = 'social-security-number-1234'
  
  it('should encrypt and decrypt data correctly', () => {
    const encrypted = encrypt(SENSITIVE_DATA)
    expect(encrypted).not.toBe(SENSITIVE_DATA)
    expect(encrypted).toContain(':') // Should have IV:AuthTag:Content
    
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBe(SENSITIVE_DATA)
  })

  it('should produce different outputs for same input (probabilistic encryption)', () => {
    const enc1 = encrypt(SENSITIVE_DATA)
    const enc2 = encrypt(SENSITIVE_DATA)
    expect(enc1).not.toBe(enc2)
    
    expect(decrypt(enc1)).toBe(SENSITIVE_DATA)
    expect(decrypt(enc2)).toBe(SENSITIVE_DATA)
  })

  it('should support deterministic encryption for searchability', () => {
    const enc1 = encryptDeterministic(SENSITIVE_DATA)
    const enc2 = encryptDeterministic(SENSITIVE_DATA)
    
    expect(enc1).toBe(enc2) // Deterministic should match
    expect(decrypt(enc1)).toBe(SENSITIVE_DATA)
  })
  
  it('should fail to decrypt tampered data', () => {
    const encrypted = encrypt(SENSITIVE_DATA)
    const parts = encrypted.split(':')
    // Tamper with the ciphertext (last part)
    parts[2] = parts[2].replace(/[0-9]/, 'a') 
    const tampered = parts.join(':')
    
    expect(() => decrypt(tampered)).toThrow()
  })
})

describe('Security: Rate Limiting logic', () => {
  it('should create a rate limiter with correct config', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 10 })
    expect(limiter).toHaveProperty('check')
    expect(limiter).toHaveProperty('reset')
  })
  
  // Note: Detailed behavior relies on DB mock which is setup above.
  // We verify the interface works as expected.
  it('should return success when under limit', async () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 10 })
    const result = await limiter.check('test-ip')
    
    expect(result.success).toBe(true)
    expect(result.remaining).toBeGreaterThanOrEqual(0)
  })
})
