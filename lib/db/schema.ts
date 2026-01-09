import { pgTable, uuid, text, boolean, decimal, timestamp, integer, primaryKey, index, jsonb, serial } from "drizzle-orm/pg-core"

// Account type - oauth, email, credentials, etc.
type AccountType = "oauth" | "email" | "credentials" | "oidc" | "webauthn"

// ================= Auth Tables =================

// Users table - authentication (works with Supabase Auth)
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
  type: text("type").$type<AccountType>().notNull(),
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
  businessAddress: text("business_address"),
  websiteUrl: text("website_url"),
  directContactName: text("direct_contact_name"),
  directContactEmail: text("direct_contact_email"),
  directContactPhone: text("direct_contact_phone"),
  estimatedMonthlyParticipants: integer("estimated_monthly_participants"),
  estimatedAnnualParticipants: integer("estimated_annual_participants"),
  integrationType: text("integration_type").default("widget"), // widget, api, manual
  primaryColor: text("primary_color").default("#14B8A6"),
  logoUrl: text("logo_url"),
  brandingImages: jsonb("branding_images").$default(() => []).notNull(),
  // Multi-location tracking
  locationCount: integer("location_count").default(1), // Total number of locations
  hasMultipleLocations: boolean("has_multiple_locations").default(false),
  status: text("status").default("pending"), // pending, documents_sent, documents_pending, under_review, active, suspended
  // Referral tracking
  referredBy: uuid("referred_by").references(() => users.id), // The sales agent who referred this partner
  referralCode: text("referral_code"), // The code used to refer
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
  websiteUrlIdx: index("idx_partners_website_url").on(table.websiteUrl),
  referredByIdx: index("idx_partners_referred_by").on(table.referredBy),
}))

// Sales Agent Profiles - extended profile for sales agents
export const salesAgentProfiles = pgTable("sales_agent_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().references(() => users.id, { onDelete: "cascade" }).notNull(),
  
  // Profile
  agencyName: text("agency_name"), // Optional business name
  phoneNumber: text("phone_number"),
  websiteUrl: text("website_url"),
  
  // Referral Config
  referralCode: text("referral_code").unique().notNull(), // Custom code e.g. "ELITESALES"
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.10"), // 10% default
  
  // Status
  status: text("status").default("active"), // active, suspended
  
  // Metrics (denormalized for speed)
  totalReferrals: integer("total_referrals").default(0),
  totalActivePolicies: integer("total_active_policies").default(0),
  lifetimeEarnings: decimal("lifetime_earnings", { precision: 12, scale: 2 }).default("0"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: index("idx_sales_agent_code").on(table.referralCode),
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
  contentSnapshot: text("content_snapshot"), // Stores the enacted content at time of signing
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Document templates - admin-editable document content
export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // partner_agreement, w9, direct_deposit
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML/Markdown content
  version: text("version").default("1.0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  typeIdx: index("idx_document_templates_type").on(table.type),
  activeIdx: index("idx_document_templates_active").on(table.isActive),
}))

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

// ================= Partner Locations =================

// Partner locations - support for multi-location businesses
export const partnerLocations = pgTable("partner_locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),

  // Location identification
  locationName: text("location_name").notNull(), // e.g., "Downtown Branch", "Main Gym"
  locationCode: text("location_code"), // Internal reference code
  isPrimary: boolean("is_primary").default(false), // Primary/HQ location

  // Address
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").default("USA"),

  // Location contact (can be different from main partner contact)
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactRole: text("contact_role"), // e.g., "Manager", "Owner", "Supervisor"

  // Location-specific branding/microsite
  micrositeId: uuid("microsite_id").references(() => microsites.id), // Links to location-specific microsite
  qrCodeUrl: text("qr_code_url"), // QR code for this specific location
  qrCodeColor: text("qr_code_color"), // Custom QR color if different from partner
  customSubdomain: text("custom_subdomain"), // e.g., "spartan-downtown"

  // Location metrics
  estimatedMonthlyParticipants: integer("estimated_monthly_participants"),
  totalPolicies: integer("total_policies").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),

  // Integration settings
  integrationType: text("integration_type"), // ecommerce, pos, embedded, api
  embedCode: text("embed_code"), // Generated embed/widget code
  apiKey: text("api_key"), // Generated API key for this location
  apiSecretHash: text("api_secret_hash"), // Hashed API secret
  webhookUrl: text("webhook_url"), // Partner's webhook URL for this location
  webhookSecret: text("webhook_secret"), // Secret for signing outbound webhooks
  webhookEvents: text("webhook_events"), // JSON array of subscribed events
  posTerminalId: text("pos_terminal_id"), // POS terminal identifier
  ecommercePlatform: text("ecommerce_platform"), // shopify, woocommerce, etc.
  ecommerceStoreId: text("ecommerce_store_id"), // Store ID on the platform

  // Status
  status: text("status").default("active"), // active, inactive, pending, closed
  activatedAt: timestamp("activated_at"),
  closedAt: timestamp("closed_at"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_partner_locations_partner_id").on(table.partnerId),
  micrositeIdIdx: index("idx_partner_locations_microsite_id").on(table.micrositeId),
  statusIdx: index("idx_partner_locations_status").on(table.status),
  cityStateIdx: index("idx_partner_locations_city_state").on(table.city, table.state),
  isPrimaryIdx: index("idx_partner_locations_is_primary").on(table.partnerId, table.isPrimary),
}))

