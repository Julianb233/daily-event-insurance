import { pgTable, uuid, text, boolean, decimal, timestamp, integer, primaryKey, index } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

// ================= NextAuth Tables =================

// Users table - authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: text("role").default("user"), // user, partner, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Accounts table - for OAuth providers
export const accounts = pgTable("accounts", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}))

// Sessions table - server-side session storage
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// Verification tokens - for email verification
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}))

// ================= Application Tables =================

// Partners table - main partner profiles
export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().references(() => users.id, { onDelete: "cascade" }),
  clerkUserId: text("clerk_user_id").unique(), // Legacy - kept for migration
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(), // gym, climbing, rental, etc.
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  integrationType: text("integration_type").default("widget"), // widget, api, manual
  primaryColor: text("primary_color").default("#14B8A6"),
  logoUrl: text("logo_url"),
  brandingImages: text("branding_images").array().default([]),
  status: text("status").default("pending"), // pending, documents_sent, documents_pending, under_review, active, suspended
  // GHL Integration fields
  ghlContactId: text("ghl_contact_id"), // GHL Contact ID
  ghlOpportunityId: text("ghl_opportunity_id"), // GHL Pipeline Opportunity ID
  // Document tracking
  documentsStatus: text("documents_status").default("not_sent"), // not_sent, sent, pending, completed
  agreementSigned: boolean("agreement_signed").default(false),
  w9Signed: boolean("w9_signed").default(false),
  directDepositSigned: boolean("direct_deposit_signed").default(false),
  documentsSentAt: timestamp("documents_sent_at"),
  documentsCompletedAt: timestamp("documents_completed_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("idx_partners_status").on(table.status),
  businessTypeIdx: index("idx_partners_business_type").on(table.businessType),
}))

// Partner products - product configurations per partner
export const partnerProducts = pgTable("partner_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  productType: text("product_type").notNull(), // liability, equipment, cancellation
  isEnabled: boolean("is_enabled").default(true),
  customerPrice: decimal("customer_price", { precision: 10, scale: 2 }).default("4.99"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_partner_products_partner_id").on(table.partnerId),
}))

// Monthly earnings - tracking partner commission
export const monthlyEarnings = pgTable("monthly_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  yearMonth: text("year_month").notNull(), // "2025-01" format
  totalParticipants: integer("total_participants").default(0),
  optedInParticipants: integer("opted_in_participants").default(0),
  partnerCommission: decimal("partner_commission", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  partnerMonthIdx: index("idx_monthly_earnings_partner_month").on(table.partnerId, table.yearMonth),
}))

// Partner resources - materials library
export const partnerResources = pgTable("partner_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // marketing, training, documentation
  resourceType: text("resource_type").notNull(), // pdf, video, image, link
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Resource downloads - tracking
export const resourceDownloads = pgTable("resource_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  resourceId: uuid("resource_id").references(() => partnerResources.id).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
})

// Partner documents - individual document tracking
export const partnerDocuments = pgTable("partner_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),
  documentType: text("document_type").notNull(), // partner_agreement, w9, direct_deposit
  ghlDocumentId: text("ghl_document_id"), // GHL Document ID
  status: text("status").default("pending"), // pending, sent, viewed, signed, declined, expired
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Webhook events - audit log for GHL webhooks
export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(), // ghl, docusign, stripe, etc.
  eventType: text("event_type").notNull(),
  payload: text("payload"), // JSON string of the full payload
  partnerId: uuid("partner_id").references(() => partners.id),
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  processedIdx: index("idx_webhook_events_processed").on(table.processed),
  createdAtIdx: index("idx_webhook_events_created_at").on(table.createdAt),
}))

