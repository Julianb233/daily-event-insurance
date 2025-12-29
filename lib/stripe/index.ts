/**
 * Stripe Integration Module
 *
 * Comprehensive Stripe payment processing for Daily Event Insurance
 */

// Client & Configuration
export {
  stripe,
  stripeConfig,
  validateStripeConfig,
  isStripeError,
  formatStripeError,
  retryStripeOperation,
} from "./client"

// Checkout Session Management
export {
  createCheckoutSession,
  getCheckoutSession,
  getSessionPaymentDetails,
  listCustomerSessions,
  expireCheckoutSession,
  validateSessionMetadata,
  type CheckoutSessionInput,
  type CheckoutSessionResult,
} from "./checkout"

// Webhook Processing
export {
  verifyWebhookSignature,
  handleWebhookEvent,
  type WebhookEvent,
} from "./webhooks"
