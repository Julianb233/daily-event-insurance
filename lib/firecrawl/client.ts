/**
 * FireCrawl Client for Web Scraping
 * Fetches partner logos and website images for microsite generation
 */

export interface FireCrawlResult {
  logoUrl?: string
  images: string[]
  colors?: string[]
  fonts?: string[]
  metadata?: {
    title?: string
    description?: string
  }
}

/**
 * Fetch branding assets from partner website using FireCrawl
 */
export async function fetchPartnerBranding(websiteUrl: string): Promise<FireCrawlResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY

  if (!apiKey) {
    console.warn('FIRECRAWL_API_KEY not set, skipping branding fetch')
    return { images: [] }
  }

  try {
    // FireCrawl API endpoint
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: websiteUrl,
        formats: ['markdown', 'html'],
        includeTags: ['img', 'meta'],
        onlyMainContent: false
      })
    })

    if (!response.ok) {
      throw new Error(`FireCrawl API error: ${response.statusText}`)
    }

    const json = await response.json()

    if (!json.success || !json.data) {
      throw new Error(`FireCrawl API returned unsuccessful response: ${JSON.stringify(json)}`)
    }

    const data = json.data

    // Extract logo (usually in header/nav or first image)
    const logoUrl = extractLogo(data)

    // Extract all images
    const images = extractImages(data)

    // Extract colors (theme-color)
    const colors = extractColors(data)

    // Extract fonts (basic heuristic)
    const fonts = extractFonts(data)

    return {
      logoUrl,
      images: images.slice(0, 10), // Limit to 10 images
      colors,
      fonts,
      metadata: {
        title: data.metadata?.title,
        description: data.metadata?.description
      }
    }
  } catch (error) {
    console.error('Error fetching branding from FireCrawl:', error)
    // Return empty result on error - microsite generation will continue without branding
    return { images: [] }
  }
}

/**
 * Extract logo URL from scraped data
 */
function extractLogo(data: any): string | undefined {
  // Try to find logo in common locations
  const html = data.html || ''

  // Look for logo in common class/id names
  const logoPatterns = [
    /<img[^>]*(?:class|id)=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i,
    /<img[^>]*src=["']([^"']+)["'][^>]*(?:class|id)=["'][^"']*logo[^"']*["']/i,
    /<img[^>]*src=["']([^"']*logo[^"']*)["']/i
  ]

  for (const pattern of logoPatterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      return normalizeUrl(match[1], data.url)
    }
  }

  // Fallback: first image in header/nav
  const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i)
  if (headerMatch) {
    const imgMatch = headerMatch[1].match(/<img[^>]*src=["']([^"']+)["']/i)
    if (imgMatch && imgMatch[1]) {
      return normalizeUrl(imgMatch[1], data.url)
    }
  }

  return undefined
}

/**
 * Extract all image URLs from scraped data
 */
function extractImages(data: any): string[] {
  const html = data.html || ''
  const images: string[] = []
  const imgRegex = /<img[^>]*src=["']([^"']+)["']/gi

  let match
  while ((match = imgRegex.exec(html)) !== null) {
    const url = normalizeUrl(match[1], data.url)
    if (url && !images.includes(url)) {
      images.push(url)
    }
  }

  return images
}

/**
 * Normalize URL (make absolute if relative)
 */
function normalizeUrl(url: string, baseUrl: string): string {
  if (!url) return ''

  // Already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Protocol-relative
  if (url.startsWith('//')) {
    return `https:${url}`
  }

  // Relative URL
  try {
    const base = new URL(baseUrl)
    return new URL(url, base).toString()
  } catch {
    return url
  }
}

/**
 * Extract theme colors from metadata
 */
function extractColors(data: any): string[] {
  const html = data.html || ''
  const colors: string[] = []

  // Meta theme-color
  const themeColorMatch = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i)
  if (themeColorMatch && themeColorMatch[1]) {
    colors.push(themeColorMatch[1])
  }

  // Common hex codes in style tags (very basic heuristic)
  const styleMatch = html.match(/color:\s*(#[0-9a-f]{6})/gi)
  if (styleMatch) {
    styleMatch.slice(0, 3).forEach((match: string) => {
      const color = match.split(':')[1].trim()
      if (!colors.includes(color)) colors.push(color)
    })
  }

  return colors
}

/**
 * Extract font constants from style tags
 */
function extractFonts(data: any): string[] {
  const html = data.html || ''
  const fonts: string[] = []

  // Look for font-family definitions
  const fontMatches = html.match(/font-family:\s*([^;\}]+)/gi)
  if (fontMatches) {
    fontMatches.slice(0, 3).forEach((match: string) => {
      // Clean up the font string
      const font = match.split(':')[1].trim().replace(/['"]/g, '')
      if (!fonts.includes(font) && font.length < 50) { // Sanity check length
        fonts.push(font)
      }
    })
  }

  return fonts
}

