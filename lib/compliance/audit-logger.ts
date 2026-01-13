/**
 * Enhanced Audit Logging System
 *
 * Comprehensive audit logging for insurance compliance requirements.
 * Provides complete audit trails for regulatory reporting and carrier audits.
 */

import { db } from "@/lib/db"
import { randomUUID } from "crypto"

// Audit event categories aligned with insurance compliance requirements
export type AuditCategory =
  | "authentication" // Login, logout, password changes
  | "authorization" // Permission checks, role changes
  | "transaction" // Policy purchases, claims, payments
  | "data_access" // PII access, exports, views
  | "data_modification" // Create, update, delete operations
  | "partner" // Partner onboarding, status changes
  | "compliance" // Compliance checks, verification events
  | "security" // Security events, suspicious activity
  | "admin" // Administrative actions
  | "system" // System events, errors

// Audit event types for detailed categorization
export type AuditEventType =
  // Authentication events
  | "user_login"
  | "user_logout"
  | "login_failed"
  | "password_changed"
  | "mfa_enabled"
  | "mfa_disabled"
  | "session_expired"
  // Authorization events
  | "permission_granted"
  | "permission_denied"
  | "role_assigned"
  | "role_removed"
  // Transaction events
  | "quote_created"
  | "quote_expired"
  | "policy_purchased"
  | "policy_cancelled"
  | "payment_processed"
  | "payment_failed"
  | "refund_issued"
  | "claim_submitted"
  | "claim_updated"
  | "claim_approved"
  | "claim_denied"
  | "claim_paid"
  // Data access events
  | "pii_accessed"
  | "data_exported"
  | "report_generated"
  // Data modification events
  | "record_created"
  | "record_updated"
  | "record_deleted"
  // Partner events
  | "partner_registered"
  | "partner_approved"
  | "partner_suspended"
  | "partner_document_signed"
  | "partner_document_requested"
  // Compliance events
  | "kyc_initiated"
  | "kyc_completed"
  | "kyc_failed"
  | "verification_completed"
  | "compliance_check_passed"
  | "compliance_check_failed"
  // Security events
  | "suspicious_activity"
  | "rate_limit_exceeded"
  | "invalid_signature"
  | "brute_force_detected"
  // Admin events
  | "settings_changed"
  | "user_created"
  | "user_disabled"
  | "bulk_operation"
  // System events
  | "webhook_received"
  | "webhook_processed"
  | "webhook_failed"
  | "system_error"

export interface AuditLogEntry {
  id: string
  timestamp: Date
  category: AuditCategory
  eventType: AuditEventType
  userId?: string | null
  userEmail?: string | null
  userRole?: string | null
  partnerId?: string | null
  resourceType?: string | null
  resourceId?: string | null
  action: string
  description: string
  ipAddress?: string | null
  userAgent?: string | null
  requestId?: string | null
  sessionId?: string | null
  success: boolean
  errorMessage?: string | null
  details?: Record<string, unknown>
  piiAccessed?: boolean
  retentionPeriod?: number // Days to retain (default 7 years = 2555 days)
}

