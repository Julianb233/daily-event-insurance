import { test, expect } from '@playwright/test';

test.describe('Microsite Generation & Deployment', () => {

    test('Ocean Pacific Gym Microsite loads correctly', async ({ page }) => {
        // Accessing the API route directly to verify content generation 
        // Logic: Middleware rewrites subdomain -> /api/microsite/[subdomain]
        // This test verifies that the destination of that rewrite is working.
        const response = await page.goto('/api/microsite/ocean-pacific-gym');

        // 1. Verify Status
        expect(response?.status()).toBe(200);

        // 2. Verify Page Title and Header
        // The title should track the partner name
        await expect(page).toHaveTitle(/Ocean Pacific Gym/);

        // Check for the main heading or hero text
        await expect(page.getByRole('heading', { name: 'Ocean Pacific Gym' }).first()).toBeVisible();

        // 3. Verify CTA Button
        const cta = page.getByRole('link', { name: /Get Covered|Start Quote/i });
        await expect(cta).toBeVisible();

        // Verify CTA links to the quote flow
        await expect(cta).toHaveAttribute('href', /https:\/\/ocean-pacific-gym\.dailyeventinsurance\.com\/quote/);

        // 4. Verify Visual Elements
        // QR Code existence
        await expect(page.locator('img[alt="QR Code"]')).toBeVisible();

        // Check for branding color usage (Ocean Pacific teal/blue)
        // Hard to assert computed styles across browsers easily, but absence of errors is good.
    });

});
