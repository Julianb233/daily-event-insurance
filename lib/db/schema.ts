import { pgTable, uuid, text, boolean, decimal, timestamp, integer, primaryKey } from "drizzle-orm/pg-core"
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
})

// Partner products - product configurations per partner
export const partnerProducts = pgTable("partner_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  productType: text("product_type").notNull(), // liability, equipment, cancellation
  isEnabled: boolean("is_enabled").default(true),
  customerPrice: decimal("customer_price", { precision: 10, scale: 2 }).default("4.99"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Monthly earnings - tracking partner commission
export const monthlyEarnings = pgTable("monthly_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id").references(() => partners.id).notNull(),
  yearMonth: text("year_month").notNull(), // "2025-01" format
  totalParticipants: integer("total_participants").default(0),
  optedInParticipants: integer("opted_in_participants").default(0),
  partnerCommission: decimal("partner_commission", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

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
})

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
})

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
})

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
