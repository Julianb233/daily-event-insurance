/**
 * Email-related database schema
 * Extends the main schema with email sequence and scheduling tables
 */

import { pgTable, uuid, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { leads } from "./schema"

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

// Type exports
export type EmailSequence = typeof emailSequences.$inferSelect
export type NewEmailSequence = typeof emailSequences.$inferInsert
export type ScheduledEmail = typeof scheduledEmails.$inferSelect
export type NewScheduledEmail = typeof scheduledEmails.$inferInsert
