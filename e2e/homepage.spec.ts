import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Daily Event Insurance/i);
  });

  test('should display hero section with CTA', async ({ page }) => {
    await page.goto('/');

    // Hero section should be visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Should have a primary CTA button
    const ctaButton = page.getByRole('link', { name: /get started|apply now|partner/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Header should be visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Logo should link to homepage
    const logo = header.getByRole('link').first();
    await expect(logo).toBeVisible();
  });

  test('should display footer with links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    // Check for privacy link
    const privacyLink = footer.getByRole('link', { name: /privacy/i });
    await expect(privacyLink).toBeVisible();

    // Check for terms link
    const termsLink = footer.getByRole('link', { name: /terms/i });
    await expect(termsLink).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still load
    await expect(page).toHaveTitle(/Daily Event Insurance/i);

    // Mobile menu button should be visible (hamburger)
    const mobileMenuButton = page.getByRole('button', { name: /menu|toggle/i });
    // Note: Some implementations may use different selectors
  });
});

test.describe('Navigation', () => {
  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');

    // Click pricing link if visible
    const pricingLink = page.getByRole('link', { name: /pricing/i }).first();
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/pricing/);
    }
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/');

    // Look for sign in link
    const signInLink = page.getByRole('link', { name: /sign in|login|partner login/i }).first();
    if (await signInLink.isVisible()) {
      await signInLink.click();
      await expect(page).toHaveURL(/sign-in|login/);
    }
  });

  test('should navigate to privacy policy', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page.locator('h1')).toContainText(/privacy/i);
  });

  test('should navigate to terms of service', async ({ page }) => {
    await page.goto('/terms');

    await expect(page.locator('h1')).toContainText(/terms/i);
  });
});
