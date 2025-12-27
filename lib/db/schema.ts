import { pgTable, uuid, text, boolean, decimal, timestamp, integer } from "drizzle-orm/pg-core"

// Partners table - main partner profiles
export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(), // gym, climbing, rental, etc.
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  integrationType: text("integration_type").default("widget"), // widget, api, manual
  primaryColor: text("primary_color").default("#14B8A6"),
  logoUrl: text("logo_url"),
  status: text("status").default("active"), // pending, active, suspended
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

// Type exports for use in application
export type Partner = typeof partners.$inferSelect
export type NewPartner = typeof partners.$inferInsert
export type PartnerProduct = typeof partnerProducts.$inferSelect
export type NewPartnerProduct = typeof partnerProducts.$inferInsert
export type MonthlyEarning = typeof monthlyEarnings.$inferSelect
export type NewMonthlyEarning = typeof monthlyEarnings.$inferInsert
export type PartnerResource = typeof partnerResources.$inferSelect
export type ResourceDownload = typeof resourceDownloads.$inferSelect
