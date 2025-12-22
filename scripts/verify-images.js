#!/usr/bin/env node

/**
 * Image Optimization Verification Script
 * Checks that all optimizations are in place and working correctly
 */

const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../public/images');
const COMPONENTS_DIR = path.join(__dirname, '../components');
const APP_DIR = path.join(__dirname, '../app');

const PRIORITY_IMAGES = [
  'og-wizard-of-ai',
  'wizard-hero-desktop',
  'wizard-hero-mobile',
  'wizard-hero',
  'wizard-logo-long',
  'golden-ticket',
  'hero-desktop',
  'hero-mobile',
];

console.log('Image Optimization Verification\n');
console.log('================================\n');

let passed = 0;
let failed = 0;
let warnings = 0;

function pass(msg) {
  console.log('✅', msg);
  passed++;
}

function fail(msg) {
  console.log('❌', msg);
  failed++;
}

function warn(msg) {
  console.log('⚠️ ', msg);
  warnings++;
}

// Check 1: Verify WebP files exist
console.log('\n1. Checking WebP files...');
PRIORITY_IMAGES.forEach(img => {
  const webpPath = path.join(IMAGE_DIR, `${img}.webp`);
  if (fs.existsSync(webpPath)) {
    const stats = fs.statSync(webpPath);
    const sizeKB = Math.round(stats.size / 1024);
    if (sizeKB > 500) {
      warn(`${img}.webp exists but is ${sizeKB}KB (over 500KB target)`);
    } else {
      pass(`${img}.webp exists (${sizeKB}KB)`);
    }
  } else {
    fail(`${img}.webp not found`);
  }
});

// Check 2: Verify backup directory exists
console.log('\n2. Checking backup directory...');
const backupDir = path.join(IMAGE_DIR, 'originals');
if (fs.existsSync(backupDir)) {
  const backupFiles = fs.readdirSync(backupDir);
  pass(`Backup directory exists with ${backupFiles.length} files`);
} else {
  fail('Backup directory not found');
}

// Check 3: Verify component updates
console.log('\n3. Checking component updates...');

// Check hero-section.tsx
const heroPath = path.join(COMPONENTS_DIR, 'hero-section.tsx');
if (fs.existsSync(heroPath)) {
  const heroContent = fs.readFileSync(heroPath, 'utf8');
  if (heroContent.includes('wizard-hero-desktop.webp')) {
    pass('hero-section.tsx uses WebP images');
  } else {
    fail('hero-section.tsx not updated to use WebP');
  }
}

// Check intro-section.tsx
const introPath = path.join(COMPONENTS_DIR, 'intro-section.tsx');
if (fs.existsSync(introPath)) {
  const introContent = fs.readFileSync(introPath, 'utf8');
  if (introContent.includes('wizard-logo-long.webp')) {
    pass('intro-section.tsx uses WebP logo');
  } else {
    fail('intro-section.tsx not updated to use WebP');
  }
}

// Check layout.tsx
const layoutPath = path.join(APP_DIR, 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('og-wizard-of-ai.webp')) {
    pass('layout.tsx uses WebP for OG image');
  } else {
    fail('layout.tsx not updated to use WebP');
  }
}

// Check 4: Verify optimized-image component exists
console.log('\n4. Checking optimization components...');
const optimizedImagePath = path.join(COMPONENTS_DIR, 'optimized-image.tsx');
if (fs.existsSync(optimizedImagePath)) {
  pass('optimized-image.tsx component exists');
} else {
  warn('optimized-image.tsx component not found (optional)');
}

// Check 5: Verify compression script exists
console.log('\n5. Checking compression script...');
const scriptPath = path.join(__dirname, 'compress-images.js');
if (fs.existsSync(scriptPath)) {
  pass('compress-images.js script exists');
} else {
  fail('compress-images.js script not found');
}

// Check 6: Look for large images that should be compressed
console.log('\n6. Checking for unoptimized large images...');
const imageFiles = fs.readdirSync(IMAGE_DIR);
const largeImages = imageFiles.filter(file => {
  if (file === 'originals') return false;
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return false;

  const filePath = path.join(IMAGE_DIR, file);
  const stats = fs.statSync(filePath);
  return stats.size > 500 * 1024; // Over 500KB
});

if (largeImages.length === 0) {
  pass('No unoptimized large images found');
} else {
  warn(`Found ${largeImages.length} images over 500KB that may need optimization:`);
  largeImages.forEach(img => {
    const stats = fs.statSync(path.join(IMAGE_DIR, img));
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   - ${img} (${sizeMB} MB)`);
  });
}

// Check 7: Verify documentation exists
console.log('\n7. Checking documentation...');
const docsDir = path.join(__dirname, '../docs');
const guideExists = fs.existsSync(path.join(docsDir, 'image-optimization-guide.md'));
const reportExists = fs.existsSync(path.join(__dirname, '../IMAGE-OPTIMIZATION-REPORT.md'));

if (guideExists) {
  pass('Image optimization guide exists');
} else {
  warn('Image optimization guide not found');
}

if (reportExists) {
  pass('Optimization report exists');
} else {
  warn('Optimization report not found');
}

// Summary
console.log('\n================================');
console.log('VERIFICATION SUMMARY');
console.log('================================');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log('');

if (failed === 0) {
  console.log('🎉 All critical checks passed!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Test all pages for image display');
  console.log('3. Run Lighthouse audit');
  console.log('4. Deploy to production');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please review the errors above.');
  process.exit(1);
}
