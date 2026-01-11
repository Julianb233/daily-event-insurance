CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"actor_type" text DEFAULT 'user',
	"ip_address" text,
	"user_agent" text,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"metadata" jsonb,
	"changes" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"visitor_id" text,
	"agent_type" text DEFAULT 'support',
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"reset_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_agent_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"agency_name" text,
	"phone_number" text,
	"website_url" text,
	"referral_code" text NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.10',
	"status" text DEFAULT 'active',
	"total_referrals" integer DEFAULT 0,
	"total_active_policies" integer DEFAULT 0,
	"lifetime_earnings" numeric(12, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sales_agent_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "sales_agent_profiles_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
ALTER TABLE "partner_documents" ADD COLUMN "signature_type" text DEFAULT 'text';--> statement-breakpoint
ALTER TABLE "partner_documents" ADD COLUMN "signature_image" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "referred_by" uuid;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_chat_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_agent_profiles" ADD CONSTRAINT "sales_agent_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_logs_actor" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_resource" ON "audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_conversations_user_id" ON "chat_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_chat_conversations_visitor_id" ON "chat_conversations" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_conversation_id" ON "chat_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_created_at" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_sales_agent_code" ON "sales_agent_profiles" USING btree ("referral_code");--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_referred_by_users_id_fk" FOREIGN KEY ("referred_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_partners_referred_by" ON "partners" USING btree ("referred_by");