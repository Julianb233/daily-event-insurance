/**
 * Email template exports and vertical routing
 * Commission formula: $40 × 35% = $14 per policy, 65% opt-in rate
 */

// Import all vertical templates
import * as gymTemplates from './gym-templates';
import * as wellnessTemplates from './wellness-templates';
import * as skiResortTemplates from './ski-resort-templates';
import * as fitnessTemplates from './fitness-templates';

// Export individual templates
export * from './gym-templates';
export * from './wellness-templates';
export * from './ski-resort-templates';
export * from './fitness-templates';

// Re-export EmailTemplate interface
export type { EmailTemplate } from './gym-templates';

/**
 * Vertical identifier type
 */
export type Vertical = 'gym' | 'wellness' | 'ski-resort' | 'fitness';

/**
 * Email sequence type
 */
export type EmailSequenceType = 'welcome' | 'follow-up' | 'case-study' | 'final-outreach' | 'multi-event-offer';

/**
 * Template data types by vertical
 */
export interface GymTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  memberCount?: number;
  monthlyRevenue?: number;
}

export interface WellnessTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  clientCount?: number;
  serviceTypes?: string[];
}

export interface SkiResortTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  seasonPassHolders?: number;
  dailyVisitors?: number;
  seasonLength?: number;
}

export interface FitnessTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  eventType?: string;
  participantCount?: number;
  eventsPerYear?: number;
}

/**
 * Union type for all template data
 */
export type TemplateData = GymTemplateData | WellnessTemplateData | SkiResortTemplateData | FitnessTemplateData;

/**
 * Email template function type
 */
export type EmailTemplateFunction<T extends TemplateData = TemplateData> = (data: T) => gymTemplates.EmailTemplate;

/**
 * Get all available email templates for a specific vertical
 */
export function getTemplatesByVertical(vertical: Vertical): Record<string, EmailTemplateFunction> {
  switch (vertical) {
    case 'gym':
      return {
        welcome: gymTemplates.gymWelcomeEmail,
        revenueCalculator: gymTemplates.gymRevenueCalculatorEmail,
        caseStudy: gymTemplates.gymCaseStudyEmail,
        finalOutreach: gymTemplates.gymFinalOutreachEmail,
      };

    case 'wellness':
      return {
        welcome: wellnessTemplates.wellnessWelcomeEmail,
        benefits: wellnessTemplates.wellnessBenefitsEmail,
        testimonial: wellnessTemplates.wellnessTestimonialEmail,
        partnership: wellnessTemplates.wellnessPartnershipEmail,
      };

    case 'ski-resort':
      return {
        welcome: skiResortTemplates.skiResortWelcomeEmail,
        volumeCalculator: skiResortTemplates.skiResortVolumeCalculatorEmail,
        riskMitigation: skiResortTemplates.skiResortRiskMitigationEmail,
        partnership: skiResortTemplates.skiResortPartnershipEmail,
      };

    case 'fitness':
      return {
        welcome: fitnessTemplates.fitnessWelcomeEmail,
        protectionBenefits: fitnessTemplates.fitnessProtectionBenefitsEmail,
        caseStudy: fitnessTemplates.fitnessCaseStudyEmail,
        multiEventOffer: fitnessTemplates.fitnessMultiEventOfferEmail,
      };

    default:
      throw new Error(`Unknown vertical: ${vertical}`);
  }
}

/**
 * Get a specific email template by vertical and template name
 */
export function getTemplate(vertical: Vertical, templateName: string): EmailTemplateFunction {
  const templates = getTemplatesByVertical(vertical);
  const template = templates[templateName];

  if (!template) {
    throw new Error(`Template "${templateName}" not found for vertical "${vertical}"`);
  }

  return template;
}

/**
 * Get the full email sequence for a vertical
 * Returns templates in the recommended order for drip campaigns
 */
export function getEmailSequence(vertical: Vertical): EmailTemplateFunction[] {
  const templates = getTemplatesByVertical(vertical);
  return Object.values(templates);
}

/**
 * Validate template data has required fields
 */
export function validateTemplateData(data: Partial<TemplateData>): data is TemplateData {
  if (!data.contactName || !data.companyName || !data.quoteId || !data.vertical) {
    return false;
  }
  return true;
}

/**
 * Get template names for a vertical
 */
export function getTemplateNames(vertical: Vertical): string[] {
  return Object.keys(getTemplatesByVertical(vertical));
}

/**
 * Get all supported verticals
 */
export function getSupportedVerticals(): Vertical[] {
  return ['gym', 'wellness', 'ski-resort', 'fitness'];
}

/**
 * Helper to create template data with defaults
 */
export function createTemplateData<T extends TemplateData>(
  vertical: Vertical,
  baseData: Partial<T>
): T {
  const defaults = {
    vertical,
    estimatedRevenue: 0,
  };

  return {
    ...defaults,
    ...baseData,
  } as T;
}

/**
 * Email sequence configuration for automation
 */
export interface EmailSequenceConfig {
  vertical: Vertical;
  templates: string[];
  delayDays: number[]; // Days to wait between emails
}

/**
 * Predefined email sequences for each vertical
 */
export const EMAIL_SEQUENCES: Record<Vertical, EmailSequenceConfig> = {
  gym: {
    vertical: 'gym',
    templates: ['welcome', 'revenueCalculator', 'caseStudy', 'finalOutreach'],
    delayDays: [0, 2, 5, 10], // Send immediately, then 2, 5, and 10 days later
  },
  wellness: {
    vertical: 'wellness',
    templates: ['welcome', 'benefits', 'testimonial', 'partnership'],
    delayDays: [0, 3, 6, 12],
  },
  'ski-resort': {
    vertical: 'ski-resort',
    templates: ['welcome', 'volumeCalculator', 'riskMitigation', 'partnership'],
    delayDays: [0, 2, 5, 10],
  },
  fitness: {
    vertical: 'fitness',
    templates: ['welcome', 'protectionBenefits', 'caseStudy', 'multiEventOffer'],
    delayDays: [0, 3, 7, 14],
  },
};

/**
 * Calculate commission and revenue
 */
export interface RevenueCalculation {
  policies: number;
  commissionPerPolicy: number;
  totalRevenue: number;
  optInRate: number;
}

export function calculateRevenue(
  customerBase: number,
  optInRate: number = 0.65,
  commissionPerPolicy: number = 14
): RevenueCalculation {
  const policies = Math.floor(customerBase * optInRate);
  const totalRevenue = policies * commissionPerPolicy;

  return {
    policies,
    commissionPerPolicy,
    totalRevenue,
    optInRate,
  };
}

/**
 * Format currency for email templates
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for email templates
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}
