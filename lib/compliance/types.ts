/**
 * Compliance Type Definitions
 *
 * Type definitions for insurance compliance features.
 */

// KYC Verification Status
export type KYCStatus =
  | "not_started"
  | "pending"
  | "in_progress"
  | "verified"
  | "failed"
  | "expired"

// KYC Verification Levels
export type KYCLevel =
  | "basic" // Email verification only
  | "standard" // Email + phone + business verification
  | "enhanced" // Standard + ID verification + address verification
  | "full" // Enhanced + PEP/sanctions screening

// KYC Verification Types
export type KYCVerificationType =
  | "email"
  | "phone"
  | "business_entity"
  | "beneficial_ownership"
  | "id_document"
  | "address"
  | "pep_screening"
  | "sanctions_screening"

export interface KYCVerification {
  id: string
  userId: string
  verificationType: KYCVerificationType
  status: KYCStatus
  level: KYCLevel
  verifiedAt?: Date | null
  expiresAt?: Date | null
  verificationData?: Record<string, unknown>
  verificationProvider?: string | null
  providerReferenceId?: string | null
  failureReason?: string | null
  createdAt: Date
  updatedAt: Date
}

// AML Risk Levels
export type AMLRiskLevel = "low" | "medium" | "high" | "prohibited"

// AML Alert Types
export type AMLAlertType =
  | "high_value_transaction"
  | "unusual_pattern"
  | "velocity_exceeded"
  | "sanctioned_party"
  | "pep_match"
  | "structuring_suspected"
  | "geographic_risk"

export interface AMLAlert {
  id: string
  userId?: string | null
  partnerId?: string | null
  alertType: AMLAlertType
  riskLevel: AMLRiskLevel
  description: string
  transactionIds?: string[]
  status: "pending" | "investigating" | "cleared" | "escalated" | "sar_filed"
  assignedTo?: string | null
  resolution?: string | null
  resolvedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

// Consumer Data Request Types (CCPA/GDPR)
export type DataRequestType =
  | "access" // Right to know what data is collected
  | "deletion" // Right to delete
  | "correction" // Right to correct inaccurate data
  | "portability" // Right to export data
  | "opt_out" // Right to opt out of data sales

export type DataRequestStatus =
  | "pending"
  | "verifying_identity"
  | "processing"
  | "completed"
  | "denied"

export interface ConsumerDataRequest {
  id: string
  userId?: string | null
  email: string
  requestType: DataRequestType
  status: DataRequestStatus
  submittedAt: Date
  verifiedAt?: Date | null
  completedAt?: Date | null
  denialReason?: string | null
  dataExportUrl?: string | null // Temporary URL for data export
  dataExportExpiry?: Date | null
  notes?: string
  handledBy?: string | null
  createdAt: Date
  updatedAt: Date
}

// Compliance Report Types
export type ComplianceReportType =
  | "audit_log_export"
  | "transaction_summary"
  | "kyc_summary"
  | "aml_alert_summary"
  | "data_request_summary"
  | "partner_compliance"
  | "regulatory_filing"

export interface ComplianceReport {
  id: string
  reportType: ComplianceReportType
  title: string
  description?: string
  dateRangeStart: Date
  dateRangeEnd: Date
  generatedBy: string
  generatedAt: Date
  fileUrl?: string | null
  fileExpiry?: Date | null
  format: "json" | "csv" | "pdf"
  recordCount: number
  metadata?: Record<string, unknown>
}

// Record Retention Policies
export interface RetentionPolicy {
  dataType: string
  retentionDays: number
  legalBasis: string
  archiveAfterDays?: number | null
  autoDelete: boolean
}

// Default retention policies for insurance compliance
export const DEFAULT_RETENTION_POLICIES: RetentionPolicy[] = [
  {
    dataType: "policies",
    retentionDays: 2555, // 7 years
    legalBasis: "Insurance regulatory requirement",
    archiveAfterDays: 365,
    autoDelete: false,
  },
  {
    dataType: "claims",
    retentionDays: 2555, // 7 years
    legalBasis: "Insurance regulatory requirement",
    archiveAfterDays: 365,
    autoDelete: false,
  },
  {
    dataType: "payments",
    retentionDays: 2555, // 7 years
    legalBasis: "Tax and insurance regulatory requirement",
    archiveAfterDays: 365,
    autoDelete: false,
  },
  {
    dataType: "quotes",
    retentionDays: 365, // 1 year
    legalBasis: "Business operations",
    archiveAfterDays: 90,
    autoDelete: true,
  },
  {
    dataType: "audit_logs",
    retentionDays: 2555, // 7 years
    legalBasis: "Regulatory compliance audit trail",
    archiveAfterDays: 365,
    autoDelete: false,
  },
  {
    dataType: "user_sessions",
    retentionDays: 90,
    legalBasis: "Security monitoring",
    archiveAfterDays: null,
    autoDelete: true,
  },
  {
    dataType: "kyc_verifications",
    retentionDays: 1825, // 5 years
    legalBasis: "AML regulatory requirement",
    archiveAfterDays: 365,
    autoDelete: false,
  },
  {
    dataType: "aml_alerts",
    retentionDays: 1825, // 5 years
    legalBasis: "AML regulatory requirement",
    archiveAfterDays: 365,
    autoDelete: false,
  },
  {
    dataType: "partner_documents",
    retentionDays: 2555, // 7 years
    legalBasis: "Contractual and tax requirements",
    archiveAfterDays: 365,
    autoDelete: false,
  },
]

// Compliance Configuration
export interface ComplianceConfig {
  kycEnabled: boolean
  kycRequiredLevel: KYCLevel
  amlEnabled: boolean
  amlRiskThresholds: {
    transactionAmountHighRisk: number
    dailyVolumeHighRisk: number
    weeklyVolumeHighRisk: number
  }
  dataRetentionEnabled: boolean
  gdprEnabled: boolean
  ccpaEnabled: boolean
}

// Default compliance configuration
export const DEFAULT_COMPLIANCE_CONFIG: ComplianceConfig = {
  kycEnabled: true,
  kycRequiredLevel: "standard",
  amlEnabled: true,
  amlRiskThresholds: {
    transactionAmountHighRisk: 10000,
    dailyVolumeHighRisk: 25000,
    weeklyVolumeHighRisk: 100000,
  },
  dataRetentionEnabled: true,
  gdprEnabled: true,
  ccpaEnabled: true,
}

// Compliance Check Result
export interface ComplianceCheckResult {
  passed: boolean
  checkType: string
  message: string
  details?: Record<string, unknown>
  timestamp: Date
}

// Partner Compliance Status
export interface PartnerComplianceStatus {
  partnerId: string
  kycStatus: KYCStatus
  kycLevel: KYCLevel
  documentsSigned: string[]
  documentsRequired: string[]
  amlRiskLevel: AMLRiskLevel
  lastReviewDate?: Date | null
  nextReviewDate?: Date | null
  complianceScore: number // 0-100
  issues: string[]
}
