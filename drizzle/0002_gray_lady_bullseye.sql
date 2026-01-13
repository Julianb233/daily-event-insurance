CREATE TABLE "integration_docs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"pos_system" text,
	"framework" text,
	"embedding" text,
	"code_examples" text,
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "integration_docs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "onboarding_recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid,
	"conversation_id" uuid,
	"recording_url" text NOT NULL,
	"duration" integer,
	"onboarding_step" integer,
	"step_name" text,
	"issues_detected" text,
	"status" text DEFAULT 'processing',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"integration_type" text NOT NULL,
	"pos_system" text,
	"status" text DEFAULT 'pending',
	"configuration" text,
	"api_key_generated" boolean DEFAULT false,
	"webhook_configured" boolean DEFAULT false,
	"last_tested_at" timestamp,
	"test_result" text,
	"test_errors" text,
	"went_live_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid,
	"partner_email" text,
	"partner_name" text,
	"session_id" text NOT NULL,
	"page_url" text,
	"onboarding_step" integer,
	"topic" text,
	"tech_stack" text,
	"integration_context" text,
	"status" text DEFAULT 'active',
	"priority" text DEFAULT 'normal',
	"escalated_at" timestamp,
	"escalated_to" uuid,
	"escalation_reason" text,
	"resolution" text,
	"resolved_at" timestamp,
	"helpful_rating" integer,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"content_type" text DEFAULT 'text',
	"code_snippet" text,
	"code_language" text,
	"tools_used" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onboarding_recordings" ADD CONSTRAINT "onboarding_recordings_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_recordings" ADD CONSTRAINT "onboarding_recordings_conversation_id_support_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."support_conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_integrations" ADD CONSTRAINT "partner_integrations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_conversations" ADD CONSTRAINT "support_conversations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_conversations" ADD CONSTRAINT "support_conversations_escalated_to_users_id_fk" FOREIGN KEY ("escalated_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_conversation_id_support_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."support_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_integration_docs_category" ON "integration_docs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_integration_docs_pos_system" ON "integration_docs" USING btree ("pos_system");--> statement-breakpoint
CREATE INDEX "idx_integration_docs_framework" ON "integration_docs" USING btree ("framework");--> statement-breakpoint
CREATE INDEX "idx_integration_docs_published" ON "integration_docs" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_onboarding_recordings_partner_id" ON "onboarding_recordings" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_onboarding_recordings_conversation_id" ON "onboarding_recordings" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_onboarding_recordings_status" ON "onboarding_recordings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_partner_integrations_partner_id" ON "partner_integrations" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_integrations_type" ON "partner_integrations" USING btree ("integration_type");--> statement-breakpoint
CREATE INDEX "idx_partner_integrations_status" ON "partner_integrations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_support_conversations_partner_id" ON "support_conversations" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_support_conversations_status" ON "support_conversations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_support_conversations_topic" ON "support_conversations" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "idx_support_conversations_created_at" ON "support_conversations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_support_messages_conversation_id" ON "support_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_support_messages_role" ON "support_messages" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_support_messages_created_at" ON "support_messages" USING btree ("created_at");