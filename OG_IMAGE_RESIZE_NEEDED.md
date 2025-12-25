# OG Image Resize Required

## Issue
The current Open Graph image (`/public/images/og-image.png`) has dimensions of **1024x1024**, but the recommended size for optimal display across social media platforms is **1200x630**.

## Current Status
- **File:** `/public/images/og-image.png`
- **Current Dimensions:** 1024x1024 (1:1 square)
- **Required Dimensions:** 1200x630 (1.91:1 landscape)

## Why This Matters
Social media platforms (Facebook, Twitter/X, LinkedIn) display Open Graph images in a 1.91:1 landscape format. The current square image will be:
- Cropped or letterboxed
- Not utilizing full preview space
- Potentially cutting off important branding elements

## Recommended Action
Resize the image using one of these methods:

### Option 1: Using ImageMagick (command line)
```bash
convert /root/github-repos/daily-event-insurance/public/images/og-image.png \
  -resize 1200x630^ \
  -gravity center \
  -extent 1200x630 \
  /root/github-repos/daily-event-insurance/public/images/og-image-new.png
```

### Option 2: Using a Design Tool
- Open the image in Figma, Photoshop, or Canva
- Create a new 1200x630 canvas
- Center the logo and adjust layout for landscape format
- Export as PNG

### Option 3: Online Tool
- Use [Cloudinary](https://cloudinary.com/tools/image-resize) or similar
- Upload the current image
- Resize to 1200x630
- Download and replace

## References
- [Open Graph Protocol Best Practices](https://ogp.me/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Status
- [ ] Image needs to be resized by designer or with image editing tool
- Current metadata in `app/layout.tsx` already specifies 1200x630 (lines 66-68)