// Quotes - insurance quote requests
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  quoteNumber: text("quote_number").unique().notNull(), // QT-YYYYMMDD-XXXXX
  eventType: text("event_type").notNull(),
  eventDate: timestamp("event_date", { mode: "date" }).notNull(),
  participants: integer("participants").notNull(),
  coverageType: text("coverage_type").notNull(), // liability, equipment, cancellation
  premium: decimal("premium", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, accepted, declined, expired
  eventDetails: text("event_details"), // JSON string
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  metadata: text("metadata"), // JSON string for additional data
  // Pricing metadata (Stage 1)
  duration: decimal("duration", { precision: 4, scale: 1 }), // hours
  location: text("location"),
  riskMultiplier: decimal("risk_multiplier", { precision: 5, scale: 3 }),
  commissionTier: integer("commission_tier"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  acceptedAt: timestamp("accepted_at"),
  declinedAt: timestamp("declined_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_quotes_partner_id").on(table.partnerId),
  statusIdx: index("idx_quotes_status").on(table.status),
  coverageTypeIdx: index("idx_quotes_coverage_type").on(table.coverageType),
  eventDateIdx: index("idx_quotes_event_date").on(table.eventDate),
  createdAtIdx: index("idx_quotes_created_at").on(table.createdAt),
  expiresAtIdx: index("idx_quotes_expires_at").on(table.expiresAt),
}))

// Policies - active insurance policies
export const policies = pgTable("policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  quoteId: uuid("quote_id").references(() => quotes.id),
  policyNumber: text("policy_number").unique().notNull(), // POL-YYYYMMDD-XXXXX
  eventType: text("event_type").notNull(),
  eventDate: timestamp("event_date", { mode: "date" }).notNull(),
  participants: integer("participants").notNull(),
  coverageType: text("coverage_type").notNull(), // liability, equipment, cancellation
  premium: decimal("premium", { precision: 10, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("active"), // active, expired, cancelled, pending
  effectiveDate: timestamp("effective_date", { mode: "date" }).notNull(),
  expirationDate: timestamp("expiration_date", { mode: "date" }).notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  eventDetails: text("event_details"), // JSON string
  policyDocument: text("policy_document"), // URL to policy PDF
  certificateIssued: boolean("certificate_issued").default(false),
  metadata: text("metadata"), // JSON string for additional data
  // Pricing metadata (Stage 1)
  duration: decimal("duration", { precision: 4, scale: 1 }), // hours
  location: text("location"),
  riskMultiplier: decimal("risk_multiplier", { precision: 5, scale: 3 }),
  commissionTier: integer("commission_tier"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_policies_partner_id").on(table.partnerId),
  quoteIdIdx: index("idx_policies_quote_id").on(table.quoteId),
  statusIdx: index("idx_policies_status").on(table.status),
  coverageTypeIdx: index("idx_policies_coverage_type").on(table.coverageType),
  eventDateIdx: index("idx_policies_event_date").on(table.eventDate),
  effectiveDateIdx: index("idx_policies_effective_date").on(table.effectiveDate),
  createdAtIdx: index("idx_policies_created_at").on(table.createdAt),
}))

// Commission tiers - configurable commission rates based on volume
export const commissionTiers = pgTable("commission_tiers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tierName: text("tier_name").notNull(), // Bronze, Silver, Gold, Platinum
  minVolume: integer("min_volume").notNull().default(0), // Min monthly participants
  maxVolume: integer("max_volume"), // Max monthly participants (null = unlimited)
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).notNull().default("0.50"), // 0.5000 = 50%
  flatBonus: decimal("flat_bonus", { precision: 10, scale: 2 }).default("0"), // Optional flat bonus per policy
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tierNameIdx: index("idx_commission_tiers_tier_name").on(table.tierName),
  sortOrderIdx: index("idx_commission_tiers_sort_order").on(table.sortOrder),
  activeIdx: index("idx_commission_tiers_active").on(table.isActive),
}))

// Partner tier overrides - manual tier assignments
export const partnerTierOverrides = pgTable("partner_tier_overrides", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull().unique(),
  tierId: uuid("tier_id").references(() => commissionTiers.id, { onDelete: "cascade" }).notNull(),
  reason: text("reason"), // Why the override was applied
  appliedBy: uuid("applied_by").references(() => users.id),
  expiresAt: timestamp("expires_at"), // Optional expiration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_partner_tier_overrides_partner_id").on(table.partnerId),
  tierIdIdx: index("idx_partner_tier_overrides_tier_id").on(table.tierId),
}))