export interface AuditLogOptions {
  userId?: string | null
  userEmail?: string | null
  userRole?: string | null
  partnerId?: string | null
  resourceType?: string
  resourceId?: string
  ipAddress?: string | null
  userAgent?: string | null
  requestId?: string | null
  sessionId?: string | null
  details?: Record<string, unknown>
  piiAccessed?: boolean
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  category: AuditCategory,
  eventType: AuditEventType,
  action: string,
  description: string,
  success: boolean,
  options: AuditLogOptions = {},
  errorMessage?: string | null
): Promise<string> {
  const id = randomUUID()
  const timestamp = new Date()

  const entry: AuditLogEntry = {
    id,
    timestamp,
    category,
    eventType,
    action,
    description,
    success,
    errorMessage,
    retentionPeriod: 2555, // 7 years for insurance records
    ...options,
  }

  // Store in database (assuming audit_logs table exists)
  // For now, we'll log to console and return the entry
  // In production, this would insert into the audit_logs table

  try {
    // Log structured entry for centralized logging
    console.log(
      JSON.stringify({
        level: success ? "info" : "warn",
        type: "audit_log",
        ...entry,
        timestamp: entry.timestamp.toISOString(),
      })
    )

    // TODO: Insert into audit_logs table when schema is added
    // await db.insert(auditLogs).values(entry)

    return id
  } catch (error) {
    // Even if database insert fails, log to stdout for backup
    console.error("Failed to store audit log:", error)
    console.log(
      JSON.stringify({
        level: "error",
        type: "audit_log_failure",
        entry,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    )
    return id
  }
}

/**
 * Authentication audit helpers
 */
export const authAudit = {
  loginSuccess: (userId: string, email: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "authentication",
      "user_login",
      "USER_LOGIN",
      `User ${email} logged in successfully`,
      true,
      { userId, userEmail: email, ...options }
    ),

  loginFailed: (email: string, reason: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "authentication",
      "login_failed",
      "USER_LOGIN_FAILED",
      `Login attempt failed for ${email}: ${reason}`,
      false,
      { userEmail: email, ...options },
      reason
    ),

  logout: (userId: string, email: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "authentication",
      "user_logout",
      "USER_LOGOUT",
      `User ${email} logged out`,
      true,
      { userId, userEmail: email, ...options }
    ),

  passwordChanged: (userId: string, email: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "authentication",
      "password_changed",
      "PASSWORD_CHANGED",
      `Password changed for user ${email}`,
      true,
      { userId, userEmail: email, piiAccessed: true, ...options }
    ),
}

/**
 * Transaction audit helpers
 */
export const transactionAudit = {
  quoteCreated: (quoteId: string, amount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "quote_created",
      "QUOTE_CREATED",
      `Quote ${quoteId} created for $${amount}`,
      true,
      { resourceType: "quote", resourceId: quoteId, details: { amount }, ...options }
    ),

  policyPurchased: (policyId: string, amount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "policy_purchased",
      "POLICY_PURCHASED",
      `Policy ${policyId} purchased for $${amount}`,
      true,
      { resourceType: "policy", resourceId: policyId, details: { amount }, ...options }
    ),

  paymentProcessed: (paymentId: string, amount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "payment_processed",
      "PAYMENT_PROCESSED",
      `Payment ${paymentId} processed for $${amount}`,
      true,
      { resourceType: "payment", resourceId: paymentId, details: { amount }, ...options }
    ),

  paymentFailed: (paymentId: string, reason: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "payment_failed",
      "PAYMENT_FAILED",
      `Payment ${paymentId} failed: ${reason}`,
      false,
      { resourceType: "payment", resourceId: paymentId, ...options },
      reason
    ),

  refundIssued: (paymentId: string, amount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "refund_issued",
      "REFUND_ISSUED",
      `Refund of $${amount} issued for payment ${paymentId}`,
      true,
      { resourceType: "payment", resourceId: paymentId, details: { amount }, ...options }
    ),

  claimSubmitted: (claimId: string, amount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "claim_submitted",
      "CLAIM_SUBMITTED",
      `Claim ${claimId} submitted for $${amount}`,
      true,
      { resourceType: "claim", resourceId: claimId, details: { amount }, ...options }
    ),

  claimApproved: (claimId: string, amount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "claim_approved",
      "CLAIM_APPROVED",
      `Claim ${claimId} approved for $${amount}`,
      true,
      { resourceType: "claim", resourceId: claimId, details: { amount }, ...options }
    ),

  claimDenied: (claimId: string, reason: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "transaction",
      "claim_denied",
      "CLAIM_DENIED",
      `Claim ${claimId} denied: ${reason}`,
      true,
      { resourceType: "claim", resourceId: claimId, details: { reason }, ...options }
    ),
}

/**
 * Partner audit helpers
 */
export const partnerAudit = {
  registered: (partnerId: string, businessName: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "partner",
      "partner_registered",
      "PARTNER_REGISTERED",
      `Partner ${businessName} registered`,
      true,
      { partnerId, resourceType: "partner", resourceId: partnerId, details: { businessName }, ...options }
    ),

  approved: (partnerId: string, businessName: string, approvedBy: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "partner",
      "partner_approved",
      "PARTNER_APPROVED",
      `Partner ${businessName} approved by ${approvedBy}`,
      true,
      { partnerId, resourceType: "partner", resourceId: partnerId, details: { businessName, approvedBy }, ...options }
    ),

  suspended: (partnerId: string, businessName: string, reason: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "partner",
      "partner_suspended",
      "PARTNER_SUSPENDED",
      `Partner ${businessName} suspended: ${reason}`,
      true,
      { partnerId, resourceType: "partner", resourceId: partnerId, details: { businessName, reason }, ...options }
    ),

  documentSigned: (partnerId: string, documentType: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "partner",
      "partner_document_signed",
      "PARTNER_DOCUMENT_SIGNED",
      `Partner document ${documentType} signed`,
      true,
      { partnerId, resourceType: "partner_document", details: { documentType }, ...options }
    ),
}

/**
 * Compliance audit helpers
 */
export const complianceAudit = {
  kycInitiated: (userId: string, verificationType: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "compliance",
      "kyc_initiated",
      "KYC_INITIATED",
      `KYC verification ${verificationType} initiated for user`,
      true,
      { userId, resourceType: "kyc", details: { verificationType }, ...options }
    ),

  kycCompleted: (userId: string, verificationType: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "compliance",
      "kyc_completed",
      "KYC_COMPLETED",
      `KYC verification ${verificationType} completed successfully`,
      true,
      { userId, resourceType: "kyc", details: { verificationType }, piiAccessed: true, ...options }
    ),

  kycFailed: (userId: string, verificationType: string, reason: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "compliance",
      "kyc_failed",
      "KYC_FAILED",
      `KYC verification ${verificationType} failed: ${reason}`,
      false,
      { userId, resourceType: "kyc", details: { verificationType, reason }, ...options },
      reason
    ),

  piiAccessed: (userId: string, accessedBy: string, dataType: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "data_access",
      "pii_accessed",
      "PII_ACCESSED",
      `PII data (${dataType}) accessed by ${accessedBy}`,
      true,
      { userId, piiAccessed: true, details: { dataType, accessedBy }, ...options }
    ),

  dataExported: (exportedBy: string, dataType: string, recordCount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "data_access",
      "data_exported",
      "DATA_EXPORTED",
      `${recordCount} ${dataType} records exported by ${exportedBy}`,
      true,
      { piiAccessed: true, details: { dataType, recordCount, exportedBy }, ...options }
    ),
}

/**
 * Security audit helpers
 */
export const securityAudit = {
  suspiciousActivity: (description: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "security",
      "suspicious_activity",
      "SUSPICIOUS_ACTIVITY",
      description,
      false,
      options
    ),

  rateLimitExceeded: (endpoint: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "security",
      "rate_limit_exceeded",
      "RATE_LIMIT_EXCEEDED",
      `Rate limit exceeded for endpoint ${endpoint}`,
      false,
      { details: { endpoint }, ...options }
    ),

  invalidSignature: (source: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "security",
      "invalid_signature",
      "INVALID_SIGNATURE",
      `Invalid webhook signature from ${source}`,
      false,
      { details: { source }, ...options }
    ),

  bruteForceDetected: (targetEmail: string, attemptCount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "security",
      "brute_force_detected",
      "BRUTE_FORCE_DETECTED",
      `Possible brute force attack detected: ${attemptCount} failed attempts for ${targetEmail}`,
      false,
      { userEmail: targetEmail, details: { attemptCount }, ...options }
    ),
}

/**
 * Admin audit helpers
 */
export const adminAudit = {
  settingsChanged: (changedBy: string, settingName: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "admin",
      "settings_changed",
      "SETTINGS_CHANGED",
      `Setting ${settingName} changed by ${changedBy}`,
      true,
      { details: { settingName, changedBy }, ...options }
    ),

  userCreated: (createdBy: string, newUserEmail: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "admin",
      "user_created",
      "USER_CREATED",
      `User ${newUserEmail} created by ${createdBy}`,
      true,
      { details: { newUserEmail, createdBy }, ...options }
    ),

  userDisabled: (disabledBy: string, targetUserEmail: string, reason: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "admin",
      "user_disabled",
      "USER_DISABLED",
      `User ${targetUserEmail} disabled by ${disabledBy}: ${reason}`,
      true,
      { details: { targetUserEmail, disabledBy, reason }, ...options }
    ),

  bulkOperation: (performedBy: string, operation: string, recordCount: number, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "admin",
      "bulk_operation",
      "BULK_OPERATION",
      `Bulk ${operation} performed on ${recordCount} records by ${performedBy}`,
      true,
      { details: { operation, recordCount, performedBy }, ...options }
    ),
}

/**
 * System audit helpers
 */
export const systemAudit = {
  webhookReceived: (source: string, eventType: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "system",
      "webhook_received",
      "WEBHOOK_RECEIVED",
      `Webhook received from ${source}: ${eventType}`,
      true,
      { details: { source, eventType }, ...options }
    ),

  webhookProcessed: (source: string, eventType: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "system",
      "webhook_processed",
      "WEBHOOK_PROCESSED",
      `Webhook from ${source} processed successfully: ${eventType}`,
      true,
      { details: { source, eventType }, ...options }
    ),

  webhookFailed: (source: string, eventType: string, error: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "system",
      "webhook_failed",
      "WEBHOOK_FAILED",
      `Webhook from ${source} failed: ${eventType}`,
      false,
      { details: { source, eventType, error }, ...options },
      error
    ),

  systemError: (component: string, error: string, options: Partial<AuditLogOptions> = {}) =>
    createAuditLog(
      "system",
      "system_error",
      "SYSTEM_ERROR",
      `System error in ${component}: ${error}`,
      false,
      { details: { component, error }, ...options },
      error
    ),
}

/**
 * Export all audit helpers
 */
export const audit = {
  auth: authAudit,
  transaction: transactionAudit,
  partner: partnerAudit,
  compliance: complianceAudit,
  security: securityAudit,
  admin: adminAudit,
  system: systemAudit,
  create: createAuditLog,
}

export default audit