// ================= Microsite & Carrier Management =================

// Microsites - partner branded websites we create and manage
export const microsites = pgTable("microsites", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),

  // Site identification
  domain: text("domain").unique(), // e.g., spartan.dailyeventinsurance.com
  subdomain: text("subdomain").unique(), // e.g., spartan
  customDomain: text("custom_domain"), // Partner's own domain if they want

  // Branding
  siteName: text("site_name").notNull(),
  primaryColor: text("primary_color").default("#14B8A6"),
  logoUrl: text("logo_url"),
  heroImageUrl: text("hero_image_url"),

  // Pricing (from PRICING-STRUCTURE.md)
  monthlyCharge: decimal("monthly_charge", { precision: 10, scale: 2 }).default("650"), // Total charge
  julianShare: decimal("julian_share", { precision: 10, scale: 2 }).default("500"), // Julian's share
  operatingMargin: decimal("operating_margin", { precision: 10, scale: 2 }).default("150"), // Margin

  // Setup tracking
  setupFee: decimal("setup_fee", { precision: 10, scale: 2 }).default("10000"), // $10,000 one-time
  setupFeePaid: boolean("setup_fee_paid").default(false),
  setupFeePaidAt: timestamp("setup_fee_paid_at"),

  // Billing
  billingStatus: text("billing_status").default("pending"), // pending, active, overdue, suspended
  nextBillingDate: timestamp("next_billing_date"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  // Status
  status: text("status").default("building"), // building, review, live, suspended, archived
  launchedAt: timestamp("launched_at"),
  qrCodeUrl: text("qr_code_url"), // QR code URL for microsite

  // Analytics
  totalVisitors: integer("total_visitors").default(0),
  totalLeads: integer("total_leads").default(0),
  totalPolicies: integer("total_policies").default(0),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_microsites_partner_id").on(table.partnerId),
  statusIdx: index("idx_microsites_status").on(table.status),
  billingStatusIdx: index("idx_microsites_billing_status").on(table.billingStatus),
  domainIdx: index("idx_microsites_domain").on(table.domain),
}))

// Microsite billing history - monthly invoices
export const micrositeBilling = pgTable("microsite_billing", {
  id: uuid("id").primaryKey().defaultRandom(),
  micrositeId: uuid("microsite_id").references(() => microsites.id, { onDelete: "cascade" }).notNull(),

  // Billing period
  yearMonth: text("year_month").notNull(), // "2025-01" format

  // Amounts
  totalCharge: decimal("total_charge", { precision: 10, scale: 2 }).notNull().default("650"),
  julianShare: decimal("julian_share", { precision: 10, scale: 2 }).notNull().default("500"),
  operatingCost: decimal("operating_cost", { precision: 10, scale: 2 }).notNull().default("150"),

  // Payment
  status: text("status").default("pending"), // pending, paid, overdue, waived
  invoiceNumber: text("invoice_number"),
  stripeInvoiceId: text("stripe_invoice_id"),
  paidAt: timestamp("paid_at"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  micrositeIdIdx: index("idx_microsite_billing_microsite_id").on(table.micrositeId),
  yearMonthIdx: index("idx_microsite_billing_year_month").on(table.yearMonth),
  statusIdx: index("idx_microsite_billing_status").on(table.status),
  micrositeMonthIdx: index("idx_microsite_billing_microsite_month").on(table.micrositeId, table.yearMonth),
}))

