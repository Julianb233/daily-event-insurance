/**
 * Contract Auto-Population System
 * Fills contract templates with partner-specific data
 *
 * SECURITY: All user inputs are HTML-escaped to prevent XSS
 */

export interface PartnerData {
  businessName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  businessAddress?: string
  websiteUrl?: string
  businessType?: string
  date?: string
}

export interface ContractTemplate {
  type: 'commercial_agreement' | 'nda' | 'shore_agreement' | 'marketing_agreement'
  content: string
}

/**
 * HTML-escape a string to prevent XSS attacks
 * Converts special characters to their HTML entity equivalents
 */
function escapeHtml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Sanitize and validate a URL for safe display
 * Only allows http/https protocols
 */
function sanitizeUrl(url: string): string {
  if (!url) return 'N/A'

  try {
    const parsed = new URL(url)
    // Only allow safe protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'N/A'
    }
    // Return escaped URL
    return escapeHtml(parsed.toString())
  } catch {
    // Invalid URL - return escaped original or N/A
    return escapeHtml(url) || 'N/A'
  }
}

/**
 * Populate a contract template with partner data
 * All values are HTML-escaped to prevent XSS
 */
export function populateContract(template: string, data: PartnerData): string {
  const date = data.date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return template
    .replace(/\{\{BUSINESS_NAME\}\}/g, escapeHtml(data.businessName || ''))
    .replace(/\{\{CONTACT_NAME\}\}/g, escapeHtml(data.contactName || ''))
    .replace(/\{\{CONTACT_EMAIL\}\}/g, escapeHtml(data.contactEmail || ''))
    .replace(/\{\{CONTACT_PHONE\}\}/g, escapeHtml(data.contactPhone || 'N/A'))
    .replace(/\{\{BUSINESS_ADDRESS\}\}/g, escapeHtml(data.businessAddress || 'N/A'))
    .replace(/\{\{WEBSITE_URL\}\}/g, sanitizeUrl(data.websiteUrl || ''))
    .replace(/\{\{BUSINESS_TYPE\}\}/g, escapeHtml(data.businessType || 'Business'))
    .replace(/\{\{DATE\}\}/g, escapeHtml(date))
    .replace(/\{\{YEAR\}\}/g, new Date().getFullYear().toString())
}

/**
 * Get contract template by type
 */
export async function getContractTemplate(type: ContractTemplate['type']): Promise<string> {
  // In production, these would be loaded from a database or file system
  // For now, using placeholder templates that can be replaced with official contracts

  try {
    const fs = await import('fs/promises')
    const path = await import('path')

    const templatePath = path.join(process.cwd(), 'lib', 'contracts', 'templates', `${type}.html`)
    const template = await fs.readFile(templatePath, 'utf-8')
    return template
  } catch (error) {
    // Fallback to placeholder if file doesn't exist
    return getPlaceholderTemplate(type)
  }
}

function getPlaceholderTemplate(type: string): string {
  // Escape the type for safe display
  const safeType = escapeHtml(type)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${safeType} - Placeholder Template</title>
</head>
<body>
  <h1>${safeType}</h1>
  <p><strong>This is a placeholder template.</strong> Official contract will be provided.</p>

  <h2>Party Information</h2>
  <p><strong>Business Name:</strong> {{BUSINESS_NAME}}</p>
  <p><strong>Contact Name:</strong> {{CONTACT_NAME}}</p>
  <p><strong>Contact Email:</strong> {{CONTACT_EMAIL}}</p>
  <p><strong>Contact Phone:</strong> {{CONTACT_PHONE}}</p>
  <p><strong>Business Address:</strong> {{BUSINESS_ADDRESS}}</p>
  <p><strong>Website:</strong> {{WEBSITE_URL}}</p>
  <p><strong>Business Type:</strong> {{BUSINESS_TYPE}}</p>

  <h2>Agreement Details</h2>
  <p><strong>Date:</strong> {{DATE}}</p>
  <p><strong>Year:</strong> {{YEAR}}</p>

  <p><em>This template will be replaced with the official contract once available.</em></p>
</body>
</html>
  `.trim()
}

/**
 * Generate all contracts for a partner
 */
export async function generateAllContracts(data: PartnerData): Promise<Record<string, string>> {
  const contractTypes: ContractTemplate['type'][] = [
    'commercial_agreement',
    'nda',
    'shore_agreement',
    'marketing_agreement'
  ]

  const contracts: Record<string, string> = {}

  for (const type of contractTypes) {
    const template = await getContractTemplate(type)
    contracts[type] = populateContract(template, data)
  }

  return contracts
}
