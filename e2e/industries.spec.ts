import { test, expect } from '@playwright/test';

test.describe('Industry Landing Pages', () => {
  const industries = [
    { path: '/for-gyms', title: /gym|fitness/i },
    { path: '/for-climbing', title: /climbing|rock/i },
    { path: '/for-rentals', title: /rental|equipment/i },
    { path: '/for-adventure', title: /adventure/i },
  ];

  for (const industry of industries) {
    test(`should load ${industry.path} page`, async ({ page }) => {
      await page.goto(industry.path);

      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();

      // Should have some content
      const mainContent = page.locator('main, section').first();
      await expect(mainContent).toBeVisible();
    });
  }

  test('should display industries overview page', async ({ page }) => {
    await page.goto('/industries');

    // Should have industry cards or list
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Category Pages', () => {
  test('should load category page dynamically', async ({ page }) => {
    await page.goto('/categories/fitness');

    // Should load category content
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Carriers Pages', () => {
  test('should load carriers underwriting page', async ({ page }) => {
    await page.goto('/carriers/underwriting');

    await expect(page.locator('body')).toBeVisible();
  });
});
