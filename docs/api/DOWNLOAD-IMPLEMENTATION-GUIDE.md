# Download API Implementation Guide

Step-by-step guide for implementing and extending the Download API.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Organization](#file-organization)
3. [Adding New Resources](#adding-new-resources)
4. [Adding New Templates](#adding-new-templates)
5. [Integrating PDF Generation](#integrating-pdf-generation)
6. [Cloud Storage Integration](#cloud-storage-integration)
7. [Analytics & Reporting](#analytics--reporting)
8. [Testing](#testing)

---

## Architecture Overview

```
┌─────────────────────┐
│   Partner Portal    │
│  (materials page)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Download API Layer              │
├─────────────────────────────────────────┤
│ • Authentication (Clerk)                │
│ • Path validation                       │
│ • File type checking                    │
│ • Download tracking                     │
└──────────┬──────────────────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌──────────────┐
│  Static │  │   Generated  │
│  Files  │  │    Assets    │
│ (public)│  │ (temp/cloud) │
└─────────┘  └──────────────┘
     │           │
     └─────┬─────┘
           ▼
    ┌──────────────┐
    │   Database   │
    │  (Tracking)  │
    └──────────────┘
```

## File Organization

### Current Structure

```
app/
├── api/
│   ├── downloads/
│   │   └── [category]/
│   │       └── [asset]/
│   │           └── route.ts          # Download endpoint
│   └── partner/
│       ├── resources/
│       │   └── route.ts              # List resources (existing)
│       └── assets/
│           └── generate/
│               └── route.ts          # Generate custom assets
│
public/
└── resources/
    ├── marketing/                    # Marketing materials
    │   ├── email-templates.pdf
    │   ├── logo-pack.zip
    │   └── promotional-flyers.pdf
    ├── training/                     # Training resources
    │   ├── widget-integration-guide.pdf
    │   └── selling-best-practices.pdf
    └── documentation/                # Documentation
        ├── partner-handbook.pdf
        └── api-documentation.pdf
│
lib/
├── partner-resources-data.ts         # Resource definitions
└── api-utils/
    └── download-helpers.ts           # Helper functions
│
tests/
└── api/
    └── downloads.test.ts             # API tests
│
docs/
└── api/
    ├── DOWNLOAD-API.md               # Full API docs
    └── DOWNLOAD-API-README.md        # Quick start guide
```

---

## Adding New Resources

### Step 1: Add File to Public Directory

```bash
# Add file to appropriate category
cp new-resource.pdf public/resources/marketing/

# Ensure proper permissions
chmod 644 public/resources/marketing/new-resource.pdf
```

### Step 2: Update Resource Data

Edit `lib/partner-resources-data.ts`:

```typescript
export const ADMIN_DEMO_RESOURCES: PartnerResource[] = [
  // ... existing resources ...
  {
    id: "res-016",
    title: "New Marketing Resource",
    description: "Description of the new resource",
    category: "marketing",
    resourceType: "pdf",
    fileUrl: "/resources/marketing/new-resource.pdf",
    thumbnailUrl: "/images/new-resource-thumbnail.png",
    sortOrder: 16,
    createdAt: new Date().toISOString(),
  },
]
```

### Step 3: Add to Database (Production)

```typescript
// Use admin panel or API to add resource
await db.insert(partnerResources).values({
  title: "New Marketing Resource",
  description: "Description",
  category: "marketing",
  resourceType: "pdf",
  fileUrl: "/resources/marketing/new-resource.pdf",
  thumbnailUrl: "/images/new-resource-thumbnail.png",
  sortOrder: 16,
})
```

### Step 4: Test Download

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/downloads/marketing/new-resource.pdf \
  -o test-download.pdf
```

---

## Adding New Templates

### Step 1: Create Template Definition

Edit `app/api/partner/assets/generate/route.ts`:

```typescript
const templates = {
  // ... existing templates ...

  // Add new template type
  newsletter: [
    {
      id: "newsletter-monthly",
      name: "Monthly Newsletter",
      description: "Professional monthly update template",
      previewUrl: "/templates/newsletter-preview.png",
    },
  ],
}
```

### Step 2: Add Template Assets

```bash
# Add template preview
cp newsletter-preview.png public/templates/

# Add template source (if using file-based templates)
cp newsletter-template.html templates/newsletter/
```

### Step 3: Implement Template Rendering

Create template renderer:

```typescript
// lib/template-renderers/newsletter.ts
import { Partner } from "@/lib/db"

export async function renderNewsletterTemplate(
  partner: Partner,
  customization: {
    headline?: string
    articles?: Array<{ title: string; content: string }>
  }
) {
  // Load template
  const template = await loadTemplate("newsletter-monthly")

  // Inject partner branding
  const html = template
    .replace("{{businessName}}", partner.businessName)
    .replace("{{primaryColor}}", partner.primaryColor || "#14B8A6")
    .replace("{{headline}}", customization.headline || "Monthly Update")

  // Generate PDF
  const pdf = await generatePDF(html)

  return pdf
}
```

### Step 4: Update Generation Endpoint

```typescript
// In POST /api/partner/assets/generate
if (assetType === "newsletter") {
  const pdf = await renderNewsletterTemplate(partner, customization)
  const url = await uploadToStorage(pdf)

  return NextResponse.json({
    downloadUrl: url,
    // ... rest of response
  })
}
```

---

## Integrating PDF Generation

### Option 1: Puppeteer (Server-side)

```typescript
import puppeteer from "puppeteer"

async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html)
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  })

  await browser.close()
  return pdf
}
```

Install:
```bash
npm install puppeteer
```

### Option 2: PDFKit (Programmatic)

```typescript
import PDFDocument from "pdfkit"
import { Readable } from "stream"

async function generatePDF(data: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))

    // Add content
    doc.fontSize(25).text(data.headline, 100, 100)
    doc.fontSize(12).text(data.content, 100, 150)

    doc.end()
  })
}
```

Install:
```bash
npm install pdfkit @types/pdfkit
```

### Option 3: External API (Cloud)

```typescript
async function generatePDF(html: string): Promise<string> {
  const response = await fetch("https://api.pdfgenerator.com/convert", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PDF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
  })

  const { downloadUrl } = await response.json()
  return downloadUrl
}
```

---

## Cloud Storage Integration

### Cloudflare R2 (Recommended)

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

async function uploadGeneratedAsset(
  buffer: Buffer,
  filename: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: "partner-assets",
      Key: `generated/${filename}`,
      Body: buffer,
      ContentType: "application/pdf",
    })
  )

  return `https://assets.dailyeventinsurance.com/generated/${filename}`
}
```

Install:
```bash
npm install @aws-sdk/client-s3
```

### AWS S3

Same code as R2, just change endpoint:

```typescript
endpoint: "https://s3.amazonaws.com"
```

---

## Analytics & Reporting

### Track Download Metrics

```typescript
// lib/analytics/download-metrics.ts
export async function getDownloadMetrics(partnerId: string) {
  const downloads = await db
    .select()
    .from(resourceDownloads)
    .where(eq(resourceDownloads.partnerId, partnerId))

  const byCategory = downloads.reduce((acc, download) => {
    const resource = /* fetch resource */
    acc[resource.category] = (acc[resource.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalDownloads: downloads.length,
    byCategory,
    topResources: /* calculate */,
    downloadTrend: /* calculate */,
  }
}
```

### Create Admin Dashboard

```typescript
// app/api/admin/download-analytics/route.ts
export async function GET() {
  const allDownloads = await db.select().from(resourceDownloads)

  return NextResponse.json({
    totalDownloads: allDownloads.length,
    uniquePartners: new Set(allDownloads.map(d => d.partnerId)).size,
    topResources: /* calculate */,
    categoryBreakdown: /* calculate */,
  })
}
```

---

## Testing

### Unit Tests

```typescript
// tests/api/downloads.test.ts
describe("Download validation", () => {
  it("blocks path traversal", () => {
    const isValid = validateFilePath("../../../etc/passwd")
    expect(isValid).toBe(false)
  })

  it("allows safe filenames", () => {
    const isValid = validateFilePath("email-templates.pdf")
    expect(isValid).toBe(true)
  })
})
```

### Integration Tests

```typescript
describe("Download API integration", () => {
  it("downloads PDF with auth", async () => {
    const response = await fetch("/api/downloads/marketing/test.pdf", {
      headers: { Authorization: `Bearer ${testToken}` },
    })

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("application/pdf")
  })

  it("tracks download in database", async () => {
    await fetch("/api/downloads/marketing/test.pdf", {
      headers: { Authorization: `Bearer ${testToken}` },
    })

    const downloads = await db
      .select()
      .from(resourceDownloads)
      .where(eq(resourceDownloads.partnerId, testPartnerId))

    expect(downloads.length).toBeGreaterThan(0)
  })
})
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run tests/load/downloads.js
```

```javascript
// tests/load/downloads.js
import http from "k6/http"
import { check } from "k6"

export const options = {
  vus: 50,
  duration: "30s",
}

export default function() {
  const res = http.get(
    "http://localhost:3000/api/downloads/marketing/test.pdf",
    {
      headers: { Authorization: `Bearer ${__ENV.TEST_TOKEN}` },
    }
  )

  check(res, {
    "status is 200": (r) => r.status === 200,
    "content type is PDF": (r) =>
      r.headers["Content-Type"] === "application/pdf",
  })
}
```

---

## Security Checklist

- ✅ Authentication required on all endpoints
- ✅ Path traversal prevention
- ✅ File type validation
- ✅ Filename sanitization
- ✅ Content-Type headers set correctly
- ⏳ Rate limiting (add middleware)
- ⏳ DDoS protection (Cloudflare)
- ⏳ Virus scanning for uploads (future)

---

## Performance Optimization

### Enable Caching

```typescript
// Next.js config
export const config = {
  runtime: "edge", // Use edge runtime for faster responses
}

// Response headers
headers: {
  "Cache-Control": "public, max-age=31536000, immutable",
  "CDN-Cache-Control": "max-age=31536000",
}
```

### Use CDN

Add Cloudflare or CloudFront in front of the download endpoint.

### Compress Responses

```typescript
import { gzip } from "zlib"
import { promisify } from "util"

const gzipAsync = promisify(gzip)

const compressed = await gzipAsync(fileBuffer)
// Set Content-Encoding: gzip header
```

---

## Troubleshooting

### Downloads failing

1. Check file exists: `ls public/resources/marketing/`
2. Check permissions: `chmod 644 public/resources/**/*`
3. Check authentication: Verify Clerk token
4. Check logs: Look for error messages

### Tracking not working

1. Check database connection
2. Verify partner exists in database
3. Check resource ID matches
4. Look for transaction errors in logs

### PDF generation slow

1. Use edge runtime
2. Cache generated PDFs
3. Use external PDF service
4. Implement queue for generation

---

## Next Steps

1. ✅ Core endpoints implemented
2. ✅ Security measures in place
3. ✅ Documentation complete
4. ⏳ Add rate limiting
5. ⏳ Implement PDF generation
6. ⏳ Set up cloud storage
7. ⏳ Create analytics dashboard
8. ⏳ Add webhook notifications

---

For questions, see:
- [Full API Documentation](./DOWNLOAD-API.md)
- [Quick Start Guide](./DOWNLOAD-API-README.md)