// Commission payouts - tracks payout history
export const commissionPayouts = pgTable("commission_payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),
  yearMonth: text("year_month").notNull(), // "2025-01" format
  tierAtPayout: text("tier_at_payout").notNull(), // Snapshot of tier name
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).notNull(),
  totalPolicies: integer("total_policies").notNull().default(0),
  totalParticipants: integer("total_participants").notNull().default(0),
  grossRevenue: decimal("gross_revenue", { precision: 12, scale: 2 }).notNull().default("0"),
  commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  bonusAmount: decimal("bonus_amount", { precision: 10, scale: 2 }).default("0"),
  status: text("status").default("pending"), // pending, processing, paid, failed
  paidAt: timestamp("paid_at"),
  paymentReference: text("payment_reference"), // ACH/check reference
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_commission_payouts_partner_id").on(table.partnerId),
  yearMonthIdx: index("idx_commission_payouts_year_month").on(table.yearMonth),
  statusIdx: index("idx_commission_payouts_status").on(table.status),
  partnerMonthIdx: index("idx_commission_payouts_partner_month").on(table.partnerId, table.yearMonth),
}))

// ================= Stage 1 Production Tables =================

// Payments - Stripe payment tracking
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  policyId: uuid("policy_id").references(() => policies.id).notNull(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),

  // Payment identification
  paymentNumber: text("payment_number").unique().notNull(), // PAY-YYYYMMDD-XXXXX

  // Stripe integration
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  stripeChargeId: text("stripe_charge_id"),
  stripeCustomerId: text("stripe_customer_id"),

  // Payment details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull().default("pending"), // pending, processing, succeeded, failed, refunded, partially_refunded, disputed
  paymentMethod: text("payment_method"), // card, bank_transfer, etc.
  paymentMethodDetails: text("payment_method_details"), // JSON with last4, brand, etc.

  // Refund tracking
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default("0"),
  refundReason: text("refund_reason"),
  refundedAt: timestamp("refunded_at"),

  // Metadata
  receiptUrl: text("receipt_url"),
  failureCode: text("failure_code"),
  failureMessage: text("failure_message"),
  metadata: text("metadata"), // JSON for additional data

  // Timestamps
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  policyIdIdx: index("idx_payments_policy_id").on(table.policyId),
  partnerIdIdx: index("idx_payments_partner_id").on(table.partnerId),
  statusIdx: index("idx_payments_status").on(table.status),
  stripeIntentIdx: index("idx_payments_stripe_intent").on(table.stripePaymentIntentId),
  createdAtIdx: index("idx_payments_created_at").on(table.createdAt),
  partnerStatusIdx: index("idx_payments_partner_status").on(table.partnerId, table.status),
}))

// Claims - insurance claim management
export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  policyId: uuid("policy_id").references(() => policies.id).notNull(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),

  // Claim identification
  claimNumber: text("claim_number").unique().notNull(), // CLM-YYYYMMDD-XXXXX

  // Claim details
  claimType: text("claim_type").notNull(), // injury, property_damage, liability, equipment_loss, cancellation
  incidentDate: timestamp("incident_date").notNull(),
  incidentLocation: text("incident_location"),
  incidentDescription: text("incident_description").notNull(),

  // Claimant info
  claimantName: text("claimant_name").notNull(),
  claimantEmail: text("claimant_email"),
  claimantPhone: text("claimant_phone"),

  // Financial
  claimAmount: decimal("claim_amount", { precision: 10, scale: 2 }),
  approvedAmount: decimal("approved_amount", { precision: 10, scale: 2 }),
  payoutAmount: decimal("payout_amount", { precision: 10, scale: 2 }).default("0"),
  deductibleAmount: decimal("deductible_amount", { precision: 10, scale: 2 }).default("0"),

  // Status workflow: submitted -> under_review -> (approved|denied) -> (paid|closed)
  status: text("status").notNull().default("submitted"), // submitted, under_review, additional_info_requested, approved, denied, paid, closed, disputed

  // Review tracking
  assignedTo: text("assigned_to"), // Adjuster name/id
  reviewNotes: text("review_notes"),
  denialReason: text("denial_reason"),

  // Timestamps
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  deniedAt: timestamp("denied_at"),
  paidAt: timestamp("paid_at"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  policyIdIdx: index("idx_claims_policy_id").on(table.policyId),
  partnerIdIdx: index("idx_claims_partner_id").on(table.partnerId),
  statusIdx: index("idx_claims_status").on(table.status),
  incidentDateIdx: index("idx_claims_incident_date").on(table.incidentDate),
  createdAtIdx: index("idx_claims_created_at").on(table.createdAt),
  partnerStatusIdx: index("idx_claims_partner_status").on(table.partnerId, table.status),
}))

