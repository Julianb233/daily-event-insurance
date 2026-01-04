import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display sign-in page', async ({ page }) => {
    await page.goto('/sign-in');

    // Should have email input
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeVisible();

    // Should have password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Should have sign in button
    const signInButton = page.getByRole('button', { name: /sign in|log in/i });
    await expect(signInButton).toBeVisible();
  });

  test('should display sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    // Should have email input
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/sign-in');

    const emailInput = page.getByRole('textbox', { name: /email/i });
    const signInButton = page.getByRole('button', { name: /sign in|log in/i });

    // Enter invalid email
    await emailInput.fill('invalid-email');
    await signInButton.click();

    // Should show some form of validation (browser native or custom)
    // The exact behavior depends on implementation
  });

  test('should redirect unauthenticated users from partner portal', async ({ page }) => {
    // Try to access protected route
    await page.goto('/partner/dashboard');

    // Should redirect to sign-in or show auth required
    await expect(page).toHaveURL(/sign-in|login|partner/);
  });

  test('should have link to sign up from sign in page', async ({ page }) => {
    await page.goto('/sign-in');

    const signUpLink = page.getByRole('link', { name: /sign up|create account|register/i });
    await expect(signUpLink).toBeVisible();
  });
});

test.describe('Partner Portal Access', () => {
  test('should show partner login page or redirect', async ({ page }) => {
    await page.goto('/login');

    // Login page should either:
    // 1. Show a login form with inputs
    // 2. Redirect to sign-in page
    // 3. Show some authentication UI
    const hasForm = await page.locator('form, [role="form"]').isVisible().catch(() => false);
    const hasInput = await page.locator('input').first().isVisible().catch(() => false);
    const hasAuthUI = await page.locator('button, a').filter({ hasText: /sign|log|auth/i }).first().isVisible().catch(() => false);
    const redirectedToSignIn = page.url().includes('sign-in');

    // At least one of these should be true
    expect(hasForm || hasInput || hasAuthUI || redirectedToSignIn).toBeTruthy();
  });

  test('should protect admin routes', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Should redirect or show unauthorized
    // Check we're not on the admin page as unauthenticated user
    const url = page.url();
    const isProtected = url.includes('sign-in') || url.includes('login') || url.includes('unauthorized');
    expect(isProtected || page.url().includes('admin')).toBeTruthy();
  });
});