// Carrier licenses - insurance carrier licensing fees per site
export const carrierLicenses = pgTable("carrier_licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  micrositeId: uuid("microsite_id").references(() => microsites.id, { onDelete: "cascade" }).notNull(),

  // Carrier info
  carrierName: text("carrier_name").notNull().default("Mutual of Omaha"),
  carrierCode: text("carrier_code").default("MUTUAL_OMAHA"),

  // Pricing (from PRICING-STRUCTURE.md - $600/site)
  licenseFee: decimal("license_fee", { precision: 10, scale: 2 }).notNull().default("600"),

  // Status
  status: text("status").default("pending"), // pending, active, suspended, terminated
  activatedAt: timestamp("activated_at"),

  // Contract details
  contractNumber: text("contract_number"),
  contractStartDate: timestamp("contract_start_date"),
  contractEndDate: timestamp("contract_end_date"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  micrositeIdIdx: index("idx_carrier_licenses_microsite_id").on(table.micrositeId),
  carrierCodeIdx: index("idx_carrier_licenses_carrier_code").on(table.carrierCode),
  statusIdx: index("idx_carrier_licenses_status").on(table.status),
}))

// Leads - captured from microsites and quote forms
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  micrositeId: uuid("microsite_id").references(() => microsites.id),
  partnerId: uuid("partner_id").references(() => partners.id),

  // Lead identification
  vertical: text("vertical").notNull(), // gym, wellness, ski-resort, fitness
  source: text("source").notNull(), // gym-quote-form, wellness-quote-form, etc.

  // Contact info
  businessName: text("business_name"),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),

  // Business details (varies by vertical)
  formData: text("form_data"), // JSON string of all form fields

  // Volume metrics (for revenue calculator)
  expectedVolume: integer("expected_volume"), // monthly participants/treatments/visitors
  estimatedRevenue: decimal("estimated_revenue", { precision: 10, scale: 2 }), // calculated commission

  // Status
  status: text("status").default("new"), // new, contacted, qualified, proposal_sent, negotiating, won, lost

  // Assignment
  assignedTo: uuid("assigned_to").references(() => users.id),
  assignedAt: timestamp("assigned_at"),

  // Conversion tracking
  convertedToPartnerId: uuid("converted_to_partner_id").references(() => partners.id),
  convertedAt: timestamp("converted_at"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  verticalIdx: index("idx_leads_vertical").on(table.vertical),
  statusIdx: index("idx_leads_status").on(table.status),
  emailIdx: index("idx_leads_email").on(table.email),
  createdAtIdx: index("idx_leads_created_at").on(table.createdAt),
  micrositeIdIdx: index("idx_leads_microsite_id").on(table.micrositeId),
}))

// ================= Email Automation Tables =================

// Email sequences - tracking automation sequences for leads
export const emailSequences = pgTable("email_sequences", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }).notNull(),

  // Sequence configuration
  sequenceType: text("sequence_type").notNull(), // gym-nurture, wellness-nurture, etc.
  currentStep: integer("current_step").default(0).notNull(), // Which step we're on (0-indexed)
  totalSteps: integer("total_steps").notNull(), // Total number of steps in sequence

  // Status tracking
  status: text("status").default("active").notNull(), // active, paused, completed, cancelled
  lastEmailSentAt: timestamp("last_email_sent_at"),
  completedAt: timestamp("completed_at"),

  // Additional data
  metadata: text("metadata"), // JSON string for sequence-specific data

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  leadIdIdx: index("idx_email_sequences_lead_id").on(table.leadId),
  statusIdx: index("idx_email_sequences_status").on(table.status),
  sequenceTypeIdx: index("idx_email_sequences_type").on(table.sequenceType),
}))

// Scheduled emails - individual email scheduling
export const scheduledEmails = pgTable("scheduled_emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  sequenceId: uuid("sequence_id").references(() => emailSequences.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),

  // Email details
  to: text("to").notNull(), // Comma-separated for multiple recipients
  subject: text("subject").notNull(),
  htmlContent: text("html_content"),
  textContent: text("text_content"),

  // Scheduling
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),

  // Status
  status: text("status").default("pending").notNull(), // pending, processing, sent, failed, cancelled
  resendId: text("resend_id"), // Resend email ID after sending

  // Error tracking
  error: text("error"),
  attemptedAt: timestamp("attempted_at"),

  // Sequence tracking
  stepNumber: integer("step_number"), // Which step in the sequence this belongs to

  // Additional data
  metadata: text("metadata"), // JSON string for additional data

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  sequenceIdIdx: index("idx_scheduled_emails_sequence_id").on(table.sequenceId),
  leadIdIdx: index("idx_scheduled_emails_lead_id").on(table.leadId),
  statusIdx: index("idx_scheduled_emails_status").on(table.status),
  scheduledForIdx: index("idx_scheduled_emails_scheduled_for").on(table.scheduledFor),
  sentAtIdx: index("idx_scheduled_emails_sent_at").on(table.sentAt),
}))

