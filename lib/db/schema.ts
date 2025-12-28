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
