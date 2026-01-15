CREATE TABLE "abm_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" text NOT NULL,
	"company_name" text NOT NULL,
	"industry" text,
	"company_size" text,
	"annual_revenue" text,
	"website" text,
	"headquarters_location" text,
	"employee_count" integer DEFAULT 0,
	"score" integer DEFAULT 0,
	"stage" text DEFAULT 'awareness',
	"health_score" integer DEFAULT 50,
	"metrics" text,
	"custom_fields" text,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "abm_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"contact_id" uuid,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "abm_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"email" text,
	"phone" text,
	"linkedin_url" text,
	"role" text DEFAULT 'user',
	"engagement_score" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false,
	"last_activity" timestamp DEFAULT now(),
	"preferences" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "priority_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "traffic_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "is_franchise" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "traffic_data" text;--> statement-breakpoint
ALTER TABLE "abm_activities" ADD CONSTRAINT "abm_activities_account_id_abm_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."abm_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abm_activities" ADD CONSTRAINT "abm_activities_contact_id_abm_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."abm_contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abm_activities" ADD CONSTRAINT "abm_activities_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abm_contacts" ADD CONSTRAINT "abm_contacts_account_id_abm_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."abm_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_abm_accounts_client_id" ON "abm_accounts" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_abm_accounts_score" ON "abm_accounts" USING btree ("score");--> statement-breakpoint
CREATE INDEX "idx_abm_accounts_stage" ON "abm_accounts" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "idx_abm_activities_account_id" ON "abm_activities" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_abm_activities_contact_id" ON "abm_activities" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_abm_activities_timestamp" ON "abm_activities" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_abm_activities_type" ON "abm_activities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_abm_contacts_account_id" ON "abm_contacts" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_abm_contacts_email" ON "abm_contacts" USING btree ("email");