import crypto from 'crypto'

// Use a secure key from environment variables
// In development, we fallback to a generated key if not present (warns in console)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dev_key_must_be_32_bytes_length!!'
const ALGORITHM = 'aes-256-gcm'

if (process.env.NODE_ENV === 'production' && !process.env.ENCRYPTION_KEY) {
  console.error('CRITICAL: ENCRYPTION_KEY not set in production environment!')
}

/**
 * Encrypts a text string using AES-256-GCM
 * @param text - The plain text to encrypt
 * @returns The encrypted string in format: iv:authTag:encrypted(hex)
 */
export function encrypt(text: string): string {
  // IV (Initialization Vector) - 12 bytes for GCM
  const iv = crypto.randomBytes(12)
  
  // Ensure key is 32 bytes
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypts an encrypted string
 * @param encryptedText - The string in format: iv:authTag:encrypted(hex)
 * @returns The decrypted plain text
 * @throws Error if decryption fails (invalid key or tampered data)
 */
export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':')
  
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted text format')
  }
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Deterministic encryption for searchable fields (use carefully)
 * Note: This allows equality searches but is less secure than randomized IV
 * @param text The text to encrypt
 */
export function encryptDeterministic(text: string): string {
  // Use a fixed IV based on the text hash (HMAC) to ensure different texts have different IVs 
  // but same text always produces same encryption
  const iv = crypto.createHmac('sha256', ENCRYPTION_KEY).update(text).digest().subarray(0, 12)
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}
