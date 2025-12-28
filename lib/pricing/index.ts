/**
 * Pricing Module - Comprehensive Quote Engine
 *
 * Exports all pricing, risk assessment, and validation functionality
 */

// Pricing Engine
export {
  calculatePricing,
  calculateMultiCoveragePricing,
  validatePricingInput,
  getPricingEstimates,
  formatPricingDisplay,
  calculateEventTypeRisk,
  calculateParticipantRisk,
  calculateDurationRisk,
  calculateDateRisk,
  calculateLocationRisk,
} from "./pricing-engine"

export type {
  PricingInput,
  PricingResult,
  RiskFactors,
} from "./pricing-engine"

// Risk Assessment
export {
  assessRisk,
  quickRiskCheck,
} from "./risk-assessment"

export type {
  RiskAssessment,
  RiskFactor,
  AssessmentInput,
  RiskLevel,
  UnderwritingDecision,
} from "./risk-assessment"

// Quote Validation
export {
  validateQuote,
  validateQuoteForPolicy,
  requiresManualReview,
  getValidationSummary,
} from "./quote-validation"

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  QuoteInput,
} from "./quote-validation"