// Claim documents - supporting documentation for claims
export const claimDocuments = pgTable("claim_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").references(() => claims.id, { onDelete: "cascade" }).notNull(),

  // Document details
  documentType: text("document_type").notNull(), // photo, receipt, medical_report, police_report, witness_statement, other
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // bytes
  mimeType: text("mime_type"),

  // Metadata
  description: text("description"),
  uploadedBy: text("uploaded_by"), // claimant, partner, adjuster

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  claimIdIdx: index("idx_claim_documents_claim_id").on(table.claimId),
  documentTypeIdx: index("idx_claim_documents_type").on(table.documentType),
}))

// Type exports for use in application
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect
export type Partner = typeof partners.$inferSelect
export type NewPartner = typeof partners.$inferInsert
export type PartnerProduct = typeof partnerProducts.$inferSelect
export type NewPartnerProduct = typeof partnerProducts.$inferInsert
export type MonthlyEarning = typeof monthlyEarnings.$inferSelect
export type NewMonthlyEarning = typeof monthlyEarnings.$inferInsert
export type PartnerResource = typeof partnerResources.$inferSelect
export type ResourceDownload = typeof resourceDownloads.$inferSelect
export type PartnerDocument = typeof partnerDocuments.$inferSelect
export type NewPartnerDocument = typeof partnerDocuments.$inferInsert
export type WebhookEvent = typeof webhookEvents.$inferSelect
export type NewWebhookEvent = typeof webhookEvents.$inferInsert
export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert
export type Policy = typeof policies.$inferSelect
export type NewPolicy = typeof policies.$inferInsert
export type CommissionTier = typeof commissionTiers.$inferSelect
export type NewCommissionTier = typeof commissionTiers.$inferInsert
export type PartnerTierOverride = typeof partnerTierOverrides.$inferSelect
export type NewPartnerTierOverride = typeof partnerTierOverrides.$inferInsert
export type CommissionPayout = typeof commissionPayouts.$inferSelect
export type NewCommissionPayout = typeof commissionPayouts.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type Claim = typeof claims.$inferSelect
export type NewClaim = typeof claims.$inferInsert
export type ClaimDocument = typeof claimDocuments.$inferSelect
export type NewClaimDocument = typeof claimDocuments.$inferInsert

// ================= Call Center / Lead Management Tables =================

// Leads - Central lead management for AI call center
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Source tracking
  source: text("source").notNull(), // website_quote, partner_referral, cold_list, ad_campaign
  sourceDetails: text("source_details"), // JSON: campaign_id, partner_id, etc.
  
  // Contact info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  
  // Business context
  businessType: text("business_type"), // gym, climbing, rental, adventure
  businessName: text("business_name"),
  estimatedParticipants: integer("estimated_participants"),
  
  // Interest & Activity scoring
  interestLevel: text("interest_level").default("cold"), // cold, warm, hot
  interestScore: integer("interest_score").default(0), // 0-100
  lastActivityAt: timestamp("last_activity_at"),
  activityHistory: text("activity_history"), // JSON array of actions
  
  // Geographic
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  timezone: text("timezone").default("America/Los_Angeles"),
  
  // Lead value tracking ($40 → $100)
  initialValue: decimal("initial_value", { precision: 10, scale: 2 }).default("40.00"),
  convertedValue: decimal("converted_value", { precision: 10, scale: 2 }),
  
  // Status workflow
  status: text("status").default("new"), // new, contacted, qualified, demo_scheduled, proposal_sent, converted, lost, dnc
  statusReason: text("status_reason"),
  
  // Assignment
  assignedAgentId: text("assigned_agent_id"), // AI agent or human
  
  // Conversion tracking
  convertedAt: timestamp("converted_at"),
  convertedPolicyId: uuid("converted_policy_id").references(() => policies.id),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("idx_leads_status").on(table.status),
  sourceIdx: index("idx_leads_source").on(table.source),
  interestLevelIdx: index("idx_leads_interest_level").on(table.interestLevel),
  businessTypeIdx: index("idx_leads_business_type").on(table.businessType),
  createdAtIdx: index("idx_leads_created_at").on(table.createdAt),
}))

