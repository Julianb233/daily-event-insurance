#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

const IMAGE_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(IMAGE_DIR, 'originals');
const MIN_SIZE_KB = 500;

// Priority images used on main pages
const PRIORITY_IMAGES = [
  'og-wizard-of-ai.png',
  'wizard-hero-desktop.png',
  'wizard-hero-mobile.png',
  'wizard-hero.png',
  'wizard-logo-long.png',
  'golden-ticket.png',
  'hero-desktop.png',
  'hero-mobile.png',
  'hero-mobile-new.png',
  'hero-blank-mobile.png',
  'ai-yellow-brick-road.png',
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function compressImage(filepath, isPriority = false) {
  const filename = path.basename(filepath);
  const ext = path.extname(filename).toLowerCase();
  const stats = await stat(filepath);
  const originalSizeKB = stats.size / 1024;

  // Skip if under 500KB and not priority
  if (originalSizeKB < MIN_SIZE_KB && !isPriority) {
    return null;
  }

  console.log(`\nProcessing: ${filename} (${formatBytes(stats.size)})`);

  // Create backup
  try {
    await mkdir(BACKUP_DIR, { recursive: true });
    const backupPath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(backupPath)) {
      await fs.promises.copyFile(filepath, backupPath);
      console.log(`  Backed up to: originals/${filename}`);
    }
  } catch (err) {
    console.error(`  Warning: Could not backup ${filename}:`, err.message);
  }

  const results = {
    filename,
    originalSize: stats.size,
    compressed: []
  };

  try {
    // Create WebP version (best compression)
    const webpPath = filepath.replace(ext, '.webp');
    await sharp(filepath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);

    const webpStats = await stat(webpPath);
    const savedBytes = stats.size - webpStats.size;
    const savedPercent = Math.round((savedBytes / stats.size) * 100);

    console.log(`  WebP:     ${formatBytes(webpStats.size)} (saved ${savedPercent}%)`);

    results.compressed.push({
      format: 'webp',
      size: webpStats.size,
      savedBytes,
      savedPercent
    });

    // For PNG files, also create optimized PNG
    if (ext === '.png') {
      const optimizedPath = filepath.replace('.png', '-optimized.png');
      await sharp(filepath)
        .png({ quality: 85, compressionLevel: 9, effort: 10 })
        .toFile(optimizedPath);

      const pngStats = await stat(optimizedPath);
      const pngSavedBytes = stats.size - pngStats.size;
      const pngSavedPercent = Math.round((pngSavedBytes / stats.size) * 100);

      console.log(`  PNG (opt): ${formatBytes(pngStats.size)} (saved ${pngSavedPercent}%)`);

      results.compressed.push({
        format: 'png-optimized',
        size: pngStats.size,
        savedBytes: pngSavedBytes,
        savedPercent: pngSavedPercent
      });

      // If optimized PNG is better, replace original
      if (pngStats.size < stats.size) {
        await fs.promises.copyFile(optimizedPath, filepath);
        await fs.promises.unlink(optimizedPath);
        console.log(`  Replaced original with optimized PNG`);
      } else {
        await fs.promises.unlink(optimizedPath);
      }
    }

    // For JPEG files, create optimized JPEG
    if (ext === '.jpg' || ext === '.jpeg') {
      const optimizedPath = filepath.replace(ext, `-optimized${ext}`);
      await sharp(filepath)
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toFile(optimizedPath);

      const jpegStats = await stat(optimizedPath);
      const jpegSavedBytes = stats.size - jpegStats.size;
      const jpegSavedPercent = Math.round((jpegSavedBytes / stats.size) * 100);

      console.log(`  JPEG (opt): ${formatBytes(jpegStats.size)} (saved ${jpegSavedPercent}%)`);

      results.compressed.push({
        format: 'jpeg-optimized',
        size: jpegStats.size,
        savedBytes: jpegSavedBytes,
        savedPercent: jpegSavedPercent
      });

      // If optimized JPEG is better, replace original
      if (jpegStats.size < stats.size) {
        await fs.promises.copyFile(optimizedPath, filepath);
        await fs.promises.unlink(optimizedPath);
        console.log(`  Replaced original with optimized JPEG`);
      } else {
        await fs.promises.unlink(optimizedPath);
      }
    }

  } catch (err) {
    console.error(`  Error compressing ${filename}:`, err.message);
    return null;
  }

  return results;
}

async function findLargeImages(dir) {
  const files = await readdir(dir);
  const imageFiles = [];

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = await stat(filepath);

    if (stats.isDirectory()) {
      if (file !== 'originals') {
        // Recursively search subdirectories
        const subImages = await findLargeImages(filepath);
        imageFiles.push(...subImages);
      }
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const sizeKB = stats.size / 1024;
      if (sizeKB > MIN_SIZE_KB) {
        imageFiles.push({
          filepath,
          filename: file,
          size: stats.size,
          sizeKB,
          isPriority: PRIORITY_IMAGES.includes(file)
        });
      }
    }
  }

  return imageFiles;
}

async function main() {
  console.log('Image Compression Tool');
  console.log('======================\n');
  console.log(`Searching for images over ${MIN_SIZE_KB}KB in: ${IMAGE_DIR}\n`);

  const images = await findLargeImages(IMAGE_DIR);

  // Sort by priority first, then by size descending
  images.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return b.size - a.size;
  });

  console.log(`Found ${images.length} images to compress\n`);

  if (images.length === 0) {
    console.log('No images found over 500KB.');
    return;
  }

  const priorityImages = images.filter(img => img.isPriority);
  const otherImages = images.filter(img => !img.isPriority);

  console.log('\n========================================');
  console.log('PRIORITY IMAGES (Used on Main Pages)');
  console.log('========================================');

  const results = [];
  let totalSaved = 0;

  for (const img of priorityImages) {
    const result = await compressImage(img.filepath, true);
    if (result) {
      results.push(result);
      const maxSaved = Math.max(...result.compressed.map(c => c.savedBytes));
      totalSaved += maxSaved;
    }
  }

  console.log('\n========================================');
  console.log('OTHER LARGE IMAGES');
  console.log('========================================');

  for (const img of otherImages) {
    const result = await compressImage(img.filepath, false);
    if (result) {
      results.push(result);
      const maxSaved = Math.max(...result.compressed.map(c => c.savedBytes));
      totalSaved += maxSaved;
    }
  }

  console.log('\n========================================');
  console.log('COMPRESSION SUMMARY');
  console.log('========================================');
  console.log(`Total images processed: ${results.length}`);
  console.log(`Total space saved: ${formatBytes(totalSaved)}`);
  console.log(`Originals backed up to: ${BACKUP_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Update image references to use .webp format with fallbacks');
  console.log('2. Consider using Next.js Image component for automatic format selection');
  console.log('3. Test the website to ensure images display correctly');
  console.log('4. Remove backup files after confirming everything works');

  // Generate detailed report
  console.log('\n========================================');
  console.log('DETAILED REPORT');
  console.log('========================================');

  for (const result of results) {
    console.log(`\n${result.filename}:`);
    console.log(`  Original: ${formatBytes(result.originalSize)}`);
    for (const compressed of result.compressed) {
      console.log(`  ${compressed.format}: ${formatBytes(compressed.size)} (saved ${compressed.savedPercent}%)`);
    }
  }
}

main().catch(console.error);
