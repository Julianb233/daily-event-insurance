/**
 * FireCrawl Client for Web Scraping
 * Fetches partner logos and website images for microsite generation
 */

export interface FireCrawlResult {
  logoUrl?: string
  images: string[]
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

    const data = await response.json()

    // Extract logo (usually in header/nav or first image)
    const logoUrl = extractLogo(data)
    
    // Extract all images
    const images = extractImages(data)

    return {
      logoUrl,
      images: images.slice(0, 10), // Limit to 10 images
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