// Lead communications - All call/SMS/email interactions
export const leadCommunications = pgTable("lead_communications", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
  
  // Communication type
  channel: text("channel").notNull(), // call, sms, email
  direction: text("direction").notNull(), // inbound, outbound
  
  // Call-specific
  callDuration: integer("call_duration"), // seconds
  callRecordingUrl: text("call_recording_url"),
  callTranscript: text("call_transcript"), // Full transcript JSON
  callSummary: text("call_summary"), // AI-generated summary
  
  // SMS-specific
  smsContent: text("sms_content"),
  smsStatus: text("sms_status"), // sent, delivered, failed, received
  
  // Disposition
  disposition: text("disposition"), // reached, voicemail, no_answer, busy, callback_requested, not_interested, dnc
  nextFollowUpAt: timestamp("next_follow_up_at"),
  
  // AI Agent tracking
  agentId: text("agent_id"), // Which AI agent handled
  agentScriptUsed: text("agent_script_used"), // Script identifier
  agentConfidenceScore: decimal("agent_confidence_score", { precision: 3, scale: 2 }), // 0.00-1.00
  
  // Sentiment & outcome
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }), // -1.00 to 1.00
  outcome: text("outcome"), // positive, neutral, negative, escalate
  
  // LiveKit tracking
  livekitRoomId: text("livekit_room_id"),
  livekitSessionId: text("livekit_session_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  leadIdIdx: index("idx_lead_communications_lead_id").on(table.leadId),
  channelIdx: index("idx_lead_communications_channel").on(table.channel),
  dispositionIdx: index("idx_lead_communications_disposition").on(table.disposition),
  createdAtIdx: index("idx_lead_communications_created_at").on(table.createdAt),
}))

// Agent scripts - Customizable AI call scripts
export const agentScripts = pgTable("agent_scripts", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  name: text("name").notNull(),
  description: text("description"),
  
  // Targeting criteria
  businessType: text("business_type"), // null = all types
  interestLevel: text("interest_level"), // cold, warm, hot
  geographicRegion: text("geographic_region"), // null = all regions
  
  // Script content
  systemPrompt: text("system_prompt").notNull(), // Base AI instructions
  openingScript: text("opening_script").notNull(), // How to start the call
  keyPoints: text("key_points"), // JSON array of talking points
  objectionHandlers: text("objection_handlers"), // JSON map of objection -> response
  closingScript: text("closing_script"),
  
  // Configuration
  maxCallDuration: integer("max_call_duration").default(300), // seconds
  voiceId: text("voice_id").default("alloy"), // TTS voice
  
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // Higher = preferred
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  businessTypeIdx: index("idx_agent_scripts_business_type").on(table.businessType),
  interestLevelIdx: index("idx_agent_scripts_interest_level").on(table.interestLevel),
  activeIdx: index("idx_agent_scripts_active").on(table.isActive),
}))

// Scheduled actions - Cron-driven follow-ups and reminders
export const scheduledActions = pgTable("scheduled_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),
  
  actionType: text("action_type").notNull(), // call, sms, email
  scheduledFor: timestamp("scheduled_for").notNull(),
  
  // Context
  reason: text("reason"), // follow_up, reminder, callback_requested
  scriptId: uuid("script_id").references(() => agentScripts.id),
  customMessage: text("custom_message"),
  
  // Status
  status: text("status").default("pending"), // pending, processing, completed, failed, cancelled
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  
  processedAt: timestamp("processed_at"),
  error: text("error"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  leadIdIdx: index("idx_scheduled_actions_lead_id").on(table.leadId),
  scheduledForIdx: index("idx_scheduled_actions_scheduled_for").on(table.scheduledFor),
  statusIdx: index("idx_scheduled_actions_status").on(table.status),
}))

// Conversion events - Track the $40→$100 journey
export const conversionEvents = pgTable("conversion_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id).notNull(),
  
  eventType: text("event_type").notNull(), // page_view, quote_started, call_completed, demo_scheduled, proposal_viewed, converted
  eventValue: decimal("event_value", { precision: 10, scale: 2 }), // Attributed value
  
  metadata: text("metadata"), // JSON with event details
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  leadIdIdx: index("idx_conversion_events_lead_id").on(table.leadId),
  eventTypeIdx: index("idx_conversion_events_event_type").on(table.eventType),
  createdAtIdx: index("idx_conversion_events_created_at").on(table.createdAt),
}))

