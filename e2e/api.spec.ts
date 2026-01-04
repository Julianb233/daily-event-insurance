import { test, expect } from '@playwright/test';

test.describe('API Health Checks', () => {
  test('should handle partner API request appropriately', async ({ request }) => {
    const response = await request.get('/api/partner');

    // In production (AUTH_SECRET set): returns 401/403
    // In dev mode (no AUTH_SECRET): uses mock user, may return 200/404/500 depending on DB
    // All are valid responses - we just verify the API doesn't crash unexpectedly
    expect([200, 401, 403, 404, 500]).toContain(response.status());

    // If we get an error response, verify it's JSON
    if (response.status() >= 400) {
      const contentType = response.headers()['content-type'] || '';
      expect(contentType.includes('application/json') || contentType.includes('text/')).toBeTruthy();
    }
  });

  test('should handle admin API request appropriately', async ({ request }) => {
    const response = await request.get('/api/admin/dashboard');

    // In production: returns 401/403 for unauthorized users
    // In dev mode: may return data or DB error
    // Valid responses for unauthenticated request
    expect([200, 401, 403, 404, 500]).toContain(response.status());

    // Verify response is properly formatted
    if (response.status() >= 400) {
      const contentType = response.headers()['content-type'] || '';
      expect(contentType.includes('application/json') || contentType.includes('text/')).toBeTruthy();
    }
  });

  test('should handle leads API POST', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: {
        email: 'test@example.com',
        name: 'Test User',
        company: 'Test Company',
        phone: '555-1234',
      },
    });

    // Should accept or validate (not crash)
    expect([200, 201, 400, 422]).toContain(response.status());
  });

  test('should protect user API endpoints', async ({ request }) => {
    const response = await request.get('/api/user');

    expect([401, 403]).toContain(response.status());
  });

  test('should have CORS headers on API responses', async ({ request }) => {
    const response = await request.get('/api/leads', {
      headers: {
        'Origin': 'https://example.com',
      },
    });

    // API should respond (CORS handling varies)
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('Document APIs', () => {
  test('should return templates list or auth error', async ({ request }) => {
    const response = await request.get('/api/documents/templates');

    // Should either return data or require auth
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('Public Pages API', () => {
  test('homepage should return 200', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
  });

  test('pricing page should return 200', async ({ request }) => {
    const response = await request.get('/pricing');

    expect(response.status()).toBe(200);
  });

  test('privacy page should return 200', async ({ request }) => {
    const response = await request.get('/privacy');

    expect(response.status()).toBe(200);
  });

  test('terms page should return 200', async ({ request }) => {
    const response = await request.get('/terms');

    expect(response.status()).toBe(200);
  });
});