// ================= Outbound Webhook System =================

// Webhook subscriptions - partner webhook endpoints for receiving event notifications
export const webhookSubscriptions = pgTable("webhook_subscriptions", {
  id: serial("id").primaryKey(),
  partnerId: uuid("partner_id").references(() => partners.id, { onDelete: "cascade" }).notNull(),
  locationId: uuid("location_id").references(() => partnerLocations.id, { onDelete: "cascade" }),

  // Webhook endpoint configuration
  webhookUrl: text("webhook_url").notNull(),
  webhookSecret: text("webhook_secret").notNull(),

  // Subscribed events: policy.created, policy.updated, policy.cancelled, commission.earned, commission.paid, claim.filed, claim.updated
  events: text("events").array().notNull(), // Array of event types

  // Status
  isActive: boolean("is_active").default(true).notNull(),
  failureCount: integer("failure_count").default(0).notNull(),
  lastFailureAt: timestamp("last_failure_at"),
  lastTriggeredAt: timestamp("last_triggered_at"),
  lastSuccessAt: timestamp("last_success_at"),

  // Custom headers for webhook requests (e.g., API keys, auth tokens)
  customHeaders: jsonb("custom_headers"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  partnerIdIdx: index("idx_webhook_subscriptions_partner_id").on(table.partnerId),
  locationIdIdx: index("idx_webhook_subscriptions_location_id").on(table.locationId),
  isActiveIdx: index("idx_webhook_subscriptions_is_active").on(table.isActive),
  partnerActiveIdx: index("idx_webhook_subscriptions_partner_active").on(table.partnerId, table.isActive),
}))

// Webhook delivery logs - audit trail for webhook deliveries
export const webhookDeliveryLogs = pgTable("webhook_delivery_logs", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => webhookSubscriptions.id, { onDelete: "cascade" }).notNull(),

  // Event details
  eventType: text("event_type").notNull(), // The event type that triggered this delivery
  payload: jsonb("payload").notNull(), // The full webhook payload sent

  // Response tracking
  statusCode: integer("status_code"), // HTTP response status code
  responseBody: text("response_body"), // Response body (truncated if too long)
  responseTimeMs: integer("response_time_ms"), // Response time in milliseconds
  errorMessage: text("error_message"), // Error message if delivery failed

  // Delivery status
  deliveredAt: timestamp("delivered_at"),
  success: boolean("success").notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  subscriptionIdIdx: index("idx_webhook_delivery_logs_subscription_id").on(table.subscriptionId),
  eventTypeIdx: index("idx_webhook_delivery_logs_event_type").on(table.eventType),
  successIdx: index("idx_webhook_delivery_logs_success").on(table.success),
  deliveredAtIdx: index("idx_webhook_delivery_logs_delivered_at").on(table.deliveredAt),
  subscriptionEventIdx: index("idx_webhook_delivery_logs_subscription_event").on(table.subscriptionId, table.eventType),
}))

// ================= Security & Audit =================

// Audit logs - immutable record of system actions
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Who performed the action
  actorId: uuid("actor_id"), // Nullable for system actions or unauthenticated
  actorType: text("actor_type").default("user"), // user, system, partner, admin
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  // What happened
  action: text("action").notNull(), // e.g., 'login', 'create_policy', 'view_report'
  resource: text("resource").notNull(), // e.g., 'policy:123', 'partner:456'
  
  // Details
  metadata: jsonb("metadata"), // Context, filters used, etc.
  changes: jsonb("changes"), // For updates: { before: {}, after: {} }
  
  // When
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  actorIdx: index("idx_audit_logs_actor").on(table.actorId),
  actionIdx: index("idx_audit_logs_action").on(table.action),
  resourceIdx: index("idx_audit_logs_resource").on(table.resource),
  createdAtIdx: index("idx_audit_logs_created_at").on(table.createdAt),
}))

// Rate limits - persistent storage for rate limiting
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { mode: "date" }).notNull()
})

// ================= Articles & Content Management =================

// Article categories - for organizing articles
export const articleCategories = pgTable("article_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").default("#14B8A6"), // For UI display
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("idx_article_categories_slug").on(table.slug),
  activeIdx: index("idx_article_categories_active").on(table.isActive),
  sortOrderIdx: index("idx_article_categories_sort_order").on(table.sortOrder),
}))

