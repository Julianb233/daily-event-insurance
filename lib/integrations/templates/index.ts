/**
 * Integration Templates Index
 *
 * Export all integration templates for easy access
 */

export { mindbodyTemplate, type MindbodyTemplate } from "./mindbody"
export { zenPlannerTemplate, type ZenPlannerTemplate } from "./zen-planner"
export { shopifyTemplate, type ShopifyTemplate } from "./shopify"
export { woocommerceTemplate, type WooCommerceTemplate } from "./woocommerce"
export { squareTemplate, type SquareTemplate } from "./square"
export { stripeTemplate, type StripeTemplate } from "./stripe"
export { genericWidgetTemplate, generateEmbedCode, type GenericWidgetTemplate } from "./generic-widget"

// Template type definitions
export type IntegrationTemplate = {
  name: string
  slug: string
  category: "pos" | "ecommerce" | "payments" | "booking" | "embed"
  description: string
  supportedFeatures: string[]
  setupSteps: {
    step: number
    title: string
    instructions: string
    screenshot?: string
    requiresInput?: boolean
    inputLabel?: string
  }[]
  webhookEndpoint: (partnerId: string) => string
  codeSnippets: Record<string, any>
  apiReference: {
    baseUrl: string
    authentication: string
    documentation: string
    requiredScopes?: string[]
  }
  troubleshooting: {
    issue: string
    solution: string
  }[]
}

// All templates mapped by slug
import { mindbodyTemplate } from "./mindbody"
import { zenPlannerTemplate } from "./zen-planner"
import { shopifyTemplate } from "./shopify"
import { woocommerceTemplate } from "./woocommerce"
import { squareTemplate } from "./square"
import { stripeTemplate } from "./stripe"
import { genericWidgetTemplate } from "./generic-widget"

export const integrationTemplates: Record<string, IntegrationTemplate> = {
  mindbody: mindbodyTemplate as IntegrationTemplate,
  "zen-planner": zenPlannerTemplate as IntegrationTemplate,
  shopify: shopifyTemplate as IntegrationTemplate,
  woocommerce: woocommerceTemplate as IntegrationTemplate,
  square: squareTemplate as IntegrationTemplate,
  stripe: stripeTemplate as IntegrationTemplate,
  "generic-widget": genericWidgetTemplate as IntegrationTemplate,
}

// Get template by slug
export function getIntegrationTemplate(slug: string): IntegrationTemplate | null {
  return integrationTemplates[slug] || null
}

// Get all templates
export function getAllTemplates(): IntegrationTemplate[] {
  return Object.values(integrationTemplates)
}

// Get templates by category
export function getTemplatesByCategory(category: string): IntegrationTemplate[] {
  return Object.values(integrationTemplates).filter(t => t.category === category)
}

// Platform detection helpers
export const platformKeywords: Record<string, string[]> = {
  mindbody: ["mindbody", "mind body", "mindbodyonline"],
  "zen-planner": ["zen planner", "zenplanner", "zen-planner"],
  shopify: ["shopify", "myshopify"],
  woocommerce: ["woocommerce", "woo commerce", "wordpress shop", "woo-commerce"],
  square: ["square", "squareup", "square pos", "square online"],
  stripe: ["stripe", "stripe payments"],
}

export function detectPlatformFromText(text: string): string | null {
  const normalizedText = text.toLowerCase()

  for (const [platform, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some(keyword => normalizedText.includes(keyword))) {
      return platform
    }
  }

  return null
}

// Category display names
export const categoryLabels: Record<string, string> = {
  pos: "Point of Sale / Booking",
  ecommerce: "E-Commerce",
  payments: "Payment Processing",
  booking: "Booking & Scheduling",
  embed: "Website Embed"
}
