CREATE TABLE "admin_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"earning_type" text NOT NULL,
	"lead_id" uuid,
	"microsite_id" uuid,
	"partner_id" uuid,
	"base_amount" numeric(10, 2) NOT NULL,
	"commission_rate" numeric(5, 4) DEFAULT '0.25',
	"earned_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"api_key" text,
	"api_secret" text,
	"base_url" text,
	"webhook_secret" text,
	"is_active" boolean DEFAULT false,
	"last_sync_at" timestamp,
	"last_sync_status" text,
	"last_sync_error" text,
	"sync_interval" integer DEFAULT 60,
	"auto_sync" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_integrations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "api_sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" uuid NOT NULL,
	"sync_type" text NOT NULL,
	"status" text NOT NULL,
	"records_processed" integer DEFAULT 0,
	"error_message" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "contract_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_required" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "microsites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"custom_domain" text,
	"is_active" boolean DEFAULT true,
	"logo_url" text,
	"primary_color" text DEFAULT '#14B8A6',
	"business_name" text,
	"setup_fee" numeric(10, 2) DEFAULT '550.00',
	"fee_collected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "microsites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "partner_contract_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"contract_template_id" uuid NOT NULL,
	"signed_at" timestamp DEFAULT now() NOT NULL,
	"signature_data" text,
	"ip_address" text,
	"user_agent" text,
	"contract_version" integer NOT NULL,
	"contract_content_snapshot" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "branding_images" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "admin_earnings" ADD CONSTRAINT "admin_earnings_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_earnings" ADD CONSTRAINT "admin_earnings_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_earnings" ADD CONSTRAINT "admin_earnings_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_sync_logs" ADD CONSTRAINT "api_sync_logs_integration_id_api_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."api_integrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "microsites" ADD CONSTRAINT "microsites_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_contract_signatures" ADD CONSTRAINT "partner_contract_signatures_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_contract_signatures" ADD CONSTRAINT "partner_contract_signatures_contract_template_id_contract_templates_id_fk" FOREIGN KEY ("contract_template_id") REFERENCES "public"."contract_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_admin_earnings_type" ON "admin_earnings" USING btree ("earning_type");--> statement-breakpoint
CREATE INDEX "idx_admin_earnings_status" ON "admin_earnings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_admin_earnings_partner_id" ON "admin_earnings" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_admin_earnings_created_at" ON "admin_earnings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_api_integrations_name" ON "api_integrations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_api_integrations_active" ON "api_integrations" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_api_sync_logs_integration_id" ON "api_sync_logs" USING btree ("integration_id");--> statement-breakpoint
CREATE INDEX "idx_api_sync_logs_status" ON "api_sync_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_api_sync_logs_started_at" ON "api_sync_logs" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_contract_templates_name" ON "contract_templates" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_contract_templates_active" ON "contract_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_contract_templates_sort_order" ON "contract_templates" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_microsites_partner_id" ON "microsites" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_microsites_slug" ON "microsites" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_microsites_active" ON "microsites" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_partner_contract_signatures_partner_id" ON "partner_contract_signatures" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_contract_signatures_template_id" ON "partner_contract_signatures" USING btree ("contract_template_id");--> statement-breakpoint
CREATE INDEX "idx_partner_contract_signatures_signed_at" ON "partner_contract_signatures" USING btree ("signed_at");