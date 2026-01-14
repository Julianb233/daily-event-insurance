# Integration Troubleshooting Guide

Common issues and solutions for Daily Event Insurance integrations.

## Table of Contents

- [Widget Issues](#widget-issues)
- [API Authentication Errors](#api-authentication-errors)
- [Webhook Delivery Failures](#webhook-delivery-failures)
- [CORS Issues](#cors-issues)
- [POS Integration Issues](#pos-integration-issues)
- [Payment Processing Issues](#payment-processing-issues)
- [Performance Issues](#performance-issues)
- [Debugging Tools](#debugging-tools)

---

## Widget Issues

### Widget Not Loading

**Symptoms:**
- No floating button appears
- Console shows 404 or loading errors
- Widget container is empty

**Common Causes & Solutions:**

#### 1. Script Not Loading

**Check:** Open browser console (F12) and look for network errors.

```javascript
// Verify script loaded
if (typeof DailyEventWidget === 'undefined') {
  console.error('Widget script not loaded');
}
```

**Solutions:**
- Verify script URL is correct:
  ```html
  <script src="https://widget.dailyevent.com/v1/embed.js"></script>
  ```
- Check for ad blockers or content security policies
- Ensure HTTPS is used (HTTP will fail)

#### 2. Invalid Partner ID

**Check:** Console shows "Invalid partner ID" error.

**Solutions:**
- Verify partner ID in dashboard
- Check for typos or extra whitespace
- Ensure account is active

```javascript
// Correct
DailyEventWidget.init({
  partnerId: 'ptr_abc123def456'  // No spaces, exact match
});

// Incorrect
DailyEventWidget.init({
  partnerId: ' ptr_abc123def456'  // Leading space
});
```

#### 3. Container Not Found (Inline Mode)

**Check:** Console shows "Container element not found".

**Solutions:**
```javascript
// Ensure container exists before init
document.addEventListener('DOMContentLoaded', () => {
  DailyEventWidget.init({
    partnerId: 'YOUR_PARTNER_ID',
    container: '#insurance-widget-container',
    mode: 'inline'
  });
});
```

#### 4. CSS Conflicts

**Check:** Widget appears but is styled incorrectly or hidden.

**Solutions:**
```css
/* Reset potential conflicts */
#dei-widget-container {
  all: initial;
}

/* Ensure visibility */
.dei-widget-button {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

#### 5. Z-Index Issues

**Check:** Widget is behind other elements.

**Solutions:**
```javascript
DailyEventWidget.init({
  partnerId: 'YOUR_PARTNER_ID',
  zIndex: 99999  // Higher than other elements
});
```

### Widget Loads But Not Functioning

**Symptoms:**
- Widget appears but clicks don't work
- Form submissions fail
- Loading spinner never stops

**Solutions:**

#### 1. Check Network Requests

Open Network tab in browser DevTools:
- Look for failed API calls (4xx or 5xx status)
- Check for blocked requests

#### 2. Verify API Key

```javascript
// Test API connectivity
fetch('https://api.dailyevent.com/v1/health', {
  headers: {
    'X-Partner-ID': 'YOUR_PARTNER_ID'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

#### 3. Check for JavaScript Errors

Look for errors in console that might prevent widget interaction:
```javascript
window.onerror = function(msg, url, line) {
  console.log('JS Error:', msg, 'at', url, 'line', line);
};
```

---

## API Authentication Errors

### 401 Unauthorized

**Symptoms:**
```json
{
  "error": "unauthorized",
  "message": "Invalid or missing API key"
}
```

**Solutions:**

#### 1. Verify API Key Format

```bash
# Correct format
Authorization: Bearer sk_live_abc123...

# Common mistakes
Authorization: sk_live_abc123...      # Missing "Bearer "
Authorization: Bearer "sk_live_abc..."  # Extra quotes
Authorization:Bearer sk_live_abc...    # Missing space
```

#### 2. Check Key Type

| Key Prefix | Environment |
|------------|-------------|
| `sk_live_` | Production |
| `sk_test_` | Sandbox |

Ensure you're using the correct key for your environment.

#### 3. Verify Key Is Active

1. Go to Partner Dashboard > Settings > API Keys
2. Check key status is "Active"
3. Regenerate if needed

#### 4. Check for IP Restrictions

If IP allowlisting is enabled:
1. Dashboard > API Keys > Select key
2. Verify your server IP is in the allowlist
3. Add your IP if missing

### 403 Forbidden

**Symptoms:**
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions for this resource"
}
```

**Solutions:**

#### 1. Check API Key Scopes

Your key may not have required permissions:

| Endpoint | Required Scope |
|----------|---------------|
| `POST /quotes` | `quotes:write` |
| `GET /policies` | `policies:read` |
| `POST /webhooks` | `webhooks:manage` |

#### 2. Verify Resource Ownership

You can only access resources belonging to your partner account.

#### 3. Check Account Status

Suspended or limited accounts receive 403 errors.

---

## Webhook Delivery Failures

### Webhooks Not Received

**Symptoms:**
- No webhook events in logs
- Events occur but endpoint not called

**Diagnostic Steps:**

#### 1. Check Webhook Configuration

```bash
curl -X GET https://api.dailyevent.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Verify:
- Webhook is active
- URL is correct
- Events are subscribed

#### 2. Check Endpoint Accessibility

Test from external network:
```bash
curl -X POST https://your-endpoint.com/webhooks \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

#### 3. Verify SSL Certificate

- Certificate must be valid (not expired)
- Must be trusted (no self-signed in production)
- Must match domain exactly

#### 4. Check Firewall Rules

Whitelist Daily Event IP ranges:
```
52.27.180.0/24
54.200.150.0/24
35.167.200.0/24
```

### Webhook Signature Validation Failures

**Symptoms:**
```
Error: Invalid webhook signature
```

**Solutions:**

#### 1. Verify Secret Key

Ensure you're using the correct webhook secret:
```javascript
// Dashboard > Integrations > Webhooks > Secret
const WEBHOOK_SECRET = 'whsec_...';
```

#### 2. Check Signature Calculation

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  // Parse signature header
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t=')).slice(2);
  const sig = parts.find(p => p.startsWith('v1=')).slice(3);

  // Calculate expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(sig, 'hex'),
    Buffer.from(expected, 'hex')
  );
}
```

#### 3. Check Payload Parsing

Ensure you're using the raw request body:
```javascript
// Express
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body.toString('utf8');
  const signature = req.headers['x-dei-signature'];
  // Verify with rawBody, not parsed JSON
});
```

### Webhook Timeout Errors

**Symptoms:**
- Webhooks marked as "failed" due to timeout
- Retry attempts occurring

**Solutions:**

#### 1. Respond Quickly

Return 200 within 5 seconds:
```javascript
app.post('/webhook', async (req, res) => {
  // Acknowledge immediately
  res.status(200).json({ received: true });

  // Process asynchronously
  processWebhookAsync(req.body);
});

async function processWebhookAsync(event) {
  // Heavy processing here
}
```

#### 2. Use Queue Processing

```javascript
const Queue = require('bull');
const webhookQueue = new Queue('webhooks');

app.post('/webhook', (req, res) => {
  webhookQueue.add(req.body);
  res.status(200).json({ received: true });
});

webhookQueue.process(async (job) => {
  await processEvent(job.data);
});
```

---

## CORS Issues

### Symptoms

```
Access to fetch at 'https://api.dailyevent.com/v1/...' from origin
'https://yoursite.com' has been blocked by CORS policy
```

### Solutions

#### 1. Verify Domain Registration

Your domain must be registered in the partner dashboard:

1. Go to Dashboard > Settings > Domains
2. Add your domain (e.g., `yoursite.com`)
3. Include all subdomains if needed

#### 2. Check Request Origin

The `Origin` header must match a registered domain:
```javascript
// Correct: Request from registered domain
fetch('https://api.dailyevent.com/v1/quotes', {
  method: 'POST',
  // Origin: https://yoursite.com (automatic)
});
```

#### 3. Development Domains

For local development, add:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`

#### 4. Use Server-Side Requests

For sensitive operations, make requests server-side:
```javascript
// Client (browser)
const response = await fetch('/api/create-quote', {
  method: 'POST',
  body: JSON.stringify(quoteData)
});

// Server (no CORS issues)
app.post('/api/create-quote', async (req, res) => {
  const result = await dailyEventAPI.quotes.create(req.body);
  res.json(result);
});
```

### Common CORS Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Missing CORS headers | Domain not registered | Add domain in dashboard |
| Preflight failed | Invalid headers | Remove custom headers |
| Origin not allowed | Wrong domain | Check exact match |
| Credentials mode | Credentials with wildcard | Use specific origin |

---

## POS Integration Issues

### General POS Troubleshooting

#### Connection Test Failed

```bash
# Test POS API connectivity
curl -X GET https://api.dailyevent.com/v1/integrations/{pos}/test \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Credentials Invalid

1. Re-verify API credentials in POS system
2. Check for expired tokens
3. Regenerate credentials if needed

#### Sync Not Working

1. Check webhook delivery logs
2. Verify event subscriptions
3. Test manual sync

### POS-Specific Issues

See dedicated guides:
- [Mindbody Troubleshooting](./pos-mindbody.md#common-issues--solutions)
- [Pike13 Troubleshooting](./pos-pike13.md#troubleshooting)
- [Square Troubleshooting](./pos-square.md#troubleshooting)

---

## Payment Processing Issues

### Payment Failed

**Error:** `payment_failed`

**Common Causes:**

| Error Code | Cause | Solution |
|------------|-------|----------|
| `card_declined` | Issuer declined | Try different card |
| `insufficient_funds` | Not enough balance | Use different payment |
| `expired_card` | Card expired | Update card details |
| `incorrect_cvc` | Wrong CVC | Re-enter card info |
| `processing_error` | Temporary issue | Retry in 5 minutes |

### Quote Expired

**Error:** `quote_expired`

**Solution:**
```javascript
// Generate new quote with same parameters
const newQuote = await dailyEvent.quotes.create({
  ...originalQuoteParams
});
```

### Invalid Quote State

**Error:** `invalid_quote_state`

**Cause:** Quote was already converted or cancelled.

**Solution:**
```javascript
// Check quote status before purchase
const quote = await dailyEvent.quotes.get(quoteId);

if (quote.status !== 'pending') {
  // Quote not available for purchase
  // Generate new quote
}
```

---

## Performance Issues

### Slow API Responses

**Diagnostic:**
```javascript
const start = Date.now();
const response = await fetch('https://api.dailyevent.com/v1/quotes');
console.log(`Request took ${Date.now() - start}ms`);
```

**Solutions:**

#### 1. Use Connection Pooling

```javascript
const https = require('https');
const agent = new https.Agent({ keepAlive: true, maxSockets: 10 });

fetch(url, { agent });
```

#### 2. Implement Caching

```javascript
const cache = new Map();

async function getProducts() {
  if (cache.has('products')) {
    return cache.get('products');
  }

  const products = await dailyEvent.products.list();
  cache.set('products', products);
  setTimeout(() => cache.delete('products'), 3600000); // 1 hour

  return products;
}
```

#### 3. Reduce Payload Size

Request only needed fields:
```bash
GET /v1/policies?fields=id,policyNumber,status,premium
```

### Widget Loading Slowly

**Solutions:**

#### 1. Defer Loading

```html
<script src="https://widget.dailyevent.com/v1/embed.js" defer></script>
```

#### 2. Lazy Load

```javascript
// Load widget only when needed
function loadInsuranceWidget() {
  if (window.DailyEventWidget) return;

  const script = document.createElement('script');
  script.src = 'https://widget.dailyevent.com/v1/embed.js';
  script.onload = () => {
    DailyEventWidget.init({ partnerId: 'YOUR_ID' });
  };
  document.body.appendChild(script);
}

// Load on user interaction
document.getElementById('insurance-btn').onclick = loadInsuranceWidget;
```

---

## Debugging Tools

### Request Logging

Enable detailed logging:
```javascript
// Node.js SDK
const client = new DailyEventClient({
  apiKey: process.env.API_KEY,
  debug: true,
  logger: console
});
```

### Webhook Testing

Use the dashboard's webhook tester:

1. Dashboard > Integrations > Webhooks
2. Select webhook
3. Click "Send Test Event"
4. Review delivery logs

### API Explorer

Test API calls directly:
- https://docs.dailyevent.com/api-explorer

### Postman Collection

Import our Postman collection:
```bash
curl -O https://docs.dailyevent.com/postman/dailyevent.json
```

### Health Check Endpoints

```bash
# API health
curl https://api.dailyevent.com/v1/health

# Widget health
curl https://widget.dailyevent.com/health

# Integration health
curl https://api.dailyevent.com/v1/integrations/health
```

---

## Getting Help

If issues persist after following this guide:

### 1. Collect Debug Information

Before contacting support, gather:
- Partner ID
- Error messages (exact text)
- Request/response logs
- Browser console output
- Timestamp of issue

### 2. Check Status Page

https://status.dailyevent.com

### 3. Contact Support

**Integration Support:**
- Email: integrations@dailyevent.com
- Dashboard chat: Click support widget
- Response time: 4 business hours

**Emergency Support (outages only):**
- Email: urgent@dailyevent.com
- Phone: Available in dashboard

### 4. Community Resources

- Developer Discord: https://discord.dailyevent.com
- Stack Overflow: Tag with `daily-event-insurance`
- GitHub Issues: https://github.com/dailyevent/sdk-js/issues