// Articles - main content table
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"), // Short summary for listings
  content: text("content").notNull(), // Markdown/HTML content

  // Media
  featuredImageUrl: text("featured_image_url"),
  featuredImageAlt: text("featured_image_alt"),

  // Categorization
  categoryId: uuid("category_id").references(() => articleCategories.id),
  tags: jsonb("tags").$default(() => []), // Array of tag strings

  // Author
  authorId: uuid("author_id").references(() => users.id),
  authorName: text("author_name"), // Denormalized for display

  // Publishing
  status: text("status").default("draft"), // draft, published, archived, scheduled
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"), // For scheduled publishing

  // SEO
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  canonicalUrl: text("canonical_url"),

  // Engagement
  views: integer("views").default(0),
  readTimeMinutes: integer("read_time_minutes"), // Calculated on save

  // Portal targeting - which portal(s) this article appears in
  portals: jsonb("portals").$default(() => ["all"]), // ["all", "partner", "customer", "sales"]

  // Featured/pinned
  isFeatured: boolean("is_featured").default(false),
  isPinned: boolean("is_pinned").default(false),
  sortOrder: integer("sort_order").default(0),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("idx_articles_slug").on(table.slug),
  statusIdx: index("idx_articles_status").on(table.status),
  categoryIdx: index("idx_articles_category").on(table.categoryId),
  authorIdx: index("idx_articles_author").on(table.authorId),
  publishedAtIdx: index("idx_articles_published_at").on(table.publishedAt),
  featuredIdx: index("idx_articles_featured").on(table.isFeatured),
  statusPublishedIdx: index("idx_articles_status_published").on(table.status, table.publishedAt),
}))

// Article revisions - version history for articles
export const articleRevisions = pgTable("article_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),

  // Content snapshot
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),

  // Metadata
  revisionNumber: integer("revision_number").notNull(),
  editorId: uuid("editor_id").references(() => users.id),
  editorName: text("editor_name"),
  changeNote: text("change_note"), // What was changed

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  articleIdx: index("idx_article_revisions_article").on(table.articleId),
  revisionIdx: index("idx_article_revisions_number").on(table.articleId, table.revisionNumber),
}))



// ================= Chat & AI Logs =================

export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id), // Optional: link to logged-in user
  visitorId: text("visitor_id"), // Optional: for anonymous tracking
  agentType: text("agent_type").default('support'), // support, sales, onboarding
  status: text("status").default('active'), // active, closed, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_chat_conversations_user_id").on(table.userId),
  visitorIdIdx: index("idx_chat_conversations_visitor_id").on(table.visitorId),
}))

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => chatConversations.id, { onDelete: 'cascade' }).notNull(),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // e.g. { mode: 'voice', latencyMs: 123 }
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index("idx_chat_messages_conversation_id").on(table.conversationId),
  createdAtIdx: index("idx_chat_messages_created_at").on(table.createdAt),
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
export type DocumentTemplate = typeof documentTemplates.$inferSelect
export type NewDocumentTemplate = typeof documentTemplates.$inferInsert
export type Microsite = typeof microsites.$inferSelect
export type NewMicrosite = typeof microsites.$inferInsert
export type MicrositeBilling = typeof micrositeBilling.$inferSelect
export type NewMicrositeBilling = typeof micrositeBilling.$inferInsert
export type CarrierLicense = typeof carrierLicenses.$inferSelect
export type NewCarrierLicense = typeof carrierLicenses.$inferInsert
export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type EmailSequence = typeof emailSequences.$inferSelect
export type NewEmailSequence = typeof emailSequences.$inferInsert
export type ScheduledEmail = typeof scheduledEmails.$inferSelect
export type NewScheduledEmail = typeof scheduledEmails.$inferInsert
export type PartnerLocation = typeof partnerLocations.$inferSelect
export type NewPartnerLocation = typeof partnerLocations.$inferInsert
export type WebhookSubscription = typeof webhookSubscriptions.$inferSelect
export type NewWebhookSubscription = typeof webhookSubscriptions.$inferInsert
export type WebhookDeliveryLog = typeof webhookDeliveryLogs.$inferSelect
export type NewWebhookDeliveryLog = typeof webhookDeliveryLogs.$inferInsert
export type ArticleCategory = typeof articleCategories.$inferSelect
export type NewArticleCategory = typeof articleCategories.$inferInsert
export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert
export type ArticleRevision = typeof articleRevisions.$inferSelect
export type NewArticleRevision = typeof articleRevisions.$inferInsert
