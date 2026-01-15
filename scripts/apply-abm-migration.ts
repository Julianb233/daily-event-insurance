
import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const migrationSQL = `
CREATE TABLE IF NOT EXISTS "abm_accounts" (
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

CREATE TABLE IF NOT EXISTS "abm_activities" (
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

CREATE TABLE IF NOT EXISTS "abm_contacts" (
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

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='priority_score') THEN
        ALTER TABLE "leads" ADD COLUMN "priority_score" integer DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='traffic_score') THEN
        ALTER TABLE "leads" ADD COLUMN "traffic_score" integer DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='is_franchise') THEN
        ALTER TABLE "leads" ADD COLUMN "is_franchise" boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='traffic_data') THEN
        ALTER TABLE "leads" ADD COLUMN "traffic_data" text;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='abm_activities_account_id_abm_accounts_id_fk') THEN
        ALTER TABLE "abm_activities" ADD CONSTRAINT "abm_activities_account_id_abm_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."abm_accounts"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='abm_activities_contact_id_abm_contacts_id_fk') THEN
        ALTER TABLE "abm_activities" ADD CONSTRAINT "abm_activities_contact_id_abm_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."abm_contacts"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='abm_contacts_account_id_abm_accounts_id_fk') THEN
        ALTER TABLE "abm_contacts" ADD CONSTRAINT "abm_contacts_account_id_abm_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."abm_accounts"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_abm_accounts_client_id" ON "abm_accounts" USING btree ("client_id");
CREATE INDEX IF NOT EXISTS "idx_abm_accounts_score" ON "abm_accounts" USING btree ("score");
CREATE INDEX IF NOT EXISTS "idx_abm_accounts_stage" ON "abm_accounts" USING btree ("stage");
CREATE INDEX IF NOT EXISTS "idx_abm_activities_account_id" ON "abm_activities" USING btree ("account_id");
CREATE INDEX IF NOT EXISTS "idx_abm_activities_contact_id" ON "abm_activities" USING btree ("contact_id");
CREATE INDEX IF NOT EXISTS "idx_abm_activities_timestamp" ON "abm_activities" USING btree ("timestamp");
CREATE INDEX IF NOT EXISTS "idx_abm_activities_type" ON "abm_activities" USING btree ("type");
CREATE INDEX IF NOT EXISTS "idx_abm_contacts_account_id" ON "abm_contacts" USING btree ("account_id");
CREATE INDEX IF NOT EXISTS "idx_abm_contacts_email" ON "abm_contacts" USING btree ("email");
`;

async function main() {
    console.log('Applying ABM Migration...');
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL);

    try {
        await sql.unsafe(migrationSQL);
        console.log('✅ ABM Tables created/verified.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

main();