// Type exports for call center tables
export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type LeadCommunication = typeof leadCommunications.$inferSelect
export type NewLeadCommunication = typeof leadCommunications.$inferInsert
export type AgentScript = typeof agentScripts.$inferSelect
export type NewAgentScript = typeof agentScripts.$inferInsert
export type ScheduledAction = typeof scheduledActions.$inferSelect
export type NewScheduledAction = typeof scheduledActions.$inferInsert
export type ConversionEvent = typeof conversionEvents.$inferSelect
export type NewConversionEvent = typeof conversionEvents.$inferInsert

// ================= Partner Integration Support Agent Tables =================

// Support conversations - for partner integration help
export const supportConversations = pgTable("support_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Partner info
  partnerId: uuid("partner_id").references(() => partners.id),
  partnerEmail: text("partner_email"),
  partnerName: text("partner_name"),
  
  // Session info
  sessionId: text("session_id").notNull(),
  pageUrl: text("page_url"),
  onboardingStep: integer("onboarding_step"),
  
  // Technical context
  topic: text("topic"), // onboarding, widget_install, api_integration, pos_setup, troubleshooting
  techStack: text("tech_stack"), // JSON: { framework: "react", pos: "mindbody", etc. }
  integrationContext: text("integration_context"), // JSON with current integration state
  
  // Status
  status: text("status").default("active"), // active, resolved, escalated, abandoned
  priority: text("priority").default("normal"), // low, normal, high, urgent
  
  // Escalation
  escalatedAt: timestamp("escalated_at"),
  escalatedTo: uuid("escalated_to").references(() => users.id),
  escalationReason: text("escalation_reason"),
  
  // Resolution
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  
  // Satisfaction
  helpfulRating: integer("helpful_rating"),
  feedback: text("feedback"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_support_conversations_partner_id").on(table.partnerId),
  statusIdx: index("idx_support_conversations_status").on(table.status),
  topicIdx: index("idx_support_conversations_topic").on(table.topic),
  createdAtIdx: index("idx_support_conversations_created_at").on(table.createdAt),
}))

// Support messages - individual messages in a conversation
export const supportMessages = pgTable("support_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => supportConversations.id, { onDelete: "cascade" }).notNull(),
  
  // Sender
  role: text("role").notNull(), // user, assistant, system
  
  // Content
  content: text("content").notNull(),
  contentType: text("content_type").default("text"), // text, code, error, action
  
  // Code snippets shared
  codeSnippet: text("code_snippet"),
  codeLanguage: text("code_language"),
  
  // AI metadata
  toolsUsed: text("tools_used"), // JSON array of tools called
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index("idx_support_messages_conversation_id").on(table.conversationId),
  roleIdx: index("idx_support_messages_role").on(table.role),
  createdAtIdx: index("idx_support_messages_created_at").on(table.createdAt),
}))

// Screen recordings for onboarding assistance
export const onboardingRecordings = pgTable("onboarding_recordings", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Owner
  partnerId: uuid("partner_id").references(() => partners.id),
  conversationId: uuid("conversation_id").references(() => supportConversations.id),
  
  // Recording info
  recordingUrl: text("recording_url").notNull(),
  duration: integer("duration"),
  
  // Context
  onboardingStep: integer("onboarding_step"),
  stepName: text("step_name"),
  
  // Issues detected
  issuesDetected: text("issues_detected"), // JSON array of detected problems
  
  // Status
  status: text("status").default("processing"), // processing, ready, analyzed, failed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_onboarding_recordings_partner_id").on(table.partnerId),
  conversationIdIdx: index("idx_onboarding_recordings_conversation_id").on(table.conversationId),
  statusIdx: index("idx_onboarding_recordings_status").on(table.status),
}))

