/**
 * Microsite Generator
 * Generates standalone and integrated microsites for partners
 */

import { fetchPartnerBranding, type FireCrawlResult } from '../firecrawl/client'
import { generateQRCode } from '../qrcode/generator'

export interface MicrositeConfig {
  partnerId: string
  partnerName: string
  websiteUrl?: string
  logoUrl?: string
  primaryColor?: string
  type: 'standalone' | 'integrated'
  subdomain?: string
  customDomain?: string
}

export interface GeneratedMicrosite {
  html: string
  qrCodeDataUrl: string
  branding: FireCrawlResult
  url: string
}

/**
 * Generate a standalone microsite
 */
export async function generateStandaloneMicrosite(
  config: MicrositeConfig
): Promise<GeneratedMicrosite> {
  // Fetch branding from partner website if URL provided
  let branding: FireCrawlResult = { images: [] }
  if (config.websiteUrl) {
    branding = await fetchPartnerBranding(config.websiteUrl)
  }

  // Use fetched logo or provided logo
  const logoUrl = branding.logoUrl || config.logoUrl || '/placeholder-logo.png'

  // Generate microsite URL
  const micrositeUrl = config.customDomain 
    ? `https://${config.customDomain}`
    : `https://${config.subdomain || config.partnerId}.dailyeventinsurance.com`

  // Generate QR code
  const qrCodeDataUrl = await generateQRCode(micrositeUrl, {
    width: 200,
    color: {
      dark: config.primaryColor || '#14B8A6',
      light: '#FFFFFF'
    }
  })

  // Generate HTML
  const html = generateStandaloneHTML({
    partnerName: config.partnerName,
    logoUrl,
    primaryColor: config.primaryColor || '#14B8A6',
    branding,
    qrCodeDataUrl,
    micrositeUrl
  })

  return {
    html,
    qrCodeDataUrl,
    branding,
    url: micrositeUrl
  }
}

/**
 * Generate an integrated microsite (widget/embed)
 */
export async function generateIntegratedMicrosite(
  config: MicrositeConfig
): Promise<GeneratedMicrosite> {
  // Fetch branding from partner website if URL provided
  let branding: FireCrawlResult = { images: [] }
  if (config.websiteUrl) {
    branding = await fetchPartnerBranding(config.websiteUrl)
  }

  // Use fetched logo or provided logo
  const logoUrl = branding.logoUrl || config.logoUrl || '/placeholder-logo.png'

  // Generate microsite URL (for widget embedding)
  const micrositeUrl = `https://widget.dailyeventinsurance.com/${config.partnerId}`

  // Generate QR code
  const qrCodeDataUrl = await generateQRCode(micrositeUrl, {
    width: 200,
    color: {
      dark: config.primaryColor || '#14B8A6',
      light: '#FFFFFF'
    }
  })

  // Generate HTML for widget
  const html = generateIntegratedHTML({
    partnerName: config.partnerName,
    logoUrl,
    primaryColor: config.primaryColor || '#14B8A6',
    branding,
    qrCodeDataUrl,
    micrositeUrl
  })

  return {
    html,
    qrCodeDataUrl,
    branding,
    url: micrositeUrl
  }
}

/**
 * Generate standalone microsite HTML
 */
function generateStandaloneHTML(config: {
  partnerName: string
  logoUrl: string
  primaryColor: string
  branding: FireCrawlResult
  qrCodeDataUrl: string
  micrositeUrl: string
}): string {
  const { partnerName, logoUrl, primaryColor, branding, qrCodeDataUrl, micrositeUrl } = config

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Insurance - ${partnerName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%);
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      text-align: center;
    }
    .logo {
      max-width: 200px;
      height: auto;
      margin-bottom: 1rem;
    }
    h1 {
      color: ${primaryColor};
      margin-bottom: 0.5rem;
    }
    .hero {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      background: ${primaryColor};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 1rem;
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .qr-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      margin-top: 2rem;
    }
    .qr-code {
      max-width: 200px;
      margin: 1rem auto;
      display: block;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .gallery img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <img src="${logoUrl}" alt="${partnerName} Logo" class="logo" />
      <h1>${partnerName}</h1>
      <p>Partnered with Daily Event Insurance</p>
    </header>

    <div class="hero">
      <h2>Protect Your Events</h2>
      <p>Get same-day event insurance coverage starting at just $4.99</p>
      <a href="${micrositeUrl}/quote" class="cta-button">Get a Quote</a>
    </div>

    ${branding.images.length > 0 ? `
    <div class="gallery">
      ${branding.images.slice(0, 6).map(img => `<img src="${img}" alt="Gallery image" />`).join('')}
    </div>
    ` : ''}

    <div class="qr-section">
      <h3>Scan to Access</h3>
      <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
      <p>Scan this QR code to access your insurance portal</p>
    </div>
  </div>
</body>
</html>`
}

/**
 * Generate integrated microsite HTML (widget)
 */
function generateIntegratedHTML(config: {
  partnerName: string
  logoUrl: string
  primaryColor: string
  branding: FireCrawlResult
  qrCodeDataUrl: string
  micrositeUrl: string
}): string {
  const { partnerName, logoUrl, primaryColor, qrCodeDataUrl, micrositeUrl } = config

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Insurance Widget - ${partnerName}</title>
  <style>
    .dei-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .dei-widget-header {
      background: ${primaryColor};
      color: white;
      padding: 1.5rem;
      text-align: center;
    }
    .dei-widget-logo {
      max-width: 120px;
      height: auto;
      margin-bottom: 0.5rem;
    }
    .dei-widget-body {
      padding: 1.5rem;
    }
    .dei-widget-button {
      width: 100%;
      background: ${primaryColor};
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 1rem;
    }
    .dei-widget-qr {
      text-align: center;
      margin-top: 1rem;
    }
    .dei-widget-qr img {
      max-width: 150px;
    }
  </style>
</head>
<body>
  <div class="dei-widget">
    <div class="dei-widget-header">
      <img src="${logoUrl}" alt="${partnerName}" class="dei-widget-logo" />
      <h3>Event Insurance</h3>
    </div>
    <div class="dei-widget-body">
      <p>Protect your event with same-day insurance coverage.</p>
      <button class="dei-widget-button" onclick="window.open('${micrositeUrl}', '_blank')">
        Get a Quote
      </button>
      <div class="dei-widget-qr">
        <img src="${qrCodeDataUrl}" alt="QR Code" />
        <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">Scan for mobile access</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

