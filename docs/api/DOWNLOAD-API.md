# Download API Documentation

Complete API documentation for partner resource downloads and asset generation.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Download Resource](#download-resource)
  - [Check Resource Exists](#check-resource-exists)
  - [Generate Custom Asset](#generate-custom-asset)
  - [List Templates](#list-templates)
- [Categories](#categories)
- [File Types](#file-types)
- [Security](#security)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

The Download API provides secure access to partner resources and enables generation of custom marketing materials with partner branding.

**Base URL**: `/api/downloads`

**Features**:
- ✅ Secure file downloads with authentication
- ✅ Automatic download tracking
- ✅ Support for multiple file types (PDF, ZIP, PNG, SVG, JPG)
- ✅ Custom asset generation with partner branding
- ✅ Template library for marketing materials
- ✅ Path traversal protection
- ✅ Content-Type and caching headers

## Authentication

All download endpoints require partner authentication via Clerk.

**Headers**:
```
Authorization: Bearer <token>
```

Unauthorized requests will receive a `401 Unauthorized` response.

## Endpoints

### Download Resource

Download a partner resource file.

**Endpoint**: `GET /api/downloads/[category]/[asset]`

**Parameters**:
- `category` (path, required): Resource category
  - Valid values: `marketing`, `training`, `documentation`
- `asset` (path, required): Filename to download
  - Must be a valid filename without path traversal characters
  - Must have a supported file extension

**Response Headers**:
```
Content-Type: application/pdf | application/zip | image/png | image/svg+xml
Content-Disposition: attachment; filename="[asset]"
Content-Length: [size]
Cache-Control: public, max-age=31536000, immutable
```

**Success Response** (200):
```
[Binary file content]
```

**Error Responses**:

`400 Bad Request` - Invalid category:
```json
{
  "error": "Invalid category",
  "message": "Category must be one of: marketing, training, documentation"
}
```

`400 Bad Request` - Invalid filename:
```json
{
  "error": "Invalid asset name",
  "message": "Asset name contains invalid characters"
}
```

`400 Bad Request` - Invalid file type:
```json
{
  "error": "Invalid file type",
  "message": "File type must be one of: pdf, zip, png, svg, jpg, jpeg"
}
```

`404 Not Found` - File doesn't exist:
```json
{
  "error": "File not found",
  "message": "The requested resource does not exist"
}
```

**Example**:
```bash
curl -H "Authorization: Bearer <token>" \
  https://api.dailyeventinsurance.com/api/downloads/marketing/email-templates.pdf
```

---

### Check Resource Exists

Check if a resource exists without downloading it.

**Endpoint**: `HEAD /api/downloads/[category]/[asset]`

**Parameters**: Same as Download Resource

**Response Headers**:
```
Content-Type: [mime-type]
Content-Length: [size]
```

**Success Response** (200): Empty body with headers
**Error Response** (404): Empty body

**Example**:
```bash
curl -I -H "Authorization: Bearer <token>" \
  https://api.dailyeventinsurance.com/api/downloads/marketing/logo-pack.zip
```

---

### Generate Custom Asset

Generate a personalized marketing asset with partner branding.

**Endpoint**: `POST /api/partner/assets/generate`

**Request Body**:
```json
{
  "assetType": "flyer" | "email" | "social" | "brochure" | "certificate",
  "template": "template-id",
  "customization": {
    "headline": "Custom headline text",
    "subheadline": "Custom subheadline",
    "callToAction": "Contact us today!",
    "additionalText": "Extra content"
  }
}
```

**Success Response** (200):
```json
{
  "downloadUrl": "/api/downloads/marketing/generated-flyer-asset123.pdf",
  "previewUrl": "/preview/generated-flyer-asset123.png",
  "assetId": "asset-1234567890-abc123",
  "expiresAt": "2025-01-09T12:00:00.000Z",
  "metadata": {
    "assetType": "flyer",
    "template": "flyer-modern",
    "customization": {
      "headline": "Custom headline text",
      "callToAction": "Contact us today!"
    },
    "branding": {
      "primaryColor": "#14B8A6",
      "businessName": "Partner Business Name",
      "logoUrl": "/uploads/partner-logo.png",
      "contactName": "John Doe",
      "contactEmail": "john@partner.com",
      "contactPhone": "(555) 123-4567"
    }
  }
}
```

**Error Responses**:

`400 Bad Request` - Invalid asset type:
```json
{
  "error": "Invalid asset type",
  "message": "Asset type must be one of: flyer, email, social, brochure, certificate"
}
```

`400 Bad Request` - Missing template:
```json
{
  "error": "Missing template",
  "message": "Template ID is required"
}
```

`404 Not Found` - Partner not found:
```json
{
  "error": "Partner not found",
  "message": "Partner profile not found"
}
```

**Example**:
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assetType": "flyer",
    "template": "flyer-modern",
    "customization": {
      "headline": "Daily Event Insurance Now Available",
      "callToAction": "Protect Your Events Today"
    }
  }' \
  https://api.dailyeventinsurance.com/api/partner/assets/generate
```

---

### List Templates

Get available templates for asset generation.

**Endpoint**: `GET /api/partner/assets/generate`

**Query Parameters**:
- `assetType` (optional): Filter by asset type
  - Valid values: `flyer`, `email`, `social`, `brochure`, `certificate`

**Success Response** (200) - All templates:
```json
{
  "templates": {
    "flyer": [
      {
        "id": "flyer-modern",
        "name": "Modern Flyer",
        "description": "Clean, modern design with bold headlines",
        "previewUrl": "/templates/flyer-modern-preview.png"
      }
    ],
    "email": [...],
    "social": [...],
    "brochure": [...],
    "certificate": [...]
  },
  "categories": ["flyer", "email", "social", "brochure", "certificate"]
}
```

**Success Response** (200) - Filtered by type:
```json
{
  "templates": [
    {
      "id": "flyer-modern",
      "name": "Modern Flyer",
      "description": "Clean, modern design with bold headlines",
      "previewUrl": "/templates/flyer-modern-preview.png"
    },
    {
      "id": "flyer-classic",
      "name": "Classic Flyer",
      "description": "Traditional layout with professional styling",
      "previewUrl": "/templates/flyer-classic-preview.png"
    }
  ],
  "assetType": "flyer"
}
```

**Example**:
```bash
# Get all templates
curl -H "Authorization: Bearer <token>" \
  https://api.dailyeventinsurance.com/api/partner/assets/generate

# Get flyer templates only
curl -H "Authorization: Bearer <token>" \
  https://api.dailyeventinsurance.com/api/partner/assets/generate?assetType=flyer
```

---

## Categories

### Marketing
Promotional materials, logos, and social media assets.

**Example resources**:
- Logo packs (ZIP)
- Social media templates (ZIP/PNG)
- Email templates (PDF)
- Promotional flyers (PDF)
- Co-branding guidelines (PDF)

### Training
Video tutorials, guides, and best practices.

**Example resources**:
- Widget integration guide (PDF)
- Selling best practices (PDF)
- Coverage options guide (PDF)
- FAQ cheatsheet (PDF)
- Claims process guide (PDF)

### Documentation
API docs, handbooks, and reference materials.

**Example resources**:
- Partner handbook (PDF)
- API documentation (Link)
- Commission structure guide (PDF)
- Terms of service (PDF)
- Compliance guide (PDF)
- Troubleshooting guide (PDF)

---

## File Types

Supported file types and their MIME types:

| Extension | MIME Type | Use Case |
|-----------|-----------|----------|
| `.pdf` | `application/pdf` | Documents, guides, templates |
| `.zip` | `application/zip` | Logo packs, template bundles |
| `.png` | `image/png` | Graphics, screenshots |
| `.svg` | `image/svg+xml` | Vector logos, icons |
| `.jpg` / `.jpeg` | `image/jpeg` | Photos, images |

---

## Security

### Path Traversal Protection

All file paths are validated to prevent directory traversal attacks:

❌ **Blocked**:
- `../../../etc/passwd`
- `../../database.db`
- `folder/../secret.txt`

✅ **Allowed**:
- `email-templates.pdf`
- `logo-pack.zip`
- `flyer-template.png`

### File Type Validation

Only approved file extensions are allowed. Executable files and scripts are blocked:

❌ **Blocked**: `.exe`, `.sh`, `.bat`, `.js`, `.php`
✅ **Allowed**: `.pdf`, `.zip`, `.png`, `.svg`, `.jpg`

### Authentication

All endpoints require valid partner authentication. Anonymous access is denied.

### Download Tracking

All downloads are tracked in the database with:
- Partner ID
- Resource ID
- Timestamp
- IP address (optional)

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid authentication)
- `404` - Not found (resource doesn't exist)
- `500` - Server error

---

## Examples

### Download a PDF

```typescript
async function downloadPDF(category: string, filename: string) {
  const response = await fetch(
    `/api/downloads/${category}/${filename}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`)
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// Usage
await downloadPDF("marketing", "email-templates.pdf")
```

### Generate Custom Flyer

```typescript
async function generateFlyer(headline: string, cta: string) {
  const response = await fetch("/api/partner/assets/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      assetType: "flyer",
      template: "flyer-modern",
      customization: {
        headline,
        callToAction: cta,
      },
    }),
  })

  const data = await response.json()
  return data.downloadUrl
}

// Usage
const url = await generateFlyer(
  "Get Covered Today",
  "Contact us for a quote"
)
```

### Check if Resource Exists

```typescript
async function resourceExists(category: string, filename: string) {
  const response = await fetch(
    `/api/downloads/${category}/${filename}`,
    {
      method: "HEAD",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.ok
}

// Usage
const exists = await resourceExists("marketing", "logo-pack.zip")
console.log(exists ? "File exists" : "File not found")
```

### List Available Templates

```typescript
async function getTemplates(assetType?: string) {
  const url = assetType
    ? `/api/partner/assets/generate?assetType=${assetType}`
    : "/api/partner/assets/generate"

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return await response.json()
}

// Usage
const flyerTemplates = await getTemplates("flyer")
const allTemplates = await getTemplates()
```

---

## Rate Limiting

Download endpoints are rate-limited to prevent abuse:

- **Downloads**: 100 requests per hour per partner
- **Asset Generation**: 20 requests per hour per partner
- **Template Listing**: 60 requests per hour per partner

Exceeding rate limits returns `429 Too Many Requests`.

---

## Caching

Static resources are cached with long expiration:

```
Cache-Control: public, max-age=31536000, immutable
```

This means resources are cached for 1 year in CDN and browsers.

---

## Support

For questions or issues with the Download API:

- **Email**: support@dailyeventinsurance.com
- **Documentation**: https://docs.dailyeventinsurance.com
- **Status**: https://status.dailyeventinsurance.com