// Integration documentation - for RAG
export const integrationDocs = pgTable("integration_docs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Content
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  content: text("content").notNull(),
  
  // Categorization
  category: text("category").notNull(), // widget, api, pos, webhook, troubleshooting
  posSystem: text("pos_system"),
  framework: text("framework"),
  
  // Search
  embedding: text("embedding"), // Vector embedding for semantic search
  
  // Code examples
  codeExamples: text("code_examples"), // JSON array of code snippets
  
  isPublished: boolean("is_published").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("idx_integration_docs_category").on(table.category),
  posSystemIdx: index("idx_integration_docs_pos_system").on(table.posSystem),
  frameworkIdx: index("idx_integration_docs_framework").on(table.framework),
  publishedIdx: index("idx_integration_docs_published").on(table.isPublished),
}))

// Partner integration status tracking
export const partnerIntegrations = pgTable("partner_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  
  // Integration type
  integrationType: text("integration_type").notNull(), // widget, api, pos
  posSystem: text("pos_system"),
  
  // Status
  status: text("status").default("pending"), // pending, configured, testing, live, failed
  
  // Configuration
  configuration: text("configuration"), // JSON with integration settings
  apiKeyGenerated: boolean("api_key_generated").default(false),
  webhookConfigured: boolean("webhook_configured").default(false),
  
  // Testing
  lastTestedAt: timestamp("last_tested_at"),
  testResult: text("test_result"),
  testErrors: text("test_errors"), // JSON array of errors
  
  // Go live
  wentLiveAt: timestamp("went_live_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_partner_integrations_partner_id").on(table.partnerId),
  integrationTypeIdx: index("idx_partner_integrations_type").on(table.integrationType),
  statusIdx: index("idx_partner_integrations_status").on(table.status),
}))

// Type exports for integration support tables
export type SupportConversation = typeof supportConversations.$inferSelect
export type NewSupportConversation = typeof supportConversations.$inferInsert
export type SupportMessage = typeof supportMessages.$inferSelect
export type NewSupportMessage = typeof supportMessages.$inferInsert
export type OnboardingRecording = typeof onboardingRecordings.$inferSelect
export type NewOnboardingRecording = typeof onboardingRecordings.$inferInsert
export type IntegrationDoc = typeof integrationDocs.$inferSelect
export type NewIntegrationDoc = typeof integrationDocs.$inferInsert
export type PartnerIntegration = typeof partnerIntegrations.$inferSelect
export type NewPartnerIntegration = typeof partnerIntegrations.$inferInsert

// ================= Admin Dashboard Tables =================

// Microsites - Partner-specific landing pages
export const microsites = pgTable("microsites", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),

  // Microsite configuration
  slug: text("slug").notNull().unique(), // partner-name-gym
  customDomain: text("custom_domain"), // Optional custom domain
  isActive: boolean("is_active").default(true),

  // Branding
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#14B8A6"),
  businessName: text("business_name"),

  // Admin earnings tracking
  setupFee: decimal("setup_fee", { precision: 10, scale: 2 }).default("550.00"),
  feeCollected: boolean("fee_collected").default(false),

  // Tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_microsites_partner_id").on(table.partnerId),
  slugIdx: index("idx_microsites_slug").on(table.slug),
  activeIdx: index("idx_microsites_active").on(table.isActive),
}))

// Admin earnings - Julian's commission tracking (25% of lead fees + $550/microsite)
export const adminEarnings = pgTable("admin_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Earning type
  earningType: text("earning_type").notNull(), // 'lead_fee' | 'microsite_setup'

  // References
  leadId: uuid("lead_id").references(() => leads.id),
  micrositeId: uuid("microsite_id").references(() => microsites.id),
  partnerId: uuid("partner_id").references(() => partners.id),

  // Amounts
  baseAmount: decimal("base_amount", { precision: 10, scale: 2 }).notNull(), // $40 or $100 or $550
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.25"), // 25%
  earnedAmount: decimal("earned_amount", { precision: 10, scale: 2 }).notNull(), // $10, $25, or $550

  // Status
  status: text("status").default("pending"), // pending, paid
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  earningTypeIdx: index("idx_admin_earnings_type").on(table.earningType),
  statusIdx: index("idx_admin_earnings_status").on(table.status),
  partnerIdIdx: index("idx_admin_earnings_partner_id").on(table.partnerId),
  createdAtIdx: index("idx_admin_earnings_created_at").on(table.createdAt),
}))

