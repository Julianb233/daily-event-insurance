import { test, expect } from '@playwright/test';

// Use a subdomain that matches the one we seeded
const SUBDOMAIN = 'ocean-pacific-gym';
// In local dev, we often access subdomains via localhost with special handling or just test the logic directly
// For this E2E test, we'll assume the app rewrites subdomain requests or we can test the API endpoint directly
const MICROSITE_URL = `http://localhost:3000/api/microsite/${SUBDOMAIN}`;

test.describe('Microsite & Sure API Integration', () => {

  test('Microsite APIs should return valid HTML', async ({ request }) => {
    const response = await request.get(MICROSITE_URL);
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    expect(headers['content-type']).toContain('text/html');
    
    const html = await response.text();
    expect(html).toContain('Ocean Pacific Gym');
    // Check for the new honeypot field we added recently
    expect(html).toContain('name="website_url"');
  });

  test('Check-in Submission should trigger Sure API and return Policy', async ({ request }) => {
    // 1. Get Partner ID first (optional, but good for robustness if we had a way, 
    // but here we know the partnerId from our seed script or can query it. 
    // For E2E, we might need to hardcode it or fetch it dynamically if we had a non-auth endpoint.
    // Let's assume we are testing the endpoint directly with valid data.
    
    // We'll use the checkin API directly as if the form submitted it
    
    // First, we need to correct partner ID. In the seed script, we saw the update logic.
    // The previous run logs might show the ID or we can query it via a helper if possible.
    // However, since we can't easily query DB in a pure Playwright test without setup,
    // let's rely on the fact that we can call the checkin API if we know the partner ID.
    // IF we don't know the ID, we can't easily test the POST.
    
    // ALTERNATIVE: Use the API to generate the HTML, parse it for the Partner ID hidden field!
    const siteResponse = await request.get(MICROSITE_URL);
    const html = await siteResponse.text();
    
    // Regex to find partnerId value from hidden input
    const partnerIdMatch = html.match(/name="partnerId" value="([^"]+)"/);
    expect(partnerIdMatch).not.toBeNull();
    const partnerId = partnerIdMatch![1];
    console.log('Found Partner ID:', partnerId);

    // 2. Submit Check-in
    const checkinResponse = await request.post('http://localhost:3000/app/api/checkin', {
        data: {
            partnerId: partnerId,
            name: 'Playwright Test User',
            email: 'playwright@test.com',
            activity: 'Crossfit',
            source: 'e2e-test',
            micrositeUrl: `https://${SUBDOMAIN}.dailyeventinsurance.com`
        }
    });

    // Handle 404/500 if the path is wrong. Note the actual path is /api/checkin
    if (checkinResponse.status() === 404) {
         const retryResponse = await request.post('http://localhost:3000/api/checkin', {
            data: {
                partnerId: partnerId,
                name: 'Playwright Test User',
                email: 'playwright@test.com',
                activity: 'Crossfit',
                source: 'e2e-test',
                micrositeUrl: `https://${SUBDOMAIN}.dailyeventinsurance.com`
            }
        });
        expect(retryResponse.ok()).toBeTruthy();
        const data = await retryResponse.json();
        
        expect(data.success).toBe(true);
        expect(data.leadId).toBeDefined();
        
        // 3. Verify Sure API Response in Payload
        expect(data.policy).toBeDefined();
        expect(data.policy.success).toBe(true);
        expect(data.policy.status).toBe('active');
        expect(data.policy.policyNumber).toContain('POL-');
    } else {
        expect(checkinResponse.ok()).toBeTruthy();
        const data = await checkinResponse.json();
        
        expect(data.success).toBe(true);
        expect(data.leadId).toBeDefined();
        
        // 3. Verify Sure API Response in Payload
        expect(data.policy).toBeDefined();
        expect(data.policy.success).toBe(true);
        expect(data.policy.status).toBe('active');
        expect(data.policy.policyNumber).toContain('POL-');
    }
  });

});
