/**
 * PDF Generation Script for Daily Event Insurance Partner Resources
 *
 * Generates professional PDF documents for partner marketing, training, and documentation.
 * Uses pdf-lib for PDF generation with Daily Event Insurance branding.
 *
 * Run with: npx tsx scripts/generate-pdfs.ts
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib'
import * as fs from 'fs'
import * as path from 'path'

// Brand Colors
const COLORS = {
  primary: rgb(0.078, 0.722, 0.651),      // Teal #14B8A6
  primaryDark: rgb(0.059, 0.549, 0.494),  // Darker teal
  secondary: rgb(0.098, 0.098, 0.098),    // Near black
  text: rgb(0.2, 0.2, 0.2),               // Dark gray
  lightText: rgb(0.4, 0.4, 0.4),          // Medium gray
  white: rgb(1, 1, 1),
  lightBg: rgb(0.97, 0.97, 0.97),         // Light gray background
  tableBorder: rgb(0.85, 0.85, 0.85),
  success: rgb(0.133, 0.545, 0.133),      // Green
  warning: rgb(0.855, 0.647, 0.125),      // Gold
}

// Page dimensions
const PAGE_WIDTH = 612
const PAGE_HEIGHT = 792
const MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2)

interface PDFGenerator {
  doc: PDFDocument
  page: PDFPage
  font: PDFFont
  boldFont: PDFFont
  y: number
}

async function createPDFGenerator(): Promise<PDFGenerator> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  return { doc, page, font, boldFont, y: PAGE_HEIGHT - MARGIN }
}

function drawHeader(gen: PDFGenerator, title: string, subtitle?: string): void {
  const { page, boldFont, font } = gen

  // Header background
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 100,
    width: PAGE_WIDTH,
    height: 100,
    color: COLORS.primary,
  })

  // Company name
  page.drawText('Daily Event Insurance', {
    x: MARGIN,
    y: PAGE_HEIGHT - 45,
    size: 14,
    font: boldFont,
    color: COLORS.white,
  })

  // Document title
  page.drawText(title, {
    x: MARGIN,
    y: PAGE_HEIGHT - 75,
    size: 24,
    font: boldFont,
    color: COLORS.white,
  })

  if (subtitle) {
    page.drawText(subtitle, {
      x: MARGIN,
      y: PAGE_HEIGHT - 95,
      size: 10,
      font: font,
      color: rgb(0.9, 0.9, 0.9),
    })
  }

  gen.y = PAGE_HEIGHT - 130
}

function drawFooter(gen: PDFGenerator, pageNum: number): void {
  const { page, font } = gen

  // Footer line
  page.drawLine({
    start: { x: MARGIN, y: 40 },
    end: { x: PAGE_WIDTH - MARGIN, y: 40 },
    thickness: 0.5,
    color: COLORS.tableBorder,
  })

  // Footer text
  page.drawText('Daily Event Insurance | www.dailyeventinsurance.com | support@dailyeventinsurance.com', {
    x: MARGIN,
    y: 25,
    size: 8,
    font: font,
    color: COLORS.lightText,
  })

  page.drawText(`Page ${pageNum}`, {
    x: PAGE_WIDTH - MARGIN - 40,
    y: 25,
    size: 8,
    font: font,
    color: COLORS.lightText,
  })
}

function drawSectionTitle(gen: PDFGenerator, title: string): void {
  const { page, boldFont } = gen

  gen.y -= 10
  page.drawText(title, {
    x: MARGIN,
    y: gen.y,
    size: 16,
    font: boldFont,
    color: COLORS.primary,
  })
  gen.y -= 25
}

function drawSubsectionTitle(gen: PDFGenerator, title: string): void {
  const { page, boldFont } = gen

  gen.y -= 5
  page.drawText(title, {
    x: MARGIN,
    y: gen.y,
    size: 12,
    font: boldFont,
    color: COLORS.secondary,
  })
  gen.y -= 18
}

function drawParagraph(gen: PDFGenerator, text: string, indent: number = 0): void {
  const { page, font } = gen
  const maxWidth = CONTENT_WIDTH - indent
  const words = text.split(' ')
  let line = ''
  const fontSize = 10
  const lineHeight = 14

  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word
    const width = font.widthOfTextAtSize(testLine, fontSize)

    if (width > maxWidth && line) {
      page.drawText(line, {
        x: MARGIN + indent,
        y: gen.y,
        size: fontSize,
        font: font,
        color: COLORS.text,
      })
      gen.y -= lineHeight
      line = word
    } else {
      line = testLine
    }
  }

  if (line) {
    page.drawText(line, {
      x: MARGIN + indent,
      y: gen.y,
      size: fontSize,
      font: font,
      color: COLORS.text,
    })
    gen.y -= lineHeight
  }

  gen.y -= 5
}

function drawBulletPoint(gen: PDFGenerator, text: string): void {
  const { page, font } = gen

  page.drawText('\u2022', {
    x: MARGIN + 10,
    y: gen.y,
    size: 10,
    font: font,
    color: COLORS.primary,
  })

  drawParagraph(gen, text, 25)
}

function drawTable(gen: PDFGenerator, headers: string[], rows: string[][], colWidths: number[]): void {
  const { page, font, boldFont } = gen
  const rowHeight = 25
  const cellPadding = 8
  const fontSize = 9

  let x = MARGIN

  // Header row
  page.drawRectangle({
    x: MARGIN,
    y: gen.y - rowHeight + 5,
    width: CONTENT_WIDTH,
    height: rowHeight,
    color: COLORS.primary,
  })

  for (let i = 0; i < headers.length; i++) {
    page.drawText(headers[i], {
      x: x + cellPadding,
      y: gen.y - 12,
      size: fontSize,
      font: boldFont,
      color: COLORS.white,
    })
    x += colWidths[i]
  }
  gen.y -= rowHeight

  // Data rows
  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx]
    x = MARGIN

    // Alternating row background
    if (rowIdx % 2 === 0) {
      page.drawRectangle({
        x: MARGIN,
        y: gen.y - rowHeight + 5,
        width: CONTENT_WIDTH,
        height: rowHeight,
        color: COLORS.lightBg,
      })
    }

    // Row border
    page.drawLine({
      start: { x: MARGIN, y: gen.y - rowHeight + 5 },
      end: { x: PAGE_WIDTH - MARGIN, y: gen.y - rowHeight + 5 },
      thickness: 0.5,
      color: COLORS.tableBorder,
    })

    for (let i = 0; i < row.length; i++) {
      page.drawText(row[i], {
        x: x + cellPadding,
        y: gen.y - 12,
        size: fontSize,
        font: font,
        color: COLORS.text,
      })
      x += colWidths[i]
    }
    gen.y -= rowHeight
  }

  gen.y -= 10
}

function drawHighlightBox(gen: PDFGenerator, title: string, content: string): void {
  const { page, font, boldFont } = gen
  const boxHeight = 60

  page.drawRectangle({
    x: MARGIN,
    y: gen.y - boxHeight,
    width: CONTENT_WIDTH,
    height: boxHeight,
    color: rgb(0.9, 0.97, 0.96), // Light teal background
    borderColor: COLORS.primary,
    borderWidth: 1,
  })

  page.drawText(title, {
    x: MARGIN + 15,
    y: gen.y - 20,
    size: 12,
    font: boldFont,
    color: COLORS.primary,
  })

  page.drawText(content, {
    x: MARGIN + 15,
    y: gen.y - 40,
    size: 10,
    font: font,
    color: COLORS.text,
  })

  gen.y -= boxHeight + 15
}

function addNewPage(gen: PDFGenerator, pageNum: number): void {
  drawFooter(gen, pageNum - 1)
  gen.page = gen.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  gen.y = PAGE_HEIGHT - MARGIN
}

// ============================================================================
// PDF GENERATORS
// ============================================================================

async function generateEmailTemplates(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Email Templates Collection', 'Pre-written templates for customer outreach')

  drawSectionTitle(gen, 'Welcome Email Template')
  drawParagraph(gen, 'Subject: Welcome to [Your Business] - Your Event Insurance is Ready!')
  gen.y -= 10
  drawParagraph(gen, 'Dear [Customer Name],')
  gen.y -= 5
  drawParagraph(gen, 'Thank you for choosing [Your Business]! We\'re excited to have you join us for [event/activity]. Your booking is confirmed for [date/time].')
  drawParagraph(gen, 'Great news - your event comes with optional daily event insurance coverage for just $40. This covers:')
  drawBulletPoint(gen, 'Up to $1,000,000 in liability protection')
  drawBulletPoint(gen, 'Equipment damage coverage up to $10,000')
  drawBulletPoint(gen, 'Event cancellation protection')
  drawParagraph(gen, 'Click here to add coverage to your booking: [Insurance Link]')
  gen.y -= 10

  drawSectionTitle(gen, 'Coverage Reminder Email')
  drawParagraph(gen, 'Subject: Don\'t Forget Your Event Protection - Just $40!')
  gen.y -= 10
  drawParagraph(gen, 'Hi [Customer Name],')
  drawParagraph(gen, 'Your [event type] at [venue] is coming up on [date]! We noticed you haven\'t added event insurance yet.')
  drawParagraph(gen, 'For just $40, you get peace of mind knowing you\'re covered for:')
  drawBulletPoint(gen, 'Accidents and injuries during your event')
  drawBulletPoint(gen, 'Damage to rented equipment')
  drawBulletPoint(gen, 'Unexpected cancellations')
  drawParagraph(gen, '65% of our customers choose to add this protection. Add coverage now: [Link]')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Post-Event Follow-Up')
  drawParagraph(gen, 'Subject: Thanks for Choosing Protection - Here\'s What You\'re Covered For')
  gen.y -= 10
  drawParagraph(gen, 'Hi [Customer Name],')
  drawParagraph(gen, 'We hope your [event] went perfectly! As a reminder, your Daily Event Insurance coverage is active for 30 days from your event date.')
  drawParagraph(gen, 'If you need to file a claim, visit: claims.dailyeventinsurance.com')
  drawParagraph(gen, 'Keep your confirmation number handy: [Policy Number]')
  gen.y -= 10

  drawSectionTitle(gen, 'Renewal/Repeat Customer Email')
  drawParagraph(gen, 'Subject: Your Preferred Customer Discount Awaits!')
  gen.y -= 10
  drawParagraph(gen, 'Hi [Customer Name],')
  drawParagraph(gen, 'Welcome back! Since you\'ve protected your events with us before, you qualify for our preferred customer benefits.')
  drawParagraph(gen, 'Book your next event with insurance and enjoy:')
  drawBulletPoint(gen, 'Priority claims processing')
  drawBulletPoint(gen, 'Dedicated support line')
  drawBulletPoint(gen, 'Extended coverage options')

  drawHighlightBox(gen, 'Pro Tip', 'Personalize these templates with your business name and specific event details for best results.')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generatePromotionalFlyers(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Promotional Flyer Templates', 'Print-ready designs for marketing')

  drawSectionTitle(gen, 'Flyer Template 1: General Event Insurance')

  drawHighlightBox(gen, 'PROTECT YOUR EVENT', 'Daily event insurance starting at just $40')

  drawParagraph(gen, 'Key Messages for Your Flyer:')
  drawBulletPoint(gen, 'HEADLINE: "Don\'t Let the Unexpected Ruin Your Day"')
  drawBulletPoint(gen, 'SUBHEAD: "Comprehensive event protection for just $40"')
  drawBulletPoint(gen, 'CALL TO ACTION: "Scan QR code or visit [your-link]"')

  gen.y -= 10
  drawSubsectionTitle(gen, 'Coverage Highlights to Include:')

  drawTable(gen,
    ['Coverage Type', 'Amount', 'What It Covers'],
    [
      ['Liability', '$1,000,000', 'Injuries, property damage, legal fees'],
      ['Equipment', '$10,000', 'Rented or borrowed equipment'],
      ['Cancellation', '$5,000', 'Weather, illness, venue issues'],
    ],
    [150, 100, 262]
  )

  drawSectionTitle(gen, 'Flyer Template 2: Gym/Fitness Focus')
  drawParagraph(gen, 'Headline Options:')
  drawBulletPoint(gen, '"Train Hard. Stay Protected."')
  drawBulletPoint(gen, '"Your Workout. Our Coverage."')
  drawBulletPoint(gen, '"Focus on Fitness. We\'ve Got the Rest."')

  gen.y -= 10
  drawParagraph(gen, 'Body Copy:')
  drawParagraph(gen, 'Whether you\'re hitting the weights, trying a new class, or training for competition, our daily event insurance has you covered. For just $40, protect yourself and your equipment during every session.')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Flyer Template 3: Rental Business')
  drawParagraph(gen, 'Headline Options:')
  drawBulletPoint(gen, '"Rent with Confidence"')
  drawBulletPoint(gen, '"Your Adventure. Zero Worries."')
  drawBulletPoint(gen, '"Equipment + Protection = Perfect Day"')

  gen.y -= 10
  drawParagraph(gen, 'Suggested Layout:')
  drawBulletPoint(gen, 'Top 1/3: Eye-catching headline with your logo')
  drawBulletPoint(gen, 'Middle 1/3: Coverage benefits with icons')
  drawBulletPoint(gen, 'Bottom 1/3: QR code, website, and contact info')

  gen.y -= 10
  drawSubsectionTitle(gen, 'Design Specifications:')
  drawTable(gen,
    ['Element', 'Specification'],
    [
      ['Primary Color', '#14B8A6 (Teal)'],
      ['Secondary Color', '#1E293B (Dark Slate)'],
      ['Font', 'Sans-serif (recommended)'],
      ['Print Size', '8.5" x 11" or 5.5" x 8.5"'],
      ['Resolution', 'Minimum 300 DPI'],
    ],
    [200, 312]
  )

  drawHighlightBox(gen, 'Need Custom Designs?', 'Contact partners@dailyeventinsurance.com for co-branded flyer templates with your logo.')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateCoBrandingGuidelines(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Co-Branding Guidelines', 'Brand usage standards for partners')

  drawSectionTitle(gen, 'Brand Overview')
  drawParagraph(gen, 'Daily Event Insurance is committed to maintaining a consistent, professional brand image across all partner communications. These guidelines ensure our brand is represented correctly while allowing flexibility for co-branded materials.')

  gen.y -= 5
  drawSubsectionTitle(gen, 'Our Brand Colors')
  drawTable(gen,
    ['Color', 'Hex Code', 'RGB', 'Usage'],
    [
      ['Primary Teal', '#14B8A6', '20, 184, 166', 'Headers, CTAs, accents'],
      ['Dark Slate', '#1E293B', '30, 41, 59', 'Text, backgrounds'],
      ['Light Gray', '#F8FAFC', '248, 250, 252', 'Backgrounds'],
      ['White', '#FFFFFF', '255, 255, 255', 'Contrast areas'],
    ],
    [120, 80, 100, 212]
  )

  drawSectionTitle(gen, 'Logo Usage Guidelines')

  drawSubsectionTitle(gen, 'Do\'s:')
  drawBulletPoint(gen, 'Use the logo with adequate clear space (minimum 20px on all sides)')
  drawBulletPoint(gen, 'Maintain original aspect ratio when resizing')
  drawBulletPoint(gen, 'Use approved color variations (full color, white, or black)')
  drawBulletPoint(gen, 'Place logo on contrasting backgrounds for visibility')

  drawSubsectionTitle(gen, 'Don\'ts:')
  drawBulletPoint(gen, 'Do not stretch, compress, or distort the logo')
  drawBulletPoint(gen, 'Do not change the logo colors')
  drawBulletPoint(gen, 'Do not add effects (shadows, gradients, outlines)')
  drawBulletPoint(gen, 'Do not place logo on busy or low-contrast backgrounds')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Co-Branding Layouts')

  drawSubsectionTitle(gen, 'Option 1: Side-by-Side')
  drawParagraph(gen, 'Your logo and Daily Event Insurance logo appear side by side, separated by a vertical line. Both logos should be similar in visual weight.')

  drawSubsectionTitle(gen, 'Option 2: Stacked')
  drawParagraph(gen, 'Your logo appears above "Powered by Daily Event Insurance" text. Use this when horizontal space is limited.')

  drawSubsectionTitle(gen, 'Option 3: Footer Attribution')
  drawParagraph(gen, 'Your primary branding, with "Insurance provided by Daily Event Insurance" in the footer. Ideal for heavily branded partner materials.')

  gen.y -= 10
  drawSectionTitle(gen, 'Typography')
  drawParagraph(gen, 'For co-branded materials, we recommend:')
  drawBulletPoint(gen, 'Headlines: Inter Bold or similar sans-serif')
  drawBulletPoint(gen, 'Body text: Inter Regular at 14-16px')
  drawBulletPoint(gen, 'Minimum body text size: 12px for print, 14px for digital')

  drawHighlightBox(gen, 'Brand Assets Available', 'Download logo files, templates, and graphics from your partner dashboard at partners.dailyeventinsurance.com')

  drawSectionTitle(gen, 'Approved Messaging')
  drawParagraph(gen, 'When describing Daily Event Insurance, use approved phrases:')
  drawBulletPoint(gen, '"Comprehensive daily event coverage"')
  drawBulletPoint(gen, '"Affordable protection starting at $40"')
  drawBulletPoint(gen, '"Trusted by thousands of event organizers"')
  drawBulletPoint(gen, '"Simple, instant coverage for any event"')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateWidgetIntegrationGuide(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Widget Integration Guide', 'Step-by-step technical integration')

  drawSectionTitle(gen, 'Quick Start')
  drawParagraph(gen, 'Integrate the Daily Event Insurance widget on your website in 3 simple steps. No coding experience required for basic integration.')

  drawSubsectionTitle(gen, 'Step 1: Get Your Partner Code')
  drawParagraph(gen, '1. Log in to your partner dashboard at partners.dailyeventinsurance.com')
  drawParagraph(gen, '2. Navigate to Settings > Integration')
  drawParagraph(gen, '3. Copy your unique partner ID (format: PARTNER-XXXX-XXXX)')

  drawSubsectionTitle(gen, 'Step 2: Add the Widget Script')
  drawParagraph(gen, 'Add this code snippet just before the closing </body> tag on your website:')
  gen.y -= 10

  gen.page.drawRectangle({
    x: MARGIN,
    y: gen.y - 60,
    width: CONTENT_WIDTH,
    height: 60,
    color: COLORS.lightBg,
    borderColor: COLORS.tableBorder,
    borderWidth: 1,
  })

  gen.page.drawText('<script src="https://widget.dailyeventinsurance.com/v2/embed.js"', {
    x: MARGIN + 10,
    y: gen.y - 20,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.page.drawText('  data-partner-id="YOUR-PARTNER-ID"', {
    x: MARGIN + 10,
    y: gen.y - 32,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.page.drawText('  data-theme="auto"></script>', {
    x: MARGIN + 10,
    y: gen.y - 44,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })

  gen.y -= 75

  drawSubsectionTitle(gen, 'Step 3: Configure Display Options')
  drawTable(gen,
    ['Option', 'Values', 'Description'],
    [
      ['data-theme', 'auto, light, dark', 'Widget color scheme'],
      ['data-position', 'inline, modal, sidebar', 'How widget displays'],
      ['data-lang', 'en, es, fr', 'Language preference'],
      ['data-button-text', 'Custom text', 'CTA button label'],
    ],
    [120, 120, 272]
  )

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'React/Next.js Integration')
  drawParagraph(gen, 'For React-based applications, use our official NPM package:')

  gen.y -= 10
  gen.page.drawRectangle({
    x: MARGIN,
    y: gen.y - 30,
    width: CONTENT_WIDTH,
    height: 30,
    color: COLORS.lightBg,
    borderColor: COLORS.tableBorder,
    borderWidth: 1,
  })
  gen.page.drawText('npm install @dailyeventinsurance/react-widget', {
    x: MARGIN + 10,
    y: gen.y - 18,
    size: 9,
    font: gen.font,
    color: COLORS.text,
  })
  gen.y -= 45

  drawParagraph(gen, 'Then import and use the component:')
  gen.y -= 5

  gen.page.drawRectangle({
    x: MARGIN,
    y: gen.y - 80,
    width: CONTENT_WIDTH,
    height: 80,
    color: COLORS.lightBg,
    borderColor: COLORS.tableBorder,
    borderWidth: 1,
  })
  gen.page.drawText('import { InsuranceWidget } from \'@dailyeventinsurance/react-widget\';', {
    x: MARGIN + 10,
    y: gen.y - 18,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.page.drawText('', {
    x: MARGIN + 10,
    y: gen.y - 32,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.page.drawText('<InsuranceWidget', {
    x: MARGIN + 10,
    y: gen.y - 46,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.page.drawText('  partnerId="YOUR-PARTNER-ID"', {
    x: MARGIN + 10,
    y: gen.y - 58,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.page.drawText('  onPurchase={(policy) => console.log(policy)} />', {
    x: MARGIN + 10,
    y: gen.y - 70,
    size: 8,
    font: gen.font,
    color: COLORS.text,
  })
  gen.y -= 95

  drawSectionTitle(gen, 'Testing Your Integration')
  drawBulletPoint(gen, 'Use data-env="sandbox" for testing without real transactions')
  drawBulletPoint(gen, 'Test purchases appear in your dashboard under "Test Transactions"')
  drawBulletPoint(gen, 'Switch to data-env="production" when ready to go live')

  drawHighlightBox(gen, 'Need Help?', 'Contact our integration team at integrations@dailyeventinsurance.com or schedule a call at calendly.com/dei-integrations')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateSellingBestPractices(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Selling Best Practices', 'Maximize your insurance opt-in rates')

  drawSectionTitle(gen, 'Why Insurance Sells')
  drawParagraph(gen, 'Customers want peace of mind. When presented properly, event insurance becomes an easy yes. Our top partners achieve 70%+ opt-in rates by following these proven strategies.')

  drawHighlightBox(gen, 'Industry Average', '65% of customers opt for daily event insurance when offered at checkout')

  drawSectionTitle(gen, 'The Perfect Pitch')

  drawSubsectionTitle(gen, '1. Timing Is Everything')
  drawParagraph(gen, 'Present insurance after the booking is confirmed but before payment. Customers have already committed to the event mentally and are more receptive to add-ons.')

  drawSubsectionTitle(gen, '2. Lead with Benefits, Not Features')
  drawParagraph(gen, 'Instead of: "We offer liability insurance for $40"')
  drawParagraph(gen, 'Say: "For just $40, you\'re completely covered if anything unexpected happens - accidents, equipment damage, even cancellations."')

  drawSubsectionTitle(gen, '3. Use Social Proof')
  drawParagraph(gen, '"Most of our customers add this protection - it gives them peace of mind so they can focus on enjoying their event."')

  drawSubsectionTitle(gen, '4. Make the Value Clear')
  drawTable(gen,
    ['Coverage', 'Value', 'Cost'],
    [
      ['Liability Protection', '$1,000,000', '$40'],
      ['Equipment Coverage', '$10,000', 'Included'],
      ['Cancellation Protection', '$5,000', 'Included'],
    ],
    [200, 156, 156]
  )

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Handling Common Objections')

  drawSubsectionTitle(gen, '"I\'ve never needed insurance before"')
  drawParagraph(gen, 'Response: "That\'s great! And hopefully you never will. But for the cost of a nice dinner, you get complete peace of mind. Most claims come from completely unexpected situations - that\'s why it\'s called an accident."')

  drawSubsectionTitle(gen, '"It\'s too expensive"')
  drawParagraph(gen, 'Response: "I understand. But consider this: $40 protects you from potentially thousands in liability. One slip and fall could cost $50,000+ in medical bills. The insurance pays for itself with even a minor incident."')

  drawSubsectionTitle(gen, '"My regular insurance covers this"')
  drawParagraph(gen, 'Response: "Most personal policies have exclusions for organized events and rented equipment. Daily event insurance is designed specifically for these situations and takes effect immediately."')

  gen.y -= 10
  drawSectionTitle(gen, 'Staff Training Tips')
  drawBulletPoint(gen, 'Have all customer-facing staff complete the training video')
  drawBulletPoint(gen, 'Role-play objection handling weekly')
  drawBulletPoint(gen, 'Track individual staff opt-in rates and reward top performers')
  drawBulletPoint(gen, 'Post the FAQ cheat sheet at every checkout station')

  drawHighlightBox(gen, 'Revenue Impact', 'With 500 members and 65% opt-in at $14 commission per sale, you earn $4,550/month in passive income.')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateCoverageOptionsGuide(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Coverage Options Guide', 'Understanding what\'s protected')

  drawSectionTitle(gen, 'Complete Coverage Overview')
  drawParagraph(gen, 'Daily Event Insurance provides comprehensive protection for a wide range of events and activities. For just $40 per day, your customers receive:')

  gen.y -= 5
  drawTable(gen,
    ['Coverage Type', 'Limit', 'Deductible'],
    [
      ['General Liability', '$1,000,000', '$0'],
      ['Equipment Damage', '$10,000', '$100'],
      ['Event Cancellation', '$5,000', '$50'],
      ['Medical Payments', '$5,000', '$0'],
      ['Property Damage', '$100,000', '$250'],
    ],
    [200, 156, 156]
  )

  drawSectionTitle(gen, 'General Liability Coverage')

  drawSubsectionTitle(gen, 'What\'s Covered:')
  drawBulletPoint(gen, 'Bodily injury to third parties during the event')
  drawBulletPoint(gen, 'Property damage caused by event activities')
  drawBulletPoint(gen, 'Legal defense costs if sued')
  drawBulletPoint(gen, 'Medical expenses for injured guests')

  drawSubsectionTitle(gen, 'Common Claim Examples:')
  drawBulletPoint(gen, 'Guest slips on wet floor during fitness class')
  drawBulletPoint(gen, 'Participant injures another during sports activity')
  drawBulletPoint(gen, 'Rented equipment damages venue property')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Equipment Coverage')

  drawSubsectionTitle(gen, 'What\'s Covered:')
  drawBulletPoint(gen, 'Rented equipment damage')
  drawBulletPoint(gen, 'Borrowed equipment from venue')
  drawBulletPoint(gen, 'Theft during event hours')
  drawBulletPoint(gen, 'Accidental damage by participants')

  drawSubsectionTitle(gen, 'Equipment Examples:')
  drawTable(gen,
    ['Category', 'Examples'],
    [
      ['Sports', 'Kayaks, bikes, ski equipment, golf clubs'],
      ['Fitness', 'Weight machines, treadmills, yoga props'],
      ['Event', 'Sound systems, lighting, staging'],
      ['Outdoor', 'Camping gear, climbing equipment'],
    ],
    [150, 362]
  )

  drawSectionTitle(gen, 'Cancellation Coverage')

  drawSubsectionTitle(gen, 'Covered Reasons for Cancellation:')
  drawBulletPoint(gen, 'Severe weather making event unsafe')
  drawBulletPoint(gen, 'Sudden illness of key participant')
  drawBulletPoint(gen, 'Venue becomes unavailable')
  drawBulletPoint(gen, 'Government-mandated closures')

  drawSubsectionTitle(gen, 'Not Covered:')
  drawBulletPoint(gen, 'Change of mind')
  drawBulletPoint(gen, 'Scheduling conflicts')
  drawBulletPoint(gen, 'Pre-existing conditions')

  drawHighlightBox(gen, 'Claims Support', 'All claims are processed within 48 hours. Support available 24/7 at claims@dailyeventinsurance.com')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateFAQCheatsheet(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'FAQ Cheat Sheet', 'Quick answers to common questions')

  drawSectionTitle(gen, 'Pricing & Purchase')

  drawSubsectionTitle(gen, 'Q: How much does coverage cost?')
  drawParagraph(gen, 'A: $40 per day for comprehensive coverage including $1M liability, $10K equipment, and $5K cancellation protection.')

  drawSubsectionTitle(gen, 'Q: Can I purchase coverage for multiple days?')
  drawParagraph(gen, 'A: Yes! Multi-day events are covered at $40 per day. Purchase once and specify your event dates.')

  drawSubsectionTitle(gen, 'Q: When does coverage start?')
  drawParagraph(gen, 'A: Coverage begins immediately upon purchase and is active for the specified event date(s).')

  drawSectionTitle(gen, 'Coverage Questions')

  drawSubsectionTitle(gen, 'Q: What activities are covered?')
  drawParagraph(gen, 'A: Most recreational, fitness, and event activities. This includes sports, fitness classes, rentals, parties, and outdoor adventures. Extreme sports may require additional coverage.')

  drawSubsectionTitle(gen, 'Q: Is my own equipment covered?')
  drawParagraph(gen, 'A: The standard policy covers rented and borrowed equipment. Personal equipment coverage can be added for an additional $15.')

  drawSubsectionTitle(gen, 'Q: Are participants covered or just the organizer?')
  drawParagraph(gen, 'A: Both! The policy covers the event organizer and provides protection for participant injuries and accidents.')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Claims Process')

  drawSubsectionTitle(gen, 'Q: How do I file a claim?')
  drawParagraph(gen, 'A: Visit claims.dailyeventinsurance.com, enter your policy number, and describe the incident. Most claims are processed within 48 hours.')

  drawSubsectionTitle(gen, 'Q: What documentation do I need?')
  drawParagraph(gen, 'A: Photos of damage/injury, incident report, contact info for witnesses, and receipts for damaged items.')

  drawSubsectionTitle(gen, 'Q: How long do I have to file a claim?')
  drawParagraph(gen, 'A: Claims must be filed within 30 days of the incident for full processing.')

  drawSectionTitle(gen, 'Policy Details')

  drawSubsectionTitle(gen, 'Q: Can I cancel and get a refund?')
  drawParagraph(gen, 'A: Full refunds available up to 24 hours before the event date. After that, no refunds but you can reschedule once.')

  drawSubsectionTitle(gen, 'Q: Is there a deductible?')
  drawParagraph(gen, 'A: Liability claims have $0 deductible. Equipment claims have $100 deductible. Cancellation has $50 deductible.')

  drawSubsectionTitle(gen, 'Q: Do I get proof of insurance?')
  drawParagraph(gen, 'A: Yes! A certificate of insurance is emailed immediately upon purchase. You can also download it from your policy page.')

  drawHighlightBox(gen, 'Need More Help?', 'Contact our partner support team at partners@dailyeventinsurance.com or call 1-800-DEI-HELP')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateClaimsProcessGuide(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Claims Process Guide', 'How to file and track claims')

  drawSectionTitle(gen, 'Claims Overview')
  drawParagraph(gen, 'Daily Event Insurance is committed to fast, fair claims processing. Most claims are resolved within 48-72 hours. This guide walks you through the complete process.')

  drawSectionTitle(gen, 'Step-by-Step Claims Process')

  drawSubsectionTitle(gen, 'Step 1: Immediate Actions (At the Scene)')
  drawBulletPoint(gen, 'Ensure everyone\'s safety first')
  drawBulletPoint(gen, 'Document the incident with photos/video')
  drawBulletPoint(gen, 'Collect contact information from witnesses')
  drawBulletPoint(gen, 'Complete an incident report form (available in partner dashboard)')
  drawBulletPoint(gen, 'Seek medical attention if needed - keep all receipts')

  drawSubsectionTitle(gen, 'Step 2: File the Claim (Within 24 Hours)')
  drawBulletPoint(gen, 'Visit claims.dailyeventinsurance.com')
  drawBulletPoint(gen, 'Enter the policy number from the customer\'s confirmation')
  drawBulletPoint(gen, 'Complete the online claim form')
  drawBulletPoint(gen, 'Upload supporting documentation')
  drawBulletPoint(gen, 'Submit - you\'ll receive a claim number immediately')

  drawSubsectionTitle(gen, 'Step 3: Claims Review (24-48 Hours)')
  drawParagraph(gen, 'A claims adjuster will review the submission and may contact the customer for additional information.')

  addNewPage(gen, 2)

  drawSubsectionTitle(gen, 'Step 4: Resolution (48-72 Hours)')
  drawParagraph(gen, 'Once approved, payment is issued via the customer\'s preferred method:')
  drawBulletPoint(gen, 'Direct deposit (fastest - same day)')
  drawBulletPoint(gen, 'Check by mail (5-7 business days)')
  drawBulletPoint(gen, 'Direct payment to service provider')

  drawSectionTitle(gen, 'Required Documentation by Claim Type')

  drawTable(gen,
    ['Claim Type', 'Required Documents'],
    [
      ['Injury', 'Medical records, bills, incident report, photos'],
      ['Equipment Damage', 'Photos, repair estimate, proof of value'],
      ['Property Damage', 'Photos, repair/replacement quotes, ownership proof'],
      ['Cancellation', 'Reason documentation (weather report, doctor note)'],
    ],
    [130, 382]
  )

  drawSectionTitle(gen, 'Claims Timeline')

  drawTable(gen,
    ['Stage', 'Timeframe', 'Status'],
    [
      ['Submission', 'Immediate', 'Claim number issued'],
      ['Initial Review', '24 hours', 'Adjuster assigned'],
      ['Investigation', '24-48 hours', 'Documents reviewed'],
      ['Decision', '48-72 hours', 'Approved or denied'],
      ['Payment', '1-7 days', 'Funds issued'],
    ],
    [150, 120, 242]
  )

  drawHighlightBox(gen, 'Partner Support', 'As a partner, you can track customer claims in your dashboard. Contact claims@dailyeventinsurance.com for priority support.')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generatePartnerHandbook(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Partner Handbook', 'Complete program overview')

  drawSectionTitle(gen, 'Welcome to the Partner Program')
  drawParagraph(gen, 'Thank you for joining Daily Event Insurance as a partner. This handbook provides everything you need to successfully offer event insurance to your customers and maximize your earnings.')

  drawHighlightBox(gen, 'Your Earning Potential', 'Earn $14 per policy (35% commission on every $40 sale). Top partners earn $5,000+ monthly.')

  drawSectionTitle(gen, 'Program Benefits')
  drawBulletPoint(gen, 'Industry-leading 35% commission rate')
  drawBulletPoint(gen, 'Real-time tracking dashboard')
  drawBulletPoint(gen, 'Dedicated partner support team')
  drawBulletPoint(gen, 'Co-branded marketing materials')
  drawBulletPoint(gen, 'White-label integration options')
  drawBulletPoint(gen, 'Monthly performance bonuses')

  drawSectionTitle(gen, 'Getting Started Checklist')
  drawBulletPoint(gen, 'Complete partner onboarding form')
  drawBulletPoint(gen, 'Set up your partner dashboard account')
  drawBulletPoint(gen, 'Integrate the widget on your booking flow')
  drawBulletPoint(gen, 'Train your staff using our resources')
  drawBulletPoint(gen, 'Set up your payout preferences')
  drawBulletPoint(gen, 'Review compliance requirements')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Partner Dashboard Overview')
  drawParagraph(gen, 'Your partner dashboard at partners.dailyeventinsurance.com gives you complete visibility into your performance:')

  drawSubsectionTitle(gen, 'Dashboard Features:')
  drawBulletPoint(gen, 'Real-time sales tracking')
  drawBulletPoint(gen, 'Commission earnings and projections')
  drawBulletPoint(gen, 'Customer policy management')
  drawBulletPoint(gen, 'Payout history and statements')
  drawBulletPoint(gen, 'Marketing resource library')
  drawBulletPoint(gen, 'Integration settings')

  drawSectionTitle(gen, 'Support Channels')

  drawTable(gen,
    ['Need Help With', 'Contact', 'Response Time'],
    [
      ['General Questions', 'partners@dailyeventinsurance.com', '< 4 hours'],
      ['Technical Integration', 'integrations@dailyeventinsurance.com', '< 2 hours'],
      ['Billing/Payouts', 'billing@dailyeventinsurance.com', '< 24 hours'],
      ['Customer Claims', 'claims@dailyeventinsurance.com', '< 1 hour'],
      ['Emergency Support', '1-800-DEI-HELP', 'Immediate'],
    ],
    [160, 200, 152]
  )

  drawSectionTitle(gen, 'Performance Tiers')

  drawTable(gen,
    ['Tier', 'Monthly Sales', 'Commission Rate', 'Bonus'],
    [
      ['Starter', '1-50 policies', '35%', '-'],
      ['Growth', '51-150 policies', '37%', '$100'],
      ['Premium', '151-300 policies', '40%', '$300'],
      ['Elite', '300+ policies', '42%', '$500+'],
    ],
    [100, 130, 130, 152]
  )

  drawHighlightBox(gen, 'Need More Support?', 'Schedule a call with your dedicated partner success manager at calendly.com/dei-partners')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateCommissionStructure(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Commission Structure', 'Earnings breakdown with examples')

  drawSectionTitle(gen, 'Commission Overview')
  drawParagraph(gen, 'Daily Event Insurance offers one of the most competitive commission structures in the industry. Our transparent pricing ensures you always know exactly what you\'ll earn.')

  drawHighlightBox(gen, 'Base Commission: 35%', 'Earn $14 for every $40 policy sold through your platform')

  drawSectionTitle(gen, 'How It Works')

  drawTable(gen,
    ['Policy Price', 'Your Commission', 'Commission Rate'],
    [
      ['$40 (Standard)', '$14.00', '35%'],
      ['$55 (Premium)', '$19.25', '35%'],
      ['$80 (Multi-Day)', '$28.00', '35%'],
    ],
    [170, 170, 172]
  )

  drawSectionTitle(gen, 'Monthly Revenue Examples')
  drawParagraph(gen, 'Based on average 65% opt-in rate at checkout:')

  drawTable(gen,
    ['Your Monthly Customers', 'Policies Sold (65%)', 'Your Monthly Earnings'],
    [
      ['100', '65', '$910'],
      ['250', '163', '$2,282'],
      ['500', '325', '$4,550'],
      ['1,000', '650', '$9,100'],
      ['2,500', '1,625', '$22,750'],
    ],
    [180, 150, 182]
  )

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Performance Bonuses')
  drawParagraph(gen, 'Earn additional bonuses based on your monthly performance:')

  drawTable(gen,
    ['Monthly Policies', 'Tier', 'Bonus Commission', 'Monthly Bonus'],
    [
      ['51-150', 'Growth', '+2% (37% total)', '+$100'],
      ['151-300', 'Premium', '+5% (40% total)', '+$300'],
      ['301-500', 'Elite', '+7% (42% total)', '+$500'],
      ['500+', 'Enterprise', '+10% (45% total)', 'Custom'],
    ],
    [120, 100, 130, 162]
  )

  drawSectionTitle(gen, 'Payout Schedule')
  drawBulletPoint(gen, 'Commissions calculated daily')
  drawBulletPoint(gen, 'Payouts processed every Monday')
  drawBulletPoint(gen, 'Minimum payout threshold: $50')
  drawBulletPoint(gen, 'Payment methods: ACH, PayPal, Wire Transfer')

  drawSectionTitle(gen, 'Real Partner Success Stories')

  drawSubsectionTitle(gen, 'FitLife Gym - 500 Members')
  drawParagraph(gen, '65% opt-in rate = 325 policies/month = $4,550 monthly revenue')

  drawSubsectionTitle(gen, 'Adventure Rentals - 1,200 Daily Visitors')
  drawParagraph(gen, '72% opt-in rate = 864 policies/month = $12,096 monthly revenue')

  drawSubsectionTitle(gen, 'Event Space Co - 50 Events/Month')
  drawParagraph(gen, '80% opt-in rate = 40 policies/month = $560 monthly revenue')

  drawHighlightBox(gen, 'Calculate Your Earnings', 'Use our revenue calculator at partners.dailyeventinsurance.com/calculator')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateTermsOfService(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Partner Terms of Service', 'Partnership agreement terms')

  drawSectionTitle(gen, 'Agreement Overview')
  drawParagraph(gen, 'This Partner Agreement ("Agreement") is entered into between Daily Event Insurance ("DEI", "we", "us") and the Partner ("you", "Partner"). By enrolling in our Partner Program, you agree to these terms.')

  drawParagraph(gen, 'Effective Date: Upon partner account activation')
  drawParagraph(gen, 'Last Updated: January 2026')

  drawSectionTitle(gen, '1. Partner Obligations')
  drawBulletPoint(gen, 'Accurately represent Daily Event Insurance products and coverage')
  drawBulletPoint(gen, 'Maintain current and accurate business information')
  drawBulletPoint(gen, 'Comply with all applicable laws and regulations')
  drawBulletPoint(gen, 'Use approved marketing materials and messaging')
  drawBulletPoint(gen, 'Report any customer complaints or issues promptly')
  drawBulletPoint(gen, 'Maintain required insurance licenses where applicable')

  drawSectionTitle(gen, '2. Commission and Payment')
  drawParagraph(gen, 'DEI agrees to pay Partner commissions as outlined in the Commission Structure document. Payments are processed weekly for the prior week\'s confirmed sales. DEI reserves the right to adjust commission rates with 30 days written notice.')

  drawSectionTitle(gen, '3. Intellectual Property')
  drawParagraph(gen, 'Partner is granted a non-exclusive, revocable license to use DEI trademarks and marketing materials solely for promoting DEI products. All intellectual property remains the property of DEI.')

  addNewPage(gen, 2)

  drawSectionTitle(gen, '4. Confidentiality')
  drawParagraph(gen, 'Partner agrees to keep confidential all non-public information including commission rates, customer data, and business strategies. This obligation survives termination of this Agreement.')

  drawSectionTitle(gen, '5. Data Protection')
  drawParagraph(gen, 'Partner must handle all customer data in accordance with applicable privacy laws including GDPR and CCPA. Partner shall not use customer data for any purpose other than facilitating insurance purchases.')

  drawSectionTitle(gen, '6. Term and Termination')
  drawBulletPoint(gen, 'This Agreement begins upon enrollment and continues until terminated')
  drawBulletPoint(gen, 'Either party may terminate with 30 days written notice')
  drawBulletPoint(gen, 'DEI may terminate immediately for breach of terms')
  drawBulletPoint(gen, 'Upon termination, Partner must cease all use of DEI materials')
  drawBulletPoint(gen, 'Outstanding commissions will be paid within 30 days of termination')

  drawSectionTitle(gen, '7. Limitation of Liability')
  drawParagraph(gen, 'DEI\'s liability under this Agreement shall not exceed the total commissions paid to Partner in the 12 months preceding any claim. DEI shall not be liable for indirect, incidental, or consequential damages.')

  drawSectionTitle(gen, '8. Dispute Resolution')
  drawParagraph(gen, 'Any disputes arising from this Agreement shall first be addressed through good-faith negotiation. Unresolved disputes shall be submitted to binding arbitration in accordance with AAA rules.')

  drawHighlightBox(gen, 'Questions?', 'Contact legal@dailyeventinsurance.com for questions about these terms.')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateComplianceGuide(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Compliance Guide', 'Regulatory requirements')

  drawSectionTitle(gen, 'Compliance Overview')
  drawParagraph(gen, 'As a Daily Event Insurance partner, you play an important role in ensuring our products are sold compliantly. This guide covers key regulatory requirements and best practices.')

  drawHighlightBox(gen, 'Important', 'This guide provides general information. Consult with a licensed professional for specific compliance questions.')

  drawSectionTitle(gen, 'Insurance Referral vs. Selling')
  drawParagraph(gen, 'As a partner, you are referring customers to Daily Event Insurance - you are not selling insurance directly. This distinction is important:')

  drawSubsectionTitle(gen, 'You CAN:')
  drawBulletPoint(gen, 'Describe general coverage benefits')
  drawBulletPoint(gen, 'Share pricing information')
  drawBulletPoint(gen, 'Direct customers to purchase through the widget')
  drawBulletPoint(gen, 'Answer basic questions using approved FAQs')

  drawSubsectionTitle(gen, 'You CANNOT:')
  drawBulletPoint(gen, 'Provide specific coverage advice')
  drawBulletPoint(gen, 'Interpret policy terms and conditions')
  drawBulletPoint(gen, 'Process claims or coverage changes')
  drawBulletPoint(gen, 'Represent yourself as an insurance agent')

  addNewPage(gen, 2)

  drawSectionTitle(gen, 'Required Disclosures')
  drawParagraph(gen, 'When presenting insurance options, ensure customers understand:')

  drawBulletPoint(gen, 'Insurance is optional and not required for their booking')
  drawBulletPoint(gen, 'Coverage is provided by Daily Event Insurance, not your business')
  drawBulletPoint(gen, 'Full policy terms are available before purchase')
  drawBulletPoint(gen, 'Customers can review and cancel within 24 hours')

  drawSectionTitle(gen, 'State-Specific Requirements')
  drawParagraph(gen, 'Some states have additional requirements for insurance referrals:')

  drawTable(gen,
    ['State', 'Requirement'],
    [
      ['California', 'Must display insurance license number'],
      ['New York', 'Written disclosure of referral relationship'],
      ['Florida', 'Cannot receive commission if unlicensed'],
      ['Texas', 'Must provide policy summary'],
    ],
    [150, 362]
  )

  drawParagraph(gen, 'Contact compliance@dailyeventinsurance.com for state-specific guidance.')

  drawSectionTitle(gen, 'Record Keeping')
  drawParagraph(gen, 'Maintain records of all insurance referrals for at least 3 years, including:')
  drawBulletPoint(gen, 'Customer name and contact information')
  drawBulletPoint(gen, 'Date of referral/purchase')
  drawBulletPoint(gen, 'Policy number')
  drawBulletPoint(gen, 'Any customer communications')

  drawHighlightBox(gen, 'Compliance Support', 'Email compliance@dailyeventinsurance.com or call 1-800-DEI-HELP for compliance questions.')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

async function generateTroubleshootingGuide(): Promise<Buffer> {
  const gen = await createPDFGenerator()

  drawHeader(gen, 'Troubleshooting Guide', 'Common issues and solutions')

  drawSectionTitle(gen, 'Widget Integration Issues')

  drawSubsectionTitle(gen, 'Widget Not Displaying')
  drawParagraph(gen, 'Problem: The insurance widget doesn\'t appear on your page.')
  drawParagraph(gen, 'Solutions:')
  drawBulletPoint(gen, 'Verify the script tag is placed before </body>')
  drawBulletPoint(gen, 'Check your partner ID is correct (no spaces/typos)')
  drawBulletPoint(gen, 'Ensure no ad blockers are interfering')
  drawBulletPoint(gen, 'Clear browser cache and refresh')
  drawBulletPoint(gen, 'Check browser console for JavaScript errors')

  drawSubsectionTitle(gen, 'Widget Loads Slowly')
  drawParagraph(gen, 'Problem: Widget takes too long to appear.')
  drawParagraph(gen, 'Solutions:')
  drawBulletPoint(gen, 'Add async attribute to script tag')
  drawBulletPoint(gen, 'Check your internet connection speed')
  drawBulletPoint(gen, 'Contact support if issue persists > 24 hours')

  drawSectionTitle(gen, 'Dashboard Access Issues')

  drawSubsectionTitle(gen, 'Can\'t Log In')
  drawParagraph(gen, 'Solutions:')
  drawBulletPoint(gen, 'Use "Forgot Password" to reset credentials')
  drawBulletPoint(gen, 'Check if your email address is correct')
  drawBulletPoint(gen, 'Clear cookies and try again')
  drawBulletPoint(gen, 'Try a different browser')

  addNewPage(gen, 2)

  drawSubsectionTitle(gen, 'Data Not Updating')
  drawParagraph(gen, 'Problem: Sales or commission data appears outdated.')
  drawParagraph(gen, 'Solutions:')
  drawBulletPoint(gen, 'Dashboard refreshes every 5 minutes - wait and refresh')
  drawBulletPoint(gen, 'Check if there\'s a system maintenance notice')
  drawBulletPoint(gen, 'Try logging out and back in')
  drawBulletPoint(gen, 'Contact support if data is > 1 hour delayed')

  drawSectionTitle(gen, 'Payment Issues')

  drawSubsectionTitle(gen, 'Missing Commission Payment')
  drawParagraph(gen, 'Solutions:')
  drawBulletPoint(gen, 'Verify your payout settings are correctly configured')
  drawBulletPoint(gen, 'Check if you\'ve reached the $50 minimum threshold')
  drawBulletPoint(gen, 'Review the payout schedule (weekly on Mondays)')
  drawBulletPoint(gen, 'Check spam folder for payment notifications')
  drawBulletPoint(gen, 'Contact billing@dailyeventinsurance.com')

  drawSectionTitle(gen, 'Customer Issues')

  drawSubsectionTitle(gen, 'Customer Can\'t Complete Purchase')
  drawParagraph(gen, 'Solutions:')
  drawBulletPoint(gen, 'Have customer try a different payment method')
  drawBulletPoint(gen, 'Check if all required fields are completed')
  drawBulletPoint(gen, 'Suggest clearing browser cookies')
  drawBulletPoint(gen, 'Direct to support@dailyeventinsurance.com')

  drawHighlightBox(gen, 'Still Need Help?', 'Priority partner support: partners@dailyeventinsurance.com | 1-800-DEI-HELP')

  drawFooter(gen, 2)

  const pdfBytes = await gen.doc.save()
  return Buffer.from(pdfBytes)
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function generateAllPDFs(): Promise<void> {
  const baseDir = path.join(process.cwd(), 'public', 'resources')

  console.log('Generating Partner Resource PDFs...\n')

  const pdfs = [
    // Marketing
    { name: 'email-templates.pdf', dir: 'marketing', generator: generateEmailTemplates },
    { name: 'promotional-flyers.pdf', dir: 'marketing', generator: generatePromotionalFlyers },
    { name: 'co-branding-guidelines.pdf', dir: 'marketing', generator: generateCoBrandingGuidelines },

    // Training
    { name: 'widget-integration-guide.pdf', dir: 'training', generator: generateWidgetIntegrationGuide },
    { name: 'selling-best-practices.pdf', dir: 'training', generator: generateSellingBestPractices },
    { name: 'coverage-options-guide.pdf', dir: 'training', generator: generateCoverageOptionsGuide },
    { name: 'faq-cheatsheet.pdf', dir: 'training', generator: generateFAQCheatsheet },
    { name: 'claims-process-guide.pdf', dir: 'training', generator: generateClaimsProcessGuide },

    // Documentation
    { name: 'partner-handbook.pdf', dir: 'documentation', generator: generatePartnerHandbook },
    { name: 'commission-structure.pdf', dir: 'documentation', generator: generateCommissionStructure },
    { name: 'terms-of-service.pdf', dir: 'documentation', generator: generateTermsOfService },
    { name: 'compliance-guide.pdf', dir: 'documentation', generator: generateComplianceGuide },
    { name: 'troubleshooting-guide.pdf', dir: 'documentation', generator: generateTroubleshootingGuide },
  ]

  for (const pdf of pdfs) {
    try {
      const buffer = await pdf.generator()
      const filePath = path.join(baseDir, pdf.dir, pdf.name)
      fs.writeFileSync(filePath, buffer)
      console.log(`  Created: ${pdf.dir}/${pdf.name}`)
    } catch (error) {
      console.error(`  Failed: ${pdf.dir}/${pdf.name}`, error)
    }
  }

  console.log('\nAll PDFs generated successfully!')
}

// Create placeholder zip files with READMEs
async function createPlaceholderZips(): Promise<void> {
  const baseDir = path.join(process.cwd(), 'public', 'resources', 'marketing')

  // Logo pack README
  const logoReadme = `# Partner Logo Pack

This package contains Daily Event Insurance logos in various formats:

## Included Files:
- logo-full-color.svg
- logo-full-color.png (various sizes)
- logo-white.svg
- logo-white.png
- logo-black.svg
- logo-black.png
- logo-horizontal.svg
- logo-horizontal.png
- logo-stacked.svg
- logo-stacked.png

## Usage Guidelines:
- Maintain minimum clear space of 20px around logo
- Do not alter colors or proportions
- See co-branding-guidelines.pdf for full usage rules

## File Formats:
- SVG: Scalable vector (recommended for web)
- PNG: Raster images at 1x, 2x, and 3x resolutions
- EPS: Print-ready vector format

Contact: partners@dailyeventinsurance.com
`

  const socialReadme = `# Social Media Templates

This package contains ready-to-use social media graphics:

## Included Templates:

### Instagram
- Story templates (1080x1920)
- Post templates (1080x1080)
- Carousel templates

### Facebook
- Cover photo (820x312)
- Post templates (1200x630)
- Story templates

### LinkedIn
- Banner (1128x191)
- Post templates (1200x627)

### Twitter/X
- Header (1500x500)
- Post templates (1200x675)

## Customization:
All templates are provided in:
- Canva links (editable)
- Figma files
- PNG exports

Add your logo and customize text as needed.

Contact: partners@dailyeventinsurance.com
`

  fs.writeFileSync(path.join(baseDir, 'logo-pack-readme.txt'), logoReadme)
  fs.writeFileSync(path.join(baseDir, 'social-media-readme.txt'), socialReadme)

  console.log('  Created: marketing/logo-pack-readme.txt')
  console.log('  Created: marketing/social-media-readme.txt')
}

// Run generation
generateAllPDFs()
  .then(() => createPlaceholderZips())
  .then(() => console.log('\nDone!'))
  .catch(console.error)