// API Integrations - HIQOR and Sures API configuration
export const apiIntegrations = pgTable("api_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Integration identity
  name: text("name").notNull().unique(), // 'hiqor' | 'sures'
  displayName: text("display_name").notNull(),

  // Configuration (encrypted in practice)
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  baseUrl: text("base_url"),
  webhookSecret: text("webhook_secret"),

  // Status
  isActive: boolean("is_active").default(false),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncStatus: text("last_sync_status"), // 'success' | 'error'
  lastSyncError: text("last_sync_error"),

  // Settings
  syncInterval: integer("sync_interval").default(60), // minutes
  autoSync: boolean("auto_sync").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  nameIdx: index("idx_api_integrations_name").on(table.name),
  activeIdx: index("idx_api_integrations_active").on(table.isActive),
}))

// API Sync Logs - Track sync history for HIQOR/Sures
export const apiSyncLogs = pgTable("api_sync_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  integrationId: uuid("integration_id").references(() => apiIntegrations.id, { onDelete: "cascade" }).notNull(),

  syncType: text("sync_type").notNull(), // 'manual' | 'scheduled'
  status: text("status").notNull(), // 'started' | 'success' | 'error'
  recordsProcessed: integer("records_processed").default(0),
  errorMessage: text("error_message"),

  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  integrationIdIdx: index("idx_api_sync_logs_integration_id").on(table.integrationId),
  statusIdx: index("idx_api_sync_logs_status").on(table.status),
  startedAtIdx: index("idx_api_sync_logs_started_at").on(table.startedAt),
}))

// Contract Templates - Editable contracts for partner onboarding
export const contractTemplates = pgTable("contract_templates", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Contract identity
  name: text("name").notNull(), // 'partnership_agreement' | 'revenue_share' | 'data_processing'
  displayName: text("display_name").notNull(), // "Partnership Agreement"
  description: text("description"), // Brief description of what this contract covers

  // Contract content
  content: text("content").notNull(), // Full contract text (markdown/HTML supported)
  version: integer("version").default(1).notNull(),

  // Status
  isActive: boolean("is_active").default(true), // Only active contracts shown to partners
  isRequired: boolean("is_required").default(true), // Must be signed during onboarding

  // Ordering
  sortOrder: integer("sort_order").default(0), // Display order in onboarding flow

  // Tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"), // When this version went live
}, (table) => ({
  nameIdx: index("idx_contract_templates_name").on(table.name),
  activeIdx: index("idx_contract_templates_active").on(table.isActive),
  sortOrderIdx: index("idx_contract_templates_sort_order").on(table.sortOrder),
}))

// Partner Contract Signatures - Track what contracts partners signed
export const partnerContractSignatures = pgTable("partner_contract_signatures", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),
  contractTemplateId: uuid("contract_template_id").references(() => contractTemplates.id).notNull(),

  // Signature details
  signedAt: timestamp("signed_at").defaultNow().notNull(),
  signatureData: text("signature_data"), // Base64 signature image if captured
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Version tracking (snapshot of contract at signing)
  contractVersion: integer("contract_version").notNull(),
  contractContentSnapshot: text("contract_content_snapshot").notNull(), // Full text at time of signing
}, (table) => ({
  partnerIdIdx: index("idx_partner_contract_signatures_partner_id").on(table.partnerId),
  contractTemplateIdIdx: index("idx_partner_contract_signatures_template_id").on(table.contractTemplateId),
  signedAtIdx: index("idx_partner_contract_signatures_signed_at").on(table.signedAt),
}))

// Type exports for admin dashboard tables
export type Microsite = typeof microsites.$inferSelect
export type NewMicrosite = typeof microsites.$inferInsert
export type AdminEarning = typeof adminEarnings.$inferSelect
export type NewAdminEarning = typeof adminEarnings.$inferInsert
export type ApiIntegration = typeof apiIntegrations.$inferSelect
export type NewApiIntegration = typeof apiIntegrations.$inferInsert
export type ApiSyncLog = typeof apiSyncLogs.$inferSelect
export type NewApiSyncLog = typeof apiSyncLogs.$inferInsert
export type ContractTemplate = typeof contractTemplates.$inferSelect
export type NewContractTemplate = typeof contractTemplates.$inferInsert
export type PartnerContractSignature = typeof partnerContractSignatures.$inferSelect
export type NewPartnerContractSignature = typeof partnerContractSignatures.$inferInsert
