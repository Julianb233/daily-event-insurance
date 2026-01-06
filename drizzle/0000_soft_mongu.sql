CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "carrier_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"microsite_id" uuid NOT NULL,
	"carrier_name" text DEFAULT 'Mutual of Omaha' NOT NULL,
	"carrier_code" text DEFAULT 'MUTUAL_OMAHA',
	"license_fee" numeric(10, 2) DEFAULT '600' NOT NULL,
	"status" text DEFAULT 'pending',
	"activated_at" timestamp,
	"contract_number" text,
	"contract_start_date" timestamp,
	"contract_end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claim_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"mime_type" text,
	"description" text,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" uuid NOT NULL,
	"partner_id" uuid NOT NULL,
	"claim_number" text NOT NULL,
	"claim_type" text NOT NULL,
	"incident_date" timestamp NOT NULL,
	"incident_location" text,
	"incident_description" text NOT NULL,
	"claimant_name" text NOT NULL,
	"claimant_email" text,
	"claimant_phone" text,
	"claim_amount" numeric(10, 2),
	"approved_amount" numeric(10, 2),
	"payout_amount" numeric(10, 2) DEFAULT '0',
	"deductible_amount" numeric(10, 2) DEFAULT '0',
	"status" text DEFAULT 'submitted' NOT NULL,
	"assigned_to" text,
	"review_notes" text,
	"denial_reason" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"approved_at" timestamp,
	"denied_at" timestamp,
	"paid_at" timestamp,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "claims_claim_number_unique" UNIQUE("claim_number")
);
--> statement-breakpoint
CREATE TABLE "commission_payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"year_month" text NOT NULL,
	"tier_at_payout" text NOT NULL,
	"commission_rate" numeric(5, 4) NOT NULL,
	"total_policies" integer DEFAULT 0 NOT NULL,
	"total_participants" integer DEFAULT 0 NOT NULL,
	"gross_revenue" numeric(12, 2) DEFAULT '0' NOT NULL,
	"commission_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"bonus_amount" numeric(10, 2) DEFAULT '0',
	"status" text DEFAULT 'pending',
	"paid_at" timestamp,
	"payment_reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier_name" text NOT NULL,
	"min_volume" integer DEFAULT 0 NOT NULL,
	"max_volume" integer,
	"commission_rate" numeric(5, 4) DEFAULT '0.50' NOT NULL,
	"flat_bonus" numeric(10, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"version" text DEFAULT '1.0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"sequence_type" text NOT NULL,
	"current_step" integer DEFAULT 0 NOT NULL,
	"total_steps" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_email_sent_at" timestamp,
	"completed_at" timestamp,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"microsite_id" uuid,
	"partner_id" uuid,
	"vertical" text NOT NULL,
	"source" text NOT NULL,
	"business_name" text,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"form_data" text,
	"expected_volume" integer,
	"estimated_revenue" numeric(10, 2),
	"status" text DEFAULT 'new',
	"assigned_to" uuid,
	"assigned_at" timestamp,
	"converted_to_partner_id" uuid,
	"converted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "microsite_billing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"microsite_id" uuid NOT NULL,
	"year_month" text NOT NULL,
	"total_charge" numeric(10, 2) DEFAULT '650' NOT NULL,
	"julian_share" numeric(10, 2) DEFAULT '500' NOT NULL,
	"operating_cost" numeric(10, 2) DEFAULT '150' NOT NULL,
	"status" text DEFAULT 'pending',
	"invoice_number" text,
	"stripe_invoice_id" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "microsites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"domain" text,
	"subdomain" text,
	"custom_domain" text,
	"site_name" text NOT NULL,
	"primary_color" text DEFAULT '#14B8A6',
	"logo_url" text,
	"hero_image_url" text,
	"monthly_charge" numeric(10, 2) DEFAULT '650',
	"julian_share" numeric(10, 2) DEFAULT '500',
	"operating_margin" numeric(10, 2) DEFAULT '150',
	"setup_fee" numeric(10, 2) DEFAULT '10000',
	"setup_fee_paid" boolean DEFAULT false,
	"setup_fee_paid_at" timestamp,
	"billing_status" text DEFAULT 'pending',
	"next_billing_date" timestamp,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'building',
	"launched_at" timestamp,
	"qr_code_url" text,
	"total_visitors" integer DEFAULT 0,
	"total_leads" integer DEFAULT 0,
	"total_policies" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "microsites_domain_unique" UNIQUE("domain"),
	CONSTRAINT "microsites_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE "monthly_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"year_month" text NOT NULL,
	"total_participants" integer DEFAULT 0,
	"opted_in_participants" integer DEFAULT 0,
	"partner_commission" numeric(10, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"document_type" text NOT NULL,
	"ghl_document_id" text,
	"status" text DEFAULT 'pending',
	"content_snapshot" text,
	"sent_at" timestamp,
	"viewed_at" timestamp,
	"signed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"location_name" text NOT NULL,
	"location_code" text,
	"is_primary" boolean DEFAULT false,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"country" text DEFAULT 'USA',
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"contact_role" text,
	"microsite_id" uuid,
	"qr_code_url" text,
	"qr_code_color" text,
	"custom_subdomain" text,
	"estimated_monthly_participants" integer,
	"total_policies" integer DEFAULT 0,
	"total_revenue" numeric(12, 2) DEFAULT '0',
	"integration_type" text,
	"embed_code" text,
	"api_key" text,
	"api_secret_hash" text,
	"webhook_url" text,
	"webhook_secret" text,
	"webhook_events" text,
	"pos_terminal_id" text,
	"ecommerce_platform" text,
	"ecommerce_store_id" text,
	"status" text DEFAULT 'active',
	"activated_at" timestamp,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"product_type" text NOT NULL,
	"is_enabled" boolean DEFAULT true,
	"customer_price" numeric(10, 2) DEFAULT '4.99',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"resource_type" text NOT NULL,
	"file_url" text,
	"thumbnail_url" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_tier_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"tier_id" uuid NOT NULL,
	"reason" text,
	"applied_by" uuid,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_tier_overrides_partner_id_unique" UNIQUE("partner_id")
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"clerk_user_id" text,
	"business_name" text NOT NULL,
	"business_type" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"business_address" text,
	"website_url" text,
	"direct_contact_name" text,
	"direct_contact_email" text,
	"direct_contact_phone" text,
	"estimated_monthly_participants" integer,
	"estimated_annual_participants" integer,
	"integration_type" text DEFAULT 'widget',
	"primary_color" text DEFAULT '#14B8A6',
	"logo_url" text,
	"branding_images" jsonb NOT NULL,
	"location_count" integer DEFAULT 1,
	"has_multiple_locations" boolean DEFAULT false,
	"status" text DEFAULT 'pending',
	"ghl_contact_id" text,
	"ghl_opportunity_id" text,
	"documents_status" text DEFAULT 'not_sent',
	"agreement_signed" boolean DEFAULT false,
	"w9_signed" boolean DEFAULT false,
	"direct_deposit_signed" boolean DEFAULT false,
	"documents_sent_at" timestamp,
	"documents_completed_at" timestamp,
	"approved_at" timestamp,
	"approved_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partners_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "partners_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" uuid NOT NULL,
	"partner_id" uuid NOT NULL,
	"payment_number" text NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_charge_id" text,
	"stripe_customer_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"payment_method_details" text,
	"refund_amount" numeric(10, 2) DEFAULT '0',
	"refund_reason" text,
	"refunded_at" timestamp,
	"receipt_url" text,
	"failure_code" text,
	"failure_message" text,
	"metadata" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_payment_number_unique" UNIQUE("payment_number"),
	CONSTRAINT "payments_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"quote_id" uuid,
	"policy_number" text NOT NULL,
	"event_type" text NOT NULL,
	"event_date" timestamp NOT NULL,
	"participants" integer NOT NULL,
	"coverage_type" text NOT NULL,
	"premium" numeric(10, 2) NOT NULL,
	"commission" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'active',
	"effective_date" timestamp NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"customer_email" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"event_details" text,
	"policy_document" text,
	"certificate_issued" boolean DEFAULT false,
	"metadata" text,
	"duration" numeric(4, 1),
	"location" text,
	"risk_multiplier" numeric(5, 3),
	"commission_tier" integer,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "policies_policy_number_unique" UNIQUE("policy_number")
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"quote_number" text NOT NULL,
	"event_type" text NOT NULL,
	"event_date" timestamp NOT NULL,
	"participants" integer NOT NULL,
	"coverage_type" text NOT NULL,
	"premium" numeric(10, 2) NOT NULL,
	"commission" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending',
	"event_details" text,
	"customer_email" text,
	"customer_name" text,
	"metadata" text,
	"duration" numeric(4, 1),
	"location" text,
	"risk_multiplier" numeric(5, 3),
	"commission_tier" integer,
	"expires_at" timestamp,
	"accepted_at" timestamp,
	"declined_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quotes_quote_number_unique" UNIQUE("quote_number")
);
--> statement-breakpoint
CREATE TABLE "resource_downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sequence_id" uuid,
	"lead_id" uuid,
	"to" text NOT NULL,
	"subject" text NOT NULL,
	"html_content" text,
	"text_content" text,
	"scheduled_for" timestamp NOT NULL,
	"sent_at" timestamp,
	"status" text DEFAULT 'pending' NOT NULL,
	"resend_id" text,
	"error" text,
	"attempted_at" timestamp,
	"step_number" integer,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"password_hash" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "webhook_delivery_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscription_id" integer NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status_code" integer,
	"response_body" text,
	"response_time_ms" integer,
	"error_message" text,
	"delivered_at" timestamp,
	"success" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" text,
	"partner_id" uuid,
	"processed" boolean DEFAULT false,
	"processed_at" timestamp,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" uuid NOT NULL,
	"location_id" uuid,
	"webhook_url" text NOT NULL,
	"webhook_secret" text NOT NULL,
	"events" text[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"last_failure_at" timestamp,
	"last_triggered_at" timestamp,
	"last_success_at" timestamp,
	"custom_headers" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrier_licenses" ADD CONSTRAINT "carrier_licenses_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_documents" ADD CONSTRAINT "claim_documents_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_payouts" ADD CONSTRAINT "commission_payouts_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_sequences" ADD CONSTRAINT "email_sequences_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_converted_to_partner_id_partners_id_fk" FOREIGN KEY ("converted_to_partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "microsite_billing" ADD CONSTRAINT "microsite_billing_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "microsites" ADD CONSTRAINT "microsites_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_earnings" ADD CONSTRAINT "monthly_earnings_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_documents" ADD CONSTRAINT "partner_documents_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_locations" ADD CONSTRAINT "partner_locations_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_products" ADD CONSTRAINT "partner_products_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_tier_overrides" ADD CONSTRAINT "partner_tier_overrides_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_tier_overrides" ADD CONSTRAINT "partner_tier_overrides_tier_id_commission_tiers_id_fk" FOREIGN KEY ("tier_id") REFERENCES "public"."commission_tiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_tier_overrides" ADD CONSTRAINT "partner_tier_overrides_applied_by_users_id_fk" FOREIGN KEY ("applied_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_downloads" ADD CONSTRAINT "resource_downloads_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_downloads" ADD CONSTRAINT "resource_downloads_resource_id_partner_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."partner_resources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_emails" ADD CONSTRAINT "scheduled_emails_sequence_id_email_sequences_id_fk" FOREIGN KEY ("sequence_id") REFERENCES "public"."email_sequences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_emails" ADD CONSTRAINT "scheduled_emails_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_delivery_logs" ADD CONSTRAINT "webhook_delivery_logs_subscription_id_webhook_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."webhook_subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_subscriptions" ADD CONSTRAINT "webhook_subscriptions_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_subscriptions" ADD CONSTRAINT "webhook_subscriptions_location_id_partner_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."partner_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_carrier_licenses_microsite_id" ON "carrier_licenses" USING btree ("microsite_id");--> statement-breakpoint
CREATE INDEX "idx_carrier_licenses_carrier_code" ON "carrier_licenses" USING btree ("carrier_code");--> statement-breakpoint
CREATE INDEX "idx_carrier_licenses_status" ON "carrier_licenses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_claim_documents_claim_id" ON "claim_documents" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "idx_claim_documents_type" ON "claim_documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "idx_claims_policy_id" ON "claims" USING btree ("policy_id");--> statement-breakpoint
CREATE INDEX "idx_claims_partner_id" ON "claims" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_claims_status" ON "claims" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_claims_incident_date" ON "claims" USING btree ("incident_date");--> statement-breakpoint
CREATE INDEX "idx_claims_created_at" ON "claims" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_claims_partner_status" ON "claims" USING btree ("partner_id","status");--> statement-breakpoint
CREATE INDEX "idx_commission_payouts_partner_id" ON "commission_payouts" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_commission_payouts_year_month" ON "commission_payouts" USING btree ("year_month");--> statement-breakpoint
CREATE INDEX "idx_commission_payouts_status" ON "commission_payouts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_commission_payouts_partner_month" ON "commission_payouts" USING btree ("partner_id","year_month");--> statement-breakpoint
CREATE INDEX "idx_commission_tiers_tier_name" ON "commission_tiers" USING btree ("tier_name");--> statement-breakpoint
CREATE INDEX "idx_commission_tiers_sort_order" ON "commission_tiers" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_commission_tiers_active" ON "commission_tiers" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_document_templates_type" ON "document_templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_document_templates_active" ON "document_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_email_sequences_lead_id" ON "email_sequences" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_email_sequences_status" ON "email_sequences" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_email_sequences_type" ON "email_sequences" USING btree ("sequence_type");--> statement-breakpoint
CREATE INDEX "idx_leads_vertical" ON "leads" USING btree ("vertical");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_email" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_leads_microsite_id" ON "leads" USING btree ("microsite_id");--> statement-breakpoint
CREATE INDEX "idx_microsite_billing_microsite_id" ON "microsite_billing" USING btree ("microsite_id");--> statement-breakpoint
CREATE INDEX "idx_microsite_billing_year_month" ON "microsite_billing" USING btree ("year_month");--> statement-breakpoint
CREATE INDEX "idx_microsite_billing_status" ON "microsite_billing" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_microsite_billing_microsite_month" ON "microsite_billing" USING btree ("microsite_id","year_month");--> statement-breakpoint
CREATE INDEX "idx_microsites_partner_id" ON "microsites" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_microsites_status" ON "microsites" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_microsites_billing_status" ON "microsites" USING btree ("billing_status");--> statement-breakpoint
CREATE INDEX "idx_microsites_domain" ON "microsites" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "idx_monthly_earnings_partner_month" ON "monthly_earnings" USING btree ("partner_id","year_month");--> statement-breakpoint
CREATE INDEX "idx_partner_locations_partner_id" ON "partner_locations" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_locations_microsite_id" ON "partner_locations" USING btree ("microsite_id");--> statement-breakpoint
CREATE INDEX "idx_partner_locations_status" ON "partner_locations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_partner_locations_city_state" ON "partner_locations" USING btree ("city","state");--> statement-breakpoint
CREATE INDEX "idx_partner_locations_is_primary" ON "partner_locations" USING btree ("partner_id","is_primary");--> statement-breakpoint
CREATE INDEX "idx_partner_products_partner_id" ON "partner_products" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_tier_overrides_partner_id" ON "partner_tier_overrides" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_partner_tier_overrides_tier_id" ON "partner_tier_overrides" USING btree ("tier_id");--> statement-breakpoint
CREATE INDEX "idx_partners_status" ON "partners" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_partners_business_type" ON "partners" USING btree ("business_type");--> statement-breakpoint
CREATE INDEX "idx_partners_website_url" ON "partners" USING btree ("website_url");--> statement-breakpoint
CREATE INDEX "idx_payments_policy_id" ON "payments" USING btree ("policy_id");--> statement-breakpoint
CREATE INDEX "idx_payments_partner_id" ON "payments" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_payments_status" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payments_stripe_intent" ON "payments" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX "idx_payments_created_at" ON "payments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payments_partner_status" ON "payments" USING btree ("partner_id","status");--> statement-breakpoint
CREATE INDEX "idx_policies_partner_id" ON "policies" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_policies_quote_id" ON "policies" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "idx_policies_status" ON "policies" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_policies_coverage_type" ON "policies" USING btree ("coverage_type");--> statement-breakpoint
CREATE INDEX "idx_policies_event_date" ON "policies" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "idx_policies_effective_date" ON "policies" USING btree ("effective_date");--> statement-breakpoint
CREATE INDEX "idx_policies_created_at" ON "policies" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_quotes_partner_id" ON "quotes" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_quotes_status" ON "quotes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_quotes_coverage_type" ON "quotes" USING btree ("coverage_type");--> statement-breakpoint
CREATE INDEX "idx_quotes_event_date" ON "quotes" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "idx_quotes_created_at" ON "quotes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_quotes_expires_at" ON "quotes" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_scheduled_emails_sequence_id" ON "scheduled_emails" USING btree ("sequence_id");--> statement-breakpoint
CREATE INDEX "idx_scheduled_emails_lead_id" ON "scheduled_emails" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_scheduled_emails_status" ON "scheduled_emails" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_scheduled_emails_scheduled_for" ON "scheduled_emails" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "idx_scheduled_emails_sent_at" ON "scheduled_emails" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "idx_webhook_delivery_logs_subscription_id" ON "webhook_delivery_logs" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "idx_webhook_delivery_logs_event_type" ON "webhook_delivery_logs" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_webhook_delivery_logs_success" ON "webhook_delivery_logs" USING btree ("success");--> statement-breakpoint
CREATE INDEX "idx_webhook_delivery_logs_delivered_at" ON "webhook_delivery_logs" USING btree ("delivered_at");--> statement-breakpoint
CREATE INDEX "idx_webhook_delivery_logs_subscription_event" ON "webhook_delivery_logs" USING btree ("subscription_id","event_type");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_processed" ON "webhook_events" USING btree ("processed");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_created_at" ON "webhook_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_webhook_subscriptions_partner_id" ON "webhook_subscriptions" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_webhook_subscriptions_location_id" ON "webhook_subscriptions" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "idx_webhook_subscriptions_is_active" ON "webhook_subscriptions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_webhook_subscriptions_partner_active" ON "webhook_subscriptions" USING btree ("partner_id","is_active");