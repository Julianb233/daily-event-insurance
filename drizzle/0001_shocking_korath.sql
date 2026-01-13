CREATE TABLE "agent_scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"business_type" text,
	"interest_level" text,
	"geographic_region" text,
	"system_prompt" text NOT NULL,
	"opening_script" text NOT NULL,
	"key_points" text,
	"objection_handlers" text,
	"closing_script" text,
	"max_call_duration" integer DEFAULT 300,
	"voice_id" text DEFAULT 'alloy',
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversion_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"event_value" numeric(10, 2),
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"channel" text NOT NULL,
	"direction" text NOT NULL,
	"call_duration" integer,
	"call_recording_url" text,
	"call_transcript" text,
	"call_summary" text,
	"sms_content" text,
	"sms_status" text,
	"disposition" text,
	"next_follow_up_at" timestamp,
	"agent_id" text,
	"agent_script_used" text,
	"agent_confidence_score" numeric(3, 2),
	"sentiment_score" numeric(3, 2),
	"outcome" text,
	"livekit_room_id" text,
	"livekit_session_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"source_details" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"business_type" text,
	"business_name" text,
	"estimated_participants" integer,
	"interest_level" text DEFAULT 'cold',
	"interest_score" integer DEFAULT 0,
	"last_activity_at" timestamp,
	"activity_history" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"timezone" text DEFAULT 'America/Los_Angeles',
	"initial_value" numeric(10, 2) DEFAULT '40.00',
	"converted_value" numeric(10, 2),
	"status" text DEFAULT 'new',
	"status_reason" text,
	"assigned_agent_id" text,
	"converted_at" timestamp,
	"converted_policy_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"action_type" text NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"reason" text,
	"script_id" uuid,
	"custom_message" text,
	"status" text DEFAULT 'pending',
	"attempts" integer DEFAULT 0,
	"max_attempts" integer DEFAULT 3,
	"processed_at" timestamp,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversion_events" ADD CONSTRAINT "conversion_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_communications" ADD CONSTRAINT "lead_communications_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_converted_policy_id_policies_id_fk" FOREIGN KEY ("converted_policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_actions" ADD CONSTRAINT "scheduled_actions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_actions" ADD CONSTRAINT "scheduled_actions_script_id_agent_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."agent_scripts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agent_scripts_business_type" ON "agent_scripts" USING btree ("business_type");--> statement-breakpoint
CREATE INDEX "idx_agent_scripts_interest_level" ON "agent_scripts" USING btree ("interest_level");--> statement-breakpoint
CREATE INDEX "idx_agent_scripts_active" ON "agent_scripts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_conversion_events_lead_id" ON "conversion_events" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_conversion_events_event_type" ON "conversion_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_conversion_events_created_at" ON "conversion_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_lead_communications_lead_id" ON "lead_communications" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_lead_communications_channel" ON "lead_communications" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "idx_lead_communications_disposition" ON "lead_communications" USING btree ("disposition");--> statement-breakpoint
CREATE INDEX "idx_lead_communications_created_at" ON "lead_communications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_source" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_leads_interest_level" ON "leads" USING btree ("interest_level");--> statement-breakpoint
CREATE INDEX "idx_leads_business_type" ON "leads" USING btree ("business_type");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_scheduled_actions_lead_id" ON "scheduled_actions" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_scheduled_actions_scheduled_for" ON "scheduled_actions" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "idx_scheduled_actions_status" ON "scheduled_actions" USING btree ("status");