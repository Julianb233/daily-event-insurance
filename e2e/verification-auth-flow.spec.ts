import { test, expect } from '@playwright/test';

test.describe('Auth Flow Verification', () => {
    test('should create user on backend (verified via duplicate sign-up check)', async ({ page }) => {
        // Generate unique user details
        const timestamp = Date.now();
        const email = `test.user.${timestamp}@gmail.com`;
        const password = 'Password123!';

        // 1. Sign Up
        console.log(`Starting sign up for ${email}...`);
        await page.goto('/sign-up');

        await page.getByLabel('Full name').fill('Test User');
        await page.getByLabel('Email address').fill(email);
        await page.getByLabel('Password', { exact: true }).fill(password);
        await page.getByLabel('Confirm password').fill(password);

        await page.getByRole('button', { name: /create account/i }).click();

        // 2. Verify Outcome
        // If confirmation is ON, we are redirected to /sign-in (via middleware protection of /onboarding)
        // If confirmation is OFF, we are redirected to /onboarding

        // Wait for navigation
        await page.waitForURL(/\/sign-in|\/onboarding/, { timeout: 15000 });
        const url = page.url();
        console.log(`Redirected to: ${url}`);

        if (url.includes('/sign-in')) {
            console.log('Redirected to sign-in, implying email confirmation is required.');
        } else {
            console.log('Redirected to onboarding, auto-login worked.');
        }

        // 3. Verify Backend Persistence Check
        // Try to sign up SAME user again
        console.log('Attempting duplicate sign up to verify backend persistence...');
        await page.goto('/sign-up');
        await page.getByLabel('Full name').fill('Test User');
        await page.getByLabel('Email address').fill(email);
        await page.getByLabel('Password', { exact: true }).fill(password);
        await page.getByLabel('Confirm password').fill(password);

        await page.getByRole('button', { name: /create account/i }).click();

        // Expect error message
        // Note: The error message might vary based on Supabase config ("User already registered" or security obfuscation)
        // But we expect it NOT to redirect successfully again (or show error).

        // We check for error text
        const errorLocator = page.locator('.bg-red-50');
        await expect(errorLocator).toBeVisible({ timeout: 10000 });
        const errorText = await errorLocator.textContent();
        console.log(`Duplicate sign up got error: ${errorText}`);

        // Supabase usually returns "User already registered" or similar.
        expect(errorText).toMatch(/registered|exists|already/i);
    });
});
