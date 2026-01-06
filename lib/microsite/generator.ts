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
    : `https://${config.subdomain}.dailyeventinsurance.com`

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
    partnerId: config.partnerId,
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
    : `https://${config.subdomain}.dailyeventinsurance.com`

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
/**
 * Generate standalone microsite HTML - LEAD FORM / CHECK-IN STYLE
 * Replaced landing page design with simple check-in form per user request.
 */
export function generateStandaloneHTML(config: {
  partnerId: string
  partnerName: string
  logoUrl: string
  primaryColor: string
  branding: FireCrawlResult
  qrCodeDataUrl: string
  micrositeUrl: string
}): string {
  const { partnerId, partnerName, logoUrl, primaryColor, branding, micrositeUrl } = config
  const colors = extractColorsFromBranding(primaryColor)
  const ogImage = branding.logoUrl || logoUrl

  // "Check-In" style copy
  const headline = 'Check In & Get Protected'
  const subtitle = `Welcome to ${partnerName}. Please sign in to activate your coverage.`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <title>${partnerName} - Check In</title>
  
  <!-- Open Graph -->
  <meta property="og:title" content="Check In - ${partnerName}" />
  <meta property="og:description" content="Member check-in and coverage activation." />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:type" content="website" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    /* Premium Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

    :root {
      --primary: ${primaryColor};
      --primary-rgb: ${parseInt(primaryColor.slice(1,3), 16)}, ${parseInt(primaryColor.slice(3,5), 16)}, ${parseInt(primaryColor.slice(5,7), 16)};
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      /* Background Image Logic */
      ${config.branding?.images?.[0] ? `
        background-image: url('${config.branding.images[0]}');
      ` : `
        background-color: #f8fafc;
      `}
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
    }

    /* Cinematic Overlay */
    .bg-overlay {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.4));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 0;
    }

    /* Main Container */
    .container {
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 10;
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Glass Card */
    .glass-card {
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 32px;
      box-shadow: 
        0 20px 40px -12px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Header Section */
    .header {
      padding: 2.5rem 2rem 1.5rem;
      text-align: center;
    }

    .logo-wrapper {
      width: 88px;
      height: 88px;
      margin: 0 auto 1.5rem;
      background: white;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
      position: relative;
    }
    
    .logo-wrapper::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 22px;
      border: 1px solid rgba(0,0,0,0.04);
    }

    .logo { 
      max-width: 65%; 
      max-height: 65%; 
      object-fit: contain; 
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1e293b;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    .subtitle {
      color: #64748b;
      font-size: 0.9375rem;
      line-height: 1.5;
      font-weight: 500;
    }

    /* Form Section */
    .form-section {
      padding: 1rem 2rem 2.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
      position: relative;
    }

    label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #64748b;
      margin-bottom: 0.5rem;
      display: block;
      margin-left: 0.25rem;
    }

    input, select {
      width: 100%;
      padding: 1rem 1.25rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 500;
      color: #0f172a;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      appearance: none;
      -webkit-appearance: none;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.15);
      background: white;
      transform: translateY(-1px);
    }
    
    /* Custom Select Arrow */
    .select-wrapper { position: relative; }
    .select-wrapper::after {
      content: '';
      position: absolute;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 6px;
      background: #64748b;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
      pointer-events: none;
    }

    .row { display: flex; gap: 1rem; }
    .row > * { flex: 1; }

    /* Button */
    .submit-btn {
      width: 100%;
      padding: 1.25rem;
      border: none;
      border-radius: 18px;
      font-size: 1.0625rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(145deg, var(--primary), ${colors.accent});
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 20px -5px rgba(var(--primary-rgb), 0.4);
      margin-top: 0.5rem;
      position: relative;
      overflow: hidden;
    }

    .submit-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 15px 30px -8px rgba(var(--primary-rgb), 0.5);
    }
    
    .submit-btn:active {
      transform: translateY(0) scale(0.98);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: wait;
      transform: none;
    }

    /* HoneyPot */
    .website-url-group { display: none; visibility: hidden; }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 1.5rem 2rem 2.5rem;
      background: rgba(255,255,255,0.5);
      border-top: 1px solid rgba(255,255,255,0.5);
    }

    .feature-item { text-align: center; }

    .feature-icon-box {
      width: 44px;
      height: 44px;
      margin: 0 auto 0.75rem;
      border-radius: 12px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .feature-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.25rem;
    }

    .feature-desc {
      font-size: 0.6875rem;
      color: #94a3b8;
      line-height: 1.3;
    }

    /* Success View */
    .success-view {
      display: none;
      padding: 4rem 2rem;
      text-align: center;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .success-icon-lg {
      width: 80px;
      height: 80px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      margin: 0 auto 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 15px 30px -10px rgba(16, 185, 129, 0.4);
    }

    .footer {
      text-align: center;
      padding: 1.5rem;
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
      opacity: 0.8;
    }
    
    .footer a { color: inherit; text-decoration: none; border-bottom: 1px dotted currentColor; }

  </style>
</head>
<body>
  
  <div class="bg-overlay"></div>

  <div class="container">
    <div class="glass-card">
      
      <!-- Form View -->
      <div id="form-view">
        <div class="header">
          ${logoUrl && logoUrl !== '/placeholder-logo.png' 
            ? `<div class="logo-wrapper"><img src="${logoUrl}" alt="${partnerName}" class="logo"></div>`
            : `<div class="logo-wrapper"><img src="/images/logo-color.png" alt="Daily Event Insurance" class="logo"></div>`
          }
          <h1>${headline}</h1>
          <p class="subtitle">${subtitle}</p>
        </div>

        <form id="checkin-form" class="form-section">
          <!-- Honeypot for bots -->
          <div class="website-url-group">
            <label for="website-url">Website</label>
            <input type="text" id="website-url" name="website_url" tabindex="-1" autocomplete="off">
          </div>
          
          <input type="hidden" name="partnerId" value="${partnerId}" />
          <input type="hidden" name="vertical" value="${config.businessType || 'fitness'}" />
          <input type="hidden" name="source" value="microsite-kiosk" />

          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Jane Doe" required autocomplete="name" />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="jane@example.com" required autocomplete="email" />
          </div>

          <div class="form-group">
            <label for="activity">Activity Type</label>
            <div class="select-wrapper">
              <select id="activity" name="activity">
                <option value="day-pass">Day Pass / Single Visit</option>
                <option value="class">Class / Group Session</option>
                <option value="rental">Equipment Rental</option>
                <option value="event">Private Event Guest</option>
                <option value="other">Other Activity</option>
              </select>
            </div>
          </div>

          <button type="submit" class="submit-btn" id="submit-btn">
            Activate Coverage
          </button>
        </form>

        <!-- Features Grid -->
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <div class="feature-title">Instant</div>
            <div class="feature-desc">Active immediately</div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon-box">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div class="feature-title">Protected</div>
            <div class="feature-desc">Med Included</div>
          </div>

          <div class="feature-item">
            <div class="feature-icon-box">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <path d="M8 21h8M12 17v4"></path>
              </svg>
            </div>
            <div class="feature-title">Simple</div>
            <div class="feature-desc">No paperwork</div>
          </div>
        </div>
      </div>

      <!-- Success View -->
      <div id="success-view" class="success-view">
        <div class="success-icon-lg">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </div>
        <h2 style="font-size: 1.5rem; color: #1e293b; margin-bottom: 0.5rem;">You're Checked In!</h2>
        <p style="color: #64748b;">Your insurance coverage is now active.</p>
        <div style="margin-top: 2rem; padding: 1rem; background: #f1f5f9; border-radius: 12px; font-size: 0.875rem; color: #475569;">
          Have a great session! This screen will refresh automatically.
        </div>
      </div>

    </div>
    
    <div class="footer">
      Secured by Daily Event Insurance • <a href="https://dailyeventinsurance.com/privacy" target="_blank">Privacy</a>
    </div>
  </div>

  <script>
    document.getElementById('checkin-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Honeypot check
      const honey = document.getElementById('website-url').value;
      if (honey) {
        console.warn('Bot detected');
        return; // Silent fail for bots
      }

      const btn = document.getElementById('submit-btn');
      const originalText = btn.textContent;
      
      // Loading State
      btn.innerHTML = '<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px; vertical-align: middle;"></span> Processing...';
      btn.disabled = true;

      // Add rotation animation style if not present
      if (!document.getElementById('spin-anim')) {
        const style = document.createElement('style');
        style.id = 'spin-anim';
        style.innerHTML = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }

      const formData = {
        partnerId: '${partnerId}',
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
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
          // Success Transition
          const formView = document.getElementById('form-view');
          formView.style.opacity = '0';
          formView.style.transform = 'translateY(-10px)';
          formView.style.transition = 'all 0.3s ease';
          
          setTimeout(() => {
            formView.style.display = 'none';
            const successView = document.getElementById('success-view');
            successView.style.display = 'block';
          }, 300);
          
          // Reset after delay
          setTimeout(() => {
             window.location.reload();
          }, 4000); // 4 seconds to read success message
        } else {
          throw new Error('Check-in failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an issue checking in. Please try again.');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  </script>
</body>
</html>`
}

/**
 * Generate integrated microsite HTML (widget)
 */
export function generateIntegratedHTML(config: {
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
  const { partnerId, partnerName, logoUrl, primaryColor, businessType, branding, micrositeUrl } = config
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
      padding: 3rem 2rem 2rem;
      position: relative;
      /* If a hero image exists, we can use it as a background with overlay */
      ${config.branding?.images?.[0] ? `
        background-image: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8)), url('${config.branding.images[0]}');
        background-size: cover;
        background-position: center;
      ` : `
        background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%);
      `}
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
      position: relative;
      z-index: 10;
    }

    .logo { max-width: 70px; max-height: 70px; object-fit: contain; }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
      position: relative;
      z-index: 10;
    }

    .subtitle { color: #64748b; font-size: 1rem; position: relative; z-index: 10; }

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
        </div>

        <form id="checkin-form" class="form-section">
          <input type="hidden" name="partnerId" value="${partnerId}" />
          <input type="hidden" name="vertical" value="${businessType}" />
          <input type="hidden" name="source" value="microsite-form" />
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

          <button type="submit" class="submit-btn" id="submit-btn">Activate Coverage →</button>
        </form>

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
<script>
  document.getElementById('referral-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      partnerId: form.partnerId.value,
      vertical: form.vertical.value,
      source: form.source.value,
      email: form.email.value,
      contactName: form.contactName.value,
      phone: form.phone.value || null,
    };
    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (result.success) {
        alert('Thank you! Your referral has been recorded.');
        form.reset();
      } else {
        alert('Submission failed: ' + (result.message || 'unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting the referral.');
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

  <div class="price-banner">Included with Membership</div>

  <p class="url">${micrositeUrl}</p>

  <div class="footer">
    <p>Powered by <a href="https://dailyeventinsurance.com">Daily Event Insurance</a></p>
  </div>
</body>
</html>`
}

