/**
 * Microsite Generator
 * Generates beautiful 3D glass morphism microsites for partners
 * with lead capture forms for customer check-in at front desk
 */

import { fetchPartnerBranding, type FireCrawlResult } from '../firecrawl/client'
import { generateQRCode } from '../qrcode/generator'

export interface MicrositeConfig {
  partnerId: string
  partnerName: string
  websiteUrl?: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  type: 'standalone' | 'integrated' | 'checkin'
  subdomain?: string
  customDomain?: string
  businessType?: string
  contactEmail?: string
  contactPhone?: string
}

export interface GeneratedMicrosite {
  html: string
  qrCodeDataUrl: string
  branding: FireCrawlResult & { extractedColors?: string[] }
  url: string
}

/**
 * Extract dominant colors from branding for theme generation
 */
function extractColorsFromBranding(primaryColor: string): { primary: string; secondary: string; accent: string; gradient: string } {
  // Parse hex color to RGB
  const hex = primaryColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Generate complementary colors
  const lighten = (value: number, amount: number) => Math.min(255, Math.round(value + (255 - value) * amount))
  const darken = (value: number, amount: number) => Math.round(value * (1 - amount))

  const lightR = lighten(r, 0.3)
  const lightG = lighten(g, 0.3)
  const lightB = lighten(b, 0.3)

  const darkR = darken(r, 0.2)
  const darkG = darken(g, 0.2)
  const darkB = darken(b, 0.2)

  return {
    primary: primaryColor,
    secondary: `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`,
    accent: `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`,
    gradient: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}05 50%, #ffffff 100%)`
  }
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
    : `https://dailyeventinsurance.com/${config.subdomain || config.partnerId}`

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
 * Generate check-in microsite for front desk customer capture
 */
