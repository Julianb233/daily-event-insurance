/**
 * Brandfetch API Integration
 * Extracts brand assets (logo, colors, fonts) from a domain
 */

const BRANDFETCH_API_KEY = process.env.BRANDFETCH_API_KEY
const BRANDFETCH_API_URL = 'https://api.brandfetch.io/v2/brands'

export interface BrandData {
  name: string
  domain: string
  logoUrl: string | null
  iconUrl: string | null
  primaryColor: string | null
  secondaryColor: string | null
  fontFamily: string | null
}

export interface BrandfetchResponse {
  name: string
  domain: string
  logos?: Array<{
    type: string
    theme: string
    formats: Array<{ src: string; format: string }>
  }>
  colors?: Array<{
    hex: string
    type: string
  }>
  fonts?: Array<{
    name: string
    type: string
  }>
}

/**
 * Check if Brandfetch is configured
 */
export function isBrandfetchConfigured(): boolean {
  return !!BRANDFETCH_API_KEY
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    // Add protocol if missing
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    const parsed = new URL(url)
    return parsed.hostname.replace('www.', '')
  } catch {
    // If URL parsing fails, try to clean it up
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
  }
}

/**
 * Fetch brand data from Brandfetch API
 */
export async function fetchBrandData(websiteUrl: string): Promise<BrandData | null> {
  if (!isBrandfetchConfigured()) {
    console.warn('[Brandfetch] API key not configured')
    return null
  }

  const domain = extractDomain(websiteUrl)
  
  try {
    const response = await fetch(`${BRANDFETCH_API_URL}/${domain}`, {
      headers: {
        'Authorization': `Bearer ${BRANDFETCH_API_KEY}`,
      },
    })

    if (!response.ok) {
      console.warn(`[Brandfetch] Failed to fetch brand for ${domain}: ${response.status}`)
      return null
    }

    const data: BrandfetchResponse = await response.json()
    
    // Extract logo URL (prefer logo over icon, prefer light theme)
    let logoUrl: string | null = null
    let iconUrl: string | null = null
    
    if (data.logos) {
      const logo = data.logos.find(l => l.type === 'logo' && l.theme === 'light')
        || data.logos.find(l => l.type === 'logo')
        || data.logos[0]
      
      if (logo?.formats?.[0]?.src) {
        logoUrl = logo.formats[0].src
      }
      
      const icon = data.logos.find(l => l.type === 'icon')
      if (icon?.formats?.[0]?.src) {
        iconUrl = icon.formats[0].src
      }
    }

    // Extract colors
    let primaryColor: string | null = null
    let secondaryColor: string | null = null
    
    if (data.colors) {
      const accent = data.colors.find(c => c.type === 'accent')
      const dark = data.colors.find(c => c.type === 'dark')
      const light = data.colors.find(c => c.type === 'light')
      
      primaryColor = accent?.hex || data.colors[0]?.hex || null
      secondaryColor = dark?.hex || light?.hex || data.colors[1]?.hex || null
    }

    // Extract font
    const fontFamily = data.fonts?.[0]?.name || null

    return {
      name: data.name,
      domain: data.domain,
      logoUrl,
      iconUrl,
      primaryColor,
      secondaryColor,
      fontFamily,
    }
  } catch (error) {
    console.error('[Brandfetch] Error fetching brand data:', error)
    return null
  }
}
