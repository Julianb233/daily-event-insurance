CREATE TABLE "microsite_change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"microsite_id" uuid,
	"request_number" text NOT NULL,
	"request_type" text NOT NULL,
	"current_branding" jsonb,
	"current_content" jsonb,
	"requested_branding" jsonb,
	"requested_content" jsonb,
	"partner_notes" text,
	"source" text DEFAULT 'dashboard',
	"status" text DEFAULT 'pending',
	"reviewed_by" uuid,
	"review_notes" text,
	"rejection_reason" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "microsite_change_requests_request_number_unique" UNIQUE("request_number")
);
--> statement-breakpoint
ALTER TABLE "microsite_change_requests" ADD CONSTRAINT "microsite_change_requests_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "microsite_change_requests" ADD CONSTRAINT "microsite_change_requests_microsite_id_microsites_id_fk" FOREIGN KEY ("microsite_id") REFERENCES "public"."microsites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_microsite_change_requests_partner_id" ON "microsite_change_requests" USING btree ("partner_id");--> statement-breakpoint
CREATE INDEX "idx_microsite_change_requests_microsite_id" ON "microsite_change_requests" USING btree ("microsite_id");--> statement-breakpoint
CREATE INDEX "idx_microsite_change_requests_status" ON "microsite_change_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_microsite_change_requests_type" ON "microsite_change_requests" USING btree ("request_type");