export async function generateCheckinMicrosite(
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
    : `https://dailyeventinsurance.com/${config.subdomain || config.partnerId}`

  // Generate QR code
  const qrCodeDataUrl = await generateQRCode(micrositeUrl, {
    width: 200,
    color: {
      dark: config.primaryColor || '#14B8A6',
      light: '#FFFFFF'
    }
  })

  // Generate HTML with glass morphism check-in form
  const html = generateCheckinHTML({
    partnerId: config.partnerId,
    partnerName: config.partnerName,
    logoUrl,
    primaryColor: config.primaryColor || '#14B8A6',
    businessType: config.businessType || 'fitness',
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
 * Generate standalone microsite HTML with 3D glass morphism design
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
  const colors = extractColorsFromBranding(primaryColor)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Insurance - ${partnerName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      background: ${colors.gradient};
      background-attachment: fixed;
      color: #1a1a2e;
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Animated background orbs */
    .bg-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 20s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
    }
    .bg-orb-1 { width: 600px; height: 600px; background: ${primaryColor}40; top: -200px; right: -200px; animation-delay: 0s; }
    .bg-orb-2 { width: 400px; height: 400px; background: ${colors.secondary}60; bottom: -100px; left: -100px; animation-delay: -7s; }
    .bg-orb-3 { width: 300px; height: 300px; background: ${colors.accent}30; top: 50%; left: 50%; animation-delay: -14s; }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
      z-index: 1;
    }

    /* Glass card styling */
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glass-card:hover {
      transform: translateY(-4px);
      box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.8),
        0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    header {
      padding: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .logo-container {
      width: 140px;
      height: 140px;
      margin: 0 auto 1.5rem;
      background: white;
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.1),
        inset 0 -2px 0 rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .logo {
      max-width: 100px;
      max-height: 100px;
      object-fit: contain;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${colors.accent} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #64748b;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .hero {
      padding: 4rem;
      margin-bottom: 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, ${primaryColor}10 0%, transparent 100%);
      border-radius: 24px;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.25rem;
      color: #475569;
      max-width: 500px;
      margin: 0 auto 2rem;
    }

    .price-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${colors.accent} 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 100px;
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 20px ${primaryColor}40;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${colors.accent} 100%);
      color: white;
      padding: 1.25rem 2.5rem;
      border-radius: 16px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      box-shadow:
        0 8px 30px ${primaryColor}40,
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow:
        0 12px 40px ${primaryColor}50,
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .cta-button svg {
      width: 20px;
      height: 20px;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .feature-card {
      padding: 2rem;
      text-align: center;
    }

    .feature-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.25rem;
      background: linear-gradient(135deg, ${primaryColor}20 0%, ${colors.secondary}30 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .feature-icon svg {
      width: 32px;
      height: 32px;
      color: ${primaryColor};
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #64748b;
      font-size: 0.95rem;
    }

    .qr-section {
      padding: 3rem;
      text-align: center;
      background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
    }

    .qr-code-wrapper {
      width: 220px;
      height: 220px;
      margin: 1.5rem auto;
      padding: 16px;
      background: white;
      border-radius: 20px;
      box-shadow:
        0 10px 40px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .qr-code {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .qr-section h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .qr-section p {
      color: #64748b;
    }

    footer {
      text-align: center;
      padding: 2rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    footer a {
      color: ${primaryColor};
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  <div class="bg-orb bg-orb-3"></div>

  <div class="container">
    <header class="glass-card">
      <div class="logo-container">
        <img src="${logoUrl}" alt="${partnerName} Logo" class="logo" />
      </div>
      <h1>${partnerName}</h1>
      <p class="subtitle">Partnered with Daily Event Insurance</p>
    </header>

    <div class="hero glass-card">
      <div class="hero-content">
        <h2>Protect Your Activity Today</h2>
        <p>Get instant event liability coverage for your next adventure</p>
        <div class="price-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Starting at just $4.99
        </div>
        <br/>
        <a href="${micrositeUrl}/quote" class="cta-button">
          Get Covered Now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>

    <div class="features">
      <div class="feature-card glass-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
        </div>
        <h3>Instant Coverage</h3>
        <p>Get your policy in under 2 minutes. Coverage starts immediately.</p>
      </div>

      <div class="feature-card glass-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <h3>Full Protection</h3>
        <p>Comprehensive accident and medical coverage for accidents and injuries.</p>
      </div>

      <div class="feature-card glass-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <path d="M8 21h8M12 17v4"></path>
          </svg>
        </div>
        <h3>Easy Claims</h3>
        <p>Simple online claims process if you ever need it.</p>
      </div>
    </div>

    <div class="qr-section glass-card">
      <h3>Scan to Get Started</h3>
      <div class="qr-code-wrapper">
        <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
      </div>
      <p>Scan this QR code with your phone to get instant coverage</p>
    </div>

    <footer>
      <p>Powered by <a href="https://dailyeventinsurance.com">Daily Event Insurance</a></p>
    </footer>
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

/**
 * Generate check-in form HTML with glass morphism design
 * This is what customers see at the front desk to get insurance
 */
function generateCheckinHTML(config: {
  partnerId: string
  partnerName: string
  logoUrl: string
  primaryColor: string
  businessType: string
  branding: FireCrawlResult
  qrCodeDataUrl: string
  micrositeUrl: string
}): string {
  const { partnerId, partnerName, logoUrl, primaryColor, businessType, qrCodeDataUrl, micrositeUrl } = config
  const colors = extractColorsFromBranding(primaryColor)

  // Business-specific copy
  const businessCopy: Record<string, { headline: string; subtitle: string; activity: string }> = {
    gym: { headline: 'Protect Your Workout', subtitle: 'Get accident and medical coverage for your gym session today', activity: 'workout' },
    climbing: { headline: 'Climb With Confidence', subtitle: 'Instant accident and medical coverage for your climbing session', activity: 'climb' },
    yoga: { headline: 'Practice Peace of Mind', subtitle: 'Accident and medical protection for your yoga session', activity: 'practice' },
    rental: { headline: 'Rent With Protection', subtitle: 'Coverage for your equipment rental today', activity: 'rental' },
    fitness: { headline: 'Train With Confidence', subtitle: 'Same-day accident and medical coverage for your activity', activity: 'session' },
    other: { headline: 'Get Protected Today', subtitle: 'Instant event accident and medical coverage', activity: 'activity' }
  }

  const copy = businessCopy[businessType] || businessCopy.other

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Check-In - ${partnerName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, ${primaryColor}15 0%, ${colors.secondary}10 50%, #f8fafc 100%);
      color: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    /* Animated orbs */
    .orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.3; animation: pulse 8s ease-in-out infinite; pointer-events: none; }
    .orb-1 { width: 500px; height: 500px; background: ${primaryColor}; top: -150px; right: -150px; }
    .orb-2 { width: 400px; height: 400px; background: ${colors.secondary}; bottom: -100px; left: -100px; animation-delay: -4s; }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.4; }
    }

    .container {
      max-width: 480px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 32px;
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      overflow: hidden;
    }

    .header {
      text-align: center;
      padding: 2.5rem 2rem 2rem;
      background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%);
    }

    .logo-wrapper {
      width: 100px;
      height: 100px;
      margin: 0 auto 1.5rem;
      background: white;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .logo { max-width: 70px; max-height: 70px; object-fit: contain; }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(135deg, ${primaryColor}, ${colors.accent});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .subtitle { color: #64748b; font-size: 1rem; }

    .price-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, ${primaryColor}, ${colors.accent});
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 100px;
      font-weight: 600;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    .form-section {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    input, select {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.2s ease;
      background: rgba(255,255,255,0.8);
    }

    input:focus, select:focus {
      outline: none;
      border-color: ${primaryColor};
      box-shadow: 0 0 0 4px ${primaryColor}20;
    }

    input::placeholder { color: #94a3b8; }

    .row { display: flex; gap: 1rem; }
    .row > * { flex: 1; }

    .submit-btn {
      width: 100%;
      padding: 1.25rem;
      background: linear-gradient(135deg, ${primaryColor}, ${colors.accent});
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px ${primaryColor}40;
      margin-top: 0.5rem;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px ${primaryColor}50;
    }

    .submit-btn:active { transform: translateY(0); }

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .qr-section {
      text-align: center;
      padding: 0 2rem 2rem;
    }

    .qr-wrapper {
      display: inline-block;
      background: white;
      padding: 12px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .qr-code { width: 120px; height: 120px; }

    .qr-text { color: #64748b; font-size: 0.875rem; margin-top: 0.75rem; }

    .footer {
      text-align: center;
      padding: 1.5rem;
      background: rgba(0,0,0,0.02);
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    .footer p { color: #94a3b8; font-size: 0.75rem; }
    .footer a { color: ${primaryColor}; text-decoration: none; }

    .success-message {
      display: none;
      text-align: center;
      padding: 3rem 2rem;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-icon svg { width: 40px; height: 40px; color: white; }
    .success-message h2 { color: #10b981; margin-bottom: 0.5rem; }
    .success-message p { color: #64748b; }
  </style>
</head>
<body>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>

  <div class="container">
    <div class="glass-card">
      <div id="form-view">
        <div class="header">
          <div class="logo-wrapper">
            <img src="${logoUrl}" alt="${partnerName}" class="logo" />
          </div>
          <h1>${copy.headline}</h1>
          <p class="subtitle">${copy.subtitle}</p>
          <div class="price-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Starting at $4.99
          </div>
        </div>

        <form id="checkin-form" class="form-section">
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your full name" required />
          </div>

          <div class="row">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@email.com" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" />
            </div>
          </div>

          <div class="form-group">
            <label for="activity">Activity Type</label>
            <select id="activity" name="activity">
              <option value="day-pass">Day Pass / Single Visit</option>
              <option value="class">Class or Session</option>
              <option value="rental">Equipment Rental</option>
              <option value="event">Private Event</option>
              <option value="other">Other Activity</option>
            </select>
          </div>

          <button type="submit" class="submit-btn">Get My Coverage →</button>
        </form>

        <div class="divider">or scan QR code</div>

        <div class="qr-section">
          <div class="qr-wrapper">
            <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code" />
          </div>
          <p class="qr-text">Scan with your phone to continue on mobile</p>
        </div>

        <div class="footer">
          <p>Powered by <a href="https://dailyeventinsurance.com">Daily Event Insurance</a></p>
        </div>
      </div>

      <div id="success-view" class="success-message">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </div>
        <h2>You're All Set!</h2>
        <p>Check your email for your coverage details.</p>
        <p style="margin-top: 1rem; font-size: 0.875rem;">Enjoy your ${copy.activity}!</p>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('checkin-form').addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = {
        partnerId: '${partnerId}',
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        activity: document.getElementById('activity').value,
        source: 'checkin-kiosk',
        micrositeUrl: '${micrositeUrl}'
      };

      try {
        const response = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          document.getElementById('form-view').style.display = 'none';
          document.getElementById('success-view').style.display = 'block';

          // Redirect to quote page after 2 seconds
          setTimeout(() => {
            window.location.href = result.data.redirectUrl || '${micrositeUrl}/quote?email=' + encodeURIComponent(formData.email);
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // Fallback redirect
        window.location.href = '${micrositeUrl}/quote?email=' + encodeURIComponent(formData.email);
      }
    });
  </script>
</body>
</html>`
}

/**
 * Branding data to save to Supabase for marketing materials
 */
export interface PartnerBranding {
  partnerId: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  gradientCss: string
  logoUrl: string | null
  heroImageUrl: string | null
  galleryImages: string[]
  businessName: string
  tagline?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Extract and prepare branding data for Supabase storage
 */
export function prepareBrandingForStorage(
  partnerId: string,
  businessName: string,
  primaryColor: string,
  branding: FireCrawlResult,
  logoUrl?: string
): PartnerBranding {
  const colors = extractColorsFromBranding(primaryColor)

  return {
    partnerId,
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    gradientCss: colors.gradient,
    logoUrl: branding.logoUrl || logoUrl || null,
    heroImageUrl: branding.images[0] || null,
    galleryImages: branding.images.slice(0, 10),
    businessName,
    tagline: branding.metadata?.description || undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Generate printable QR code flyer for partner front desk
 */
export function generateQRCodeFlyer(config: {
  partnerName: string
  logoUrl: string
  primaryColor: string
  qrCodeDataUrl: string
  micrositeUrl: string
}): string {
  const { partnerName, logoUrl, primaryColor, qrCodeDataUrl, micrositeUrl } = config
  const colors = extractColorsFromBranding(primaryColor)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QR Code Flyer - ${partnerName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    @page { size: letter; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      width: 8.5in;
      height: 11in;
      background: linear-gradient(135deg, ${primaryColor}10 0%, white 50%, ${colors.secondary}10 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1in;
    }
    .logo-container {
      margin-bottom: 1.5rem;
    }
    .logo { max-height: 100px; max-width: 250px; }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.75rem;
      text-align: center;
    }
    .highlight {
      background: linear-gradient(135deg, ${primaryColor}, ${colors.accent});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle {
      font-size: 1.25rem;
      color: #64748b;
      margin-bottom: 2rem;
      text-align: center;
    }
    .qr-container {
      background: white;
      padding: 2rem;
      border-radius: 32px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .qr-code { width: 300px; height: 300px; }
    .instructions {
      text-align: center;
      max-width: 400px;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      text-align: left;
    }
    .step-number {
      width: 40px;
      height: 40px;
      background: ${primaryColor};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }
    .step-text { color: #374151; font-size: 1.1rem; }
    .price-banner {
      background: linear-gradient(135deg, ${primaryColor}, ${colors.accent});
      color: white;
      padding: 1rem 2rem;
      border-radius: 100px;
      font-weight: 700;
      font-size: 1.5rem;
      margin-top: 1.5rem;
    }
    .footer {
      position: absolute;
      bottom: 0.75in;
      text-align: center;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    .footer a { color: ${primaryColor}; text-decoration: none; }
    .url { font-family: monospace; color: ${primaryColor}; font-size: 0.9rem; margin-top: 1rem; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .qr-container { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      .price-banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="logo-container">
    <img src="${logoUrl}" alt="${partnerName}" class="logo" />
  </div>

  <h1>Get <span class="highlight">Instant Coverage</span></h1>
  <p class="subtitle">Protect yourself during your activity today</p>

  <div class="qr-container">
    <img src="${qrCodeDataUrl}" alt="Scan for Insurance" class="qr-code" />
  </div>

  <div class="instructions">
    <div class="step">
      <div class="step-number">1</div>
      <span class="step-text">Scan the QR code with your phone</span>
    </div>
    <div class="step">
      <div class="step-number">2</div>
      <span class="step-text">Fill out the quick form (under 2 min)</span>
    </div>
    <div class="step">
      <div class="step-number">3</div>
      <span class="step-text">Get instant proof of coverage</span>
    </div>
  </div>

  <div class="price-banner">Starting at just $4.99</div>

  <p class="url">${micrositeUrl}</p>

  <div class="footer">
    <p>Powered by <a href="https://dailyeventinsurance.com">Daily Event Insurance</a></p>
  </div>
</body>
</html>`
}

