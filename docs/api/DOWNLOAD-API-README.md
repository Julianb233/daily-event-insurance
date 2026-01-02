# Download API - Quick Start

Partner asset download and generation system.

## Quick Links

- [Full API Documentation](./DOWNLOAD-API.md)
- [Security Guide](#security)
- [Implementation Examples](#examples)

## Overview

Three main endpoints:

1. **Download Resources** - `GET /api/downloads/[category]/[asset]`
2. **Generate Custom Assets** - `POST /api/partner/assets/generate`
3. **List Templates** - `GET /api/partner/assets/generate`

## Quick Start

### 1. Download a Resource

```typescript
const response = await fetch(
  "/api/downloads/marketing/email-templates.pdf",
  {
    headers: { Authorization: `Bearer ${token}` }
  }
)

const blob = await response.blob()
// Create download link
```

### 2. Generate Custom Asset

```typescript
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
      headline: "Your Custom Headline",
      callToAction: "Contact Us Today",
    },
  }),
})

const { downloadUrl, previewUrl } = await response.json()
```

### 3. List Available Templates

```typescript
// Get all templates
const response = await fetch("/api/partner/assets/generate", {
  headers: { Authorization: `Bearer ${token}` }
})

// Get flyer templates only
const response = await fetch(
  "/api/partner/assets/generate?assetType=flyer",
  { headers: { Authorization: `Bearer ${token}` } }
)
```

## Resource Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `marketing` | Promotional materials | Logos, flyers, social media templates |
| `training` | Educational resources | Guides, tutorials, best practices |
| `documentation` | Reference materials | Handbooks, API docs, compliance guides |

## Supported File Types

- **PDF** - Documents, guides, templates
- **ZIP** - Logo packs, resource bundles
- **PNG/JPG** - Images, graphics
- **SVG** - Vector logos, icons

## Asset Types for Generation

- **flyer** - Marketing flyers with branding
- **email** - Email templates
- **social** - Social media graphics
- **brochure** - Multi-page brochures
- **certificate** - Insurance certificates

## Security

✅ **Built-in Protection**:
- Path traversal prevention
- File type validation
- Authentication required
- Download tracking
- Rate limiting

❌ **Blocked Patterns**:
- `../../../etc/passwd`
- `.exe`, `.sh`, `.bat` files
- Null bytes in filenames

## Error Handling

```typescript
try {
  const response = await fetch(url)

  if (!response.ok) {
    const error = await response.json()
    console.error(error.message)
    throw new Error(error.message)
  }

  return await response.blob()
} catch (error) {
  // Handle network errors
}
```

## Common HTTP Status Codes

- `200` - Success
- `400` - Invalid request (category/filename/type)
- `401` - Authentication required
- `404` - Resource not found
- `429` - Rate limit exceeded
- `500` - Server error

## Integration with Frontend

The frontend at `app/(partner)/partner/materials/page.tsx` already uses these endpoints via the existing `/api/partner/resources` endpoint for listing.

For downloads, update the click handler:

```typescript
function handleResourceClick(resource: Resource) {
  if (resource.resource_type === "pdf" || resource.resource_type === "image") {
    // Use new download endpoint
    const category = resource.category
    const filename = resource.file_url.split("/").pop()

    window.location.href = `/api/downloads/${category}/${filename}`
  }
}
```

## Database Schema

Downloads are tracked in the `resource_downloads` table:

```sql
CREATE TABLE resource_downloads (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  resource_id UUID REFERENCES partner_resources(id),
  downloaded_at TIMESTAMP DEFAULT NOW()
);
```

No migration needed - table already exists in schema!

## Testing

Run tests:

```bash
npm test tests/api/downloads.test.ts
```

## Performance

- Files cached for 1 year in CDN/browser
- Download tracking is non-blocking
- Failed tracking doesn't prevent downloads
- HEAD requests for existence checks

## Next Steps

1. ✅ Endpoints created
2. ✅ Security implemented
3. ✅ Documentation complete
4. ⏳ Connect PDF generation service (future)
5. ⏳ Add S3/R2 storage for generated assets (future)
6. ⏳ Implement rate limiting middleware (future)

## Support

Questions? Check:
- [Full API Documentation](./DOWNLOAD-API.md)
- [Partner Resources Data](../../lib/partner-resources-data.ts)
- [Existing Resources Endpoint](../../app/api/partner/resources/route.ts)
