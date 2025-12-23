#!/usr/bin/env node
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToOptimize = [
  {
    input: 'public/images/og-image.png',
    maxSize: 100, // KB
    quality: 85,
  },
  {
    input: 'public/images/hero-shield.png',
    maxSize: 150, // KB
    quality: 85,
  },
  {
    input: 'public/images/partner-adventure.png',
    maxSize: 300, // KB
    quality: 80,
  },
  {
    input: 'public/images/partner-climbing.png',
    maxSize: 300, // KB
    quality: 80,
  },
  {
    input: 'public/images/partner-gym.png',
    maxSize: 300, // KB
    quality: 80,
  },
  {
    input: 'public/images/partner-rentals.png',
    maxSize: 300, // KB
    quality: 80,
  },
];

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatSize(bytes) {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }
  return `${kb.toFixed(2)} KB`;
}

async function optimizeImage(config) {
  const inputPath = path.join(__dirname, config.input);
  const ext = path.extname(config.input);
  const baseName = path.basename(config.input, ext);
  const dirName = path.dirname(config.input);
  const outputPath = path.join(__dirname, dirName, `${baseName}${ext}`);
  const webpPath = path.join(__dirname, dirName, `${baseName}.webp`);

  try {
    // Get original size
    const originalSize = await getFileSize(inputPath);

    console.log(`\nOptimizing ${config.input}...`);
    console.log(`  Original size: ${formatSize(originalSize)}`);

    // Create WebP version (much smaller)
    await sharp(inputPath)
      .webp({ quality: config.quality, effort: 6 })
      .toFile(webpPath);

    const webpSize = await getFileSize(webpPath);
    console.log(`  WebP size: ${formatSize(webpSize)} (${((webpSize / originalSize) * 100).toFixed(1)}% of original)`);

    // Optimize PNG as well
    let quality = config.quality;
    let optimizedSize = originalSize;
    let attempts = 0;
    const maxAttempts = 5;

    while (optimizedSize > config.maxSize * 1024 && attempts < maxAttempts) {
      await sharp(inputPath)
        .png({
          quality: quality,
          compressionLevel: 9,
          effort: 10,
          adaptiveFiltering: true,
          palette: true
        })
        .toFile(outputPath + '.tmp');

      optimizedSize = await getFileSize(outputPath + '.tmp');

      if (optimizedSize <= config.maxSize * 1024) {
        await fs.rename(outputPath + '.tmp', outputPath);
        break;
      }

      quality -= 10;
      attempts++;
    }

    if (attempts === maxAttempts) {
      // Just use best compression we achieved
      await fs.rename(outputPath + '.tmp', outputPath);
    }

    const finalSize = await getFileSize(outputPath);
    console.log(`  Optimized PNG size: ${formatSize(finalSize)} (${((finalSize / originalSize) * 100).toFixed(1)}% of original)`);

    const savings = originalSize - finalSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    console.log(`  Savings: ${formatSize(savings)} (${savingsPercent}%)`);

    return {
      file: config.input,
      originalSize,
      optimizedSize: finalSize,
      webpSize,
      savings,
      savingsPercent
    };

  } catch (error) {
    console.error(`Error optimizing ${config.input}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Image Optimization Script');
  console.log('=========================\n');

  const results = [];

  for (const config of imagesToOptimize) {
    const result = await optimizeImage(config);
    if (result) {
      results.push(result);
    }
  }

  // Summary
  console.log('\n\n📊 OPTIMIZATION SUMMARY');
  console.log('======================\n');

  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalWebp = 0;

  results.forEach(r => {
    totalOriginal += r.originalSize;
    totalOptimized += r.optimizedSize;
    totalWebp += r.webpSize;
  });

  console.log(`Total original size: ${formatSize(totalOriginal)}`);
  console.log(`Total optimized PNG size: ${formatSize(totalOptimized)}`);
  console.log(`Total WebP size: ${formatSize(totalWebp)}`);
  console.log(`\nTotal savings (PNG): ${formatSize(totalOriginal - totalOptimized)} (${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%)`);
  console.log(`Total savings (WebP): ${formatSize(totalOriginal - totalWebp)} (${((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1)}%)`);

  console.log('\n✅ Optimization complete!');
  console.log('\nRecommendation: Use WebP images with PNG fallback for best performance.');
  console.log('Both formats have been generated for each image.');
}

main().catch(console.error);
